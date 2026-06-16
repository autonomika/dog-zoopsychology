import Link from "next/link";
import { LandingPopup } from "@/components/LandingPopup";
import { LandingStickyCta } from "@/components/LandingStickyCta";
import { MODULES } from "@/lib/tests";

const price = process.env.NEXT_PUBLIC_COURSE_PRICE || "1990";

const HERO_BG =
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1920&q=80";

const heroPromises = [
  "Поймите, почему собака тянет, реагирует или отключается",
  "Узнайте тип поведения с полным разбором",
  "Получите рекомендации — что делать в первую очередь",
];

const stats = [
  {
    num: "4",
    label: "Типа поведения",
    desc: "У каждой собаки есть доминирующий паттерн — мы его определим.",
  },
  {
    num: "1",
    label: "План действий",
    desc: "Рекомендации на основе профиля поведения вашей собаки.",
  },
  {
    num: "5 мин",
    label: "От начала до результата",
    desc: "Короткий тест. Без воды и давления — только ясность.",
  },
];

const behaviorTypes = [
  {
    tag: "Тип 01",
    name: "Тревожная",
    desc: "Замирает, избегает или реагирует из страха. Нервная система в режиме выживания — учиться сложно, пока нет ощущения безопасности.",
    tells: [
      "Долго восстанавливается после стресса",
      "Реактивность на поводке, боится незнакомцев",
      "Сложно переключить, когда «перегрелась»",
    ],
  },
  {
    tag: "Тип 02",
    name: "Гиперактивная",
    desc: "Импульсивная, высокое возбуждение, не может успокоиться. Нервная система перегружена и не возвращается в баланс без помощи.",
    tells: [
      "Прыгает, тянет, из спокойствия — в хаос",
      "Знает команды, но не выполняет на возбуждении",
      "Не может успокоиться даже после прогулки",
    ],
  },
  {
    tag: "Тип 03",
    name: "Растерянная",
    desc: "Непоследовательные реакции, сомневается или «отключается» когда важно. Дома слушается — на улице нет.",
    tells: [
      "Дома идеально, в реальной жизни — нет",
      "Выборочное слушание, непредсказуемость",
      "Тренировки застряли на одном месте",
    ],
  },
  {
    tag: "Тип 04",
    name: "Недогружена",
    desc: "Разрушает, беспокойна, сама ищет стимуляцию. Есть энергия и ум, но нет выхода.",
    tells: [
      "Жует, лает, ходит кругами, требует внимания",
      "Ведёт себя плохо, когда дома тихо",
      "Придумала себе «работу», которая мешает",
    ],
  },
];

const steps = [
  {
    num: "01",
    title: "Расскажите о собаке",
    desc: "Имя, порода, возраст — начинаем с того, кто ваша собака, а не только с проблем.",
  },
  {
    num: "02",
    title: "Ответьте на вопросы",
    desc: "Короткий тест о поведении. Каждый ответ помогает понять паттерн.",
  },
  {
    num: "03",
    title: "Получите результат",
    desc: "Профиль поведения, что стоит за реакциями и рекомендуемый план.",
  },
  {
    num: "04",
    title: "Откройте полный курс",
    desc: `15 модулей: теория для самостоятельного изучения + тест. Первый бесплатно. Полный доступ — ${price} ₽.`,
  },
];

const promises = [
  {
    title: "Без давления",
    desc: "Сначала понимание, потом решение. Рекомендации — только если курс вам подходит.",
  },
  {
    title: "Реальная ясность",
    desc: "Не общие советы из интернета, а разбор ваших ответов с объяснением.",
  },
  {
    title: "Только то, что нужно",
    desc: "Короткие модули по 5 минут. Без подписок и скрытых платежей.",
  },
];

