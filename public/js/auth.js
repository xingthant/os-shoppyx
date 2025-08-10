document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password }),
                });

                const result = await response.json();
                if (response.ok) {
                    alert('Sign up successful! Please log in.');
                    window.location.href = '/login.html';
                } else {
                    alert(result.message || 'Signup failed');
                }
            } catch (error) {
                console.error('Signup Error:', error);
                alert('An unexpected error occurred.');
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                const result = await response.json();
                if (response.ok) {
                    // Store token and user data
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('user', JSON.stringify(result.user));
                    window.location.href = '/'; // Redirect to home page
                } else {
                    alert(result.message || 'Login failed');
                }
            } catch (error) {
                console.error('Login Error:', error);
                alert('An unexpected error occurred.');
            }
        });
    }
});