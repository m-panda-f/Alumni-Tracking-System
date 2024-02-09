document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
  
    registerForm.addEventListener('submit', (event) => {
      event.preventDefault();
  
      const formData = new FormData(registerForm);
      const userData = {};
      formData.forEach((value, key) => {
        userData[key] = value;
      });
  
      // Register a new user
      registerUser(userData);
  
      // Clear the form
      registerForm.reset();
    });
  
    // API to register a new user
    function registerUser(userData) {
      fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result.message);
        });
    }
  });
  