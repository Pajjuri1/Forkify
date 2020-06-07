import {elements} from './base';
import {limitRecipe} from './SearchView';
export const toggleLike = isliked=>{
    let iconstring= isliked?'icon-heart-outlined':'icon-heart';
    document.querySelector('.recipe__love use').setAttribute('href',`img/icons.svg#${iconstring}`);
}

export const toggleLikemenu = numlikes =>{
elements.likesMenu.style.visibility= numlikes>0 ?'visible':'hidden';
}

export const renderLike= like =>{
const markup=`
<li>
<a class="likes__link" href="#${like.id}">
    <figure class="likes__fig">
        <img src="${like.img}" alt="${limitRecipe(like.title)}">
    </figure>
    <div class="likes__data">
        <h4 class="likes__name">${limitRecipe(like.title)}</h4>
        <p class="likes__author">${like.author}</p>
    </div>
</a>
</li>
`
elements.likeslist.insertAdjacentHTML('beforeend',markup);

}

export const deleteLike= id=>{
    const el=document.querySelector(`.likes__link[href*="${id}"]`);
    if(el) el.parentElement.removeChild(el);
}

