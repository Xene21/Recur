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
        
        const messageArea = document.getElementById('message-area');
    
        if(result.token){
            messageArea.className = 'mb-6 p-4 rounded-2xl text-sm font-medium border text-center transition-all bg-emerald-50 text-emerald-600 border-emerald-200';
            messageArea.innerHTML = '<div class="flex items-center justify-center gap-2"><i class="ph-bold ph-check-circle text-lg"></i><span>Registration successful! Redirecting...</span></div>';
            
            document.cookie = `authToken=${result.token}; path=/; max-age=604800; SameSite=Lax`;
            
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000); // Give user a brief moment to read the success message
        }

    } catch (error) {
        const messageArea = document.getElementById('message-area');
        messageArea.className = 'mb-6 p-4 rounded-2xl text-sm font-medium border text-center transition-all bg-rose-50 text-rose-600 border-rose-200';
        messageArea.innerHTML = `<div class="flex items-center justify-center gap-2"><i class="ph-bold ph-warning-circle text-lg"></i><span>Registration failed</span></div>`;
    }

})