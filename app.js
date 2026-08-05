/* =========================================================
   LUZ EN FAMILIA — app.js
   MVP V1
   ========================================================= */

"use strict";

const STORAGE_KEY = "luzEnFamiliaV1";

/* =========================================================
   DATOS BASE
   ========================================================= */

const LEVELS = [
  { name: "Semilla", icon: "🌱", min: 0, max: 149 },
  { name: "Brote", icon: "🌿", min: 150, max: 349 },
  { name: "Árbol", icon: "🌳", min: 350, max: 699 },
  { name: "Jardín", icon: "🌻", min: 700, max: 1199 },
  { name: "Luz en Familia", icon: "✨", min: 1200, max: Infinity }
];

const DEFAULT_STATE = {
  seeds: 0,
  streak: 1,
  gamesPlayed: 0,
  storiesRead: 0,
  completedMissions: [],
  seenContent: [],
  favorites: [],
  unlockedCollectibles: ["seed"],
  profiles: [
    {
      id: "mom",
      name: "Mamá",
      emoji: "👩",
      type: "adult"
    },
    {
      id: "child1",
      name: "Pequeño/a",
      emoji: "🧒",
      type: "child"
    }
  ],
  lastVisit: null,
  dailyKey: null,
  dailySelection: {}
};


/* =========================================================
   CONTENIDO DINÁMICO
   ========================================================= */

const KID_DAILY = [
  {
    id: "kid-who",
    title: "¿Quién soy?",
    description: "Descubre un personaje bíblico usando el menor número de pistas.",
    seeds: 20,
    game: "who"
  },
  {
    id: "kid-book",
    title: "Descifra el libro",
    description: "Ordena las letras y descubre qué libro de la Biblia se esconde.",
    seeds: 15,
    game: "book"
  },
  {
    id: "kid-memory",
    title: "Memoria de la Palabra",
    description: "Encuentra las parejas escondidas y entrena tu memoria.",
    seeds: 20,
    game: "memory"
  },
  {
    id: "kid-quiz",
    title: "Reto bíblico",
    description: "Responde preguntas y descubre cuánto has aprendido.",
    seeds: 20,
    game: "quiz"
  },
  {
    id: "kid-heart",
    title: "Mi corazón hoy",
    description: "Descubre qué puede enseñarte la Biblia sobre lo que sientes.",
    seeds: 15,
    game: "heart"
  }
];

const FAMILY_DAILY = [
  {
    id: "fam-gratitude",
    title: "Una familia agradecida",
    description: "Descubrid juntos por qué la gratitud puede transformar un día.",
    section: "values"
  },
  {
    id: "fam-neighbor",
    title: "¿Quién es mi prójimo?",
    description: "Una enseñanza para conversar sobre ayudar y cuidar a los demás.",
    section: "parables"
  },
  {
    id: "fam-courage",
    title: "Valentía cuando tenemos miedo",
    description: "Un momento para hablar en familia sobre confianza y valentía.",
    section: "stories"
  },
  {
    id: "fam-forgive",
    title: "Aprender a perdonar",
    description: "Una conversación familiar sobre perdón, amor y nuevos comienzos.",
    section: "values"
  }
];


/* =========================================================
   MISIONES
   ========================================================= */

const DAILY_MISSIONS = [
  {
    id: "daily-thanks",
    icon: "🙏",
    title: "Tres razones para agradecer",
    description: "Cada persona comparte tres cosas por las que quiere dar gracias.",
    time: "5 min",
    seeds: 20
  },
  {
    id: "daily-kind",
    icon: "💛",
    title: "Un gesto de amor",
    description: "Haz hoy algo amable por alguien sin esperar nada a cambio.",
    time: "Durante el día",
    seeds: 20
  },
  {
    id: "daily-pray",
    icon: "🕊️",
    title: "Oramos juntos",
    description: "Dedica unos minutos a orar por una persona que lo necesite.",
    time: "5 min",
    seeds: 15
  }
];

const WEEKLY_MISSIONS = [
  {
    id: "week-table",
    icon: "🍽️",
    title: "Una comida sin pantallas",
    description: "Compartid una comida conversando sobre lo mejor de vuestra semana.",
    time: "Esta semana",
    seeds: 35
  },
  {
    id: "week-help",
    icon: "🤝",
    title: "Servimos juntos",
    description: "Elegid una pequeña acción para ayudar a otra persona como familia.",
    time: "Esta semana",
    seeds: 45
  },
  {
    id: "week-story",
    icon: "📖",
    title: "Noche de historia bíblica",
    description: "Escoged una historia bíblica, leedla y compartid qué aprendió cada uno.",
    time: "20 min",
    seeds: 40
  }
];


/* =========================================================
   CONTENIDO PARA MAMÁ

   Nota:
   En esta V1 usamos una biblioteca curada.
   No se generan citas bíblicas automáticamente.
   ========================================================= */

const MOM_CONTENT = {
  peace: [
    {
      id: "mom-peace-1",
      title: "Un momento para descansar",
      verse: "«La paz les dejo; mi paz les doy.» — Juan 14:27",
      reflection:
        "No todo tiene que resolverse hoy. Hay momentos en los que el corazón necesita dejar de correr y recordar que puede descansar en Dios.",
      prayer:
        "Señor, aquieta mis pensamientos y ayúdame a recibir tu paz en medio de todo lo que hoy ocupa mi corazón.",
      action:
        "Regálate dos minutos de silencio. Respira despacio y entrega a Dios aquello que no puedes controlar."
    }
  ],

  worried: [
    {
      id: "mom-worry-1",
      title: "Cuando mi mente no se detiene",
      verse: "«Depositen en él toda ansiedad, porque él cuida de ustedes.» — 1 Pedro 5:7",
      reflection:
        "La preocupación intenta hacernos vivir mañana antes de tiempo. Hoy puedes reconocer lo que te inquieta y ponerlo delante de Dios.",
      prayer:
        "Dios mío, tú conoces lo que me preocupa. Dame sabiduría para hacer lo que me corresponde y confianza para entregarte lo demás.",
      action:
        "Escribe una preocupación. Debajo, separa lo que puedes hacer hoy de aquello que necesitas entregar."
    }
  ],

  tired: [
    {
      id: "mom-tired-1",
      title: "También necesitas descanso",
      verse: "«Vengan a mí todos ustedes que están cansados y agobiados, y yo les daré descanso.» — Mateo 11:28",
      reflection:
        "Cuidar, acompañar y sostener a otros también cansa. Reconocerlo no disminuye tu amor. Tu corazón necesita espacios donde también pueda ser cuidado.",
      prayer:
        "Jesús, hoy vengo cansada. Renueva mis fuerzas y enséñame a descansar sin sentir que debo hacerlo todo.",
      action:
        "Elige hoy una cosa que puedas simplificar, posponer o pedir que alguien te ayude a realizar."
    }
  ],

  fear: [
    {
      id: "mom-fear-1",
      title: "No caminar sola",
      verse: "«No temas, porque yo estoy contigo.» — Isaías 41:10",
      reflection:
        "El miedo puede aparecer incluso cuando tenemos fe. La invitación no siempre es dejar de sentirlo inmediatamente, sino recordar quién camina contigo.",
      prayer:
        "Señor, acompáñame en aquello que hoy me da miedo. Dame claridad para avanzar paso a paso.",
      action:
        "Nombra aquello que te da miedo y piensa solamente en el siguiente paso, no en todo el camino."
    }
  ],

  hope: [
    {
      id: "mom-hope-1",
      title: "Todavía hay esperanza",
      verse: "«Que el Dios de la esperanza los llene de toda alegría y paz.» — Romanos 15:13",
      reflection:
        "Hay temporadas en las que cuesta ver lo que viene después. La esperanza no exige tener todas las respuestas; permite seguir caminando.",
      prayer:
        "Dios de esperanza, ayúdame a mirar este día con nuevos ojos y a reconocer las pequeñas luces que todavía están presentes.",
      action:
        "Escribe una cosa buena que todavía esperas y una pequeña señal de esperanza que ya puedas reconocer hoy."
    }
  ],

  trust: [
    {
      id: "mom-trust-1",
      title: "Confiar paso a paso",
      verse: "«Confía en el Señor de todo corazón.» — Proverbios 3:5",
      reflection:
        "Confiar no significa entenderlo todo. A veces significa avanzar con lo que hoy sabemos y entregar a Dios lo que todavía no podemos ver.",
      prayer:
        "Señor, ayúdame a confiar incluso cuando no entiendo todo el camino.",
      action:
        "Piensa en una decisión o situación que estés intentando controlar completamente y entrégala en oración."
    }
  ],

  sad: [
    {
      id: "mom-sad-1",
      title: "Dios también recibe tus lágrimas",
      verse: "«El Señor está cerca de los quebrantados de corazón.» — Salmo 34:18",
      reflection:
        "No necesitas disfrazar la tristeza para acercarte a Dios. Puedes presentarte tal como estás y permitir que este momento sea también una oración.",
      prayer:
        "Señor, hoy mi corazón pesa. Quédate cerca de mí y ayúdame a atravesar este momento con esperanza.",
      action:
        "No intentes solucionar inmediatamente lo que sientes. Date unos minutos para reconocerlo y hablarlo con Dios."
    }
  ],

  grateful: [
    {
      id: "mom-grateful-1",
      title: "Guardar lo bueno en el corazón",
      verse: "«Den gracias a Dios en toda situación.» — 1 Tesalonicenses 5:18",
      reflection:
        "La gratitud nos ayuda a reconocer regalos que pueden pasar desapercibidos entre las obligaciones de cada día.",
      prayer:
        "Gracias, Señor, por las personas, oportunidades y pequeños regalos que has puesto hoy en mi camino.",
      action:
        "Anota tres cosas concretas por las que hoy quieras dar gracias."
    }
  ]
};


