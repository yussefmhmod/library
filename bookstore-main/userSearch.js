
 let preQuery ; 
 let books ;
window.onload = async function () {
    const res = await fetch("http://127.0.0.1:8000/books/");
    books = await res.json();
    const params = new URLSearchParams(window.location.search);
    preQuery = params.get("query");
    
    displayResults(books);

}

    const form = document.querySelector("form");
    // if arriving from quick search on home page, pre-fill and run search
    if (preQuery) {
        const input = form.querySelector("input");
        input.value = preQuery;
        const filtered = books.filter(book =>
            (book.title && book.title.toLowerCase().includes(preQuery.toLowerCase())) ||
            (book.author && book.author.toLowerCase().includes(preQuery.toLowerCase())) ||
            (book.genre && book.genre.toLowerCase().includes(preQuery.toLowerCase()))
        );
        displayResults(books);
    } else {
        displayResults(books);
    }

   const searchInput = form.querySelector("input");

    searchInput.addEventListener("input", function () {

    const query = searchInput.value.toLowerCase().trim();

    const type = form.querySelector("select").value;

    const filtered = books.filter(book => {

        if (type === "title")
            return book.title &&
                   book.title.toLowerCase().includes(query);

        if (type === "author")
            return book.author &&
                   book.author.toLowerCase().includes(query);

        if (type === "category")
            return book.genre &&
                   book.genre.toLowerCase().includes(query);

        return false;
    });

    displayResults(filtered);
});

const input = document.getElementById("inputsearch");
input.addEventListener("keydown", () => {
    const sound = new Audio("sounds/keydown.mp3");
    sound.volume = 0.2;
    sound.play();
});

function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

    function displayResults(results)
    {
        let html = `
            <tr>
                <th>ID</th>
                <th>Book Name</th>
                <th>Author</th>
                <th>Category</th>
                <th>Status</th>
                <th>Link</th>
            </tr>
        `;

        if (!results) {
            html += `<tr><td colspan="6"><center> No results WERE found</center></td></tr>`;
        } else {
            results.forEach(book => {
                html += `
                    <tr>
                        <td>${book.id}</td>
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.genre}</td>
                        <td>${book.status}</td>
                        <td><a href="userVB.html?id=${book.id}"><font color="blue">View</font></a></td>
                    </tr>
                `;
            });
        }
        const table = document.getElementById("booksTable");
        table.innerHTML = html;
    }