document.addEventListener('DOMContentLoaded', () => {
  const alumniForm = document.getElementById('alumniForm');
  const alumniList = document.getElementById('alumniList');

  // Fetch all alumni on page load
  fetchAlumni();

  alumniForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(alumniForm);
    const alumniData = {};
    formData.forEach((value, key) => {
      alumniData[key] = value;
    });

    // Determine whether to add or update alumni based on the presence of an id field
    const idField = formData.get('id');
    if (idField) {
      // If id field is present, update the alumni
      await updateAlumni(alumniData);
    } else {
      // Send alumni data to the server
      await addAlumni(alumniData);
    }

    // Clear the form
    alumniForm.reset();

    // Remove the hidden id field
    const hiddenIdField = document.querySelector('input[name="id"]');
    if (hiddenIdField) {
      hiddenIdField.remove();
    }
  });

  function fetchAlumni() {
    fetch('/api/alumni')
      .then((response) => response.json())
      .then((alumni) => {
        displayAlumni(alumni);
      });
  }

  function addAlumni(alumniData) {
    fetch('/api/alumni', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alumniData),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result.message);
        fetchAlumni(); // Refresh alumni list after adding
      });
  }

  async function updateAlumni(alumniData) {
    try {
      const result = await postData(`/api/alumni/${alumniData.id}`, 'PUT', alumniData);
      console.log(result.message);
      fetchAlumni(); // Refresh alumni list after updating
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function displayAlumni(alumni) {
    alumniList.innerHTML = '';

    alumni.forEach((alum) => {
      const alumniItem = document.createElement('div');
      alumniItem.classList.add('alumni-item');
       alumniItem.setAttribute('data-id', alum.id); 
      alumniItem.innerHTML = `
        <strong>${alum.name}</strong> - ${alum.graduationYear} - ${alum.major || 'N/A'} - ${alum.email}
        <button onclick="editAlumni(${alum.id})">Edit</button>
        <button onclick="deleteAlumni(${alum.id})">Delete</button>`;
      alumniList.appendChild(alumniItem);
    });
  }
});


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

async function editAlumni(id) {
  try {
    const alum = await fetchData(`/api/alumni/${id}`);
    const alumniForm = document.getElementById('alumniForm');
    alumniForm.elements['name'].value = alum.name;
    alumniForm.elements['graduationYear'].value = alum.graduation_year;
    alumniForm.elements['major'].value = alum.major || '';
    alumniForm.elements['email'].value = alum.email;

    // Add a hidden field to store the alumni id for updating
    const idField = document.createElement('input');
    idField.type = 'hidden';
    idField.name = 'id';
    idField.value = alum.id;
    alumniForm.appendChild(idField);
  } catch (error) {
    console.error('Error:', error);
  }
}

function deleteAlumni(id) {
  fetch(`/api/alumni/${id}`, {
    method: 'DELETE',
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // If the delete request is successful, remove the alumni from the DOM
    const alumniItem = document.querySelector(`.alumni-item[data-id='${id}']`);
    if (alumniItem) {
      alumniItem.remove();
    }
  })
  .catch((error) => console.log('Error:', error));
}

async function registerUser(userData) {
  try {
    const result = await postData('/api/register', 'POST', userData);
    console.log(result.message);
  } catch (error) {
    console.error('Error:', error);
  }
}
 
