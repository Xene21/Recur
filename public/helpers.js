// Centralized helper for public POST requests (Login/Register)
const postData = async (url, data) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Action failed');
    return result;
};

