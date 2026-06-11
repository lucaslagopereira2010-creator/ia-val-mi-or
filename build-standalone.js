/* ============================================================================
   Integra el ASISTENTE VIRTUAL dentro de la web oficial del club + mejoras
   ----------------------------------------------------------------------------
   - Menú único responsive (hamburguesa en móvil, abierto por defecto) con
     enlaces a los documentos oficiales.
   - Secciones añadidas desde la web oficial: Quiénes somos, Instalaciones y
     Contacto. Sin la sección del Congreso.
   - Favicon + Open Graph/Twitter + meta descripción (compartir y SEO).
   - "Vida" con el ESCUDO REAL del club como marca de agua y degradados
     (no se usa ninguna foto inventada).
   - Asistente con el LOGO ORIGINAL del club.

   Genera:  asistente-edvm.html (1 archivo)  e  index.html (modular)
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

const logoB64 = fs.readFileSync(path.join(RAIZ, "asistente/logo-original.jpg")).toString("base64");
const logoDataUri = "data:image/jpeg;base64," + logoB64;

/* URL pública (GitHub Pages) para la vista previa al compartir */
const SITE_URL = "https://lucaslagopereira2010-creator.github.io/ia-val-mi-or/";

/* Enlaces oficiales a los documentos del club */
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

/* Menú único y responsive con los enlaces correctos */
const NAVBAR =
'<noscript><div class="edvm-noscript">⚠️ Para usar el asistente virtual y el menú, abre esta página en un navegador (Chrome, Safari…) con JavaScript activado.</div></noscript>\n' +
'<nav class="navbar">\n' +
'  <div class="container nav-wrap">\n' +
'    <input type="checkbox" id="edvmNav" class="nav-chk">\n' +
'    <label for="edvmNav" class="nav-toggle" aria-label="Abrir o cerrar el menú"><span></span><span></span><span></span></label>\n' +
'    <div class="nav-links" id="navLinks">\n' +
'      <a href="#inicio" class="nav-btn">Inicio</a>\n' +
'      <a href="#sobre" class="nav-btn">El Club</a>\n' +
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
'      <a href="#contacto" class="nav-btn">Contacto</a>\n' +
'      <a href="#socio" class="nav-btn highlight">¡Hazte Socio!</a>\n' +
'      <a href="#" class="nav-btn asist" data-abrir-asistente>💬 Asistente</a>\n' +
'    </div>\n' +
'  </div>\n' +
'</nav>';

/* Sección "Quiénes somos" (datos reales de la web oficial) */
const SOBRE =
'<section id="sobre" class="bg-alt edvm-sec">\n' +
'  <div class="container">\n' +
'    <div class="section-header"><span class="section-badge">Quiénes somos</span><h2 class="section-title">El motor del fútbol base del Val Miñor</h2></div>\n' +
'    <div class="edvm-sobre-grid">\n' +
'      <div class="edvm-sobre-txt">\n' +
'        <p>La <strong>Escuela Deportiva Val Miñor Nigrán</strong> es una institución histórica dedicada a la formación de jóvenes deportistas desde <strong>1996</strong>. Somos el gran referente formativo de la comarca, desde los primeros toques al balón (biberones) hasta la etapa de aficionados.</p>\n' +
'        <p>Nuestro trabajo se sustenta en un firme <strong>Ideario y Reglamento de Régimen Interno (RRI)</strong>. El terreno de juego es un aula más donde enseñamos respeto, compromiso y trabajo en equipo. <strong>Nuestro objetivo es formar excelentes personas, no solo futbolistas.</strong></p>\n' +
'        <div class="edvm-chips">\n' +
'          <span class="edvm-chip">⚽ +27 equipos base</span>\n' +
'          <span class="edvm-chip">🎓 Formación en valores</span>\n' +
'          <span class="edvm-chip">📋 Ideario & RRI oficial</span>\n' +
'          <span class="edvm-chip">⭐ 4,5/5 en Google</span>\n' +
'          <span class="edvm-chip">🏟️ Orgullo de Nigrán</span>\n' +
'        </div>\n' +
'      </div>\n' +
'      <div class="edvm-kpis">\n' +
'        <div class="edvm-kpi"><span class="n">1996</span><span class="l">Fundación</span></div>\n' +
'        <div class="edvm-kpi"><span class="n">+27</span><span class="l">Equipos</span></div>\n' +
'        <div class="edvm-kpi"><span class="n">+300</span><span class="l">Jugadores</span></div>\n' +
'        <div class="edvm-kpi"><span class="n">+30</span><span class="l">Años</span></div>\n' +
'      </div>\n' +
'    </div>\n' +
'  </div>\n' +
'</section>\n';

