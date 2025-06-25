const btnSearch = document.getElementById("btnSearch");
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
function searchLocation() { 
    const input = document.getElementById('searchInput');
    const resultDiv = document.getElementById('result');
    const searchTerm = input.value.toLowerCase().trim();
    
    // Clear previous results
    resultDiv.innerHTML = '';
    
    // Validate input
    if (!searchTerm) {
        resultDiv.innerHTML = '<p class="no-results">Please enter a search term.</p>';
        return;
    }

    console.log("Searching for: " + searchTerm);
    
    fetch('./travel_recommendation_api.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Data loaded:", data);
            let resultsFound = false;
            
            // Search countries and their cities
            if (data.countries) {
                data.countries.forEach(country => {
                    // Check if country name matches
                    if (country.name.toLowerCase().includes(searchTerm)) {
                        resultsFound = true;
                        displayCities(country.cities, resultDiv);
                    }
                });
            }
            
            // Search temples if they match
            if (data.temples && (searchTerm.includes('temple') || searchTerm.includes('temples'))) {
                resultsFound = true;
                displayGenericResults(data.temples, resultDiv);
            }
            
            // Search beaches if they match
            if (data.beaches && (searchTerm.includes('beach') || searchTerm.includes('beaches'))) {
                resultsFound = true;
                displayGenericResults(data.beaches, resultDiv);
            }
            
            // If no results found
            if (!resultsFound) {
                resultDiv.innerHTML = '<p class="no-results">No results found for "' + searchTerm + '". Try searching for a country, temple, or beach.</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultDiv.innerHTML = '<p class="no-results">An error occurred while fetching data. Please try again.</p>';
        });
}

function displayCities(cities, resultDiv) {
    cities.forEach(city => {
        const cityDiv = document.createElement('div');
        cityDiv.className = 'search-result-item';
        
        cityDiv.innerHTML = `
            <h2>${city.name}</h2>
            <img src="${city.imageUrl}" alt="${city.name}" onload="styleImage(this)" onerror="handleImageError(this)">
            <p>${city.description}</p>
        `;
        
        resultDiv.appendChild(cityDiv);
    });
}

function displayGenericResults(items, resultDiv) {
    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'search-result-item';
        
        itemDiv.innerHTML = `
            <h2>${item.name}</h2>
            <img src="${item.imageUrl}" alt="${item.name}" onload="styleImage(this)" onerror="handleImageError(this)">
            <p>${item.description}</p>
        `;
        
        resultDiv.appendChild(itemDiv);
    });
}

// Function to apply styles to images when they load
function styleImage(img) {
    img.style.width = '100%';
    img.style.maxWidth = '400px';
    img.style.height = '250px';
    img.style.objectFit = 'cover';
    img.style.objectPosition = 'center';
    img.style.borderRadius = '8px';
    img.style.margin = '10px auto';
    img.style.display = 'block';
    img.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
    console.log("Image styled:", img.src);
}

// Function to handle image loading errors
function handleImageError(img) {
    img.style.display = 'none';
    console.log("Image failed to load:", img.src);
    
    // Add a placeholder or error message
    const errorMsg = document.createElement('p');
    errorMsg.textContent = 'Image could not be loaded';
    errorMsg.style.textAlign = 'center';
    errorMsg.style.color = '#999';
    errorMsg.style.fontStyle = 'italic';
    img.parentNode.insertBefore(errorMsg, img.nextSibling);
}

function clearSearchResults() {
    const input = document.getElementById('searchInput');
    const resultDiv = document.getElementById('result');
    
    // Clear the search input
    input.value = '';
    
    // Clear and hide the results
    resultDiv.innerHTML = '';
    resultDiv.style.display = 'none';
    
    console.log("Search results cleared");
}


// Event listeners
btnSearch.addEventListener('click', searchLocation);
clearSearch.addEventListener('click', clearSearchResults);

// Add Enter key support for search input
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchLocation();
    }
});

// Make functions available globally for the onload/onerror handlers
window.styleImage = styleImage;
window.handleImageError = handleImageError;