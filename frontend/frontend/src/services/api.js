const API_BASE_URL = "http://localhost:8000";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token") || localStorage.getItem("access_token");
    return {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
};

export const api = {
    async register(userData) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || "Registration failed");
        }
        return response.json();
    },

    async login(credentials) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: credentials.email || credentials.username,
                password: credentials.password
            }),
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || "Login failed");
        }
        const data = await response.json();
        
        const tokenValue = data.access_token || data.token;
        if (tokenValue) {
            localStorage.setItem("token", tokenValue);
            localStorage.setItem("access_token", tokenValue);
        }
        
        return data;
    },

    async getDashboardStats() {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch dashboard stats");
        return response.json();
    },

    async getDashboardData() {
        return this.getDashboardStats();
    },

    async generateRoutine(promptText) {
        const response = await fetch(`${API_BASE_URL}/api/v1/dashboard/routine`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ prompt: promptText }),
        });
        if (!response.ok) {
            throw new Error("Failed to generate AI routine");
        }
        return response.json();
    }
};