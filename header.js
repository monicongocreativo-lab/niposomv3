const siteHeader = document.querySelector("[data-site-header]");
const mobileToggle = document.querySelector("[data-mobile-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const mobileLookupForm = document.querySelector("[data-mobile-lookup-form]");
const mobileLookupToggle = document.querySelector("[data-mobile-lookup-toggle]");
const mobileLookupPanel = document.querySelector("[data-mobile-lookup-panel]");
const mobileLookupLabel = document.querySelector("[data-mobile-lookup-label]");
const mobileLookupInput = mobileLookupForm?.querySelector('input[name="description"]');
const mobileLookupOptions = [...document.querySelectorAll("[data-mobile-lookup-option]")];
const mobileQuickToggle = document.querySelector("[data-mobile-quick-toggle]");
const mobileQuickCart = document.querySelector("[data-mobile-quick-cart]");
const lookupToggle = document.querySelector("[data-lookup-toggle]");
const lookupPanel = document.querySelector("[data-lookup-panel]");
const lookupForm = document.querySelector("[data-lookup-form]");
const lookupLabel = document.querySelector("[data-lookup-label]");
const lookupInput = lookupForm?.querySelector('input[name="description"]');
const lookupOptions = [...document.querySelectorAll("[data-lookup-option]")];
const searchPreview = document.querySelector("[data-search-preview]");
const searchPreviewItems = document.querySelector("[data-search-preview-items]");
const megaItems = [...document.querySelectorAll("[data-mega-item]")];
const desktopCategoryNav = document.querySelector("[data-category-nav]");
const mobileCategoryMenu = document.querySelector("[data-mobile-category-menu]");
const accountPanel = document.querySelector("[data-account-panel]");
const accountToggles = [...document.querySelectorAll("[data-account-toggle]")];
const accountForm = document.querySelector("[data-account-form]");
const cartPanel = document.querySelector("[data-cart-panel]");
const cartToggles = [...document.querySelectorAll("[data-cart-toggle]")];
const cartItems = document.querySelector("[data-cart-items]");
const cartEmpty = document.querySelector("[data-cart-empty]");
const cartBadges = [...document.querySelectorAll("[data-cart-badge]")];
const cartCountLabel = document.querySelector("[data-cart-count-label]");
const checkoutButton = document.querySelector("[data-checkout-button]");
const heroCarousel = document.querySelector("[data-hero-carousel]");
const heroSlides = heroCarousel ? [...heroCarousel.querySelectorAll("[data-hero-slide]")] : [];
const heroDots = heroCarousel ? [...heroCarousel.querySelectorAll("[data-hero-dot]")] : [];
const heroPrev = heroCarousel?.querySelector("[data-hero-prev]");
const heroNext = heroCarousel?.querySelector("[data-hero-next]");
const promosCarousel = document.querySelector("[data-promos-carousel]");
const promosTrack = document.querySelector("[data-promos-track]");
const brandsCarousel = document.querySelector("[data-brands-carousel]");
const brandsTrack = document.querySelector("[data-brands-track]");
const productsGrid = document.querySelector("[data-products-grid]");
const productsModule = document.querySelector("[data-products-module]");
const productsCard = productsModule?.querySelector(".catalog-feed-card");
const productsFeedButtons = [...document.querySelectorAll("[data-products-feed]")];
const productsViewButtons = [...document.querySelectorAll("[data-products-view]")];
const productsCollapseButton = document.querySelector("[data-products-collapse]");
const productsExportButton = document.querySelector("[data-products-export]");
const productsPeriod = document.querySelector("[data-products-period]");
const productsSearchForm = document.querySelector("[data-products-search]");
const productsSearchInput = document.querySelector("[data-products-search-input]");
const productsFilterButtons = [...document.querySelectorAll("[data-products-filter]")];
const catalogFilterContainers = [...document.querySelectorAll("[data-catalog-options]")];
const catalogClearButton = document.querySelector("[data-catalog-clear]");
const catalogResultsCount = document.querySelector("[data-catalog-results-count]");
const catalogSort = document.querySelector("[data-catalog-sort]");
const catalogGuide = document.querySelector("[data-catalog-guide]");
const catalogBrandSelect = document.querySelector("[data-catalog-brand-select]");
const catalogPriceRange = document.querySelector("[data-catalog-price-range]");
const catalogAvailability = document.querySelector("[data-catalog-availability]");
const catalogTextFilters = [...document.querySelectorAll("[data-catalog-text-filter]")];
const catalogApplyButton = document.querySelector("[data-catalog-apply]");
const catalogTopFilterShell = document.querySelector("[data-catalog-top-filters-shell]");
const catalogTopFilterToggle = document.querySelector("[data-catalog-top-toggle]");
const catalogTopFilterToggleLabel = document.querySelector("[data-catalog-top-toggle-label]");
const catalogTopFilterClose = document.querySelector("[data-catalog-top-close]");
const catalogSidebarToggle = document.querySelector("[data-catalog-sidebar-toggle]");
const catalogSidebarClose = document.querySelector("[data-catalog-sidebar-close]");
const catalogSidebarBackdrop = document.querySelector("[data-catalog-sidebar-backdrop]");
const footerToggles = [...document.querySelectorAll("[data-footer-toggle]")];
const newsletterForm = document.querySelector("[data-newsletter-form]");
const newsletterButton = document.querySelector("[data-newsletter-submit]");
const newsletterFeedback = document.querySelector("[data-newsletter-feedback]");
const cartState = (() => {
  try {
    const saved = JSON.parse(sessionStorage.getItem("niposom-cart") || "[]");
    return Array.isArray(saved) ? saved.filter(item => item && typeof item.sku === "string" && typeof item.title === "string" && Number.isInteger(item.quantity) && item.quantity > 0) : [];
  } catch { return []; }
})();
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let catalogProducts = [];
let searchPreviewResults = [];
let searchPreviewMessage = "";
let activeProductsFilter = "Todos";
let activeProductsFeed = "arrivals";
let activeProductsView = "grid";
let activeCatalogSort = "recent";
let activeCatalogBrand = "";
let activeCatalogPriceRange = "";
let activeCatalogAvailability = false;
let catalogTaxonomy = null;
const activeCatalogTextFilters = new Set();
let activeHeroSlide = 0;
let heroTimer = 0;
let activePromoSlide = 0;
let promoTimer = 0;
let activeBrandSlide = 0;
let brandTimer = 0;
const activeCatalogFilters = {
  brand: new Set(),
  family: new Set(),
  type: new Set(),
};

function setMobileMenu(isOpen) {
  siteHeader.classList.toggle("is-mobile-open", isOpen);
  mobileToggle.setAttribute("aria-expanded", String(isOpen));
  mobileToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  document.querySelector("[data-mobile-menu-backdrop]").hidden = !isOpen;
  document.body.classList.toggle("mobile-menu-open", isOpen);
  if (isOpen) mobileMenu.querySelector("[data-mobile-menu-close]").focus();
  else if (mobileMenu.contains(document.activeElement)) mobileToggle.focus();
}

function setLookupPanel(isOpen) {
  if (!lookupPanel || !lookupToggle) {
    return;
  }

  lookupPanel.classList.toggle("is-open", isOpen);
  lookupToggle.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    setSearchPreview(false);
  }
}

function setSearchPreview(isOpen) {
  if (!searchPreview) {
    return;
  }

  const shouldOpen = isOpen && (searchPreviewResults.length > 0 || searchPreviewMessage);
  searchPreview.hidden = !shouldOpen;
  searchPreview.classList.toggle("is-open", shouldOpen);
}

function setLookupMode(option) {
  if (!option || !lookupLabel || !lookupInput || !lookupForm) {
    return;
  }

  lookupOptions.forEach((item) => {
    item.classList.toggle("is-active", item === option);
  });

  lookupForm.dataset.lookupMode = option.dataset.label;
  lookupLabel.textContent = option.dataset.label;
  lookupInput.placeholder = option.dataset.placeholder;
  lookupInput.focus();
}

function setMobileLookupPanel(isOpen) {
  if (!mobileLookupPanel || !mobileLookupToggle) {
    return;
  }

  mobileLookupPanel.classList.toggle("is-open", isOpen);
  mobileLookupToggle.setAttribute("aria-expanded", String(isOpen));
}

function setMobileLookupMode(option) {
  if (!option || !mobileLookupLabel || !mobileLookupInput || !mobileLookupForm) {
    return;
  }

  mobileLookupOptions.forEach((item) => {
    item.classList.toggle("is-active", item === option);
  });

  mobileLookupForm.dataset.lookupMode = option.dataset.label;
  mobileLookupLabel.textContent = option.dataset.label;
  mobileLookupInput.placeholder = option.dataset.placeholder;
  mobileLookupInput.focus();
}

