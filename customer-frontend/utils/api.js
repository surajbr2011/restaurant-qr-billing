// Dynamically set API URL based on how the page is accessed
const getApiBaseUrl = () => {
    if (window.APP_CONFIG?.API_URL) return `${window.APP_CONFIG.API_URL}/api`;
    return 'https://restaurant-qr-billing.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

class ApiService {
    async getMenu() {
        const response = await fetch(`${API_BASE_URL}/menu`);
        if (!response.ok) {
            throw new Error('Failed to fetch menu');
        }
        return await response.json();
    }

    async createOrder(orderData) {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error('Failed to create order');
        }
        return await response.json();
    }

    async getOrderStatus(orderId) {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`);
        if (!response.ok) {
            throw new Error('Failed to fetch order status');
        }
        return await response.json();
    }
}

const apiService = new ApiService();