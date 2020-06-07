import {elements} from './base'

export const getInput =() => elements.searchInput.value;

export const clearInput = () =>{
    elements.searchInput.value='';
};

export const clearResults = () =>{
    elements.searchresultList.innerHTML='';// This will delete all the html elements and make it empty
    elements.searchResPages.innerHTML='';
}  


export const higlightSelect = id =>{
    const Arr= Array.from(document.querySelectorAll('.results__link--active'));
    Arr.forEach(el=> 
        {el.classList.remove('results__link--active');
    })
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
}

export const limitRecipe=(title,limit=17) =>{
    const newTitle=[];
    if (title.length>limit){
        title.split(' ').reduce((acc,curr)=>{
            if(acc+curr.length<=limit){
                newTitle.push(curr);
            }
            return acc+curr.length;
        },0);

        return `${newTitle.join(' ')} ...`;
    } 
    return title;
}

const renderRecipie = recipe =>{
    const markup = `
    
    <li>
                            <a class="results__link" href="#${recipe.recipe_id}">
                                <figure class="results__fig">
                                    <img src="${recipe.image_url}" alt="${limitRecipe(recipe.title)}">
                                </figure>
                                <div class="likes__data">
                                    <h4 class="results__name">${limitRecipe(recipe.title)}</h4>
                                    <p class="results__author">${recipe.publisher}</p>
                                </div>
                            </a>
                        </li>
    
    
    `;

    elements.searchresultList.insertAdjacentHTML('beforeend',markup);
};

const createButton = (page,type)=> `
<button class="btn-inline results__btn--${type}" data-goto=${type ==='prev'?page-1:page+1}>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type ==='prev'?'left':'right'}"></use>
    </svg>
    <span>Page ${type ==='prev'?page-1:page+1}</span>
</button>`;

const renderButtons = (page,numResults,resperpage)=>{
    const pages= Math.ceil(numResults/resperpage);
    let button;
    if (page==1 && pages>1){
       button= createButton(page,'next');
    }else if (page<pages){
        button= `${createButton(page,'next')}
                 ${createButton(page,'prev')}`;
    }else if(page==pages&& pages>1){
        button= createButton(page,'prev');
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin',button);
};

export const renderResults = (recipes,page=1,resultperpage=10) => {
    //render results of current pages
    const start= (page-1) * resultperpage;
    const end= page * resultperpage;
    recipes.slice(start,end).forEach(renderRecipie);

    // render pagination buttons
    renderButtons(page,recipes.length,resultperpage)
};