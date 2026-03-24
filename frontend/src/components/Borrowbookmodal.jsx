import { useState, useEffect } from 'react';
import Modal from './Modal';
import { getAllBorrowers } from '../api/Borrowerapi';
import { borrowBook } from '../api/Bookapi';
import notyf from '../utils/notyf';

export default function BorrowBookModal({ isbn, onClose, onSuccess }) {
    const [borrowers, setBorrowers] = useState([]);
    const [selectedBorrower, setSelectedBorrower] = useState('');
    const [loading, setLoading] = useState(false);

    // Load borrowers each time the modal opens for a book
    useEffect(() => {
        if (!isbn) return;
        setSelectedBorrower('');
        getAllBorrowers()
            .then(setBorrowers)
            .catch(() => alert('Error loading borrowers list'));
    }, [isbn]);

    const handleConfirm = async () => {
        if (!selectedBorrower) {
            notyf.error('Please select a borrower');
            return;
        }
        setLoading(true);
        try {
            const message = await borrowBook(isbn, selectedBorrower);
            notyf.success(message);
            onClose();
            onSuccess(); // refresh book table
        } catch (err) {
            notyf.error('Error borrowing book: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={!!isbn} onClose={onClose} title="Select Borrower">
            <label htmlFor="borrowerSelect">Choose a borrower from the dropdown list</label>
            <select
                id="borrowerSelect"
                className="borrower-select"
                value={selectedBorrower}
                onChange={(e) => setSelectedBorrower(e.target.value)}
            >
                <option value="">Select a borrower...</option>
                {borrowers.map((b) => (
                    <option key={b.name} value={b.name}>
                        {b.name} ({b.email})
                    </option>
                ))}
            </select>
            <button className="confirm-btn" onClick={handleConfirm} disabled={loading}>
                {loading ? 'Processing...' : 'Confirm'}
            </button>
        </Modal>
    );
}