/* =========================================================
   BIBLIA EN FAMILIA
   ========================================================= */

const BIBLE_STORIES = [
  {
    id: "good-samaritan",
    category: "parables",
    icon: "🤝",
    title: "El buen samaritano",
    reference: "Lucas 10:25-37",
    summary:
      "Jesús cuenta la historia de un hombre herido y de una persona que decidió detenerse para ayudarlo.",
    lesson:
      "Amar al prójimo no consiste solamente en sentir compasión. También significa detenernos, acercarnos y hacer algo concreto.",
    question:
      "¿Hay alguien cerca de nosotros que podría necesitar ayuda, compañía o una palabra amable?",
    mission:
      "Como familia, elegid esta semana una acción concreta para ayudar a otra persona."
  },

  {
    id: "storm",
    category: "jesus",
    icon: "⛵",
    title: "Jesús calma la tormenta",
    reference: "Marcos 4:35-41",
    summary:
      "Mientras cruzaban el lago, una gran tormenta asustó a los discípulos. Jesús estaba con ellos en la barca.",
    lesson:
      "Hay momentos que nos asustan. Esta historia invita a recordar que el miedo no tiene que enfrentarse en soledad.",
    question:
      "¿Qué situaciones se sienten como una tormenta para nuestra familia y cómo podemos acompañarnos mejor?",
    mission:
      "Cada persona comparte una preocupación y los demás escuchan sin interrumpir."
  },

  {
    id: "lost-sheep",
    category: "parables",
    icon: "🐑",
    title: "La oveja perdida",
    reference: "Lucas 15:3-7",
    summary:
      "Jesús habla de un pastor que sale a buscar una oveja que se había perdido.",
    lesson:
      "Cada persona tiene valor. Nadie debería sentirse invisible, olvidado o demasiado lejos para ser buscado.",
    question:
      "¿Qué podemos hacer para que cada persona de nuestra familia sepa que es importante?",
    mission:
      "Cada miembro de la familia dice algo que valora de otra persona."
  },

  {
    id: "david-goliath",
    category: "stories",
    icon: "🪨",
    title: "David y Goliat",
    reference: "1 Samuel 17",
    summary:
      "David se enfrentó a un desafío que parecía mucho más grande que él.",
    lesson:
      "La valentía no significa ser el más fuerte. También puede significar confiar, prepararse y dar un paso cuando algo parece difícil.",
    question:
      "¿Qué desafío parece grande para nosotros en este momento?",
    mission:
      "Elegid un desafío familiar y escribid el primer pequeño paso que podéis dar."
  },

  {
    id: "creation",
    category: "map",
    icon: "🌍",
    title: "El comienzo de la historia",
    reference: "Génesis 1",
    summary:
      "Génesis abre la Biblia hablando de Dios como creador y del comienzo de la historia bíblica.",
    lesson:
      "La creación invita a mirar el mundo con asombro, cuidado y gratitud.",
    question:
      "¿Qué parte de la creación disfrutamos especialmente como familia?",
    mission:
      "Salid unos minutos al exterior y cada persona elige algo de la creación por lo que quiera agradecer."
  }
];


/* =========================================================
   JUEGOS
   ========================================================= */

const WHO_AM_I = [
  {
    id: "who-moses",
    answer: "Moisés",
    clues: [
      "Cuando era bebé fui colocado en una cesta.",
      "Crecí en Egipto.",
      "Dios me habló desde una zarza que ardía.",
      "Guié al pueblo de Israel fuera de Egipto."
    ],
    options: ["Moisés", "David", "Pedro", "Noé"]
  },
  {
    id: "who-noah",
    answer: "Noé",
    clues: [
      "Dios me pidió realizar una tarea enorme.",
      "Trabajé con madera.",
      "Mi familia entró conmigo.",
      "Construí un arca antes del diluvio."
    ],
    options: ["Abraham", "Noé", "José", "Samuel"]
  },
  {
    id: "who-david",
    answer: "David",
    clues: [
      "Cuando era joven cuidaba ovejas.",
      "Sabía tocar música.",
      "Me enfrenté a un guerrero gigante.",
      "Más tarde fui rey de Israel."
    ],
    options: ["Salomón", "David", "Josué", "Pablo"]
  },
  {
    id: "who-peter",
    answer: "Pedro",
    clues: [
      "Trabajaba como pescador.",
      "Jesús me llamó para seguirlo.",
      "Intenté caminar sobre el agua hacia Jesús.",
      "Fui uno de los doce apóstoles."
    ],
    options: ["Pedro", "Mateo", "Lucas", "Esteban"]
  }
];

const BIBLE_BOOKS = [
  "GÉNESIS",
  "ÉXODO",
  "LEVÍTICO",
  "NÚMEROS",
  "JOSUÉ",
  "JUECES",
  "RUT",
  "SALMOS",
  "PROVERBIOS",
  "MATEO",
  "MARCOS",
  "LUCAS",
  "JUAN",
  "ROMANOS"
];

const QUIZ_QUESTIONS = [
  {
    id: "quiz-1",
    question: "¿Quién construyó el arca?",
    options: ["Moisés", "Noé", "David", "Pedro"],
    answer: "Noé",
    explanation:
      "Noé construyó el arca siguiendo las instrucciones de Dios."
  },
  {
    id: "quiz-2",
    question: "¿Cuál es el primer libro de la Biblia?",
    options: ["Éxodo", "Mateo", "Génesis", "Salmos"],
    answer: "Génesis",
    explanation:
      "Génesis abre la Biblia y presenta el comienzo de la historia bíblica."
  },
  {
    id: "quiz-3",
    question: "¿Quién derrotó a Goliat?",
    options: ["David", "Salomón", "Samuel", "Josué"],
    answer: "David",
    explanation:
      "David se enfrentó a Goliat confiando en Dios."
  },
  {
    id: "quiz-4",
    question: "¿Cuál de estos hombres era pescador antes de seguir a Jesús?",
    options: ["Pedro", "Pablo", "Lucas", "Esteban"],
    answer: "Pedro",
    explanation:
      "Pedro era pescador cuando Jesús lo llamó para seguirlo."
  },
  {
    id: "quiz-5",
    question: "¿En qué parte de la Biblia encontramos las parábolas de Jesús?",
    options: [
      "En los Evangelios",
      "Solo en Génesis",
      "Solo en Salmos",
      "En Levítico únicamente"
    ],
    answer: "En los Evangelios",
    explanation:
      "Los Evangelios narran la vida y enseñanzas de Jesús."
  }
];

const CHILD_HEART = {
  happy: {
    icon: "😊",
    title: "Estoy feliz",
    message:
      "La alegría también puede convertirse en gratitud. Cuando algo bueno sucede, podemos reconocerlo y compartirlo.",
    action:
      "Piensa en algo que hoy te hizo sonreír y da gracias por ello."
  },
  sad: {
    icon: "😢",
    title: "Estoy triste",
    message:
      "Estar triste no significa estar solo. Puedes hablar con Dios y también contarle a alguien de confianza cómo te sientes.",
    action:
      "Busca a una persona de confianza y cuéntale qué está pasando en tu corazón."
  },
  angry: {
    icon: "😡",
    title: "Estoy enojado",
    message:
      "Sentir enojo puede pasar. Lo importante es aprender qué hacemos con él para no herir a los demás.",
    action:
      "Respira despacio cinco veces antes de decidir qué quieres decir o hacer."
  },
  afraid: {
    icon: "😨",
    title: "Tengo miedo",
    message:
      "Ser valiente no significa nunca sentir miedo. Significa poder pedir ayuda y dar pequeños pasos.",
    action:
      "Cuenta tu miedo a un adulto de confianza y piensa en un pequeño paso que puedas dar."
  },
  grateful: {
    icon: "🙏",
    title: "Estoy agradecido",
    message:
      "Cuando prestamos atención descubrimos muchas pequeñas cosas buenas que recibimos cada día.",
    action:
      "Di tres cosas por las que quieras dar gracias hoy."
  },
  lonely: {
    icon: "🤍",
    title: "Me siento solo",
    message:
      "Todos necesitamos sentirnos acompañados. Puedes acercarte a alguien que te quiera y decirle cómo te sientes.",
    action:
      "Elige a una persona con quien quieras pasar un momento hoy."
  }
};


