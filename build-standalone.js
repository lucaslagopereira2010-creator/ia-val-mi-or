/* ============================================================================
   Generador del archivo único "asistente-edvm.html"
   ----------------------------------------------------------------------------
   Combina los estilos, la base de conocimiento y el motor del chat en UN solo
   archivo HTML autónomo (sin dependencias locales), ideal para abrir con doble
   clic o compartir por email/WhatsApp.

   Ejecutar:  node build-standalone.js
   ============================================================================ */

const fs = require("fs");
const path = require("path");

const RAIZ = __dirname;
const leer = (p) => fs.readFileSync(path.join(RAIZ, p), "utf8");

const css = leer("asistente/edvm-chat.css");
const kb = leer("asistente/base-conocimiento.js");
const motor = leer("asistente/edvm-chat.js");
const logo = leer("asistente/logo-edvm.svg");

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Asistente Virtual · E.D. Val Miñor Nigrán</title>
<meta name="description" content="Asistente virtual de la Escuela Deportiva Val Miñor Nigrán.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
/* ---- Estilos de la página ---- */
:root{
  --rojo:#cc0000; --rojo-mid:#a80000; --rojo-vivo:#ff2b2b; --rojo-osc:#8a0000;
  --rojo-claro:#fff0f1; --texto:#181821; --sub:#5a5a68; --borde:rgba(20,20,30,.08);
}
*{margin:0;padding:0;box-sizing:border-box;}
body{
  font-family:'Barlow',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  color:var(--texto);line-height:1.6;
  background:
    radial-gradient(1200px 500px at 50% -10%, #ffe3e4 0%, transparent 60%),
    linear-gradient(180deg,#fff 0%,#f6f7f9 100%);
  min-height:100vh;
}
.page{max-width:560px;margin:0 auto;padding:2.4rem 1.2rem 3rem;}

/* Cabecera */
.head{display:flex;flex-direction:column;align-items:center;text-align:center;margin-bottom:1.4rem;}
.head-shield{width:96px;height:96px;border-radius:50%;overflow:hidden;
  box-shadow:0 14px 34px -8px rgba(204,0,0,.5),0 4px 10px rgba(0,0,0,.12),0 0 0 4px #fff;margin-bottom:1rem;}
.head-shield svg{width:100%;height:100%;display:block;}
.eyebrow{display:inline-flex;align-items:center;gap:7px;background:#fff;border:1px solid rgba(204,0,0,.2);
  color:var(--rojo);padding:5px 14px;border-radius:20px;font-size:.68rem;letter-spacing:2px;
  text-transform:uppercase;font-weight:700;margin-bottom:.9rem;box-shadow:0 2px 8px rgba(204,0,0,.08);}
h1{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:clamp(2.2rem,7vw,3rem);
  line-height:1;letter-spacing:.5px;}
h1 .red{color:var(--rojo-vivo);}
.lead{color:var(--sub);font-size:1rem;max-width:440px;margin:.8rem auto 0;}

/* Ejemplos */
.ejemplos{display:flex;flex-wrap:wrap;justify-content:center;gap:.5rem;margin:1.4rem 0 .4rem;}
.ej{background:#fff;border:1.5px solid rgba(204,0,0,.22);color:var(--rojo);border-radius:18px;
  padding:8px 14px;font-size:.82rem;font-weight:600;cursor:pointer;font-family:inherit;
  transition:all .2s;box-shadow:0 2px 6px rgba(204,0,0,.06);}
.ej:hover{background:linear-gradient(135deg,#ff2b2b,#cc0000);color:#fff;border-color:transparent;
  transform:translateY(-2px);box-shadow:0 6px 16px rgba(204,0,0,.3);}

/* Chat */
.chat-box{margin-top:1.3rem;}

/* Pie */
.foot{text-align:center;margin-top:1.8rem;font-size:.85rem;color:var(--sub);line-height:1.9;}
.foot a{color:var(--rojo);font-weight:600;text-decoration:none;}
.foot a:hover{text-decoration:underline;}
.foot .sep{opacity:.4;margin:0 .4rem;}
</style>
</head>
<body>

<div class="page">
  <div class="head">
    <div class="head-shield">
      ${logo}
    </div>
    <span class="eyebrow">⚽ Escuela de Fútbol · Desde 1996</span>
    <h1>Asistente <span class="red">Virtual</span></h1>
    <p class="lead">Pregúntame lo que necesites sobre la <strong>E.D. Val Miñor Nigrán</strong>: campus, inscripciones, cuotas, socios, camisetas y mucho más.</p>
  </div>

  <div class="ejemplos" id="ejemplos">
    <button class="ej" type="button">¿Cuándo es el campus de verano?</button>
    <button class="ej" type="button">¿Cómo me hago socio?</button>
    <button class="ej" type="button">¿Qué es el Val Miñor?</button>
    <button class="ej" type="button">Número de cuenta</button>
  </div>

  <div class="chat-box">
    <div id="chat-edvm"></div>
  </div>

  <div class="foot">
    <a href="mailto:info@edvmnigran.com">info@edvmnigran.com</a>
    <span class="sep">·</span>
    <a href="https://wa.me/34610186460">WhatsApp 610 186 460</a><br>
    🤍❤️ E.D. Val Miñor Nigrán
  </div>
</div>

<!-- ================= ASISTENTE (todo incluido) ================= -->
<style>
${css}
</style>

<script>
/* Configuración. Para el modo avanzado con la API de Claude, pon aquí la URL
   del backend, p. ej.: apiEndpoint: "https://TU-PROYECTO.vercel.app/api/chat" */
window.EDVM_CONFIG = { apiEndpoint: "", titulo: "E.D. Val Miñor", subtitulo: "En línea · respuesta inmediata" };
</script>

<script>
/* ---- base-conocimiento.js ---- */
${kb}
</script>

<script>
/* ---- edvm-chat.js ---- */
${motor}
</script>

<script>
  var demo = EDVMChat.iniciarInline("#chat-edvm");
  EDVMChat.iniciarWidget();
  document.querySelectorAll("#ejemplos .ej").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (demo && demo.enviar) demo.enviar(btn.textContent.trim());
    });
  });
</script>

</body>
</html>
`;

fs.writeFileSync(path.join(RAIZ, "asistente-edvm.html"), html, "utf8");
console.log("Generado: asistente-edvm.html (" + Math.round(html.length / 1024) + " KB)");
