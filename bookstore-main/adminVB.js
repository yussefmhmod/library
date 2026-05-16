// ─── helpers ──────────────────────────────────────────────────────────────────

const API = "http://127.0.0.1:8000";

async function apiFetch(path, options = {}) {
    const res = await fetch(API + path, { credentials: "include", ...options });
    if (!res.ok) throw Object.assign(new Error("API error"), { status: res.status });
    return res.json();
}

let currentBook = null;
let bookId      = null;

// ─── render ───────────────────────────────────────────────────────────────────

function renderBook(book) {
    currentBook = book;

    document.getElementById("title").textContent       = book.title;
    document.getElementById("author").textContent      = "Author: "      + book.author;
    document.getElementById("genre").textContent       = "Genre: "       + book.genre;
    document.getElementById("pages").textContent       = "Price: "       + book.price  + " L.E";
    document.getElementById("description").textContent = book.description;
    document.getElementById("status").textContent      = book.status;
    document.getElementById("quantity").textContent    = "Copies: "      + book.quantity;

    const img = document.getElementById("bookImage");
    if (img) img.src = book.image || "images/placeholder.png";

    // toggle button label
    const toggleBtn = document.getElementById("toggleBtn");
    if (toggleBtn) {
        toggleBtn.textContent =
            book.status === "Available" ? "Mark Unavailable" : "Mark Available";
    }

    // ── current borrowers table ──────────────────────────────────────────────
    const cbody = document.querySelector("#currentBorrowersTable tbody");
    if (cbody) {
        cbody.innerHTML = "";
        if (!book.current_borrowers.length) {
            cbody.innerHTML =
                `<tr><td colspan="3" style="text-align:center; color:#aaa;">
                 Nobody is borrowing this book right now.</td></tr>`;
        } else {
            book.current_borrowers.forEach(b => {
                cbody.innerHTML += `
                <tr>
                    <td>${b.username}</td>
                    <td>${b.borrow_date}</td>
                    <td>
                        <button onclick="forceReturn(${b.borrow_id}, '${b.username}')">
                            Force Return
                        </button>
                    </td>
                </tr>`;
            });
        }
    }

    // ── history table ────────────────────────────────────────────────────────
    const hbody = document.querySelector("#borrowHistoryTable tbody");
    if (hbody) {
        hbody.innerHTML = "";
        if (!book.borrow_history.length) {
            hbody.innerHTML =
                `<tr><td colspan="3" style="text-align:center; color:#aaa;">
                 No history yet.</td></tr>`;
        } else {
            book.borrow_history.forEach(h => {
                hbody.innerHTML += `
                <tr>
                    <td>${h.username}</td>
                    <td>${h.borrow_date}</td>
                    <td>${h.return_date ?? "—"}</td>
                </tr>`;
            });
        }
    }
}

// ─── actions ──────────────────────────────────────────────────────────────────

async function toggleAvailability() {
    if (!currentBook || !bookId) return;
    const newStatus =
        currentBook.status === "Available" ? "Unavailable" : "Available";
    try {
        await apiFetch(`/books/edit/${bookId}/`, {
            method:  "PUT",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ status: newStatus }),
        });
        loadBook();
    } catch {
        alert("Failed to update status.");
    }
}

async function deleteBook() {
    if (!bookId) return;
    if (!confirm("Permanently delete this book and all its borrow records?")) return;
    try {
        await apiFetch(`/books/delete/${bookId}/`, { method: "DELETE" });
        alert("Book deleted.");
        window.location.href = "adminBM.html";
    } catch {
        alert("Delete failed.");
    }
}

async function forceReturn(borrowId, username) {
    // Admin force-returns a specific borrow by marking it returned on the backend.
    // This requires a small admin endpoint – see the suggestion section in the docs.
    alert(`Force-return for ${username} is not yet implemented on the backend.\n` +
          `Add: POST /books/admin-return/<borrow_id>/`);
}

// ─── inline edit ──────────────────────────────────────────────────────────────

async function saveEdits() {
    if (!bookId) return;
    const title  = document.getElementById("editTitle").value.trim();
    const author = document.getElementById("editAuthor").value.trim();
    const price  = parseFloat(document.getElementById("editPrice").value);
    const qty    = parseInt(document.getElementById("editQty").value, 10);
    const desc   = document.getElementById("editDesc").value.trim();

    if (!title || !author || isNaN(price) || isNaN(qty)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    try {
        await apiFetch(`/books/edit/${bookId}/`, {
            method:  "PUT",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ title, author, price, quantity: qty, description: desc }),
        });
        alert("Book updated successfully.");
        loadBook();
        document.getElementById("editPanel").style.display = "none";
    } catch {
        alert("Update failed.");
    }
}

function showEditPanel() {
    if (!currentBook) return;
    document.getElementById("editTitle").value  = currentBook.title;
    document.getElementById("editAuthor").value = currentBook.author;
    document.getElementById("editPrice").value  = currentBook.price;
    document.getElementById("editQty").value    = currentBook.quantity;
    document.getElementById("editDesc").value   = currentBook.description;
    document.getElementById("editPanel").style.display = "block";
}

// ─── load ─────────────────────────────────────────────────────────────────────

async function loadBook() {
    bookId = new URLSearchParams(window.location.search).get("id");
    if (!bookId) {
        document.getElementById("title").textContent = "No book selected.";
        return;
    }
    try {
        const book = await apiFetch(`/books/admin-detail/${bookId}/`);
        renderBook(book);
    } catch {
        document.getElementById("title").textContent = "Failed to load book.";
    }
}

window.addEventListener("DOMContentLoaded", loadBook);
