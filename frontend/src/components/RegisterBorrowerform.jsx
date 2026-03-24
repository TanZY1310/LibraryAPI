import { useState } from 'react';
import { registerBorrower } from '../api/Borrowerapi';
import notyf from '../utils/notyf';

export default function RegisterBorrowerForm({ onSuccess }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) return;
        setLoading(true);
        try {
            const message = await registerBorrower(name, email);
            notyf.success(message);
            setName('');
            setEmail('');
            onSuccess(); // refresh borrower list
        } catch (err) {
            notyf.error('Error registering borrower: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section">
            <h2>Register New Borrower</h2>
            <form className="form-group" onSubmit={handleSubmit}>
                <label htmlFor="borrowerName">Name:</label>
                <input
                    id="borrowerName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <label htmlFor="borrowerEmail">Email:</label>
                <input
                    id="borrowerEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register Borrower'}
                </button>
            </form>
        </div>
    );
}