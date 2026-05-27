let bagItems;
let wishlistItems;
let currentItems=[...items];

onLoad();

function onLoad(){
let bagItemsStr=localStorage.getItem('bagItems');
let wishlistStr=localStorage.getItem('wishlistItems');

bagItems=bagItemsStr?JSON.parse(bagItemsStr):[];
wishlistItems=wishlistStr?JSON.parse(wishlistStr):[];

displayItemsOnHomePage(currentItems);
displayBagIcon();
displayWishlistIcon();
}

function addToBag(itemId){
if(bagItems.includes(itemId)){
showToast('Item already added to bag');
return;
}

bagItems.push(itemId);
localStorage.setItem('bagItems',JSON.stringify(bagItems));

displayBagIcon();
showToast('Added to Bag');
}

function addToWishlist(itemId){
if(wishlistItems.includes(itemId)){
wishlistItems=wishlistItems.filter(id=>id!=itemId);
showToast('Removed from Wishlist');
}else{
wishlistItems.push(itemId);
showToast('Added to Wishlist');
}

localStorage.setItem('wishlistItems',JSON.stringify(wishlistItems));

displayWishlistIcon();
displayItemsOnHomePage(currentItems);
}

function displayBagIcon(){
let bagItemCountElement=document.querySelector('.bag-item-count');

if(!bagItemCountElement)return;

if(bagItems.length>0){
bagItemCountElement.style.visibility='visible';
bagItemCountElement.innerText=bagItems.length;
}else{
bagItemCountElement.style.visibility='hidden';
}
}

function displayWishlistIcon(){
let wishlistCountElement=document.querySelector('.wishlist-count');

if(!wishlistCountElement)return;

if(wishlistItems.length>0){
wishlistCountElement.style.visibility='visible';
wishlistCountElement.innerText=wishlistItems.length;
}else{
wishlistCountElement.style.visibility='hidden';
}
}

function displayItemsOnHomePage(productList=currentItems){
let itemsContainerElement=document.querySelector('.items-container');

if(!itemsContainerElement)return;

if(productList.length===0){
itemsContainerElement.innerHTML='<div class="empty-search">No products found</div>';
return;
}

let innerHtml='';

productList.forEach(item=>{
let active=wishlistItems.includes(item.id)?'wishlist-active':'';

innerHtml+=`
<div class="item-container">

<div class="product-badge">${item.tag}</div>

<img class="item-image" src="${item.image}" alt="${item.item_name}">

<div class="rating">
${item.rating.stars} ⭐ | ${item.rating.count}
</div>

<div class="company-name">${item.company}</div>

<div class="item-name">${item.item_name}</div>

<div class="price">
<span class="current-price">₹${item.current_price}</span>
<span class="original-price">₹${item.original_price}</span>
<span class="discount">(${item.discount_percentage}% OFF)</span>
</div>

<div class="stock">${item.stock}</div>

<div class="delivery-small">
Free delivery by ${item.delivery_date}
</div>

<div class="card-buttons">

<button class="btn-add-bag" onclick="addToBag('${item.id}')">
Add to Bag
</button>

<button class="btn-wishlist ${active}" onclick="addToWishlist('${item.id}')">
<span class="material-symbols-outlined">
favorite
</span>
</button>

</div>

</div>`;
});

itemsContainerElement.innerHTML=innerHtml;
}

function searchItems(value){
let searchValue=value.toLowerCase();

currentItems=items.filter(item=>
item.company.toLowerCase().includes(searchValue)||
item.item_name.toLowerCase().includes(searchValue)||
item.category.toLowerCase().includes(searchValue)
);

displayItemsOnHomePage(currentItems);
}

function filterItems(category){
currentItems=items.filter(item=>item.category===category);
displayItemsOnHomePage(currentItems);
}

function showAllItems(){
currentItems=[...items];
displayItemsOnHomePage(currentItems);
}

function sortItems(type){
if(type==='low'){
currentItems.sort((a,b)=>a.current_price-b.current_price);
}else if(type==='high'){
currentItems.sort((a,b)=>b.current_price-a.current_price);
}else if(type==='rating'){
currentItems.sort((a,b)=>b.rating.stars-a.rating.stars);
}

displayItemsOnHomePage(currentItems);
}

function showWishlistItems(){
if(wishlistItems.length===0){
showToast('Wishlist is empty');
return;
}

currentItems=items.filter(item=>wishlistItems.includes(item.id));

displayItemsOnHomePage(currentItems);
showToast('Showing wishlist items');
}

function showToast(message){
let toast=document.querySelector('.toast');

if(!toast)return;

toast.innerText=message;
toast.classList.add('show-toast');

setTimeout(()=>{
toast.classList.remove('show-toast');
},1600);
}

function openProfile(){
document.querySelector('.profile-modal').style.display='flex';
}

function closeProfile(){
document.querySelector('.profile-modal').style.display='none';
}

function loginDemo(){
showToast('No real orders.This is a demo profile');
closeProfile();
}