function setMobileQuickCart(isOpen) {
  if (!mobileQuickToggle || !mobileQuickCart) {
    return;
  }

  mobileQuickCart.classList.toggle("is-open", isOpen);
  mobileQuickToggle.classList.toggle("is-open", isOpen);
  mobileQuickToggle.setAttribute("aria-expanded", String(isOpen));
}

function setCatalogSidebar(isOpen) {
  if (!productsModule || !catalogSidebarToggle || !catalogSidebarBackdrop) {
    return;
  }

  productsModule.classList.toggle("is-catalog-sidebar-open", isOpen);
  catalogSidebarToggle.setAttribute("aria-expanded", String(isOpen));
  catalogSidebarBackdrop.hidden = !isOpen;
}

function setCatalogTopFiltersCollapsed(isCollapsed) {
  if (!catalogTopFilterShell || !catalogTopFilterToggle) {
    return;
  }

  catalogTopFilterShell.classList.toggle("is-collapsed", isCollapsed);
  productsModule?.classList.toggle("is-catalog-sidebar-collapsed", isCollapsed);
  setCatalogSidebar(false);
  catalogTopFilterToggle.setAttribute("aria-expanded", String(!isCollapsed));

  if (catalogTopFilterToggleLabel) {
    catalogTopFilterToggleLabel.textContent = "Filtros técnicos";
  }
}

function setAccountPanel(isOpen) {
  if (!accountPanel) {
    return;
  }

  accountPanel.classList.toggle("is-open", isOpen);
  accountToggles.forEach((button) => {
    button.setAttribute("aria-expanded", String(isOpen));
  });
}

function setCartPanel(isOpen) {
  if (!cartPanel) {
    return;
  }

  cartPanel.classList.toggle("is-open", isOpen);
  cartToggles.forEach((button) => {
    button.setAttribute("aria-expanded", String(isOpen));
  });
}

function closeMegaMenus() {
  megaItems.forEach((item) => {
    const button = item.querySelector("[data-mega-button]");
    item.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
  });
}

function addMegaCloseButtons() {
  megaItems.forEach((item) => {
    const menu = item.querySelector("[data-mega-menu]");

    if (!menu || menu.querySelector("[data-mega-close]")) {
      return;
    }

    const closeButton = document.createElement("button");
    closeButton.className = "mega-close";
    closeButton.type = "button";
    closeButton.dataset.megaClose = "";
    closeButton.setAttribute("aria-label", "Fechar menu");
    closeButton.textContent = "×";
    closeButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeMegaMenus();
      item.classList.add("is-suppressed");
      item.querySelector("[data-mega-button]")?.focus();
    });

    menu.prepend(closeButton);
  });
}

function toggleMegaMenu(item) {
  const isOpen = item.classList.contains("is-open");
  closeMegaMenus();

  if (!isOpen) {
    const button = item.querySelector("[data-mega-button]");
    item.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
  }
}

function syncCartCount() {
  try { sessionStorage.setItem("niposom-cart", JSON.stringify(cartState)); } catch {}
  const itemCount = cartState.reduce((total, item) => total + item.quantity, 0);
  const label = `${itemCount} ${itemCount === 1 ? "produto" : "produtos"}`;
  const hasItems = cartState.length > 0;

  cartBadges.forEach((badge) => {
    badge.textContent = String(itemCount);
  });

  if (cartCountLabel) {
    cartCountLabel.textContent = label;
  }

  if (cartEmpty) {
    cartEmpty.hidden = hasItems;
  }

  if (checkoutButton) {
    checkoutButton.disabled = !hasItems;
    checkoutButton.setAttribute("aria-disabled", String(!hasItems));
  }
}

function setHeroSlide(index) {
  if (!heroSlides.length) {
    return;
  }

  activeHeroSlide = (index + heroSlides.length) % heroSlides.length;

  heroSlides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeHeroSlide;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });

  heroDots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === activeHeroSlide;
    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-current", String(isActive));
  });
}

function nextHeroSlide() {
  setHeroSlide(activeHeroSlide + 1);
}

function restartHeroTimer() {
  window.clearInterval(heroTimer);

  if (heroSlides.length > 1 && !reduceMotion.matches) {
    heroTimer = window.setInterval(nextHeroSlide, 6500);
  }
}

function visiblePromoCards() {
  if (!promosTrack) {
    return 1;
  }

  const value = Number.parseInt(getComputedStyle(promosTrack).getPropertyValue("--promo-visible"), 10);
  return Number.isNaN(value) ? 1 : value;
}

function setPromoSlide(index, options = {}) {
  if (!promosTrack) {
    return;
  }

  const originalCards = promosTrack.querySelectorAll(".promo-card:not([data-promo-clone])");

  if (!originalCards.length) {
    return;
  }

  const shouldReset = index >= originalCards.length;
  activePromoSlide = shouldReset ? originalCards.length : (index + originalCards.length) % originalCards.length;

  const card = promosTrack.querySelector(".promo-card");
  const gap = Number.parseFloat(getComputedStyle(promosTrack).columnGap || "0");
  const step = card ? card.getBoundingClientRect().width + gap : 0;

  promosTrack.style.transition = options.instant ? "none" : "";
  promosTrack.style.transform = `translateX(-${activePromoSlide * step}px)`;

  if (shouldReset && !options.instant) {
    window.setTimeout(() => {
      activePromoSlide = 0;
      promosTrack.style.transition = "none";
      promosTrack.style.transform = "translateX(0)";
      window.requestAnimationFrame(() => {
        promosTrack.style.transition = "";
      });
    }, 540);
    return;
  }

  if (options.instant) {
    window.requestAnimationFrame(() => {
      promosTrack.style.transition = "";
    });
  }
}

function nextPromoSlide() {
  setPromoSlide(activePromoSlide + 1);
}

function restartPromoTimer() {
  window.clearInterval(promoTimer);

  if (promosTrack && !reduceMotion.matches) {
    promoTimer = window.setInterval(nextPromoSlide, 3600);
  }
}

function setupPromosCarousel() {
  if (!promosCarousel || !promosTrack) {
    return;
  }

  const cards = [...promosTrack.querySelectorAll(".promo-card")];
  const clonesNeeded = Math.max(visiblePromoCards(), 1);

  cards.slice(0, clonesNeeded).forEach((card) => {
    const clone = card.cloneNode(true);
    clone.dataset.promoClone = "";
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("a, button").forEach((control) => {
      control.tabIndex = -1;
    });
    promosTrack.append(clone);
  });

  setPromoSlide(0, { instant: true });
  restartPromoTimer();

  promosCarousel.addEventListener("mouseenter", () => {
    window.clearInterval(promoTimer);
  });

  promosCarousel.addEventListener("mouseleave", restartPromoTimer);
  promosCarousel.addEventListener("focusin", () => {
    window.clearInterval(promoTimer);
  });
  promosCarousel.addEventListener("focusout", restartPromoTimer);

  window.addEventListener("resize", () => {
    setPromoSlide(activePromoSlide, { instant: true });
  });
}

function visibleBrandCards() {
  if (!brandsTrack) {
    return 1;
  }

  const value = Number.parseInt(getComputedStyle(brandsTrack).getPropertyValue("--brands-visible"), 10);
  return Number.isNaN(value) ? 1 : value;
}

function setBrandSlide(index, options = {}) {
  if (!brandsTrack) {
    return;
  }

  const originalCards = brandsTrack.querySelectorAll(".partner-brand-card:not([data-brand-clone])");

  if (!originalCards.length) {
    return;
  }

  const shouldReset = index >= originalCards.length;
  activeBrandSlide = shouldReset ? originalCards.length : (index + originalCards.length) % originalCards.length;

  const card = brandsTrack.querySelector(".partner-brand-card");
  const gap = Number.parseFloat(getComputedStyle(brandsTrack).columnGap || "0");
  const step = card ? card.getBoundingClientRect().width + gap : 0;

  brandsTrack.style.transition = options.instant ? "none" : "";
  brandsTrack.style.transform = `translateX(-${activeBrandSlide * step}px)`;

  if (shouldReset && !options.instant) {
    window.setTimeout(() => {
      activeBrandSlide = 0;
      brandsTrack.style.transition = "none";
      brandsTrack.style.transform = "translateX(0)";
      window.requestAnimationFrame(() => {
        brandsTrack.style.transition = "";
      });
    }, 540);
    return;
  }

  if (options.instant) {
    window.requestAnimationFrame(() => {
      brandsTrack.style.transition = "";
    });
  }
}

