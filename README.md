# 🤖 Asistente Virtual · E.D. Val Miñor Nigrán

Una IA que responde automáticamente a las preguntas y dudas de **jugadores y familias**
del club: campus de verano, inscripciones, cuotas, cómo hacerse socio, camisetas,
entrenamientos, partidos, instalaciones, contacto y mucho más.

Está pensado para integrarse en la web del club como un **chat de ayuda** (una burbuja
flotante en la esquina, como las de muchas webs).

---

## ✨ Características

- **Funciona sin coste y sin servidor** (modo local): toda la información vive en un
  archivo y el chat responde directamente en el navegador. Ideal para alojar en
  GitHub Pages, Wix, o junto a la web actual.
- **Identidad visual del club**: blanco y rojo, escudo y tipografías de la EDVM.
- **Fácil de actualizar**: para cambiar precios, fechas o enlaces solo se edita
  **un archivo** (`asistente/base-conocimiento.js`).
- **Integración en 3 líneas** en cualquier página.
- **Modo avanzado opcional** con la **API de Claude** para conversaciones más
  naturales (requiere una clave y un pequeño backend; ver más abajo).
- **Móvil y escritorio**, accesible y seguro (escapa el HTML de lo que escribe el usuario).

---

## 🚀 Probarlo en 30 segundos

Abre el archivo **`index.html`** en tu navegador (doble clic). Verás una página de
demostración con el asistente incrustado y la burbuja flotante. Escribe una pregunta o
pulsa uno de los ejemplos.

> Consejo: para que los enlaces y todo funcione igual que en producción, puedes servir
> la carpeta con un servidor local sencillo:
> ```bash
> python3 -m http.server 8000
> # y abre http://localhost:8000
> ```

---

## 📁 Estructura del proyecto

```
.
├── index.html                  ← Página de demostración (ábrela para probar)
├── embed.html                  ← Ejemplo mínimo de integración (3 líneas)
│
├── asistente/                  ← El asistente (esto es lo que se integra en la web)
│   ├── base-conocimiento.js    ← ⭐ TODA la información del club (se edita aquí)
│   ├── edvm-chat.js            ← Motor del chat e interfaz
│   └── edvm-chat.css           ← Estilos (blanco/rojo del club)
│
├── api/
│   └── chat.js                 ← Backend OPCIONAL para el modo con la API de Claude
│
├── test/
│   └── test-motor.js           ← Tests automáticos del motor de respuestas
│
├── package.json                ← Solo necesario para el modo avanzado (API)
├── .env.example                ← Plantilla de variables de entorno (clave API)
└── README.md
```

---

## ✏️ Cómo actualizar la información (lo más importante)

Toda la información que da el asistente está en **`asistente/base-conocimiento.js`**.
No hace falta saber programar: se edita como un documento de texto.

Por ejemplo, para cambiar la cuota del campus, busca el tema `campus` y edita el texto:

```js
{
  id: "campus",
  keywords: ["campus", "campus de verano", "verano", "turno", ...],
  respuesta:
    "🏖️ **Campus de Fútbol ED Val Miñor 2026 · Grupo PEREIRA**\n\n" +
    "• **Cuota:** 70 € por turno y alumno\n" +   // 👈 cambia el precio aquí
    ...
}
```

Formato de las respuestas (sencillo):

| Quieres...                | Escribe así                                  |
|---------------------------|----------------------------------------------|
| Negrita                   | `**texto en negrita**`                       |
| Un enlace                 | `[texto del enlace](https://...)`            |
| Un punto de lista         | empezar la línea con `• `                    |
| Separar párrafos          | dejar una línea en blanco (`\n\n`)           |
| Email o teléfono          | escríbelo tal cual; se enlaza solo           |

Las **palabras clave** (`keywords`) son las que hacen que el asistente reconozca la
pregunta. Añade todas las formas en que la gente pueda preguntar (sin preocuparte por
tildes ni mayúsculas).

> Si activas el **modo avanzado** (API de Claude), recuerda revisar también el texto
> `CONTEXTO_IA` al final del mismo archivo: es el resumen que lee la IA.

---

## 🌐 Integrarlo en la web del club

Copia la carpeta `asistente/` a tu web y añade estas líneas antes de `</body>`:

