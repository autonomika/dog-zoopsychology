import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/LegalPageLayout";
import { getLegalInfo, sellerDetails } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — Зоопсихология собаки",
  description: "Политика обработки персональных данных пользователей сайта",
};

export default function PrivacyPage() {
  const info = getLegalInfo();
  const seller = sellerDetails(info);

  return (
    <LegalPageLayout title="Политика конфиденциальности" updated="12 июня 2025 г.">
      <p>
        Настоящая Политика определяет порядок обработки и защиты персональных данных пользователей
        сайта {info.appUrl} (далее — Сайт). Оператор: {info.sellerName}.
      </p>

      <section className="space-y-3">
        <h2 className="font-h text-lg font-extrabold uppercase text-charcoal">1. Оператор данных</h2>
        <p>{seller}</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-h text-lg font-extrabold uppercase text-charcoal">2. Какие данные собираем</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Имя, адрес электронной почты, пароль (в зашифрованном виде)</li>
          <li>Данные о собаке: кличка, порода, возраст (при прохождении теста)</li>
          <li>Результаты тестов и прогресс обучения</li>
          <li>Данные об оплате: сумма, статус, идентификатор платежа (без данных банковской карты)</li>
          <li>Технические данные: cookie сессии, IP-адрес, тип браузера (стандартные логи сервера)</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-h text-lg font-extrabold uppercase text-charcoal">3. Цели обработки</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Регистрация и авторизация на Сайте</li>
          <li>Предоставление доступа к Курсу и сохранение прогресса</li>
          <li>Приём оплаты и исполнение договора оферты</li>
          <li>Обратная связь по запросам пользователя</li>
          <li>Улучшение работы Сайта и безопасность</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-h text-lg font-extrabold uppercase text-charcoal">4. Правовые основания</h2>
        <p>
          Обработка осуществляется на основании согласия пользователя (ст. 6 и 9 ФЗ № 152-ФЗ), а
          также для исполнения договора между пользователем и Оператором.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-h text-lg font-extrabold uppercase text-charcoal">5. Передача третьим лицам</h2>
        <p>Данные могут передаваться следующим обработчикам strictly для работы Сайта:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Vercel Inc.</strong> — хостинг приложения (США / ЕС, стандартные договорные
            механизмы)
          </li>
          <li>
            <strong>Timeweb Cloud</strong> — база данных PostgreSQL
          </li>
          <li>
            <strong>ООО «ЮMoney» (ЮKassa)</strong> — приём платежей
          </li>
        </ul>
        <p>
          Банковские реквизиты карты обрабатываются только на стороне ЮKassa; Оператор их не
          получает и не хранит.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-h text-lg font-extrabold uppercase text-charcoal">6. Срок хранения</h2>
        <p>
          Данные хранятся до удаления аккаунта пользователем или до отзыва согласия, если иное не
          требуется законодательством (например, данные о платежах для бухгалтерского учёта).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-h text-lg font-extrabold uppercase text-charcoal">7. Права пользователя</h2>
        <p>Вы вправе:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Запросить информацию об обработке ваших данных</li>
          <li>Требовать уточнения, блокирования или удаления данных</li>
          <li>Отозвать согласие, направив запрос на {info.email}</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-h text-lg font-extrabold uppercase text-charcoal">8. Cookie и сессии</h2>
        <p>
          Сайт использует cookie для поддержания сессии авторизации. Отключение cookie в браузере
          может ограничить возможность входа в аккаунт. PWA может сохранять данные локально на
          устройстве для офлайн-оболочки приложения.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-h text-lg font-extrabold uppercase text-charcoal">9. Безопасность</h2>
        <p>
          Оператор применяет организационные и технические меры: HTTPS, хеширование паролей,
          ограничение доступа к базе данных, секретные ключи в защищённом окружении.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-h text-lg font-extrabold uppercase text-charcoal">10. Изменения политики</h2>
        <p>
          Актуальная версия всегда доступна на этой странице. При существенных изменениях пользователи
          могут быть уведомлены через Сайт или email.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-h text-lg font-extrabold uppercase text-charcoal">11. Контакты</h2>
        <p>
          По вопросам персональных данных:{" "}
          <a href={`mailto:${info.email}`} className="text-sage underline-offset-2 hover:underline">
            {info.email}
          </a>
        </p>
      </section>
    </LegalPageLayout>
  );
}
