window.addEventListener("DOMContentLoaded", function () {

    const defaultBooks = [
        {
            id: 0,
            title: "The Metamorphosis",
            author: "Franz Kafka",
            genre: "Philosophical Novel",
            borrowDate: "1 May",
            returnDate: "15 May",
            status: "Borrowed",
            image: "images/KafkaCover.jpg",
            pages: 70,
            price: 50,
            description: "A story about a man who wakes up transformed into a giant insect."
        },
        {
            id: 1,
            title: "The Origin of Species",
            author: "Charles Darwin",
            genre: "Biology",
            borrowDate: "3 May",
            returnDate: "17 May",
            status: "Available",
            image: "images/TheOriginOfSCover.jpg",
            pages: 465,
            price: 200,
            description: "Darwin's groundbreaking work on evolution by natural selection."
        }
    ];

    function loadBooks() {
        const stored = JSON.parse(localStorage.getItem("books"));
        if (!stored || stored.some(b => b.pages === undefined || b.image === undefined)) {
            localStorage.setItem("books", JSON.stringify(defaultBooks));
            return JSON.parse(JSON.stringify(defaultBooks));
        }
        return stored;
    }

    let books = loadBooks();

    const params = new URLSearchParams(window.location.search);
    const bookId = parseInt(params.get("id"));
    const bookIndex = books.findIndex(b => b.id === bookId);
    let book = books[bookIndex];

    function loadBook() {
        if (!book) return;
        document.getElementById("title").textContent = book.title;
        document.getElementById("author").textContent = "Author: " + book.author;
        document.getElementById("genre").textContent = "Genre: " + book.genre;
        document.getElementById("pages").textContent = "Pages: " + book.pages;
        document.getElementById("price").textContent = "Price: " + book.price;
        document.getElementById("description").textContent = book.description;
        document.getElementById("status").textContent = book.status;
        document.getElementById("bookImage").src = book.image;
    }

    window.borrowBook = function () {
        if (book.status === "Available") {
            alert("Borrowed successfully!");
            book.status = "Borrowed";
            book.borrowDate = new Date().toLocaleDateString();
            books[bookIndex] = book;
            localStorage.setItem("books", JSON.stringify(books));
            loadBook();
        } else {
            alert("Not available");
        }
    };

    window.returnBook = function () {
        if (book.status === "Borrowed") {
            alert("Returned successfully!");
            book.status = "Available";
            book.returnDate = new Date().toLocaleDateString();
            books[bookIndex] = book;
            localStorage.setItem("books", JSON.stringify(books));
            loadBook();
        }
    };

    loadBook();
});