import { useState, useCallback } from 'react';

/**
 * A custom hook to handle entity list state management with safe updates
 * @param {Object} service - The service object containing CRUD methods
 * @returns {Object} The list state and handlers
 */
export const useEntityList = (service) => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const updateList = useCallback((data) => {
        setList(Array.isArray(data) ? data : []);
    }, []);
    const fetchList = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await service.getAll();
            updateList(data);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.response?.data?.message || 'Failed to fetch data');
            updateList([]); // Reset to empty array on error
        } finally {
            setLoading(false);
        }
    }, [service, updateList]);
    const addItem = useCallback(async (values) => {
        try {
            const result = await service.add(values);
            updateList([...list, result]);
            return { success: true };
        } catch (err) {
            console.error('Error adding item:', err);
            setError(err.response?.data?.message || 'Failed to add item');
            return { success: false, error: err };
        }
    }, [service, list, updateList]);
    const updateItem = useCallback(async (id, values) => {
        try {
            const result = await service.update(id, values);
            updateList(list.map(item => item._id === id ? result : item));
            return { success: true };
        } catch (err) {
            console.error('Error updating item:', err);
            setError(err.response?.data?.message || 'Failed to update item');
            return { success: false, error: err };
        }
    }, [service, list, updateList]);
    const deleteItem = useCallback(async (id) => {
        try {
            await service.delete(id);
            updateList(list.filter(item => item._id !== id));
            return { success: true };
        } catch (err) {
            console.error('Error deleting item:', err);
            setError(err.response?.data?.message || 'Failed to delete item');
            return { success: false, error: err };
        }
    }, [service, list, updateList]);

    return {
        list,
        loading,
        error,
        setError,
        fetchList,
        addItem,
        updateItem,
        deleteItem,
    };
};