function restartBrandTimer() {
  window.clearInterval(brandTimer);

  if (brandsTrack && !reduceMotion.matches) {
    brandTimer = window.setInterval(() => {
      setBrandSlide(activeBrandSlide + 1);
    }, 2800);
  }
}

function setupBrandsCarousel() {
  if (!brandsCarousel || !brandsTrack) {
    return;
  }

  const cards = [...brandsTrack.querySelectorAll(".partner-brand-card")];
  const clonesNeeded = Math.max(visibleBrandCards(), 1);

  cards.slice(0, clonesNeeded).forEach((card) => {
    const clone = card.cloneNode(true);
    clone.dataset.brandClone = "";
    clone.setAttribute("aria-hidden", "true");
    clone.tabIndex = -1;
    brandsTrack.append(clone);
  });

  setBrandSlide(0, { instant: true });
  restartBrandTimer();

  brandsCarousel.addEventListener("mouseenter", () => {
    window.clearInterval(brandTimer);
  });
  brandsCarousel.addEventListener("mouseleave", restartBrandTimer);
  brandsCarousel.addEventListener("focusin", () => {
    window.clearInterval(brandTimer);
  });
  brandsCarousel.addEventListener("focusout", restartBrandTimer);

  window.addEventListener("resize", () => {
    setBrandSlide(activeBrandSlide, { instant: true });
  });
}

function normalizeQuantity(value) {
  const quantity = Number(value);
  return Number.isFinite(quantity) ? Math.max(1, Math.min(Number.MAX_SAFE_INTEGER, Math.floor(quantity))) : 1;
}

function createQuantityControl(label, initial = 1, onChange = () => {}) {
  const element = document.createElement("div");
  element.className = "quantity-control";
  const decrease = document.createElement("button");
  decrease.type = "button";
  decrease.textContent = "−";
  decrease.setAttribute("aria-label", `Diminuir quantidade de ${label}`);
  const input = document.createElement("input");
  input.type = "number";
  input.min = "1";
  input.step = "1";
  input.inputMode = "numeric";
  input.setAttribute("aria-label", `Quantidade de ${label}`);
  input.value = String(normalizeQuantity(initial));
  const increase = document.createElement("button");
  increase.type = "button";
  increase.textContent = "+";
  increase.setAttribute("aria-label", `Aumentar quantidade de ${label}`);
  const read = () => {
    const quantity = normalizeQuantity(input.value);
    input.value = String(quantity);
    decrease.disabled = quantity <= 1;
    return quantity;
  };
  const commit = () => onChange(read());
  decrease.addEventListener("click", () => { input.value = String(read() - 1); commit(); });
  increase.addEventListener("click", () => { input.value = String(read() + 1); commit(); });
  input.addEventListener("change", commit);
  input.addEventListener("blur", commit);
  input.addEventListener("input", () => {
    if (/^[1-9]\d*$/.test(input.value)) {
      decrease.disabled = Number(input.value) <= 1;
      onChange(normalizeQuantity(input.value));
    }
  });
  element.append(decrease, input, increase);
  read();
  return { element, read };
}

function createProductPurchaseControls(product) {
  const form = document.createElement("form");
  form.className = "product-purchase";
  form.noValidate = true;
  form.setAttribute("aria-label", `Adicionar ${product.sku} ao carrinho`);
  const quantity = createQuantityControl(product.sku);
  const button = document.createElement("button");
  button.className = "product-add";
  button.type = "submit";
  button.textContent = "ADD";
  button.setAttribute("aria-label", `Adicionar ${product.sku} ao carrinho`);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();
    addCartItem({ ...productFromCatalog(product), quantity: quantity.read() });
  });
  form.append(quantity.element, button);
  return form;
}

function renderCartItem(item) {
  const card = document.createElement("article");
  card.className = "cart-product";

  const thumb = document.createElement("div");
  thumb.className = "cart-thumb";
  thumb.setAttribute("aria-hidden", "true");

  if (item.image) {
    thumb.classList.add("has-image");
    const image = document.createElement("img");
    image.src = item.image;
    image.alt = "";
    thumb.append(image);
  }

  const body = document.createElement("div");
  body.className = "cart-product-body";

  const meta = document.createElement("p");
  meta.className = "cart-product-meta";
  meta.textContent = `${item.brand} | SKU: ${item.sku}`;

  const title = document.createElement("h3");
  title.className = "cart-product-title";
  title.textContent = item.title;

  const price = document.createElement("strong");
  price.className = "cart-product-price";
  price.textContent = item.price;

  const actions = document.createElement("div");
  actions.className = "cart-product-actions";
  const quantity = createQuantityControl(item.sku, item.quantity, (value) => {
    item.quantity = value;
    syncCartCount();
  });
  const remove = document.createElement("button");
  remove.className = "cart-product-remove";
  remove.type = "button";
  remove.textContent = "Eliminar";
  remove.setAttribute("aria-label", `Eliminar ${item.title} do carrinho`);
  remove.addEventListener("click", (event) => {
    event.stopPropagation();
    removeCartItem(item.sku);
  });
  actions.append(quantity.element, remove);
  body.append(meta, title, price);
  card.append(thumb, body, actions);
  return card;
}

function renderSearchPreviewItem(item) {
  const card = document.createElement("article");
  card.className = "search-preview-product";

  const thumb = document.createElement("div");
  thumb.className = "search-preview-thumb";
  thumb.setAttribute("aria-hidden", "true");

  if (item.image) {
    thumb.classList.add("has-image");
    const image = document.createElement("img");
    image.src = item.image;
    image.alt = "";
    thumb.append(image);
  }

  const body = document.createElement("div");
  body.className = "search-preview-body";

  const meta = document.createElement("p");
  meta.className = "search-preview-meta";
  meta.textContent = `${item.brand} | SKU: ${item.sku}`;

  const title = document.createElement("h3");
  title.className = "search-preview-title";
  title.textContent = item.title;

  const price = document.createElement("strong");
  price.className = "search-preview-price";
  price.textContent = item.price || "Sob consulta";

  const actions = document.createElement("div");
  actions.className = "search-preview-actions";

  const quantity = document.createElement("input");
  quantity.className = "search-preview-qty";
  quantity.type = "number";
  quantity.min = "1";
  quantity.value = "1";
  quantity.inputMode = "numeric";
  quantity.setAttribute("aria-label", `Quantidade para ${item.title}`);

  const addButton = document.createElement("button");
  addButton.className = "search-preview-add";
  addButton.type = "button";
  addButton.textContent = "+";
  addButton.setAttribute("aria-label", `Adicionar ${item.title} ao carrinho`);
  addButton.addEventListener("click", (event) => {
    event.stopPropagation();

    const selectedQuantity = Math.max(1, Number(quantity.value) || 1);
    addCartItem(
      {
        ...productFromCatalog(item),
        quantity: selectedQuantity,
      },
      { openCart: false }
    );

    setSearchPreview(true);
    addButton.classList.add("is-added");
    window.clearTimeout(addButton.addedStateTimer);
    addButton.addedStateTimer = window.setTimeout(() => {
      addButton.classList.remove("is-added");
    }, 900);
  });

  actions.append(quantity, addButton);

  body.append(meta, title, price);
  card.append(thumb, body, actions);
  return card;
}

function renderSearchPreview() {
  if (!searchPreviewItems) {
    return;
  }

  searchPreviewItems.replaceChildren();

  if (searchPreviewMessage) {
    const message = document.createElement("p");
    message.className = "search-preview-empty";
    message.textContent = searchPreviewMessage;
    searchPreviewItems.append(message);
    return;
  }

  searchPreviewResults.slice(0, 4).forEach((item) => {
    searchPreviewItems.append(renderSearchPreviewItem(item));
  });
}

function renderCart() {
  cartItems.querySelectorAll(".cart-product").forEach((item) => item.remove());
  cartState.forEach((item) => {
    cartItems.append(renderCartItem(item));
  });
  syncCartCount();
}

function addCartItem(product, options = {}) {
  const existingItem = cartState.find((item) => item.sku === product.sku);

  if (existingItem) {
    existingItem.quantity += product.quantity;
  } else {
    cartState.unshift(product);
  }

  renderCart();
  if (options.openCart !== false) {
    setCartPanel(true);
  }
  setLookupPanel(false);
  setAccountPanel(false);
  closeMegaMenus();
}

