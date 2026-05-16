// ─── helpers ──────────────────────────────────────────────────────────────────

const API = "http://127.0.0.1:8000";

async function apiFetch(path, options = {}) {
    const res = await fetch(API + path, { credentials: "include", ...options });
    if (!res.ok) throw Object.assign(new Error("API error"), { status: res.status });
    return res.json();
}

// ─── auth ─────────────────────────────────────────────────────────────────────

async function checkAuth() {
    try {
        const data = await apiFetch("/users/getUser/");
        const span = document.getElementById("welcomeMsg");
        if (span) span.textContent = "Welcome, " + data.username;
    } catch {
        window.location.href = "login.html";
    }
}

async function logout() {
    try { await apiFetch("/users/logout/", { method: "POST" }); } catch {}
    window.location.href = "login.html";
}

// ─── borrow action ────────────────────────────────────────────────────────────

async function borrowBook() {
    const bookId = new URLSearchParams(window.location.search).get("id");
    if (!bookId) return;
    try {
        const data = await apiFetch(`/books/borrow/${bookId}/`, { method: "POST" });
        alert(data.message);
        loadBook();   // refresh UI
    } catch (e) {
        if (e.status === 401) {
            alert("Please log in first.");
            window.location.href = "login.html";
        } else {
            alert("Could not borrow book. You may already have it borrowed, or no copies are left.");
        }
    }
}

// ─── render ───────────────────────────────────────────────────────────────────

function renderBook(book) {
    document.getElementById("title").textContent       = book.title;
    document.getElementById("author").textContent      = "Author: "      + book.author;
    document.getElementById("genre").textContent       = "Genre: "       + book.genre;
    document.getElementById("pages").textContent       = "Price: "       + book.price + " L.E";
    document.getElementById("description").textContent = book.description;

    // ── image ────────────────────────────────────────────────────────────────
    const img = document.getElementById("bookImage");
    if (img) img.src = book.image || "images/placeholder.png";

    // ── status + quantity ────────────────────────────────────────────────────
    const statusEl = document.getElementById("status");
    const qtyEl    = document.getElementById("quantity");
    if (statusEl) statusEl.textContent = book.status;
    if (qtyEl)    qtyEl.textContent    = "Copies available: " + book.quantity;

    // ── borrow button ─────────────────────────────────────────────────────────
    // Rules:
    //   • Hide if unavailable (quantity = 0)
    //   • Show "Already Borrowed" (disabled) if user_borrowed = true
    //   • Otherwise show active Borrow button
    // The RETURN button lives only on userBB.html — it is NOT rendered here.
    const borrowBtn = document.getElementById("borrowBtn");
    if (!borrowBtn) return;

    if (book.quantity <= 0 || book.status === "Unavailable") {
        borrowBtn.textContent  = "Unavailable";
        borrowBtn.disabled     = true;
        borrowBtn.style.opacity = "0.5";
    } else if (book.user_borrowed) {
        borrowBtn.textContent  = "Already Borrowed ✓";
        borrowBtn.disabled     = true;
        borrowBtn.style.background = "#555";
    } else {
        borrowBtn.textContent  = "Borrow Book";
        borrowBtn.disabled     = false;
        borrowBtn.style.opacity = "1";
    }
}

// ─── load ─────────────────────────────────────────────────────────────────────

async function loadBook() {
    const bookId = new URLSearchParams(window.location.search).get("id");
    if (!bookId) {
        document.getElementById("title").textContent = "Book not found.";
        return;
    }
    try {
        const book = await apiFetch(`/books/detail/${bookId}/`);
        renderBook(book);
    } catch {
        document.getElementById("title").textContent = "Failed to load book.";
    }
}

// ─── boot ─────────────────────────────────────────────────────────────────────

window.addEventListener("DOMContentLoaded", async function () {
    await checkAuth();
    await loadBook();
});
