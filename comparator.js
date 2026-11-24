(() => {
 const products=window.NIPOSOM_PRODUCTS||[];
 const bySku=new Map(products.map(p=>[p.sku,p]));
 let selected=[];
 try { const saved=JSON.parse(sessionStorage.getItem('niposom-compare')||'[]');if(Array.isArray(saved))selected=[...new Set(saved)].filter(s=>bySku.has(s)).slice(0,4); }catch{}
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const tray=document.createElement('aside');tray.className='compare-tray';tray.setAttribute('aria-label','Comparador de produtos');
 const launcher=document.createElement('button');launcher.type='button';launcher.className='compare-launcher';launcher.setAttribute('aria-controls','compare-bottom');launcher.setAttribute('aria-expanded','false');
 tray.id='compare-bottom';tray.hidden=true;
 const status=document.createElement('div');status.className='compare-status';status.setAttribute('role','status');
 const dialog=document.createElement('dialog');dialog.className='compare-dialog';dialog.setAttribute('aria-label','Comparação de produtos');
 document.body.append(launcher,tray,status,dialog);
 let expanded=false;
 let messageTimer;
 function clearMessageLater(){ clearTimeout(messageTimer); messageTimer=setTimeout(()=>{status.textContent="";},4500); }
 function sync(){
  clearMessageLater();
  try{sessionStorage.setItem('niposom-compare',JSON.stringify(selected));}catch{}
  launcher.textContent=`⇆ Comparar (${selected.length}/4)`;
  launcher.setAttribute('aria-expanded',String(expanded));tray.hidden=!expanded;
  tray.innerHTML=`<div class="compare-heading"><strong>Comparador <small>${selected.length} de 4 produtos</small></strong><button type="button" data-compare-collapse aria-label="Recolher comparador">⌄</button></div><div class="compare-slots">${Array.from({length:4},(_,i)=>{const p=bySku.get(selected[i]);return p?`<div class="compare-slot"><img src="${esc(p.image)}" alt=""><span>${esc(p.title)}</span><button type="button" data-compare-remove="${esc(p.sku)}" aria-label="Remover ${esc(p.sku)} da comparação">×</button></div>`:'<div class="compare-slot compare-slot-empty">+ Selecionar produto</div>';}).join('')}</div><div class="compare-actions"><span>Selecione entre 2 e 4 produtos.</span><button type="button" data-compare-clear ${selected.length?'':'disabled'}>Limpar</button><button type="button" data-compare-open ${selected.length<2?'disabled':''}>Comparar produtos</button></div>`;
  document.querySelectorAll('[data-feed-compare]').forEach(b=>{const active=selected.includes(b.dataset.feedCompare);b.setAttribute('aria-pressed',String(active));b.textContent=active?'✓ Na comparação':'⇆ Comparar';});
 }
 function toggle(sku){if(!bySku.has(sku))return;if(selected.includes(sku)){selected=selected.filter(s=>s!==sku);status.textContent='Produto removido da comparação.';}else if(selected.length===4){status.textContent='Pode comparar até 4 produtos. Remova um para adicionar outro.';expanded=true;sync();return;}else{selected.push(sku);status.textContent='Produto adicionado à comparação.';}expanded=true;sync();}
 launcher.addEventListener('click',()=>{expanded=!expanded;sync();});
 tray.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-compare-collapse')){expanded=false;sync();launcher.focus();}if(b.hasAttribute('data-compare-remove'))toggle(b.dataset.compareRemove);if(b.hasAttribute('data-compare-clear')){selected=[];sync();}if(b.hasAttribute('data-compare-open'))showComparison();});
 document.addEventListener('click',e=>{const b=e.target.closest('[data-feed-compare]');if(b){e.preventDefault();toggle(b.dataset.feedCompare);}});
 function showComparison(){
  const ps=selected.map(s=>bySku.get(s));
  const fields=[['Marca',p=>p.brand],['Referência',productInternalRef],['SKU',p=>p.sku],['Modelo',productModel],['EAN',p=>p.ean],['Categoria',p=>p.category],['Preço',p=>p.price]];
  dialog.innerHTML=`<div class="compare-heading"><h2>Comparar produtos</h2><button type="button" data-close aria-label="Fechar comparação">×</button></div><div class="compare-table-wrap"><table><thead><tr><th scope="col">Produto</th>${ps.map(p=>`<th scope="col"><img src="${esc(p.image)}" alt=""><a href="${esc(productPageUrl(p))}">${esc(p.title)}</a></th>`).join('')}</tr></thead><tbody>${fields.map(([label,read])=>`<tr><th scope="row">${label}</th>${ps.map(p=>`<td>${esc(read(p))||'—'}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());dialog.showModal();
 }
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
 function attach(){
  document.querySelectorAll('.product-card,.product-row').forEach(card=>{
   if(card.querySelector('[data-feed-compare]'))return;
   const link=card.querySelector('a[href*="product="]');if(!link)return;
   const id=new URL(link.href).searchParams.get('product');const p=products.find(p=>productInternalRef(p)===id);if(!p)return;
   const b=document.createElement('button');b.type='button';b.className='catalog-compare-button';b.dataset.feedCompare=p.sku;b.textContent='⇆ Comparar';b.setAttribute('aria-pressed',String(selected.includes(p.sku)));
   (card.querySelector('.product-body')||card.querySelector('.product-row-title')||card).append(b);
  });
  document.querySelectorAll('[data-feed-compare]').forEach(b=>{const value=String(selected.includes(b.dataset.feedCompare));if(b.getAttribute('aria-pressed')!==value)b.setAttribute('aria-pressed',value);});
 }
 const observer=new MutationObserver(attach);observer.observe(document.querySelector('main'),{childList:true,subtree:true});attach();sync();
})();
