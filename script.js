// Contact Form Submission
document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim()
    };
    
    const button = this.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Sending...';
    button.disabled = true;

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        
        if (result.success) {
            button.textContent = 'Message Sent!';
            this.reset();
        } else {
            button.textContent = 'Error! Try Again';
        }
    } catch (error) {
        console.error('Error:', error);
        button.textContent = 'Error! Try Again';
    }

    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 3000);
});
