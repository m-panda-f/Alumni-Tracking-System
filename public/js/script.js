document.addEventListener('DOMContentLoaded', () => {

  // Fetch all alumni on page load
  fetchAlumni();
  fetchadmin();
  fetchcaree();
 

  function fetchAlumni() {
    fetch('/api/alumni')
      .then((response) => response.json())
      .then((alumni) => {
        displayAlumni(alumni);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  

  function displayAlumni(alumni) {
    const alumniList = document.getElementById('alumniList');
    alumniList.innerHTML = '';

    alumni.forEach((alum,index) => {
      const alumniItem = document.createElement('div');
      alumniItem.classList.add('alumni-item');
      alumniItem.setAttribute('data-id', alum.id);
      alumniItem.innerHTML = `
      ${index+1}] <strong>Username: ${alum.user_id}</strong> <br>Name:  ${alum.name}<br>USN: ${alum.USN} <br>Verification: ${alum.verification_status}
      <br><button id='verifyButton${alum.id}' onclick='updateAlumni(${alum.id});' >verify</button>
      <button onclick='deletealumni(${alum.id});'>delete</button>
      `;
      alumniList.appendChild(alumniItem);
      hideVerifyButtonIfVerified(alum);
    });
  }
  function hideVerifyButtonIfVerified(alum) {
    const verifyButton = document.getElementById('verifyButton');
    if (alum.verification_status === 'verified' && verifyButton) {
      verifyButton.style.display = 'none';
    }
  }
});

function updateAlumni(id) {
  fetch(`/api/update/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to update alumni');
      }
      return response.json();
    })
    .then((result) => {
      
      alert("Alumni Verified");
      
      console.log(result.message);
    })
    .catch((error) => {
      console.error('Error updating alumni:', error);
    });
}



async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

async function postData(url, method, data) {
  const response = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}


// Admin
async function fetchadmin() {
  try {
    const alumni = await fetchData('/api/admin');
    displayadmin(alumni);
  } catch (error) {
    console.error('Error:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');

  if (token) {
    fetch('/api/admin/${token.id}', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.json())
    .then((admin) => {
      displayAdminProfile(admin);
    })
    .catch((error) => {
      console.error('Error fetching admin data:', error);
    });
  } else {
    // Redirect to login page if token is not present
    window.location.href = '/index.html';
  }

  function displayAdminProfile(admin) {
    const profile = document.getElementById('adminProfile');
    if (profile) {
      profile.innerHTML = `
        <h2>Name: ${admin.Name}</h2>
        <p>Email: ${admin.Email}</p>
        <p>Phone Number: ${admin.Admin_id}</p>
      `;
    } else {
      console.error('Element with id "adminProfile" not found');
    }
  }
});

function displayadmin(alumni) {
  const alumniList = document.getElementById('adminList');
  alumniList.innerHTML = '';

  alumni.forEach((alum,index ) => {
    const alumniItem = document.createElement('div');
    alumniItem.classList.add('alumni-item');
    alumniItem.setAttribute('data-id', alum.Admin_id);
    alumniItem.innerHTML = `
      ${index+1}] <strong>Username : ${alum.Admin_id}</strong> <br> Name:  ${alum.Name} <br> Institute:  ${alum.Inst_id} <br> Email:  ${alum.Email}<br><br>
      <button onclick='deletecareer(${alum.id})'>delete</button>`;
    alumniList.appendChild(alumniItem);
  });
}


async function fetchcaree() {
  try {
    const alumni = await fetchData('/api/career');
    displaycareer(alumni);
  } catch (error) {
    console.error('Error:', error);
  }
}

function displaycareer(alumni) {
  const alumniList = document.getElementById('careList');
  alumniList.innerHTML = '';
  
  // Display the count of the users
  const countElement = document.createElement('p');
  
  alumniList.appendChild(countElement);

  alumni.forEach((alum, index) => {
    const alumniItem = document.createElement('div');
    alumniItem.classList.add('alumni-item');
    alumniItem.setAttribute('data-id', alum.user_id);
      
    alumniItem.innerHTML = `
      ${index + 1}] <strong>Username : ${alum.user_id}</strong> <br> Name:  ${alum.Name} <br> Institute:  ${alum.admin_id} <br> Email:  ${alum.current_job}<br><br>
      <button onclick='fetchAlumniData(${alum.id})> Edit</button>`;
    alumniList.appendChild(alumniItem);
  });
}

