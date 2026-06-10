/* ============================================================================
   Integra el ASISTENTE VIRTUAL dentro de la web oficial del club
   ----------------------------------------------------------------------------
   Toma la página diseñada por el club (web-club-fuente.html), le aplica mejoras
   (un único menú responsive con enlaces correctos, sin la sección del Congreso)
   y le inyecta el asistente con el LOGO ORIGINAL del club. Genera:
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

/* Enlaces oficiales a los documentos del club (Google Sheets / Drive) */
const L = {
  ideario: "https://drive.google.com/drive/folders/0BxskfnPIuX9YU1VFem9Dcy1aTjQ?usp=sharing",
  cuotas: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTep5vuFaqHWpr_Y86Gypoom0gSOA-vPKODF47os-rLL5eh300OABcrtSdv4bh--5pp9WtUk36iFNAG/pubhtml?gid=1374414062&single=true",
  entrenos: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6VmFqMJzItjbnA8cCWYEo3K6CSpMQ5AMVMxlnPyZnWvQNJwe-uv5QtbmTuvv3BvPCRB-XBAElLEgn/pubhtml",
  horario: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSt-LUR4JlfVsa8c1GNYM0hDPNobHOI5VIJgl3MNtHfvUWQjf5b7DaTyj_L6tctOKmYazl2WC1YLAON/pubhtml",
  partidos: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTLEfEYHDObmqbKK1Y73tVUbXIxRWmyuykG4MeoABWpaG79R2F9p9BXAAtRSOrvfkRuL9Dl0_T9kugh/pubhtml",
  ropa: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRNjZlc2Jzg1QsDH3ABqg2dlszHWX4MtA8th_uBvPoXK8iDJGQbCLA49_6svjUs2gvIDTFdaPytiHkO/pubhtml?gid=842211522&single=true",
  torneos: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR0hQyGOrsmNqoDO_g7kfxt1DtcgxmQSq6qA8_7MD6fBBihWufZ56XDcRR0IvyjK_HNlE61COMz7L1U/pubhtml",
  ureca: "http://www.ureca.es"
};

/* Menú único y responsive (hamburguesa en móvil) con los enlaces correctos */
const NAVBAR =
'<nav class="navbar">\n' +
'  <div class="container nav-wrap">\n' +
'    <button class="nav-toggle" aria-label="Abrir menú" aria-expanded="false"><span></span><span></span><span></span></button>\n' +
'    <div class="nav-links" id="navLinks">\n' +
'      <a href="#inicio" class="nav-btn">Inicio</a>\n' +
'      <a href="#campus" class="nav-btn">Campus</a>\n' +
'      <a href="' + L.entrenos + '" target="_blank" rel="noopener" class="nav-btn">Entrenamientos</a>\n' +
'      <a href="' + L.partidos + '" target="_blank" rel="noopener" class="nav-btn">Partidos</a>\n' +
'      <a href="' + L.horario + '" target="_blank" rel="noopener" class="nav-btn">Horario Oficina</a>\n' +
'      <a href="' + L.cuotas + '" target="_blank" rel="noopener" class="nav-btn">Cuotas</a>\n' +
'      <a href="' + L.ropa + '" target="_blank" rel="noopener" class="nav-btn">Ropa Jugadores</a>\n' +
'      <a href="' + L.torneos + '" target="_blank" rel="noopener" class="nav-btn">Torneos</a>\n' +
'      <a href="' + L.ideario + '" target="_blank" rel="noopener" class="nav-btn">Ideario & RRI</a>\n' +
'      <a href="#xogade" class="nav-btn">Protocolo Xogade</a>\n' +
'      <a href="' + L.ureca + '" target="_blank" rel="noopener" class="nav-btn">Instalaciones</a>\n' +
'      <a href="#socio" class="nav-btn highlight">¡Hazte Socio!</a>\n' +
'      <a href="#" class="nav-btn asist" data-abrir-asistente>💬 Asistente</a>\n' +
'    </div>\n' +
'  </div>\n' +
'</nav>';

