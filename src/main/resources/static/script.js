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
            { data: 'email' },
            {
                data: null,
                render: function(data, type, row) {
                    let actions = '';
                    actions += `<button onclick="displayBorrowerUpdateForm('${row.name}')" title="Edit" class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>`;
                    actions += `<button onclick="deleteBorrower('${row.name}')" title="Delete" class="delete-btn"><i class="fa-solid fa-trash"></i></button>`;
                    return actions;
                }
            }
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
                    let actions = '';
                    if (!row.borrowed) {
                        actions += `<button onclick="borrowBook('${row.isbn}')" class="borrow-btn">Borrow</button>`;
                    } else if (row.borrower) {
                        actions += `<button onclick="returnBook('${row.isbn}', '${row.borrower.name}')" class="return-btn">Return</button>`;
                    }
                    actions += ` <button onclick="deleteBook('${row.isbn}')" title="Delete" class="delete-btn"><i class="fa-solid fa-trash"></i></button>`;
                    return actions;
                }
            }
        ]
    });

    // Initial load
    displayAllBorrowers();
    displayAllBooks();
});

async function displayAllBorrowers() {
    const response = await fetch('/library/borrower/all');
    const borrowers = await response.json();
    borrowerTable.clear().rows.add(borrowers).draw();
}

async function displayBorrowerUpdateForm(name) {
    try {
        const response = await fetch(`/library/borrower/get?name=${encodeURIComponent(name)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch borrower details');
        }
        const borrower = await response.json();
        document.getElementById('originalBorrowerName').value = borrower.name;
        document.getElementById('originalBorrowerEmail').value = borrower.email;
        document.getElementById('updateBorrowerModal').style.display = "block";
    } catch (error) {
        console.error('Error fetching borrower details:', error);
        alert('Error loading borrower details');
    }
}

async function updateBorrower() {

    const originalName = document.getElementById('originalBorrowerName').value;
    const originalEmail = document.getElementById('originalBorrowerEmail').value;
    const newName = document.getElementById('updateBorrowerName').value;
    const newEmail = document.getElementById('updateBorrowerEmail').value;

    try {
        const url = `/library/updateBorrower?originalName=${encodeURIComponent(originalName)}&originalEmail=${encodeURIComponent(originalEmail)}&newName=${encodeURIComponent(newName)}&newEmail=${encodeURIComponent(newEmail)}`;

        const response = await fetch(url, {
          method: 'POST'
        });

        const result = await response.text();

        if (response.ok) {
            alert(result);
            document.getElementById('updateBorrowerModal').style.display = "none";
            document.getElementById('updateBorrowerName').value = '';
            document.getElementById('updateBorrowerEmail').value = '';
            await displayAllBorrowers();
        } else {
            alert(result);
        }

    } catch (error) {
        alert('Error updating borrower: ' + error.message);
    }
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

        const result = await response.text();
        const modal = document.getElementById('borrowModal');
        modal.style.display = "none";
        alert(result);
        await displayAllBooks();
    } catch (error) {
        alert('Error borrowing book: ' + error.message);
    }
}

async function returnBook(isbn, borrowerName) {
    const response = await fetch(`/library/return?isbn=${encodeURIComponent(isbn)}&borrowerName=${encodeURIComponent(borrowerName)}`, {
        method: 'POST'
    });
    alert(await response.text());
    displayAllBooks();
}

async function deleteBorrower(name) {
    if (!confirm(`Delete borrower "${name}"?`)) return;
    const response = await fetch(`/library/deleteBorrower?name=${encodeURIComponent(name)}`, { method: 'POST' });
    alert(await response.text());
    displayAllBorrowers();
    displayAllBooks();
}

async function deleteBook(isbn) {
    if (!confirm(`Delete book with ISBN "${isbn}"?`)) return;
    const response = await fetch(`/library/deleteBook?isbn=${encodeURIComponent(isbn)}`, { method: 'POST' });
    alert(await response.text());
    displayAllBooks();
}

document.querySelectorAll('.close').forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = btn.closest('.modal'); // finds the modal container around the button
    if (modal) modal.style.display = 'none';
  });
});

window.onclick = function(event) {
    document.querySelectorAll('.modal').forEach(modal => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
}
