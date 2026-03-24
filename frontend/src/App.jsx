import { useState } from 'react';
import RegisterBorrowerForm from './components/RegisterBorrowerform';
import BorrowerTable from './components/Borrowertable';
import RegisterBookForm from './components/Registerbookform';
import BookTable from './components/Booktable';
import './App.css';

export default function App() {
    // A simple counter used to trigger re-fetches in child tables after
    // a registration succeeds — avoids prop drilling callbacks deeply.
    const [borrowerRefresh, setBorrowerRefresh] = useState(0);
    const [bookRefresh, setBookRefresh] = useState(0);

    return (
        <div className="container">
            <h1>Library Management System</h1>

            <RegisterBorrowerForm onSuccess={() => setBorrowerRefresh((c) => c + 1)} />
            <BorrowerTable refreshTrigger={borrowerRefresh} />

            <RegisterBookForm onSuccess={() => setBookRefresh((c) => c + 1)} />
            <BookTable refreshTrigger={bookRefresh} />
        </div>
    );
}