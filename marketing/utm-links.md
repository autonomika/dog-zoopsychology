# Маркетинг: UTM-ссылки

Подставьте в рекламу и посты. UTM сохраняется в сессии и привязывается к регистрации.

## Instagram / Reels

```
https://dog-zoopsychology.vercel.app/register?utm_source=instagram&utm_medium=reels&utm_campaign=dog_walk_reel
https://dog-zoopsychology.vercel.app/register?utm_source=instagram&utm_medium=reels&utm_campaign=problem_to_test
https://dog-zoopsychology.vercel.app/register?utm_source=instagram&utm_medium=reels&utm_campaign=four_types
```

## TikTok

```
https://dog-zoopsychology.vercel.app/register?utm_source=tiktok&utm_medium=video&utm_campaign=promo_15s
```

## Telegram

```
https://dog-zoopsychology.vercel.app/register?utm_source=telegram&utm_medium=channel&utm_campaign=launch
https://dog-zoopsychology.vercel.app/register?utm_source=telegram&utm_medium=bot&utm_campaign=reminder
```

## VK

```
https://dog-zoopsychology.vercel.app/register?utm_source=vk&utm_medium=clips&utm_campaign=behavior_test
https://dog-zoopsychology.vercel.app/register?utm_source=vk&utm_medium=ads&utm_campaign=retarget
```

## YouTube

```
https://dog-zoopsychology.vercel.app/register?utm_source=youtube&utm_medium=shorts&utm_campaign=demo
https://dog-zoopsychology.vercel.app/register?utm_source=youtube&utm_medium=description&utm_campaign=long_video
```

## Яндекс.Директ

```
https://dog-zoopsychology.vercel.app/register?utm_source=yandex&utm_medium=cpc&utm_campaign={campaign_id}&utm_content={ad_id}&utm_term={keyword}
```

## Цели в Яндекс.Метрике

Создайте в интерфейсе Метрики → Цели → JavaScript-событие:

| ID цели | Событие | Когда срабатывает |
|---------|---------|-------------------|
| registration | `registration` | Успешная регистрация |
| assessment_complete | `assessment_complete` | Тест поведения завершён |
| checkout_start | `checkout_start` | Нажата кнопка оплаты |
| purchase | `purchase` | Успешная оплата (dashboard?paid=1) |

Переменная окружения: `NEXT_PUBLIC_YM_COUNTER_ID` — номер счётчика.
