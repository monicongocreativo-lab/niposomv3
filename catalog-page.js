(() => {
  const params=new URLSearchParams(location.search);
  if(params.get('catalog')!=='motherboards')return;
  document.documentElement.classList.add('catalog-page-route');
  document.body.classList.add('is-catalog-search');
  document.body.classList.toggle('catalog-client',params.get('client')==='1');
  document.title='Motherboards | Catálogo Niposom';
  const module=document.querySelector('[data-products-module]');
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const source=(window.NIPOSOM_PRODUCTS||[]).filter(p=>p.category==='Motherboards');
  const state={page:1,size:20,sort:'default',chip:'',stock:'',tech:{},image:'large',description:'long'};
  let result=[];
  const bar=module.querySelector('.catalog-feed-bar');bar.classList.add('catalog-old-bar');
  const controls=document.createElement('div');controls.className='catalog-display-controls';
  controls.innerHTML=`<fieldset><legend>Imagem:</legend>${[['none','Sem'],['small','Pequena'],['large','Grande']].map(([v,l])=>`<label><input type="radio" name="catalog-image" value="${v}" ${v==='large'?'checked':''}>${l}</label>`).join('')}</fieldset><fieldset><legend>Descrição:</legend><label><input type="radio" name="catalog-description" value="short">Curta</label><label><input type="radio" name="catalog-description" value="long" checked>Longa</label></fieldset><label>Artigos por página: <select data-page-size><option>20</option><option>10</option><option>40</option></select></label><span class="catalog-range" aria-live="polite"></span><button type="button" class="catalog-settings" aria-label="Mostrar opções de ordenação" aria-controls="catalog-order-options" aria-expanded="false">⚙</button><button type="button" class="catalog-download-excel" aria-label="Exportar catálogo para Excel (CSV)"></button><button type="button" class="catalog-download-pdf" aria-label="Imprimir catálogo ou guardar em PDF"></button>`;
  bar.before(controls);
  const order=document.createElement('div');order.id='catalog-order-options';order.hidden=true;order.innerHTML=`<span>Ordenar por:</span>${[['default','Default'],['brand','Marca'],['model','Modelo'],['ref','Ref'],['price-asc','Preço'],['recent','Recentes']].map(([v,l])=>`<label><input type="radio" name="catalog-order" value="${v}" ${v==='default'?'checked':''}>${l}</label>`).join('')}`;controls.after(order);
  const guide=module.querySelector('[data-catalog-guide]');guide.innerHTML='<a href="./index.html">Início</a> / <a href="./index.html?catalog=motherboards">Catálogo</a> / <span>Informática</span> / <strong>Motherboards</strong>';
  const chips=document.createElement('nav');chips.className='catalog-family-chips';chips.setAttribute('aria-label','Tipos de motherboards');
  const chipNames=['LGA2066 & LGA2011','LGA1200 11 / 10 Geração','LGA1151 9 / 8 Geração','LGA1151 7 / 6 Geração','LGA1150','Lga1156 & Lga1155','LGA775','com CPU Integrado','Servidor','AM4','Am3 / 939 / 462','Manutenção','Socket 478','Socket Am1','Socket Fm2','Diversas','LGA1700 14 / 13 / 12 Geração','LGA1851','AM5'];
  chips.innerHTML=chipNames.map(n=>`<button type="button" aria-pressed="false">${esc(n)}</button>`).join('');guide.after(chips);
  const sidebar=module.querySelector('.catalog-sidebar');
  ['family','type','brand'].forEach(key=>sidebar.append(sidebar.querySelector(`[data-catalog-options="${key}"]`).closest('details')));
  const stock=document.createElement('details');stock.className='catalog-filter-group';stock.open=true;stock.innerHTML='<summary>Disponibilidade</summary><div class="catalog-stock-options">'+[['','Todos'],['in','Em stock'],['last','Últimas unidades'],['out','Sem stock']].map(([v,l])=>`<label><input type="radio" name="catalog-stock" value="${v}" ${v===''?'checked':''}>${l}</label>`).join('')+'</div>';sidebar.insertBefore(stock,sidebar.querySelector('[data-catalog-options="brand"]').closest('details'));
  const tech=module.querySelector('[data-catalog-top-filters]');tech.classList.add('catalog-old-tech');
  const customTech=document.createElement('div');customTech.className='catalog-technical-fields';
  const fields=[['cpu','Processador',['Intel','AMD']],['memory','Tipo de Memória',['DDR4','DDR5']],['disk','Disco Rígido',['SSD','HDD']],['chipset','Chipset',['H610','B760','Z890']],['video','Placa Gráfica de Vídeo',['HDMI','VGA','DisplayPort']],['slots','Slots',['PCI4.0','PCIE4.0','PCIE5.0']],['interface','Interface Disco',['M.2','SATA','NVMe']]];
  customTech.innerHTML=fields.map(([id,label,values])=>`<label class="sr-only" for="tech-${id}">${label}</label><select id="tech-${id}" data-tech="${id}" aria-label="${label}"><option value="">${label} (Todos)</option>${values.map(v=>`<option>${v}</option>`).join('')}</select>`).join('')+'<button type="button" class="catalog-tech-close">Fechar</button>';
  tech.after(customTech);
  const pagination=document.createElement('nav');pagination.className='catalog-pagination';pagination.setAttribute('aria-label','Páginas do catálogo');productsGrid.after(pagination);
  function chipMatch(p){if(!state.chip)return true;const t=p.title.toUpperCase();if(state.chip.startsWith('LGA1700'))return /H610|B760|Z790/.test(t);if(state.chip==='com CPU Integrado')return /1215U|1235U/.test(t);return t.includes(state.chip.split(' ')[0].toUpperCase());}
  function filtered(){const query=productsSearchInput.value.trim().toLowerCase();return source.filter(p=>matchesCatalogSearch(p,query)&&matchesCatalogSidebarFilters(p)&&chipMatch(p)&&Object.values(state.tech).every(v=>!v||p.title.toUpperCase().includes(v.toUpperCase()))&&(!state.stock||(state.stock==='in'?p.stock>0:state.stock==='last'?p.stock>0&&p.stock<=3:p.stock===0)));}
  function render(){
    result=filtered();const sorts={brand:p=>p.brand,model:p=>productModel(p),ref:p=>productInternalRef(p)};
    if(sorts[state.sort])result.sort((a,b)=>String(sorts[state.sort](a)).localeCompare(String(sorts[state.sort](b)),'pt',{numeric:true}));
    if(state.sort==='price-asc'||state.sort==='price-desc')result.sort((a,b)=>(productPriceNumber(a)-productPriceNumber(b))*(state.sort==='price-desc'?-1:1));
    const pages=Math.max(1,Math.ceil(result.length/state.size));state.page=Math.min(state.page,pages);const start=(state.page-1)*state.size;
    productsGrid.replaceChildren();productsGrid.classList.remove('is-list-view');productsGrid.classList.add('is-grid-view');renderCatalogProductsGrid(result.slice(start,start+state.size));
    if(!result.length)productsGrid.innerHTML='<p class="products-empty">Sem produtos para estes filtros.</p>';
    module.dataset.image=state.image;module.dataset.description=state.description;
    controls.querySelector('.catalog-range').textContent=`Artigos ${result.length?start+1:0} - ${Math.min(start+state.size,result.length)} de ${result.length}`;
    catalogResultsCount.textContent=`${result.length} produtos`;
    pagination.replaceChildren();for(let i=1;i<=pages;i++){const b=document.createElement('button');b.type='button';b.textContent=i;if(i===state.page)b.setAttribute('aria-current','page');b.addEventListener('click',()=>{state.page=i;render();module.scrollIntoView();});pagination.append(b);}
  }
  window.catalogPage={render};
  controls.addEventListener('change',e=>{if(e.target.name==='catalog-image')state.image=e.target.value;if(e.target.name==='catalog-description')state.description=e.target.value;if(e.target.matches('[data-page-size]')){state.size=Number(e.target.value);state.page=1;}render();});
  controls.querySelector('.catalog-settings').addEventListener('click',e=>{order.hidden=!order.hidden;e.currentTarget.setAttribute('aria-expanded',String(!order.hidden));});
  order.addEventListener('change',e=>{state.sort=e.target.value;render();});
  module.querySelector('[data-catalog-sort]').addEventListener('change',e=>{state.sort=e.target.value;render();});
  chips.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{state.chip=state.chip===b.textContent?'':b.textContent;state.page=1;chips.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x.textContent===state.chip)));render();}));
  stock.addEventListener('change',e=>{state.stock=e.target.value;state.page=1;render();});
  customTech.addEventListener('change',e=>{state.tech[e.target.dataset.tech]=e.target.value;state.page=1;render();});
  customTech.querySelector('button').addEventListener('click',()=>setCatalogTopFiltersCollapsed(true));
  sidebar.querySelector('[data-catalog-clear]').addEventListener('click',()=>{state.stock='';state.tech={};state.chip='';state.page=1;stock.querySelector('input').checked=true;customTech.querySelectorAll('select').forEach(s=>s.value='');chips.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed','false'));render();});
  // Reuse the same document icons as the home sections.
  controls.querySelector('.catalog-download-excel').innerHTML=document.querySelector('.feed-export')?.innerHTML||'Excel';
  controls.querySelector('.catalog-download-pdf').innerHTML=document.querySelector('.feed-pdf')?.innerHTML||'PDF';
  const rows=()=>[['Marca','Ref.','SKU','Modelo','EAN','Descrição','Preço'],...result.map(p=>[p.brand,productInternalRef(p),p.sku,productModel(p),p.ean,p.title,p.price])];
  controls.querySelector('.catalog-download-excel').addEventListener('click',()=>{const csv='\ufeff'+rows().map(r=>r.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(';')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='niposom-motherboards.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  controls.querySelector('.catalog-download-pdf').addEventListener('click',()=>{const frame=document.createElement('iframe');frame.style.cssText='position:fixed;width:0;height:0;border:0';frame.title='Imprimir catálogo';frame.onload=()=>{frame.contentWindow.addEventListener('afterprint',()=>frame.remove(),{once:true});frame.contentWindow.print();};frame.srcdoc=`<html><head><title>Catálogo Motherboards</title><style>@page{size:A4 landscape;margin:12mm}body{font:10px Arial}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:6px}tr{break-inside:avoid}</style></head><body><h1>Motherboards — Niposom</h1><table>${rows().map((r,i)=>`<tr>${r.map(v=>`<${i?'td':'th'}>${esc(v)}</${i?'td':'th'}>`).join('')}</tr>`).join('')}</table></body></html>`;document.body.append(frame);});
  setCatalogTopFiltersCollapsed(true);render();
})();