function removeCartItem(sku, options = {}) {
  const itemIndex = cartState.findIndex((item) => item.sku === sku);

  if (itemIndex === -1) {
    return;
  }

  cartState.splice(itemIndex, 1);
  renderCart();
  if (options.openCart !== false) {
    setCartPanel(true);
  }
}

function productFromQuickCart(form) {
  const sku = form.elements.sku.value.trim().toUpperCase();
  const quantity = Math.max(1, Number(form.elements.qty.value) || 1);

  return {
    brand: "Asus",
    sku,
    title:
      sku === "CCB650EMAXGAMINGWIFIW"
        ? "ASUS B650E MAX GAMING WIFI W AM5 ATX Motherboard, White PCB, DDR..."
        : `Produto ${sku} adicionado diretamente ao carrinho`,
    price: "$149.99",
    quantity,
  };
}

function productFromCatalog(product) {
  return {
    brand: product.brand,
    sku: product.sku,
    title: product.title,
    price: product.price,
    image: product.image,
    quantity: 1,
  };
}

function productPageUrl(product) {
  return `./index.html?product=${encodeURIComponent(productInternalRef(product))}`;
}

function productInternalRef(product) {
  try {
    return new URL(product.url).searchParams.get("product_id") || product.ref || product.sku;
  } catch {
    return product.ref || product.sku;
  }
}

function escapeRegExp(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function productModel(product) {
  if (Object.prototype.hasOwnProperty.call(product, "model")) return product.model ?? "";
  const escapedBrand = escapeRegExp(product.brand);
  const brandPattern = escapedBrand ? new RegExp("\\b" + escapedBrand + "\\b", "gi") : /$^/g;
  const firstPart = String(product.title || "").split(",")[0] || product.title || "";
  return firstPart
    .replace(/^(MOTHERBOARD|COMPUTADOR|COMPUTER|MINI PC|NUC|BAREBONE)\s+/i, "")
    .replace(brandPattern, "")
    .replace(/\s{2,}/g, " ")
    .trim() || product.sku;
}

function productCategoryLabel(product) {
  if (product.category === "Motherboards") {
    return "Placas-mãe";
  }

  if (product.category === "Computadores & mini pcs") {
    return "Computadores e mini PCs";
  }

  return product.category || "Produtos";
}

function matchesCatalogSearch(product, query) {
  if (!query) {
    return true;
  }

  const searchable = `${product.brand} ${productInternalRef(product)} ${product.sku} ${product.ean ?? ""} ${productModel(product)} ${product.title} ${product.category}`.toLowerCase();
  return searchable.includes(query);
}

function setActiveProductsFilter(filter) {
  activeProductsFilter = filter;
  productsFilterButtons.forEach((item) => {
    item.classList.toggle("is-active", item.dataset.productsFilter === filter);
  });
}

function setActiveProductsFeed(feed) {
  activeProductsFeed = feed;
  productsFeedButtons.forEach((item) => {
    const isActive = item.dataset.productsFeed === feed;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-selected", String(isActive));
  });
}

function setActiveProductsView(view) {
  activeProductsView = view;
  productsViewButtons.forEach((item) => {
    const isActive = item.dataset.productsView === view;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });
}

function searchCatalogProducts(query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return catalogProducts.filter((product) => matchesCatalogSearch(product, normalizedQuery));
}

function productDepartment(product) {
  const searchable = `${product.category} ${product.title}`.toLowerCase();

  if (searchable.includes("servidor") || searchable.includes("server") || searchable.includes("nas")) {
    return "Servidores";
  }

  if (searchable.includes("rede") || searchable.includes("network") || searchable.includes("router") || searchable.includes("switch")) {
    return "Redes";
  }

  if (searchable.includes("teclado") || searchable.includes("mouse") || searchable.includes("monitor") || searchable.includes("perif")) {
    return "Periféricos";
  }

  if (searchable.includes("electron") || searchable.includes("eletron") || searchable.includes("bateria") || searchable.includes("cabo")) {
    return "Electrónica";
  }

  if (searchable.includes("computadores") || searchable.includes("mini pc") || searchable.includes("mini-pc") || searchable.includes("nuc") || searchable.includes("barebone") || searchable.includes("aio") || searchable.includes("all in one")) {
    return "PC";
  }

  return "Hardware";
}

function productType(product) {
  const searchable = `${product.category} ${product.title}`.toLowerCase();

  if (searchable.includes("motherboard")) {
    return "Motherboards";
  }

  if (searchable.includes("barebone")) {
    return "Barebones";
  }

  if (searchable.includes("all in one") || searchable.includes("all-in-one") || searchable.includes(" aio ")) {
    return "All in one";
  }

  if (searchable.includes("mini pc") || searchable.includes("mini-pc") || searchable.includes("nuc")) {
    return "Mini PCs";
  }

  return product.category;
}

function catalogFilterValue(product, filter) {
  if (filter === "brand") {
    return product.brand;
  }

  if (filter === "family") {
    return product.category;
  }

  return productType(product);
}

function cleanCatalogTaxonomyText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function uniqueCatalogValues(values) {
  return [...new Set(values.map(cleanCatalogTaxonomyText).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "pt", { sensitivity: "base" })
  );
}

function buildCatalogTaxonomy() {
  const taxonomy = {
    categories: {},
    brands: [],
  };

  megaItems.forEach((item) => {
    const category = cleanCatalogTaxonomyText(item.querySelector("[data-mega-button]")?.textContent);
    const menu = item.querySelector("[data-mega-menu]");

    if (!category || !menu) {
      return;
    }

    if (category === "Marcas") {
      taxonomy.brands = uniqueCatalogValues([...menu.querySelectorAll(".mega-brand-grid a")].map((link) => link.textContent));
      return;
    }

    const families = [];
    const subfamilies = [];
    const familyTypes = {};

    [...menu.querySelectorAll(".mega-grid > section")].forEach((section) => {
      let activeFamily = "";

      [...section.children].forEach((child) => {
        if (child.matches("h2")) {
          activeFamily = cleanCatalogTaxonomyText(child.textContent);

          if (activeFamily) {
            families.push(activeFamily);
            familyTypes[activeFamily] = familyTypes[activeFamily] || [];
          }

          return;
        }

        if (!activeFamily || !child.matches("a")) {
          return;
        }

        const subfamily = cleanCatalogTaxonomyText(child.textContent);

        if (!subfamily) {
          return;
        }

        subfamilies.push(subfamily);
        familyTypes[activeFamily].push(subfamily);
      });
    });

    Object.keys(familyTypes).forEach((family) => {
      familyTypes[family] = uniqueCatalogValues(familyTypes[family]);
    });

    taxonomy.categories[category] = {
      families: uniqueCatalogValues(families),
      subfamilies: uniqueCatalogValues(subfamilies),
      familyTypes,
    };
  });

  return taxonomy;
}

function getCatalogTaxonomy() {
  if (!catalogTaxonomy) {
    catalogTaxonomy = buildCatalogTaxonomy();
  }

  return catalogTaxonomy;
}

function taxonomyCategoryLabels() {
  const taxonomy = getCatalogTaxonomy();
  return activeProductsFilter === "Todos"
    ? Object.keys(taxonomy.categories)
    : [activeProductsFilter];
}

function taxonomyValuesForFilter(filter) {
  const taxonomy = getCatalogTaxonomy();

  if (filter === "brand") {
    return taxonomy.brands;
  }

  if (filter === "family") {
    const values = taxonomyCategoryLabels().flatMap((category) => taxonomy.categories[category]?.families || []);
    return uniqueCatalogValues(values);
  }

  const selectedFamilies = [...activeCatalogFilters.family];

  if (!selectedFamilies.length) {
    return [];
  }

  const values = taxonomyCategoryLabels().flatMap((category) => {
    const familyTypes = taxonomy.categories[category]?.familyTypes || {};
    return selectedFamilies.flatMap((family) => familyTypes[family] || []);
  });

  return uniqueCatalogValues(values);
}

function feedCatalogProducts() {
  const halfPoint = Math.ceil(catalogProducts.length / 2);
  return activeProductsFeed === "news" ? catalogProducts.slice(halfPoint) : catalogProducts.slice(0, halfPoint);
}

function matchesActiveDepartment(product) {
  return activeProductsFilter === "Todos" || productDepartment(product) === activeProductsFilter;
}

function contextualCatalogProducts() {
  return feedCatalogProducts().filter(matchesActiveDepartment);
}

function buildCatalogTopBrandFilter(products = contextualCatalogProducts()) {
  if (!catalogBrandSelect) {
    return;
  }

  const productBrands = uniqueCatalogValues(products.map((product) => product.brand));
  const brands = productBrands.length ? productBrands : taxonomyValuesForFilter("brand");

  const currentValue = catalogBrandSelect.value;
  catalogBrandSelect.replaceChildren(new Option("Todos os fabricantes", ""));
  brands.forEach((brand) => {
    catalogBrandSelect.append(new Option(brand, brand));
  });

  if (brands.includes(currentValue)) {
    catalogBrandSelect.value = currentValue;
    activeCatalogBrand = currentValue;
  } else {
    catalogBrandSelect.value = "";
    activeCatalogBrand = "";
  }
}

function buildCatalogSidebarFilters() {
  const products = contextualCatalogProducts();
  buildCatalogTopBrandFilter(products);

  catalogFilterContainers.forEach((container) => {
    const filter = container.dataset.catalogOptions;
    const productValues = uniqueCatalogValues(products.map((product) => catalogFilterValue(product, filter)));
    const taxonomyValues = taxonomyValuesForFilter(filter);
    let values = [];

    if (filter === "brand") {
      values = productValues.length ? productValues : taxonomyValues;
    } else if (filter === "type") {
      values = activeCatalogFilters.family.size
        ? (taxonomyValues.length ? taxonomyValues : productValues)
        : [];
    } else {
      values = taxonomyValues.length ? taxonomyValues : productValues;
    }

    const selected = activeCatalogFilters[filter];

    selected.forEach((value) => {
      if (!values.includes(value)) {
        selected.delete(value);
      }
    });

    container.replaceChildren();
    container.classList.toggle("is-scrollable", values.length > 5);
    container.dataset.optionCount = String(values.length);

    if (!values.length) {
      const empty = document.createElement("p");
      empty.className = "catalog-filter-empty";
      empty.textContent =
        filter === "type" && !activeCatalogFilters.family.size
          ? "Selecione uma família para ver os tipos de produto."
          : "Sem opções nesta categoria.";
      container.append(empty);
      return;
    }

    values.forEach((value) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      const text = document.createElement("span");

      input.type = "checkbox";
      input.value = value;
      input.dataset.catalogFilter = filter;
      input.checked = selected.has(value);
      text.textContent = value;
      const count = document.createElement("span");
      count.className = "catalog-option-count";
      const itemCount = products.filter((product) =>
        catalogFilterValue(product, filter) === value &&
        (filter !== "type" || activeCatalogFilters.family.has(catalogFilterValue(product, "family")))
      ).length;
      count.textContent = String(itemCount);
      count.setAttribute("aria-label", `${itemCount} produtos`);
      label.append(input, text, count);
      container.append(label);
    });
  });
}

