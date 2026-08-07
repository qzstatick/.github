[Demo](https://fastidious-torrone-2df317.netlify.app)

[Backlog](https://github.com/orgs/qzstatick/projects/7)

[Codespace](https://github.com/codespaces?repository_id=1318992227)

[![Netlify Status](https://api.netlify.com/api/v1/badges/0ee56c45-ba2d-4b52-bb2f-a87fc02ced49/deploy-status)](https://app.netlify.com/projects/fastidious-torrone-2df317/deploys)

# Форма для создания issue (с автоматическим бекендом на Netlify)

В папке `docs/` находится статическая страница с формой для создания issue в репозитории `qzstatick/.github`.

Режимы

- redirect — открывает стандартную страницу создания issue на GitHub с предзаполненными полями (не требует токенов).
- auto — отправляет POST-запрос на Netlify Function `/.netlify/functions/create-issue`, которая создаст issue через GitHub API от имени сервиса.

Требования для auto-режима (Netlify)

1. Добавьте в Netlify Site settings → Build & deploy → Environment → Environment variables:
   - `GITHUB_TOKEN` — Personal Access Token с правами `repo`/`public_repo` и `issues` (либо токен GitHub App installation).
   - `FORM_SECRET` — случайная строка для минимальной защиты (опционально, функция также поддерживает reCAPTCHA).
   - `RECAPTCHA_SECRET` — (опционально) секрет reCAPTCHA с сервера, если используете reCAPTCHA.
   - `ALLOWED_ORIGIN` — (опционально) URL вашего сайта для проверки Origin.

2. Деплой: Netlify автоматически развернёт сайт и функции при пуше в репозиторий.

3. (Опционально) В `docs/index.html` можно добавить атрибут reCAPTCHA site key на body:

```html
<body data-recaptcha-site-key="ВАШ_SITE_KEY">
  <script src="https://www.google.com/recaptcha/api.js?render=ВАШ_SITE_KEY"></script>
  ...
</body>
```

Безопасность

- Не храните `GITHUB_TOKEN` в клиенте. Всегда используйте серверную функцию.
- Для защиты от спама используйте reCAPTCHA и проверяйте `ALLOWED_ORIGIN`.
- Для серьёзной нагрузки добавьте rate-limiting (Redis или внешняя служба).

Пример curl-запроса (тест; если функция доступна публично и без reCAPTCHA):

curl -X POST https://<your-site>.netlify.app/.netlify/functions/create-issue \
  -H 'Content-Type: application/json' \
  -d '{"title":"Тестовое issue","body":"Создано через API","labels":"bug","assignees":""}'

