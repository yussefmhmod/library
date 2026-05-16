let books = [];



async function loadBooks() {
    try {
        const response = await fetch("http://127.0.0.1:8000/books/books/");

        if (!response.ok) {
            throw new Error("Failed to fetch books");
        }

        books = await response.json();
        displayBooks();
    } catch (error) {
        console.error("Error loading books:", error);
    }
}



function getLoggedInUser() {
return fetch('http://127.0.0.1:8000/users/getUser/' ,{
    method: 'GET',

    credentials: 'include'

    })
    .then(res=> res.json())
    .then(data=> {
        return data ;
    })
}



async function displayWelcome() {
    
    let welcomeSpan = document.getElementById("welcomeMsg");
    
    try {
        let user = await getLoggedInUser();
        if (user.username) {
           
            welcomeSpan.innerText = "Welcome, " + user.username;
        }

    } catch (err) {
        console.error(err);
          alert("User not Found!");
          window.location.href = "login.html";
    } 
    
}












function displayBooks() {
    let shelf = document.getElementById("booksShelf");
    shelf.innerHTML = "";

    if (books.length === 0) {
        shelf.innerHTML = "<p>No books available in the library yet.</p>";
        return;
    }

      books.forEach(book => {
        shelf.innerHTML += `
        <div class="book-card">
            <img src="${book.image}" alt="${book.title}" width=150>

            <h2>${book.title}</h2>

            <p><h4>Author:</h4> ${book.author}</p>
            <p><h4>Category:</h4>  ${book.genre}</p>
            <p class="${book.status === "Borrowed" ? "borrowed" : "available"}">
                ${book.status}
            </p>

            <a href="userVB.html?id=${book.id}" class="view-btn">
                View Details
            </a>
        </div>
        `;
    });
}

function logout() {
    window.location.href = "login.html";
}

window.onload = function () {
    displayWelcome();
    loadBooks();
};

function quickSearch(event) {
    event.preventDefault();
    let query = document.getElementById("quickSearchInput").value.trim();
    if (query === "") {
        displayBooks();
        return;
    }
    window.location.href = "userSearch.html?query=" + encodeURIComponent(query);
}