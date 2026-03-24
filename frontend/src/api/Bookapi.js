import api from './axiosConfig';

export const getAllBooks = async () => {
    const response = await api.get('/book/all');
    return Array.isArray(response.data) ? response.data : [];
};

export const registerBook = async (isbn, title, author) => {
    const response = await api.post(
        `/registerBook?isbn=${encodeURIComponent(isbn)}&title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`
    );
    return response.data;
};

export const borrowBook = async (isbn, borrowerName) => {
    const response = await api.post(
        `/borrow?isbn=${encodeURIComponent(isbn)}&borrowerName=${encodeURIComponent(borrowerName)}`
    );
    return response.data;
};

export const returnBook = async (isbn, borrowerName) => {
    const response = await api.post(
        `/return?isbn=${encodeURIComponent(isbn)}&borrowerName=${encodeURIComponent(borrowerName)}`
    );
    return response.data;
};

export const deleteBook = async (isbn) => {
    const response = await api.post(`/deleteBook?isbn=${encodeURIComponent(isbn)}`);
    return response.data;
};