/* Sección "Nuestras Instalaciones" (datos reales de la web oficial) */
const INSTAL =
'<section id="instalaciones-sec" class="edvm-sec">\n' +
'  <div class="container">\n' +
'    <div class="section-header"><span class="section-badge">Nuestro terreno de juego</span><h2 class="section-title">Nuestras Instalaciones</h2></div>\n' +
'    <div class="grid-3">\n' +
'      <div class="card"><div class="card-icon">🏟️</div><h3>Campo Municipal de Nigrán</h3><p>Nuestro campo base, donde disputamos los partidos oficiales como local cada fin de semana.</p></div>\n' +
'      <div class="card"><div class="card-icon">🏫</div><h3>Complejo Deportivo URECA</h3><p>Sede de la oficina, epicentro de los entrenamientos entre semana y del Campus de Verano.</p></div>\n' +
'      <div class="card"><div class="card-icon">🎟️</div><h3>Taquilla Condomínguez</h3><p>Punto de atención los días de partido y recogida de los carnets de socios.</p></div>\n' +
'    </div>\n' +
'  </div>\n' +
'</section>\n';

/* Sección "Contacto" (datos reales) */
const CONTACTO =
'<section id="contacto" class="bg-alt edvm-sec">\n' +
'  <div class="container">\n' +
'    <div class="section-header"><span class="section-badge">Estamos a tu disposición</span><h2 class="section-title">Contacto</h2></div>\n' +
'    <div class="edvm-contact-grid">\n' +
'      <div class="edvm-ci"><span class="i">✉️</span><div><div class="l">Email (vía principal)</div><div class="v"><a href="mailto:info@edvmnigran.com">info@edvmnigran.com</a></div></div></div>\n' +
'      <div class="edvm-ci"><span class="i">📱</span><div><div class="l">WhatsApp / Teléfono</div><div class="v"><a href="https://wa.me/34610186460">610 186 460</a></div></div></div>\n' +
'      <div class="edvm-ci"><span class="i">👤</span><div><div class="l">Entrenadores y competición</div><div class="v">José Tizón · 627 50 55 13</div></div></div>\n' +
'      <div class="edvm-ci"><span class="i">📍</span><div><div class="l">Dirección</div><div class="v">Rúa Manuel Lemos, 124 · 36379 Nigrán</div></div></div>\n' +
'      <div class="edvm-ci"><span class="i">📸</span><div><div class="l">Instagram</div><div class="v"><a href="https://www.instagram.com/edvalminor/" target="_blank" rel="noopener">@edvalminor</a></div></div></div>\n' +
'      <div class="edvm-ci"><span class="i">💳</span><div><div class="l">Cuenta ABANCA</div><div class="v edvm-iban">ES60 2080 5052 1430 4002 1652</div></div></div>\n' +
'    </div>\n' +
'    <div class="edvm-contact-btns">\n' +
'      <a href="mailto:info@edvmnigran.com" class="edvm-cbtn red">✉ Enviar email</a>\n' +
'      <a href="https://wa.me/34610186460" target="_blank" rel="noopener" class="edvm-cbtn dark">💬 WhatsApp</a>\n' +
'    </div>\n' +
'  </div>\n' +
'</section>\n';

