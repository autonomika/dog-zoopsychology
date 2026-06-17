# Email-цепочка после теста

5 писем для пользователей, прошедших бесплатный тест поведения.  
Отправка: Resend, Unisender, SendPulse или Telegram-бот (текст адаптируется).

## Расписание

| # | Когда | Файл | Цель |
|---|-------|------|------|
| 1 | Сразу после теста | `01-result.md` | Закрепить результат, дать первый шаг |
| 2 | +1 день | `02-why-nothing-worked.md` | Объяснить «почему не работало» |
| 3 | +3 дня | `03-free-module.md` | Дожать до бесплатного модуля |
| 4 | +5 дней | `04-case-study.md` | Соцдоказательство + оффер |
| 5 | +7 дней | `05-last-chance.md` | Финальный CTA на курс |

## Персонализация

Подставляйте в шаблоны:

- `{{name}}` — имя владельца
- `{{dog_name}}` — кличка собаки
- `{{behavior_type}}` — доминирующий тип (Тревожная / Гиперактивная / …)
- `{{course_price}}` — цена курса (1990 ₽)
- `{{test_url}}` — ссылка на тест с UTM
- `{{dashboard_url}}` — личный кабинет
- `{{learn_url}}` — бесплатный модуль intro

## UTM для писем

```
?utm_source=email&utm_medium=sequence&utm_campaign=email_01_result
?utm_source=email&utm_medium=sequence&utm_campaign=email_05_last_chance
```

## Триггеры в продукте

- Письмо 1: webhook/API после `POST /api/assessment/submit`
- Письма 2–5: cron или сервис рассылки по дате регистрации + флаг `assessment_completed`