/* =========================================================
   COLECCIONABLES Y RECOMPENSAS
   ========================================================= */

const COLLECTIBLES = [
  {
    id: "seed",
    icon: "🌱",
    title: "Primera Semilla",
    required: 0
  },
  {
    id: "lamp",
    icon: "🪔",
    title: "Lámpara de Luz",
    required: 100
  },
  {
    id: "ark",
    icon: "🌈",
    title: "Promesa",
    required: 200
  },
  {
    id: "shepherd",
    icon: "🐑",
    title: "Buen Pastor",
    required: 350
  },
  {
    id: "bread",
    icon: "🍞",
    title: "Compartir",
    required: 500
  },
  {
    id: "tree",
    icon: "🌳",
    title: "Árbol de Fe",
    required: 700
  },
  {
    id: "star",
    icon: "⭐",
    title: "Luz del Camino",
    required: 900
  },
  {
    id: "family-light",
    icon: "✨",
    title: "Luz en Familia",
    required: 1200
  }
];

const FAMILY_REWARDS = [
  {
    id: "reward-dessert",
    title: "Elegir el postre familiar",
    cost: 80,
    icon: "🍨"
  },
  {
    id: "reward-movie",
    title: "Elegir la película familiar",
    cost: 120,
    icon: "🎬"
  },
  {
    id: "reward-game",
    title: "Elegir el juego de la noche",
    cost: 150,
    icon: "🎲"
  },
  {
    id: "reward-plan",
    title: "Elegir un plan especial en familia",
    cost: 250,
    icon: "🌟"
  }
];


/* =========================================================
   ESTADO
   ========================================================= */

let state = loadState();

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return structuredCloneSafe(DEFAULT_STATE);
    }

    const parsed = JSON.parse(saved);

    return {
      ...structuredCloneSafe(DEFAULT_STATE),
      ...parsed,
      profiles: Array.isArray(parsed.profiles)
        ? parsed.profiles
        : structuredCloneSafe(DEFAULT_STATE.profiles),
      completedMissions: Array.isArray(parsed.completedMissions)
        ? parsed.completedMissions
        : [],
      seenContent: Array.isArray(parsed.seenContent)
        ? parsed.seenContent
        : [],
      favorites: Array.isArray(parsed.favorites)
        ? parsed.favorites
        : [],
      unlockedCollectibles: Array.isArray(parsed.unlockedCollectibles)
        ? parsed.unlockedCollectibles
        : ["seed"]
    };
  } catch (error) {
    console.warn("No se pudo cargar el progreso.", error);
    return structuredCloneSafe(DEFAULT_STATE);
  }
}

function structuredCloneSafe(value) {
  return JSON.parse(JSON.stringify(value));
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}


/* =========================================================
   FECHA / ROTACIÓN
   ========================================================= */

function getTodayKey() {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function getDaySeed() {
  return Number(
    getTodayKey()
      .replaceAll("-", "")
      .slice(-6)
  );
}

function chooseDaily(items, offset = 0) {
  if (!items.length) return null;

  const index = (getDaySeed() + offset) % items.length;
  return items[index];
}

function chooseLeastSeen(items, offset = 0) {
  if (!items.length) return null;

  const unseen = items.filter(
    item => !state.seenContent.includes(item.id)
  );

  const pool = unseen.length ? unseen : items;

  return pool[(getDaySeed() + offset) % pool.length];
}


/* =========================================================
   VISITA / RACHA
   ========================================================= */

function updateVisit() {
  const today = getTodayKey();

  if (!state.lastVisit) {
    state.lastVisit = today;
    state.streak = 1;
    saveState();
    return;
  }

  if (state.lastVisit === today) {
    return;
  }

  const last = new Date(`${state.lastVisit}T12:00:00`);
  const current = new Date(`${today}T12:00:00`);

  const diff = Math.round(
    (current - last) / (1000 * 60 * 60 * 24)
  );

  state.streak = diff === 1
    ? state.streak + 1
    : 1;

  state.lastVisit = today;

  saveState();
}


/* =========================================================
   NIVELES
   ========================================================= */

function getCurrentLevel() {
  return LEVELS.find(
    level =>
      state.seeds >= level.min &&
      state.seeds <= level.max
  ) || LEVELS[LEVELS.length - 1];
}

function getLevelIndex() {
  return LEVELS.findIndex(
    level => level.name === getCurrentLevel().name
  );
}

function getNextLevel() {
  const index = getLevelIndex();

  return LEVELS[index + 1] || null;
}

function getLevelProgress() {
  const level = getCurrentLevel();

  if (level.max === Infinity) {
    return 100;
  }

  const totalRange = level.max - level.min + 1;
  const current = state.seeds - level.min;

  return Math.max(
    0,
    Math.min(
      100,
      Math.round((current / totalRange) * 100)
    )
  );
}


/* =========================================================
   SEMILLAS
   ========================================================= */

function addSeeds(amount, reason = "¡Has ganado Semillas!") {
  const oldLevel = getCurrentLevel().name;

  state.seeds += amount;

  updateCollectibles();
  saveState();
  renderProgress();

  showToast(`+${amount} 🌱 ${reason}`);

  const newLevel = getCurrentLevel().name;

  if (newLevel !== oldLevel) {
    showCelebration(
      `¡Nuevo nivel: ${newLevel}!`,
      "Vuestra familia sigue creciendo junta."
    );
  }
}

function spendSeeds(amount) {
  if (state.seeds < amount) {
    showToast("Todavía no tenéis suficientes Semillas 🌱");
    return false;
  }

  state.seeds -= amount;

  saveState();
  renderProgress();

  return true;
}


/* =========================================================
   COLECCIONABLES
   ========================================================= */

function updateCollectibles() {
  COLLECTIBLES.forEach(item => {
    if (
      state.seeds >= item.required &&
      !state.unlockedCollectibles.includes(item.id)
    ) {
      state.unlockedCollectibles.push(item.id);

      setTimeout(() => {
        showCelebration(
          "¡Nuevo tesoro desbloqueado!",
          `${item.icon} ${item.title}`
        );
      }, 350);
    }
  });
}


/* =========================================================
   NAVEGACIÓN
   ========================================================= */

function navigate(route) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(`screen-${route}`);

  if (!target) return;

  target.classList.add("active");

  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.toggle(
      "active",
      item.dataset.route === route
    );
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (route === "missions") {
    renderMissions();
  }

  if (route === "family") {
    renderFamily();
  }
}


/* =========================================================
   UI GENERAL
   ========================================================= */

let toastTimer;

function showToast(message) {
  const toast = document.getElementById("toast");

  if (!toast) return;

  clearTimeout(toastTimer);

  toast.textContent = message;
  toast.classList.remove("hidden");

  toastTimer = setTimeout(() => {
    toast.classList.add("hidden");
  }, 2600);
}

function showCelebration(title, text) {
  const layer = document.getElementById("celebrationLayer");

  document.getElementById("celebrationTitle").textContent = title;
  document.getElementById("celebrationText").textContent = text;

  layer.classList.remove("hidden");
}

function closeCelebration() {
  document
    .getElementById("celebrationLayer")
    .classList.add("hidden");
}

function openModal(html) {
  const backdrop = document.getElementById("modalBackdrop");
  const content = document.getElementById("modalContent");

  content.innerHTML = html;

  backdrop.classList.remove("hidden");
  backdrop.setAttribute("aria-hidden", "false");
}

function closeModal() {
  const backdrop = document.getElementById("modalBackdrop");

  backdrop.classList.add("hidden");
  backdrop.setAttribute("aria-hidden", "true");
}


/* =========================================================
   PROGRESO
   ========================================================= */

function renderProgress() {
  const level = getCurrentLevel();
  const next = getNextLevel();
  const progress = getLevelProgress();

  setText("seedTotal", state.seeds);
  setText("missionSeedTotal", state.seeds);

  setText("familyLevel", level.name);
  setText("levelIcon", level.icon);

  setText("familyLargeLevel", level.name);
  setText("familyLargeIcon", level.icon);

  setText(
    "familyLargeSeeds",
    `${state.seeds} Semillas reunidas`
  );

  setText("progressPercent", `${progress}%`);
  setText(
    "currentLevelLabel",
    `${level.icon} ${level.name}`
  );

  setText(
    "nextLevelLabel",
    next
      ? `Próximo: ${next.icon} ${next.name}`
      : "Nivel máximo alcanzado ✨"
  );

  const fill = document.getElementById("levelProgress");

  if (fill) {
    fill.style.width = `${progress}%`;
  }

  setText("streakTotal", state.streak);
  setText("familyStreakStat", state.streak);

  setText(
    "completedMissionTotal",
    state.completedMissions.length
  );

  setText(
    "missionsStat",
    state.completedMissions.length
  );

  setText("gamesPlayedStat", state.gamesPlayed);
  setText("storiesStat", state.storiesRead);
}

