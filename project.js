document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '45a3613cee7843a4b29ef576b7354504';
    let recipeOffset = 0; // Variable to track offset for pagination

    const recipeList = document.getElementById('recipes');
    const recipeDetail = document.querySelector('.recipeDetails');
    const prevBtn = document.getElementById('prevRecipes');
    const nextBtn = document.getElementById('nextRecipes');

    // Function to fetch recipes from API
    function fetchRecipes(offset) {
        const api = `https://api.spoonacular.com/recipes/random?number=5&tags=breakfast&apiKey=${apiKey}&offset=${offset}`;
        fetch(api)
            .then(response => response.json())
            .then(data => {
                if (data.recipes) {
                    renderRecipes(data.recipes);
                }
            })
            .catch(error => console.error('Did not quite get that!', error));
    }

    // Function to render recipes list
    function renderRecipes(recipes) {
        recipeList.innerHTML = '';
        recipes.forEach(recipe => {
            const recipeItem = document.createElement('li');
            recipeItem.classList.add('recipe');
            recipeItem.innerHTML = `
                <h2>${recipe.title}</h2>
                <img src="${recipe.image}" alt="${recipe.title} Image">
                <button class="detailsBtn" data-recipe-id="${recipe.id}">Show more</button>
            `;
            recipeList.appendChild(recipeItem);
        });

        // Add event listener for recipe details button
        recipeList.addEventListener('click', function(event) {
            if (event.target.classList.contains('detailsBtn')) {
                const recipeId = event.target.dataset.recipeId;
                fetchRecipeDetails(recipeId);
            }
        });
    }

    // Function to fetch recipe details by recipe ID
    function fetchRecipeDetails(recipeId) {
        fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`)
            .then(response => response.json())
            .then(recipe => {
                displayRecipeDetails(recipe);
            })
            .catch(error => console.error('Did not quite get that!', error));
    }

    // Function to render recipe details
    function displayRecipeDetails(recipe) {
        const innerHTML = `
            <h2>${recipe.title}</h2>
            <img src="${recipe.image}" alt="${recipe.title} Image">
            <p><strong>Ready In:</strong> ${recipe.readyInMinutes} minutes</p>
            <p><strong>Servings:</strong> ${recipe.servings}</p>
            <h3>Ingredients</h3>
            <ul>
                ${recipe.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('')}
            </ul>
            <h3>Instructions</h3>
            <p>${recipe.instructions}</p>
        `;
        recipeDetail.innerHTML = innerHTML;
    }

    // previous recipes button
    prevBtn.addEventListener('click', function() {
        if (recipeOffset > 0) {
            recipeOffset -= 5;
            fetchRecipes(recipeOffset);
        }
    });

    // next recipes btn
    nextBtn.addEventListener('click', function() {
        recipeOffset += 5;
        fetchRecipes(recipeOffset);
    });

    // Initial fetch of recipes when page loads
    fetchRecipes(recipeOffset);
});
