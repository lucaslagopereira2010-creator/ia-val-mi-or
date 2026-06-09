/* ============================================================================
   Backend OPCIONAL del Asistente Virtual EDVM — API de Claude
   ----------------------------------------------------------------------------
   Función serverless (compatible con Vercel / Netlify Functions) que recibe la
   conversación del navegador y devuelve la respuesta generada por Claude,
   apoyándose en la base de conocimiento del club como contexto.

   ¿Por qué un backend? Para NO exponer la clave de la API en el navegador.
   La clave (ANTHROPIC_API_KEY) vive solo aquí, en el servidor.

   Activación: en el HTML pon  window.EDVM_CONFIG.apiEndpoint = "/api/chat".
   Si no usas este backend, el asistente funciona igual en modo local.

   Variables de entorno:
     ANTHROPIC_API_KEY   (obligatoria)  -> tu clave de la API de Claude
     ALLOWED_ORIGIN      (opcional)     -> dominio permitido (CORS). Por
                                           defecto "*". Recomendado fijarlo a
                                           https://www.edvmnigran.com
   ============================================================================ */

const Anthropic = require("@anthropic-ai/sdk");
const KB = require("../asistente/base-conocimiento.js");

const client = new Anthropic(); // lee ANTHROPIC_API_KEY del entorno

/* Modelo. Por defecto el más capaz (Claude Opus 4.8).
   Para reducir coste en alto volumen puedes cambiarlo a "claude-haiku-4-5",
   más económico y rápido, suficiente para un asistente de preguntas frecuentes. */
const MODELO = process.env.EDVM_MODELO || "claude-opus-4-8";

/* Instrucciones del asistente (system prompt). El contexto del club se añade
   a continuación desde la base de conocimiento, de modo que solo hay que
   mantener un único archivo (base-conocimiento.js). */
const SYSTEM_PROMPT =
  "Eres el asistente virtual oficial de la E.D. Val Miñor Nigrán, una escuela de fútbol de Nigrán (Pontevedra). " +
  "Tu función es resolver dudas de jugadores y familias de forma cercana, clara y breve.\n\n" +
  "REGLAS:\n" +
  "- Responde SOLO con la información del CONTEXTO de más abajo. No inventes precios, fechas, cuentas ni enlaces.\n" +
  "- Si la información no está en el contexto, dilo con naturalidad y deriva a info@edvmnigran.com o al WhatsApp 610 186 460.\n" +
  "- Usa el mismo idioma que el usuario (castellano o gallego).\n" +
  "- Tono cordial y cercano, con el espíritu del club (🤍❤️). Respuestas concisas y útiles.\n" +
  "- Puedes usar **negritas** y listas con guiones, pero NO uses encabezados Markdown (#).\n" +
  "- Cuando proceda, incluye el enlace o el dato de contacto concreto.\n\n" +
  "CONTEXTO (información oficial del club):\n\n" +
  KB.CONTEXTO_IA;

/* Saneamiento del historial recibido del navegador */
function sanearMensajes(entrada) {
  if (!Array.isArray(entrada)) return [];
  const limpio = [];
  for (const m of entrada) {
    if (!m || (m.role !== "user" && m.role !== "assistant")) continue;
    let texto = typeof m.content === "string" ? m.content : "";
    texto = texto.trim().slice(0, 1500); // límite de seguridad por mensaje
    if (texto) limpio.push({ role: m.role, content: texto });
  }
  // Quedarnos con los últimos 12 turnos y asegurar que empieza por "user"
  const recortado = limpio.slice(-12);
  while (recortado.length && recortado[0].role !== "user") recortado.shift();
  return recortado;
}

module.exports = async function handler(req, res) {
  /* ---- CORS ---- */
  const origen = process.env.ALLOWED_ORIGIN || "*";
  res.setHeader("Access-Control-Allow-Origin", origen);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }
  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.json({ error: "Método no permitido" });
  }

  try {
    /* Algunos entornos ya entregan req.body parseado; otros, como string */
    let cuerpo = req.body;
    if (typeof cuerpo === "string") {
      try { cuerpo = JSON.parse(cuerpo); } catch (e) { cuerpo = {}; }
    }
    const mensajes = sanearMensajes(cuerpo && cuerpo.messages);

    if (!mensajes.length) {
      res.statusCode = 400;
      return res.json({ error: "No se recibió ninguna pregunta válida." });
    }

    const respuesta = await client.messages.create({
      model: MODELO,
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" } // cachea el contexto entre peticiones
        }
      ],
      messages: mensajes
    });

    const bloqueTexto = respuesta.content.find(function (b) { return b.type === "text"; });
    const reply = bloqueTexto
      ? bloqueTexto.text
      : "Lo siento, ahora mismo no puedo responder. Escríbenos a info@edvmnigran.com.";

    res.statusCode = 200;
    return res.json({ reply: reply });
  } catch (err) {
    console.error("[api/chat] Error:", err && err.message ? err.message : err);
    res.statusCode = 500;
    /* El frontend hará 'fallback' a la respuesta local si esto falla */
    return res.json({ error: "Error al generar la respuesta." });
  }
};
