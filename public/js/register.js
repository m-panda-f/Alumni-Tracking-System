document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
  
    registerForm.addEventListener('submit', (event) => {
      event.preventDefault();
  
      
      const password = document.getElementById("registerPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
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
  
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        registerForm.reset();
        return;
      }
      else{function registerUser(userData) {
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
            alert("You have successfully registered");
            window.location.href = '/details.html';
            
          });
      }}
      
    // API to register a new user
    
  });
  