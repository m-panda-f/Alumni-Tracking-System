document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('adminLoginForm');
    const alumniloginForm = document.getElementById('alumniLoginForm');
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
  
      const formData = new FormData(loginForm);
      const alumniformData = new FormData(alumniloginForm);
      const userData = {};
      const userata = {};
      formData.forEach((value, key) => {
        userData[key] = value;
      });
      alumniformData.forEach((value, key) => {
        userata[key] = value;
      });
  
      // Log in the user
      loginUser(userData);
      loginUser(userata);
    });
  
    // API to login
    function loginUser(userData) {
      fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          // Store the token in localStorage or a secure way in your application
          const { token } = result;
  
          // Check if the token is present
          if (token) {
            // Redirect to the dashboard page
            window.location.href = '/dashboard.html';
          } else {
            document.getElementById('error-message').textContent = 'Username or password is incorrect!';
          }
        });
    }
  });
  