(() => {
  const ready = (callback) => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', callback, { once: true }) : callback();
  ready(() => {

    // Homepage editorial slider: manual controls, autoplay, keyboard and reduced-motion support.
    document.querySelectorAll('[data-siq-slider]').forEach(slider => {
      const slides = [...slider.querySelectorAll('[data-siq-slide]')];
      const dots = [...slider.querySelectorAll('[data-siq-dot]')];
      if (slides.length < 2) return;
      let active = Math.max(0, slides.findIndex(s => s.classList.contains('is-active')));
      let timer;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const show = index => {
        active = (index + slides.length) % slides.length;
        slides.forEach((slide, i) => { const on = i === active; slide.classList.toggle('is-active', on); slide.setAttribute('aria-hidden', String(!on)); });
        dots.forEach((dot, i) => { const on = i === active; dot.classList.toggle('is-active', on); dot.setAttribute('aria-current', String(on)); });
      };
      const stop = () => { if (timer) window.clearInterval(timer); timer = undefined; };
      const start = () => { stop(); if (!reduced && !document.hidden) timer = window.setInterval(() => show(active + 1), 6000); };
      slider.querySelector('[data-siq-prev]')?.addEventListener('click', () => { show(active - 1); start(); });
      slider.querySelector('[data-siq-next]')?.addEventListener('click', () => { show(active + 1); start(); });
      dots.forEach(dot => dot.addEventListener('click', () => { show(Number(dot.dataset.siqDot)); start(); }));
      slider.addEventListener('mouseenter', stop); slider.addEventListener('mouseleave', start);
      slider.addEventListener('focusin', stop); slider.addEventListener('focusout', start);
      document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
      slider.addEventListener('keydown', event => { if (event.key === 'ArrowLeft') { show(active - 1); start(); } if (event.key === 'ArrowRight') { show(active + 1); start(); } });
      show(active); start();
    });
    const toggle = document.querySelector('[data-menu-toggle]');
    const menu = document.querySelector('[data-menu]');
    if (toggle && menu) {
      const closeMenu = () => { menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open menu'); };
      toggle.addEventListener('click', () => {
        const open = menu.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      });
      menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
      document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
      document.addEventListener('click', event => { if (!event.target.closest('[data-site-header]')) closeMenu(); });
      const desktop = window.matchMedia('(min-width: 701px)');
      desktop.addEventListener?.('change', event => { if (event.matches) closeMenu(); });
    }

    const variantSelect = document.querySelector('[data-variant-select]');
    if (variantSelect) {
      const priceNode = document.querySelector('[data-product-price]');
      const addButton = document.querySelector('[data-add-button]');
      const formatMoney = cents => {
        const amount = Number(cents || 0) / 100;
        const format = priceNode?.dataset.moneyFormat || '{{amount}}';
        const pieces = amount.toFixed(2).split('.');
        const grouped = pieces[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const noDecimals = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const replacements = [
          [/\{\{\s*amount_no_decimals_with_comma_separator\s*\}\}/g, noDecimals.replace(/,/g, '.')],
          [/\{\{\s*amount_with_comma_separator\s*\}\}/g, grouped.replace(/,/g, 'X').replace(/\./g, ',').replace(/X/g, '.')],
          [/\{\{\s*amount_no_decimals\s*\}\}/g, noDecimals],
          [/\{\{\s*amount\s*\}\}/g, `${grouped}.${pieces[1]}`]
        ];
        return replacements.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), format);
      };
      const updateVariant = () => {
        const option = variantSelect.selectedOptions[0];
        if (!option) return;
        const available = option.dataset.available === 'true';
        const price = formatMoney(option.dataset.price);
        if (priceNode) {
          priceNode.textContent = price;
          const compare = Number(option.dataset.comparePrice || 0);
          if (compare > Number(option.dataset.price || 0)) {
            const oldPrice = document.createElement('s');
            oldPrice.textContent = formatMoney(compare);
            priceNode.append(' ', oldPrice);
          }
        }
        if (addButton) { addButton.disabled = !available; addButton.textContent = available ? `Add to bag — ${price}` : 'Sold out'; }
      };
      variantSelect.addEventListener('change', updateVariant);
    }

    const sort = document.querySelector('[data-sort-select]');
    if (sort) sort.addEventListener('change', () => sort.form?.submit());

    const form = document.querySelector('[data-stylist-form]');
    if (form) {
      const cards = [...document.querySelectorAll('.stylist-product')];
      const target = document.querySelector('[data-stylist-products]');
      const message = document.querySelector('[data-stylist-message]');
      form.addEventListener('submit', event => {
        event.preventDefault();
        if (!target || !message) return;
        const data = new FormData(form);
        const budget = Number(data.get('budget') || 10000);
        const occasion = String(data.get('occasion') || '').toLowerCase();
        const style = String(data.get('style') || '').toLowerCase();
        let visible = 0;
        cards.forEach(card => {
          const price = Number(card.dataset.price || 0);
          const tags = `${card.dataset.tags || ''},${card.dataset.type || ''}`.replaceAll('_','-');
          const withinBudget = budget === 2000 ? price < 2000 : budget === 5000 ? price >= 2000 && price <= 5000 : price > 5000;
          const occasionTerms = ({'everyday':['everyday','casual','tee','t-shirt','shirt','jeans','trouser'],'workwear':['workwear','formal','blazer','shirt','trouser','tailored'],'date night':['date-night','evening','dress','blazer','satin','heels'],'special occasion':['occasion','evening','dress','heels','blazer']})[occasion] || [occasion.replaceAll(' ','-')];
          const styleTerms = ({'minimal':['minimal','clean','essential','neutral','linen'],'casual':['casual','relaxed','oversized','tee','hoodie','denim'],'formal':['formal','tailored','blazer','trouser','shirt'],'trend-led':['trend','cropped','wide-leg','cargo','satin','statement']})[style] || [style];
          const occasionMatch = occasionTerms.some(term => tags.includes(term));
          const styleMatch = styleTerms.some(term => tags.includes(term));
          const score = (occasionMatch ? 2 : 0) + (styleMatch ? 2 : 0) + (withinBudget ? 1 : 0);
          card.dataset.matchScore = String(score);
          card.hidden = !withinBudget;
          if (withinBudget) visible++;
        });
        cards.sort((a, b) => Number(b.dataset.matchScore || 0) - Number(a.dataset.matchScore || 0)).forEach(card => target.appendChild(card));
        message.textContent = visible ? `Your ${style.replace('-', ' ')} ${occasion} edit is ready: ${visible} available catalogue item${visible === 1 ? '' : 's'} match your budget. Recommendations use your Shopify product tags and categories.` : 'No pieces in that price range yet. Try another budget or explore the full collection.';
        target.classList.toggle('has-results', visible > 0);
        const firstVisible = cards.find(card => !card.hidden);
        if (firstVisible) firstVisible.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
      });
    }
  });

  // Native Shopify carousel controls and subtle pointer-reactive material warp.
  document.querySelectorAll('[data-siq-carousel]').forEach(section => {
    const track = section.querySelector('[data-siq-track]');
    const prev = section.querySelector('[data-siq-prev]');
    const next = section.querySelector('[data-siq-next]');
    const step = () => Math.max(240, (track?.querySelector('.siq-slide')?.getBoundingClientRect().width || 280) + 20);
    prev?.addEventListener('click', () => track?.scrollBy({left:-step(),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
    next?.addEventListener('click', () => track?.scrollBy({left:step(),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
    if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      section.addEventListener('pointermove', e => { const r=section.getBoundingClientRect(); section.style.setProperty('--pointer-x', `${((e.clientX-r.left)/r.width)*100}%`); section.style.setProperty('--pointer-y', `${((e.clientY-r.top)/r.height)*100}%`); section.classList.add('is-warping'); });
      section.addEventListener('pointerleave', () => section.classList.remove('is-warping'));
    }
  });


  // Animated gallery: directional controls, progress indicator and drag-to-scroll.
  document.querySelectorAll('[data-siq-gallery]').forEach(section => {
    const track = section.querySelector('[data-gallery-track]');
    const prev = section.querySelector('[data-gallery-prev]');
    const next = section.querySelector('[data-gallery-next]');
    const progress = section.querySelector('[data-gallery-progress]');
    const step = () => Math.max(230, (track?.querySelector('.siq-gallery-card')?.getBoundingClientRect().width || 280) + 18);
    const update = () => { if (!track || !progress) return; const max = Math.max(1, track.scrollWidth - track.clientWidth); progress.style.width = `${Math.min(100, Math.max(12, (track.scrollLeft / max) * 80 + 20))}%`; };
    prev?.addEventListener('click', () => track?.scrollBy({left:-step(),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
    next?.addEventListener('click', () => track?.scrollBy({left:step(),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
    track?.addEventListener('scroll', update, {passive:true}); window.addEventListener('resize', update); update();
    if (track && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      let down=false,startX=0,startLeft=0;
      track.addEventListener('pointerdown',e=>{ if(e.target.closest('a,button')) return; down=true;startX=e.clientX;startLeft=track.scrollLeft;track.classList.add('is-dragging');track.setPointerCapture?.(e.pointerId); });
      track.addEventListener('pointermove',e=>{if(down)track.scrollLeft=startLeft-(e.clientX-startX);});
      const release=()=>{down=false;track.classList.remove('is-dragging');}; track.addEventListener('pointerup',release);track.addEventListener('pointercancel',release);track.addEventListener('pointerleave',release);
    }
  });

})();


/* STYLEIQ Ajax shopping layer — Shopify Ajax Cart API */
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const money = cents => new Intl.NumberFormat(document.documentElement.lang || 'en-IN', { style:'currency', currency:(window.Shopify && Shopify.currency && Shopify.currency.active) || 'INR', maximumFractionDigits:2 }).format((Number(cents)||0)/100);
  const drawer = $('[data-siq-cart-drawer]');
  const overlay = $('[data-siq-overlay]');
  const qv = $('[data-siq-quickview]');
  const qvContent = $('[data-siq-qv-content]');
  let lastFocus = null;
  let qvProduct = null;
  let qvVariant = null;
  let toastTimer;
  const shippingThreshold = 250000; // ₹2,500 in paise; adjust to your store's shipping policy.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const announce = message => {
    let node = $('[data-siq-toast]');
    if (!node) { node = document.createElement('div'); node.className='siq-toast'; node.dataset.siqToast=''; node.setAttribute('role','status'); node.setAttribute('aria-live','polite'); document.body.appendChild(node); }
    node.textContent = message; node.classList.add('is-visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => node.classList.remove('is-visible'), 2800);
  };
  const lock = state => document.body.classList.toggle('siq-lock-scroll', state);
  const showOverlay = () => { if (overlay) { overlay.hidden=false; requestAnimationFrame(() => overlay.classList.add('is-active')); } };
  const hideOverlay = () => { if (overlay) { overlay.classList.remove('is-active'); overlay.hidden=true; } };
  const openDrawer = async () => {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden','false');
    showOverlay(); lock(true); await renderCart(); $('[data-siq-close]', drawer)?.focus({preventScroll:true});
  };
  const closePanels = () => {
    drawer?.classList.remove('is-open'); drawer?.setAttribute('aria-hidden','true');
    qv?.classList.remove('is-open'); qv?.setAttribute('aria-hidden','true');
    hideOverlay(); lock(false); if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus({preventScroll:true});
  };
  const request = async (url, options={}) => {
    const response = await fetch(url, { credentials:'same-origin', headers:{'Accept':'application/json', ...(options.body instanceof FormData ? {} : {'Content-Type':'application/json'}), ...(options.headers||{})}, ...options });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.description || data.message || 'Something went wrong. Please try again.');
    return data;
  };
  const getCart = () => request(`${window.Shopify?.routes?.root || '/'}cart.js`);
  const updateHeaderCount = count => {
    $$('.cart-count').forEach(node => { node.textContent=String(count); node.classList.remove('siq-cart-count-bump'); void node.offsetWidth; node.classList.add('siq-cart-count-bump'); });
    $$('[data-siq-cart-count]').forEach(node => node.textContent=`(${count})`);
    $$('[aria-label^="Shopping bag"]').forEach(node => node.setAttribute('aria-label',`Shopping bag, ${count} items`));
  };
  const renderUpsells = () => {
    const target = $('[data-siq-upsells]'); if (!target) return;
    const cards = $$('.product-card').slice(0,5);
    target.innerHTML = cards.map(card => {
      const link = $('.product-name',card); const img = $('.product-image img',card); const form = $('[data-quick-add-form]',card); const id = $('input[name="id"]',form)?.value;
      if (!link || !id) return '';
      return `<div class="siq-upsell-item">${img ? `<a href="${link.href}"><img src="${img.currentSrc || img.src}" alt="${link.textContent.trim().replace(/"/g,'&quot;')}" loading="lazy"></a>`:''}<a href="${link.href}">${link.textContent.trim()}</a><button type="button" data-siq-upsell-add data-variant-id="${id}">＋ Quick add</button></div>`;
    }).join('');
    if (!target.innerHTML) target.innerHTML='<a href="/collections/all">Explore the full collection ↗</a>';
  };
  const renderCart = async () => {
    if (!drawer) return;
    const itemsNode = $('[data-siq-cart-items]',drawer);
    try {
      const cart = await getCart();
      updateHeaderCount(cart.item_count);
      $('[data-siq-cart-subtotal]',drawer).textContent=money(cart.total_price);
      const remaining = Math.max(0, shippingThreshold-cart.total_price);
      const percent = Math.min(100,cart.total_price/shippingThreshold*100);
      $('[data-siq-shipping-progress]',drawer).style.width=`${percent}%`;
      $('[data-siq-shipping-copy]',drawer).textContent=remaining===0 ? '✨ Complimentary shipping unlocked.' : `Add ${money(remaining)} more for complimentary shipping.`;
      if (!cart.items.length) {
        itemsNode.innerHTML='<div class="siq-empty-bag"><p>Your bag is taking a little breather.</p><a href="/collections/all">Find something you love ↗</a></div>';
        $('[data-siq-checkout]',drawer).textContent='Explore the collection →'; $('[data-siq-checkout]',drawer).href='/collections/all';
      } else {
        itemsNode.innerHTML=cart.items.map((item,index)=>`<article class="siq-cart-line"><a href="${item.url}"><img src="${item.image || ''}" alt="${String(item.product_title).replace(/"/g,'&quot;')}" loading="lazy"></a><div><a class="siq-cart-line-title" href="${item.url}">${item.product_title}</a><div class="siq-cart-line-variant">${item.variant_title && item.variant_title!=='Default Title' ? item.variant_title : 'STYLEIQ essential'}</div><div class="siq-cart-line-price">${money(item.final_line_price)}</div><div class="siq-line-quantity"><button type="button" data-siq-change data-line="${index+1}" data-quantity="${Math.max(0,item.quantity-1)}" aria-label="Decrease ${item.product_title} quantity">−</button><span>${item.quantity}</span><button type="button" data-siq-change data-line="${index+1}" data-quantity="${item.quantity+1}" aria-label="Increase ${item.product_title} quantity">＋</button></div><button type="button" class="siq-remove" data-siq-change data-line="${index+1}" data-quantity="0">Remove</button></div><div class="siq-cart-line-price">${money(item.final_price)}</div></article>`).join('');
        $('[data-siq-checkout]',drawer).textContent='Secure checkout'; $('[data-siq-checkout]',drawer).href='/checkout';
      }
      renderUpsells();
    } catch(error) { itemsNode.innerHTML=`<p class="siq-cart-loading">${error.message}</p><a href="/cart">Open your bag ↗</a>`; }
  };
  const addItem = async (variantId, quantity=1, button=null) => {
    if (!variantId) throw new Error('Please select an available option.');
    const original = button?.innerHTML;
    if (button) { button.disabled=true; button.classList.add('siq-loading'); button.innerHTML='<span class="siq-spinner" aria-hidden="true"></span> Adding to bag…'; }
    try {
      const root = window.Shopify?.routes?.root || '/';
      await request(`${root}cart/add.js`, {method:'POST',body:JSON.stringify({items:[{id:Number(variantId),quantity:Math.max(1,Number(quantity)||1)}]})});
      if (button) { button.classList.remove('siq-loading'); button.innerHTML='✓ Added to bag'; }
      await renderCart();
      setTimeout(() => openDrawer(), 120);
      setTimeout(() => { if(button) { button.disabled=false; button.innerHTML=original || 'Add to bag'; } }, 1400);
      return true;
    } catch(error) {
      announce(error.message || 'Unable to add this item.');
      if (button) { button.disabled=false; button.classList.remove('siq-loading'); button.innerHTML=original || 'Add to bag'; }
      return false;
    }
  };
  const optionValues = product => (product.options || []).map((name,index)=>({name,values:[...new Set(product.variants.map(v=>v.options[index]))]}));
  const selectedOptions = () => $$('.siq-qv-option-values',qvContent).map(group=>$('.is-selected',group)?.dataset.value || '');
  const matchingVariant = values => qvProduct?.variants.find(v=>v.options.every((option,index)=>option===values[index]));
  const paintVariant = variant => {
    if (!variant) return;
    qvVariant=variant;
    const price=$('[data-siq-qv-price]',qvContent); if(price) price.textContent=money(variant.price);
    const stock=$('[data-siq-qv-stock]',qvContent); if(stock) { stock.textContent=variant.available?'✦ In stock · Ready for your edit':'Currently unavailable'; stock.classList.toggle('is-sold-out',!variant.available); }
    const add=$('[data-siq-qv-add]',qvContent); if(add) add.disabled=!variant.available;
    const buy=$('[data-siq-qv-buy]',qvContent); if(buy) buy.disabled=!variant.available;
    const img=$('[data-siq-qv-image]',qvContent); const src=variant.featured_image?.src || qvProduct.images?.[0]; if(img && src) img.src=src;
  };
  const openQuickView = async handle => {
    if (!qv || !qvContent) return;
    lastFocus=document.activeElement; qvContent.innerHTML='<div class="siq-qv-loading">Loading your edit…</div>';
    qv.classList.add('is-open'); qv.setAttribute('aria-hidden','false'); showOverlay(); lock(true);
    try {
      const root=window.Shopify?.routes?.root || '/';
      qvProduct=await request(`${root}products/${encodeURIComponent(handle)}.js`);
      const variants=optionValues(qvProduct);
      const initial=qvProduct.variants.find(v=>v.available) || qvProduct.variants[0];
      qvVariant=initial;
      const image=initial?.featured_image?.src || qvProduct.images?.[0] || '';
      const description=(qvProduct.description || '').replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().slice(0,250);
      const optionMarkup=variants.map((option,index)=>`<div class="siq-qv-option"><span class="siq-qv-option-label">${option.name}</span><div class="siq-qv-option-values" data-option-index="${index}">${option.values.map(value=>`<button type="button" data-value="${String(value).replace(/"/g,'&quot;')}" class="${initial?.options[index]===value?'is-selected':''}">${value}</button>`).join('')}</div></div>`).join('');
      qvContent.innerHTML=`<div class="siq-qv-image"><img data-siq-qv-image src="${image}" alt="${qvProduct.title.replace(/"/g,'&quot;')}"></div><div class="siq-qv-info"><span class="siq-kicker">THE STYLEIQ EDIT</span><h2>${qvProduct.title}</h2><div class="siq-qv-price" data-siq-qv-price>${money(initial?.price)}</div><div class="siq-qv-description">${description}</div><div class="siq-qv-options">${optionMarkup}</div><div class="siq-qv-stock" data-siq-qv-stock></div><div class="siq-qv-actions"><button type="button" class="button button-dark full-button" data-siq-qv-add>Add to bag</button><button type="button" class="siq-buy-now" data-siq-qv-buy>Buy now ↗</button></div><a class="siq-qv-view-link" href="${qvProduct.url}">View full details & fit notes ↗</a></div>`;
      $$('.siq-qv-option-values button',qvContent).forEach(button=>button.addEventListener('click',()=>{
        const group=button.closest('[data-option-index]'); const index=Number(group.dataset.optionIndex);
        $$('button',group).forEach(b=>b.classList.toggle('is-selected',b===button));
        const values=selectedOptions(); const variant=matchingVariant(values);
        $$('[data-option-index]',qvContent).forEach((g,gi)=>$$('button',g).forEach(b=>{ const proposed=[...values]; proposed[gi]=b.dataset.value; const match=matchingVariant(proposed); b.disabled=!match || !match.available; }));
        if(variant) paintVariant(variant); else { const add=$('[data-siq-qv-add]',qvContent); if(add) add.disabled=true; const stock=$('[data-siq-qv-stock]',qvContent); if(stock){stock.textContent='This combination is unavailable';stock.classList.add('is-sold-out');} }
      }));
      $('[data-siq-qv-add]',qvContent).addEventListener('click',e=>addItem(qvVariant?.id,1,e.currentTarget));
      $('[data-siq-qv-buy]',qvContent).addEventListener('click',async e=>{ if(!qvVariant?.available)return; e.currentTarget.disabled=true; const ok=await addItem(qvVariant.id,1,e.currentTarget); if(ok) window.location.href='/checkout'; });
      paintVariant(initial);
      $('[data-siq-qv-close]')?.focus({preventScroll:true});
    } catch(error) { qvContent.innerHTML=`<div class="siq-qv-error">We couldn't load this product. <a href="/products/${encodeURIComponent(handle)}">View product ↗</a></div>`; }
  };
  document.addEventListener('click', async event => {
    const qvButton=event.target.closest('[data-siq-quickview-trigger]');
    if(qvButton) { event.preventDefault(); openQuickView(qvButton.dataset.handle); return; }
    if(event.target.closest('[data-siq-close],[data-siq-qv-close]') || event.target===overlay) { closePanels(); return; }
    const change=event.target.closest('[data-siq-change]');
    if(change) { change.disabled=true; try { await request(`${window.Shopify?.routes?.root || '/'}cart/change.js`,{method:'POST',body:JSON.stringify({line:Number(change.dataset.line),quantity:Number(change.dataset.quantity)})}); await renderCart(); } catch(error) { announce(error.message); } return; }
    const upsell=event.target.closest('[data-siq-upsell-add]');
    if(upsell) { addItem(upsell.dataset.variantId,1,upsell); return; }
    const qtyStep=event.target.closest('[data-qty-step]');
    if(qtyStep) { const input=$('[data-product-quantity]'); if(input) input.value=Math.max(1,Number(input.value||1)+Number(qtyStep.dataset.qtyStep)); return; }
    if(event.target.closest('[data-siq-size-guide]')) { const copy=$('[data-siq-size-copy]'); if(copy) copy.hidden=!copy.hidden; return; }
    if(event.target.closest('[data-siq-mobile-add]')) { const form=$('[data-product-form], #ProductForm'); const id=$('[name="id"]',form)?.value; addItem(id,$('[data-product-quantity]',form)?.value || 1,event.target.closest('[data-siq-mobile-add]')); return; }
    if(event.target.closest('[data-buy-now]')) { const form=$('[data-product-form], #ProductForm'); const id=$('[name="id"]',form)?.value; const button=event.target.closest('[data-buy-now]'); const ok=await addItem(id,$('[data-product-quantity]',form)?.value || 1,button); if(ok) window.location.href='/checkout'; }
  });
  document.addEventListener('submit', async event => {
    const form=event.target;
    if(form.matches('[data-quick-add-form]')) { event.preventDefault(); const button=$('[type="submit"]',form); await addItem($('[name="id"]',form)?.value,$('[name="quantity"]',form)?.value || 1,button); }
    if((form.matches('[data-product-form]') || form.id==='ProductForm')) { event.preventDefault(); const button=$('[data-add-button]',form); await addItem($('[name="id"]',form)?.value,$('[name="quantity"]',form)?.value || 1,button); }
  });
  document.addEventListener('change', event => {
    if(event.target.matches('[data-variant-select]')) {
      const option=event.target.selectedOptions[0]; const price=money(option?.dataset.price); const mobile=$('[data-siq-mobile-price]'); if(mobile) mobile.textContent=price;
      const mobileAdd=$('[data-siq-mobile-add]'); if(mobileAdd) mobileAdd.disabled=option?.dataset.available!=='true';
    }
  });
  document.addEventListener('keydown', event => { if(event.key==='Escape' && (drawer?.classList.contains('is-open') || qv?.classList.contains('is-open'))) closePanels(); });
  if (overlay) overlay.hidden=true;
  renderUpsells();
  if (drawer) { getCart().then(cart=>updateHeaderCount(cart.item_count)).catch(()=>{}); }
  const mobileBar=$('[data-siq-mobile-buybar]');
  if(mobileBar && $('[data-siq-product-page]')) {
    const form=$('[data-product-form], #ProductForm'); const atc=$('[data-add-button]');
    const observer=new IntersectionObserver(entries=>{ const entry=entries[0]; mobileBar.classList.toggle('is-visible',!entry.isIntersecting && entry.boundingClientRect.top < 0 && window.scrollY>250); },{threshold:.05});
    if(atc) observer.observe(atc);
    window.addEventListener('scroll',()=>{ if(window.scrollY<180) mobileBar.classList.remove('is-visible'); },{passive:true});
  }
})();
