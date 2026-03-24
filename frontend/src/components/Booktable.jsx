import { useState, useEffect, useCallback } from 'react';
import { getAllBooks, returnBook, deleteBook } from '../api/Bookapi';
import BorrowBookModal from './Borrowbookmodal';
import { Icon } from "@iconify/react";
import notyf from '../utils/notyf';

export default function BookTable({ refreshTrigger }) {
    const [books, setBooks] = useState([]);
    const [borrowingIsbn, setBorrowingIsbn] = useState(null); // drives borrow modal
    const [search, setSearch] = useState('');

    const fetchBooks = useCallback(async () => {
        try {
            const data = await getAllBooks();
            setBooks(Array.isArray(data) ? data : []);
        } catch (err) {
            alert('Error loading books: ' + err.message);
            setBooks([]);
        }
    }, []);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks, refreshTrigger]);

    const handleReturn = async (isbn, borrowerName) => {
        try {
            const message = await returnBook(isbn, borrowerName);
            notyf.success(message);
            fetchBooks();
        } catch (err) {
            notyf.error('Error returning book: ' + err.message);
        }
    };

    const handleDelete = async (isbn) => {
        if (!confirm(`Delete book with ISBN "${isbn}"?`)) return;
        try {
            const message = await deleteBook(isbn);
            notyf.success(message);
            fetchBooks();
        } catch (err) {
            notyf.error('Error deleting book: ' + err.message);
        }
    };

    // Client-side search across all visible columns
    const filtered = books.filter((b) =>
        [b.isbn, b.title, b.author, b.borrower?.name]
            .filter(Boolean)
            .some((val) => val.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="section">
            <h2>List of Books</h2>

            <div className="table-controls">
                <input
                    type="text"
                    placeholder="Search books..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
            </div>

            <table className="display">
                <thead>
                    <tr>
                        <th>ISBN</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Status</th>
                        <th>Borrowed By</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="empty-row">No books found.</td>
                        </tr>
                    ) : (
                        filtered.map((book) => (
                            <tr key={book.isbn}>
                                <td>{book.isbn}</td>
                                <td>{book.title}</td>
                                <td>{book.author}</td>
                                <td>
                                    <span className={`status-badge ${book.borrowed ? 'borrowed' : 'available'}`}>
                                        {book.borrowed ? 'Borrowed' : 'Available'}
                                    </span>
                                </td>
                                <td>{book.borrower ? book.borrower.name : '-'}</td>
                                <td className="action-cell">
                                    {!book.borrowed && (
                                        <button
                                            className="borrow-btn"
                                            onClick={() => setBorrowingIsbn(book.isbn)}
                                        >
                                            Borrow
                                        </button>
                                    )}
                                    {book.borrowed && book.borrower && (
                                        <button
                                            className="return-btn"
                                            onClick={() => handleReturn(book.isbn, book.borrower.name)}
                                        >
                                            Return
                                        </button>
                                    )}
                                    <button
                                        className="delete-btn"
                                        title="Delete"
                                        onClick={() => handleDelete(book.isbn)}
                                    >
                                        <Icon icon="icon-park:delete-one" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <BorrowBookModal
                isbn={borrowingIsbn}
                onClose={() => setBorrowingIsbn(null)}
                onSuccess={fetchBooks}
            />
        </div>
    );
}