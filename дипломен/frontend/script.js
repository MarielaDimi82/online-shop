const products = [
  {id:1,name:'Sweet Pink Bouquet',price:34.00,colors:['pink','white'],type:'roses',category:'wedding'},
  {id:2,name:'Violet Dream',price:42.00,colors:['violet','pink'],type:'mixed',category:'romantic'},
  {id:3,name:'Blush & Lace',price:29.50,colors:['pink','peach'],type:'peonies',category:'special'},
  {id:4,name:'Lilac Breeze',price:38.00,colors:['violet','white'],type:'tulips',category:'wedding'},
  {id:5,name:'Moonlight Bouquet',price:49.00,colors:['white','pastel'],type:'roses',category:'special'},
  {id:6,name:'Pastel Box',price:27.00,colors:['pastel','pink'],type:'mixed',category:'custom'}
];

const cart = [];

function fmt(v){return '€'+v.toFixed(2)}

function renderProducts(list){
  const grid = document.getElementById('productGrid');
  if(!grid) return;
  grid.innerHTML = '';
  (list||[]).forEach(p=>{
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `
      <div class="card-img-placeholder"></div>
      <h4>${p.name}</h4>
      <div style="color:#8b5cf6;font-size:13px;margin-bottom:6px">${p.type}</div>
      <div class="price-row">
        <div class="price">${fmt(p.price)}</div>
        <button class="add-btn" data-id="${p.id}">Add</button>
      </div>`;
    grid.appendChild(card);
  });
}

function getUnique(field){
  const set = new Set();
  products.forEach(p=>{
    if(Array.isArray(p[field])) p[field].forEach(v=>set.add(v));
    else if(p[field]) set.add(p[field]);
  });
  return Array.from(set).sort();
}

function populateFilterOptions(){
  const colorSelect = document.getElementById('filterColor');
  const typeSelect = document.getElementById('filterType');
  if(colorSelect){
    const colors = getUnique('colors');
    colors.forEach(c=>{
      const opt = document.createElement('option'); opt.value=c; opt.textContent = c[0].toUpperCase()+c.slice(1);
      colorSelect.appendChild(opt);
    });
  }
  if(typeSelect){
    const types = getUnique('type');
    types.forEach(t=>{
      const opt = document.createElement('option'); opt.value=t; opt.textContent = t[0].toUpperCase()+t.slice(1);
      typeSelect.appendChild(opt);
    });
  }
}

function applyFilters(){
  const color = document.getElementById('filterColor')?.value || 'any';
  const type = document.getElementById('filterType')?.value || 'any';
  const min = parseFloat(document.getElementById('priceMin')?.value || '') || 0;
  const maxRaw = document.getElementById('priceMax')?.value || '';
  const max = maxRaw === '' ? Number.POSITIVE_INFINITY : parseFloat(maxRaw);
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category') || 'all';
  const out = products.filter(p=>{
    if(category!=='all' && p.category !== category) return false;
    if(color!=='any' && !(p.colors||[]).includes(color)) return false;
    if(type!=='any' && p.type !== type) return false;
    if(p.price < min) return false;
    if(p.price > max) return false;
    return true;
  });
  renderProducts(out);
}

function resetFilters(){
  const colorSelect = document.getElementById('filterColor'); if(colorSelect) colorSelect.value='any';
  const typeSelect = document.getElementById('filterType'); if(typeSelect) typeSelect.value='any';
  const min = document.getElementById('priceMin'); if(min) min.value='';
  const max = document.getElementById('priceMax'); if(max) max.value='';
  applyFilters();
}

function updateCartCount(){
  const cnt = cart.reduce((s,i)=>s+i.qty,0);
  document.getElementById('cartBtn').textContent = `Cart (${cnt})`;
}

function openCart(){
  const modal = document.getElementById('cartModal'); modal.setAttribute('aria-hidden','false');
  renderCart();
}

function closeCart(){
  const modal = document.getElementById('cartModal'); modal.setAttribute('aria-hidden','true');
}

function renderCart(){
  const list = document.getElementById('cartList'); list.innerHTML='';
  let total=0;
  cart.forEach(item=>{
    const li = document.createElement('li');
    li.innerHTML = `<div style="width:48px;height:48px;background:#f0edf7;border-radius:8px;flex-shrink:0"></div><div style="flex:1"><strong>${item.name}</strong><div style="color:#666">${fmt(item.price)} × ${item.qty}</div></div><div style="margin-left:8px">${fmt(item.price*item.qty)}</div>`;
    list.appendChild(li);
    total += item.price*item.qty;
  });
  document.getElementById('cartTotal').textContent = fmt(total);
}

function addToCart(id){
  const p = products.find(x=>x.id===+id); if(!p) return;
  const found = cart.find(i=>i.id===p.id);
  if(found) found.qty++;
  else cart.push({id:p.id,name:p.name,price:p.price,qty:1});
  updateCartCount();
}

document.addEventListener('click',e=>{
  if(e.target.matches('.add-btn')) addToCart(e.target.dataset.id);
  if(e.target.id==='cartBtn') openCart();
  if(e.target.id==='closeCart') closeCart();
  if(e.target.id==='checkout'){
    if(cart.length===0){
      alert('Your cart is empty');
      return;
    }
    window.location.href='checkout.html';
  }
});

document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('year').textContent = new Date().getFullYear();
  updateCartCount();
  if(document.getElementById('productGrid')){
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'all';
    const categoryDisplay = {all:'All Bouquets',wedding:'Wedding Bouquets',special:'Special Occasions',custom:'Create Your Own',romantic:'Romantic'};
    const title = document.querySelector('.section-title');
    if(title && category !== 'all'){
      title.textContent = `Shop — ${categoryDisplay[category] || 'Bouquets'}`;
    }
    populateFilterOptions();
    applyFilters();
    document.getElementById('applyFilters')?.addEventListener('click',applyFilters);
    document.getElementById('resetFilters')?.addEventListener('click',resetFilters);
  }
});
