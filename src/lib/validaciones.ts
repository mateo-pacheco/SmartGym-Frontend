/* Validaciones de formato reutilizables por los formularios contra la API.
   Un deportistaId/usuarioId/profesionalId es siempre un UUID de un usuario ya
   existente: enviar texto libre provocaba 5xx del backend por clave foránea. */

export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export const UUID_MSG =
  'Debe ser un UUID válido (no un nombre). Cópialo de un registro existente.'
