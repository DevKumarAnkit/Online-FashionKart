const CONVENIENCE_FEES=99;
const COUPON_CODE='VIRAT18';
const COUPON_DISCOUNT=18;

let couponDiscount=Number(localStorage.getItem('couponDiscount'))||0;
let bagItemObjects=[];

onBagLoad();

function onBagLoad(){
loadBagItemObjects();
displayBagItems();
displayBagSummary();
displayBagIcon();
displayWishlistIcon();
}

function loadBagItemObjects(){
bagItemObjects=bagItems.map(id=>items.find(item=>item.id==id)).filter(item=>item);
}

function displayBagItems(){
let container=document.querySelector('.bag-items-container');
if(!container)return;

if(bagItemObjects.length===0){
couponDiscount=0;
localStorage.removeItem('couponDiscount');
container.innerHTML=`
<div class="empty-bag">
<span class="material-symbols-outlined">shopping_bag</span>
<h2>Your bag is empty</h2>
<p>Add items to make it happy.</p>
<a href="../index.html">Continue Shopping</a>
</div>`;
return;
}

container.innerHTML=bagItemObjects.map(item=>generateItemHTML(item)).join('');
}

function displayBagSummary(){
let summary=document.querySelector('.bag-summary');
if(!summary)return;

if(bagItemObjects.length===0){
summary.innerHTML='';
return;
}

let totalMRP=0;
let totalDiscount=0;

bagItemObjects.forEach(item=>{
totalMRP+=item.original_price;
totalDiscount+=item.original_price-item.current_price;
});

let finalPayment=Math.max(0,totalMRP-totalDiscount+CONVENIENCE_FEES-couponDiscount);

summary.innerHTML=`
<div class="coupon-box">
<input class="coupon-input" placeholder="Try VIRAT18" value="${couponDiscount>0?COUPON_CODE:''}">
<button onclick="applyCoupon()">APPLY</button>
</div>

${couponDiscount>0?`
<div class="applied-coupon">
<span>${COUPON_CODE} applied</span>
<button onclick="removeCoupon()">Remove</button>
</div>`:''}

<div class="bag-details-container">
<div class="price-header">PRICE DETAILS (${bagItemObjects.length} Items)</div>
${priceRow('Total MRP',totalMRP)}
${priceRow('Discount on MRP',-totalDiscount,true)}
${priceRow('Convenience Fee',CONVENIENCE_FEES)}
<div class="price-item"><span>Shipping Fee</span><span class="price-item-value priceDetail-base-discount">FREE</span></div>
${priceRow('Coupon Discount',-couponDiscount,true)}
<div class="price-footer"><span>Total Amount</span><span class="price-item-value">₹${finalPayment}</span></div>
</div>

<div class="saving-line">You saved ₹${totalDiscount+couponDiscount} on this order</div>
<button class="btn-place-order" onclick="placeOrder()">PLACE ORDER</button>
<button class="btn-clear-bag" onclick="clearBag()">CLEAR BAG</button>`;
}

function priceRow(name,value,green=false){
let sign=value<0?'-':'';
let amount=Math.abs(value);
let cls=green?' priceDetail-base-discount':'';
return `<div class="price-item"><span>${name}</span><span class="price-item-value${cls}">${sign}₹${amount}</span></div>`;
}

function applyCoupon(){
let input=document.querySelector('.coupon-input');
if(!input)return;

if(input.value.trim().toUpperCase()===COUPON_CODE){
couponDiscount=COUPON_DISCOUNT;
localStorage.setItem('couponDiscount',couponDiscount);
showToast('Coupon applied');
}else{
couponDiscount=0;
localStorage.removeItem('couponDiscount');
showToast('Invalid coupon');
}

displayBagSummary();
}

function removeCoupon(){
couponDiscount=0;
localStorage.removeItem('couponDiscount');
displayBagSummary();
showToast('Coupon removed');
}

function removeFromBag(itemId){
bagItems=bagItems.filter(id=>id!=itemId);
localStorage.setItem('bagItems',JSON.stringify(bagItems));
refreshBag('Removed from Bag');
}

function clearBag(){
if(bagItems.length===0)return;
bagItems=[];
couponDiscount=0;
localStorage.setItem('bagItems',JSON.stringify(bagItems));
localStorage.removeItem('couponDiscount');
refreshBag('Bag cleared');
}

function placeOrder(){
if(bagItems.length===0){
showToast('Your bag is empty');
return;
}
showToast('Order placed successfully');
setTimeout(clearBag,900);
}

function refreshBag(message){
loadBagItemObjects();
displayBagIcon();
displayBagItems();
displayBagSummary();
showToast(message);
}

function generateItemHTML(item){
return `<div class="bag-item-container">
<div class="item-left-part">
<img class="bag-item-img" src="../${item.image}" alt="${item.item_name}">
</div>
<div class="item-right-part">
<div class="company">${item.company}</div>
<div class="item-name">${item.item_name}</div>
<div class="price-container">
<span class="current-price">₹${item.current_price}</span>
<span class="original-price">₹${item.original_price}</span>
<span class="discount-percentage">(${item.discount_percentage}% OFF)</span>
</div>
<div class="return-period"><span class="return-period-days">${item.return_period} days</span> return available</div>
<div class="delivery-details">Delivery by <span class="delivery-details-days">${item.delivery_date}</span></div>
<div class="stock">${item.stock}</div>
</div>
<div class="remove-from-cart" onclick="removeFromBag('${item.id}')">×</div>
</div>`;
}