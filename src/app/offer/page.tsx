import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/LegalPageLayout";
import { getLegalInfo, sellerDetails } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Публичная оферта — Дрессировка и поведение собак",
  description: "Договор оферты на оказание услуг по предоставлению доступа к онлайн-курсу",
};

export default function OfferPage() {
  const info = getLegalInfo();
  const seller = sellerDetails(info);

  return (
    <LegalPageLayout title="Публичная оферта" updated="12 июня 2025 г.">
      <p>
        Настоящий документ является официальным предложением ({info.sellerName}) заключить договор
        на оказание услуг по предоставлению доступа к онлайн-курсу «{info.courseName}» на условиях,
        изложенных ниже.
      </p>

      <section className="space-y-3">
        <h2 className="font-h text-lg font-extrabold uppercase text-charcoal">1. Термины</h2>
        <p>
          <strong>Исполнитель</strong> — {seller}.
        </p>
        <p>
          <strong>Заказчик</strong> — физическое лицо, прошедшее регистрацию на сайте{" "}
          {info.appUrl}.
        </p>
        <p>
          <strong>Курс</strong> — совокупность обучающих материалов (тексты, тесты), доступных в
          личном кабинете после оплаты.
        </p>
        <p>
          <strong>Сайт</strong> — интернет-ресурс по адресу {info.appUrl}.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-h text-lg font-extrabold uppercase text-charcoal">2. Предмет договора</h2>
        <p>
          Исполнитель предоставляет Заказчику доступ к полной версии Курса в электронном виде через
          Сайт. Первый модуль Курса может быть предоставлен бесплатно для ознакомления.
        </p>
        <p>
          Услуга считается оказанной с момента открытия доступа к оплаченным модулям в личном
          кабинете Заказчика.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-h text-lg font-extrabold uppercase text-charcoal">3. Стоимость и оплата</h2>
        <p>
          Стоимость полного доступа к Курсу — {info.price} ₽ (разовый платёж). Оплата
          производится через платёжный сервис ЮKassa банковской картой или иными способами,
          доступными в форме оплаты.
        </p>
        <p>
          Моментом оплаты считается поступление подтверждения успешного платежа от платёжного
          сервиса.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-h text-lg font-extrabold uppercase text-charcoal">4. Порядок оказания услуг</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Заказчик регистрируется на Сайте и проходит вводный тест.</li>
          <li>Заказчик оплачивает доступ к полному Курсу.</li>
          <li>После подтверждения оплаты доступ открывается автоматически в личном кабинете.</li>
          <li>Заказчик изучает материалы и проходит тесты в удобное время (24/7).</li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="font-h text-lg font-extrabold uppercase text-charcoal">5. Права и обязанности</h2>
        <p>
          Исполнитель обязуется поддерживать работоспособность Сайта и предоставить доступ к
          оплаченным материалам. Заказчик обязуется не передавать доступ третьим лицам и не
          копировать материалы Курса для распространения.
        </p>
        <p>
          Материалы Курса носят информационный характер и не заменяют консультацию ветеринарного
          врача или сертифицированного кинолога при проблемах со здоровьем или агрессией животного.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-h text-lg font-extrabold uppercase text-charcoal">6. Возврат средств</h2>
        <p>
          Услуга оказывается в цифровом виде с моментального предоставления доступа. Возврат
          возможен, если доступ не был предоставлен по вине Исполнителя, либо если Заказчик не
          начал использование Курса (не открывал платные модули) и обратился в течение 7 календарных
          дней с даты оплаты на {info.email}. Решение о возврате принимается Исполнителем в
          соответствии с законодательством РФ о защите прав потребителей.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-h text-lg font-extrabold uppercase text-charcoal">7. Персональные данные</h2>
        <p>
          Обработка персональных данных осуществляется в соответствии с{" "}
          <a href="/privacy" className="text-sage underline-offset-2 hover:underline">
            Политикой конфиденциальности
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-h text-lg font-extrabold uppercase text-charcoal">8. Акцепт оферты</h2>
        <p>
          Акцептом настоящей оферты считается регистрация на Сайте и/или оплата доступа к Курсу.
          Совершая указанные действия, Заказчик подтверждает, что ознакомился с условиями оферты и
          принимает их в полном объёме.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-h text-lg font-extrabold uppercase text-charcoal">9. Реквизиты</h2>
        <p>{seller}</p>
      </section>
    </LegalPageLayout>
  );
}
