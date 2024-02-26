import Model from './model.js';
let tagArray = [];

// Initialisation de la page
async function initializeRecipePage() {
    const model = new Model();

    const [listRecipes, listUstensils, listAppliances, listIngredients, listAll] = await Promise.all([
        model.getData(),
        model.getUstensils(),
        model.getAppliances(),
        model.getIngredients(),
        model.getAll()
    ]);

    const lists = [
        { data: listIngredients, name: 'ingredients' },
        { data: listAppliances, name: 'appareils' },
        { data: listUstensils, name: 'ustensils' },
        { data: listAll, name: 'banner' }
    ];

    displayRecipes(listRecipes);
    searchbarManager(listRecipes);
    lists.forEach(({ data, name }) => {
        displayList(data, name);
        handleListSearch(data, name);
        tagManager(listRecipes, name);
    });
}



// affiche une liste de recette
function displayRecipes(list) {
    const container = document.querySelector(".recipe-section");
    container.innerHTML = ''
    for (let i = 0; i < list.length; i++) {
        const recipeId = list[i].id;
        const recipeName = list[i].name;
        const recipeIngredientsList = list[i].ingredients;
        const recipeImage = list[i].image;
        const recipeDescription = list[i].description;
        const recipeTime = list[i].time;

        const cardHTML = `
            <article class="card">
              <img src="../assets/Photos P7 JS Les petits plats/${recipeImage}" alt="${recipeName} portrait">
              <h2>${recipeName}</h2>
              <div class="card-recette">
                <h1 class="card-section_title">RECETTE</h1>
                <p>${recipeDescription}</p>
              </div>
              <div class="card-ingredients">
                <h1 class="card-section_title">INGRÉDIENTS</h1>
                <div class="ingredients-container ingredients-container-${recipeId}"></div>
              </div>
              <p class='timer'>${recipeTime}min</p>
            </article>
            `;
        container.innerHTML += cardHTML;

        for (let j = 0; j < recipeIngredientsList.length; j++) {
            const ingredientsContainer = document.querySelector(`.ingredients-container-${recipeId}`);
            const ingredientName = recipeIngredientsList[j].ingredient;
            const ingredientQuantity = recipeIngredientsList[j].quantity !== undefined ? recipeIngredientsList[j].quantity : '-';
            const ingredientUnit = recipeIngredientsList[j].unit !== undefined ? recipeIngredientsList[j].unit : ' ';

            ingredientsContainer.innerHTML += `
            <div class="ingredients-div">
              <h1>${ingredientName}</h1>
              <p>${ingredientQuantity} ${ingredientUnit}</p>
            </div>
            `;
        }
    }
    displayNumberRecipes(list.length)
}

// affiche le nombre de recette afficher à l'écran
function displayNumberRecipes(length) {
    let container = document.querySelector('.filter-amount');
    container.innerHTML = `<p class="recipe-amount">${length} recettes</p>`

}

// affiche les listes d'éléments en dessous des champs de recherche
function displayList(list, listName) {
    let container = document.querySelector(".result-" + CSS.escape(listName))
    container.innerHTML = ''
    for (let i = 0; i < list.length; i++) {
        container.innerHTML += `
        <p class="list-element">${list[i]}</p>
        `
    }
}




// tag section
// lance les différentes fonctions nécessaires au fonctionnement des tags
function tagManager(listRecipes, listName) {
    let container = document.querySelector(".tag-section");
    let element = document.querySelector('.result-' + CSS.escape(listName));
    let searchInput = document.querySelector('#searchbar-banner').innerText;
    element.addEventListener("click", (e) => {
        let value = e.target.innerText;

        if (tagArray.includes(value) === false) {
            displayTag(value, container);
            tagArray.push(value);
            displayRecipesByTag(listRecipes, listName);
            addTagEventListeners(listRecipes, listName);
            searchInput = ''
        }
    });
}

// ajoute le tag dans le dom
function displayTag(value, container) {
    container.innerHTML += `
            <div class="tag">
              <p>${value}</p>
              <i class="fa-solid fa-xmark delete-x"></i>
            </div>
        `;
}