/* CSS de las mejoras */
const MEJORAS_CSS =
'<style id="edvm-mejoras">\n' +
/* ---- Menú responsive ---- */
'.nav-wrap{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:12px;position:relative;}\n' +
'.nav-chk{position:absolute;opacity:0;width:1px;height:1px;pointer-events:none;}\n' +
'.nav-links{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;}\n' +
'.nav-toggle{display:none;flex-direction:column;gap:5px;background:linear-gradient(90deg,var(--red-primary),var(--red-dark));border:none;border-radius:8px;padding:13px 18px;cursor:pointer;}\n' +
'.nav-toggle span{display:block;width:26px;height:3px;background:#fff;border-radius:2px;transition:.3s;}\n' +
'.nav-btn.asist{background:#111;color:#fff;}\n' +
'.nav-btn.asist:hover{background:#000;color:#fff;border-color:#111;}\n' +
'.edvm-noscript{background:#fff3cd;color:#856404;padding:12px 16px;text-align:center;font-size:14px;font-weight:700;}\n' +
'@media (max-width:900px){\n' +
'  .navbar{position:static;}\n' +
'  .nav-wrap{flex-direction:column;}\n' +
'  .nav-toggle{display:flex;}\n' +
'  .nav-links{display:none;flex-direction:column;width:100%;margin-top:12px;gap:8px;}\n' +
'  .nav-chk:checked ~ .nav-links{display:flex;}\n' +
'  .nav-chk:checked ~ .nav-toggle span:nth-child(1){transform:translateY(8px) rotate(45deg);}\n' +
'  .nav-chk:checked ~ .nav-toggle span:nth-child(2){opacity:0;}\n' +
'  .nav-chk:checked ~ .nav-toggle span:nth-child(3){transform:translateY(-8px) rotate(-45deg);}\n' +
'  .nav-links .nav-btn{width:100%;justify-content:center;padding:14px;font-size:13px;}\n' +
'}\n' +
/* ---- Ajustes móvil ---- */
'@media (max-width:768px){\n' +
'  .top-bar{padding:28px 0;} .club-logo-img{width:104px;height:104px;} .club-title{font-size:26px;letter-spacing:-1px;}\n' +
'  .club-subtitle{font-size:14px;letter-spacing:2px;} section{padding:55px 0;} .section-title{font-size:27px;}\n' +
'  .section-header{margin-bottom:38px;} .card{padding:30px 22px;} .table-wrapper{overflow-x:auto;} table{min-width:480px;}\n' +
'  .cta-banner{padding:45px 24px;} .cta-text h2{font-size:30px;} .cta-prices{min-width:0;width:100%;padding:28px;}\n' +
'  .office-grid{grid-template-columns:repeat(2,1fr);} footer{padding:50px 0 25px;}\n' +
'}\n' +
'@media (max-width:420px){ .office-grid{grid-template-columns:1fr;} .club-title{font-size:22px;} }\n' +
/* ---- Diseño / vida ---- */
'.top-bar{background:linear-gradient(180deg,#fff6f6 0%,#ffffff 72%)!important;position:relative;overflow:hidden;}\n' +
'.top-bar::before{content:"";position:absolute;top:-150px;left:50%;transform:translateX(-50%);width:480px;height:480px;background:radial-gradient(circle,rgba(211,47,47,.11),transparent 70%);pointer-events:none;z-index:0;}\n' +
'.edvm-bg-logo{position:absolute;top:50%;left:50%;width:560px;height:560px;max-width:130%;transform:translate(-50%,-50%);object-fit:contain;opacity:.05;pointer-events:none;z-index:0;}\n' +
'.header-content{position:relative;z-index:1;}\n' +
'.club-logo-img{border:4px solid #fff;box-shadow:0 14px 34px rgba(211,47,47,.3);}\n' +
'.header-tagline{max-width:620px;margin:14px auto 0;color:var(--text-muted);font-weight:600;font-size:16px;position:relative;z-index:1;}\n' +
'.navbar{box-shadow:0 3px 16px rgba(0,0,0,.06);}\n' +
'.nav-btn{border:1px solid var(--grey-border);}\n' +
'.section-badge{box-shadow:0 4px 12px rgba(211,47,47,.08);}\n' +
'.card{border-radius:14px;} .card-icon{font-size:32px;}\n' +
'.cta-banner{position:relative;overflow:hidden;}\n' +
'.cta-banner::after{content:"";position:absolute;top:-60px;right:-60px;width:240px;height:240px;background:radial-gradient(circle,rgba(255,255,255,.12),transparent 70%);pointer-events:none;}\n' +
/* ---- Quiénes somos ---- */
'.edvm-sobre-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:40px;align-items:center;}\n' +
'.edvm-sobre-txt p{color:var(--text-muted);margin-bottom:16px;font-size:16px;}\n' +
'.edvm-chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px;}\n' +
'.edvm-chip{background:var(--red-bg);border:1px solid #ffcdd2;color:var(--red-dark);padding:8px 15px;border-radius:30px;font-size:13px;font-weight:700;}\n' +
'.edvm-kpis{display:grid;grid-template-columns:1fr 1fr;gap:16px;}\n' +
'.edvm-kpi{background:linear-gradient(135deg,var(--red-primary),var(--red-dark));color:#fff;border-radius:14px;padding:26px 18px;text-align:center;box-shadow:0 12px 26px -8px rgba(211,47,47,.5);}\n' +
'.edvm-kpi .n{display:block;font-family:"Montserrat",sans-serif;font-weight:900;font-size:34px;line-height:1;}\n' +
'.edvm-kpi .l{display:block;font-size:12px;text-transform:uppercase;letter-spacing:1px;opacity:.9;margin-top:6px;}\n' +
'@media(max-width:860px){.edvm-sobre-grid{grid-template-columns:1fr;gap:26px;}}\n' +
/* ---- Contacto ---- */
'.edvm-contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}\n' +
'.edvm-ci{display:flex;gap:14px;align-items:flex-start;background:#fff;border:1px solid var(--grey-border);border-radius:12px;padding:18px 20px;box-shadow:var(--shadow-sm);}\n' +
'.edvm-ci .i{font-size:22px;}\n' +
'.edvm-ci .l{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);font-weight:800;}\n' +
'.edvm-ci .v{font-weight:700;font-size:15px;} .edvm-ci .v a{color:var(--red-primary);}\n' +
'.edvm-iban{font-family:monospace;color:var(--red-primary);font-weight:700;}\n' +
'.edvm-contact-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:28px;}\n' +
'.edvm-cbtn{font-family:"Montserrat",sans-serif;font-weight:800;font-size:14px;text-transform:uppercase;letter-spacing:.5px;padding:15px 28px;border-radius:10px;color:#fff;}\n' +
'.edvm-cbtn.red{background:linear-gradient(90deg,var(--red-primary),var(--red-dark));box-shadow:0 8px 20px rgba(211,47,47,.35);}\n' +
'.edvm-cbtn.dark{background:#111;}\n' +
'.edvm-cbtn:hover{transform:translateY(-2px);}\n' +
'@media(max-width:600px){.edvm-contact-grid{grid-template-columns:1fr;}}\n' +
/* ---- Banner del asistente ---- */
'.edvm-ask-cta{background:linear-gradient(135deg,#161616,#2d2d2d);padding:58px 0;}\n' +
'.edvm-ask-in{display:flex;align-items:center;justify-content:space-between;gap:30px;flex-wrap:wrap;}\n' +
'.edvm-ask-txt h2{color:#fff;font-size:30px;font-weight:900;margin-bottom:8px;}\n' +
'.edvm-ask-txt p{color:rgba(255,255,255,.82);max-width:560px;font-size:16px;}\n' +
'.edvm-ask-btn{background:linear-gradient(90deg,var(--red-primary),var(--red-dark));color:#fff;border:none;font-family:"Montserrat",sans-serif;font-weight:800;font-size:15px;text-transform:uppercase;letter-spacing:.5px;padding:18px 32px;border-radius:10px;cursor:pointer;box-shadow:0 8px 22px rgba(211,47,47,.4);transition:transform .25s,box-shadow .25s;white-space:nowrap;}\n' +
'.edvm-ask-btn:hover{transform:translateY(-3px);box-shadow:0 12px 28px rgba(211,47,47,.55);}\n' +
'@media(max-width:768px){.edvm-ask-in{flex-direction:column;text-align:center;}.edvm-ask-txt h2{font-size:25px;}}\n' +
'</style>\n</head>';

