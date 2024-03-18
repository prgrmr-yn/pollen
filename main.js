// This event listener waits for the DOM content to be fully loaded before executing the initAutocomplete function
document.addEventListener('DOMContentLoaded', () => {
  initAutocomplete();
});

// Function to fetch plant data from the API
async function fetchPlantData() {
  try {
      // Fetching the plant data from the provided API URL
      const response = await fetch('https://macrozzz.github.io/bee/flower.json');
      // Parsing the JSON response
      const data = await response.json();
      // Returning the parsed plant data
      return data;
  } catch (error) {
      // Logging an error message if there's an issue fetching the plant data
      console.error('Error fetching plant data:', error);
  }
}

// Function to initialize autocomplete functionality
async function initAutocomplete() {
  // Fetching plant data from the API
  const plantData = await fetchPlantData();

  // Selecting necessary elements from the DOM
  const resultBox = document.querySelector('.result-box');
  const inputBox = document.getElementById('input-box');
  const plantInfoDiv = document.getElementById('plant-info');
  const resetButton = document.getElementById('reset-button');

  let activeIndex = -1;

  // Function to display autocomplete suggestions
  function displaySuggestions(suggestions, plantData) {
    // Creating HTML content for the autocomplete suggestions
    const content = suggestions.map(suggestion => {
      const plantInfo = plantData[suggestion];

      // Check pollen and nectar values using ternary operators
      const pollenDisplay = plantInfo.pollen ? 'P' : '--';
      const nectarDisplay = plantInfo.nectar ? 'N' : '--';

      return `<li>${suggestion}<div id="pollen-nectar"><div id="pollen">${pollenDisplay}</div><div id="nectar">${nectarDisplay}</div></div></li>`;
    });
    // Rendering the autocomplete suggestions in the result box
    resultBox.innerHTML = `<ul>${content.join('')}</ul>`;

    // Adding event listener to each suggestion
    const suggestionItems = resultBox.querySelectorAll('li');
    suggestionItems.forEach((item, index) => {
        // Event listener for clicking on an autocomplete suggestion
        item.addEventListener('click', () => {
            // Logging the clicked suggestion
            console.log('Autocomplete suggestion clicked:', suggestions[index]);
            // Clearing the search box
            inputBox.value = '';
            // Logging that the search box has been cleared
            console.log('Search box cleared.');
            // Displaying plant info for the clicked suggestion
            displayPlantInfo(suggestions[index]);
            // Clearing suggestions after selection
            resultBox.innerHTML = '';
        });
    });
  }

  // Function to handle keyup event on the input box
  inputBox.addEventListener('keyup', (e) => {
    // Getting the input value and converting it to lowercase
    const input = e.target.value.toLowerCase();
    // Checking if the input is empty
    if (input === '') {
        // Clearing autocomplete suggestions if input is empty
        resultBox.innerHTML = '';
        // Clearing plant info if input is empty
        // plantInfoDiv.innerHTML = '';
        return;
    }

    // Filtering plant data based on the input
    const suggestions = Object.keys(plantData).filter(plant => plant.toLowerCase().startsWith(input));
    // Displaying autocomplete suggestions
    displaySuggestions(suggestions, plantData);
  });

  // Function to handle keydown event on the input box
  inputBox.addEventListener('keydown', (e) => {
    // Getting all suggestion items
    const suggestions = resultBox.querySelectorAll('li');
    // Getting the maximum index of suggestions
    const maxIndex = suggestions.length - 1;

    // Check if the input box is empty
    if (inputBox.value.trim() === '') {
      // If the input box is empty, don't trigger the arrow up/down functionality
      return;
    }

    switch (e.key) {
      // Handling ArrowUp key press
      case 'ArrowUp':
        e.preventDefault();
        // Updating the active suggestion index
        activeIndex = (activeIndex - 1 + suggestions.length) % suggestions.length;
        // Updating the active suggestion
        updateActiveSuggestion(suggestions);
        break;
      // Handling ArrowDown key press
      case 'ArrowDown':
        e.preventDefault();
        // Updating the active suggestion index
        activeIndex = (activeIndex + 1) % suggestions.length;
        // Updating the active suggestion
        updateActiveSuggestion(suggestions);
        break;
      // Handling Enter key press
      case 'Enter':
        e.preventDefault();
        if (activeIndex !== -1) {
          // Setting the input value to the selected suggestion
          inputBox.value = ''
          // Displaying plant info for the selected suggestion
          const regex = /(?:PN|P|N)$/;
          displayPlantInfo(suggestions[activeIndex].textContent.replace(regex, ''));
          // Clearing suggestions after selection
          resultBox.innerHTML = '';
          // Resetting the active index
          activeIndex = -1;
        }
        break;
    }
  });

  // Function to update the active suggestion
  function updateActiveSuggestion(suggestions) {
    suggestions.forEach((suggestion) => suggestion.classList.remove('highlighted'));
    if (activeIndex !== -1) {
      suggestions[activeIndex].classList.add('highlighted');
    }
  }

  // Function to display plant info
  function displayPlantInfo(plantName) {
    // Logging the plant name for which info is being displayed
    console.log('Displaying plant info for:', plantName);
    // Getting the plant info based on the plant name
    const plantInfo = plantData[plantName];
    console.log(plantInfo);
    let plantInfoHTML = '';
    // Looping through plant info properties
    for (const key in plantInfo) {
      // Checking if the property value is not empty
      if (plantInfo[key] && plantInfo[key] !== '') {
        // Handle image field
        if (key === 'image' | key === 'flowerColor' || key === 'floweringTime') {
          // Add image URLs/paths to the plant info HTML
          if (plantInfo[key][0] === ""){continue}
          plantInfoHTML += `<p><strong>${key}:</strong> ${plantInfo[key].join(', ')}</p>`;
        }
        // Handle insects field
        else if (key === 'insects' && typeof plantInfo[key] === 'object' && plantInfo[key] !== null) {
          // Loop through the insect types and add the ones that are truthy
          const insectTypes = Object.keys(plantInfo[key]);
          const activeInsects = insectTypes.filter(type => plantInfo[key][type]);
          if (activeInsects.length > 0) {
            plantInfoHTML += `<p><strong>${key}:</strong> ${activeInsects.join(', ')}</p>`;
          }
        }
        // Add other properties and values to the plant info HTML
        else {
          plantInfoHTML += `<p><strong>${key}:</strong> ${plantInfo[key]}</p>`;
        }
      }
    }
    // Rendering plant info HTML in the plant info div
    plantInfoDiv.innerHTML = plantInfoHTML;
  }

  // Reset functionality
  resetButton.addEventListener('click', () => {
    // Clearing the search box
    inputBox.value = '';
    // Clearing autocomplete suggestions
    resultBox.innerHTML = '';
    // Clearing plant info

    plantInfoDiv.innerHTML = '';
    // Resetting the active index
    activeIndex = -1;
  });
}