function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}


/* =========================================================
   CONTENIDO DE HOY
   ========================================================= */

function renderToday() {
  const date = new Date();

  const formatted = new Intl.DateTimeFormat(
    "es",
    {
      weekday: "long",
      day: "numeric",
      month: "long"
    }
  ).format(date);

  setText(
    "welcomeDate",
    `HOY · ${formatted.toUpperCase()}`
  );

  const kid = chooseDaily(KID_DAILY, 1);
  const family = chooseDaily(FAMILY_DAILY, 2);
  const mission = chooseDaily(DAILY_MISSIONS, 3);

  if (kid) {
    setText("dailyKidTitle", kid.title);
    setText(
      "dailyKidDescription",
      kid.description
    );
    setText("dailyKidSeeds", kid.seeds);

    const button = document.getElementById("dailyKidButton");

    if (button) {
      button.dataset.dailyGame = kid.game;
    }
  }

  if (family) {
    setText(
      "dailyFamilyTitle",
      family.title
    );

    setText(
      "dailyFamilyDescription",
      family.description
    );

    const button = document.getElementById(
      "dailyFamilyButton"
    );

    if (button) {
      button.dataset.bibleSection = family.section;
    }
  }

  if (mission) {
    setText(
      "homeMissionTitle",
      mission.title
    );

    setText(
      "homeMissionText",
      mission.description
    );

    const button = document.getElementById(
      "completeHomeMission"
    );

    if (button) {
      button.dataset.missionId = mission.id;
      button.dataset.missionSeeds = mission.seeds;

      const completed =
        state.completedMissions.includes(mission.id);

      button.disabled = completed;
      button.textContent = completed
        ? "✓ Completada"
        : "Completar";
    }
  }
}


/* =========================================================
   MISIONES
   ========================================================= */

function renderMissions() {
  renderMissionGroup(
    "dailyMissionsList",
    DAILY_MISSIONS
  );

  renderMissionGroup(
    "weeklyMissionsList",
    WEEKLY_MISSIONS
  );

  renderProgress();
}

function renderMissionGroup(containerId, missions) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = missions.map(mission => {
    const completed =
      state.completedMissions.includes(mission.id);

    return `
      <article class="mission-card ${completed ? "completed" : ""}">
        <div class="mission-card-icon">
          ${mission.icon}
        </div>

        <div>
          <h3>${mission.title}</h3>
          <p>${mission.description}</p>

          <div class="mission-card-meta">
            ${mission.time} · +${mission.seeds} 🌱
          </div>
        </div>

        <button
          class="secondary-button mission-complete-button"
          type="button"
          data-mission="${mission.id}"
          data-seeds="${mission.seeds}"
          ${completed ? "disabled" : ""}
        >
          ${completed ? "✓" : "Completar"}
        </button>
      </article>
    `;
  }).join("");
}

function completeMission(id, seeds) {
  if (state.completedMissions.includes(id)) {
    return;
  }

  state.completedMissions.push(id);

  saveState();

  addSeeds(
    Number(seeds),
    "Misión completada"
  );

  renderMissions();
  renderToday();

  showCelebration(
    "¡Misión completada!",
    "Una pequeña acción también puede hacer crecer mucho a una familia."
  );
}


/* =========================================================
   FAMILIA
   ========================================================= */

function renderFamily() {
  renderProgress();
  renderProfiles();
  renderCollectibles();
  renderRewards();
}

function renderProfiles() {
  const container = document.getElementById("familyProfiles");

  if (!container) return;

  container.innerHTML = state.profiles.map(profile => `
    <article class="profile-card">
      <div class="profile-emoji">
        ${profile.emoji}
      </div>

      <strong>${escapeHtml(profile.name)}</strong>

      <small>
        ${profile.type === "adult" ? "Adulto" : "Niño/a"}
      </small>
    </article>
  `).join("");
}

function renderCollectibles() {
  const container = document.getElementById(
    "collectiblesGrid"
  );

  if (!container) return;

  container.innerHTML = COLLECTIBLES.map(item => {
    const unlocked =
      state.unlockedCollectibles.includes(item.id);

    return `
      <article class="collectible-card ${unlocked ? "" : "locked"}">
        <span class="collectible-icon">
          ${unlocked ? item.icon : "🔒"}
        </span>

        <strong>${item.title}</strong>

        <small>
          ${
            unlocked
              ? "Desbloqueado"
              : `${item.required} 🌱`
          }
        </small>
      </article>
    `;
  }).join("");
}

function renderRewards() {
  const container = document.getElementById("rewardsGrid");

  if (!container) return;

  container.innerHTML = FAMILY_REWARDS.map(reward => `
    <article class="reward-card">
      <div style="font-size:28px;margin-bottom:8px;">
        ${reward.icon}
      </div>

      <h3>${reward.title}</h3>

      <p>
        Una recompensa sencilla para celebrar el camino juntos.
      </p>

      <button
        class="secondary-button reward-button"
        type="button"
        data-reward="${reward.id}"
        data-cost="${reward.cost}"
      >
        ${reward.cost} 🌱
      </button>
    </article>
  `).join("");
}

function redeemReward(id, cost) {
  const reward = FAMILY_REWARDS.find(
    item => item.id === id
  );

  if (!reward) return;

  if (!spendSeeds(Number(cost))) {
    return;
  }

  showCelebration(
    "¡Recompensa conseguida!",
    `${reward.icon} ${reward.title}`
  );

  renderFamily();
}


/* =========================================================
   PERFIL
   ========================================================= */

function showAddProfileModal() {
  openModal(`
    <span class="card-kicker">NUESTRA FAMILIA</span>
    <h2>Añadir un perfil</h2>

    <p style="color:var(--text-soft);">
      En esta primera versión el perfil se guarda únicamente
      en este dispositivo.
    </p>

    <label
      for="newProfileName"
      style="display:block;font-weight:700;margin:18px 0 6px;"
    >
      Nombre
    </label>

    <input
      class="game-input"
      id="newProfileName"
      type="text"
      maxlength="24"
      placeholder="Ej. Mateo"
    >

    <label
      for="newProfileType"
      style="display:block;font-weight:700;margin:14px 0 6px;"
    >
      Perfil
    </label>

    <select
      class="game-input"
      id="newProfileType"
    >
      <option value="child">Niño/a</option>
      <option value="adult">Adulto</option>
    </select>

    <button
      class="primary-button"
      id="saveProfileButton"
      type="button"
      style="width:100%;margin-top:18px;"
    >
      Crear perfil
    </button>
  `);
}

function saveNewProfile() {
  const nameInput = document.getElementById(
    "newProfileName"
  );

  const typeInput = document.getElementById(
    "newProfileType"
  );

  if (!nameInput || !typeInput) return;

  const name = nameInput.value.trim();

  if (!name) {
    showToast("Escribe un nombre para el perfil.");
    return;
  }

  const type = typeInput.value;

  state.profiles.push({
    id: `profile-${Date.now()}`,
    name,
    type,
    emoji: type === "adult" ? "👩" : "🧒"
  });

  saveState();
  closeModal();
  renderProfiles();

  showToast("Perfil creado 🏡");
}


/* =========================================================
   FRASCO DE ORACIONES
   ========================================================= */

const PRAYER_JAR = [
  {
    id: "prayer-family",
    icon: "🏡",
    title: "Por mi familia",
    prayer:
      "Jesús, gracias por mi familia. Ayúdanos a escucharnos, cuidarnos y tratarnos con amor."
  },
  {
    id: "prayer-school",
    icon: "🎒",
    title: "Por mi escuela",
    prayer:
      "Dios, acompáñame en mi escuela. Ayúdame a aprender, compartir y ser amable con los demás."
  },
  {
    id: "prayer-fear",
    icon: "🕊️",
    title: "Cuando tengo miedo",
    prayer:
      "Jesús, cuando tenga miedo, recuérdame que puedo pedir ayuda y que no tengo que enfrentar todo solo."
  },
  {
    id: "prayer-forgive",
    icon: "💛",
    title: "Para aprender a perdonar",
    prayer:
      "Señor, ayúdame a reconocer cuando me equivoco, pedir perdón y aprender también a perdonar."
  },
  {
    id: "prayer-thanks",
    icon: "🌟",
    title: "Para dar gracias",
    prayer:
      "Gracias, Dios, por las personas que me quieren y por las pequeñas cosas buenas que hoy puedo disfrutar."
  },
  {
    id: "prayer-courage",
    icon: "🦁",
    title: "Para ser valiente",
    prayer:
      "Dios, dame valentía para hacer lo correcto, pedir ayuda cuando la necesite y seguir intentándolo."
  }
];

