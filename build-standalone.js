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
<meta name="description" content="Asistente virtual oficial de la Escuela Deportiva Val Miñor Nigrán. Resuelve al instante dudas sobre campus, inscripciones, cuotas, socios y más.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
/* ============================ Estilos de la página ============================ */
:root{
  --rojo:#cc1f1f; --rojo-mid:#a81717; --rojo-vivo:#ff2b2b; --rojo-osc:#7d0f0f;
  --grad:linear-gradient(135deg,#ff2b2b 0%,#cc1f1f 55%,#8a0f0f 100%);
  --tinta:#16161d; --sub:#5d5d6a; --tenue:#8a8a96;
  --linea:rgba(20,20,30,.08);
  --crema:#faf8f6;
}
*{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{
  font-family:'Barlow',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  color:var(--tinta);line-height:1.62;-webkit-font-smoothing:antialiased;
  background:
    radial-gradient(900px 460px at 50% -8%, #ffe1e1 0%, rgba(255,225,225,0) 70%),
    radial-gradient(700px 500px at 100% 0%, #fff1ec 0%, rgba(255,241,236,0) 60%),
    linear-gradient(180deg,#ffffff 0%, var(--crema) 100%);
  min-height:100vh;
}
.wrap{max-width:600px;margin:0 auto;padding:0 1.25rem;}
::selection{background:#ffd4d4;}

/* ---- Hero ---- */
.hero{text-align:center;padding:3rem 1.25rem 1.6rem;}
.coin{
  width:104px;height:104px;margin:0 auto 1.1rem;border-radius:50%;overflow:hidden;
  box-shadow:0 18px 40px -10px rgba(204,31,31,.55), 0 6px 16px rgba(0,0,0,.12), 0 0 0 5px #fff, 0 0 0 6px rgba(204,31,31,.12);
}
.coin svg{width:100%;height:100%;display:block;}
.eyebrow{
  display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid rgba(204,31,31,.22);
  color:var(--rojo);padding:6px 15px;border-radius:30px;font-size:.66rem;letter-spacing:2.5px;
  text-transform:uppercase;font-weight:800;margin-bottom:1rem;box-shadow:0 4px 14px rgba(204,31,31,.1);
}
h1{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:clamp(2.5rem,9vw,3.6rem);
  line-height:.98;letter-spacing:.4px;color:var(--tinta);}
h1 .red{color:var(--rojo-vivo);}
.lead{color:var(--sub);font-size:1.06rem;max-width:480px;margin:.95rem auto 0;}
.trust{display:flex;flex-wrap:wrap;justify-content:center;gap:.5rem;margin-top:1.4rem;}
.trust .pill{display:inline-flex;align-items:center;gap:6px;background:#fff;border:1px solid var(--linea);
  border-radius:30px;padding:7px 14px;font-size:.8rem;font-weight:600;color:var(--tinta);
  box-shadow:0 2px 8px rgba(0,0,0,.03);}
.trust .pill b{color:var(--rojo);}

/* ---- Ejemplos ---- */
.ej-wrap{margin-top:1.7rem;}
.ej-label{text-align:center;font-size:.7rem;letter-spacing:2px;text-transform:uppercase;color:var(--tenue);font-weight:700;margin-bottom:.7rem;}
.ejemplos{display:flex;flex-wrap:wrap;justify-content:center;gap:.5rem;}
.ej{background:#fff;border:1.5px solid rgba(204,31,31,.2);color:var(--rojo);border-radius:30px;
  padding:9px 16px;font-size:.84rem;font-weight:600;cursor:pointer;font-family:inherit;
  transition:transform .18s, box-shadow .2s, background .2s, color .2s;box-shadow:0 2px 8px rgba(204,31,31,.06);}
.ej:hover{background:var(--grad);color:#fff;border-color:transparent;transform:translateY(-2px);box-shadow:0 8px 18px rgba(204,31,31,.3);}

/* ---- Chat ---- */
.chat-zone{padding:1.8rem 0 1rem;}
.chat-card{position:relative;border-radius:22px;}
.chat-card::before{
  content:"";position:absolute;inset:-1px;border-radius:23px;z-index:-1;
  background:linear-gradient(135deg,rgba(204,31,31,.5),rgba(204,31,31,0) 45%);
}

/* ---- Capacidades ---- */
.feat-sec{padding:2.8rem 0 1rem;}
.feat-h{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:1.7rem;text-align:center;letter-spacing:.3px;}
.feat-p{text-align:center;color:var(--sub);font-size:.95rem;margin:.3rem auto 1.6rem;max-width:420px;}
.feat-grid{display:grid;grid-template-columns:1fr 1fr;gap:.85rem;}
.feat{background:#fff;border:1px solid var(--linea);border-radius:16px;padding:1.1rem 1.1rem;
  transition:transform .2s, box-shadow .2s;box-shadow:0 3px 12px rgba(0,0,0,.03);}
.feat:hover{transform:translateY(-3px);box-shadow:0 12px 26px rgba(204,31,31,.1);border-color:rgba(204,31,31,.2);}
.feat .ic{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;
  font-size:1.3rem;background:linear-gradient(135deg,#fff0f0,#ffe3e3);margin-bottom:.6rem;}
.feat h3{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:1.1rem;letter-spacing:.3px;margin-bottom:.2rem;}
.feat p{font-size:.82rem;color:var(--sub);line-height:1.5;}

/* ---- Pie ---- */
.foot{text-align:center;padding:2.6rem 1.25rem 2.4rem;margin-top:1.4rem;border-top:1px solid var(--linea);}
.foot .fcoin{width:48px;height:48px;border-radius:50%;overflow:hidden;margin:0 auto .7rem;box-shadow:0 4px 12px rgba(204,31,31,.2);}
.foot .fcoin svg{width:100%;height:100%;}
.foot .fname{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:1.15rem;letter-spacing:.5px;}
.foot .fcontact{font-size:.9rem;color:var(--sub);margin-top:.5rem;line-height:1.95;}
.foot a{color:var(--rojo);font-weight:600;text-decoration:none;}
.foot a:hover{text-decoration:underline;}
.foot .sep{opacity:.4;margin:0 .5rem;}
.foot .heart{margin-top:.7rem;font-size:.82rem;color:var(--tenue);}

@media(min-width:560px){ .feat-grid{grid-template-columns:repeat(3,1fr);} }
</style>
</head>
<body>

<header class="hero">
  <div class="wrap">
    <div class="coin">${logo}</div>
    <span class="eyebrow">⚽ Asistente oficial del club</span>
    <h1>Resuelve tus dudas<br><span class="red">al instante</span></h1>
    <p class="lead">Pregúntame lo que necesites sobre la <strong>E.D. Val Miñor Nigrán</strong>: campus, inscripciones, cuotas, socios, camisetas, instalaciones y mucho más.</p>
    <div class="trust">
      <span class="pill"><b>●</b> Disponible 24/7</span>
      <span class="pill"><b>⚡</b> Respuesta inmediata</span>
      <span class="pill"><b>✓</b> Información oficial</span>
    </div>

    <div class="ej-wrap">
      <div class="ej-label">Prueba a preguntar</div>
      <div class="ejemplos" id="ejemplos">
        <button class="ej" type="button">¿Cuándo es el campus de verano?</button>
        <button class="ej" type="button">¿Cómo me hago socio?</button>
        <button class="ej" type="button">¿Qué es el Val Miñor?</button>
        <button class="ej" type="button">Número de cuenta</button>
      </div>
    </div>
  </div>
</header>

<main>
  <section class="chat-zone">
    <div class="wrap">
      <div class="chat-card">
        <div id="chat-edvm"></div>
      </div>
    </div>
  </section>

  <section class="feat-sec">
    <div class="wrap">
      <h2 class="feat-h">¿Qué puedo responder?</h2>
      <p class="feat-p">Conozco toda la información oficial del club y de su entorno.</p>
      <div class="feat-grid">
        <div class="feat"><div class="ic">🏖️</div><h3>Campus de Verano</h3><p>Fechas, turnos, precios e inscripción.</p></div>
        <div class="feat"><div class="ic">🤝</div><h3>Hazte socio</h3><p>Abonos, alta y recogida del carnet.</p></div>
        <div class="feat"><div class="ic">💶</div><h3>Cuotas y pagos</h3><p>Importes y número de cuenta.</p></div>
        <div class="feat"><div class="ic">👕</div><h3>Ropa y camisetas</h3><p>Camiseta de recuerdo y equipación.</p></div>
        <div class="feat"><div class="ic">⚽</div><h3>Entrenos y partidos</h3><p>Horarios, calendarios y categorías.</p></div>
        <div class="feat"><div class="ic">📍</div><h3>Club y Val Miñor</h3><p>Instalaciones, contacto y la comarca.</p></div>
      </div>
    </div>
  </section>
</main>

<footer class="foot">
  <div class="fcoin">${logo}</div>
  <div class="fname">E.D. Val Miñor Nigrán</div>
  <div class="fcontact">
    <a href="mailto:info@edvmnigran.com">info@edvmnigran.com</a>
    <span class="sep">·</span>
    <a href="https://wa.me/34610186460">WhatsApp 610 186 460</a>
  </div>
  <div class="heart">Asistente virtual · Hecho con 🤍❤️ para el club</div>
</footer>

<!-- ================= ASISTENTE (todo incluido) ================= -->
<style>
${css}
</style>

<script>
/* Configuración. Para el modo avanzado con la API de Claude, pon aquí la URL
   del backend, p. ej.: apiEndpoint: "https://TU-PROYECTO.vercel.app/api/chat" */
window.EDVM_CONFIG = { apiEndpoint: "", titulo: "E.D. Val Miñor", subtitulo: "Asistente oficial · En línea" };
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
