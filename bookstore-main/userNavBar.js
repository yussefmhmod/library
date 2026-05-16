const API = "http://127.0.0.1:8000";

async function apiFetch(path, options = {}) {
    const res = await fetch(API + path, { credentials: "include", ...options });
    if (!res.ok) throw Object.assign(new Error(), { status: res.status });
    return res.json();
}

// ─── logout (shared across all user pages) ───────────────────────────────────
async function logout() {
    try { await apiFetch("/users/logout/", { method: "POST" }); } catch {}
    window.location.href = "login.html";
}

// ─── books ───────────────────────────────────────────────────────────────────
let books = [];

async function loadBooks() {
    try {
        books = await apiFetch("/books/books/");
        displayBooks();
    } catch {
        console.error("Error loading books");
    }
}

function displayBooks() {
    const shelf = document.getElementById("booksShelf");
    shelf.innerHTML = "";
    if (!books.length) {
        shelf.innerHTML = "<p>No books available yet.</p>";
        return;
    }
    books.forEach(book => {
        shelf.innerHTML += `
        <div class="book-card">
            <img src="${book.image || 'images/placeholder.png'}" alt="${book.title}" width="150">
            <h2>${book.title}</h2>
            <p><h4>Author:</h4> ${book.author}</p>
            <p><h4>Category:</h4> ${book.genre}</p>
            <p><h4>Copies:</h4> ${book.quantity}</p>
            <p class="${book.status === 'Available' ? 'available' : 'borrowed'}">
                ${book.status}
            </p>
            <a href="userVB.html?id=${book.id}" class="view-btn">View Details</a>
        </div>`;
    });
}

// ─── welcome message ─────────────────────────────────────────────────────────
async function displayWelcome() {
    try {
        const data = await apiFetch("/users/getUser/");
        const span = document.getElementById("welcomeMsg");
        if (span && data.username) span.innerText = "Welcome, " + data.username;
    } catch {
        alert("Session expired. Please log in again.");
        window.location.href = "login.html";
    }
}

// ─── quick search ─────────────────────────────────────────────────────────────
function quickSearch(event) {
    event.preventDefault();
    const query = document.getElementById("quickSearchInput").value.trim();
    if (!query) { displayBooks(); return; }
    window.location.href = "userSearch.html?query=" + encodeURIComponent(query);
}

// ─── boot ─────────────────────────────────────────────────────────────────────
window.onload = function () {
    displayWelcome();
    loadBooks();
};
