/* ============================================================================
   Asistente Virtual E.D. Val Miñor Nigrán — Motor del chat
   ----------------------------------------------------------------------------
   - Funciona 100% en el navegador, sin servidor ni claves (modo local):
     busca la mejor respuesta dentro de base-conocimiento.js.
   - Opcionalmente puede usar la API de Claude para conversaciones más
     naturales: basta con definir window.EDVM_CONFIG.apiEndpoint con la URL
     del backend (ver carpeta /api). Si el backend falla, vuelve al modo local.

   Uso:
     EDVMChat.iniciarWidget();              // burbuja flotante (esquina)
     EDVMChat.iniciarInline("#mi-div");     // chat incrustado en la página
   ============================================================================ */

window.EDVMChat = (function () {
  "use strict";

  var KB = window.EDVM_KB;
  if (!KB) {
    console.error("[EDVMChat] No se encontro base-conocimiento.js (window.EDVM_KB). Cargalo antes que edvm-chat.js.");
    return { iniciarWidget: function () {}, iniciarInline: function () {} };
  }

  var CONFIG = window.EDVM_CONFIG || {};
  var API_ENDPOINT = CONFIG.apiEndpoint || "";        // "" => modo local
  var TITULO = CONFIG.titulo || "Asistente EDVM";
  var SUBTITULO = CONFIG.subtitulo || "En linea · respuesta inmediata";

  /* ====================================================================
     ICONOS (SVG en linea)
     ==================================================================== */
  var ICONO_ESCUDO =
    '<svg viewBox="0 0 50 58" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M25 2 L48 12 L48 32 C48 44 25 56 25 56 C25 56 2 44 2 32 L2 12 Z" fill="#cc0000" stroke="#ffffff" stroke-width="2.5"/>' +
    '<rect x="2" y="30" width="46" height="13" fill="#1a1a24"/>' +
    '<text x="25" y="24" text-anchor="middle" font-family="Barlow Condensed, Arial" font-weight="900" font-size="11" fill="#fff">ED</text>' +
    '<text x="25" y="41" text-anchor="middle" font-family="Barlow Condensed, Arial" font-weight="700" font-size="7.5" fill="#fff">VAL MIÑOR</text>' +
    "</svg>";

  // Version en blanco para la burbuja flotante
  var ICONO_CHAT_BLANCO =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M12 3C7.03 3 3 6.58 3 11c0 2.05.87 3.92 2.3 5.34L4 21l4.9-1.28C9.86 20.55 10.9 20.8 12 20.8c4.97 0 9-3.58 9-8s-4.03-8-9-8z" fill="#fff"/>' +
    '<circle cx="8.5" cy="11" r="1.3" fill="#cc0000"/>' +
    '<circle cx="12" cy="11" r="1.3" fill="#cc0000"/>' +
    '<circle cx="15.5" cy="11" r="1.3" fill="#cc0000"/>' +
    "</svg>";

  var ICONO_ENVIAR =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M3.4 20.4l17.45-7.48a1 1 0 000-1.84L3.4 3.6a.993.993 0 00-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z" fill="currentColor"/>' +
    "</svg>";

  /* ====================================================================
     UTILIDADES DE TEXTO
     ==================================================================== */

  // Normaliza: minusculas, sin tildes, sin signos -> para comparar palabras
  function normalizar(texto) {
    return (texto || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")   // quita acentos y diacriticos
      .replace(/[^a-z0-9\s]/g, " ")      // signos -> espacio
      .replace(/\s+/g, " ")
      .trim();
  }

  function escaparHtml(texto) {
    return (texto || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Convierte el formato sencillo de la base de conocimiento a HTML seguro.
  function formatear(texto) {
    var html = escaparHtml(texto);

    // Enlaces [texto](url): se reservan como tokens con un marcador exclusivo
    // (@@@indice@@@) que no puede colisionar con numeros reales del texto
    // (p. ej. "70") ni volver a enlazarse en los pasos siguientes.
    var tokens = [];
    html = html.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (_, etiqueta, url) {
      var i = tokens.length;
      tokens.push('<a href="' + url + '" target="_blank" rel="noopener">' + etiqueta + "</a>");
      return "@@@" + i + "@@@";
    });

    // Autoenlazar emails sueltos
    html = html.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
      '<a href="mailto:$1">$1</a>');

    // Autoenlazar URLs sueltas (http/https)
    html = html.replace(/(^|[\s(])((?:https?:\/\/)[^\s<]+)/g, function (_, pre, url) {
      return pre + '<a href="' + url + '" target="_blank" rel="noopener">' + url + "</a>";
    });

    // Negritas **texto**
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

    // Restaurar los tokens de enlaces
    html = html.replace(/@@@(\d+)@@@/g, function (_, i) {
      return tokens[+i];
    });

    // Construir parrafos y listas a partir de los saltos de linea
    var lineas = html.split("\n");
    var salida = [];
    var parr = [];
    var lista = [];

    function volcarParrafo() {
      if (parr.length) {
        salida.push("<p>" + parr.join("<br>") + "</p>");
        parr = [];
      }
    }
    function volcarLista() {
      if (lista.length) {
        salida.push("<ul>" + lista.map(function (li) { return "<li>" + li + "</li>"; }).join("") + "</ul>");
        lista = [];
      }
    }

    lineas.forEach(function (linea) {
      var t = linea.trim();
      if (t === "") {
        volcarParrafo();
        volcarLista();
      } else if (t.charAt(0) === "•") {   // vineta "•"
        volcarParrafo();
        lista.push(t.replace(/^•\s*/, ""));
      } else {
        volcarLista();
        parr.push(t);
      }
    });
    volcarParrafo();
    volcarLista();

    return salida.join("");
  }

  /* ====================================================================
     MOTOR DE BUSQUEDA (modo local)
     ==================================================================== */

  // Devuelve { texto, sugerencias, id } con la mejor coincidencia.
  function buscarRespuesta(consulta) {
    var q = " " + normalizar(consulta) + " ";
    var mejorContenido = null, mejorContenidoPunt = 0;
    var mejorSocial = null, mejorSocialPunt = 0;

    KB.TEMAS.forEach(function (tema) {
      var punt = 0;
      tema.keywords.forEach(function (kw) {
        var k = normalizar(kw);
        if (!k) return;
        // coincidencia por palabra/expresion completa
        if (q.indexOf(" " + k + " ") !== -1) {
          punt += k.length + (k.indexOf(" ") !== -1 ? 4 : 0); // bonus a expresiones
        }
      });
      if (punt === 0) return;
      if (tema.social) {
        if (punt > mejorSocialPunt) { mejorSocialPunt = punt; mejorSocial = tema; }
      } else {
        if (punt > mejorContenidoPunt) { mejorContenidoPunt = punt; mejorContenido = tema; }
      }
    });

    var UMBRAL = 4; // longitud minima de palabra reconocida
    var elegido = null;
    if (mejorContenido && mejorContenidoPunt >= UMBRAL) {
      elegido = mejorContenido;
    } else if (mejorSocial) {
      elegido = mejorSocial;
    } else if (mejorContenido) {
      elegido = mejorContenido; // coincidencia debil, mejor que nada
    }

    if (elegido) {
      return { texto: elegido.respuesta, sugerencias: elegido.sugerencias || [], id: elegido.id };
    }
    return { texto: KB.FALLBACK, sugerencias: KB.SUGERENCIAS_INICIALES.slice(0, 4), id: "fallback" };
  }

  /* ====================================================================
     LLAMADA A LA API DE CLAUDE (modo avanzado, opcional)
     ==================================================================== */
  function consultarAPI(historial) {
    return fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: historial })
    })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) {
        if (!data || !data.reply) throw new Error("Respuesta vacia");
        return data.reply;
      });
  }

  /* ====================================================================
     INSTANCIA DE CHAT
     ==================================================================== */
  function crearChat(opciones) {
    opciones = opciones || {};
    var inline = !!opciones.inline;
    var contenedorObjetivo = opciones.contenedor || null;

    var historial = [];   // para el modo API: [{role, content}]
    var raiz, messagesEl, suggestionsEl, inputEl, sendBtn, launcher, panel, badge;
    var abierto = inline;

    /* ---- Construccion del DOM ---- */
    raiz = document.createElement("div");
    raiz.className = "edvm-chat" + (inline ? " edvm-inline" : "");

    panel = document.createElement("div");
    panel.className = "edvm-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Asistente virtual E.D. Val Miñor Nigrán");
    panel.innerHTML =
      '<div class="edvm-header">' +
        '<div class="edvm-header-shield">' + ICONO_ESCUDO + "</div>" +
        '<div class="edvm-header-info">' +
          '<div class="edvm-header-title">' + escaparHtml(TITULO) + "</div>" +
          '<div class="edvm-header-status">' + escaparHtml(SUBTITULO) + "</div>" +
        "</div>" +
        '<button class="edvm-header-min" type="button" aria-label="Minimizar">&#8211;</button>' +
      "</div>" +
      '<div class="edvm-messages" aria-live="polite"></div>' +
      '<div class="edvm-suggestions"></div>' +
      '<div class="edvm-input-bar">' +
        '<textarea class="edvm-input" rows="1" placeholder="Escribe tu pregunta..." aria-label="Escribe tu pregunta"></textarea>' +
        '<button class="edvm-send" type="button" aria-label="Enviar">' + ICONO_ENVIAR + "</button>" +
      "</div>" +
      '<div class="edvm-footer">Asistente de <strong>E.D. Val Miñor Nigrán</strong></div>';

    messagesEl = panel.querySelector(".edvm-messages");
    suggestionsEl = panel.querySelector(".edvm-suggestions");
    inputEl = panel.querySelector(".edvm-input");
    sendBtn = panel.querySelector(".edvm-send");

    if (inline) {
      raiz.appendChild(panel);
      (contenedorObjetivo || document.body).appendChild(raiz);
    } else {
      launcher = document.createElement("button");
      launcher.className = "edvm-launcher";
      launcher.type = "button";
      launcher.setAttribute("aria-label", "Abrir asistente virtual");
      launcher.innerHTML = ICONO_CHAT_BLANCO +
        '<span class="edvm-launcher-close">&times;</span>' +
        '<span class="edvm-launcher-badge">1</span>';
      badge = launcher.querySelector(".edvm-launcher-badge");
      raiz.appendChild(panel);
      raiz.appendChild(launcher);
      document.body.appendChild(raiz);

      launcher.addEventListener("click", alternar);
      panel.querySelector(".edvm-header-min").addEventListener("click", cerrar);
    }

    /* ---- Render de mensajes ---- */
    function avatarBot() {
      return '<div class="edvm-msg-avatar">' + ICONO_CHAT_BLANCO + "</div>";
    }

    function pintarMensaje(rol, contenido, esHtmlPlano) {
      var msg = document.createElement("div");
      msg.className = "edvm-msg " + (rol === "user" ? "user" : "bot");
      var cuerpo = esHtmlPlano ? contenido : formatear(contenido);
      msg.innerHTML =
        (rol === "bot" ? avatarBot() : "") +
        '<div class="edvm-bubble">' + cuerpo + "</div>";
      messagesEl.appendChild(msg);
      desplazar();
      return msg;
    }

    function pintarSugerencias(lista) {
      suggestionsEl.innerHTML = "";
      (lista || []).forEach(function (txt) {
        var chip = document.createElement("button");
        chip.className = "edvm-chip";
        chip.type = "button";
        chip.textContent = txt;
        chip.addEventListener("click", function () {
          enviar(txt);
        });
        suggestionsEl.appendChild(chip);
      });
    }

    var typingEl = null;
    function mostrarTyping() {
      ocultarTyping();
      typingEl = document.createElement("div");
      typingEl.className = "edvm-msg bot";
      typingEl.innerHTML = avatarBot() +
        '<div class="edvm-bubble"><div class="edvm-typing"><span></span><span></span><span></span></div></div>';
      messagesEl.appendChild(typingEl);
      desplazar();
    }
    function ocultarTyping() {
      if (typingEl && typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
      typingEl = null;
    }

    function desplazar() {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    /* ---- Logica de envio ---- */
    function enviar(textoForzado) {
      var texto = (typeof textoForzado === "string" ? textoForzado : inputEl.value).trim();
      if (!texto) return;

      pintarMensaje("user", escaparHtml(texto), true);
      inputEl.value = "";
      ajustarAltura();
      pintarSugerencias([]);
      historial.push({ role: "user", content: texto });
      mostrarTyping();

      var demora = 350 + Math.min(texto.length * 12, 650); // sensacion natural

      if (API_ENDPOINT) {
        // Modo avanzado: API de Claude (con respaldo local si falla)
        consultarAPI(historial.slice(-12))
          .then(function (reply) {
            ocultarTyping();
            historial.push({ role: "assistant", content: reply });
            pintarMensaje("bot", reply);
            pintarSugerencias([]);
          })
          .catch(function (err) {
            console.warn("[EDVMChat] Fallo la API, uso respuesta local:", err.message);
            ocultarTyping();
            var res = buscarRespuesta(texto);
            historial.push({ role: "assistant", content: res.texto });
            pintarMensaje("bot", res.texto);
            pintarSugerencias(res.sugerencias);
          });
      } else {
        // Modo local
        setTimeout(function () {
          ocultarTyping();
          var res = buscarRespuesta(texto);
          historial.push({ role: "assistant", content: res.texto });
          pintarMensaje("bot", res.texto);
          pintarSugerencias(res.sugerencias);
        }, demora);
      }
    }

    /* ---- Entrada de texto ---- */
    function ajustarAltura() {
      inputEl.style.height = "auto";
      inputEl.style.height = Math.min(inputEl.scrollHeight, 110) + "px";
    }
    inputEl.addEventListener("input", ajustarAltura);
    inputEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        enviar();
      }
    });
    sendBtn.addEventListener("click", function () { enviar(); });

    /* ---- Apertura / cierre (solo widget flotante) ---- */
    function abrir() {
      abierto = true;
      raiz.classList.add("is-open");
      if (badge) badge.style.display = "none";
      setTimeout(function () { inputEl.focus(); }, 250);
    }
    function cerrar() {
      abierto = false;
      raiz.classList.remove("is-open");
    }
    function alternar() { if (abierto) { cerrar(); } else { abrir(); } }

    /* ---- Mensaje de bienvenida inicial ---- */
    pintarMensaje("bot", KB.BIENVENIDA);
    pintarSugerencias(KB.SUGERENCIAS_INICIALES);

    return { abrir: abrir, cerrar: cerrar, enviar: enviar, raiz: raiz };
  }

  /* ====================================================================
     API PUBLICA
     ==================================================================== */
  var instanciaWidget = null;

  function iniciarWidget() {
    if (instanciaWidget) return instanciaWidget;
    function arranque() {
      instanciaWidget = crearChat({ inline: false });
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", arranque);
    } else {
      arranque();
    }
    return instanciaWidget;
  }

  function iniciarInline(selectorOContenedor) {
    var creado = null;
    var run = function () {
      var cont = typeof selectorOContenedor === "string"
        ? document.querySelector(selectorOContenedor)
        : selectorOContenedor;
      if (!cont) {
        console.error("[EDVMChat] No se encontro el contenedor:", selectorOContenedor);
        return;
      }
      creado = crearChat({ inline: true, contenedor: cont });
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run);
    } else {
      run();
    }
    return creado;
  }

  return {
    iniciarWidget: iniciarWidget,
    iniciarInline: iniciarInline,
    // Expuesto por si se quiere usar el motor desde fuera:
    buscarRespuesta: buscarRespuesta,
    normalizar: normalizar,
    formatear: formatear
  };
})();
