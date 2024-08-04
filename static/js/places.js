document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
  
    document
      .getElementById('country-filter')
      .addEventListener('change', (event) => {
        filterPlaces(event.target.value);
      });
  });
  
  function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');
  
    if (loginLink) {
      // Check if the element exists
      if (!token) {
        loginLink.style.display = 'flex'; // Show login link
      } else {
        loginLink.style.display = 'flex'; // Hide login link
        fetchPlaces(token);
      }
    } else {
      console.error('Element with id "login-link" not found.');
    }
  }
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
  async function fetchPlaces(token) {
    try {
      const response = await fetch('/places', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const places = await response.json();
        displayPlaces(places);
      } else {
        throw new Error('Failed to fetch places');
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    placesList.innerHTML = ''; // Clear the current content
    places.forEach((place) => {
      const placeCard = document.createElement('div');
      placeCard.classList.add('place-card');
      placeCard.innerHTML = `
        <h3>${place.name}</h3>
        <p>${place.description}</p>
        <p>Country: ${place.country}</p>
        <button class="details-button" onclick="viewPlaceDetails(${place.id})">View Details</button>
      `;
      placesList.appendChild(placeCard);
    });
  }
  
  function viewPlaceDetails(placeId) {
    console.log('Navigating to place.html with ID:', placeId);
    window.location.href = `place.html?placeId=${placeId}`;
  }
  
  function filterPlaces(country) {
    const places = document.querySelectorAll('.place-card');
    places.forEach((place) => {
      const countryText = place.querySelector('p:nth-child(3)').textContent;
      if (country === 'all' || countryText.includes(country)) {
        place.style.display = 'flex';
      } else {
        place.style.display = 'none';
      }
    });
  }