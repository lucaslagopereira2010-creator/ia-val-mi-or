/* ============================================================================
   Integra el ASISTENTE VIRTUAL dentro de la web oficial del club
   ----------------------------------------------------------------------------
   Toma la página diseñada por el club (web-club-fuente.html), le aplica unas
   mejoras y le inyecta el asistente (con el LOGO ORIGINAL del club). Genera:
     • asistente-edvm.html  -> web + asistente en UN solo archivo (todo incluido)
     • index.html           -> la misma web, enlazando los archivos de /asistente

   Ejecutar:  node build-standalone.js
   ============================================================================ */

const fs = require("fs");
const path = require("path");

const RAIZ = __dirname;
const leer = (p) => fs.readFileSync(path.join(RAIZ, p), "utf8");

const paginaBase = leer("web-club-fuente.html");
const css = leer("asistente/edvm-chat.css");
const kb = leer("asistente/base-conocimiento.js");
const motor = leer("asistente/edvm-chat.js");

// Logo ORIGINAL del club (extraído de la propia web del club) como data URI
const logoB64 = fs.readFileSync(path.join(RAIZ, "asistente/logo-original.jpg")).toString("base64");
const logoDataUri = "data:image/jpeg;base64," + logoB64;

/* ---- Mejoras sobre la página del club (sin tocar su identidad) ---- */
function aplicarMejoras(html) {
  // 1) Estilos de las mejoras (CTAs de cabecera + botón "Asistente" del menú)
  const estilos =
    '<style id="edvm-mejoras">\n' +
    '.header-tagline{font-size:16px;color:var(--text-muted);max-width:620px;margin:8px auto 0;font-weight:600;}\n' +
    '.header-ctas{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:26px;}\n' +
    '.hbtn{font-family:"Montserrat",sans-serif;font-weight:800;font-size:13px;text-transform:uppercase;letter-spacing:.5px;padding:14px 26px;border-radius:8px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all .3s;}\n' +
    '.hbtn-red{background:linear-gradient(90deg,var(--red-primary),var(--red-dark));color:#fff;box-shadow:0 4px 12px rgba(211,47,47,.3);}\n' +
    '.hbtn-red:hover{transform:translateY(-3px);box-shadow:0 8px 18px rgba(211,47,47,.45);}\n' +
    '.hbtn-out{background:#fff;color:var(--red-primary);border:2px solid var(--red-primary);}\n' +
    '.hbtn-out:hover{background:var(--red-bg);transform:translateY(-3px);}\n' +
    '.hbtn-dark{background:#111;color:#fff;}\n' +
    '.hbtn-dark:hover{background:#000;transform:translateY(-3px);}\n' +
    '.nav-btn.asist{background:#111;color:#fff;}\n' +
    '.nav-btn.asist:hover{background:#000;color:#fff;border-color:#111;}\n' +
    '</style>\n</head>';
  html = html.replace("</head>", estilos);

  // 2) Lema + botones de acción bajo el subtítulo de la cabecera
  const subt = '<h2 class="club-subtitle">Desde 1996 · Nigrán</h2>';
  const ctas =
    subt + '\n' +
    '        <p class="header-tagline">Escuela de fútbol base · cerca de 30 equipos · referente del Val Miñor y Galicia.</p>\n' +
    '        <div class="header-ctas">\n' +
    '          <a href="#socio" class="hbtn hbtn-red">🤝 Hazte socio</a>\n' +
    '          <a href="#campus" class="hbtn hbtn-out">⚽ Campus de verano</a>\n' +
    '          <a href="#" class="hbtn hbtn-dark" data-abrir-asistente>💬 Pregunta al asistente</a>\n' +
    '        </div>';
  if (html.indexOf(subt) !== -1) html = html.replace(subt, ctas);

  // 3) Botón "Asistente" en el menú de navegación
  const torneos = '<a href="#torneos" class="nav-btn">Torneos</a>';
  if (html.indexOf(torneos) !== -1) {
    html = html.replace(torneos, torneos + '\n        <a href="#" class="nav-btn asist" data-abrir-asistente>💬 Asistente</a>');
  }
  return html;
}

/* ---- Bloque del asistente que se inyecta antes de </body> ---- */
const INIT_JS =
  "<script>\n" +
  "var edvmWidget = EDVMChat.iniciarWidget();\n" +
  "document.querySelectorAll('[data-abrir-asistente]').forEach(function(b){" +
  "b.addEventListener('click',function(e){e.preventDefault();if(edvmWidget&&edvmWidget.abrir)edvmWidget.abrir();});});\n" +
  "</script>";

function configJs(logoUrl) {
  return '<script>window.EDVM_CONFIG = { apiEndpoint: "", titulo: "E.D. Val Mi\\u00f1or", ' +
    'subtitulo: "Asistente oficial \\u00b7 En l\\u00ednea", logoUrl: "' + logoUrl + '" };</script>';
}

const assetsInline =
  "<style>\n" + css + "\n</style>\n" +
  configJs(logoDataUri) + "\n" +
  "<script>\n/* base-conocimiento.js */\n" + kb + "\n</script>\n" +
  "<script>\n/* edvm-chat.js */\n" + motor + "\n</script>\n" +
  INIT_JS;

const assetsExternal =
  '<link rel="stylesheet" href="asistente/edvm-chat.css">\n' +
  configJs("asistente/logo-original.jpg") + "\n" +
  '<script src="asistente/base-conocimiento.js"></script>\n' +
  '<script src="asistente/edvm-chat.js"></script>\n' +
  INIT_JS;

function construir(assets) {
  let html = aplicarMejoras(paginaBase);
  return html.replace("</body>", assets + "\n</body>");
}

fs.writeFileSync(path.join(RAIZ, "asistente-edvm.html"), construir(assetsInline), "utf8");
fs.writeFileSync(path.join(RAIZ, "index.html"), construir(assetsExternal), "utf8");
console.log("Generado: asistente-edvm.html (1 archivo) e index.html (modular)");
