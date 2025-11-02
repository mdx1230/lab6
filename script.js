const app = document.getElementById('app');
const searchInput = document.getElementById('searchInput');
const breadcrumbsEl = document.getElementById('breadcrumbs');

let users = [];
let todos = [];
let posts = [];
let comments = [];

const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
const localTodos = JSON.parse(localStorage.getItem('localTodos') || '[]');

function saveLocal() {
  localStorage.setItem('localUsers', JSON.stringify(localUsers));
  localStorage.setItem('localTodos', JSON.stringify(localTodos));
}


function renderBreadcrumbs() {
  const hash = location.hash || '#users';
  const parts = hash.slice(1).split('#');
  breadcrumbsEl.innerHTML = '';
  let path = '';
  parts.forEach((part, i) => {
    path += (i === 0 ? '#' : '#') + part;
    const a = document.createElement('a');
    a.href = path;
    a.textContent = part;
    breadcrumbsEl.appendChild(a);
  });
}

//Пользователи
function renderUsers(filter = '') {
  app.innerHTML = '';
  const ul = document.createElement('ul');
  const allUsers = [...users, ...localUsers];
  const filtered = allUsers.filter(u =>
    u.name.toLowerCase().includes(filter.toLowerCase()) ||
    u.email.toLowerCase().includes(filter.toLowerCase())
  );

  filtered.forEach(u => {
    const li = document.createElement('li');
    li.textContent = `${u.name} (${u.email})`;
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Удалить';
    delBtn.onclick = () => {
      const idx = localUsers.findIndex(lu => lu.id === u.id);
      if (idx !== -1) {
        localUsers.splice(idx, 1);
        saveLocal();
        renderUsers(searchInput.value);
      }
    };
    li.appendChild(delBtn);
    ul.appendChild(li);
  });

  const addBtn = document.createElement('button');
  addBtn.textContent = 'Добавить пользователя';
  addBtn.onclick = () => {
    const name = prompt('Имя пользователя');
    const email = prompt('Email пользователя');
    if (name && email) {
      const id = Date.now();
      localUsers.push({ id, name, email });
      saveLocal();
      renderUsers(searchInput.value);
    }
  };

  app.appendChild(addBtn);
  app.appendChild(ul);
}

//Todos
function renderTodos(filter = '') {
  app.innerHTML = '';
  const ul = document.createElement('ul');
  const allTodos = [...todos, ...localTodos];
  const filtered = allTodos.filter(t => t.title.toLowerCase().includes(filter.toLowerCase()));

  filtered.forEach(t => {
    const li = document.createElement('li');
    li.textContent = `${t.title} (${t.completed ? '✔️' : '❌'})`;
    ul.appendChild(li);
  });

  const addBtn = document.createElement('button');
  addBtn.textContent = 'Добавить todo';
  addBtn.onclick = () => {
    const title = prompt('Название todo');
    const userId = parseInt(prompt('ID пользователя для todo'));
    if (title && userId) {
      const id = Date.now();
      localTodos.push({ id, userId, title, completed: false });
      saveLocal();
      renderTodos(searchInput.value);
    }
  };

  app.appendChild(addBtn);
  app.appendChild(ul);
}
// --- Posts ---
function renderPosts(filter = '') {
  app.innerHTML = '';
  const ul = document.createElement('ul');
  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(filter.toLowerCase()) ||
    p.body.toLowerCase().includes(filter.toLowerCase())
  );
  filtered.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${p.title}</strong>: ${p.body}`;
    ul.appendChild(li);
  });
  app.appendChild(ul);
}

//Comments
function renderComments(filter = '') {
  app.innerHTML = '';
  const ul = document.createElement('ul');
  const filtered = comments.filter(c =>
    c.name.toLowerCase().includes(filter.toLowerCase()) ||
    c.body.toLowerCase().includes(filter.toLowerCase())
  );
  filtered.forEach(c => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${c.name}</strong>: ${c.body}`;
    ul.appendChild(li);
  });
  app.appendChild(ul);
}

//Роутер
function router() {
  renderBreadcrumbs();
  const hash = location.hash || '#users';
  const filter = searchInput.value;
  switch (hash) {
    case '#users': renderUsers(filter); break;
    case '#users#todos': renderTodos(filter); break;
    case '#users#posts': renderPosts(filter); break;
    case '#users#posts#comments': renderComments(filter); break;
    default: renderUsers(filter);
  }
}

//Инициализация
async function init() {
  console.log('Загружаем данные...');
  try {
    const [u, t, p, c] = await Promise.all([
      fetch('https://jsonplaceholder.typicode.com/users').then(r => r.json()),
      fetch('https://jsonplaceholder.typicode.com/todos').then(r => r.json()),
      fetch('https://jsonplaceholder.typicode.com/posts').then(r => r.json()),
      fetch('https://jsonplaceholder.typicode.com/comments').then(r => r.json())
    ]);
    users = u;
    todos = t;
    posts = p;
    comments = c;
    if (!location.hash) location.hash = '#users';
    router();
    console.log('Данные загружены');
  } catch (e) {
    console.error('Ошибка загрузки данных', e);
    app.textContent = 'Ошибка загрузки данных.';
  }
}

//События
window.addEventListener('hashchange', router);
searchInput.addEventListener('input', router);

init();
