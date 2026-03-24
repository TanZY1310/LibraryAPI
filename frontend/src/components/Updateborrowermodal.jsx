import { useState, useEffect } from 'react';
import Modal from './Modal';
import { updateBorrower } from '../api/Borrowerapi';
import notyf from '../utils/notyf';

export default function UpdateBorrowerModal({ borrower, onClose, onSuccess }) {
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(false);

    // Reset fields whenever a different borrower is loaded
    useEffect(() => {
        setNewName('');
        setNewEmail('');
    }, [borrower]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const message = await updateBorrower({
                originalName: borrower.name,
                originalEmail: borrower.email,
                newName,
                newEmail,
            });
            notyf.success(message);
            onClose();
            onSuccess(); // refresh table
        } catch (err) {
            notyf.error('Error updating borrower: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={!!borrower} onClose={onClose} title="Update Borrower Details">
            <form onSubmit={handleSubmit}>
                <label>Current Name:</label>
                <input type="text" value={borrower?.name || ''} disabled />

                <label>Current Email:</label>
                <input type="email" value={borrower?.email || ''} disabled />

                <label htmlFor="updateBorrowerName">New Name:</label>
                <input
                    id="updateBorrowerName"
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                />

                <label htmlFor="updateBorrowerEmail">New Email:</label>
                <input
                    id="updateBorrowerEmail"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                />

                <button type="submit" className="confirm-btn" disabled={loading}>
                    {loading ? 'Updating...' : 'Update'}
                </button>
            </form>
        </Modal>
    );
}