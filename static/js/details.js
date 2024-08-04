document.addEventListener('DOMContentLoaded', () => {
    const placeId = getPlaceIdFromURL();
    console.log('Place ID from URL:', placeId); // Debugging log
  
    if (!placeId) {
      console.error('Invalid place ID');
      return;
    }
  
    fetchPlaceDetails(placeId);
  
    function getPlaceIdFromURL() {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('placeId');
      console.log('Extracted placeId:', id); // Debugging log
      return id;
    }
  
    async function fetchPlaceDetails(placeId) {
      try {
        console.log('Fetching place details for ID:', placeId); // Debugging log
        const response = await fetch(`/places/${placeId}`);
        if (response.ok) {
          const place = await response.json();
          console.log('Fetched place details:', place); // Debugging log
          displayPlaceDetails(place);
        } else {
          throw new Error('Failed to fetch place details');
        }
      } catch (error) {
        console.error('Error fetching place details:', error); // Debugging log
      }
    }
  
    function displayPlaceDetails(place) {
      const placeName = document.getElementById('place-name');
      const placeDetails = document.getElementById('place-details');
      const reviewsSection = document.getElementById('reviews');
  
      placeName.textContent = place.name;
  
      placeDetails.innerHTML = `
          <p><strong>Host:</strong> ${place.host}</p>
          <p><strong>Price per night:</strong> $${place.price_per_night}</p>
          <p><strong>Location:</strong> ${place.location}</p>
          <p><strong>Description:</strong> ${place.description}</p>
          <p><strong>Amenities:</strong> ${place.amenities.join(', ')}</p>
          ${place.images
            .map((img) => `<img src="${img}" alt="${place.name}">`)
            .join('')}
        `;
  
      reviewsSection.innerHTML = place.reviews
        .map(
          (review) => `
              <div class="review">
                <h3>${review.author}</h3>
                <p>${review.text}</p>
                <p>Rating: ${review.rating}</p>
              </div>
            `
        )
        .join('');
    }
  });