/* CSS de las mejoras (menú responsive + ajustes móviles) */
const MEJORAS_CSS =
'<style id="edvm-mejoras">\n' +
'.nav-wrap{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:12px;position:relative;}\n' +
'.nav-links{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;}\n' +
'.nav-toggle{display:none;flex-direction:column;gap:5px;background:linear-gradient(90deg,var(--red-primary),var(--red-dark));border:none;border-radius:8px;padding:13px 16px;cursor:pointer;}\n' +
'.nav-toggle span{display:block;width:24px;height:3px;background:#fff;border-radius:2px;transition:.3s;}\n' +
'.nav-btn.asist{background:#111;color:#fff;}\n' +
'.nav-btn.asist:hover{background:#000;color:#fff;border-color:#111;}\n' +
'@media (max-width:900px){\n' +
'  .nav-toggle{display:flex;}\n' +
'  .nav-links{display:none;flex-direction:column;width:100%;margin-top:14px;gap:8px;}\n' +
'  .nav-links.open{display:flex;}\n' +
'  .nav-links .nav-btn{width:100%;justify-content:center;padding:14px;font-size:13px;}\n' +
'  .nav-toggle[aria-expanded="true"] span:nth-child(1){transform:translateY(8px) rotate(45deg);}\n' +
'  .nav-toggle[aria-expanded="true"] span:nth-child(2){opacity:0;}\n' +
'  .nav-toggle[aria-expanded="true"] span:nth-child(3){transform:translateY(-8px) rotate(-45deg);}\n' +
'}\n' +
'/* Ajustes generales para móvil */\n' +
'@media (max-width:768px){\n' +
'  .top-bar{padding:28px 0;}\n' +
'  .club-logo-img{width:104px;height:104px;}\n' +
'  .club-title{font-size:26px;letter-spacing:-1px;}\n' +
'  .club-subtitle{font-size:14px;letter-spacing:2px;}\n' +
'  section{padding:55px 0;}\n' +
'  .section-title{font-size:27px;}\n' +
'  .section-header{margin-bottom:38px;}\n' +
'  .card{padding:30px 22px;}\n' +
'  .table-wrapper{overflow-x:auto;}\n' +
'  table{min-width:480px;}\n' +
'  .cta-banner{padding:45px 24px;}\n' +
'  .cta-text h2{font-size:30px;}\n' +
'  .cta-prices{min-width:0;width:100%;padding:28px;}\n' +
'  .office-grid{grid-template-columns:repeat(2,1fr);}\n' +
'  footer{padding:50px 0 25px;}\n' +
'}\n' +
'@media (max-width:420px){ .office-grid{grid-template-columns:1fr;} .club-title{font-size:22px;} }\n' +
'/* Mejoras de diseño (respetando la identidad del club) */\n' +
'.top-bar{background:linear-gradient(180deg,#fff6f6 0%,#ffffff 72%)!important;position:relative;overflow:hidden;}\n' +
'.top-bar::before{content:"";position:absolute;top:-150px;left:50%;transform:translateX(-50%);width:480px;height:480px;background:radial-gradient(circle,rgba(211,47,47,.11),transparent 70%);pointer-events:none;}\n' +
'.header-content{position:relative;z-index:1;}\n' +
'.club-logo-img{border:4px solid #fff;box-shadow:0 14px 34px rgba(211,47,47,.3);}\n' +
'.header-tagline{max-width:620px;margin:14px auto 0;color:var(--text-muted);font-weight:600;font-size:16px;}\n' +
'.navbar{box-shadow:0 3px 16px rgba(0,0,0,.06);}\n' +
'.nav-btn{border:1px solid var(--grey-border);}\n' +
'.section-badge{box-shadow:0 4px 12px rgba(211,47,47,.08);}\n' +
'.card{border-radius:14px;}\n' +
'.cta-banner{position:relative;overflow:hidden;}\n' +
'.cta-banner::after{content:"";position:absolute;top:-60px;right:-60px;width:240px;height:240px;background:radial-gradient(circle,rgba(255,255,255,.12),transparent 70%);pointer-events:none;}\n' +
'/* Banner del asistente */\n' +
'.edvm-ask-cta{background:linear-gradient(135deg,#161616,#2d2d2d);padding:58px 0;}\n' +
'.edvm-ask-in{display:flex;align-items:center;justify-content:space-between;gap:30px;flex-wrap:wrap;}\n' +
'.edvm-ask-txt h2{color:#fff;font-size:30px;font-weight:900;margin-bottom:8px;}\n' +
'.edvm-ask-txt p{color:rgba(255,255,255,.82);max-width:560px;font-size:16px;}\n' +
'.edvm-ask-btn{background:linear-gradient(90deg,var(--red-primary),var(--red-dark));color:#fff;border:none;font-family:"Montserrat",sans-serif;font-weight:800;font-size:15px;text-transform:uppercase;letter-spacing:.5px;padding:18px 32px;border-radius:10px;cursor:pointer;box-shadow:0 8px 22px rgba(211,47,47,.4);transition:transform .25s,box-shadow .25s;white-space:nowrap;}\n' +
'.edvm-ask-btn:hover{transform:translateY(-3px);box-shadow:0 12px 28px rgba(211,47,47,.55);}\n' +
'@media(max-width:768px){.edvm-ask-in{flex-direction:column;text-align:center;}.edvm-ask-txt h2{font-size:25px;}}\n' +
'</style>\n</head>';