const testimonials = [
  {
    text: "Наконец поняла, почему на прогулке всё срывается. После теста и рекомендаций стало проще — хотя бы знаю, с чего начать.",
    name: "Анна, Москва",
  },
  {
    text: "Думала, собака просто упрямая. Оказалось — другой тип поведения. Тест занял 5 минут, а пользы больше, чем от часов YouTube.",
    name: "Дмитрий, Сочи",
  },
  {
    text: "Понравилось, что после каждого вопроса есть разбор. Не просто «правильно/неправильно», а объяснение почему.",
    name: "Елена, Санкт-Петербург",
  },
  {
    text: "Собака шла от спокойствия к хаосу за секунды. Теперь понимаю, что за этим стоит — и знаю, куда двигаться.",
    name: "Проверенный отзыв",
  },
];

export default function Home() {
  return (
    <div className="overflow-x-hidden pb-20 md:pb-0">
      {/* HERO */}
      <section className="relative overflow-hidden bg-charcoal-3 pt-[76px]">
        <div
          className="absolute inset-0 bg-cover bg-[center_25%]"
          style={{ backgroundImage: `url('${HERO_BG}')` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(26,29,24,0.97)_0%,rgba(26,29,24,0.88)_45%,rgba(26,29,24,0.4)_75%,rgba(26,29,24,0.05)_100%),linear-gradient(to_top,rgba(26,29,24,0.9)_0%,rgba(26,29,24,0.3)_50%,rgba(26,29,24,0)_80%)]" />

        <div className="sk9-container relative z-[2]">
          <div className="py-[clamp(60px,8vw,100px)] pb-[clamp(52px,7vw,88px)]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-sm border border-sage/30 bg-sage/10 px-3.5 py-1.5">
              <span className="size-1.5 rounded-full bg-sage" />
              <span className="font-h text-[11px] font-bold uppercase tracking-[0.16em] text-soft-sage">
                Бесплатный тест
              </span>
            </div>

            <h1 className="sk9-h1 mb-5 max-w-3xl">
              Узнайте, что
              <br />
              управляет
              <br />
              <em>поведением</em> собаки
            </h1>

            <p className="font-sub mb-9 max-w-[540px] text-[clamp(1rem,2vw,1.25rem)] italic leading-relaxed text-sand">
              Ответьте на несколько вопросов. Узнайте тип поведения, что за ним стоит и на чём
              сфокусироваться в первую очередь.
            </p>

            <div className="mb-9 flex flex-col gap-2.5">
              {heroPromises.map((text) => (
                <div key={text} className="flex items-center gap-3">
                  <span className="sk9-check" />
                  <span className="font-sub text-[15px] italic text-soft-sage">{text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col flex-wrap gap-3.5 sm:flex-row sm:items-center">
              <Link href="/register" className="sk9-btn-primary sk9-btn-lg justify-center sm:justify-start">
                Начать бесплатный тест
              </Link>
              <Link href="/login" className="sk9-btn-outline sk9-btn-lg justify-center sm:justify-start">
                Уже есть аккаунт
              </Link>
            </div>

            <p className="font-sub mt-3.5 text-[13px] italic text-soft-sage/50">
              ~5 минут · без карты · без спама
            </p>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-y border-sage/10 bg-charcoal-2">
        <div className="sk9-container">
          <div className="grid sm:grid-cols-3">
            {stats.map((item, i) => (
              <div
                key={item.label}
                className={`px-0 py-7 sm:px-8 sm:py-7 ${i < stats.length - 1 ? "border-b border-white/[0.06] sm:border-r sm:border-b-0" : ""}`}
              >
                <p className="font-h text-4xl leading-none font-extrabold text-sage">{item.num}</p>
                <p className="font-h mt-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-soft-sage">
                  {item.label}
                </p>
                <p className="font-body mt-1 text-[13px] leading-snug text-soft-sage/50">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUR TYPES */}
      <section className="bg-paper py-20">
        <div className="sk9-container">
          <div className="sk9-eyebrow">Четыре типа поведения</div>
          <h2 className="sk9-h2 sk9-h2-dark max-w-2xl">
            Какой из них
            <br />
            <em>похож</em> на вашу собаку?
          </h2>
          <p className="font-body mt-4 max-w-xl text-base text-[#5a5a52]">
            У большинства собак есть доминирующий паттерн. Тест помогает его определить.
          </p>

          <div className="mt-11 grid gap-[3px] bg-stone sm:grid-cols-2">
            {behaviorTypes.map((type) => (
              <div
                key={type.tag}
                className="bg-[#fefefe] p-7 transition-colors hover:bg-[#f8f7f4] sm:p-8"
              >
                <p className="font-h mb-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-sage">
                  {type.tag}
                </p>
                <h3 className="font-h mb-3 text-[clamp(1.375rem,3vw,1.875rem)] leading-none font-extrabold uppercase text-charcoal">
                  {type.name}
                </h3>
                <p className="font-body text-sm leading-relaxed text-[#5a5a52]">{type.desc}</p>
                <div className="mt-3.5 flex flex-col gap-1.5">
                  {type.tells.map((tell) => (
                    <div
                      key={tell}
                      className="flex items-start gap-2 font-body text-[13px] leading-snug text-[#6a6a62]"
                    >
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-sage" />
                      {tell}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/register" className="sk9-btn-primary sk9-btn-lg">
              Узнать тип моей собаки
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-charcoal py-20">
        <div className="sk9-container">
          <div className="sk9-eyebrow sk9-eyebrow-light">Как это работает</div>
          <h2 className="sk9-h2 sk9-h2-light max-w-2xl">
            Четыре шага
            <br />
            к <em>ясности</em>
          </h2>

          <div className="mt-12 grid gap-[2px] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.num} className="relative bg-charcoal-2 p-6 sm:p-8">
                <p className="font-h mb-4 text-[56px] leading-none font-extrabold text-sage/25">
                  {step.num}
                </p>
                <h3 className="font-h mb-2 text-sm font-extrabold uppercase tracking-wide text-[#fefefe]">
                  {step.title}
                </h3>
                <p className="font-body text-[13px] leading-relaxed text-soft-sage">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST / PROMISE */}
      <section className="border-t border-sage/10 bg-charcoal-2 py-[72px]">
        <div className="sk9-container-sm text-center">
          <div className="sk9-eyebrow sk9-eyebrow-light sk9-eyebrow-center">
            Наш подход
          </div>
          <h2 className="sk9-h2 sk9-h2-light mx-auto mb-5 max-w-3xl text-[clamp(1.75rem,4vw,3.25rem)]">
            Сначала понимаем
            <br />
            вашу собаку — потом
            <br />
            <em>предлагаем курс</em>
          </h2>
          <p className="font-sub mx-auto mb-7 max-w-[600px] text-[17px] italic leading-relaxed text-soft-sage">
            Большинство курсов просят заплатить, не зная ничего о вашей собаке. Мы делаем иначе:
            сначала тест, потом рекомендация — только если она подходит.
          </p>

          <div className="mt-10 grid gap-[2px] bg-white/[0.06] sm:grid-cols-3">
            {promises.map((p, i) => (
              <div
                key={p.title}
                className={`bg-charcoal p-6 text-left sm:p-7 ${i === 1 ? "sm:border-x sm:border-white/[0.06]" : ""}`}
              >
                <p className="font-h mb-2 text-xs font-extrabold uppercase tracking-[0.1em] text-sage">
                  {p.title}
                </p>
                <p className="font-body text-sm leading-relaxed text-soft-sage">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-paper py-20">
        <div className="sk9-container">
          <div className="sk9-eyebrow">Результаты</div>
          <h2 className="sk9-h2 sk9-h2-dark max-w-2xl">
            Что меняется, когда
            <br />
            <em>понимаешь</em> собаку
          </h2>

          <div className="mt-11 grid gap-5 sm:grid-cols-2">
            {testimonials.map((t) => (
              <blockquote key={t.name} className="border-t-[3px] border-sage bg-[#fefefe] p-8">
                <div className="mb-3.5 text-[13px] tracking-[3px] text-sage">
                  ★★★★★
                </div>
                <p className="font-sub mb-4 text-[15px] italic leading-relaxed text-charcoal">
                  &ldquo;{t.text}&rdquo;
                </p>
                <footer className="font-h text-[11px] font-bold uppercase tracking-[0.1em] text-deep-moss">
                  {t.name}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t-2 border-sage/15 bg-charcoal-3 py-24 text-center">
        <div className="sk9-container-sm">
          <p className="font-h mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-sage">
            Бесплатно · 5 минут · без обязательств
          </p>
          <h2 className="sk9-h2 sk9-h2-light mb-4">
            Хватит гадать.
            <br />
            <em>Начните понимать.</em>
          </h2>
          <p className="font-sub mx-auto mb-10 max-w-[480px] text-lg italic leading-relaxed text-soft-sage">
            Ваша собака уже пытается вам что-то сказать. Тест поможет наконец услышать.
          </p>

          <div className="flex flex-col flex-wrap items-center justify-center gap-3.5 sm:flex-row">
            <Link href="/register" className="sk9-btn-primary sk9-btn-lg w-full max-w-xs justify-center sm:w-auto">
              Начать бесплатный тест
            </Link>
            <Link href="/login" className="sk9-btn-outline sk9-btn-lg w-full max-w-xs justify-center sm:w-auto">
              Войти в аккаунт
            </Link>
          </div>

          <p className="font-sub mt-5 text-[13px] italic text-soft-sage/40">
            {MODULES.length} модулей · полный курс {price} ₽ · разово
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t-2 border-sage bg-charcoal-3 py-16 pb-8">
        <div className="sk9-container">
          <div className="mb-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="mb-3.5 flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-full bg-sage p-1">
                  <span className="font-h text-xs font-extrabold text-[#fefefe]">ЗП</span>
                </span>
                <span className="font-h text-base font-extrabold uppercase tracking-wide text-[#fefefe]">
                  Зоопсихология
                </span>
              </div>
              <p className="font-body max-w-[260px] text-[13px] leading-relaxed text-soft-sage/45">
                Помогаем понять, почему ничего не работало, и выстроить отношения с собакой так,
                чтобы результат держался.
              </p>
            </div>

            <div>
              <h5 className="font-h mb-3.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#fefefe]">
                Курс
              </h5>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/register" className="font-body text-[13px] text-soft-sage/45 transition-colors hover:text-paper">
                    Пройти тест
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="font-body text-[13px] text-soft-sage/45 transition-colors hover:text-paper">
                    Войти
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="font-body text-[13px] text-soft-sage/45 transition-colors hover:text-paper">
                    Мой курс
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-h mb-3.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#fefefe]">
                Типы поведения
              </h5>
              <ul className="flex flex-col gap-2">
                {behaviorTypes.map((t) => (
                  <li key={t.name}>
                    <span className="font-body text-[13px] text-soft-sage/45">{t.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-h mb-3.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#fefefe]">
                Документы
              </h5>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/offer" className="font-body text-[13px] text-soft-sage/45 transition-colors hover:text-paper">
                    Публичная оферта
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="font-body text-[13px] text-soft-sage/45 transition-colors hover:text-paper">
                    Политика конфиденциальности
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.07] pt-5 sm:flex-row">
            <p className="font-body text-xs text-soft-sage/25">
              © {new Date().getFullYear()} Зоопсихология. Все права защищены.
            </p>
            <div className="flex gap-4">
              <Link href="/offer" className="font-body text-xs text-soft-sage/25 transition-colors hover:text-soft-sage/60">
                Оферта
              </Link>
              <Link href="/privacy" className="font-body text-xs text-soft-sage/25 transition-colors hover:text-soft-sage/60">
                Конфиденциальность
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <LandingStickyCta />
      <LandingPopup />
    </div>
  );
}