/* Metadatos: favicon, descripción, Open Graph y Twitter */
function headExtra(logoSrc, ogImg) {
  var desc = "Web oficial de la Escuela Deportiva Val Miñor Nigrán (EDVM): escuela de fútbol base desde 1996, referente en Nigrán, el Val Miñor y Galicia. Campus, socios, cuotas, entrenamientos, partidos y asistente virtual.";
  return '\n' +
    '<link rel="icon" type="image/jpeg" href="' + logoSrc + '">\n' +
    '<link rel="apple-touch-icon" href="' + logoSrc + '">\n' +
    '<meta name="theme-color" content="#cc1f1f">\n' +
    '<meta name="description" content="' + desc + '">\n' +
    '<meta property="og:type" content="website">\n' +
    '<meta property="og:site_name" content="E.D. Val Miñor Nigrán">\n' +
    '<meta property="og:title" content="E.D. Val Miñor Nigrán · Escuela de Fútbol">\n' +
    '<meta property="og:description" content="' + desc + '">\n' +
    '<meta property="og:url" content="' + SITE_URL + '">\n' +
    '<meta property="og:image" content="' + ogImg + '">\n' +
    '<meta name="twitter:card" content="summary">\n' +
    '<meta name="twitter:title" content="E.D. Val Miñor Nigrán · Escuela de Fútbol">\n' +
    '<meta name="twitter:description" content="' + desc + '">\n' +
    '<meta name="twitter:image" content="' + ogImg + '">\n' +
    '</head>';
}

