/* ============================================================================
   BASE DE CONOCIMIENTO · Asistente Virtual E.D. Val Miñor Nigrán
   ----------------------------------------------------------------------------
   Este archivo contiene TODA la información que el asistente utiliza para
   responder a las familias y jugadores. Es la ÚNICA fuente de datos: para
   actualizar precios, fechas o enlaces, edita únicamente este archivo.

   Funciona tanto en el navegador (define window.EDVM_KB) como en Node.js
   (module.exports) para que el widget web y el backend con la API de Claude
   compartan exactamente los mismos datos.

   Estructura de cada "tema":
     id          -> identificador único
     keywords    -> palabras/expresiones que disparan el tema (sin tildes,
                    en minúsculas; el motor ya normaliza la pregunta)
     respuesta   -> texto de la respuesta. Admite un formato sencillo:
                      **negrita**            -> texto en negrita
                      [texto](url)           -> enlace
                      línea que empieza por "• "  -> elemento de lista
                      línea en blanco        -> separación de párrafo
                    Los emails, teléfonos y URLs sueltas se enlazan solos.
     sugerencias -> (opcional) botones de seguimiento sugeridos
     social      -> (opcional) true para saludos/despedidas (menor prioridad)
   ============================================================================ */

(function (root, factory) {
  var data = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = data;            // Node.js (backend con la API de Claude)
  } else {
    root.EDVM_KB = data;              // Navegador (widget web)
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* ---- Datos de contacto reutilizables -------------------------------- */
  var CONTACTO = {
    email: "info@edvmnigran.com",
    whatsapp: "610 186 460",
    whatsappUrl: "https://wa.me/34610186460",
    director: "José Tizón",
    telefonoDirector: "627 50 55 13",
    direccion: "Rua Manuel Lemos, 124 · 36370 Nigrán (Pontevedra)",
    instagram: "@edvalminor",
    instagramUrl: "https://www.instagram.com/edvalminor/",
    web: "https://www.edvmnigran.com",
    iban: "ES60 2080 5052 1430 4002 1652",
    banco: "ABANCA"
  };

  /* ---- Enlaces oficiales ---------------------------------------------- */
  var ENLACES = {
    formularioCampus: "https://forms.gle/ctGKydALhFaZNwLP6",
    circularCampus: "https://www.canva.com/design/DAGqps5LNsA/RJOKABSqYsH4iKyef5_0_Q/view",
    formularioCamisetas: "https://forms.gle/cjoA5SG9cxegKsh29",
    socioFamiliar: "https://appuntame.abanca.com/portal/plan/edvalminornigran/16jb92bdys",
    socioIndividual: "https://appuntame.abanca.com/portal/plan/edvalminornigran/16jb92b68z",
    entrenamientos: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6VmFqMJzItjbnA8cCWYEo3K6CSpMQ5AMVMxlnPyZnWvQNJwe-uv5QtbmTuvv3BvPCRB-XBAElLEgn/pubhtml",
    horarioOficina: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSt-LUR4JlfVsa8c1GNYM0hDPNobHOI5VIJgl3MNtHfvUWQjf5b7DaTyj_L6tctOKmYazl2WC1YLAON/pubhtml",
    partidos: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTLEfEYHDObmqbKK1Y73tVUbXIxRWmyuykG4MeoABWpaG79R2F9p9BXAAtRSOrvfkRuL9Dl0_T9kugh/pubhtml",
    cuotas: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTep5vuFaqHWpr_Y86Gypoom0gSOA-vPKODF47os-rLL5eh300OABcrtSdv4bh--5pp9WtUk36iFNAG/pubhtml?gid=1374414062&single=true",
    ropaJugadores: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRNjZlc2Jzg1QsDH3ABqg2dlszHWX4MtA8th_uBvPoXK8iDJGQbCLA49_6svjUs2gvIDTFdaPytiHkO/pubhtml?gid=842211522&single=true",
    torneos: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR0hQyGOrsmNqoDO_g7kfxt1DtcgxmQSq6qA8_7MD6fBBihWufZ56XDcRR0IvyjK_HNlE61COMz7L1U/pubhtml",
    xogade: "https://www.edvmnigran.com/_files/ugd/598442_e0e10e2c96754743b45dda8cbf1a007e.pdf",
    ideario: "https://drive.google.com/drive/folders/0BxskfnPIuX9YU1VFem9Dcy1aTjQ?usp=sharing",
    ureca: "http://www.ureca.es",
    portalSocios: "https://appuntame.abanca.com/plan/#/index.html/16jb8lsc2k"
  };

  /* ---- Temas (intención -> respuesta) --------------------------------- */
  var TEMAS = [
    /* ---------- SALUDO (social) ---------- */
    {
      id: "saludo",
      social: true,
      keywords: ["hola", "buenas", "buenos dias", "buenas tardes", "buenas noches", "hey", "saludos", "ola", "boas", "que tal"],
      respuesta:
        "¡Hola! 🤍❤️ Soy el asistente virtual de la **E.D. Val Miñor Nigrán**. " +
        "Estoy aquí para ayudarte con dudas sobre el club.\n\n" +
        "¿Sobre qué te gustaría saber?",
      sugerencias: ["Campus de verano", "Hacerme socio", "Cuotas", "Contacto"]
    },

    /* ---------- CAMPUS DE VERANO ---------- */
    {
      id: "campus",
      keywords: ["campus", "campus de verano", "campus de futbol", "verano", "turno", "turnos", "campamento", "summer", "actividad verano", "campus 2026", "grupo pereira"],
      respuesta:
        "🏖️ **Campus de Fútbol ED Val Miñor 2026 · Grupo PEREIRA**\n\n" +
        "• **Lugar:** Complejo Deportivo y Social URECA (Nigrán)\n" +
        "• **1.er turno:** del 11 al 15 de agosto\n" +
        "• **2.º turno:** del 25 al 29 de agosto (¡PLAZAS AGOTADAS!)\n" +
        "• **Horario base:** de 09:30 h a 13:30 h\n" +
        "• **Cuota:** 70 € por turno y alumno\n\n" +
        "**Servicios opcionales de conciliación:**\n" +
        "• «Buenos días» (recogida temprana 08:30–09:30 h): +20 €\n" +
        "• Comedor / Media pensión (13:30–15:00 h): +70 €\n\n" +
        "Disfrutaremos de fútbol, talleres y piscina. ¿Quieres saber cómo inscribirte?",
      sugerencias: ["¿Cómo me inscribo al campus?", "Número de cuenta", "Contacto"]
    },
    {
      id: "inscripcion_campus",
      keywords: ["inscribir campus", "inscripcion campus", "apuntar campus", "apuntarme campus", "plaza campus", "formulario campus", "matricula campus", "reservar plaza", "como inscribo", "como me inscribo", "como apuntar", "apuntar", "apuntarme", "apuntar a mi hijo", "inscribir", "inscripcion", "inscribirme", "anotar", "anotarme", "como apunto"],
      respuesta:
        "📝 **Inscripción al Campus de Verano**\n\n" +
        "1. Rellena el formulario oficial: [Formulario de inscripción](" + ENLACES.formularioCampus + ")\n" +
        "2. Haz el ingreso en la cuenta " + CONTACTO.banco + ": **" + CONTACTO.iban + "**\n" +
        "3. Envía el comprobante de pago por email a " + CONTACTO.email + "\n\n" +
        "**Concepto de la transferencia:** nombre y apellidos del niño/a + año de nacimiento.\n" +
        "Ejemplo: «Pedro López - 2010»\n\n" +
        "La plaza queda **validada** solo cuando recibimos el comprobante. " +
        "En un plazo de 2 a 3 días laborables recibirás la confirmación por email.\n\n" +
        "📋 También puedes consultar la [circular informativa](" + ENLACES.circularCampus + ").",
      sugerencias: ["Precio del campus", "Número de cuenta", "Contacto"]
    },

    /* ---------- HAZTE SOCIO ---------- */
    {
      id: "socios",
      keywords: ["socio", "socia", "socios", "hacerme socio", "hazte socio", "abono", "carnet", "carne", "colaborar", "apoyar el club", "ser socio", "cuota socio", "abonado"],
      respuesta:
        "🤝 **Hazte socio y colabora con tu Escuela**\n\n" +
        "• **Abono familiar:** 30 € / temporada\n" +
        "• **Abono individual:** 20 € / temporada\n\n" +
        "**Cómo darte de alta:**\n" +
        "• Familiar: [Tramitar abono familiar](" + ENLACES.socioFamiliar + ")\n" +
        "• Individual: [Tramitar abono individual](" + ENLACES.socioIndividual + ")\n\n" +
        "Una vez dado de alta, escríbenos a " + CONTACTO.email + " indicando dónde quieres recoger el carnet:\n" +
        "• Oficina EDVM (URECA)\n" +
        "• Taquilla de Condomínguez\n\n" +
        "Tu cuota nos ayuda a mantener instalaciones, material, seguros y el futuro de más de 27 equipos. ¡Gracias! 🤍❤️",
      sugerencias: ["Contacto", "Instalaciones", "Cuotas de la temporada"]
    },

    /* ---------- CAMISETAS DE RECUERDO ---------- */
    {
      id: "camisetas",
      keywords: ["camiseta", "camisetas", "camiseta recuerdo", "camiseta de recuerdo", "recuerdo temporada", "talla", "tallas"],
      respuesta:
        "👕 **Camiseta de recuerdo de la temporada**\n\n" +
        "• **Tallas 2 a 14:** 40 €\n" +
        "• **Tallas S a 3XXL:** 45 €\n" +
        "• Marcaje del nombre: **incluido**\n\n" +
        "**Cómo solicitarla:**\n" +
        "1. Rellena la [solicitud de camiseta](" + ENLACES.formularioCamisetas + ")\n" +
        "2. Ingresa el importe en la cuenta: **" + CONTACTO.iban + "**\n" +
        "3. Envía el comprobante a " + CONTACTO.email + "\n\n" +
        "Indica nombre y apellidos del solicitante y la talla. Ejemplo: «Pedro Miguel Álvarez - Talla 6».\n\n" +
        "ℹ️ El plazo de pedidos se cerró el 19 de mayo. Si llegas más tarde, escríbenos por email para confirmar disponibilidad.",
      sugerencias: ["Ropa oficial", "Número de cuenta", "Contacto"]
    },
    {
      id: "ropa_oficial",
      keywords: ["ropa oficial", "ropa de jugador", "ropa jugador", "ropa portero", "ropa de portero", "portero", "equipacion oficial", "equipacion", "equipamiento", "material deportivo"],
      respuesta:
        "🧤 **Ropa y equipación oficial**\n\n" +
        "Disponemos de ropa oficial de jugador y de portero. Puedes consultar el catálogo y las tallas aquí:\n" +
        "• [Catálogo de equipación de jugadores](" + ENLACES.ropaJugadores + ")\n\n" +
        "Para pedidos o dudas sobre la ropa de portero, escríbenos a " + CONTACTO.email + " o por WhatsApp al " + CONTACTO.whatsapp + ".",
      sugerencias: ["Camisetas de recuerdo", "Contacto"]
    },

    /* ---------- FIESTA FIN DE TEMPORADA ---------- */
    {
      id: "fiesta",
      keywords: ["fiesta", "fin de temporada", "fiesta fin de temporada", "evento", "celebracion", "fiesta del club", "27 de junio", "que dia es la fiesta"],
      respuesta:
        "🎉 **Gran fiesta de fin de temporada**\n\n" +
        "• **Fecha:** sábado 27 de junio\n" +
        "• **Lugar:** Condomínguez\n\n" +
        "Un día especial para reunir a todo el club: jugadores, amigos y familias. Habrá fútbol, diversión acuática, baile, sorpresas y mucha risa. 🤍❤️⚽\n\n" +
        "El programa completo de actividades se anuncia a mediados de junio. ¡Reserva la fecha y no te lo pierdas!",
      sugerencias: ["Instalaciones", "Contacto"]
    },

    /* ---------- CUOTAS DE LA TEMPORADA ---------- */
    {
      id: "cuotas",
      keywords: ["cuota", "cuotas", "precio temporada", "cuotas temporada", "precio", "precios", "pago temporada", "mensualidad", "cuanto cuesta jugar", "cuanto vale"],
      respuesta:
        "💶 **Cuotas de la temporada**\n\n" +
        "Los importes, plazos y modalidades de pago de cada equipo y categoría están detallados en la tabla oficial:\n" +
        "• [Ver cuotas por categoría](" + ENLACES.cuotas + ")\n\n" +
        "Si tienes dudas sobre tu cuota concreta, escríbenos a " + CONTACTO.email + " o pásate por la oficina (URECA).",
      sugerencias: ["Horario de oficina", "Número de cuenta", "Contacto"]
    },

    /* ---------- ENTRENAMIENTOS ---------- */
    {
      id: "entrenamientos",
      keywords: ["entrenamiento", "entrenamientos", "entreno", "entrenos", "entrena", "entrenan", "entrenamos", "horario entreno", "hora de entreno", "dias de entreno", "cuando entrena", "cuando entrenan", "a que hora entrenan", "horario entrenamiento"],
      respuesta:
        "📋 **Entrenamientos**\n\n" +
        "Los días y horas de entrenamiento de cada equipo se actualizan en esta hoja:\n" +
        "• [Consultar entrenamientos](" + ENLACES.entrenamientos + ")\n\n" +
        "Si no encuentras tu equipo o tienes dudas, escríbenos a " + CONTACTO.email + ".",
      sugerencias: ["Calendario de partidos", "Contacto"]
    },

    /* ---------- PARTIDOS ---------- */
    {
      id: "partidos",
      keywords: ["partido", "partidos", "calendario", "calendario partidos", "convocatoria", "cuando juega", "cuando jugamos", "donde juega", "proximo partido"],
      respuesta:
        "⚽ **Calendario de partidos**\n\n" +
        "Consulta dónde y cuándo juegan nuestros equipos este fin de semana:\n" +
        "• [Calendario de partidos](" + ENLACES.partidos + ")\n\n" +
        "Los partidos oficiales como local se disputan en el Campo Municipal de Nigrán.",
      sugerencias: ["Entrenamientos", "Instalaciones", "Torneos"]
    },

    /* ---------- HORARIO DE OFICINA ---------- */
    {
      id: "horario_oficina",
      keywords: ["oficina", "horario oficina", "horario de oficina", "atencion", "cuando atienden", "horario atencion", "secretaria", "administracion"],
      respuesta:
        "🕐 **Horario de oficina**\n\n" +
        "Nuestro equipo administrativo te atiende presencialmente en el Complejo URECA (Nigrán). Consulta el horario actualizado aquí:\n" +
        "• [Horario de oficina](" + ENLACES.horarioOficina + ")\n\n" +
        "También puedes escribirnos a " + CONTACTO.email + " o por WhatsApp al " + CONTACTO.whatsapp + ".",
      sugerencias: ["Contacto", "Instalaciones"]
    },

    /* ---------- CONTACTO ---------- */
    {
      id: "contacto",
      keywords: ["contacto", "contactar", "telefono", "email", "correo", "whatsapp", "llamar", "escribir", "direccion", "donde estais", "ubicacion", "como os contacto", "numero"],
      respuesta:
        "📬 **Contacto E.D. Val Miñor Nigrán**\n\n" +
        "• **Email:** " + CONTACTO.email + "\n" +
        "• **WhatsApp / Teléfono:** " + CONTACTO.whatsapp + "\n" +
        "• **Entrenadores y competición:** " + CONTACTO.director + " · " + CONTACTO.telefonoDirector + "\n" +
        "• **Dirección:** " + CONTACTO.direccion + "\n" +
        "• **Instagram:** [" + CONTACTO.instagram + "](" + CONTACTO.instagramUrl + ")\n\n" +
        "Estamos encantados de ayudarte. 🤍❤️",
      sugerencias: ["Horario de oficina", "Instalaciones"]
    },

    /* ---------- CUENTA BANCARIA ---------- */
    {
      id: "cuenta",
      keywords: ["cuenta", "iban", "numero de cuenta", "transferencia", "ingreso", "como pago", "donde pago", "abanca", "datos bancarios", "como ingreso"],
      respuesta:
        "💳 **Número de cuenta (" + CONTACTO.banco + ")**\n\n" +
        "**" + CONTACTO.iban + "**\n\n" +
        "Recuerda indicar siempre el concepto correcto (por ejemplo, nombre y apellidos del niño/a + año de nacimiento) y enviar el comprobante de pago a " + CONTACTO.email + " para validar tu solicitud.",
      sugerencias: ["Inscripción al campus", "Cuotas", "Camisetas de recuerdo"]
    },

    /* ---------- INSTALACIONES ---------- */
    {
      id: "instalaciones",
      keywords: ["instalacion", "instalaciones", "campo", "campos", "ureca", "condominguez", "donde juegan", "donde entrenan", "donde se juega", "complejo", "estadio"],
      respuesta:
        "🏟️ **Nuestras instalaciones**\n\n" +
        "• **Campo Municipal de Nigrán:** campo base donde disputamos los partidos oficiales como local.\n" +
        "• **Complejo Deportivo URECA:** sede de la oficina, entrenamientos entre semana y el Campus de Verano. [Web URECA](" + ENLACES.ureca + ")\n" +
        "• **Taquilla Condomínguez:** punto de atención los días de partido y recogida de carnets de socios.",
      sugerencias: ["Partidos", "Horario de oficina", "Contacto"]
    },

    /* ---------- CATEGORÍAS / EQUIPOS ---------- */
    {
      id: "categorias",
      keywords: ["categoria", "categorias", "edad", "edades", "equipo", "equipos", "prebenjamin", "benjamin", "alevin", "infantil", "cadete", "juvenil", "biberon", "biberones", "aficionados", "que edad", "que categoria"],
      respuesta:
        "👦👧 **Categorías y equipos**\n\n" +
        "Contamos con más de **27 equipos** que cubren todo el ciclo formativo:\n" +
        "• Biberones · Prebenjamín · Benjamín · Alevín · Infantil · Cadete · Juvenil · Aficionados\n\n" +
        "Acogemos a jugadores y jugadoras desde sus primeros toques al balón hasta la etapa de aficionados. " +
        "Para saber qué categoría corresponde a tu hijo/a y cómo inscribirlo, escríbenos a " + CONTACTO.email + " o por WhatsApp al " + CONTACTO.whatsapp + ".",
      sugerencias: ["Cuotas", "Entrenamientos", "Contacto"]
    },

    /* ---------- IDEARIO Y RRI ---------- */
    {
      id: "ideario",
      keywords: ["ideario", "rri", "normativa", "reglamento", "valores", "normas", "regimen interno", "filosofia"],
      respuesta:
        "📖 **Ideario y Reglamento de Régimen Interno (RRI)**\n\n" +
        "Nuestro trabajo se sustenta en formar excelentes personas, no solo futbolistas: respeto, compromiso, esfuerzo y trabajo en equipo.\n\n" +
        "Puedes consultar el ideario y la normativa completa aquí:\n" +
        "• [Ideario & RRI](" + ENLACES.ideario + ")",
      sugerencias: ["Sobre el club", "Contacto"]
    },

    /* ---------- XOGADE / SEGURO ---------- */
    {
      id: "xogade",
      keywords: ["xogade", "seguro", "seguro deportivo", "protocolo", "lesion", "mutua", "cobertura", "accidente"],
      respuesta:
        "📄 **Protocolo Xogade (seguro deportivo)**\n\n" +
        "Documento oficial de la Xunta de Galicia para el deporte base, con la normativa y seguros vigentes:\n" +
        "• [Descargar protocolo Xogade (PDF)](" + ENLACES.xogade + ")\n\n" +
        "Para cualquier gestión relacionada con una lesión o el seguro, contacta con " + CONTACTO.email + ".",
      sugerencias: ["Contacto", "Ideario & RRI"]
    },

    /* ---------- TORNEOS ---------- */
    {
      id: "torneos",
      keywords: ["torneo", "torneos", "competicion externa", "competiciones", "campeonato"],
      respuesta:
        "🏆 **Torneos y competiciones**\n\n" +
        "Seguimiento de los torneos locales, regionales o nacionales en los que participan nuestros equipos fuera de su liga:\n" +
        "• [Ver torneos](" + ENLACES.torneos + ")",
      sugerencias: ["Partidos", "Contacto"]
    },

    /* ---------- CONGRESO DE ENTRENADORES ---------- */
    {
      id: "congreso",
      keywords: ["congreso", "congreso de entrenadores", "formacion entrenadores", "femxa", "ponencia", "jornada tecnica", "curso entrenadores"],
      respuesta:
        "🎓 **I Congreso de Entrenadores de Fútbol Base FEMXA**\n\n" +
        "• **Fechas:** jueves 26 y viernes 27 de diciembre\n" +
        "• **Horario:** mañana 10:00–14:00 h · tarde 16:00–21:00 h\n" +
        "• **Lugar:** Auditorio del Concello de Nigrán\n" +
        "• **Pase completo:** 50 € · **½ jornada:** 30 €\n" +
        "• **Director:** " + CONTACTO.director + " · Información: " + CONTACTO.telefonoDirector + "\n\n" +
        "Organizado por la EDVM con el apoyo de la Federación Galega de Fútbol y el Concello de Nigrán.",
      sugerencias: ["Contacto"]
    },

    /* ---------- PATROCINADORES ---------- */
    {
      id: "patrocinadores",
      keywords: ["patrocinador", "patrocinadores", "patrocinio", "sponsor", "colaborador", "colaboradores", "empresa", "publicidad", "anunciarme"],
      respuesta:
        "🤝 **Patrocinadores y colaboradores**\n\n" +
        "Gracias al tejido empresarial que apuesta por el deporte base. Patrocinador principal: **Grupo Pereira**. " +
        "Nos acompañan Kömmerling, Several Energy, GADIS, Clínica Nimo, Aceites Abril y Pescanova, además de la Diputación de Pontevedra, el Concello de Nigrán y URECA.\n\n" +
        "¿Tienes una empresa y quieres vincular tu marca a nuestros valores? Escríbenos a " + CONTACTO.email + ".",
      sugerencias: ["Sobre el club", "Contacto"]
    },

    /* ---------- SOBRE EL CLUB / HISTORIA ---------- */
    {
      id: "historia",
      keywords: ["historia", "fundacion", "desde cuando", "1996", "quienes sois", "quien sois", "sobre el club", "sobre vosotros", "que es edvm", "informacion del club", "quienes somos"],
      respuesta:
        "🏅 **Sobre la E.D. Val Miñor Nigrán**\n\n" +
        "Somos una escuela de fútbol fundada en **1996**, referente del fútbol base en Nigrán, el Val Miñor y Galicia. " +
        "Contamos con más de **27 equipos** y más de **300 jugadores**, desde la categoría de biberones hasta aficionados.\n\n" +
        "Nuestro principal objetivo es formar excelentes personas, no solo futbolistas. 🤍❤️",
      sugerencias: ["Categorías", "Ideario & RRI", "Hacerme socio"]
    },

    /* ---------- REDES SOCIALES ---------- */
    {
      id: "redes",
      keywords: ["instagram", "redes", "redes sociales", "seguir", "rrss", "facebook"],
      respuesta:
        "📸 **Síguenos en redes**\n\n" +
        "Toda la actualidad diaria del club en Instagram: [" + CONTACTO.instagram + "](" + CONTACTO.instagramUrl + ").\n" +
        "Web oficial: " + CONTACTO.web,
      sugerencias: ["Contacto"]
    },

    /* ---------- AGRADECIMIENTO (social) ---------- */
    {
      id: "agradecimiento",
      social: true,
      keywords: ["gracias", "muchas gracias", "genial", "perfecto", "estupendo", "vale gracias", "mil gracias", "grazas"],
      respuesta:
        "¡De nada! 🤍❤️ Si te surge cualquier otra duda, aquí estaré. ¡Aúpa Val Miñor! ⚽",
      sugerencias: ["Campus de verano", "Hacerme socio", "Contacto"]
    },

    /* ---------- DESPEDIDA (social) ---------- */
    {
      id: "despedida",
      social: true,
      keywords: ["adios", "hasta luego", "chao", "chau", "nada mas", "eso es todo", "hasta pronto", "me voy"],
      respuesta:
        "¡Hasta pronto! Gracias por contactar con la E.D. Val Miñor Nigrán. 🤍❤️⚽",
      sugerencias: []
    }
  ];

  /* ---- Respuesta cuando no se reconoce la pregunta --------------------- */
  var FALLBACK =
    "Lo siento, no estoy seguro de haber entendido tu pregunta. 🤔\n\n" +
    "Puedo ayudarte con: **campus de verano**, **inscripciones**, **hacerte socio**, " +
    "**cuotas**, **camisetas**, **entrenamientos**, **partidos**, **instalaciones** o **contacto**.\n\n" +
    "Si lo prefieres, escríbenos directamente a " + CONTACTO.email + " o por WhatsApp al " + CONTACTO.whatsapp + " y te atenderemos personalmente.";

  /* ---- Mensaje de bienvenida del asistente ---------------------------- */
  var BIENVENIDA =
    "¡Hola! 👋 Soy el **asistente virtual** de la E.D. Val Miñor Nigrán. " +
    "Pregúntame lo que necesites sobre el club y te ayudaré al instante.";

  var SUGERENCIAS_INICIALES = [
    "Campus de verano 2026",
    "¿Cómo me hago socio?",
    "Cuotas de la temporada",
    "Camisetas de recuerdo",
    "Contacto"
  ];

  /* ====================================================================
     CONTEXTO_IA
     Versión en prosa de toda la información, pensada para usarse como
     "system prompt" cuando se activa el modo avanzado con la API de Claude.
     Mantén esta sección coherente con los temas de arriba.
     ==================================================================== */
  var CONTEXTO_IA = [
    "# E.D. Val Miñor Nigrán — Información oficial del club",
    "",
    "## El club",
    "Escuela de fútbol fundada en 1996. Referente del fútbol base en Nigrán, el Val Miñor y Galicia.",
    "Más de 27 equipos y más de 300 jugadores. Categorías: biberones, prebenjamín, benjamín, alevín,",
    "infantil, cadete, juvenil y aficionados. El objetivo es formar excelentes personas, no solo futbolistas.",
    "",
    "## Contacto",
    "- Email (vía principal): " + CONTACTO.email,
    "- WhatsApp / Teléfono: " + CONTACTO.whatsapp,
    "- Atención a entrenadores y competición: " + CONTACTO.director + " (" + CONTACTO.telefonoDirector + ")",
    "- Dirección: " + CONTACTO.direccion,
    "- Instagram: " + CONTACTO.instagram + " (" + CONTACTO.instagramUrl + ")",
    "- Web: " + CONTACTO.web,
    "- Número de cuenta " + CONTACTO.banco + ": " + CONTACTO.iban,
    "",
    "## Campus de Fútbol 2026 (Grupo PEREIRA)",
    "- Lugar: Complejo Deportivo y Social URECA (Nigrán).",
    "- 1.er turno: del 11 al 15 de agosto.",
    "- 2.º turno: del 25 al 29 de agosto (PLAZAS AGOTADAS).",
    "- Horario base: 09:30 a 13:30 h.",
    "- Cuota: 70 € por turno y alumno.",
    "- Servicio opcional «Buenos días» (recogida 08:30–09:30): +20 €.",
    "- Servicio opcional de comedor / media pensión (13:30–15:00): +70 €.",
    "- Inscripción: rellenar el formulario oficial (" + ENLACES.formularioCampus + ") e ingresar la cuota en la cuenta " + CONTACTO.iban + ".",
    "  La plaza solo queda validada cuando se recibe el comprobante de pago por email a " + CONTACTO.email + ".",
    "  Concepto de la transferencia: nombre y apellidos del niño/a + año de nacimiento. Ejemplo: 'Pedro López - 2010'.",
    "  La confirmación se recibe por email en un plazo de 2 a 3 días laborables.",
    "",
    "## Hazte socio",
    "- Abono familiar: 30 € por temporada.",
    "- Abono individual: 20 € por temporada.",
    "- Alta: familiar (" + ENLACES.socioFamiliar + ") o individual (" + ENLACES.socioIndividual + ").",
    "- Tras el alta, escribir a " + CONTACTO.email + " indicando dónde recoger el carnet: Oficina EDVM (URECA) o Taquilla de Condomínguez.",
    "",
    "## Camiseta de recuerdo de la temporada",
    "- Tallas 2 a 14: 40 €. Tallas S a 3XXL: 45 €. Marcaje del nombre incluido.",
    "- Solicitud: " + ENLACES.formularioCamisetas + ". Ingreso en la cuenta " + CONTACTO.iban + " y comprobante a " + CONTACTO.email + ".",
    "- Indicar nombre y apellidos del solicitante y la talla. Ejemplo: 'Pedro Miguel Álvarez - Talla 6'.",
    "- El plazo de pedidos se cerró el 19 de mayo; para pedidos posteriores, confirmar disponibilidad por email.",
    "- También hay ropa oficial de jugador y de portero (catálogo de jugadores: " + ENLACES.ropaJugadores + ").",
    "",
    "## Fiesta de fin de temporada",
    "- Sábado 27 de junio, en Condomínguez. Programa completo a mediados de junio.",
    "- Habrá fútbol, diversión acuática, baile y sorpresas para jugadores, amigos y familias.",
    "",
    "## Recursos y enlaces",
    "- Cuotas de la temporada: " + ENLACES.cuotas,
    "- Entrenamientos: " + ENLACES.entrenamientos,
    "- Calendario de partidos: " + ENLACES.partidos,
    "- Horario de oficina: " + ENLACES.horarioOficina,
    "- Torneos: " + ENLACES.torneos,
    "- Protocolo Xogade (seguro, PDF): " + ENLACES.xogade,
    "- Ideario y RRI: " + ENLACES.ideario,
    "",
    "## Instalaciones",
    "- Campo Municipal de Nigrán: partidos oficiales como local.",
    "- Complejo Deportivo URECA: oficina, entrenamientos entre semana y campus.",
    "- Taquilla Condomínguez: atención los días de partido y recogida de carnets de socios.",
    "",
    "## Congreso de Entrenadores (I edición, FEMXA)",
    "- Jueves 26 y viernes 27 de diciembre. Mañana 10:00–14:00, tarde 16:00–21:00. Auditorio del Concello de Nigrán.",
    "- Pase completo: 50 €. Media jornada: 30 €. Director: " + CONTACTO.director + " (" + CONTACTO.telefonoDirector + ").",
    "",
    "## Patrocinadores",
    "- Principal: Grupo Pereira. También: Kömmerling, Several Energy, GADIS, Clínica Nimo, Aceites Abril, Pescanova.",
    "- Instituciones: Diputación de Pontevedra, Concello de Nigrán y URECA."
  ].join("\n");

  return {
    CONTACTO: CONTACTO,
    ENLACES: ENLACES,
    TEMAS: TEMAS,
    FALLBACK: FALLBACK,
    BIENVENIDA: BIENVENIDA,
    SUGERENCIAS_INICIALES: SUGERENCIAS_INICIALES,
    CONTEXTO_IA: CONTEXTO_IA
  };
});
