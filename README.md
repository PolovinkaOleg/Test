# Сайт лаборатории + Headless CMS (Directus)

Проект теперь поддерживает Headless CMS для раздела **«Новости»**.

## 1) Быстрый локальный запуск сайта

```bash
python3 -m http.server 4173
```

Откройте: `http://localhost:4173/index.html`

## 2) Запуск Headless CMS (Directus)

Требуется Docker + Docker Compose.

```bash
docker compose -f docker-compose.directus.yml up -d
```

После запуска:
- API: `http://localhost:8055`
- Админка: `http://localhost:8055/admin`

### Первичная настройка коллекции новостей

В админке создайте коллекцию `news` со следующими полями:
- `title` (string, обязательное)
- `summary` (text, обязательное)
- `image` (file, необязательное)
- `image_alt` (string, необязательное)
- `published_at` (datetime, необязательное)

После этого добавляйте новости через интерфейс Directus (без правки HTML).

## 3) Подключение сайта к CMS

Откройте `assets/js/cms-config.js` и укажите URL API:

```js
window.CMS_CONFIG = {
  provider: 'directus',
  apiBaseUrl: 'http://localhost:8055',
  collection: 'news'
};
```

Если CMS недоступна, страница новостей покажет демонстрационные карточки.

## 4) Как обновлять новости без кода

1. Открыть `http://localhost:8055/admin`
2. Добавить/изменить запись в коллекции `news`
3. Обновить страницу `news.html`

Сайт подгрузит новые записи автоматически.
