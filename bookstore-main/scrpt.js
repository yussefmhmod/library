async function getBooks() { // bygebha mn el django w return jason(el books)
    const res = await fetch("http://127.0.0.1:8000/books/");
    return await res.json();
}

async function displayBooks() {
    let books = await getBooks(); //await
    let Shelf = document.getElementById("booksShelf");
    Shelf.innerHTML = "";

    books.forEach(book => {
        Shelf.innerHTML += `
        <div class="book">
            <img src="${book.image}" width="150">
            <h2>${book.title}</h2>
            <p><h4>Price:</h4> ${book.price} L.E</p>
            <p><h4>Author:</h4>Author: ${book.author}</p>
            <button onclick="editBook(${book.id})">Edit</button>
            <button onclick="deleteBook(${book.id})">Delete</button>
        </div>
        `;
    });
}

function deleteBook(id) {
    
    let confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;
   
    fetch(`http://127.0.0.1:8000/books/delete/${id}/`, {
        method: "DELETE"
    })
    .then(() => displayBooks());
}

function editBook(id) {

    const newTitle = prompt("New name:");
    const newAuthor = prompt("New author:");
    const newPrice = prompt("New price:");

    if (!newTitle && !newAuthor && !newPrice) return;

    fetch(`http://127.0.0.1:8000/books/edit/${id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: newTitle,
            author: newAuthor,
            price: newPrice,
        })
    })
    .then(() => displayBooks());
}


document.addEventListener("DOMContentLoaded", function () {
    displayBooks();
});

