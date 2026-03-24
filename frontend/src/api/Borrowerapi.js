import api from './axiosConfig';

export const getAllBorrowers = async () => {
    const response = await api.get('borrower/all');
    return Array.isArray(response.data) ? response.data : []; //Ensure that no error appears when null value since filter does not support for null value
};

export const getBorrowerByName = async (name) => {
    const response = await api.get(`/borrower/get?name=${encodeURIComponent(name)}`);
    return response.data;
};

export const registerBorrower = async (name, email) => {
    const response = await api.post(
        `/registerBorrower?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`
    );
    return response.data;
};

export const updateBorrower = async ({ originalName, originalEmail, newName, newEmail }) => {
    const response = await api.post(
        `/updateBorrower?originalName=${encodeURIComponent(originalName)}&originalEmail=${encodeURIComponent(originalEmail)}&newName=${encodeURIComponent(newName)}&newEmail=${encodeURIComponent(newEmail)}`
    );
    return response.data;
};

export const deleteBorrower = async (name) => {
    const response = await api.post(`/deleteBorrower?name=${encodeURIComponent(name)}`);
    return response.data;
};
