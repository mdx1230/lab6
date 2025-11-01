const app = document.getElementById('app');
const searchInput = document.getElementById('searchInput');
const breadcrumbsEl = document.getElementById('breadcrumbs');

let users = [];
let todos = [];
let posts = [];
let comments = [];

const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
const localTodos = JSON.parse(localStorage.getItem('localTodos') || '[]');

//Функция для обновления localStorage
function saveLocal() {
    localStorage.setItem('localUsers', JSON.stringify(localUsers));
    localStorage.setItem('localTodos', JSON.stringify(localTodos));
}

//Breadcrumbs
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

//Рендеринг списков
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
        li.textContent = ${u.name} (${u.email});
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Удалить';
        deleteBtn.onclick = () => {
            const idx = localUsers.findIndex(lu => lu.id === u.id);
            if(idx !== -1) {
                localUsers.splice(idx, 1);
                saveLocal();
                renderUsers(searchInput.value);
            }
        }
        li.appendChild(deleteBtn);
        ul.appendChild(li);
    });