function openPrayerJar() {
  const prayer = chooseLeastSeen(
    PRAYER_JAR,
    Math.floor(Math.random() * 20)
  );

  if (!prayer) return;

  markContentSeen(prayer.id);

  openModal(`
    <div style="text-align:center;">
      <div style="font-size:54px;margin-bottom:10px;">
        🫙
      </div>

      <span class="card-kicker">
        FRASCO DE ORACIONES
      </span>

      <h2>${prayer.icon} ${prayer.title}</h2>

      <div class="reflection-verse">
        ${prayer.prayer}
      </div>

      <p style="color:var(--text-soft);">
        Puedes leerla despacio o decirla con tus propias palabras.
      </p>

      <button
        class="primary-button"
        id="prayerDoneButton"
        type="button"
        style="width:100%;"
      >
        🙏 Ya oré
      </button>
    </div>
  `);
}


/* =========================================================
   UTILIDADES
   ========================================================= */

function markContentSeen(id) {
  if (!id) return;

  if (!state.seenContent.includes(id)) {
    state.seenContent.push(id);

    if (state.seenContent.length > 300) {
      state.seenContent =
        state.seenContent.slice(-200);
    }

    saveState();
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
/* =========================================================
   LUZ EN FAMILIA — app.js
   PARTE 2/2
   ========================================================= */


/* =========================================================
   PARA MAMÁ
   ========================================================= */

function openMomReflection(mood) {
  const options = MOM_CONTENT[mood];

  if (!options || !options.length) {
    showToast("Pronto añadiremos más contenido para este momento.");
    return;
  }

  const content = chooseLeastSeen(
    options,
    Math.floor(Math.random() * 10)
  );

  markContentSeen(content.id);

  const stage = document.getElementById("momReflectionStage");

  stage.innerHTML = `
    <div class="stage-header">
      <div>
        <span class="card-kicker">UN MOMENTO PARA TI</span>
        <h2>${content.title}</h2>
      </div>

      <button
        class="stage-close"
        type="button"
        data-close-stage="mom"
        aria-label="Cerrar"
      >
        ×
      </button>
    </div>

    <div class="reflection-verse">
      ${content.verse}
    </div>

    <h3>Para reflexionar</h3>
    <p>${content.reflection}</p>

    <h3>Una oración</h3>
    <p>${content.prayer}</p>

    <h3>Un pequeño paso para hoy</h3>
    <p>${content.action}</p>

    <div class="game-actions">
      <button
        class="primary-button"
        type="button"
        data-favorite="${content.id}"
      >
        🔖 Guardar
      </button>

      <button
        class="secondary-button"
        type="button"
        data-mom-new="${mood}"
      >
        Ver otro momento
      </button>
    </div>
  `;

  stage.classList.remove("hidden");

  stage.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


function openMomLibrary(type) {
  if (type === "devotional") {
    const moods = Object.keys(MOM_CONTENT);
    const mood = moods[
      Math.floor(Math.random() * moods.length)
    ];

    openMomReflection(mood);
    return;
  }

  if (type === "verse") {
    const all = Object.values(MOM_CONTENT).flat();

    const content = chooseLeastSeen(
      all,
      Math.floor(Math.random() * 50)
    );

    if (!content) return;

    markContentSeen(content.id);

    openModal(`
      <span class="card-kicker">
        UNA PALABRA PARA TU CORAZÓN
      </span>

      <h2>${content.title}</h2>

      <div class="reflection-verse">
        ${content.verse}
      </div>

      <p>
        ${content.reflection}
      </p>

      <button
        class="primary-button"
        type="button"
        data-favorite="${content.id}"
        style="width:100%;"
      >
        🔖 Guardar este momento
      </button>
    `);

    return;
  }

  if (type === "prayer") {
    const all = Object.values(MOM_CONTENT).flat();

    const content = chooseLeastSeen(
      all,
      Math.floor(Math.random() * 30)
    );

    if (!content) return;

    openModal(`
      <div style="text-align:center;">
        <div style="font-size:48px;margin-bottom:12px;">
          🙏
        </div>

        <span class="card-kicker">
          MOMENTO DE ORACIÓN
        </span>

        <h2>${content.title}</h2>

        <div class="reflection-verse">
          ${content.prayer}
        </div>

        <p style="color:var(--text-soft);">
          Quédate unos instantes en silencio antes de continuar.
        </p>
      </div>
    `);

    return;
  }

  if (type === "favorites") {
    renderFavoritesModal();
  }
}


function saveFavorite(id) {
  if (!id) return;

  if (!state.favorites.includes(id)) {
    state.favorites.push(id);
    saveState();
    showToast("Guardado en tu espacio 💛");
  } else {
    showToast("Este contenido ya estaba guardado.");
  }
}


function findMomContent(id) {
  return Object
    .values(MOM_CONTENT)
    .flat()
    .find(item => item.id === id);
}


function renderFavoritesModal() {
  const favorites = state.favorites
    .map(findMomContent)
    .filter(Boolean);

  if (!favorites.length) {
    openModal(`
      <span class="card-kicker">
        MIS GUARDADOS
      </span>

      <h2>Tu pequeño refugio</h2>

      <p>
        Todavía no has guardado ningún versículo o reflexión.
        Cuando encuentres uno que quieras recordar, toca
        <strong>Guardar</strong>.
      </p>
    `);

    return;
  }

  openModal(`
    <span class="card-kicker">
      MIS GUARDADOS
    </span>

    <h2>Palabras que quiero recordar</h2>

    <div style="display:grid;gap:12px;margin-top:18px;">
      ${favorites.map(item => `
        <article
          style="
            padding:16px;
            background:white;
            border-radius:16px;
            border:1px solid var(--border);
          "
        >
          <strong style="color:var(--green-950);">
            ${item.title}
          </strong>

          <p style="margin:8px 0 0;color:var(--text-soft);">
            ${item.verse}
          </p>
        </article>
      `).join("")}
    </div>
  `);
}


/* =========================================================
   BIBLIA EN FAMILIA
   ========================================================= */

function openBibleStory(story) {
  if (!story) return;

  markContentSeen(story.id);

  state.storiesRead += 1;
  saveState();
  renderProgress();

  const stage = document.getElementById("bibleContentStage");

  stage.innerHTML = `
    <div class="stage-header">
      <div>
        <span class="card-kicker">
          BIBLIA EN FAMILIA
        </span>

        <h2>
          ${story.icon} ${story.title}
        </h2>
      </div>

      <button
        class="stage-close"
        type="button"
        data-close-stage="bible"
        aria-label="Cerrar"
      >
        ×
      </button>
    </div>

    <div class="reflection-verse">
      📖 ${story.reference}
    </div>

    <h3>¿Qué ocurrió?</h3>
    <p>${story.summary}</p>

    <h3>¿Qué nos enseña?</h3>
    <p>${story.lesson}</p>

    <h3>💬 Hablemos en familia</h3>
    <p>${story.question}</p>

    <div
      style="
        margin-top:18px;
        padding:17px;
        border-radius:16px;
        background:var(--green-50);
      "
    >
      <span class="card-kicker">
        MISIÓN FAMILIAR
      </span>

      <strong style="color:var(--green-950);">
        ${story.mission}
      </strong>
    </div>

    <button
      class="primary-button"
      type="button"
      data-complete-story="${story.id}"
      style="width:100%;margin-top:18px;"
    >
      ✓ Hemos vivido este momento
    </button>
  `;

  stage.classList.remove("hidden");

  stage.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


function openBibleSection(category) {
  const matching = BIBLE_STORIES.filter(
    item => item.category === category
  );

  if (!matching.length) {
    if (category === "learn") {
      openModal(`
        <span class="card-kicker">
          COMPRENDER LA BIBLIA
        </span>

        <h2>Leer con contexto</h2>

        <p>
          La Biblia contiene diferentes tipos de textos,
          escritos en distintos momentos y contextos.
        </p>

        <p>
          En Luz en Familia iremos aprendiendo a observar:
          quién habla, a quién se dirige el texto,
          qué estaba ocurriendo y qué enseñanza podemos
          llevar responsablemente a nuestra vida.
        </p>

        <div class="reflection-verse">
          🔎 Leer · Comprender · Conversar · Aplicar
        </div>

        <p>
          Este espacio crecerá progresivamente con nuevas
          cápsulas familiares.
        </p>
      `);

      return;
    }

    if (category === "values") {
      const story = chooseLeastSeen(
        BIBLE_STORIES,
        Math.floor(Math.random() * 20)
      );

      openBibleStory(story);
      return;
    }

    showToast("Esta colección seguirá creciendo.");
    return;
  }

  const story = chooseLeastSeen(
    matching,
    Math.floor(Math.random() * 20)
  );

  openBibleStory(story);
}


function openFeaturedBible() {
  const story = chooseLeastSeen(
    BIBLE_STORIES,
    7
  );

  openBibleStory(story);
}


function completeBibleMoment(id) {
  const completionId = `story-${id}`;

  if (state.completedMissions.includes(completionId)) {
    showToast("Este momento ya fue completado 🌱");
    return;
  }

  state.completedMissions.push(completionId);
  saveState();

  addSeeds(
    20,
    "Momento familiar completado"
  );

  showCelebration(
    "¡Momento compartido!",
    "Hablar, escuchar y aprender juntos también hace crecer vuestra familia."
  );
}


/* =========================================================
   JUEGO: ¿QUIÉN SOY?
   ========================================================= */

let whoGame = null;

function startWhoGame() {
  const item = chooseLeastSeen(
    WHO_AM_I,
    Math.floor(Math.random() * 30)
  );

  whoGame = {
    item,
    cluesShown: 1,
    finished: false
  };

  renderWhoGame();
}


function renderWhoGame() {
  const stage = document.getElementById("gameStage");

  const { item, cluesShown, finished } = whoGame;

  stage.innerHTML = `
    <div class="stage-header">
      <div>
        <span class="card-kicker">
          JUEGO DE PISTAS
        </span>

        <h2>🕵️ ¿Quién soy?</h2>
      </div>

      <button
        class="stage-close"
        type="button"
        data-close-stage="game"
      >
        ×
      </button>
    </div>

    <p>
      Descubre el personaje. Cuantas menos pistas necesites,
      más Semillas puedes ganar.
    </p>

    <div class="clue-list">
      ${item.clues.map((clue, index) => `
        <div
          class="clue ${index < cluesShown ? "" : "locked"}"
        >
          ${
            index < cluesShown
              ? `${index + 1}. ${clue}`
              : "Pista bloqueada"
          }
        </div>
      `).join("")}
    </div>

    ${
      !finished
        ? `
          <div class="answer-grid">
            ${shuffleArray([...item.options]).map(option => `
              <button
                class="answer-button"
                type="button"
                data-who-answer="${option}"
              >
                ${option}
              </button>
            `).join("")}
          </div>

          ${
            cluesShown < item.clues.length
              ? `
                <button
                  class="secondary-button"
                  type="button"
                  data-next-clue="true"
                  style="width:100%;margin-top:12px;"
                >
                  Ver otra pista
                </button>
              `
              : ""
          }
        `
        : `
          <button
            class="primary-button"
            type="button"
            data-new-game="who"
            style="width:100%;margin-top:15px;"
          >
            Jugar otra vez
          </button>
        `
    }
  `;

  stage.classList.remove("hidden");

  stage.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


function answerWho(answer) {
  if (!whoGame || whoGame.finished) return;

  if (answer !== whoGame.item.answer) {
    showToast("Todavía no. Observa las pistas 👀");

    if (
      whoGame.cluesShown <
      whoGame.item.clues.length
    ) {
      whoGame.cluesShown += 1;
      renderWhoGame();
    }

    return;
  }

  whoGame.finished = true;

  const rewards = [25, 20, 15, 10];

  const seeds =
    rewards[whoGame.cluesShown - 1] || 10;

  state.gamesPlayed += 1;
  markContentSeen(whoGame.item.id);

  addSeeds(
    seeds,
    "¡Personaje descubierto!"
  );

  renderWhoGame();

  showCelebration(
    "¡Lo descubriste!",
    `${whoGame.item.answer} · +${seeds} 🌱`
  );
}


/* =========================================================
   JUEGO: DESCIFRA EL LIBRO
   ========================================================= */

let bookGame = null;

function startBookGame() {
  const available = BIBLE_BOOKS.filter(
    book => !state.seenContent.includes(`book-${book}`)
  );

  const pool = available.length
    ? available
    : BIBLE_BOOKS;

  const answer = pool[
    Math.floor(Math.random() * pool.length)
  ];

  bookGame = {
    answer,
    scrambled: scrambleWord(answer),
    finished: false
  };

  renderBookGame();
}


function scrambleWord(word) {
  const letters = [...word];

  let shuffled = [...letters];

  for (let attempts = 0; attempts < 10; attempts++) {
    shuffled = shuffleArray([...letters]);

    if (shuffled.join("") !== word) {
      break;
    }
  }

  return shuffled.join("");
}


function renderBookGame() {
  const stage = document.getElementById("gameStage");

  stage.innerHTML = `
    <div class="stage-header">
      <div>
        <span class="card-kicker">
          DESCIFRA LA PALABRA
        </span>

        <h2>🔤 ¿Qué libro es?</h2>
      </div>

      <button
        class="stage-close"
        type="button"
        data-close-stage="game"
      >
        ×
      </button>
    </div>

    <p>
      Ordena mentalmente las letras y escribe
      el nombre correcto.
    </p>

    <div class="scrambled-word">
      ${bookGame.scrambled}
    </div>

    ${
      !bookGame.finished
        ? `
          <input
            id="bookAnswerInput"
            class="game-input"
            type="text"
            autocomplete="off"
            placeholder="Escribe el libro..."
          >

          <div class="game-actions">
            <button
              class="primary-button"
              type="button"
              data-check-book="true"
            >
              Comprobar
            </button>

            <button
              class="secondary-button"
              type="button"
              data-new-game="book"
            >
              Cambiar palabra
            </button>
          </div>
        `
        : `
          <div class="reflection-verse">
            ¡Correcto! ${bookGame.answer}
          </div>

          <button
            class="primary-button"
            type="button"
            data-new-game="book"
          >
            Otra palabra
          </button>
        `
    }
  `;

  stage.classList.remove("hidden");
}


function checkBookAnswer() {
  const input = document.getElementById(
    "bookAnswerInput"
  );

  if (!input || !bookGame) return;

  const answer = normalizeText(input.value);
  const correct = normalizeText(bookGame.answer);

  if (answer !== correct) {
    showToast("Casi. Inténtalo otra vez 🔤");
    return;
  }

  bookGame.finished = true;

  state.gamesPlayed += 1;

  markContentSeen(
    `book-${bookGame.answer}`
  );

  addSeeds(
    15,
    "¡Libro descubierto!"
  );

  renderBookGame();

  showCelebration(
    "¡Muy bien!",
    `${bookGame.answer} · +15 🌱`
  );
}


/* =========================================================
   JUEGO: QUIZ
   ========================================================= */

let quizGame = null;

function startQuizGame() {
  const question = chooseLeastSeen(
    QUIZ_QUESTIONS,
    Math.floor(Math.random() * 40)
  );

  quizGame = {
    question,
    finished: false
  };

  renderQuizGame();
}


function renderQuizGame() {
  const stage = document.getElementById("gameStage");
  const item = quizGame.question;

  stage.innerHTML = `
    <div class="stage-header">
      <div>
        <span class="card-kicker">
          RETO BÍBLICO
        </span>

        <h2>🏆 Quiz Bíblico</h2>
      </div>

      <button
        class="stage-close"
        type="button"
        data-close-stage="game"
      >
        ×
      </button>
    </div>

    <h3>${item.question}</h3>

    <div class="answer-grid">
      ${shuffleArray([...item.options]).map(option => `
        <button
          class="answer-button"
          type="button"
          data-quiz-answer="${escapeHtml(option)}"
          ${quizGame.finished ? "disabled" : ""}
        >
          ${option}
        </button>
      `).join("")}
    </div>

    ${
      quizGame.finished
        ? `
          <div
            style="
              margin-top:16px;
              padding:15px;
              border-radius:14px;
              background:var(--green-50);
            "
          >
            ${item.explanation}
          </div>

          <button
            class="primary-button"
            type="button"
            data-new-game="quiz"
            style="width:100%;margin-top:14px;"
          >
            Siguiente pregunta
          </button>
        `
        : ""
    }
  `;

  stage.classList.remove("hidden");
}


function answerQuiz(answer) {
  if (!quizGame || quizGame.finished) return;

  const item = quizGame.question;

  quizGame.finished = true;

  state.gamesPlayed += 1;

  markContentSeen(item.id);

  if (answer === item.answer) {
    addSeeds(
      10,
      "¡Respuesta correcta!"
    );

    showCelebration(
      "¡Correcto!",
      "Has ganado +10 🌱"
    );
  } else {
    saveState();
    renderProgress();

    showToast(
      `La respuesta era: ${item.answer}`
    );
  }

  renderQuizGame();
}


/* =========================================================
   JUEGO: MI CORAZÓN HOY
   ========================================================= */

function startHeartGame() {
  const stage = document.getElementById("gameStage");

  stage.innerHTML = `
    <div class="stage-header">
      <div>
        <span class="card-kicker">
          MI CORAZÓN HOY
        </span>

        <h2>💗 ¿Cómo te sientes?</h2>
      </div>

      <button
        class="stage-close"
        type="button"
        data-close-stage="game"
      >
        ×
      </button>
    </div>

    <p>
      No hay una respuesta correcta o incorrecta.
      Elige lo que más se parezca a cómo estás hoy.
    </p>

    <div class="answer-grid">
      ${Object.entries(CHILD_HEART).map(
        ([key, item]) => `
          <button
            class="answer-button"
            type="button"
            data-child-mood="${key}"
          >
            ${item.icon} ${item.title}
          </button>
        `
      ).join("")}
    </div>
  `;

  stage.classList.remove("hidden");
}


function showChildHeart(mood) {
  const item = CHILD_HEART[mood];

  if (!item) return;

  const stage = document.getElementById("gameStage");

  stage.innerHTML = `
    <div class="stage-header">
      <div>
        <span class="card-kicker">
          TU CORAZÓN IMPORTA
        </span>

        <h2>
          ${item.icon} ${item.title}
        </h2>
      </div>

      <button
        class="stage-close"
        type="button"
        data-close-stage="game"
      >
        ×
      </button>
    </div>

    <p style="font-size:17px;">
      ${item.message}
    </p>

    <div
      style="
        padding:17px;
        margin-top:15px;
        border-radius:16px;
        background:var(--gold-100);
      "
    >
      <strong>🌱 Pequeño reto</strong>
      <p style="margin:7px 0 0;">
        ${item.action}
      </p>
    </div>

    <button
      class="primary-button"
      type="button"
      data-heart-done="true"
      style="width:100%;margin-top:16px;"
    >
      Lo haré
    </button>
  `;
}


function completeHeartMoment() {
  state.gamesPlayed += 1;

  addSeeds(
    15,
    "Por detenerte a escuchar tu corazón"
  );

  showCelebration(
    "¡Muy bien!",
    "Reconocer lo que sentimos también nos ayuda a crecer."
  );

  startHeartGame();
}


/* =========================================================
   JUEGO: MEMORIA
   ========================================================= */

const MEMORY_PAIRS = [
  {
    pair: "p1",
    a: "El Señor es mi pastor",
    b: "Salmo 23:1"
  },
  {
    pair: "p2",
    a: "Todo lo puedo en Cristo",
    b: "Filipenses 4:13"
  },
  {
    pair: "p3",
    a: "Venzan el mal con el bien",
    b: "Romanos 12:21"
  },
  {
    pair: "p4",
    a: "Dejen que los niños vengan a mí",
    b: "Mateo 19:14"
  },
  {
    pair: "p5",
    a: "Porque tanto amó Dios al mundo",
    b: "Juan 3:16"
  },
  {
    pair: "p6",
    a: "No temas, porque yo estoy contigo",
    b: "Isaías 41:10"
  }
];

let memoryGame = null;

function startMemoryGame() {
  const selected = shuffleArray(
    [...MEMORY_PAIRS]
  ).slice(0, 3);

  const cards = shuffleArray(
    selected.flatMap(item => [
      {
        id: `${item.pair}-a`,
        pair: item.pair,
        text: item.a
      },
      {
        id: `${item.pair}-b`,
        pair: item.pair,
        text: item.b
      }
    ])
  );

  memoryGame = {
    cards,
    revealed: [],
    matched: [],
    moves: 0,
    locked: false
  };

  renderMemoryGame();
}


function renderMemoryGame() {
  const stage = document.getElementById("gameStage");

  stage.innerHTML = `
    <div class="stage-header">
      <div>
        <span class="card-kicker">
          MEMORIA DE LA PALABRA
        </span>

        <h2>🧠 Encuentra las parejas</h2>
      </div>

      <button
        class="stage-close"
        type="button"
        data-close-stage="game"
      >
        ×
      </button>
    </div>

    <p>
      Relaciona cada frase con su referencia.
      Movimientos: <strong>${memoryGame.moves}</strong>
    </p>

    <div class="memory-grid">
      ${memoryGame.cards.map(card => {
        const visible =
          memoryGame.revealed.includes(card.id) ||
          memoryGame.matched.includes(card.id);

        const matched =
          memoryGame.matched.includes(card.id);

        return `
          <button
            class="memory-card
              ${visible ? "revealed" : ""}
              ${matched ? "matched" : ""}
            "
            type="button"
            data-memory-card="${card.id}"
            ${matched ? "disabled" : ""}
          >
            ${visible ? card.text : "✦"}
          </button>
        `;
      }).join("")}
    </div>
  `;

  stage.classList.remove("hidden");
}


function flipMemoryCard(id) {
  if (
    !memoryGame ||
    memoryGame.locked ||
    memoryGame.matched.includes(id) ||
    memoryGame.revealed.includes(id)
  ) {
    return;
  }

  memoryGame.revealed.push(id);

  renderMemoryGame();

  if (memoryGame.revealed.length < 2) {
    return;
  }

  memoryGame.moves += 1;
  memoryGame.locked = true;

  const [firstId, secondId] =
    memoryGame.revealed;

  const first = memoryGame.cards.find(
    card => card.id === firstId
  );

  const second = memoryGame.cards.find(
    card => card.id === secondId
  );

  if (first.pair === second.pair) {
    memoryGame.matched.push(
      firstId,
      secondId
    );

    memoryGame.revealed = [];
    memoryGame.locked = false;

    renderMemoryGame();

    if (
      memoryGame.matched.length ===
      memoryGame.cards.length
    ) {
      finishMemoryGame();
    }

    return;
  }

  setTimeout(() => {
    memoryGame.revealed = [];
    memoryGame.locked = false;
    renderMemoryGame();
  }, 900);
}


function finishMemoryGame() {
  state.gamesPlayed += 1;

  const seeds =
    memoryGame.moves <= 4
      ? 30
      : memoryGame.moves <= 6
        ? 25
        : 20;

  addSeeds(
    seeds,
    "¡Memoria completada!"
  );

  setTimeout(() => {
    showCelebration(
      "¡Encontraste todas las parejas!",
      `${memoryGame.moves} movimientos · +${seeds} 🌱`
    );
  }, 250);
}


/* =========================================================
   JUEGO: ENCUENTRA
   ========================================================= */

const FIND_SYMBOLS = [
  "🐑",
  "🕊️",
  "🌈",
  "⭐",
  "🍞",
  "🐟",
  "🪔",
  "🌿",
  "⛵",
  "👑",
  "💧",
  "🪨"
];

let findGame = null;

function startFindGame() {
  const target =
    FIND_SYMBOLS[
      Math.floor(
        Math.random() * FIND_SYMBOLS.length
      )
    ];

  const others = shuffleArray(
    FIND_SYMBOLS.filter(
      symbol => symbol !== target
    )
  ).slice(0, 7);

  const board = shuffleArray([
    target,
    ...others
  ]);

  findGame = {
    target,
    board,
    start: Date.now(),
    finished: false
  };

  renderFindGame();
}


function renderFindGame() {
  const stage = document.getElementById("gameStage");

  stage.innerHTML = `
    <div class="stage-header">
      <div>
        <span class="card-kicker">
          ENCUENTRA
        </span>

        <h2>👀 Busca el símbolo</h2>
      </div>

      <button
        class="stage-close"
        type="button"
        data-close-stage="game"
      >
        ×
      </button>
    </div>

    <p>
      Encuentra lo más rápido posible:
    </p>

    <div
      style="
        font-size:48px;
        text-align:center;
        margin:15px 0;
      "
    >
      ${findGame.target}
    </div>

    <div
      style="
        display:grid;
        grid-template-columns:repeat(4,1fr);
        gap:9px;
      "
    >
      ${findGame.board.map((symbol, index) => `
        <button
          type="button"
          class="answer-button"
          data-find-index="${index}"
          style="font-size:30px;min-height:70px;"
        >
          ${symbol}
        </button>
      `).join("")}
    </div>
  `;

  stage.classList.remove("hidden");
}


function answerFind(index) {
  if (!findGame || findGame.finished) return;

  const symbol =
    findGame.board[Number(index)];

  if (symbol !== findGame.target) {
    showToast("Ese no es. ¡Sigue buscando! 👀");
    return;
  }

  findGame.finished = true;

  const seconds =
    (Date.now() - findGame.start) / 1000;

  let seeds = 15;

  if (seconds <= 3) {
    seeds = 25;
  } else if (seconds <= 6) {
    seeds = 20;
  }

  state.gamesPlayed += 1;

  addSeeds(
    seeds,
    "¡Lo encontraste!"
  );

  showCelebration(
    "¡Qué rápido!",
    `${seconds.toFixed(1)} segundos · +${seeds} 🌱`
  );

  setTimeout(startFindGame, 300);
}


/* =========================================================
   ABRIR JUEGO
   ========================================================= */

function startGame(game) {
  navigate("games");

  if (game === "who") {
    startWhoGame();
  }

  if (game === "book") {
    startBookGame();
  }

  if (game === "memory") {
    startMemoryGame();
  }

  if (game === "find") {
    startFindGame();
  }

  if (game === "quiz") {
    startQuizGame();
  }

  if (game === "heart") {
    startHeartGame();
  }
}


/* =========================================================
   REFRESCAR PROPUESTAS
   ========================================================= */

function refreshDailySuggestions() {
  const kid = KID_DAILY[
    Math.floor(Math.random() * KID_DAILY.length)
  ];

  const family = FAMILY_DAILY[
    Math.floor(Math.random() * FAMILY_DAILY.length)
  ];

  setText("dailyKidTitle", kid.title);
  setText(
    "dailyKidDescription",
    kid.description
  );
  setText("dailyKidSeeds", kid.seeds);

  const kidButton = document.getElementById(
    "dailyKidButton"
  );

  if (kidButton) {
    kidButton.dataset.dailyGame = kid.game;
  }

  setText(
    "dailyFamilyTitle",
    family.title
  );

  setText(
    "dailyFamilyDescription",
    family.description
  );

  const familyButton = document.getElementById(
    "dailyFamilyButton"
  );

  if (familyButton) {
    familyButton.dataset.bibleSection =
      family.section;
  }

  showToast("✨ Nuevas propuestas para hoy");
}


/* =========================================================
   NORMALIZACIÓN / SHUFFLE
   ========================================================= */

function normalizeText(value) {
  return String(value)
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}


function shuffleArray(array) {
  for (
    let i = array.length - 1;
    i > 0;
    i--
  ) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [array[i], array[j]] =
      [array[j], array[i]];
  }

  return array;
}


/* =========================================================
   EVENTOS
   ========================================================= */

document.addEventListener("click", event => {
  const routeButton =
    event.target.closest("[data-route]");

  if (routeButton) {
    const route =
      routeButton.dataset.route;

    navigate(route);
  }


  const gameButton =
    event.target.closest("[data-game]");

  if (gameButton) {
    startGame(
      gameButton.dataset.game
    );
  }


  const dailyKid =
    event.target.closest("[data-daily-game]");

  if (dailyKid) {
    startGame(
      dailyKid.dataset.dailyGame
    );
  }


  const bibleSection =
    event.target.closest("[data-bible-section]");

  if (bibleSection) {
    navigate("bible");

    openBibleSection(
      bibleSection.dataset.bibleSection
    );
  }


  const moodButton =
    event.target.closest("[data-mood]");

  if (moodButton) {
    openMomReflection(
      moodButton.dataset.mood
    );
  }


  const momLibrary =
    event.target.closest("[data-mom-library]");

  if (momLibrary) {
    openMomLibrary(
      momLibrary.dataset.momLibrary
    );
  }


  const favorite =
    event.target.closest("[data-favorite]");

  if (favorite) {
    saveFavorite(
      favorite.dataset.favorite
    );
  }


  const newMom =
    event.target.closest("[data-mom-new]");

  if (newMom) {
    openMomReflection(
      newMom.dataset.momNew
    );
  }


  const closeStage =
    event.target.closest("[data-close-stage]");

  if (closeStage) {
    const type =
      closeStage.dataset.closeStage;

    if (type === "game") {
      document
        .getElementById("gameStage")
        .classList.add("hidden");
    }

    if (type === "bible") {
      document
        .getElementById("bibleContentStage")
        .classList.add("hidden");
    }

    if (type === "mom") {
      document
        .getElementById("momReflectionStage")
        .classList.add("hidden");
    }
  }


  const whoAnswer =
    event.target.closest("[data-who-answer]");

  if (whoAnswer) {
    answerWho(
      whoAnswer.dataset.whoAnswer
    );
  }


  const nextClue =
    event.target.closest("[data-next-clue]");

  if (
    nextClue &&
    whoGame &&
    whoGame.cluesShown <
      whoGame.item.clues.length
  ) {
    whoGame.cluesShown += 1;
    renderWhoGame();
  }


  const newGame =
    event.target.closest("[data-new-game]");

  if (newGame) {
    startGame(
      newGame.dataset.newGame
    );
  }


  const checkBook =
    event.target.closest("[data-check-book]");

  if (checkBook) {
    checkBookAnswer();
  }


  const quizAnswer =
    event.target.closest("[data-quiz-answer]");

  if (quizAnswer) {
    answerQuiz(
      quizAnswer.dataset.quizAnswer
    );
  }


  const childMood =
    event.target.closest("[data-child-mood]");

  if (childMood) {
    showChildHeart(
      childMood.dataset.childMood
    );
  }


  const heartDone =
    event.target.closest("[data-heart-done]");

  if (heartDone) {
    completeHeartMoment();
  }


  const memoryCard =
    event.target.closest("[data-memory-card]");

  if (memoryCard) {
    flipMemoryCard(
      memoryCard.dataset.memoryCard
    );
  }


  const findButton =
    event.target.closest("[data-find-index]");

  if (findButton) {
    answerFind(
      findButton.dataset.findIndex
    );
  }


  const missionButton =
    event.target.closest(
      ".mission-complete-button"
    );

  if (missionButton) {
    completeMission(
      missionButton.dataset.mission,
      missionButton.dataset.seeds
    );
  }


  const storyComplete =
    event.target.closest(
      "[data-complete-story]"
    );

  if (storyComplete) {
    completeBibleMoment(
      storyComplete.dataset.completeStory
    );
  }


  const rewardButton =
    event.target.closest(".reward-button");

  if (rewardButton) {
    redeemReward(
      rewardButton.dataset.reward,
      rewardButton.dataset.cost
    );
  }
});


/* =========================================================
   EVENTOS FIJOS
   ========================================================= */

document
  .getElementById("modalClose")
  ?.addEventListener(
    "click",
    closeModal
  );


document
  .getElementById("modalBackdrop")
  ?.addEventListener(
    "click",
    event => {
      if (
        event.target.id ===
        "modalBackdrop"
      ) {
        closeModal();
      }
    }
  );


document
  .getElementById("celebrationClose")
  ?.addEventListener(
    "click",
    closeCelebration
  );


document
  .getElementById("refreshDailyButton")
  ?.addEventListener(
    "click",
    refreshDailySuggestions
  );


document
  .getElementById("prayerJarShortcut")
  ?.addEventListener(
    "click",
    openPrayerJar
  );


document
  .getElementById("openFeaturedBible")
  ?.addEventListener(
    "click",
    openFeaturedBible
  );


document
  .getElementById("addProfileButton")
  ?.addEventListener(
    "click",
    showAddProfileModal
  );


document
  .getElementById("modalContent")
  ?.addEventListener(
    "click",
    event => {
      const saveProfile =
        event.target.closest(
          "#saveProfileButton"
        );

      if (saveProfile) {
        saveNewProfile();
      }

      const prayerDone =
        event.target.closest(
          "#prayerDoneButton"
        );

      if (prayerDone) {
        addSeeds(
          5,
          "Por tu momento de oración"
        );

        closeModal();

        showCelebration(
          "🙏 Momento de oración",
          "Una pequeña oración también puede iluminar el día."
        );
      }

      const favorite =
        event.target.closest(
          "[data-favorite]"
        );

      if (favorite) {
        saveFavorite(
          favorite.dataset.favorite
        );
      }
    }
  );


document
  .getElementById("completeHomeMission")
  ?.addEventListener(
    "click",
    event => {
      const button =
        event.currentTarget;

      completeMission(
        button.dataset.missionId,
        button.dataset.missionSeeds
      );
    }
  );


document
  .getElementById("dailyKidButton")
  ?.addEventListener(
    "click",
    event => {
      const game =
        event.currentTarget.dataset.dailyGame;

      if (game) {
        startGame(game);
      }
    }
  );


document
  .getElementById("dailyFamilyButton")
  ?.addEventListener(
    "click",
    event => {
      const section =
        event.currentTarget.dataset.bibleSection;

      navigate("bible");

      if (section) {
        openBibleSection(section);
      }
    }
  );


/* =========================================================
   TECLADO
   ========================================================= */

document.addEventListener(
  "keydown",
  event => {
    if (
      event.key === "Enter" &&
      document.activeElement?.id ===
        "bookAnswerInput"
    ) {
      checkBookAnswer();
    }

    if (event.key === "Escape") {
      closeModal();

      document
        .getElementById("gameStage")
        ?.classList.add("hidden");

      document
        .getElementById("bibleContentStage")
        ?.classList.add("hidden");

      document
        .getElementById("momReflectionStage")
        ?.classList.add("hidden");
    }
  }
);


/* =========================================================
   ARRANQUE
   ========================================================= */

function initializeApp() {
  updateVisit();
  updateCollectibles();

  renderToday();
  renderProgress();
  renderMissions();
  renderFamily();

  navigate("home");
}


initializeApp();
