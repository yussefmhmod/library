// ─── shared helpers ───────────────────────────────────────────────────────────

const API = "http://127.0.0.1:8000";

async function apiFetch(path, options = {}) {
    const res = await fetch(API + path, {
        credentials: "include",   // send session cookie every time
        ...options,
    });
    if (!res.ok) throw Object.assign(new Error("API error"), { status: res.status });
    return res.json();
}

// ─── auth helpers ─────────────────────────────────────────────────────────────

async function requireLogin() {
    try {
        const data = await apiFetch("/users/getUser/");
        return data.username;
    } catch {
        window.location.href = "login.html";
    }
}

async function logout() {
    try { await apiFetch("/users/logout/", { method: "POST" }); } catch {}
    window.location.href = "login.html";
}

// ─── return a book ────────────────────────────────────────────────────────────

async function returnBook(bookId) {
    if (!confirm("Return this book?")) return;
    try {
        const data = await apiFetch(`/books/return/${bookId}/`, { method: "POST" });
        alert(data.message);
        loadAll();          // refresh both tables
    } catch (e) {
        alert("Could not return book: " + (e.message || "server error"));
    }
}

// ─── render tables ────────────────────────────────────────────────────────────

function renderActive(borrows) {
    const tbody = document.querySelector("#activeBorrowsTable tbody");
    tbody.innerHTML = "";

    if (!borrows.length) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">
            You have no books currently borrowed.</td></tr>`;
        return;
    }

    borrows.forEach(b => {
        tbody.innerHTML += `
        <tr>
            <td><a href="userVB.html?id=${b.book_id}">${b.title}</a></td>
            <td>${b.author}</td>
            <td>${b.genre}</td>
            <td>${b.borrow_date}</td>
            <td><span class="borrowed">Borrowed</span></td>
            <td><button onclick="returnBook(${b.book_id})">Return</button></td>
        </tr>`;
    });
}

function renderHistory(history) {
    const tbody = document.querySelector("#historyTable tbody");
    tbody.innerHTML = "";

    if (!history.length) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">
            No borrowing history yet.</td></tr>`;
        return;
    }

    history.forEach(b => {
        tbody.innerHTML += `
        <tr>
            <td><a href="userVB.html?id=${b.book_id}">${b.title}</a></td>
            <td>${b.author}</td>
            <td>${b.genre}</td>
            <td>${b.borrow_date}</td>
            <td>${b.return_date ?? "—"}</td>
            <td><span class="available">Returned</span></td>
        </tr>`;
    });
}

// ─── load everything ──────────────────────────────────────────────────────────

async function loadAll() {
    try {
        const [borrowRes, historyRes] = await Promise.all([
            apiFetch("/books/my-borrows/"),
            apiFetch("/books/my-history/"),
        ]);
        renderActive(borrowRes.active   ?? []);
        renderHistory(historyRes.history ?? []);
    } catch (e) {
        if (e.status === 401) {
            window.location.href = "login.html";
        } else {
            console.error("Failed to load borrow data:", e);
        }
    }
}

// ─── boot ─────────────────────────────────────────────────────────────────────

window.onload = async function () {
    const username = await requireLogin();

    const welcomeSpan = document.getElementById("welcomeMsg");
    if (welcomeSpan && username) {
        welcomeSpan.innerText = "| Welcome, " + username;
    }

    await loadAll();
};
