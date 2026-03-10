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


const registerForm = document.getElementById('register-form')
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(registerForm);
    const data = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        password: formData.get('password'),
        username: formData.get('username')
    };
    console.log(data);
    try{
        const result = await postData('/register', data);
        console.log(result);
    
        if(result.token){
            alert('Registration successful!');
            document.cookie = `authToken=${result.token}; path=/; max-age=604800; SameSite=Lax`;
            window.location.href = '/dashboard';
        }

    } catch (error) {
        alert('Registration failed: ' + error.message);
    }

})