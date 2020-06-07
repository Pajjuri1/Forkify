import axios from 'axios';

export default class Recipe{
    constructor(id){
        this.id=id;
    }

    async getRecipe(){  
        try{
            const reci= await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            
            this.title = reci.data.recipe.title;
            this.author=reci.data.recipe.publisher;
            this.img=reci.data.recipe.image_url;
            this.url=reci.data.recipe.source_url;
            this.ingredients=reci.data.recipe.ingredients;
        }
        catch(error){
            alert(error);
            
        }
    }

    calcTime(){

        // Asuming that we need 15 minutes for each ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng/3);
        this.time = periods * 15;
    }

    calcServings(){
        this.servings = 4;
    }

    parseIngredients(){
        const unitsLong=['tabelspoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds','Kg','g'];
        const unitShort=['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound','Kg','g'];
        const newingredients = this.ingredients.map(el => {
            //Uniform units

            let ingredient =el.toLowerCase();
            unitsLong.forEach((unit,i)=>{
            ingredient = ingredient.replace(unit,unitShort[i]);
            }
            );
            //Remove Paraentesis 

            ingredient=ingredient.replace(/ *\([^)]*\) */g, ' ');

            //Parse ingredients into count,unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2=>unitShort.includes(el2)); 
            let objIng;
            if(unitIndex>-1){
                //There is a unit 
                let count;
                const arrCount = arrIng[0,unitIndex];
                if(arrCount.length==1){
                    count = eval(arrIng[0].replace('-','+'));
                }else{
                    count= eval(arrIng.slice(0,unitIndex).join('+'));
                }
                objIng={
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' '),
                }  
            }else if(parseInt(arrIng[0],10)){
                //There is no unit,but 1st element is a number
                objIng={
                    count:parseInt(arrIng[0],10),
                    unit:'',
                    ingredient:arrIng.slice(1).join(' '),
                }
                
            }else if (unitIndex===-1){
                //There is no unit
                objIng={
                    count:1,
                    unit:'',
                    ingredient
                }
                
            }
            return objIng;
        });

        this.ingredients=newingredients;
    }
    updateServings(type){
        const newServings = type === 'dec'?this.servings-1:this.servings+1;

        this.ingredients.forEach(el=>{
            el.count *=(newServings/this.servings);
        });
        this.servings=newServings;
    }
    
}