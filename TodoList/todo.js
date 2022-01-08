// Tüm secme işlemleri yapıldı...

const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners() { // Tüm eventListenerlar
    form.addEventListener("submit", addTodo);  // forma tıklandıgında event oluşturduk
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI)
    secondCardBody.addEventListener("click", deleteTodo)
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearAllTodos);

}

function clearAllTodos(e) {
    if (confirm("Tümünü silmek istediğinize emin misiniz ?")) {
        // Arayüzdem todoları temizleme
        // todoList.innerHTML= ""; // Yavaş

        while (todoList.firstElementChild != null) {
            todoList.removeChild(todoList.firstElementChild)
        }
        localStorage.removeItem("todos");
    }
}

function filterTodos(e) {
    const filterValue = e.target.value.toLocaleLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function (listItem) {
        const text = listItem.textContent.toLocaleLowerCase();

        if (text.indexOf(filterValue) === -1) {
            // Bulamadı

            listItem.setAttribute("style", "display: none !important");
        }
        else {
            listItem.setAttribute("style", "display: block");
        }
    });
}

function deleteTodo(e) {

    if (e.target.className === "fa fa-remove") {

        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent)
        showAlert("success", "Silme işlemi başarılı...")
    }
}
function deleteTodoFromStorage(deleteTodo) {
    let todos = getTodosFromStorage();

    todos.forEach(function (todo, index) {
        if (todo === deleteTodo) {
            todos.splice(index, 1);  // Arraydan deger sildik.
        }
    })
    localStorage.setItem("todos", JSON.stringify(todos));
}

function loadAllTodosToUI() {
    let todos = getTodosFromStorage();

    todos.forEach(todo => {
        addTodoToUI(todo)
    });
}

function addTodo(e) {
    const newTodo = todoInput.value.trim(); // filter kısmından degerler alınıyor ve trimle stringin basında veya sonundaki gereksiz boslukları sildik

    if (newTodo === "") {

        showAlert("danger", "Lütfen bir todo girin.")
    }
    else {
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
        showAlert("success", "Todo başarılı bir şekilde eklendi.")
    }

    e.preventDefault();  // Sayfanın yenilenmesini engelledik
}

function getTodosFromStorage() { // storagedan todosları alma
    let todos;

    if (localStorage.getItem("todos") === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

function addTodoToStorage(newTodo) {
    let todos = getTodosFromStorage();

    todos.push(newTodo);

    localStorage.setItem("todos", JSON.stringify(todos));
}

function showAlert(type, message) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`
    alert.textContent = message;
    firstCardBody.appendChild(alert)

    setTimeout(function () {
        alert.remove();
    }, 1000)
}


function addTodoToUI(newTodo) {   // String degerini list item olarak UI' a ekleyecek.
    /* <li class="list-group-item d-flex justify-content-between">
    Todo 1
    <a href = "#" class ="delete-item">
        <i class = "fa fa-remove"></i>
    </a>

     </li>
  */

    // List item oluşturduk
    const listItem = document.createElement("li");
    // Link olusturdujl
    const link = document.createElement("a")
    link.href = "#";
    link.className = "delete-item"
    link.innerHTML = "<i class = 'fa fa-remove'></i>"

    listItem.className = "list-group-item d-flex justify-content-between"

    // Text Node Oluşturma

    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link)

    // TodoList' e listItem' ı ekleme 

    todoList.appendChild(listItem)
    todoInput.value = "";


}
