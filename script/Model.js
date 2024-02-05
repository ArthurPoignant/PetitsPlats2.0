import { recipes } from '../data/recipes.js'

class Model {
    static data = null;
    async getData() {
      if (this.data == null) {
        this.data = recipes;
      }

      return this.data;
    }

    async getRecipesById(id) {
        let listRecipes = await this.getData();
        for (const recipe of listRecipes) {
          if (recipe.id == id) {
            return recipe;
          }
        }
        return null;
    }

    /*async getListUstensils() {
        let listRecipes = await this.getData();
        let ustensilsList = [];
        for (const recipe of listRecipes) {
            ustensilsList += recipe.ustensils;
            return ustensilsList;
        }
        return null;
    }

    async getListUstensils(){
        let listRecipes = await this.getData();
        for (let i = 0; i < listRecipes.length; i++) {
            return listRecipes[i].ustensils
            
        }
    }

    async getListAppliances() {
        let listRecipes = await this.getData();
        for (const recipe of listRecipes) {
            return recipe.appliance;
        }
        return null;
    }

    async getListIngredients() {
        let listRecipes = await this.getData();
        for (const recipe of listRecipes) {
            return recipe.ingredients;
        }
        return null;
    }*/
}  

export default Model;