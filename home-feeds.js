(() => {
  const catalog = document.querySelector('[data-products-module]');
  const products = window.NIPOSOM_PRODUCTS || [];
  if (!catalog || !products.length) return;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const root = document.createElement('div');
  root.className = 'home-product-feeds';
  catalog.before(root);
  document.body.classList.add('has-home-feeds');
  const favorites = new Set();
  function syncSelections() {
    root.querySelectorAll('[data-feed-favorite]').forEach(b=>{const on=favorites.has(b.dataset.feedFavorite);b.setAttribute('aria-pressed',String(on));b.textContent=on?'♥':'♡';});

  }
  function card(product, feed) {
    const el = document.createElement('article');
    el.className = 'feed-product';
    const url = esc(productPageUrl(product));
    el.innerHTML = `<div class="feed-brand">${esc(product.brand)}<span class="feed-stock">Sob consulta</span></div>
      <div class="feed-media"><span class="feed-badge">${feed==='news'?'★ NOVO':'↘ CHEGOU'}</span><a href="${url}" aria-label="${esc(product.title)}"><img src="${esc(product.image)}" alt="" loading="lazy"></a><button class="feed-favorite" type="button" aria-label="Guardar ${esc(product.sku)} nos favoritos" aria-pressed="false" data-feed-favorite="${esc(product.sku)}">♡</button><button class="feed-compare" type="button" aria-pressed="false" data-feed-compare="${esc(product.sku)}">⇆ Comparar</button></div>
      <h6 class="feed-description"><a href="${url}">${esc(product.title)}</a></h6>
      <div class="feed-ref"><span>Ref.</span> ${esc(productInternalRef(product))}</div><div class="feed-sku"><span>SKU</span> ${esc(product.sku)}</div>
      <div class="feed-model"><span>Modelo</span> ${esc(productModel(product))}<small><span>EAN</span> ${esc(product.ean)}</small></div>
      <div class="feed-price">${esc(product.price || 'Sob consulta')} ${product.price?'<small>c/ IVA</small>':''}</div>
      <div class="feed-category">${esc(product.category)}</div><div class="feed-buy"></div>`;
    const purchase=createProductPurchaseControls(product);
    purchase.querySelector('.product-add').textContent='ADD';
    el.querySelector('.feed-buy').append(purchase);
    el.querySelector('[data-feed-favorite]').addEventListener('click',()=>{favorites.has(product.sku)?favorites.delete(product.sku):favorites.add(product.sku);syncSelections();});
    return el;
  }
  const half = Math.ceil(products.length/2);
  [['news','Novidades','grid',products.slice(half)],['arrivals','Acabados de Chegar','list',products.slice(0,half)]].forEach(([key,title,initial,source])=>{
    const state={view:initial,category:'Todos',limit:key==='news'?8:10,period:2};
    const section=document.createElement('section');section.className='home-feed';section.id=`home-${key}`;section.setAttribute('aria-labelledby',`${key}-title`);
    section.innerHTML=`<div class="home-feed-toolbar"><h2 id="${key}-title">${title}</h2><div class="feed-views" aria-label="Visualização de ${title}"><button type="button" data-feed-view="list" aria-label="${title}: ver em lista"><span class="list-view-icon" aria-hidden="true"></span></button><button type="button" data-feed-view="grid" aria-label="${title}: ver em mosaico"><span class="grid-view-icon" aria-hidden="true"></span></button></div><div class="feed-departments" aria-label="Categorias de ${title}">${['Todos','Hardware','PC','Servidores','Periféricos','Redes','Electrónica'].map(c=>`<button type="button" data-feed-category="${c}">${c}</button>`).join('')}</div><select aria-label="Período de ${title}"><option value="2">2 dias</option><option value="7">1 semana</option><option value="28">4 semanas</option></select><button class="feed-export" type="button" aria-label="Exportar ${title} para Excel (CSV)" title="Excel — descarregar CSV"><svg viewBox="0 0 24 28" aria-hidden="true"><path d="M5 1h10l6 6v20H5zM15 1v7h6"/><rect x="1" y="11" width="13" height="12" rx="1"/><path d="m5 14 5 6m0-6-5 6M16 12h3m-3 4h3m-3 4h3"/></svg></button><button class="feed-pdf" type="button" aria-label="Exportar ${title} em PDF" title="PDF — imprimir ou guardar"><svg viewBox="0 0 24 28" aria-hidden="true"><path d="M5 1h10l6 6v20H5zM15 1v7h6"/><rect x="1" y="12" width="22" height="11" rx="1"/><text x="12" y="20" text-anchor="middle">PDF</text></svg></button><button class="feed-collapse" type="button" aria-expanded="true" aria-controls="${key}-content" aria-label="Recolher ${title}">⌃</button></div><div class="home-feed-content" id="${key}-content"><div class="feed-list-heading"><span>Img</span><span>Marca / disponibilidade</span><span>Ref.</span><span>SKU</span><span>Modelo / EAN</span><span>Descrição</span><span>Preço</span><span>Quantidade / Ações</span></div><div class="home-feed-products"></div><div class="feed-bottom"><small class="feed-result-count"></small><button type="button" class="feed-more">Ver mais produtos</button></div></div>`;
    root.append(section);
    const periodSelect = section.querySelector('select');
    if (!source.some(p => p.publishedAt || p.date)) {
      periodSelect.disabled = true;
      periodSelect.title = 'Filtro por período disponível quando forem carregadas as datas dos produtos.';
    }
    function filtered(){return source.filter(p=>state.category==='Todos'||productDepartment(p)===state.category).filter(p=>{const date=p.publishedAt||p.date;return !date||Date.now()-new Date(date).getTime()<=state.period*86400000;});}
    function render(){
      const result=filtered();section.dataset.view=state.view;
      section.querySelectorAll('[data-feed-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.feedView===state.view)));
      section.querySelectorAll('[data-feed-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.feedCategory===state.category)));
      const grid=section.querySelector('.home-feed-products');grid.replaceChildren(...result.slice(0,state.limit).map(p=>card(p,key)));
      if(!result.length)grid.innerHTML='<p class="feed-empty">Ainda não existem produtos carregados nesta categoria.</p>';
      section.querySelector('.feed-result-count').textContent=`${Math.min(state.limit,result.length)} de ${result.length} produtos`;
      section.querySelector('.feed-more').hidden=state.limit>=result.length;
      syncSelections();
    }
    section.querySelectorAll('[data-feed-view]').forEach(b=>b.addEventListener('click',()=>{state.view=b.dataset.feedView;render();}));
    section.querySelectorAll('[data-feed-category]').forEach(b=>b.addEventListener('click',()=>{state.category=b.dataset.feedCategory;render();}));
    section.querySelector('select').addEventListener('change',e=>{state.period=Number(e.target.value);render();});
    section.querySelector('.feed-more').addEventListener('click',()=>{state.limit+=key==='news'?8:10;render();});
    section.querySelector('.feed-collapse').addEventListener('click',e=>{const content=section.querySelector('.home-feed-content');content.hidden=!content.hidden;e.currentTarget.setAttribute('aria-expanded',String(!content.hidden));e.currentTarget.textContent=content.hidden?'⌄':'⌃';});
    section.querySelector('.feed-pdf').addEventListener('click',()=>{
      const frame=document.createElement('iframe');
      frame.title=`Imprimir ${title}`;
      frame.style.cssText='position:fixed;width:0;height:0;border:0;';
      frame.onload=()=>{
        frame.contentWindow.addEventListener('afterprint',()=>frame.remove(),{once:true});
        frame.contentWindow.focus();
        frame.contentWindow.print();
      };
      frame.srcdoc=`<!doctype html><html lang="pt"><head><title>Niposom — ${title}</title><style>@page{size:A4 landscape;margin:12mm}body{font:11px Arial;color:#172d44}h1{color:#e50015;font-size:22px}table{border-collapse:collapse;width:100%}th,td{padding:7px;border:1px solid #ccd5dd;text-align:left;overflow-wrap:anywhere}th{background:#edf2f7}tr{break-inside:avoid}thead{display:table-header-group}</style></head><body><h1>Niposom — ${title}</h1><p>${esc(state.category)} · ${filtered().length} produtos</p><table><thead><tr>${['Marca','Ref.','SKU','Modelo','EAN','Descrição','Preço'].map(v=>`<th>${v}</th>`).join('')}</tr></thead><tbody>${filtered().map(p=>`<tr>${[p.brand,productInternalRef(p),p.sku,productModel(p),p.ean,p.title,p.price].map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></body></html>`;
      document.body.append(frame);
    });
    section.querySelector('.feed-export').addEventListener('click',()=>{
      const rows=[['Marca','Ref.','SKU','Modelo','EAN','Descrição','Preço'],...filtered().map(p=>[p.brand,productInternalRef(p),p.sku,productModel(p),p.ean,p.title,p.price])];
      const csv='\ufeff'+rows.map(row=>row.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(';')).join('\r\n');
      const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`niposom-${key}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    });render();
  });
  function revealCatalog(){document.body.classList.add('is-catalog-search');}
  document.querySelectorAll('form[role="search"]').forEach(f=>f.addEventListener('submit',revealCatalog,true));
  document.addEventListener('click',e=>{
    const a=e.target.closest('a');
    if(a && !root.contains(a) && (a.hash==='#produtos'||a.closest('.explore-families')))revealCatalog();
  },true);
  if(location.hash==='#produtos')revealCatalog();
})();
