let books = [];

async function loadBooks() {
    try {
        const response = await fetch("http://127.0.0.1:8000/books/books/");

        if (!response.ok) {
            throw new Error("Failed to fetch books");
        }

        books = await response.json();

        renderBooks();

    } catch (error) {
        console.error("Error loading books:", error);
    }
}

function renderBooks() {
    const container = document.getElementById("booksContainer");
    container.innerHTML = "";

    books.forEach((book, index) => {
        container.innerHTML += `
<div class="book-card">
    <img src="${book.image}" width="150">
    
    <h2>${book.title}</h2>

    <p>Price: ${book.price} L.E</p>
    <p>Author: ${book.author}</p>

    <p><h4>Genre:</h4> ${book.genre}</p>

    <p><h4>Borrow Date:</h4> ${book.borrowDate}</p>

    <p><h4>Return Date:</h4> ${book.returnDate}</p>

    <p><h4>Status:</h4> ${book.status}</p>

    <button onclick="setStatus(${index})">Set Status</button>

    <button class="danger" onclick="removeBook(${index})">
        Remove
    </button>
</div>
`;
    });
}

async function setStatus(index) {

    const newStatus =
        books[index].status === "Borrowed"
            ? "Available"
            : "Borrowed";

    const bookId = books[index].id;

    try {

        const response = await fetch(
            `http://127.0.0.1:8000/books/edit/${bookId}/`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    status: newStatus
                })
            }
        );

        if (!response.ok) {
            throw new Error("Update failed");
        }

        books[index].status = newStatus;

        renderBooks();

    } catch (error) {

        console.error(error);
    }
}


async function removeBook(index) {

    const ok = confirm("Delete this record?");

    if (!ok) return;

    const bookId = books[index].id;

    try {

        const response = await fetch(
            `http://127.0.0.1:8000/books/delete/${bookId}/`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error("Delete failed");
        }

        books.splice(index, 1);

        renderBooks();

    } catch (error) {

        console.error(error);
    }
}

loadBooks();