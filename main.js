import './style.css'

document.querySelector('#app').innerHTML = `
  <div>
  <h1>To-Do List</h1>

  <form id="todoForm">
    <input type="text" id="todoInput" placeholder="Enter a new task" />
    <button type="submit">Add</button>
  </form>

  <h2>Current To-Do's</h2>
  <ul id="currentTodos"></ul>

  <h2>Completed To-Do's</h2>
  <ul id="completedTodos"></ul>
  </div>
`

const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const currentTodosList = document.getElementById('currentTodos');
const completedTodosList = document.getElementById('completedTodos');

let todos = [];

function renderTodos() {
  currentTodosList.innerHTML = '';
  completedTodosList.innerHTML = '';

  todos.forEach((todo, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = todo;
    listItem.innerHTML += `
      <button hx-post="/complete" hx-trigger="click" hx-target="#completedTodos" hx-swap="outerHTML"
        data-index="${index}">
        Complete
      </button>
      <button hx-delete="/delete" hx-confirm="Are you sure?" hx-trigger="confirmation"
        data-index="${index}">
        Delete
      </button>
    `;

    currentTodosList.appendChild(listItem);
  });
}

function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText !== '') {
    todos.push(todoText);
    renderTodos();
    todoInput.value = '';
  }
}

function completeTodo() {
  const index = parseInt(this.getAttribute('data-index'));
  const completedTodo = todos.splice(index, 1);
  renderTodos();
  completedTodosList.insertAdjacentHTML('beforeend', `<li>${completedTodo}</li>`);
}

function deleteTodo() {
  const index = parseInt(this.getAttribute('data-index'));
  todos.splice(index, 1);
  renderTodos();
}

function init() {
  const storedTodos = localStorage.getItem('todos');
  if (storedTodos) {
    todos = JSON.parse(storedTodos);
  }

  renderTodos();
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

document.addEventListener('htmx:afterSettle', saveTodos);

init();

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addTodo();
});

currentTodosList.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    if (event.target.getAttribute('hx-post') === '/complete') {
      completeTodo.call(event.target);
    } else if (event.target.getAttribute('hx-delete') === '/delete') {
      deleteTodo.call(event.target);
    }
  }
});