function matchesCatalogSidebarFilters(product) {
  return Object.entries(activeCatalogFilters).every(([filter, selected]) => {
    return !selected.size || selected.has(catalogFilterValue(product, filter));
  });
}

function matchesCatalogTopFilters(product) {
  if (activeCatalogBrand && product.brand !== activeCatalogBrand) {
    return false;
  }

  if (activeCatalogPriceRange) {
    const price = productPriceNumber(product);

    if (activeCatalogPriceRange === "under-75" && price > 75) {
      return false;
    }

    if (activeCatalogPriceRange === "75-150" && (price < 75 || price > 150)) {
      return false;
    }

    if (activeCatalogPriceRange === "150-plus" && price < 150) {
      return false;
    }
  }

  if (activeCatalogTextFilters.size) {
    const searchable = `${product.brand} ${product.sku} ${product.ean ?? ""} ${productModel(product)} ${product.title} ${product.category}`.toLowerCase();
    const matchesEveryTextFilter = [...activeCatalogTextFilters].every((value) => searchable.includes(value.toLowerCase()));

    if (!matchesEveryTextFilter) {
      return false;
    }
  }

  return true;
}

function productPriceNumber(product) {
  const rawPrice = String(product.price || "").replace(/[^\d.,-]/g, "");
  const normalizedPrice =
    rawPrice.includes(",") && rawPrice.includes(".")
      ? rawPrice.replace(/\./g, "").replace(",", ".")
      : rawPrice.replace(",", ".");
  return Number.parseFloat(normalizedPrice) || 0;
}

function sortCatalogProducts(products) {
  const sortedProducts = [...products];

  if (activeCatalogSort === "brand") {
    return sortedProducts.sort((a, b) => a.brand.localeCompare(b.brand, "pt", { sensitivity: "base" }));
  }

  if (activeCatalogSort === "price-asc") {
    return sortedProducts.sort((a, b) => productPriceNumber(a) - productPriceNumber(b));
  }

  if (activeCatalogSort === "price-desc") {
    return sortedProducts.sort((a, b) => productPriceNumber(b) - productPriceNumber(a));
  }

  return sortedProducts;
}

function performHeaderSearch(form) {
  const query = form.elements.description?.value.trim() || "";

  searchPreviewResults = searchCatalogProducts(query);
  searchPreviewMessage = "";

  if (!query) {
    searchPreviewMessage = "Escreva uma pesquisa para encontrar produtos.";
  } else if (!searchPreviewResults.length) {
    searchPreviewMessage = "Sem resultados para esta pesquisa.";
  }

  if (productsSearchInput) {
    productsSearchInput.value = query;
    setActiveProductsFilter("Todos");
    buildCatalogSidebarFilters();
    renderCatalogProducts();
  }

  renderSearchPreview();
  setLookupPanel(false);
  setSearchPreview(true);
  setCartPanel(false);
  setAccountPanel(false);
  closeMegaMenus();
}

function visibleCatalogProducts() {
  const query = productsSearchInput?.value.trim().toLowerCase() || "";

  return contextualCatalogProducts().filter((product) => {
    return matchesCatalogSearch(product, query) && matchesCatalogSidebarFilters(product) && matchesCatalogTopFilters(product);
  });
}

function updateCatalogGuide(products) {
  if (!catalogGuide) {
    return;
  }

  const primaryProduct = products[0];
  const department = activeProductsFilter === "Todos" ? (primaryProduct ? productDepartment(primaryProduct) : "Hardware") : activeProductsFilter;
  const family = primaryProduct ? productCategoryLabel(primaryProduct) : "Produtos";
  const brand = activeCatalogBrand || (activeCatalogFilters.brand.size === 1 ? [...activeCatalogFilters.brand][0] : "");
  const middle = department === "Hardware" ? "Componentes" : "Catálogo";
  const segments = [department, middle, family, brand].filter(Boolean);

  catalogGuide.replaceChildren();
  segments.forEach((segment, index) => {
    const item = document.createElement("span");
    item.textContent = segment;
    catalogGuide.append(item);

    if (index < segments.length - 1) {
      const separator = document.createElement("span");
      separator.setAttribute("aria-hidden", "true");
      separator.textContent = "/";
      catalogGuide.append(separator);
    }
  });
}

function renderCatalogProductRow(product) {
  const row = document.createElement("article");
  row.className = "product-row";

  const imageCell = document.createElement("a");
  imageCell.href = productPageUrl(product);
  imageCell.target = "_self";
  imageCell.rel = "noreferrer";
  imageCell.setAttribute("aria-label", product.title);
  imageCell.className = "product-row-image";
  const image = document.createElement("img");
  image.src = product.image;
  image.alt = "";
  image.loading = "lazy";
  imageCell.append(image);

  const brand = document.createElement("span");
  brand.className = "product-row-brand";
  brand.textContent = product.brand;

  const ref = document.createElement("span");
  ref.className = "product-row-ref";
  ref.textContent = productInternalRef(product);

  const sku = document.createElement("span");
  sku.className = "product-row-sku";
  sku.textContent = product.sku;

  const model = document.createElement("span");
  model.className = "product-row-model";
  model.textContent = productModel(product);
  const ean = document.createElement("small");
  ean.className = "product-row-ean";
  ean.textContent = `EAN: ${product.ean ?? ""}`;
  model.append(ean);

  const title = document.createElement("h6");
  title.className = "product-row-title";
  const titleLink = document.createElement("a");
  titleLink.href = productPageUrl(product);
  titleLink.target = "_self";
  titleLink.rel = "noreferrer";
  titleLink.textContent = product.title;
  title.append(titleLink);

  const price = document.createElement("strong");
  price.className = "product-row-price";
  price.textContent = product.price ? `${product.price} c/IVA` : "Sob consulta";

  row.append(imageCell, brand, ref, sku, model, title, price, createProductPurchaseControls(product));
  return row;
}

