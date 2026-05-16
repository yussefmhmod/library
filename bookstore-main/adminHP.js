// ─── helpers ──────────────────────────────────────────────────────────────────

const API = "http://127.0.0.1:8000";

async function apiFetch(path, options = {}) {
    const res = await fetch(API + path, { credentials: "include", ...options });
    if (!res.ok) throw Object.assign(new Error("API error"), { status: res.status });
    return res.json();
}

// ─── render stats dashboard ───────────────────────────────────────────────────

function renderStats(stats) {
    document.getElementById("statTotal").textContent     = stats.total_books;
    document.getElementById("statAvail").textContent     = stats.available;
    document.getElementById("statUnavail").textContent   = stats.unavailable;
    document.getElementById("statBorrowed").textContent  = stats.active_borrows;
    document.getElementById("statUsers").textContent     = stats.total_users;

    const tbody = document.querySelector("#recentTable tbody");
    tbody.innerHTML = "";
    if (!stats.recent_borrows.length) {
        tbody.innerHTML =
            `<tr><td colspan="3" style="text-align:center; color:#aaa;">
             No recent activity.</td></tr>`;
    } else {
        stats.recent_borrows.forEach(r => {
            tbody.innerHTML += `
            <tr>
                <td>${r.username}</td>
                <td>${r.book}</td>
                <td>${r.borrow_date}</td>
            </tr>`;
        });
    }
}

// ─── book shelf (same as before) ─────────────────────────────────────────────

async function loadBooks() {
    try {
        const books = await apiFetch("/books/books/");
        const shelf = document.getElementById("booksShelf");
        shelf.innerHTML = "";
        books.forEach(book => {
            shelf.innerHTML += `
            <div class="book-card">
                <img src="${book.image || 'images/placeholder.png'}" alt="${book.title}" width="150">
                <h2>${book.title}</h2>
                <p><h4>Author:</h4> ${book.author}</p>
                <p><h4>Copies:</h4> ${book.quantity}</p>
                <p class="${book.status === 'Available' ? 'available' : 'borrowed'}">
                    ${book.status}
                </p>
                <a href="adminVB.html?id=${book.id}" class="view-btn">View / Edit</a>
            </div>`;
        });
    } catch (e) {
        console.error("Failed to load books:", e);
    }
}

// ─── boot ─────────────────────────────────────────────────────────────────────

window.onload = async function () {
    try {
        const stats = await apiFetch("/books/stats/");
        renderStats(stats);
    } catch (e) {
        console.error("Could not load stats:", e);
    }
    await loadBooks();
};
