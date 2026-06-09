/* ============================================================================
   Tests del motor del asistente (modo local).
   Ejecutar con:  npm test   (o)   node test/test-motor.js
   No requiere dependencias externas.
   ============================================================================ */

const fs = require("fs");
const vm = require("vm");
const path = require("path");

const RAIZ = path.join(__dirname, "..");
const KB = require(path.join(RAIZ, "asistente/base-conocimiento.js"));

// Stubs mínimos de navegador para poder cargar edvm-chat.js en Node
const sandbox = {
  window: { EDVM_KB: KB, EDVM_CONFIG: {} },
  document: { readyState: "complete", addEventListener: function () {} },
  console: console
};
sandbox.window.document = sandbox.document;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(RAIZ, "asistente/edvm-chat.js"), "utf8"), sandbox);
const Chat = sandbox.window.EDVMChat;

let fallos = 0;
function check(desc, cond) {
  console.log((cond ? "  OK  " : " FAIL ") + desc);
  if (!cond) fallos++;
}

console.log("=== BASE DE CONOCIMIENTO ===");
check("Hay temas cargados (" + KB.TEMAS.length + ")", KB.TEMAS.length >= 20);
check("CONTEXTO_IA contiene el IBAN", KB.CONTEXTO_IA.indexOf("ES60 2080") !== -1);
check("Cada tema tiene keywords y respuesta", KB.TEMAS.every(function (t) {
  return Array.isArray(t.keywords) && t.keywords.length > 0 && typeof t.respuesta === "string";
}));

console.log("\n=== MOTOR DE BUSQUEDA (preguntas reales) ===");
const casos = [
  ["¿Cuándo es el campus de verano?", "campus"],
  ["quiero apuntar a mi hijo al campus", "inscripcion_campus"],
  ["¿cómo me hago socio?", "socios"],
  ["precio de las camisetas", "camisetas"],
  ["cuánto cuesta la cuota de la temporada", "cuotas"],
  ["¿cuál es el número de cuenta?", "cuenta"],
  ["cuándo es la fiesta de fin de temporada", "fiesta"],
  ["a qué hora entrenan", "entrenamientos"],
  ["dónde jugáis los partidos", "partidos"],
  ["teléfono de contacto", "contacto"],
  ["dónde están las instalaciones", "instalaciones"],
  ["mi hija tiene 8 años, qué categoría", "categorias"],
  ["hola buenas", "saludo"],
  ["muchas gracias", "agradecimiento"],
  ["asdfghjkl qwerty", "fallback"]
];
casos.forEach(function (caso) {
  const r = Chat.buscarRespuesta(caso[0]);
  check('"' + caso[0] + '" -> ' + r.id + (r.id === caso[1] ? "" : " (esperado " + caso[1] + ")"), r.id === caso[1]);
});

console.log("\n=== FORMATEO (HTML seguro) ===");
const html = Chat.formatear(KB.TEMAS.find(function (t) { return t.id === "camisetas"; }).respuesta);
check("No aparece 'undefined' en el HTML", html.indexOf("undefined") === -1);
check("Conserva los precios 40 y 45", html.indexOf("40") !== -1 && html.indexOf("45") !== -1);
check("Genera enlaces <a href", html.indexOf("<a href") !== -1);
check("Enlaza el email con mailto", html.indexOf("mailto:info@edvmnigran.com") !== -1);
check("Genera listas <li>", html.indexOf("<li>") !== -1);
check("Escapa HTML peligroso (<script>)", Chat.formatear("<script>alert(1)</script>").indexOf("<script>") === -1);

console.log("\n" + (fallos === 0 ? "TODOS LOS TESTS PASARON" : fallos + " TEST(S) FALLARON"));
process.exit(fallos === 0 ? 0 : 1);