// ajoute un eventlistener à chaque création de tag
function addTagEventListeners(listRecipes, listName) {
    const deleteIcons = document.querySelectorAll('.tag-section .delete-x');
    deleteIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            deleteTag(icon);
            displayRecipesByTag(listRecipes, listName);
        });
    });
}

//supprime le tag du dom et de la varaiable global
function deleteTag(icon) {
    const tag = icon.parentElement;
    const value = tag.querySelector("p").textContent;
    tagArray = tagArray.filter(tagValue => tagValue !== value);
    tag.remove();
}

// affiche les recettes en fonction des tags 
function displayRecipesByTag(listRecipes, name) {
    let newRecipeArray = [];

    for (let j = 0; j < listRecipes.length; j++) {
        let recipeMatchesAllTags = true;

        for (let i = 0; i < tagArray.length; i++) {
            let tagMatches = false;

            if (listRecipes[j].appliance && listRecipes[j].appliance.localeCompare(tagArray[i]) === 0) {
                tagMatches = true;
            }

            if (!tagMatches) {
                for (let k = 0; k < listRecipes[j].ustensils.length; k++) {
                    if (listRecipes[j].ustensils[k].localeCompare(tagArray[i]) === 0) {
                        tagMatches = true;
                        break;
                    }
                }
            }

            if (!tagMatches) {
                for (let k = 0; k < listRecipes[j].ingredients.length; k++) {
                    if (listRecipes[j].ingredients[k].ingredient.localeCompare(tagArray[i]) === 0) {
                        tagMatches = true;
                        break;
                    }
                }
            }

            if (!tagMatches) {
                recipeMatchesAllTags = false;
                break;
            }
        }

        if (recipeMatchesAllTags) {
            newRecipeArray.push(listRecipes[j]);
        }
    }

    if (newRecipeArray.length === 0) {
        displayError(tagArray)
    } else {
        displayRecipes(newRecipeArray);
    }
}




function searchbarManager(listRecipes) {
    let searchInput = document.querySelector('#searchbar-banner');

    searchInput.addEventListener("input", (e) => {
        let searchInputResult = e.target.value.trim().toLowerCase();
        if (searchInputResult.length >= 3) {
            displayRecipesBySearch(searchInputResult, listRecipes);
        }

        if (searchInputResult.length < 3) {
            displayRecipesByTag(listRecipes);
        }
    });
}

function displayRecipesBySearch(searchInput, recipes) {
    const filteredRecipes = [];

    for (const recipe of recipes) {
        const recipeName = recipe.name.toLowerCase();
        const recipeDescription = recipe.description.toLowerCase();
        
        if (recipeName.includes(searchInput) || recipeDescription.includes(searchInput)) {
            filteredRecipes.push(recipe);
        } else {
            for (const ingredient of recipe.ingredients) {
                if (ingredient.ingredient.toLowerCase().includes(searchInput)) {
                    filteredRecipes.push(recipe);
                    break;
                }
            }
        }
    }

    displayRecipes(filteredRecipes);
}





// affiche un message d'erreur si aucune recette ne correspond
function displayError(list) {
    let container = document.querySelector('.recipe-section');
    container.innerHTML = `<p class='error-msg'>Aucune recette ne contient ‘${list.toString().replaceAll(',', ', ')}’ vous pouvez chercher «
    tarte aux pommes », « poisson », etc.</p>`
}

// renvoie les éléments contenant la valeur du champ de recherche
function filterListBySearchInput(searchInput, list) {
    let resultArray = []
    for (let i = 0; i < list.length; i++) {
        if ((list[i].toLowerCase()).includes(searchInput.toLowerCase())) {
            resultArray.push(list[i])
        }

    }
    return resultArray
}

// détecte l'éntrée dans le champ de recherche et lance les fonctions associées
function handleListSearch(list, listName) {
    document.querySelector('#searchbar-' + CSS.escape(listName)).addEventListener("input", (e) => {
        let value = e.target.value;
        let array = filterListBySearchInput(value, list);
        filterListBySearchInput(value, list);
        displayList(array, listName);
    }
    )
}

initializeRecipePage();
