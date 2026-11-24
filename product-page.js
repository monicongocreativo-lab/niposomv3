(() => {
  const id = new URLSearchParams(location.search).get('product');
  if (id === null) return;
  const main = document.querySelector('main');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const products = window.NIPOSOM_PRODUCTS || [];
  const product = products.find(p => productInternalRef(p) === id);
  const page = document.createElement('section');
  page.className = 'product-detail';
  main.prepend(page);
  if (!product) {
    document.title = 'Produto não encontrado | Niposom';
    page.innerHTML = '<div class="detail-shell detail-empty"><p>CATÁLOGO NIPOSOM</p><h1>Produto não encontrado</h1><a href="./index.html#produtos">Voltar ao catálogo →</a></div>';
    return;
  }
  const verified = id === '40170';
  const photo = verified ? './assets/product-40170.jpg' : product.image;
  const title = verified ? 'Motherboard 1215U\nMini-ITX para AIO' : product.title;
  const specs = verified ? [
    ['Formato', 'Mini-ITX · 170 × 170 mm'],
    ['Memória', '2 × DDR4 SO-DIMM · até 64 GB'],
    ['Frequências de memória', '2666 / 2933 / 3200 MHz'],
    ['Armazenamento', '1 × M.2 2280 (SATA/NVMe) · 2 × SATA 3.0'],
    ['Saídas de vídeo', '1 × HDMI · 1 × VGA'],
    ['Rede', '1 × RJ45'],
    ['USB (tabela técnica)', '2 × USB 3.0 · 2 × USB 2.0'],
    ['Sistema operativo indicado', 'Windows 11 · Windows 10 64-bit'],
    ['Garantia indicada', '3 anos'],
    ['Modelo', '1215U ITX'], ['Referência', id], ['SKU', product.sku]
  ] : [['Marca', product.brand], ['Categoria', product.category], ['Modelo', productModel(product)], ['Referência', id], ['SKU', product.sku]];
  const highlights = verified ? [['MINI-ITX','170 × 170 mm'],['DDR4','Até 64 GB'],['M.2 + SATA','Armazenamento flexível']] : [[product.brand,'Marca'],[product.category,'Categoria'],[id,'Referência']];
  document.title = `${product.title} | Niposom`;
  page.innerHTML = `
    <div class="detail-shell">
      <nav class="detail-breadcrumb" aria-label="Navegação do produto"><a href="./index.html">Início</a><span>/</span><a href="./index.html#produtos">Produtos</a><span>/</span><span>${esc(product.category)}</span><span>/</span><strong>${esc(id)}</strong></nav>
      <div class="detail-layout">
        <div class="detail-gallery">
          <div class="detail-image-stage"><span class="detail-category-label">${esc(product.category)}</span><button class="detail-zoom" aria-label="Ampliar imagem do produto"><img src="${esc(photo)}" alt="${esc(product.title)}"><span>Ampliar imagem ↗</span></button></div>
          <div class="detail-highlights">${highlights.map(([a,b])=>`<div><strong>${esc(a)}</strong><span>${esc(b)}</span></div>`).join('')}</div>
        </div>
        <div class="detail-summary">
          <div class="detail-eyebrow"><span>${esc(product.brand)}</span><span>REF. ${esc(id)}</span></div>
          <h1>${esc(title).replace(/\n/g,'<br>')}</h1>
          <p class="detail-lead">${verified ? 'Uma base compacta para soluções All-in-One. Memória DDR4, armazenamento M.2 e SATA, e ligações HDMI e VGA num formato de 17 cm.' : esc(product.category)+' da '+esc(product.brand)+'. Consulte os dados do produto e escolha a quantidade para a sua encomenda.'}</p>
          <p class="detail-sku">SKU <strong>${esc(product.sku)}</strong></p>
          <div class="detail-buy-box"><span class="detail-price">${esc(product.price || 'Sob consulta')}</span><span class="detail-tax">${product.price ? 'IVA incluído' : ''}</span><p class="detail-availability"><span></span>Disponibilidade sob consulta</p><div data-detail-purchase></div><p class="detail-buy-note">Preço e disponibilidade sujeitos a confirmação comercial.</p></div>
          <a class="detail-help" href="mailto:comercial@niposom.com?subject=${encodeURIComponent('Informação sobre '+product.sku)}">Precisa de ajuda com este produto? <span>Fale connosco ↗</span></a>
        </div>
      </div>
      <dl class="detail-identifiers" aria-label="Identificação do produto">${[["Ref.", product.ref ?? id], ["SKU", product.sku], ["Modelo", productModel(product)], ["EAN", product.ean]].map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>
      <nav class="detail-section-nav" aria-label="Informação do produto"><a href="#visao-geral">Visão geral</a><a href="#especificacoes">Especificações</a><a href="#documentacao">Documentação</a></nav>
      <section class="detail-overview" id="visao-geral"><div><p class="detail-kicker">O PRODUTO EM DETALHE</p><h2>${verified ? 'Pequeno no formato.<br>Versátil nas ligações.' : 'Informação do produto'}</h2></div><div><p>${verified ? 'Concebida para integração em sistemas AIO, esta motherboard OEM reúne memória de dois canais, armazenamento SATA e NVMe e duas saídas de vídeo. O formato compacto permite criar soluções com pouco espaço disponível.' : esc(product.title)}</p>${verified ? '<p class="detail-source-note">Processador a confirmar: a ficha original menciona Core i5-1235U no resumo e Core i3-1215U na descrição. Confirme a configuração antes de encomendar.</p>' : '<p class="detail-source-note">A ficha técnica completa está disponível na página original da Niposom.</p>'}</div></section>
      <section class="detail-specs" id="especificacoes"><div><p class="detail-kicker">INFORMAÇÃO TÉCNICA</p><h2>Especificações</h2></div><dl>${specs.map(([key,value])=>`<div><dt>${esc(key)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl></section>
      <section class="detail-documents" id="documentacao"><div><p class="detail-kicker">CONSULTAR E GUARDAR</p><h2>Documentação</h2></div><a href="${esc(product.url)}" target="_blank" rel="noopener">Ficha original Niposom <span>↗</span></a>${verified ? '<a href="https://www.niposom.pt/pdf_print/shop.pdf_print.php?product_id=40170&amp;category_id=4694&amp;pop=1" target="_blank" rel="noopener">Ficha do produto em PDF <span>↗</span></a>' : ''}</section>
      <section class="detail-related"><div class="detail-related-heading"><div><p class="detail-kicker">CONTINUE A EXPLORAR</p><h2>Na mesma categoria</h2></div><a href="./index.html#produtos">Ver catálogo →</a></div><div class="detail-related-grid"></div></section>
    </div>
    <dialog class="detail-image-dialog"><button class="detail-dialog-close" aria-label="Fechar imagem">×</button><img src="${esc(photo)}" alt="${esc(product.title)}"></dialog>`;
  page.querySelector('[data-detail-purchase]').append(createProductPurchaseControls(product));
  const dialog = page.querySelector('dialog');
  page.querySelector('.detail-zoom').addEventListener('click', () => dialog.showModal());
  page.querySelector('.detail-dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if(event.target === dialog) dialog.close(); });
  const related = products.filter(p => p.category === product.category && p.sku !== product.sku).slice(0,4);
  page.querySelector('.detail-related-grid').innerHTML = related.map(p => `<a class="detail-related-card" href="${esc(productPageUrl(p))}"><img src="${esc(p.image)}" alt="" loading="lazy"><span>${esc(p.brand)}</span><h6>${esc(p.title)}</h6><strong>${esc(p.price || 'Sob consulta')}</strong></a>`).join('');
  if(!related.length) page.querySelector('.detail-related').hidden = true;
  // Reveal catalogue sections before existing navigation handlers run.
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor || page.contains(anchor)) return;
    const target = document.getElementById(anchor.getAttribute('href').slice(1));
    if (!target || !main.contains(target) || target === page) return;
    document.documentElement.classList.remove('product-page-route');
    page.hidden = true;
    history.replaceState(null, '', './index.html');
    document.title = 'Catálogo | Niposom';
  }, true);
  page.querySelectorAll('.detail-section-nav a').forEach(link => {
    link.addEventListener('click', () => {
      page.querySelectorAll('.detail-section-nav a').forEach(item => item.removeAttribute('aria-current'));
      link.setAttribute('aria-current', 'location');
    });
  });
  page.querySelector('.detail-section-nav a').setAttribute('aria-current', 'location');
  document.querySelectorAll('[data-lookup-form], [data-mobile-lookup-form]').forEach(form => {
    form.addEventListener('submit', () => {
      document.documentElement.classList.remove('product-page-route');
      page.hidden = true;
      history.replaceState(null,'','./index.html#produtos');
      document.title = 'Catálogo | Niposom';
      document.querySelector('#produtos').scrollIntoView({block:'start'});
    });
  });
})();
