document.addEventListener('DOMContentLoaded', () => {
  const alumniForm = document.getElementById('alumniForm');
  const alumniList = document.getElementById('alumniList');

  // Fetch all alumni on page load
  fetchAlumni();

  alumniForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(alumniForm);
    const alumniData = {};
    formData.forEach((value, key) => {
      alumniData[key] = value;
    });

    // Send alumni data to the server
    addAlumni(alumniData);

    // Clear the form
    alumniForm.reset();
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

  function displayAlumni(alumni) {
    alumniList.innerHTML = '';

    alumni.forEach((alum) => {
      const alumniItem = document.createElement('div');
      alumniItem.classList.add('alumni-item');
      alumniItem.innerHTML = `
        <strong>${alum.name}</strong> - ${alum.major || 'N/A'} - ${alum.email}
      `;
      alumniList.appendChild(alumniItem);
    });
  }
});