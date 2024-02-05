import Model from './model.js';

function getListUstensils(data) {
    let listRecipes = data;
    let listUstensils = [];
    for (let i = 0; i < listRecipes.length; i++) {
        listUstensils.push(listRecipes[i].ustensils)
    }
    return listUstensils;
}

function getListAppliances(data) {
    let listRecipes = data;
    let listAppliances = [];
    for (let i = 0; i < listRecipes.length; i++) {
        listAppliances.push(listRecipes[i].appliance)
    }
    return listAppliances;
}

function getListIngredients(data) {
    let listRecipes = data;
    let listIngredients = [];
    for (let i = 0; i < listRecipes.length; i++) {
        listIngredients.push(listRecipes[i].ingredients)
    }
    return listIngredients;
}

function globalArray(recipeId, listRecipes) {
    let globalArray = []
    globalArray.push(listRecipes[recipeId])
}


function searchAppliances(listAppliances, listRecipes, search) {
    for (let i = 0; i < listAppliances.length; i++) {
        if (listAppliances[i].includes(search)) {
            globalArray(i, listRecipes)
        }
    }
}


async function getRecipes() {
    // Récupération des pièces depuis le fichier JS
    const model = new Model();
    const listRecipes = await model.getData();
    const recipes = await model.getRecipesById(2);
    const listUstensils = getListUstensils(listRecipes)
    const listAppliances = getListAppliances(listRecipes)
    const listIngredients = getListIngredients(listRecipes)

    displayRecipes(listRecipes)
}

function displayRecipes(list) {
    const container = document.querySelector(".recipe-section");
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


/*document.querySelector('main_searchbar').addEventListener("input", (e) => {
    let value = e.target.value
    if (lengthCheck(value) === true) {

    } else if (lengthCheck(value) === false) {

    }
}
)

document.querySelector('ingredients_searchbar').addEventListener("input", (e) => {
    let value = e.target.value
}
)

document.querySelector('appliances_searchbar').addEventListener("input", (e) => {
    let value = e.target.value
}
)

document.querySelector('ustensils_searchbar').addEventListener("input", (e) => {
    let value = e.target.value
}
)*/

getRecipes();
