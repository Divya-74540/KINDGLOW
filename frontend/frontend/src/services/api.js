// src/services/api.js

export async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers || {})
    };

    // Ensure endpoint starts with a slash and avoids duplicating /api/v1
    let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    if (cleanEndpoint.startsWith('/api/v1')) {
        cleanEndpoint = cleanEndpoint.replace('/api/v1', '');
    }

    const url = `/api/v1${cleanEndpoint}`;

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (!response.ok) {
        let errorMessage = 'Request failed';
        try {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorData.message || response.statusText;
        } catch {
            errorMessage = response.statusText || 'Request failed';
        }

        if (response.status === 401) {
            errorMessage = 'Not authenticated';
        } else if (response.status === 404) {
            errorMessage = `Endpoint not found (${url})`;
        }

        throw new Error(errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
    
    return null;
}