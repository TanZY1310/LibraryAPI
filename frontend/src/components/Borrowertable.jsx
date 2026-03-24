import { useState, useEffect, useCallback } from 'react';
import { getAllBorrowers, getBorrowerByName, deleteBorrower } from '../api/Borrowerapi';
import UpdateBorrowerModal from './Updateborrowermodal';
import { Icon } from "@iconify/react";
import notyf from '../utils/notyf';

export default function BorrowerTable({ refreshTrigger }) {
    const [borrowers, setBorrowers] = useState([]);
    const [selectedBorrower, setSelectedBorrower] = useState(null); // for update modal
    const [search, setSearch] = useState('');

    const fetchBorrowers = useCallback(async () => {
        try {
            const data = await getAllBorrowers();
            setBorrowers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error loading borrowers: ' + err.message);
            setBorrowers([]);
        }
    }, []);

    useEffect(() => {
        fetchBorrowers();
    }, [fetchBorrowers, refreshTrigger]);

    const handleEdit = async (name) => {
        try {
            const borrower = await getBorrowerByName(name);
            setSelectedBorrower(borrower);
        } catch {
            notyf.error('Error loading borrower details');
        }
    };

    const handleDelete = async (name) => {
        if (!confirm(`Delete borrower "${name}"?`)) return;
        try {
            const message = await deleteBorrower(name);
            notyf.success(message);
            fetchBorrowers();
        } catch (err) {
            notyf.error('Error deleting borrower: ' + err.message);
        }
    };

    // Client-side search — mirrors DataTables search behaviour
    const filtered = borrowers.filter(
        (b) =>
            b.name.toLowerCase().includes(search.toLowerCase()) ||
            b.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="section">
            <h2>List of Borrowers</h2>

            <div className="table-controls">
                <input
                    type="text"
                    placeholder="Search borrowers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
            </div>

            <table className="display">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="empty-row">No borrowers found.</td>
                        </tr>
                    ) : (
                        filtered.map((borrower) => (
                            <tr key={borrower.name}>
                                <td>{borrower.name}</td>
                                <td>{borrower.email}</td>
                                <td className="action-cell">
                                    <button
                                        className="edit-btn"
                                        title="Edit"
                                        onClick={() => handleEdit(borrower.name)}
                                    >
                                        <Icon icon="glyphs-poly:edit" />
                                    </button>
                                    <button
                                        className="delete-btn"
                                        title="Delete"
                                        onClick={() => handleDelete(borrower.name)}
                                    >
                                        <Icon icon="icon-park:delete-one" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <UpdateBorrowerModal
                borrower={selectedBorrower}
                onClose={() => setSelectedBorrower(null)}
                onSuccess={fetchBorrowers}
            />
        </div>
    );
}