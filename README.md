# Форма для создания issue (с автоматическим бекендом)

В папке `docs/` находится статическая страница с формой для создания issue в репозитории `qzstatick/.github`.

Два режима работы

1. Открыть страницу GitHub (по умолчанию): форма перенаправляет на стандартную страницу создания issue на GitHub с предзаполненными полями. Это не требует токенов.
2. Автоматически (через backend): форма отправляет POST-запрос на ваш серверный эндпоинт, который вызывает GitHub API и создаёт issue от имени сервиса (используется секретный токен).

Как развернуть backend (Netlify Functions)

1. Создайте Personal Access Token (PAT) или используйте GitHub App для доступа к API. PAT должен иметь права `repo` или `public_repo` (для публичных репозиториев) и `issues` scope.
2. Зайдите в Netlify → Site settings → Build & deploy → Environment → Environment variables и добавьте:
   - `GITHUB_TOKEN` — ваш PAT (или GitHub App token)
   - `FORM_SECRET` — длинная случайная строка (секрет, который будет проверяться при вызове функции)
3. В репозитории добавлен пример функции для Netlify: `netlify/functions/create-issue.js`.
4. Деплой на Netlify: страница будет доступна, а функция — по пути `/.netlify/functions/create-issue`.

Если вы используете Vercel

- Положите функцию в `api/create-issue.js` и добавьте секреты в Project Environment Variables (`GITHUB_TOKEN`, `FORM_SECRET`). На Vercel endpoint будет `/api/create-issue`.
- В `docs/index.html` по умолчанию указан путь для Netlify. Измените `serverEndpoint` на `/api/create-issue` после деплоя на Vercel.

Безопасность

- Не храните PAT в клиентском код! Всегда используйте серверную функцию и храните токен в переменных окружения (секретах).
- Добавьте `FORM_SECRET` и требуйте его в заголовке `X-Form-Secret` в запросе, чтобы предотвратить открытый доступ.
- При необходимости добавьте rate-limiting и логирование.

Пример запроса (JSON):

{
  "title": "Заголовок",
  "body": "Описание",
  "labels": "bug, enhancement",
  "assignees": "ivaniventov"
}

Ответ: JSON с данными созданного issue (как возвращает GitHub API).

Дополнительно

- Могу помочь задеплоить функцию на Netlify/Vercel и настроить секреты. Напишите, куда хотите деплоить, и я добавлю инструкции/шаблоны для CI.