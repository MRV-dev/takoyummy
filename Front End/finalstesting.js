
    document.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the form from refreshing the page
        const username = document.querySelector('input[name="username"]').value;
        const password = document.querySelector('input[name="password"]').value;

        // Example simple logic
        if (username && password) {
            window.location.href = 'pos.html'; // Redirect to POS page
        } else {
            alert('afde');
        }
    });
