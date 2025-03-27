document.addEventListener('DOMContentLoaded', () => {
    const dogBar = document.getElementById('dog-bar');
    const dogInfo = document.getElementById('dog-info');
    const filterButton = document.getElementById('good-dog-filter');
    
    // Fetch all dogs and display their names in the Dog Bar
    fetch('http://localhost:3000/pups')
      .then(response => response.json())
      .then(dogs => {
        dogs.forEach(dog => {
          const span = document.createElement('span');
          span.textContent = dog.name;
          span.dataset.id = dog.id;
          dogBar.appendChild(span);
        });
      });

    // Show dog info when clicked
    dogBar.addEventListener('click', (event) => {
      if (event.target.tagName === 'SPAN') {
        const dogId = event.target.dataset.id;
        
        fetch(`http://localhost:3000/pups/${dogId}`)
          .then(response => response.json())
          .then(dog => {
            dogInfo.innerHTML = `
              <img src="${dog.image}" />
              <h2>${dog.name}</h2>
              <button>${dog.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>
            `;
            const button = dogInfo.querySelector('button');
            
            // Toggle good/bad dog
            button.addEventListener('click', () => {
              const newIsGoodDog = !dog.isGoodDog;
              fetch(`http://localhost:3000/pups/${dogId}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isGoodDog: newIsGoodDog })
              })
              .then(response => response.json())
              .then(updatedDog => {
                dog.isGoodDog = updatedDog.isGoodDog;
                button.textContent = dog.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
              });
            });
          });
      }
    });

    // Filter Good Dogs
    filterButton.addEventListener('click', () => {
      const isFilterOn = filterButton.textContent.includes('ON');
      filterButton.textContent = isFilterOn ? 'Filter Good Dogs: OFF' : 'Filter Good Dogs: ON';

      fetch('http://localhost:3000/pups')
        .then(response => response.json())
        .then(dogs => {
          const filteredDogs = isFilterOn ? dogs.filter(dog => dog.isGoodDog) : dogs;
          dogBar.innerHTML = ''; // Clear current dog bar
          filteredDogs.forEach(dog => {
            const span = document.createElement('span');
            span.textContent = dog.name;
            span.dataset.id = dog.id;
            dogBar.appendChild(span);
          });
        });
    });
  });