function renderCatalogProductsList(products) {
  const list = document.createElement("div");
  list.className = "products-list";

  const header = document.createElement("div");
  header.className = "products-list-header";
  ["Img", "Marca", "Ref.", "SKU", "Modelo", "Descrição", "Preço", "Quantidade / Adicionar"].forEach((label) => {
    const item = document.createElement("span");
    item.textContent = label;
    header.append(item);
  });

  list.append(header);
  products.forEach((product) => {
    list.append(renderCatalogProductRow(product));
  });
  productsGrid.append(list);
}

function renderCatalogProductsGrid(products) {
  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.dataset.productCard = "";

    const media = document.createElement("a");
    media.className = "product-media";
    media.href = productPageUrl(product);
    media.target = "_self";
    media.rel = "noreferrer";

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = "";
    image.loading = "lazy";
    media.append(image);

    const body = document.createElement("div");
    body.className = "product-body";

    const meta = document.createElement("p");
    meta.className = "product-meta";

    const brand = document.createElement("span");
    brand.textContent = product.brand;

    const category = document.createElement("span");
    category.textContent = product.category;
    meta.append(brand, category);

    const title = document.createElement("h6");
    title.className = "product-title";

    const titleLink = document.createElement("a");
    titleLink.href = productPageUrl(product);
    titleLink.target = "_self";
    titleLink.rel = "noreferrer";
    titleLink.textContent = product.title;
    title.append(titleLink);

    const specs = document.createElement("dl");
    specs.className = "product-specs";

    [
      ["Ref.", productInternalRef(product)],
      ["SKU", product.sku],
      ["Modelo", productModel(product)],
      ["EAN", product.ean ?? ""],
    ].forEach(([label, value]) => {
      const term = document.createElement("dt");
      const detail = document.createElement("dd");
      term.textContent = label;
      detail.textContent = value;
      specs.append(term, detail);
    });

    body.append(meta, title, specs);

    const footer = document.createElement("div");
    footer.className = "product-footer";

    const price = document.createElement("strong");
    price.className = "product-price";
    price.textContent = product.price || "Sob consulta";

    footer.append(price, createProductPurchaseControls(product));
    card.append(media, body, footer);
    productsGrid.append(card);
  });
}

function renderCatalogProducts() {
  if (window.catalogPage) { window.catalogPage.render(); return; }
  if (!productsGrid) {
    return;
  }

  productsGrid.replaceChildren();
  productsGrid.classList.toggle("is-list-view", activeProductsView === "list");
  productsGrid.classList.toggle("is-grid-view", activeProductsView === "grid");

  const products = sortCatalogProducts(visibleCatalogProducts());

  if (catalogResultsCount) {
    catalogResultsCount.textContent = `${products.length} ${products.length === 1 ? "produto" : "produtos"}`;
  }

  updateCatalogGuide(products);

  if (!products.length) {
    const empty = document.createElement("p");
    empty.className = "products-empty";
    empty.textContent = "Sem produtos para este filtro.";
    productsGrid.append(empty);
    return;
  }

  if (activeProductsView === "list") {
    renderCatalogProductsList(products);
    return;
  }

  renderCatalogProductsGrid(products);
}

