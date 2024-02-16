import Model from './model.js';

// Initialisation de la page

async function initializeRecipePage() {
    const model = new Model();

    const [listRecipes, listUstensils, listAppliances, listIngredients, listDescritpions, listAll] = await Promise.all([
        model.getData(),
        model.getUstensils(),
        model.getAppliances(),
        model.getIngredients(),
        model.getDescriptions(),
        model.getAll()
    ]);

    const lists = [
        { data: listIngredients, name: 'ingredients' },
        { data: listAppliances, name: 'appareils' },
        { data: listUstensils, name: 'ustensils' },
        { data: listAll, name: 'banner' }
    ];

    displayRecipes(listRecipes);
    lists.forEach(({ data, name }) => {
        displayList(data, name);
        handleListSearch(data, name);
        displayTag(name, listRecipes);
    });
}

let tagArray = [];

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

// affiche les tags
function displayTag(listName, listRecipes) {
    let container = document.querySelector(".tag-section")
    document.querySelector('.result-' + CSS.escape(listName)).addEventListener("click", (e) => {
        let value = e.target.innerText;

        if (tagArray.includes(value) === false) {
            container.innerHTML += `
            <div class="tag">
              <p>${value}</p>
              <i class="fa-solid fa-xmark delete-x"></i>
            </div>
            `;
            tagArray.push(value);
        }
        displayRecipesByTag(listRecipes, tagArray,listName)
    }
    )
    deleteTag()
}

function displayRecipesByTag(listRecipes, tagArray, tagType) {
    let newRecipeArray = [];

    for (let i = 0; i < tagArray.length; i++) {
        for (let j = 0; j < listRecipes.length; j++) {
            if (tagType === 'appareils') {
                if (listRecipes[j].appliance.localeCompare(tagArray[i]) === 0) {
                    if (!newRecipeArray.includes(listRecipes[j])) {
                        newRecipeArray.push(listRecipes[j]);
                    }
                }
            } else if (tagType === 'ustensils') {
                for (let k = 0; k < listRecipes[j].ustensils.length; k++) {
                    if (listRecipes[j].ustensils[k].localeCompare(tagArray[i]) === 0) {
                        if (!newRecipeArray.includes(listRecipes[j])) {
                            newRecipeArray.push(listRecipes[j]);
                        }
                    }
                }
            } else if (tagType === 'ingredients') {
                for (let k = 0; k < listRecipes[j].ingredients.length; k++) {
                    if (listRecipes[j].ingredients[k].ingredient.localeCompare(tagArray[i]) === 0) {
                        if (!newRecipeArray.includes(listRecipes[j])) {
                            newRecipeArray.push(listRecipes[j]);
                        }
                    }
                }
            }
        }
    }

    displayRecipes(newRecipeArray);
}


// a
/*function displayRecipesByTagAppliance(listRecipes, tagArray) {
    let newRecipeArray = [];
    for (let i = 0; i < tagArray.length; i++) {
        for (let j = 0; j < listRecipes.length; j++) {

            console.log(listRecipes[j].appliance.localeCompare(tagArray[i]))
            if (listRecipes[j].appliance.localeCompare(tagArray[i]) === 0) {
                newRecipeArray.push(listRecipes[j])
                displayRecipes(newRecipeArray);
            }
        }
    }

}

function displayRecipesByTagUstensils(listRecipes, tagArray) {
    let newRecipeArray = [];

    for (let i = 0; i < tagArray.length; i++) {
        for (let j = 0; j < listRecipes.length; j++) {
            for (let k = 0; k < listRecipes[j].ustensils.length; k++) {
                if (listRecipes[j].ustensils[k].localeCompare(tagArray[i]) === 0) {
                    if (!newRecipeArray.includes(listRecipes[j])) {
                        newRecipeArray.push(listRecipes[j]);
                    }
                }
            }
        }
    }

    displayRecipes(newRecipeArray);
}

function displayRecipesByTagIngredients(listRecipes, tagArray) {
    let newRecipeArray = [];

    for (let i = 0; i < tagArray.length; i++) {
        for (let j = 0; j < listRecipes.length; j++) {
            for (let k = 0; k < listRecipes[j].ingredients.length; k++) {
                if (listRecipes[j].ingredients[k].ingredient.localeCompare(tagArray[i]) === 0) {
                    if (!newRecipeArray.includes(listRecipes[j])) {
                        newRecipeArray.push(listRecipes[j]);
                    }
                }
                //console.log(listRecipes[j].ingredients[k].ingredient)
                
            }
        }
    }

    displayRecipes(newRecipeArray);
}*/

// supprime les tags
function deleteTag() {
    const container = document.querySelector(".tag-section");

    container.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-x")) {
            const tag = e.target.parentElement;
            const value = tag.querySelector("p").textContent;
            tagArray = tagArray.filter(tagValue => tagValue !== value);
            tag.remove();
        }
    });
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
        let value = e.target.value
        let array = filterListBySearchInput(value, list)
        filterListBySearchInput(value, list)
        displayList(array, listName)
    }
    )
}


initializeRecipePage();