/* ---- Aplica las mejoras a la página del club ---- */
function aplicarMejoras(html, logoSrc, ogImg) {
  html = html.replace("</head>", MEJORAS_CSS);
  html = html.replace("</head>", headExtra(logoSrc, ogImg));
  // Menú único responsive
  html = html.replace(/<nav class="navbar">[\s\S]*?<\/nav>/, NAVBAR);
  // Quitar la sección del Congreso
  html = html.replace(/<section id="congreso">[\s\S]*?<\/section>/, "");
  // Marca de agua del escudo real en la cabecera (da vida, sin fotos inventadas)
  html = html.replace('<header class="top-bar" id="inicio">',
    '<header class="top-bar" id="inicio"><img src="' + logoSrc + '" alt="" aria-hidden="true" class="edvm-bg-logo">');
  // Lema bajo el subtítulo
  var subt = '<h2 class="club-subtitle">Desde 1996 · Nigrán</h2>';
  if (html.indexOf(subt) !== -1) {
    html = html.replace(subt, subt + '\n        <p class="header-tagline">Escuela de fútbol base · cerca de 30 equipos · referente del Val Miñor y Galicia.</p>');
  }
  // Secciones añadidas de la web oficial
  html = html.replace('<section id="ideario"', SOBRE + '<section id="ideario"');
  html = html.replace('<section id="patrocinadores"', INSTAL + '<section id="patrocinadores"');
  // Contacto + banner del asistente, antes del pie
  var banner =
    '<section class="edvm-ask-cta">\n' +
    '  <div class="container edvm-ask-in">\n' +
    '    <div class="edvm-ask-txt"><h2>¿Tienes alguna duda? 🤔</h2>' +
    '<p>Nuestro <strong>Asistente Virtual</strong> te responde al instante: campus, inscripciones, cuotas, socios, camisetas, instalaciones y mucho más.</p></div>\n' +
    '    <button type="button" class="edvm-ask-btn" data-abrir-asistente>💬 Pregúntale al asistente</button>\n' +
    '  </div>\n' +
    '</section>\n';
  html = html.replace("<footer>", CONTACTO + banner + "<footer>");
  return html;
}

/* ---- Scripts (menú + asistente, separados y a prueba de fallos) ---- */
const MENU_JS =
  "<script>\n(function(){try{" +
  "var chk=document.getElementById('edvmNav'),nl=document.getElementById('navLinks');" +
  "if(chk&&nl){nl.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){" +
  "if(!a.hasAttribute('data-abrir-asistente')) chk.checked=false;});});}" +
  "}catch(e){}})();\n</script>";

const ASIST_JS =
  "<script>\n(function(){try{" +
  "EDVMChat.iniciarWidget();" +
  "document.querySelectorAll('[data-abrir-asistente]').forEach(function(b){" +
  "b.addEventListener('click',function(e){e.preventDefault();var w=EDVMChat.iniciarWidget();if(w&&w.abrir)w.abrir();});});" +
  "}catch(e){if(window.console&&console.error)console.error('Asistente EDVM:',e);}})();\n</script>";

const INIT_JS = MENU_JS + "\n" + ASIST_JS;

function configJs(logoUrl) {
  return '<script>window.EDVM_CONFIG = { apiEndpoint: "", titulo: "E.D. Val Mi\\u00f1or", ' +
    'subtitulo: "Asistente oficial \\u00b7 En l\\u00ednea", logoUrl: "' + logoUrl + '" };</script>';
}

function assets(logoUrl, inline) {
  if (inline) {
    return "<style>\n" + css + "\n</style>\n" +
      configJs(logoUrl) + "\n" +
      "<script>\n/* base-conocimiento.js */\n" + kb + "\n</script>\n" +
      "<script>\n/* edvm-chat.js */\n" + motor + "\n</script>\n" + INIT_JS;
  }
  return '<link rel="stylesheet" href="asistente/edvm-chat.css">\n' +
    configJs(logoUrl) + "\n" +
    '<script src="asistente/base-conocimiento.js"></script>\n' +
    '<script src="asistente/edvm-chat.js"></script>\n' + INIT_JS;
}

function construir(logoSrc, ogImg, bloque) {
  return aplicarMejoras(paginaBase, logoSrc, ogImg).replace("</body>", bloque + "\n</body>");
}

// Archivo único: logo y vista previa con data URI (autónomo)
fs.writeFileSync(path.join(RAIZ, "asistente-edvm.html"),
  construir(logoDataUri, logoDataUri, assets(logoDataUri, true)), "utf8");
// Modular (GitHub Pages): favicon relativo + og:image absoluta para compartir
fs.writeFileSync(path.join(RAIZ, "index.html"),
  construir("asistente/logo-original.jpg", SITE_URL + "asistente/logo-original.jpg", assets("asistente/logo-original.jpg", false)), "utf8");
console.log("Generado: asistente-edvm.html (1 archivo) e index.html (modular)");
