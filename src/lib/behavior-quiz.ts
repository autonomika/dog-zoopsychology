export type BehaviorTypeId = "anxious" | "hyper" | "confused" | "underfulfilled";

export type BehaviorType = {
  id: BehaviorTypeId;
  title: string;
  short: string;
  desc: string;
  tips: string[];
};

export const BEHAVIOR_TYPES: Record<BehaviorTypeId, BehaviorType> = {
  anxious: {
    id: "anxious",
    title: "Тревожная",
    short: "Замирает, избегает или реагирует из страха",
    desc: "Нервная система в режиме выживания — учиться сложно, пока нет ощущения безопасности.",
    tips: [
      "Сначала безопасность: тихое место, предсказуемый распорядок",
      "Не подталкивайте к триггерам — работайте на дистанции",
      "Награждайте спокойное поведение, а не «храбрость»",
    ],
  },
  hyper: {
    id: "hyper",
    title: "Гиперактивная",
    short: "Импульсивная, высокое возбуждение",
    desc: "Нервная система перегружена и не возвращается в баланс без помощи.",
    tips: [
      "Учите «выключатель» — mat training, пауза, дыхание",
      "Сначала успокоение, потом команды",
      "Добавьте умственную нагрузку, не только физику",
    ],
  },
  confused: {
    id: "confused",
    title: "Растерянная",
    short: "Дома слушается — на улице нет",
    desc: "Понимает команды в спокойной обстановке, но не может обобщить на реальную жизнь.",
    tips: [
      "Тренируйте в новых местах с низкой сложностью",
      "Один сигнал — одно значение, без противоречий в семье",
      "Постепенно повышайте отвлекающие факторы",
    ],
  },
  underfulfilled: {
    id: "underfulfilled",
    title: "Недогружена",
    short: "Ищет стимуляцию сама",
    desc: "Есть энергия и ум, но нет выхода — собака придумывает «работу».",
    tips: [
      "Дайте «работу»: нюх, поиск, задачи на еду",
      "Структурируйте день — ритуалы и активности",
      "Не наказывайте за скуку — перенаправляйте энергию",
    ],
  },
};

export type BehaviorQuestion = {
  id: string;
  text: string;
  options: { id: string; text: string; type: BehaviorTypeId }[];
};

export const BEHAVIOR_QUESTIONS: BehaviorQuestion[] = [
  {
    id: "q1",
    text: "На прогулке, когда видит другую собаку, ваша чаще всего:",
    options: [
      { id: "a", text: "Замирает, прячется или лает из страха", type: "anxious" },
      { id: "b", text: "Тянет, прыгает, не может успокоиться", type: "hyper" },
      { id: "c", text: "Смотрит на вас, но не знает что делать", type: "confused" },
      { id: "d", text: "Ищет способ сама «развлечься» — тянет, нюхает всё подряд", type: "underfulfilled" },
    ],
  },
  {
    id: "q2",
    text: "Когда к вам приходят гости:",
    options: [
      { id: "a", text: "Прячется или стрессует", type: "anxious" },
      { id: "b", text: "Прыгает, бегает, не может остановиться", type: "hyper" },
      { id: "c", text: "То слушается, то нет — непредсказуемо", type: "confused" },
      { id: "d", text: "Приносит игрушки, требует внимания или жуёт что-то", type: "underfulfilled" },
    ],
  },
  {
    id: "q3",
    text: "Дома, когда всё спокойно:",
    options: [
      { id: "a", text: "Всё равно насторожена, следит за каждым звуком", type: "anxious" },
      { id: "b", text: "Не может лежать спокойно — ходит, просит", type: "hyper" },
      { id: "c", text: "Отлично знает команды, но только дома", type: "confused" },
      { id: "d", text: "Скучает и придумывает занятие — жует, лает", type: "underfulfilled" },
    ],
  },
  {
    id: "q4",
    text: "После прогулки или игры:",
    options: [
      { id: "a", text: "Долго не может «отпустить» напряжение", type: "anxious" },
      { id: "b", text: "Всё ещё возбуждена, не ложится", type: "hyper" },
      { id: "c", text: "Устала, но на улице снова «забывает» всё", type: "confused" },
      { id: "d", text: "Через 10 минут снова ищет, чем заняться", type: "underfulfilled" },
    ],
  },
  {
    id: "q5",
    text: "В новом месте (ветклиника, кафе, парк):",
    options: [
      { id: "a", text: "Замирает, отказывается идти или прячется", type: "anxious" },
      { id: "b", text: "Перевозбуждается — всё нюхает, тянет, не слушается", type: "hyper" },
      { id: "c", text: "Слушается только если очень близко и тихо", type: "confused" },
      { id: "d", text: "Исследует всё, игнорируя вас", type: "underfulfilled" },
    ],
  },
  {
    id: "q6",
    text: "Когда вы заняты (работаете, готовите):",
    options: [
      { id: "a", text: "Тревожится, следует за вами по пятам", type: "anxious" },
      { id: "b", text: "Приносит игрушки, лает, требует внимания", type: "hyper" },
      { id: "c", text: "Лежит, но при звонке/стуке «срывается»", type: "confused" },
      { id: "d", text: "Находит «занятие» — диван, мусор, лай в окно", type: "underfulfilled" },
    ],
  },
  {
    id: "q7",
    text: "На тренировке:",
    options: [
      { id: "a", text: "Боится ошибиться, часто отворачивается", type: "anxious" },
      { id: "b", text: "Знает, но не может сосредоточиться", type: "hyper" },
      { id: "c", text: "Дома 10/10, на улице — ноль", type: "confused" },
      { id: "d", text: "Быстро скучает, ищет своё", type: "underfulfilled" },
    ],
  },
  {
    id: "q8",
    text: "Главная проблема, которую вы хотите решить:",
    options: [
      { id: "a", text: "Страх, реактивность, избегание", type: "anxious" },
      { id: "b", text: "Гиперактивность, импульсивность", type: "hyper" },
      { id: "c", text: "Не слушается в реальной жизни", type: "confused" },
      { id: "d", text: "Скука, разрушения, беспокойство дома", type: "underfulfilled" },
    ],
  },
];

export function scoreBehavior(answers: Record<string, string>) {
  const counts: Record<BehaviorTypeId, number> = {
    anxious: 0,
    hyper: 0,
    confused: 0,
    underfulfilled: 0,
  };

  for (const q of BEHAVIOR_QUESTIONS) {
    const chosen = answers[q.id];
    const opt = q.options.find((o) => o.id === chosen);
    if (opt) counts[opt.type] += 1;
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const percentages = Object.fromEntries(
    (Object.keys(counts) as BehaviorTypeId[]).map((id) => [
      id,
      Math.round((counts[id] / total) * 100),
    ])
  ) as Record<BehaviorTypeId, number>;

  const primaryId = (Object.keys(counts) as BehaviorTypeId[]).reduce((a, b) =>
    counts[a] >= counts[b] ? a : b
  );

  return {
    counts,
    percentages,
    primaryType: BEHAVIOR_TYPES[primaryId],
    allTypes: (Object.keys(BEHAVIOR_TYPES) as BehaviorTypeId[]).map((id) => ({
      ...BEHAVIOR_TYPES[id],
      count: counts[id],
      percent: percentages[id],
    })),
  };
}
