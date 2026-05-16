

async function addBook(book) {
    
    const res = await fetch("http://127.0.0.1:8000/books/add/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(book)
    });

    return await res.json();
}
document.getElementById("addForm").addEventListener("submit", function(e) {
    e.preventDefault();

   

    const book = {
        title: document.getElementById("bname").value,
        author: document.getElementById("author").value,
        genre: document.getElementById("catigory").value,
       
        price: document.getElementById("bprice").value,
        description: document.getElementById("desc").value
    };

    fetch("http://127.0.0.1:8000/books/add/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(book)
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        alert("Book added!");
        window.location.href = "adminHP.html";
    })
    .catch(err => console.log(err));
});