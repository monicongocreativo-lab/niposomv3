(() => {
  const nav = document.querySelector('[data-corporate-nav]');
  const row = nav.querySelector('.category-inner');
  const career = row.querySelector('a');
  career.textContent = 'Carreiras';
  const ai = row.lastElementChild;
  row.insertBefore(career, ai);
  const trigger = document.createElement('button');
  trigger.className = 'explore-trigger';
  trigger.type = 'button';
  trigger.innerHTML = '<span class="explore-grid-icon" aria-hidden="true">' + '<i></i>'.repeat(9) + '</span> Explorar produtos';
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', 'category-explorer');
  row.prepend(trigger);
  const panel = document.createElement('div');
  panel.id = 'category-explorer';
  panel.className = 'category-explorer';
  panel.hidden = true;
  panel.innerHTML = '<section class="explore-categories"><h2>Produtos</h2><div></div></section><section class="explore-families"><h2></h2><div></div></section><section class="explore-features"><h2></h2><div></div></section>';
  nav.append(panel);
  const items = [...document.querySelectorAll('[data-category-nav] > .category-inner > [data-mega-item]')];
  const paths = [
 '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4"/>',
 '<rect x="4" y="4" width="16" height="12" rx="1"/><path d="M2 20h20M8 16l-1 4m9-4 1 4"/>',
 '<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M6 6h1m3 0h8M6 17h1m3 0h8"/>',
 '<path d="M4 14v-3a8 8 0 0 1 16 0v3"/><rect x="2" y="12" width="5" height="9" rx="2"/><rect x="17" y="12" width="5" height="9" rx="2"/>',
 '<path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0m-11 4a6 6 0 0 1 8 0"/><circle cx="12" cy="20" r="1"/>',
 '<rect x="6" y="4" width="12" height="16" rx="2"/><path d="M2 7h4m-4 5h4m-4 5h4m12-10h4m-4 5h4m-4 5h4"/>',
 '<rect x="3" y="3" width="18" height="15" rx="2"/><path d="m5 11 4-4 3 7 3-5 4 2M8 22h8m-4-4v4"/>',
 '<path d="m4 20 3-6L17 4l3 3L10 17l-6 3ZM15 6l3 3M2 22l2-2"/>'
 ];
 const iconMarkup = index => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[index]}</svg>`;
  function choose(index) {
    const item = items[index];
    const name = item.querySelector('[data-mega-button]').textContent.trim();
    panel.querySelectorAll('[data-explore-index]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.exploreIndex) === index)));
    panel.querySelector('.explore-families h2').textContent = name;
    panel.querySelector('.explore-features h2').textContent = `Destaques em ${name}`;
    const families = panel.querySelector('.explore-families > div');
    families.replaceChildren();
    const headings = [...item.querySelectorAll('.mega-grid h2')];
    headings.forEach(heading => {
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = heading.textContent;
      details.append(summary);
      const viewAll = document.createElement('a');
      viewAll.href = './index.html#produtos';
      viewAll.className = 'explore-view-all';
      viewAll.textContent = `Ver tudo em ${heading.textContent.trim()}`;
      viewAll.addEventListener('click', event => {
        event.preventDefault();
        if (/motherboards|placas.mãe/i.test(heading.textContent)) { location.href='./index.html?catalog=motherboards'; return; }
        setOpen(false);
        document.documentElement.classList.remove('product-page-route');
        const page = document.querySelector('.product-detail');
        if (page) page.hidden = true;
        history.replaceState(null, '', './index.html#produtos');
        productsSearchInput.value = '';
        Object.values(activeCatalogFilters).forEach(values => values.clear());
        activeCatalogFilters.family.add(cleanCatalogTaxonomyText(heading.textContent));
        setActiveProductsFilter('Todos'); buildCatalogSidebarFilters(); renderCatalogProducts();
        document.querySelector('#produtos').scrollIntoView();
      });
      details.append(viewAll);
      let sibling = heading.nextElementSibling;
      while (sibling && !sibling.matches('h2')) {
        if(sibling.matches('a')) {
          const link = sibling.cloneNode(true);
          link.addEventListener('click', e => { e.preventDefault(); setOpen(false); document.documentElement.classList.remove('product-page-route'); const page=document.querySelector('.product-detail'); if(page) page.hidden=true; history.replaceState(null,'','./index.html#produtos'); productsSearchInput.value=link.textContent.trim(); setActiveProductsFilter('Todos'); renderCatalogProducts(); document.querySelector('#produtos').scrollIntoView(); });
          details.append(link);
        }
        sibling = sibling.nextElementSibling;
      }
      families.append(details);
    });
    const features = panel.querySelector('.explore-features > div');
    features.replaceChildren();
    headings.slice(0,3).forEach((heading,i) => {
      const button = document.createElement('button');
      button.type='button';
      const icon = document.createElement('span'); icon.className='feature-icon'; icon.innerHTML=iconMarkup(index);
      const label=document.createElement('span'); label.textContent=heading.textContent;
      const small=document.createElement('small'); small.textContent='Explorar produtos →';label.append(small);
      button.append(icon,label);
      button.addEventListener('click',()=>{const d=families.children[i]; d.open=!d.open;d.scrollIntoView({block:'nearest'});});
      features.append(button);
    });
  }
  items.forEach((item,index)=>{
    const button=document.createElement('button'); button.type='button'; button.dataset.exploreIndex=index;
    const icon=document.createElement('span');icon.innerHTML=iconMarkup(index);icon.setAttribute('aria-hidden','true');
    const label=document.createElement('span');label.textContent=item.querySelector('[data-mega-button]').textContent.trim();
    button.append(icon,label);button.addEventListener('click',()=>choose(index));
    panel.querySelector('.explore-categories > div').append(button);
  });
  function setOpen(open) { panel.hidden=!open;nav.classList.toggle("is-exploring",open);trigger.setAttribute('aria-expanded',String(open)); if(open) closeMegaMenus(); }
  trigger.addEventListener('click',()=>setOpen(panel.hidden));
  document.addEventListener('click',e=>{if(!panel.contains(e.target)&&!trigger.contains(e.target))setOpen(false);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){setOpen(false);trigger.focus();}});
  window.matchMedia('(min-width:1041px)').addEventListener('change',()=>setOpen(false));
  choose(0);
})();
