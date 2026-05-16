window.onload = function () {
    let books = JSON.parse(localStorage.getItem("books")) || [];

    const form = document.querySelector("form");
    const table = document.getElementById("booksTable");

    function displayResults(results) {
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

        if (results.length === 0) {
            html += `<tr><td colspan="6"><center>No results found</center></td></tr>`;
        } else {
            results.forEach(book => {
                html += `
                    <tr>
                        <td>${book.id}</td>
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.genre}</td>
                        <td>${book.status}</td>
                        <td><a href="adminVB.html?id=${book.id}"><font color="blue">View</font></a></td>
                    </tr>
                `;
            });
        }

        table.innerHTML = html;
    }

    displayResults(books);

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const query = form.querySelector("input").value.toLowerCase().trim();
        const type = form.querySelector("select").value;

        const filtered = books.filter(book => {
            if (type === "title")    return book.title  && book.title.toLowerCase().includes(query);
            if (type === "author")   return book.author && book.author.toLowerCase().includes(query);
            if (type === "category") return book.genre  && book.genre.toLowerCase().includes(query);
            return false;
        });

        displayResults(filtered);
    });
};

const input = document.getElementById("inputsearch");
input.addEventListener("keydown", () => {
    const sound = new Audio("sounds/keydown.mp3");
    sound.volume = 0.2;
    sound.play();
});