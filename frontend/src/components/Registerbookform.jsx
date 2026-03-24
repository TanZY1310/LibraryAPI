import { useState } from 'react';
import { registerBook } from '../api/Bookapi';
import notyf from '../utils/notyf';

export default function RegisterBookForm({ onSuccess }) {
    const [isbn, setIsbn] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isbn.trim() || !title.trim() || !author.trim()) return;
        setLoading(true);
        try {
            const message = await registerBook(isbn, title, author);
            notyf.success(message);
            setIsbn('');
            setTitle('');
            setAuthor('');
            onSuccess(); // refresh book list
        } catch (err) {
            notyf.error('Error registering book: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section">
            <h2>Register New Book</h2>
            <form className="form-group" onSubmit={handleSubmit}>
                <label htmlFor="isbn">ISBN:</label>
                <input
                    id="isbn"
                    type="text"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    required
                />
                <label htmlFor="title">Title:</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <label htmlFor="author">Author:</label>
                <input
                    id="author"
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register Book'}
                </button>
            </form>
        </div>
    );
}