# Зоопсихология собаки — сайт с тестами

Короткие тесты по зоопсихологии: регистрация, прогресс в аккаунте, оплата через **ЮKassa**.

**Live demo:** [dog-zoopsychology.vercel.app](https://dog-zoopsychology.vercel.app)

---

## Портфолио

Pet project · fullstack EdTech: лендинг, auth, тесты, LMS-модули, ЮKassa, PWA, security headers.

### Как пройти demo за 2 минуты

1. Откройте [dog-zoopsychology.vercel.app/register](https://dog-zoopsychology.vercel.app/register)
2. Зарегистрируйтесь (любой email, пароль от 8 символов)
3. Пройдите тест поведения собаки → бесплатный модуль «Язык тела»
4. Оплата курса — тестовая карта ЮKassa: `5555 5555 5555 4477`, срок любой будущий, CVC любой

### Текст для кейса (можно копировать)

> **Задача:** онлайн-курс по зоопсихологии с бесплатным входным тестом и платным доступом к модулям.  
> **Решение:** Next.js 15, PostgreSQL + Prisma, JWT-сессии, интеграция ЮKassa (redirect + webhook), PWA, rate limiting и security headers.  
> **Результат:** полный user flow от лендинга до оплаты и прогресса в личном кабинете.

### Стек для карточки

Next.js 15 · TypeScript · Tailwind · Prisma · PostgreSQL · JWT (jose) · bcrypt · ЮKassa API · Vercel · PWA

### Скриншоты для Behance / Notion

Сделайте 5 экранов: главная, тест поведения, результат типа, dashboard, экран оплаты.

```bash
npm run icons   # PNG-иконки + og.png для соцсетей
```

---

## Быстрый старт (локально)

```bash
cd dog-zoopsychology
npm install
./scripts/setup-local.sh   # Docker + PostgreSQL + схема БД
npm run dev
```

Откройте http://localhost:3000 — без ключей ЮKassa работает демо-оплата.

## База данных: Timeweb Cloud

**Панель:** [timeweb.cloud/my/databases](https://timeweb.cloud/my/databases)

**Документация:** [Подключение к PostgreSQL](https://timeweb.cloud/docs/dbaas/postgresql/connect-to-database)

### Пошагово

1. Зарегистрируйтесь на [timeweb.cloud](https://timeweb.cloud)
2. **Базы данных → Добавить**
3. Тип: **PostgreSQL 16** (или 15/17)
4. Тариф: минимальный (1 CPU / 1 GB RAM) — хватит на старт (~350–500 ₽/мес)
5. **Обязательно для Vercel:** включите **публичный доступ / публичный IP** — иначе Vercel не достучится до БД
6. Задайте пароль пользователя, дождитесь статуса «Запущен»
7. Откройте кластер → вкладка **«Подключение»** → скопируйте строку подключения
8. Приведите к формату Prisma:

```env
DATABASE_URL="postgresql://ЛОГИН:ПАРОЛЬ@ХОСТ:5432/default_db?sslmode=require"
```

Если в пароле есть `@`, `#`, `%` — закодируйте их для URL (или задайте пароль только из букв и цифр).

9. Локально проверьте:

```bash
# вставьте DATABASE_URL в .env
npm run db:push
npm run dev
```

10. Тот же `DATABASE_URL` добавьте в **Vercel → Environment Variables**

### Опционально: отдельная база

На минимальном тарифе используйте `default_db`. На тарифе от 2 GB RAM можно создать базу `zoopsych` на вкладке «Базы данных».

---

## Что нужно сделать для продакшена

| # | Действие | Где |
|---|----------|-----|
| 1 | PostgreSQL | [Timeweb Cloud](https://timeweb.cloud/my/databases) → `DATABASE_URL` |
| 2 | Оплата | [yookassa.ru](https://yookassa.ru) → shopId + secret key |
| 3 | Код | GitHub → push |
| 4 | Деплой | [vercel.com](https://vercel.com) → env vars → Deploy |
| 5 | Webhook | ЮKassa → `https://ВАШ-ДОМЕН/api/webhooks/yookassa` → `payment.succeeded` |
| 6 | URL | `NEXT_PUBLIC_APP_URL` = ваш Vercel URL |
| 7 | Юридическое | `LEGAL_SELLER_NAME`, `LEGAL_SELLER_EMAIL` → страницы `/offer`, `/privacy` |

Проверка env: `npm run check:env`  
Шаблон env для Vercel: `vercel-env-template.txt`

---

## Стек

| Слой | Технология |
|------|------------|
| Сайт | Next.js 15 + Tailwind |
| Auth | Email + пароль, cookie-сессия |
| База | **PostgreSQL (Timeweb Cloud)** + Prisma |
| Оплата | **ЮKassa** |
| Деплой | **Vercel** |

## Оплата через ЮKassa

**Личный кабинет:** [yookassa.ru/my](https://yookassa.ru/my)  
**Тестирование:** [Документация — тестовый магазин](https://yookassa.ru/developers/payment-acceptance/testing-and-going-live/testing)

### Настройка (тест — бесплатно)

1. Зарегистрируйтесь на [yookassa.ru](https://yookassa.ru) → выберите **«Тестирование платежей»** (можно до ИП)
2. **Интеграция → Ключи API** → выпустите секретный ключ
3. Скопируйте **shopId** и **secret key** тестового магазина
4. В `.env`:

```env
YOOKASSA_SHOP_ID=123456
YOOKASSA_SECRET_KEY=test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Проверка ключей:

```bash
npm run test:yookassa
```

6. **Локально:** webhook не нужен — после оплаты сработает `/payment/complete`  
7. **На Vercel:** **Интеграция → HTTP-уведомления** → URL:
   `https://ВАШ-ДОМЕН/api/webhooks/yookassa` → событие `payment.succeeded`

   Проверка: `npm run setup:webhook`

### Тестовая карта (успешная оплата)

| Номер | Система |
|-------|---------|
| `5555 5555 5555 4477` | Mastercard |
| `2200 0000 0000 0004` | Mir |

Срок — любая будущая дата, CVC — любые 3 цифры.

### Продакшен

- Подключите ИП/ООО в ЮKassa
- Замените ключи на боевые
- Для чеков 54-ФЗ: `YOOKASSA_SEND_RECEIPT=true`

## Деплой на Vercel

```bash
cd dog-zoopsychology
npx vercel --prod
```

Environment Variables — см. `vercel-env-template.txt`. При сборке выполняется `prisma db push`.

## E2E тест

```bash
npm run dev
npm run test:e2e
```

## Структура

```
src/app/              — страницы и API
src/lib/yookassa.ts   — клиент ЮKassa
src/lib/tests.ts      — вопросы модулей
prisma/schema.prisma  — User, TestProgress, Payment
```
