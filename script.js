document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim()
    };
    
    // Here you would typically send this data to your backend
    console.log('Form submitted:', formData);
    
    // Clear the form
    this.reset();
    
    // Show success message using a more modern approach
    const button = this.querySelector('button');
    const originalText = button.textContent;
    
    button.textContent = 'Thanks for subscribing!';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 3000);
});
