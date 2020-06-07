import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Like from './models/Like';
import * as searchView from './views/SearchView';
import * as receipeView from './views/RecipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';
import{elements,renderLoader,clearLoader} from './views/base';

//Global State
//*-Search Object
//*-Current Recepie Object
//*-Shopping list object
//*-Like Recepies. 

const state={};

const controlSearch= async () => {
    //1. Get query from the view

    const query = searchView.getInput();
    if(query){
        //2. New seearch object and add it to state
        state.search=new Search(query);

        //3. Prepare UI for the results
        renderLoader(elements.searchRes);
        searchView.clearInput();
        searchView.clearResults();
        try{
            //4.Search for recepies
            await state.search.getresults(); // Here waiting untill the results are comming form the api, once the receive we display them on the UI

            //5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);

        }catch(err){
            alert('Something went wrong');
        }

        
        
    }
}

elements.searchForm.addEventListener('submit',e=>{
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e=>{
    const btn= e.target.closest('.btn-inline');
    if(btn){
        const gotoPage = parseInt(btn.dataset.goto,10);
        searchView.clearResults();
        searchView.renderResults(state.search.result,gotoPage);
    }
});


const controlRecipe = async () => {
const id =window.location.hash.replace('#','');

if(id){
    //Prepare the UI for changes
    receipeView.clearRecipe();
    renderLoader(elements.recipe);

    //Create a new recipe object
    if(state.search) searchView.higlightSelect(id);
    state.Recipe=new Recipe(id);

    try{
    //Get Recipe Data

    await state.Recipe.getRecipe();
    state.Recipe.parseIngredients();
    

    //Calculate servings and recipe time
    state.Recipe.calcTime();
    state.Recipe.calcServings();

    //Render Recipe 
    clearLoader();
    receipeView.renderRecipe(state.Recipe,state.Likes.isLiked(id));
    
}
    catch(error){
        alert(error);
    };
}
}
//Recipe Controller

['load','hashchange'].forEach(event => window.addEventListener(event,controlRecipe));
//List Controller

const controlList= () =>{
    
    if(!state.List) state.List = new List();
    // Add ingredients

    state.Recipe.ingredients.forEach(el=>{
        const item = state.List.addList(el.count,el.unit,el.ingredient);
        listView.renderList(item);
    })
};

const controlLike =()=>{
if(!state.Likes) state.Likes= new Like();
const currentID= state.Recipe.id;

//User has not yet liked current recipe
if(state.Likes.isLiked(currentID)){
//Add like to the state
const newLike=state.Likes.addLike(currentID,state.Recipe.title,state.Recipe.author,state.Recipe.img)
//Toggle the like button
likeView.toggleLike(false);


//Ad like to the UI list
likeView.renderLike(newLike)
}else{
//User has liked the current recipe

state.Likes.deleteLike(currentID);
likeView.toggleLike(true);
likeView.deleteLike(currentID);

}

likeView.toggleLikemenu(state.Likes.getnumberLikes());
}

//Restore liked recipes when page loads

window.addEventListener('load', ()=>{

    state.Likes= new Like();
    state.Likes.readStorage();
    likeView.toggleLikemenu(state.Likes.getnumberLikes());
    state.Likes.likes.forEach(el => likeView.renderLike(el));
    
})

//Handling delete and update count on the list item.
elements.shoppinglist.addEventListener('click',e=>{
    const id= e.target.closest('.shopping__item').dataset.item;
    console.log(id);
    // Delete the item
    if(e.target.matches('.shopping__delete,.shopping__delete *')){
        state.List.deleteItem(id);

        listView.deleteList(id);
        
    }else if (e.target.matches('.shopping__count-value')){
        const val = parseInt(e.target.value,10);
        if (val>0) state.List.updateCount(id,val);
    }
})

//Handling Recipe Button Servings
elements.recipe.addEventListener('click',e=>{
    if(e.target.matches('.btn-decrease,.btn-decrease *')){
        if(state.Recipe.servings>1){
            state.Recipe.updateServings('dec');
            receipeView.updateServingsView(state.Recipe);}
        
    }else if(e.target.matches('.btn.increase,.btn-increase *')){
        state.Recipe.updateServings('inc');
        receipeView.updateServingsView(state.Recipe);
    }else if(e.target.matches('.recipe__btn-add , .recipe__btn-add *')){
        controlList();
    }
    else if(e.target.matches('.recipe__love ,.recipe__love *')){
        controlLike();
    }
      
});