function exportVisibleCatalogProducts() {
  const products = visibleCatalogProducts();

  if (!products.length) {
    return;
  }

  const headers = ["Marca", "Ref.", "SKU", "Modelo", "Descrição", "Categoria", "Preço", "URL"];
  const rows = products.map((product) => [
    product.brand,
    productInternalRef(product),
    product.sku,
    productModel(product),
    product.title,
    product.category,
    product.price || "Sob consulta",
    product.url,
  ]);
  const escapeCell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const content = [headers, ...rows].map((row) => row.map(escapeCell).join("\t")).join("\n");
  const blob = new Blob(["\ufeff", content], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const feedLabel = activeProductsFeed === "news" ? "novidades" : "acabados-de-chegar";

  link.href = url;
  link.download = `niposom-${feedLabel}.xls`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function loadCatalogProducts() {
  if (!productsGrid) {
    return;
  }

  if (Array.isArray(window.NIPOSOM_PRODUCTS)) {
    catalogProducts = window.NIPOSOM_PRODUCTS;
    buildCatalogSidebarFilters();
    renderCatalogProducts();
    return;
  }

  try {
    const response = await fetch("./assets/products.json", { cache: "no-store" });
    catalogProducts = await response.json();
    buildCatalogSidebarFilters();
    renderCatalogProducts();
  } catch {
    const empty = document.createElement("p");
    empty.className = "products-empty";
    empty.textContent = "Não foi possível carregar os produtos.";
    productsGrid.replaceChildren(empty);
  }
}

function getAsusMegaCategoryLabel(item) {
  return item.querySelector("[data-mega-button]")?.textContent.trim() || "Categoria";
}

function getAsusMegaFamilyTitle(section, categoryLabel, familyIndex) {
  const title = section.querySelector(":scope > h2");

  if (title?.textContent.trim()) {
    return title.textContent.trim();
  }

  const links = [...section.querySelectorAll(":scope > a")].filter((link) => link.textContent.trim());

  if (categoryLabel === "Marcas" && links.length) {
    const first = links[0].textContent.trim();
    const last = links[links.length - 1].textContent.trim();
    return first === last ? first : `${first} - ${last}`;
  }

  return `Família ${familyIndex + 1}`;
}

function getAsusMegaFeatureCards(categoryLabel) {
  const cards = {
    Hardware: [
      { title: "Motherboards e componentes", image: "./assets/business-hardware.webp", href: "#hardware" },
      { title: "Performance para builds", image: "./assets/hero-components.webp", href: "#hardware" },
    ],
    PC: [
      { title: "PC Office", image: "./assets/business-office.webp", href: "#pc" },
      { title: "NUC / Mini PC", image: "./assets/business-mini-pc.webp", href: "#pc" },
    ],
    Servidores: [
      { title: "Servidores", image: "./assets/business-servers.webp", href: "#servidores" },
      { title: "Soluções Data Center", image: "./assets/hero-data-center.webp", href: "#servidores" },
    ],
    Periféricos: [
      { title: "AIO all-in-one", image: "./assets/business-aio.webp", href: "#perifericos" },
      { title: "Tecnologia gaming", image: "./assets/business-gaming.webp", href: "#perifericos" },
    ],
    Redes: [
      { title: "Networking profissional", image: "./assets/hero-data-center.webp", href: "#redes" },
      { title: "Infraestrutura B2B", image: "./assets/business-servers.webp", href: "#redes" },
    ],
    Electrónica: [
      { title: "Componentes electrónicos", image: "./assets/business-hardware.webp", href: "#electronica" },
      { title: "AI Solutions", image: "./assets/business-ai.webp", href: "#electronica" },
    ],
    Marcas: [
      { title: "ASUS", image: "./assets/brand-logos/asus.jpg", href: "https://www.niposom.pt/index.php?option=com_virtuemart&page=shop.browse&manufacturer_id=8027&Itemid=64" },
      { title: "NTECH", image: "./assets/brand-logos/ntech.jpg", href: "https://www.niposom.pt/index.php?option=com_virtuemart&page=shop.browse&manufacturer_id=8019&Itemid=64" },
    ],
  };

  return cards[categoryLabel] || [
    { title: categoryLabel, image: "./assets/hero-components.webp", href: "#produtos" },
  ];
}

function createAsusMegaFeatureCard(card) {
  const link = document.createElement("a");
  link.className = "asus-feature-card";
  link.href = card.href;

  const image = document.createElement("img");
  image.src = card.image;
  image.alt = "";
  image.loading = "lazy";

  const title = document.createElement("span");
  title.textContent = card.title;

  link.append(image, title);
  return link;
}

function setupAsusMegaMenus() {
  megaItems.forEach((item) => {
    const menu = item.querySelector("[data-mega-menu]");
    const grid = menu?.querySelector(".mega-grid");

    if (!grid || grid.querySelector(".asus-mega-layout")) {
      return;
    }

    const categoryLabel = getAsusMegaCategoryLabel(item);
    const sections = [...grid.querySelectorAll(":scope > section")].filter((section) => {
      const hasTitle = Boolean(section.querySelector(":scope > h2")?.textContent.trim());
      const hasLinks = section.querySelectorAll(":scope > a").length > 0;
      return hasTitle || hasLinks;
    });

    if (!sections.length) {
      return;
    }

    grid.classList.add("is-asus-mega-source");

    const layout = document.createElement("div");
    layout.className = "asus-mega-layout";

    const families = document.createElement("div");
    families.className = "asus-family-list";
    families.setAttribute("role", "tablist");
    families.setAttribute("aria-label", `Famílias de ${categoryLabel}`);

    const series = document.createElement("div");
    series.className = "asus-series-panel";

    const seriesKicker = document.createElement("p");
    seriesKicker.className = "asus-series-kicker";
    seriesKicker.textContent = categoryLabel === "Marcas" ? "POR MARCA" : "POR FAMÍLIA / SUBFAMÍLIAS";

    const seriesTitle = document.createElement("h3");
    seriesTitle.className = "asus-series-title";

    const seriesLinks = document.createElement("div");
    seriesLinks.className = "asus-series-links";

    series.append(seriesKicker, seriesTitle, seriesLinks);

    const features = document.createElement("div");
    features.className = "asus-feature-panel";
    features.setAttribute("aria-label", `Destaques de ${categoryLabel}`);
    getAsusMegaFeatureCards(categoryLabel).forEach((card) => {
      features.append(createAsusMegaFeatureCard(card));
    });

    const familyButtons = [];

    const setActiveFamily = (activeIndex) => {
      const section = sections[activeIndex];
      const familyTitle = getAsusMegaFamilyTitle(section, categoryLabel, activeIndex);
      const titleLink = section.querySelector(":scope > h2 a");
      const sublinks = [...section.querySelectorAll(":scope > a")].filter((link) => link.textContent.trim());

      familyButtons.forEach((button, index) => {
        const isActive = index === activeIndex;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-selected", String(isActive));
      });

      seriesTitle.textContent = familyTitle;
      seriesLinks.replaceChildren();

      if (titleLink?.href) {
        const allLink = document.createElement("a");
        allLink.href = titleLink.href;
        allLink.textContent = `Ver tudo em ${familyTitle}`;
        allLink.className = "asus-series-main-link";
        seriesLinks.append(allLink);
      }

      if (!sublinks.length && titleLink?.href) {
        return;
      }

      sublinks.forEach((link) => {
        const itemLink = document.createElement("a");
        itemLink.href = link.href;
        itemLink.textContent = link.textContent.trim();
        seriesLinks.append(itemLink);
      });
    };

    sections.forEach((section, index) => {
      const familyTitle = getAsusMegaFamilyTitle(section, categoryLabel, index);
      const button = document.createElement("button");
      button.className = "asus-family-button";
      button.type = "button";
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", "false");
      button.textContent = familyTitle;

      button.addEventListener("click", (event) => {
        event.preventDefault();
        setActiveFamily(index);
      });

      familyButtons.push(button);
      families.append(button);
    });

    layout.append(families, series, features);
    grid.append(layout);
    setActiveFamily(0);
  });
}

function createMobileSubfamilyLink(link) {
  const item = document.createElement("a");
  item.href = link.href;
  item.textContent = link.textContent.trim();
  return item;
}

function createMobileFamilySection(section, categoryIndex, familyIndex, categoryLabel) {
  const family = document.createElement("details");
  family.className = "mobile-family";

  const title = section.querySelector("h2");
  const titleLink = title?.querySelector("a");
  const summary = document.createElement("summary");
  summary.textContent = title?.textContent.trim() || (categoryLabel === "Marcas" ? "Todas as marcas" : `Família ${familyIndex + 1}`);

  if (titleLink?.href) {
    summary.dataset.href = titleLink.href;
  }

  const links = [...section.querySelectorAll(":scope > a")].filter((link) => link.textContent.trim());

  if (!links.length && titleLink?.href) {
    const directLink = document.createElement("a");
    directLink.href = titleLink.href;
    directLink.textContent = summary.textContent;
    directLink.className = "mobile-direct-family-link";
    family.append(summary, directLink);
    return family;
  }

  const subfamilies = document.createElement("div");
  subfamilies.className = "mobile-subfamilies";
  subfamilies.id = `mobile-category-${categoryIndex}-family-${familyIndex}`;

  links.forEach((link) => {
    subfamilies.append(createMobileSubfamilyLink(link));
  });

  family.append(summary, subfamilies);
  return family;
}

function buildMobileCategoryMenu() {
  if (!desktopCategoryNav || !mobileCategoryMenu) {
    return;
  }

  const categoryItems = [...desktopCategoryNav.querySelectorAll(".category-inner > a, .category-inner > .nav-item")];
  // Keep brands in the drawer after moving its desktop menu to the upper bar.
  const brandsItem = document.querySelector("[data-corporate-nav] [data-mega-item]");
  if (brandsItem) categoryItems.splice(Math.max(0, categoryItems.length - 1), 0, brandsItem);
  mobileCategoryMenu.replaceChildren();

  categoryItems.forEach((item, categoryIndex) => {
    if (item.matches("a")) {
      const link = document.createElement("a");
      link.href = item.href;
      link.textContent = item.textContent.trim();
      mobileCategoryMenu.append(link);
      return;
    }

    const button = item.querySelector("[data-mega-button]");
    const sections = [...item.querySelectorAll("[data-mega-menu] section")];
    const category = document.createElement("details");
    category.className = "mobile-category";

    const summary = document.createElement("summary");
    summary.textContent = button?.textContent.trim() || `Categoria ${categoryIndex + 1}`;

    const families = document.createElement("div");
    families.className = "mobile-families";

    sections.forEach((section, familyIndex) => {
      families.append(createMobileFamilySection(section, categoryIndex, familyIndex, summary.textContent));
    });

    category.append(summary, families);
    mobileCategoryMenu.append(category);
  });
}

buildMobileCategoryMenu();
setupAsusMegaMenus();
addMegaCloseButtons();

if (mobileCategoryMenu) {
  mobileCategoryMenu.addEventListener(
    "toggle",
    (event) => {
      const panel = event.target;

      if (!(panel instanceof HTMLDetailsElement) || !panel.open) {
        return;
      }

      const selector = panel.classList.contains("mobile-category") ? ".mobile-category" : ".mobile-family";
      const scope = panel.classList.contains("mobile-category")
        ? mobileCategoryMenu
        : panel.closest(".mobile-families");

      scope?.querySelectorAll(selector).forEach((sibling) => {
        if (sibling !== panel) {
          sibling.removeAttribute("open");
        }
      });
    },
    true
  );
}

renderCart();
loadCatalogProducts();
setupPromosCarousel();
setupBrandsCarousel();

if (heroCarousel && heroSlides.length > 1) {
  setHeroSlide(0);
  restartHeroTimer();

  heroPrev?.addEventListener("click", () => {
    setHeroSlide(activeHeroSlide - 1);
    restartHeroTimer();
  });

  heroNext?.addEventListener("click", () => {
    nextHeroSlide();
    restartHeroTimer();
  });

  heroDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      setHeroSlide(index);
      restartHeroTimer();
    });
  });

  heroCarousel.addEventListener("mouseenter", () => {
    window.clearInterval(heroTimer);
  });

  heroCarousel.addEventListener("mouseleave", restartHeroTimer);

  reduceMotion.addEventListener("change", restartHeroTimer);
}

document.querySelectorAll("[data-mobile-menu-close], [data-mobile-menu-backdrop]").forEach((button) => {
  button.addEventListener("click", () => setMobileMenu(false));
});

if (mobileToggle && mobileMenu) {
  mobileToggle.addEventListener("click", () => {
    setMobileMenu(!siteHeader.classList.contains("is-mobile-open"));
    setLookupPanel(false);
    setSearchPreview(false);
    setAccountPanel(false);
    setCartPanel(false);
    closeMegaMenus();
  });

  mobileMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setMobileMenu(false);
    }
  });
}

if (lookupToggle && lookupPanel) {
  lookupToggle.addEventListener("click", (event) => {
    event.preventDefault();
    setLookupPanel(!lookupPanel.classList.contains("is-open"));
    setSearchPreview(false);
    setAccountPanel(false);
    setCartPanel(false);
    closeMegaMenus();
  });

  lookupOptions.forEach((option) => {
    option.addEventListener("click", () => {
      setLookupMode(option);
      setLookupPanel(false);
    });
  });
}

if (mobileLookupToggle && mobileLookupPanel) {
  mobileLookupToggle.addEventListener("click", (event) => {
    event.preventDefault();
    setMobileLookupPanel(!mobileLookupPanel.classList.contains("is-open"));
  });

  mobileLookupOptions.forEach((option) => {
    option.addEventListener("click", () => {
      setMobileLookupMode(option);
      setMobileLookupPanel(false);
    });
  });
}

mobileQuickToggle?.addEventListener("click", () => {
  setMobileQuickCart(!mobileQuickCart?.classList.contains("is-open"));
});

