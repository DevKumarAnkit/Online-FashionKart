let bagItems;
let wishlistItems;
let currentItems=[...items];
let searchTimer;

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

function saveBag(){
localStorage.setItem('bagItems',JSON.stringify(bagItems));
}

function saveWishlist(){
localStorage.setItem('wishlistItems',JSON.stringify(wishlistItems));
}

function addToBag(itemId){
if(bagItems.includes(itemId)){
showToast('Item already added to bag');
return;
}

bagItems.push(itemId);
saveBag();
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

saveWishlist();
displayWishlistIcon();
displayItemsOnHomePage(currentItems);
}

function displayBagIcon(){
let bagItemCountElement=document.querySelector('.bag-item-count');

if(!bagItemCountElement)return;

bagItemCountElement.innerText=bagItems.length;
bagItemCountElement.style.visibility=bagItems.length>0?'visible':'hidden';
}

function displayWishlistIcon(){
let wishlistCountElement=document.querySelector('.wishlist-count');

if(!wishlistCountElement)return;

wishlistCountElement.innerText=wishlistItems.length;
wishlistCountElement.style.visibility=wishlistItems.length>0?'visible':'hidden';
}

function displayItemsOnHomePage(productList=currentItems){
let itemsContainerElement=document.querySelector('.items-container');

if(!itemsContainerElement)return;

if(productList.length===0){
itemsContainerElement.innerHTML=`
<div class="empty-search">
No products found
<br>
<button onclick="showAllItems()">Show All Products</button>
</div>`;
return;
}

let innerHtml='';

productList.forEach(item=>{
let active=wishlistItems.includes(item.id)?'wishlist-active':'';

innerHtml+=`
<div class="item-container">
<div class="product-badge">${item.tag}</div>
<img class="item-image" src="${item.image}" alt="${item.item_name}">
<div class="rating">${item.rating.stars} ⭐ | ${item.rating.count}</div>
<div class="company-name">${item.company}</div>
<div class="item-name">${item.item_name}</div>
<div class="price">
<span class="current-price">₹${item.current_price}</span>
<span class="original-price">₹${item.original_price}</span>
<span class="discount">(${item.discount_percentage}% OFF)</span>
</div>
<div class="stock">${item.stock}</div>
<div class="delivery-small">Free delivery by ${item.delivery_date}</div>
<div class="card-buttons">
<button class="btn-add-bag" onclick="addToBag('${item.id}')">Add to Bag</button>
<button class="btn-wishlist ${active}" onclick="addToWishlist('${item.id}')">
<span class="material-symbols-outlined">favorite</span>
</button>
</div>
</div>`;
});

itemsContainerElement.innerHTML=innerHtml;
}

function searchItems(value){
clearTimeout(searchTimer);

searchTimer=setTimeout(()=>{
let searchValue=value.trim().toLowerCase();

if(searchValue===''){
currentItems=[...items];
displayItemsOnHomePage(currentItems);
return;
}

currentItems=items.filter(item=>
item.company.toLowerCase().includes(searchValue)||
item.item_name.toLowerCase().includes(searchValue)||
item.category.toLowerCase().includes(searchValue)||
item.tag.toLowerCase().includes(searchValue)
);

displayItemsOnHomePage(currentItems);
scrollToProducts();
},250);
}

function filterItems(category){
currentItems=items.filter(item=>item.category===category);
displayItemsOnHomePage(currentItems);
showToast(`${category} products`);
scrollToProducts();
}

function showAllItems(){
currentItems=[...items];

let searchInput=document.querySelector('.search_input');
if(searchInput)searchInput.value='';

displayItemsOnHomePage(currentItems);
showToast('Showing all products');
scrollToProducts();
}

function sortItems(type){
if(type==='low'){
currentItems.sort((a,b)=>a.current_price-b.current_price);
showToast('Sorted by low price');
}else if(type==='high'){
currentItems.sort((a,b)=>b.current_price-a.current_price);
showToast('Sorted by high price');
}else if(type==='rating'){
currentItems.sort((a,b)=>b.rating.stars-a.rating.stars);
showToast('Sorted by rating');
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
scrollToProducts();
}

function scrollToProducts(){
let section=document.querySelector('.items-container');

if(!section)return;

section.scrollIntoView({
behavior:'smooth',
block:'start'
});
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
let modal=document.querySelector('.profile-modal');

if(!modal)return;

modal.style.display='flex';
}

function closeProfile(){
let modal=document.querySelector('.profile-modal');

if(!modal)return;

modal.style.display='none';
}

function loginDemo(){
showToast('No real orders.This is a demo profile');
closeProfile();
}

document.addEventListener('keydown',function(event){
if(event.key==='Escape'){
closeProfile();
}
});

document.addEventListener('click',function(event){
let modal=document.querySelector('.profile-modal');
let box=document.querySelector('.profile-box');

if(!modal||!box)return;

if(modal.style.display==='flex'&&event.target===modal){
closeProfile();
}
});