function deletecareer(animalId) {
    const confirmDelete = confirm("Are you sure you want to delete Admin ID " + animalId + "?");
    if (confirmDelete) {
        // Send delete request to server
        fetch("/deletecareer", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: parseFloat(animalId) })
        })
        .then(response => response.json())
        .then(data => {
            // Handle response from server
            console.log(data);
            fetchadmin(); // Refresh animal list
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }
}

function deletealumni(animalId) {
  const confirmDelete = confirm("Are you sure you want to delete Animal ID " + animalId + "?");
  if (confirmDelete) {
      // Send delete request to server
      fetch("/deletealumni", {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ id:(animalId) })
      })
      .then(response => response.json())
      .then(data => {
          // Handle response from server
          console.log(data);
          fetchAlumni();  // Refresh animal list
      })
      .catch(error => {
          console.error("Error:", error);
      });
  }
}

function displayAnimals() {
  fetch("/animals")
    .then(response => response.json())
    .then(data => {
      let animalContainers = '';
      data.forEach(animal => {
        animalContainers += `
          <div>
            <img src="${animal.image}" alt="${animal.name}">
            <h3>Event Title: ${animal.title}</h3>
            <p>Location: ${animal.Location}</p>
            <p>Date: ${animal.date}</p>
            <p>Description: ${animal.description}</p>
          </div>
        `;
      });

      const animalsSection = document.getElementById("events");
      animalsSection.innerHTML = animalContainers;
    })
    .catch(error => {
      console.error("Error fetching animals:", error);
    });
}

function addAnimal() {
  const animalName = document.getElementById("animalName").value;
  const cageNumber = document.getElementById("cageNumber").value;
  const feedNumber = document.getElementById("feedNumber").value;
  const description = document.getElementById("description").value;
  const imageFile = document.getElementById("imageFile").files[0];

  const reader = new FileReader();
  reader.onload = function(event) {
    const imageURL = event.target.result;
    const animal = {
      animalName,
      feedNumber,
      cageNumber, 
      description,
      imageURL
      
    };

    // Send data to server
    fetch("/addAnimals", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ animalName,  feedNumber, cageNumber, description, imageURL })
        })
        .then(response => response.json())
        .then(data => {
            // Handle response from server
            console.log(data);
            // Clear form fields after adding ticket
            alert("Event Added");
            document.getElementById("addanimalForm").reset();
        })
        .catch(error => {
            console.error("Error:", error);
        });
    

    // Check if editing an existing animal

    displayAnimals();
    displayAnimal();
    document.getElementById("addAnimalForm").reset();
    window.location.href = "#event";
  }; 
  reader.readAsDataURL(imageFile);
}
displayAnimals();
displayAnimal();
document.getElementById("addAnimalForm").addEventListener("submit", function(event) {
  event.preventDefault();
  addAnimal();
  displayAnimals();
  displayAnimal();
});

function displayAnimal() {
  fetch("/animals")
    .then(response => response.json())
    .then(data => {
      let animalContainers = '';
      data.forEach(animal => {
        animalContainers += `
          <div>
            <img src="${animal.image}" alt="${animal.name}">
            <h3>Event Title: ${animal.title}</h3>
            <p>Location: ${animal.Location}</p>
            <p>Date: ${animal.date}</p>
            <p>Description: ${animal.description}</p>
            <button onclick='deletevent(${animal.id})'>Delete Event</button>
          </div>
        `;
      });

      const animalsSection = document.getElementById("eventsad");
      animalsSection.innerHTML = animalContainers;
    })
    .catch(error => {
      console.error("Error fetching animals:", error);
    });
}
function deletevent(animalId) {
  const confirmDelete = confirm("Are you sure you want to delete this Event?");
  if (confirmDelete) {
      // Send delete request to server
      fetch("/deletevent", {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ id:(animalId) })
      })
      .then(response => response.json())
      .then(data => {
          // Handle response from server
          console.log(data);
          displayAnimal();  // Refresh animal list
      })
      .catch(error => {
          console.error("Error:", error);
      });
  }
}