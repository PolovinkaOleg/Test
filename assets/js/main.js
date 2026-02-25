document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.site-nav a[data-page]');

  navLinks.forEach((link) => {
    if (link.dataset.page === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  const toggleButton = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');

  if (toggleButton && nav) {
    toggleButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggleButton.setAttribute('aria-expanded', String(isOpen));
    });
  }

  if (currentPage === 'news.html') {
    initNewsPage();
  }
});

function createNewsCard(item, imageUrl) {
  const article = document.createElement('article');
  article.className = 'card';

  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = item.image_alt || item.title || 'Иллюстрация новости';

  const body = document.createElement('div');
  body.className = 'card-body';

  const title = document.createElement('h2');
  title.textContent = item.title || 'Без названия';

  const text = document.createElement('p');
  text.textContent = item.summary || 'Описание отсутствует.';

  body.append(title, text);
  article.append(img, body);

  return article;
}

function getDirectusImageUrl(config, image) {
  if (!image) return 'assets/img/news-1.svg';

  const fileId = typeof image === 'object' ? image.id : image;
  return `${config.apiBaseUrl}/assets/${fileId}`;
}

function getDemoNews() {
  return [
    {
      title: 'Новый грант на исследования цифровых двойников',
      summary: 'Команда лаборатории получила финансирование на трехлетний проект по моделированию энергетических систем с применением ИИ.',
      image_alt: 'Презентация результатов проекта на конференции',
      _fallbackImage: 'assets/img/news-1.svg'
    },
    {
      title: 'Открытый семинар для магистрантов',
      summary: 'Провели научно-образовательный семинар по обработке данных в реальном времени и практикам воспроизводимых экспериментов.',
      image_alt: 'Семинар с молодыми учеными',
      _fallbackImage: 'assets/img/news-2.svg'
    },
    {
      title: 'Статья в журнале Q1 по машинному обучению',
      summary: 'Опубликованы результаты по ускорению нейросетевых вычислений на гибридных вычислительных кластерах.',
      image_alt: 'Публикация статьи в международном журнале',
      _fallbackImage: 'assets/img/news-3.svg'
    }
  ];
}

async function initNewsPage() {
  const list = document.getElementById('news-list');
  const status = document.getElementById('news-status');

  if (!list || !status) {
    return;
  }

  const config = window.CMS_CONFIG;

  if (!config || config.provider !== 'directus' || !config.apiBaseUrl || !config.collection) {
    status.textContent = 'CMS не настроена. Показаны демонстрационные новости.';
    renderFallbackNews(list);
    return;
  }

  try {
    const params = new URLSearchParams({
      sort: '-published_at',
      fields: 'title,summary,image,image_alt,published_at',
      limit: '50'
    });

    const response = await fetch(`${config.apiBaseUrl}/items/${config.collection}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`CMS response: ${response.status}`);
    }

    const payload = await response.json();
    const items = Array.isArray(payload.data) ? payload.data : [];

    if (!items.length) {
      status.textContent = 'Пока нет опубликованных новостей. Добавьте записи в CMS.';
      list.innerHTML = '';
      return;
    }

    list.innerHTML = '';
    items.forEach((item) => {
      const card = createNewsCard(item, getDirectusImageUrl(config, item.image));
      list.appendChild(card);
    });

    status.textContent = `Загружено новостей: ${items.length}`;
  } catch (error) {
    status.textContent = 'Не удалось загрузить новости из CMS. Показаны демонстрационные новости.';
    renderFallbackNews(list);
  }
}

function renderFallbackNews(list) {
  list.innerHTML = '';
  const demoItems = getDemoNews();

  demoItems.forEach((item) => {
    list.appendChild(createNewsCard(item, item._fallbackImage));
  });
}