megaItems.forEach((item) => {
  const button = item.querySelector("[data-mega-button]");

  button.addEventListener("click", (event) => {
    event.preventDefault();
    item.classList.remove("is-suppressed");
    toggleMegaMenu(item);
    setLookupPanel(false);
    setSearchPreview(false);
    setAccountPanel(false);
    setCartPanel(false);
    setMobileMenu(false);
  });


});

accountToggles.forEach((button) => {
  button.addEventListener("click", () => {
    setAccountPanel(!accountPanel.classList.contains("is-open"));
    setLookupPanel(false);
    setSearchPreview(false);
    setCartPanel(false);
    setMobileMenu(false);
    closeMegaMenus();
  });
});

cartToggles.forEach((button) => {
  button.addEventListener("click", () => {
    setCartPanel(!cartPanel.classList.contains("is-open"));
    setLookupPanel(false);
    setSearchPreview(false);
    setAccountPanel(false);
    setMobileMenu(false);
    closeMegaMenus();
  });
});

checkoutButton?.addEventListener("click", () => {
  if (!cartState.length) {
    return;
  }

  window.location.hash = "checkout";
});

if (accountForm) {
  accountForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

document.querySelectorAll("[data-quick-cart]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const skuInput = form.elements.sku;
    const quantity = Math.max(1, Number(form.elements.qty.value) || 1);
    const button = form.querySelector(".add-button");

    if (!skuInput.value.trim()) {
      skuInput.reportValidity();
      return;
    }

    window.clearTimeout(form.addedStateTimer);
    const buttonLabel = button.querySelector("[data-add-label]") || button;
    buttonLabel.textContent = form.classList.contains("quick-cart") ? "✓" : `Adicionado x${quantity}`;
    button.classList.add("is-added");
    addCartItem(productFromQuickCart(form));

    form.addedStateTimer = window.setTimeout(() => {
      buttonLabel.textContent = button.dataset.label;
      button.classList.remove("is-added");
    }, 1800);
  });
});

document.querySelectorAll('form[role="search"]:not([data-products-search])').forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const isMobileSearch = form.hasAttribute("data-mobile-lookup-form");

    performHeaderSearch(form);

    if (isMobileSearch) {
      setSearchPreview(false);
      productsModule?.scrollIntoView({ block: "start" });
    }

    setMobileMenu(false);
  });
});

productsSearchForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  renderCatalogProducts();
});

productsSearchInput?.addEventListener("input", renderCatalogProducts);

productsModule?.addEventListener("change", (event) => {
  const input = event.target.closest("[data-catalog-filter]");

  if (!input) {
    return;
  }

  const filter = input.dataset.catalogFilter;
  const selected = activeCatalogFilters[filter];

  if (input.checked) {
    selected.add(input.value);
  } else {
    selected.delete(input.value);
  }

  if (filter === "family") {
    buildCatalogSidebarFilters();
  }

  renderCatalogProducts();
});

catalogClearButton?.addEventListener("click", () => {
  Object.values(activeCatalogFilters).forEach((selected) => selected.clear());
  activeCatalogBrand = "";
  activeCatalogPriceRange = "";
  activeCatalogAvailability = false;
  activeCatalogTextFilters.clear();
  productsModule.querySelectorAll("[data-catalog-filter]").forEach((input) => {
    input.checked = false;
  });

  if (productsSearchInput) {
    productsSearchInput.value = "";
  }

  if (catalogBrandSelect) {
    catalogBrandSelect.value = "";
  }

  if (catalogPriceRange) {
    catalogPriceRange.value = "";
  }

  if (catalogAvailability) {
    catalogAvailability.checked = false;
  }

  catalogTextFilters.forEach((select) => {
    select.value = "";
  });

  setActiveProductsFilter("Todos");
  buildCatalogSidebarFilters();
  renderCatalogProducts();
});

catalogSort?.addEventListener("change", () => {
  activeCatalogSort = catalogSort.value;
  renderCatalogProducts();
});

catalogBrandSelect?.addEventListener("change", () => {
  activeCatalogBrand = catalogBrandSelect.value;
  renderCatalogProducts();
});

catalogPriceRange?.addEventListener("change", () => {
  activeCatalogPriceRange = catalogPriceRange.value;
  renderCatalogProducts();
});

catalogAvailability?.addEventListener("change", () => {
  activeCatalogAvailability = catalogAvailability.checked;
  renderCatalogProducts();
});

catalogTextFilters.forEach((select) => {
  select.addEventListener("change", () => {
    activeCatalogTextFilters.clear();
    catalogTextFilters.forEach((item) => {
      if (item.value) {
        activeCatalogTextFilters.add(item.value);
      }
    });
    renderCatalogProducts();
  });
});

catalogApplyButton?.addEventListener("click", renderCatalogProducts);

catalogTopFilterToggle?.addEventListener("click", () => {
  const isCollapsed = !catalogTopFilterShell?.classList.contains("is-collapsed");
  setCatalogTopFiltersCollapsed(isCollapsed);
});

catalogTopFilterClose?.addEventListener("click", () => {
  setCatalogTopFiltersCollapsed(true);
});

catalogSidebarToggle?.addEventListener("click", () => {
  setCatalogSidebar(!productsModule?.classList.contains("is-catalog-sidebar-open"));
});

catalogSidebarClose?.addEventListener("click", () => {
  setCatalogSidebar(false);
});

catalogSidebarBackdrop?.addEventListener("click", () => {
  setCatalogSidebar(false);
});

footerToggles.forEach((button) => {
  button.addEventListener("click", () => {
    const column = button.closest(".footer-column");
    const isOpen = column?.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

newsletterForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!newsletterForm.reportValidity()) {
    return;
  }

  newsletterButton.textContent = "Subscrito";
  newsletterButton.classList.add("is-complete");
  newsletterFeedback.textContent = "Obrigado. Vai receber as novidades Niposom no seu email.";
  newsletterForm.reset();

  window.setTimeout(() => {
    newsletterButton.textContent = "Subscrever";
    newsletterButton.classList.remove("is-complete");
  }, 2600);
});

productsFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveProductsFilter(button.dataset.productsFilter);
    buildCatalogSidebarFilters();
    renderCatalogProducts();
  });
});

productsFeedButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveProductsFeed(button.dataset.productsFeed);
    buildCatalogSidebarFilters();
    renderCatalogProducts();
  });
});

productsModule?.addEventListener("click", (event) => {
  const feedButton = event.target.closest("[data-products-feed]");

  if (!feedButton || !productsModule.contains(feedButton)) {
    return;
  }

  setActiveProductsFeed(feedButton.dataset.productsFeed);
  renderCatalogProducts();
});

productsViewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveProductsView(button.dataset.productsView);
    renderCatalogProducts();
  });
});

productsPeriod?.addEventListener("change", renderCatalogProducts);

productsExportButton?.addEventListener("click", exportVisibleCatalogProducts);

productsCollapseButton?.addEventListener("click", () => {
  const isCollapsed = productsCard?.classList.toggle("is-collapsed");
  productsCollapseButton.setAttribute("aria-expanded", String(!isCollapsed));
  productsCollapseButton.setAttribute("aria-label", isCollapsed ? "Expandir produtos" : "Recolher produtos");
});

document.addEventListener("click", (event) => {
  const clickedInsideHeader = event.target.closest("[data-site-header]");
  const clickedInsideCatalog = event.target.closest("[data-products-module]");
  const clickedInsideLookup = event.target.closest("[data-lookup-form], [data-mobile-lookup-form]");

  if (!clickedInsideHeader) {
    setLookupPanel(false);
    setMobileLookupPanel(false);
    setSearchPreview(false);
    setAccountPanel(false);
    setCartPanel(false);
    closeMegaMenus();
    setMobileMenu(false);

    if (!clickedInsideCatalog) {
      setCatalogSidebar(false);
    }

    return;
  }

  if (!clickedInsideLookup) {
    setLookupPanel(false);
    setMobileLookupPanel(false);
    setSearchPreview(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setLookupPanel(false);
    setMobileLookupPanel(false);
    setSearchPreview(false);
    setAccountPanel(false);
    setCartPanel(false);
    closeMegaMenus();
    setMobileMenu(false);
    setCatalogSidebar(false);
    setCatalogTopFiltersCollapsed(true);
  }
});

window.matchMedia("(min-width: 1041px)").addEventListener("change", (event) => {
  if (event.matches) {
    setMobileMenu(false);
  }
});

setCatalogTopFiltersCollapsed(true);


