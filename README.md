# SkillSwap

Платформа обмена навыками.

---

## Быстрый старт

```bash
npm install
npm run dev
```

Открой [http://localhost:5173](http://localhost:5173)

---

## Storybook

Для разработки и просмотра UI-компонентов в изоляции используется Storybook.

Для запуска Storybook:

```bash
npm run storybook
```

Сборка статической версии Storybook (для деплоя):

```bash
npm run build-storybook
```

Открой [http://localhost:6006](http://localhost:6006)

---

## State management

Проект использует **Redux Toolkit**. Store настроен в `src/store/index.ts`.

Для работы со store используй типизированные хуки из `src/store/hooks.ts` — `useAppDispatch` и `useAppSelector` вместо оригинальных из react-redux.

---

## Структура проекта

```
src/
├── api/                  # fetch-функции для загрузки JSON-моков
├── app/
│   ├── providers/        # StoreProvider, RouterProvider
│   └── styles/           # global.css с CSS-переменными
├── entities/             # Доменные модели: Skill, User, Request
│   ├── skill/
│   ├── user/
│   └── request/
├── features/             # Фичи: auth, skills, favorites, requests
├── pages/                # Страницы приложения
├── shared/
│   ├── hooks/            # useDebounce, useLocalStorage
│   ├── lib/              # constants, helpers
│   ├── types/            # общие TypeScript-типы
│   └── ui/               # атомарные компоненты
├── store/                # Redux store и типизированные хуки
└── widgets/              # Составные блоки: Header, SkillCard, FiltersBar

public/
└── db/
    ├── skills.json       # Добавь сюда моки навыков
    └── users.json        # Добавь сюда моки пользователей
```

---

## Моки данных

- `public/db/skills.json` - моковые данные скилов
- `public/db/users.json` - моковые данные пользоватклейю.

Структура объектов описана в `src/shared/types/index.ts`.

---

## Доступные скрипты

| Скрипт | Что делает |
|--------|------------|
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | Сборка для продакшена |
| `npm run lint` | Проверка ESLint + Stylelint |
| `npm run lint:fix` | Автоисправление lint-ошибок |
| `npm run format` | Форматирование через Prettier |
| `npm run test` | Запуск тестов |
| `npm run test:watch` | Тесты в watch-режиме |
| `npm run test:coverage` | Покрытие (цель ≥ 70%) |

---

## Роутинг

Маршруты объявлены в `src/shared/lib/constants.ts` → `ROUTES`.

Lazy-загрузка уже настроена в `src/app/providers/RouterProvider.tsx`.

Для защищённых маршрутов добавь компонент `PrivateRoute` в `src/features/auth/ui/`.

---

## Переменные окружения

Создай `.env.local` для локальных настроек (в `.gitignore` уже исключён):

```
VITE_APP_TITLE=SkillSwap
```

Доступ в коде: `import.meta.env.VITE_APP_TITLE`

---

## Git-процесс

```
main        ← только стабильный код, не трогаем напрямую
└── develop ← основная ветка разработки, PR только сюда
    └── feature/catalog-filters   ← твоя задача
        └── → PR → code review → merge в develop
```

Перед началом каждой задачи:
```bash
git checkout develop
git pull
git checkout -b feature/название-задачи
```

После завершения:
```bash
git push -u origin feature/название-задачи
# открываешь PR из своей ветки → в develop
```

Ветки называй: `feature/`, `fix/`, `refactor/`, `docs/`, `chore/`

Коммиты по [Conventional Commits](https://www.conventionalcommits.org/ru/):
```
feat: добавить фильтр по категориям
fix: исправить отображение карточки на мобильном
refactor: вынести логику избранного в хук
```

Коммиты делаем через `npm run commit`: он задаёт вопросы и собирает сообщение в формате Conventional Commits.  
Перед коммитом хук проверяет добавленные в коммит файлы (ESLint, Stylelint, Prettier), и если есть ошибки, коммит не создаётся.  
Добавляй в коммит только свои файлы, не `git add -A`.  

PR — не больше ~200 строк изменений. Вливает только тимлид или его заместитель. `--force` и `merge --no-ff` в `develop` запрещены.

---

## CI

GitHub Actions запускается на каждый push и PR:
- `npm run lint`
- `tsc --noEmit`
- `npm run test`
- `npm run build`

Если CI красный — PR не мержится.

---

## Соглашения по коду

В процессе разработки команда придерживается следующих правил:

- **Стили**: используем CSS Modules для компонентов. Общие стили только в `src/app/styles/global.css`
- **Структура** проекта по FSD: слои app, pages, widgets, features, entities, shared. Импортировать можно только из нижних слоёв, из верхних нельзя.
- **Типы компонентов** находятся в папке компонента, в файле type.ts.

```
  app - Инициализация: провайдеры, роутер, глобальные стили
  pages - Страницы приложения
  widgets - Крупные блоки интерфейса
  features - Действия пользователя
  entities - Бизнес-сущности
  shared - Общий переиспользуемый код
```

- **Файлы компонента**: в папке `Button/` кладём `Button.tsx`, `Button.module.css`, `Button.stories.tsx` и `index.ts` (в нём реэкспорт)
- **Нейминг**: компоненты и типы PascalCase, переменные и функции camelCase,
  функции начинаются с глагола, массивы во множественном числе
- **Типы** лежат в `src/shared/types/index.ts`, в entities их реэкспорт
