async function registerBorrower() {
    const name = document.getElementById('borrowerName').value;
    const email = document.getElementById('borrowerEmail').value;
    const response = await fetch(`/library/registerBorrower?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`, {
        method: 'POST'
    });
    displayAllBorrowers();
    alert(await response.text());
    document.getElementById('borrowerName').value = '';
    document.getElementById('borrowerEmail').value = '';
}

async function registerBook() {
    const isbn = document.getElementById('isbn').value;
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const response = await fetch(`/library/registerBook?isbn=${encodeURIComponent(isbn)}&title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`, {
        method: 'POST'
    });
    displayAllBooks();
    alert(await response.text());
    document.getElementById('isbn').value = '';
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
}

let borrowerTable, bookTable;

$(document).ready(function() {
    borrowerTable = $('#borrowerTable').DataTable({
        columns: [
            { data: 'name' },
            { data: 'email' }
        ]
    });

    bookTable = $('#bookTable').DataTable({
        columns: [
            { data: 'isbn' },
            { data: 'title' },
            { data: 'author' },
            {
                data: 'borrowed',
                render: function(data) {
                    return data ? 'Borrowed' : 'Available';
                }
            },
            {
                data: 'borrower',
                render: function(data) {
                    return data ? data.name : '-';
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    if (!row.borrowed) {
                        return `<button onclick="borrowBook('${row.isbn}')" class="borrow-btn">Borrow</button>`;
                    } else if (row.borrower) {
                        return `<button onclick="returnBook('${row.isbn}', '${row.borrower.name}')" class="return-btn">Return</button>`;
                    }
                    return '-';
                }
            }
        ]
    });

    // Modal event handlers
    document.querySelector('.close').onclick = function() {
        document.getElementById('borrowModal').style.display = "none";
    }

    window.onclick = function(event) {
        const modal = document.getElementById('borrowModal');
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Initial load
    displayAllBorrowers();
    displayAllBooks();
});

async function displayAllBorrowers() {
    const response = await fetch('/library/borrower/all');
    const borrowers = await response.json();
    borrowerTable.clear().rows.add(borrowers).draw();
}

async function displayAllBooks() {
    try {
        const response = await fetch('/library/book/all');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const books = await response.json();
        bookTable.clear().rows.add(books).draw();
    } catch (error) {
        console.error('Error displaying books:', error);
        alert('Error refreshing book list');
    }
}

let selectedIsbn = '';

async function borrowBook(isbn) {
    try {
        selectedIsbn = isbn;
        const modal = document.getElementById('borrowModal');
        const select = document.getElementById('borrowerSelect');

        select.innerHTML = '<option value="">Select a borrower...</option>';

        const response = await fetch('/library/borrower/all');
        if (!response.ok) {
            throw new Error('Failed to fetch borrowers');
        }
        const borrowers = await response.json();

        borrowers.forEach(borrower => {
            const option = document.createElement('option');
            option.value = borrower.name;
            option.textContent = `${borrower.name} (${borrower.email})`;
            select.appendChild(option);
        });

        modal.style.display = "block";
    } catch (error) {
        console.error('Error in borrowBook:', error);
        alert('Error loading borrowers list');
    }
}

async function confirmBorrow() {
    const select = document.getElementById('borrowerSelect');
    const borrowerName = select.value;

    if (!borrowerName) {
        alert('Please select a borrower');
        return;
    }

    try {
        const response = await fetch(`/library/borrow?isbn=${encodeURIComponent(selectedIsbn)}&borrowerName=${encodeURIComponent(borrowerName)}`, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.text();
        const modal = document.getElementById('borrowModal');
        modal.style.display = "none";
        alert(result);
        await displayAllBooks();
    } catch (error) {
        alert('Error borrowing book: ' + error.message);
    }
}

document.querySelector('.close').onclick = function() {
    document.getElementById('borrowModal').style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById('borrowModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

async function returnBook(isbn, borrowerName) {
    const response = await fetch(`/library/return?isbn=${encodeURIComponent(isbn)}&borrowerName=${encodeURIComponent(borrowerName)}`, {
        method: 'POST'
    });
    alert(await response.text());
    displayAllBooks();
}