/* ---- Aplica las mejoras a la página del club ---- */
function aplicarMejoras(html) {
  // 1) CSS de las mejoras
  html = html.replace("</head>", MEJORAS_CSS);
  // 2) Menú único responsive (reemplaza el navbar original)
  html = html.replace(/<nav class="navbar">[\s\S]*?<\/nav>/, NAVBAR);
  // 3) Eliminar la sección del I Congreso de Entrenadores
  html = html.replace(/<section id="congreso">[\s\S]*?<\/section>/, "");
  // 4) Lema (una sola línea de texto) bajo el subtítulo de la cabecera
  var subt = '<h2 class="club-subtitle">Desde 1996 · Nigrán</h2>';
  if (html.indexOf(subt) !== -1) {
    html = html.replace(subt, subt + '\n        <p class="header-tagline">Escuela de fútbol base · cerca de 30 equipos · referente del Val Miñor y Galicia.</p>');
  }
  // 5) Banner que invita a usar el asistente (antes del pie)
  var banner =
    '<section class="edvm-ask-cta">\n' +
    '  <div class="container edvm-ask-in">\n' +
    '    <div class="edvm-ask-txt"><h2>¿Tienes alguna duda? 🤔</h2>' +
    '<p>Nuestro <strong>Asistente Virtual</strong> te responde al instante: campus, inscripciones, cuotas, socios, camisetas, instalaciones y mucho más.</p></div>\n' +
    '    <button type="button" class="edvm-ask-btn" data-abrir-asistente>💬 Pregúntale al asistente</button>\n' +
    '  </div>\n' +
    '</section>\n';
  html = html.replace("<footer>", banner + "<footer>");
  return html;
}

/* ---- Bloque del asistente + scripts (se inyecta antes de </body>) ---- */
const INIT_JS =
  "<script>\n" +
  "var edvmWidget = EDVMChat.iniciarWidget();\n" +
  "document.querySelectorAll('[data-abrir-asistente]').forEach(function(b){" +
  "b.addEventListener('click',function(e){e.preventDefault();if(edvmWidget&&edvmWidget.abrir)edvmWidget.abrir();});});\n" +
  "(function(){var t=document.querySelector('.nav-toggle'),nl=document.getElementById('navLinks');" +
  "if(t&&nl){t.addEventListener('click',function(){var o=nl.classList.toggle('open');t.setAttribute('aria-expanded',o);});" +
  "nl.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){nl.classList.remove('open');t.setAttribute('aria-expanded','false');});});}})();\n" +
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
  return aplicarMejoras(paginaBase).replace("</body>", assets + "\n</body>");
}

fs.writeFileSync(path.join(RAIZ, "asistente-edvm.html"), construir(assetsInline), "utf8");
fs.writeFileSync(path.join(RAIZ, "index.html"), construir(assetsExternal), "utf8");
console.log("Generado: asistente-edvm.html (1 archivo) e index.html (modular)");
