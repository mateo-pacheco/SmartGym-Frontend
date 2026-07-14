// Evita el flash de tema: aplica la preferencia guardada antes del primer paint.
// Externalizado del index.html para permitir una CSP estricta (script-src 'self').
(function () {
  try {
    var saved = localStorage.getItem('sg-theme')
    var theme =
      saved === 'dark' || saved === 'light'
        ? saved
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
    document.documentElement.setAttribute('data-theme', theme)
  } catch (e) {
    /* sin acceso a storage: se mantiene el tema claro */
  }
})()
