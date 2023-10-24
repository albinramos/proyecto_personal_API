
//recoger las calorias para añadir a la petición de la API
const caloriesValue = document.getElementById('selectedCalories');

const caloriesView = document.getElementById('calories');
caloriesView.addEventListener('change', (event) => {
    caloriesValue.textContent = `${caloriesView.value} calories`;
})

// Función para recoger información del formulario
document.getElementById('recipe-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    // 1-Obtener el ingrediente ingresado por el usuario
    const ingredient = document.getElementById('ingredient').value;

    // 2-Borrar el contenido de recipeDetails
    clearRecipeDetails();

    try {
        // 3-Realizar la solicitud a la API y obtener las recetas
        const recipes = await fetchRecipes(ingredient);

        // 4-Mostrar las recetas en el DOM
        displayRecipes(recipes);
    } catch (error) {
        console.error(error);
        const recipeResults = document.getElementById('recipe-results');
        recipeResults.innerHTML = 'Error. Please try again.';
    }
});

// 2. Función para borrar el contenido de recipeDetails
function clearRecipeDetails() {
    const recipeDetails = document.getElementById('recipe-details');
    recipeDetails.innerHTML = ''; // Limpiar detalles anteriores
}
// 3 Función para hacer la solicitud a la API y obtener recetas
async function fetchRecipes(ingredient) {
    const diet = document.getElementById('diet');
    const dietSelect = diet.value;
    const health = document.getElementById('health');
    const healthSelect = health.value;
    const calories = document.getElementById('calories');
    const caloriesSelect = calories.value;
   /*  console.log(caloriesSelect); */
    const app_id = 'a501d0ff'; 
    const app_key = 'd197d322494c498fc4960a2a4d6c5a50';
    let endpoint = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${app_id}&app_key=${app_key}&calories=${caloriesSelect}&q=${ingredient}`;


    if (dietSelect === '' && healthSelect !== '') {
        endpoint += `&health=${healthSelect}`;
    } else if (dietSelect !== '' && healthSelect === '') {
        endpoint += `&diet=${dietSelect}`;
    } else if (dietSelect !== '' && healthSelect !== '') {
        endpoint += `&diet=${dietSelect}&health=${healthSelect}`;
    }

    try {
        const response = await fetch(endpoint);

        if (!response.ok) {
            throw new Error(`Failed fetch. Status: ${response.status}`);
        }

        const data = await response.json();
        return data.hits;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// 4 Función para mostrar las recetas en el DOM
function displayRecipes(recipes) {
    /* console.log(recipes); */
    const recipeResults = document.getElementById('recipe-results');
    recipeResults.innerHTML = ''; // Limpiar resultados anteriores

    if (recipes.length === 0) {
        recipeResults.innerHTML = 'No se encontraron recetas con este ingrediente.';
    } else {
        recipes.sort((recipeA, recipeB) => {
            return recipeA.recipe.calories - recipeB.recipe.calories;
        });
        recipes.forEach(recipeApi => {
            // 4.1. Crear un elemento de receta
            const recipeItem = document.createElement('article');
            recipeItem.className = 'recipe-item';

            // 4.2. Obtener datos de la receta
            const recipeImage = recipeApi.recipe.image;
            const recipeLabel = recipeApi.recipe.label;
            const recipeDiet = recipeApi.recipe.dietLabels;
            const recipeHealth = document.getElementById('health').value;
            const recipeCalories = recipeApi.recipe.calories;

            console.log(recipeApi);
            // 4.3. Crear elementos para mostrar los datos en la receta
            const imageElement = document.createElement('img');
            imageElement.className = 'recipe-image';
            imageElement.src = recipeImage;
            imageElement.alt = recipeLabel;

            const labelElement = document.createElement('h2');
            labelElement.className = 'recipe-label';
            labelElement.textContent = recipeLabel;

            const dietElement = document.createElement('p');
            dietElement.className = 'recipe-diet';
            dietElement.textContent = `Diet: ${recipeDiet.join(', ')}`;

            const healthElement = document.createElement('p');
            healthElement.className = 'recipe-health';
            healthElement.textContent = `Health: ${recipeHealth}`;

            const caloriesElement = document.createElement('p');
            caloriesElement.className = 'recipe-calories';
            const formattedCalories = new Intl.NumberFormat().format(recipeCalories.toFixed(2));
            caloriesElement.textContent = `Calories: ${formattedCalories}`;

            //Marcar como favortio 
            const favElement = document.createElement('img');
            if (isThisRecipeFav(recipeLabel)) {
              favElement.setAttribute("src", "../assets/hungry_yes.png");
            } else {
              favElement.setAttribute("src", "../assets/hungry_no.png");
            }
            favElement.className = 'favorite';
            favElement.addEventListener('click', () => {
              const currentSrc = favElement.getAttribute('src');
              if (currentSrc === '../assets/hungry_yes.png') {
                favElement.setAttribute("src", "../assets/hungry_no.png");
              } else if (currentSrc === '../assets/hungry_no.png') {
                favElement.setAttribute("src", "../assets/hungry_yes.png");
              }
          
              addOrRemoveFavs(recipeLabel);
          });

            // 4.4. Agregar los elementos a la receta
            recipeItem.appendChild(imageElement);
            recipeItem.appendChild(labelElement);
            recipeItem.appendChild(dietElement);
            recipeItem.appendChild(healthElement);
            recipeItem.appendChild(caloriesElement);
            recipeItem.appendChild(favElement);

            // 4.5. Agregar la receta al resultado
            recipeResults.appendChild(recipeItem);

            // 4.6. Agregar un evento click para mostrar los detalles al hacer clic en la receta
            imageElement.addEventListener('click', () => {
                showRecipeDetails(recipeApi);
            });
        });
    }
}

// 5. Función para mostrar los detalles de una receta
function showRecipeDetails(recipeClick) {
    // 5.1. Borrar el contenido de recipeResults
    const recipeResults = document.getElementById('recipe-results');
    recipeResults.innerHTML = '';

    //PREGUNTAR DANEL!!!!!!!!!!
    /* const recipeItemFull = document.createElement('article');
    recipeItemFull.className = 'recipe-item'; */

    // 5.2. Obtener los detalles de la receta
    const recipeDetails = document.getElementById('recipe-details');
    const recipeLabel = recipeClick.recipe.label;
    const recipeImage = recipeClick.recipe.image;
    const recipeIngredients = recipeClick.recipe.ingredientLines;
    const recipeUrl = recipeClick.recipe.url;
    const recipeDiet = recipeClick.recipe.dietLabels;

    // 5.3. Crear elementos para mostrar los detalles en la receta
    const titleLabelElement = document.createElement('h2');
    titleLabelElement.className = 'h2-recipe'
    titleLabelElement.textContent = recipeLabel;

    const imageElement = document.createElement('img');
    imageElement.className = 'img-recipe';
    imageElement.src = recipeImage;
    imageElement.alt = recipeLabel;

        //favoritos
        const favElement = document.createElement('img');
        favElement.className = 'favorite-main';
        if (isThisRecipeFav(recipeLabel)) {
        console.log(recipeLabel);
          favElement.setAttribute("src", "../assets/hungry_yes.png");
        } else {
          favElement.setAttribute("src", "../assets/hungry_no.png");
        }
        favElement.className = 'favorite';
        favElement.addEventListener('click', () => {
          const currentSrc = favElement.getAttribute('src');
          if (currentSrc === '../assets/hungry_yes.png') {
            favElement.setAttribute("src", "../assets/hungry_no.png");
          } else if (currentSrc === '../assets/hungry_no.png') {
            favElement.setAttribute("src", "../assets/hungry_yes.png");
          }
      
          addOrRemoveFavs(recipeLabel);
      });
    
        recipeDetails.appendChild(favElement);

    const ingredientsListElement = document.createElement('ul');
    recipeIngredients.forEach(ingredient => {
        const ingredientItem = document.createElement('li');
        ingredientItem.className = 'li-recipe';
        ingredientItem.textContent = ingredient;
        ingredientsListElement.appendChild(ingredientItem);
    });

    const urlElement = document.createElement('a');
    urlElement.className = 'url-recipe';
    urlElement.textContent = 'link to the recipe';
    urlElement.href = recipeUrl;
    urlElement.target = '_blank';

    const dietElement = document.createElement('p');
    dietElement.className = 'diet-recipe';
    dietElement.textContent = `Diets: ${recipeDiet.join(', ')}`;

    // 5.4. Agregar los elementos al contenedor de detalles
    recipeDetails.appendChild(titleLabelElement);
    recipeDetails.appendChild(imageElement);
    recipeDetails.appendChild(ingredientsListElement);
    recipeDetails.appendChild(urlElement);
    recipeDetails.appendChild(dietElement);
}

//eliminar elementos de la pantalla
const clearButton = document.getElementById('clear-elements');
clearButton.addEventListener('click', function(event){
    const recipeItemElements = document.querySelectorAll('.recipe-item');

    recipeItemElements.forEach(function (element) {
        element.remove();
    })
});

//función para añadir o quitar recetas de favoritos en localStorage
function addOrRemoveFavs(recipeLabel) {
    if (localStorage.getItem(recipeLabel) === null) {
      localStorage.setItem(recipeLabel, 'favorite_recipes');
    } else {
      localStorage.removeItem(recipeLabel);
    }
};

function isThisRecipeFav(recipeLabel) {
    if (localStorage.getItem(recipeLabel) === null) {
      return false;
    } else {
      return true;
    }
};

const showFavoritesButton = document.getElementById('show-favorites-button');

// Agrega un event listener al botón

showFavoritesButton.addEventListener('click', () => {
    // Llama a la función para mostrar las recetas favoritas
    displayFavoriteRecipes();
});

function displayFavoriteRecipes() {
    const favoriteRecipesList = document.getElementById('favorite-recipes-list');
    const mainContainer = document.getElementById('recipe-results');
    mainContainer.innerHTML = '';
    const detailsContainer = document.getElementById('recipe-details');
    detailsContainer.innerHTML = '';
    

    // Limpia la lista de recetas favoritas
    favoriteRecipesList.innerHTML = '';

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);

        if (value === 'favorite_recipes') {
            // Crea un elemento de lista para la receta favorita
            const recipeItem = document.createElement('li');
            recipeItem.className = 'li-favorites';
            recipeItem.textContent = key;

            // Agrega la receta favorita a la lista
            favoriteRecipesList.appendChild(recipeItem);
        }
    }
};

// boton refresh para los favoritos
const clearButtonFav = document.getElementById('clear-elements');
clearButtonFav.addEventListener('click', function(event){
    const recipeFav = document.querySelectorAll('li');

    recipeFav.forEach(function (element) {
        element.remove();
    })
});




























