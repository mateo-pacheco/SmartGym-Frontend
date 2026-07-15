import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import yaml from 'js-yaml'
import ts from 'typescript'

const HTTP_METHODS = new Set(['get', 'post', 'put', 'patch', 'delete'])
const openApiFile = process.argv[2]

if (!openApiFile) {
  console.error('Uso: npm run contract:verify -- <ruta/openapi.yaml>')
  process.exit(2)
}

const specification = yaml.load(fs.readFileSync(path.resolve(openApiFile), 'utf8'))
const endpointFile = path.resolve('src/services/api/endpoints.ts')
const endpointSource = fs.readFileSync(endpointFile, 'utf8')
const sourceFile = ts.createSourceFile(
  endpointFile,
  endpointSource,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS,
)

function templatePath(node) {
  if (ts.isStringLiteralLike(node)) return node.text
  if (!ts.isTemplateExpression(node)) return null

  let result = node.head.text
  for (const span of node.templateSpans) {
    result += `{${span.expression.getText(sourceFile)}}${span.literal.text}`
  }
  return result
}

function normalize(operation) {
  return operation.replace(/\{[^}]+\}/g, '{}')
}

/* Transportes del cliente que representan una operación del contrato:
   - request(): JSON.
   - descargarArchivo(): binario (reportes PDF/Excel); siempre GET. */
const TRANSPORTES = new Set(['request', 'descargarArchivo'])

const clientOperations = []
function visit(node) {
  if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && TRANSPORTES.has(node.expression.text)) {
    const apiPath = templatePath(node.arguments[0])
    let method = 'GET'
    const options = node.arguments[1]

    if (options && ts.isObjectLiteralExpression(options)) {
      for (const property of options.properties) {
        if (
          ts.isPropertyAssignment(property) &&
          property.name.getText(sourceFile) === 'method' &&
          ts.isStringLiteralLike(property.initializer)
        ) {
          method = property.initializer.text.toUpperCase()
        }
      }
    }

    if (apiPath) clientOperations.push(`${method} ${apiPath}`)
  }
  ts.forEachChild(node, visit)
}
visit(sourceFile)

const contractOperations = []
for (const [apiPath, pathItem] of Object.entries(specification.paths ?? {})) {
  for (const method of Object.keys(pathItem)) {
    if (HTTP_METHODS.has(method.toLowerCase())) {
      contractOperations.push(`${method.toUpperCase()} ${apiPath}`)
    }
  }
}

const client = new Set(clientOperations.map(normalize))
const contract = new Set(contractOperations.map(normalize))
const missing = [...contract].filter((operation) => !client.has(operation)).sort()
const extra = [...client].filter((operation) => !contract.has(operation)).sort()

console.log(`Contrato: ${contract.size} operaciones`)
console.log(`Cliente:  ${client.size} operaciones`)

if (missing.length || extra.length) {
  if (missing.length) console.error(`Faltan en el cliente:\n${missing.join('\n')}`)
  if (extra.length) console.error(`Fuera del contrato:\n${extra.join('\n')}`)
  process.exit(1)
}

console.log('Cobertura OpenAPI del cliente: 100%')
