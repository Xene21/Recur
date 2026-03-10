const postData = async (url, data) => {
    try {
        const response = await fetch(url,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(`${response.status}: ${errorData.message}` || 'Registration failed');
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};


const loginForm = document.getElementById('login-form')
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);
    const data = {
        username: formData.get('username'),
        password: formData.get('password')
    };
    console.log(data);
    try{
        const result = await postData('/login', data);
        console.log(result);
    
        if(result.token){
            alert('Login successful!');
            document.cookie = `authToken=${result.token}; path=/; max-age=604800; SameSite=Lax`;
            window.location.href = '/dashboard';
        }

    } catch (error) {
        alert('Login failed: ' + error.message);
    }

})