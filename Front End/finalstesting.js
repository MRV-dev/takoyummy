document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault(); 

    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;

    fetch('http://localhost:5050/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('Login successful!');
                window.location.href = 'pos.html'; 
            } else {
                alert(data.error || 'Login failed. Please check your credentials.');
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            alert('An error occurred. Please try again.');
        });
});