```html
<link rel="stylesheet" href="asistente/edvm-chat.css">
<script src="asistente/base-conocimiento.js"></script>
<script src="asistente/edvm-chat.js"></script>
<script>EDVMChat.iniciarWidget();</script>
```

Eso muestra la **burbuja flotante** en la esquina. Tienes un ejemplo completo en
`embed.html`.

¿Prefieres incrustarlo dentro de una sección de la página (no flotante)? Crea un
contenedor y usa:

```html
<div id="mi-chat"></div>
<script>EDVMChat.iniciarInline("#mi-chat");</script>
```

---

## 🧠 Dos modos de funcionamiento

| | **Modo local** (por defecto) | **Modo avanzado** (API de Claude) |
|---|---|---|
| Coste | Gratis | Coste por uso de la API |
| Servidor | No necesita | Necesita un backend (Vercel/Netlify) |
| Clave API | No | Sí (`ANTHROPIC_API_KEY`) |
| Respuestas | Basadas en palabras clave | Lenguaje natural, más flexibles |
| Recomendado para | Empezar ya, sin complicaciones | Cuando quieras conversaciones más naturales |

El modo local ya cubre perfectamente las preguntas frecuentes. El modo avanzado es un
"plus" opcional.

---

## ⚙️ Activar el modo avanzado (API de Claude)

> Solo si quieres respuestas en lenguaje natural. Es opcional.

1. **Consigue una clave** de la API en <https://console.anthropic.com>.
2. **Despliega el proyecto** en una plataforma con funciones serverless (la más sencilla
   es [Vercel](https://vercel.com)). La carpeta `api/` se publica automáticamente como
   `/api/chat`.
3. **Configura la variable de entorno** `ANTHROPIC_API_KEY` en el panel de la plataforma
   (ver `.env.example`). La clave queda **solo en el servidor**, nunca en el navegador.
4. **Activa el modo** en tu web indicando la URL del backend:
   ```html
   <script>
     window.EDVM_CONFIG = { apiEndpoint: "/api/chat" };
   </script>
   <script src="asistente/base-conocimiento.js"></script>
   <script src="asistente/edvm-chat.js"></script>
   <script>EDVMChat.iniciarWidget();</script>
   ```

Instalación de la dependencia del backend (en local, para probar):

```bash
npm install
```

**Modelo y coste.** Por defecto se usa `claude-opus-4-8` (el más capaz). Para mucho
volumen de preguntas puedes usar un modelo más económico definiendo la variable
`EDVM_MODELO=claude-haiku-4-5`. Si el backend fallara por cualquier motivo, el asistente
**vuelve automáticamente al modo local**, así que nunca se queda sin responder.

---

## ✅ Tests

```bash
npm test
```

Comprueba que el motor reconoce correctamente las preguntas habituales y que el formateo
del texto es seguro (no rompe con los precios, escapa HTML, genera bien los enlaces).

---

## 📌 Información que conoce el asistente

Resumen de lo que tiene cargado (todo editable en `base-conocimiento.js`):

- **Club**: escuela de fútbol desde 1996, +27 equipos, categorías de biberones a aficionados.
- **Campus de verano 2026** (Grupo PEREIRA): turnos, horarios, cuota (70 €), servicios
  opcionales e inscripción.
- **Socios**: abono familiar (30 €) e individual (20 €), alta y recogida del carnet.
- **Camiseta de recuerdo**: precios por talla, solicitud y plazo.
- **Fiesta de fin de temporada**: 27 de junio en Condomínguez.
- **Cuotas, entrenamientos, partidos, torneos, horario de oficina** (con enlaces oficiales).
- **Instalaciones**: Campo Municipal, Complejo URECA, Taquilla Condomínguez.
- **Contacto y cuenta bancaria** (ABANCA), Ideario/RRI, Protocolo Xogade, Congreso de
  Entrenadores y patrocinadores.

> ⚠️ **Revisa las fechas y plazos antes de publicar.** Algunos datos eran de campaña (por
> ejemplo, el plazo de las camisetas finalizaba el 19 de mayo). Actualiza lo que
> corresponda en `base-conocimiento.js`.

---

Hecho con 🤍❤️ para la **Escuela Deportiva Val Miñor Nigrán**.
