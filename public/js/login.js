document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('adminLoginForm');
	const Pfp= document.getElementById('adminEmail');
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
	  
	  
      const formData = new FormData(loginForm);
      const userData = {};
      formData.forEach((value, key) => {
        userData[key] = value;
		
      });
    //   fetchadminData(Pfp.value);
      // Log in the user
	  
      loginUser(userData);
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
		.then(data => {
			console.log('Token:', data.token);

			// Check if the token is present
			if (data.token) {
				localStorage.setItem('token', data.token);
				alert("Login Successful");
				// Redirect to the dashboard page with the token and login status in the URL
				window.location.href = `/dashboard.html?login=successful`;
				
			} else {
				alert("Invalid username or password");
			}
		})
		.catch((error) => {
			console.error('Error:', error);
		});
    }
  });


  document.addEventListener('DOMContentLoaded', () => {
		const alumniloginForm = document.getElementById('alumniLoginForm');
		alumniloginForm.addEventListener('submit', (event) => {
		  event.preventDefault();
		  const formData = new FormData(alumniloginForm);
		  const userd = {};
		  formData.forEach((value, key) => {
			userd[key] = value;
		  });
		alumnilogin(userd)
		});
	
		  function alumnilogin(user){
			fetch('/api/alumnilogin', {
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/json',
			  },
			  body: JSON.stringify(user),
			})
			  .then((response) => response.json())
			  .then((result) => {
				console.log(result);
				// Store the token in localStorage or a secure way in your application
				const { token,error } = result;
		
				// Check if the token is present
				if (token) {
				  // Redirect to the dashboard page
				  alert("Login Successful");
				  window.location.href = '/alumnidash.html';
				} else if(error === 'Incorrect email or password'){
					alert("Invalid username or password");
				  document.getElementById('error-message').textContent = 'Username or password is incorrect!';
				}
			  });
			}});
	
		