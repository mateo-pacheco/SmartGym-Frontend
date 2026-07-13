import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import yaml from 'js-yaml'

const HTTP_METHODS = new Set(['get', 'post', 'put', 'patch', 'delete'])
const [openApiFile, baseUrl] = process.argv.slice(2)

if (!openApiFile || !baseUrl) {
  console.error('Uso: npm run contract:smoke -- <openapi.yaml> <base-url>')
  process.exit(2)
}

const specification = yaml.load(fs.readFileSync(path.resolve(openApiFile), 'utf8'))
const token = process.env.SMARTGYM_ACCESS_TOKEN
const zeroUuid = '00000000-0000-0000-0000-000000000000'

function parameterValue(parameter) {
  const schema = parameter.schema ?? {}
  if (parameter.example !== undefined) return parameter.example
  if (schema.example !== undefined) return schema.example
  if (schema.default !== undefined) return schema.default
  if (schema.enum?.length) return schema.enum[0]
  if (schema.format === 'uuid') return zeroUuid
  if (schema.format === 'date') return new Date().toISOString().slice(0, 10)
  if (schema.type === 'integer' || schema.type === 'number') return 1
  return zeroUuid
}

function buildUrl(apiPath, pathItem, operation) {
  const parameters = [...(pathItem.parameters ?? []), ...(operation.parameters ?? [])]
  let resolvedPath = apiPath
  const query = new URLSearchParams()

  for (const parameter of parameters) {
    if (!parameter?.name || !parameter.in) continue
    const value = String(parameterValue(parameter))
    if (parameter.in === 'path') resolvedPath = resolvedPath.replace(`{${parameter.name}}`, encodeURIComponent(value))
    if (parameter.in === 'query' && parameter.required) query.set(parameter.name, value)
  }

  resolvedPath = resolvedPath.replace(/\{[^}]+\}/g, zeroUuid)
  const suffix = query.size ? `?${query}` : ''
  return `${baseUrl.replace(/\/$/, '')}${resolvedPath}${suffix}`
}

const checks = []
for (const [apiPath, pathItem] of Object.entries(specification.paths ?? {})) {
  for (const [methodName, operation] of Object.entries(pathItem)) {
    if (!HTTP_METHODS.has(methodName.toLowerCase())) continue
    checks.push({ apiPath, pathItem, operation, method: methodName.toUpperCase() })
  }
}

const results = []
let nextCheck = 0

async function worker() {
  while (nextCheck < checks.length) {
    const check = checks[nextCheck++]
    const { apiPath, pathItem, operation, method } = check
    const headers = { Accept: 'application/json' }
    if (token) headers.Authorization = `Bearer ${token}`

    const options = { method, headers, redirect: 'manual' }
    if (['POST', 'PUT', 'PATCH'].includes(method) && operation.requestBody) {
      headers['Content-Type'] = 'text/plain'
      options.body = '{}'
    }

    try {
      const response = await fetch(buildUrl(apiPath, pathItem, operation), options)
      const available = response.status < 500 && response.status !== 405
      results.push({ operation: `${method} ${apiPath}`, status: response.status, available })
    } catch (error) {
      results.push({ operation: `${method} ${apiPath}`, status: 'NETWORK', available: false, error: error.message })
    }
  }
}

await Promise.all(Array.from({ length: 8 }, () => worker()))

const failures = results.filter((result) => !result.available)
const distribution = Object.groupBy(results, (result) => String(result.status))

console.log(`Operaciones verificadas: ${results.length}`)
console.log(
  `Estados: ${Object.entries(distribution)
    .map(([status, entries]) => `${status}=${entries.length}`)
    .join(', ')}`,
)

if (failures.length) {
  for (const failure of failures) console.error(`${failure.operation} -> ${failure.status}`)
  process.exit(1)
}

console.log('Todas las rutas del contrato están disponibles; no hubo 5xx ni métodos ausentes.')
