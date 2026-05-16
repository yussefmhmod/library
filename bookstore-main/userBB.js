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
    if (!stored || stored.some(b => b.id === undefined || b.title === undefined)) {
        localStorage.setItem("books", JSON.stringify(defaultBooks));
        return JSON.parse(JSON.stringify(defaultBooks));
    }
    return stored;
}

let books = loadBooks();

function renderTable(data) {
    const tbody = document.querySelector("#booksTable tbody");
    tbody.innerHTML = "";
    data.forEach((book, index) => {
        tbody.innerHTML += `
        <tr>
            <td><a href="userVB.html?id=${book.id}">${book.title}</a></td>
            <td>${book.author}</td>
            <td>${book.genre}</td>
            <td>${book.borrowDate}</td>
            <td>${book.returnDate}</td>
            <td>${book.status}</td>
            <td><button onclick="returnBook(${index})">Return</button></td>
        </tr>
        `;
    });
}

function returnBook(index) {
    if (books[index].status === "Borrowed") {
        alert("Returned successfully!");
        books[index].status = "Available";
        books[index].returnDate = new Date().toLocaleDateString();
        localStorage.setItem("books", JSON.stringify(books));
        renderTable(books);
    }
}

function filterBooks() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const filtered = books.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.genre.toLowerCase().includes(query)
    );
    renderTable(filtered);
}

renderTable(books);