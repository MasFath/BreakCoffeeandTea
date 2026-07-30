// Preloader
  window.addEventListener('load', () => {
    document.getElementById('preloader').classList.add('hide');
  });

  AOS.init({ once: true, duration: 800, easing: 'ease-out-cubic' });

  // Navbar solid on scroll
  const navbar = document.getElementById('navbar');
  const backTop = document.getElementById('backTop');
  window.addEventListener('scroll', () => {
    if(window.scrollY > 60){ navbar.classList.add('solid'); } else { navbar.classList.remove('solid'); }
    if(window.scrollY > 600){ backTop.style.opacity = 1; backTop.style.pointerEvents='auto'; } else { backTop.style.opacity = 0; backTop.style.pointerEvents='none'; }
  });

  // Mobile menu
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  mobileBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
  document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => mobileMenu.classList.add('hidden')));

  // Ripple effect
  document.querySelectorAll('.btn-ripple').forEach(btn => {
    btn.addEventListener('click', function(e){
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = size + 'px';
      circle.style.left = (e.clientX - rect.left - size/2) + 'px';
      circle.style.top = (e.clientY - rect.top - size/2) + 'px';
      circle.classList.add('ripple');
      this.appendChild(circle);
      setTimeout(() => circle.remove(), 650);
    });
  });

  // Count up hero stats
  const counters = document.querySelectorAll('.count-up');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const el = entry.target;
        const target = +el.dataset.count;
        let cur = 0;
        const step = Math.max(1, target/60);
        const tick = () => {
          cur += step;
          if(cur >= target){ el.textContent = target; } else { el.textContent = Math.floor(cur); requestAnimationFrame(tick); }
        };
        tick();
        counterObs.unobserve(el);
      }
    });
  }, { threshold: .5 });
  counters.forEach(c => counterObs.observe(c));

  // ===== Menu tabs =====
  const menuData = JSON.parse(document.getElementById('menuData').textContent);
  const menuGrid = document.getElementById('menuGrid');
  function renderMenu(cat){
    menuGrid.innerHTML = '';
    menuData[cat].forEach((item, i) => {
      const card = document.createElement('div');
      card.className = 'lift bg-white rounded-2xl overflow-hidden border border-forest/5 shadow-sm';
      card.setAttribute('data-aos','fade-up');
      card.setAttribute('data-aos-delay', (i%4)*80);
      card.innerHTML = `
        <div class="relative">
          <img src="https://images.unsplash.com/photo-${item.img}?q=80&w=600&auto=format&fit=crop" alt="${item.name}" loading="lazy" class="w-full h-44 object-cover">
          ${item.fav ? '<span class="absolute top-3 left-3 bg-gold text-forest text-[10px] font-bold px-2.5 py-1 rounded-full"><i class="fa-solid fa-heart mr-1"></i>Favorite</span>' : ''}
        </div>
        <div class="p-5">
          <h3 class="font-display font-semibold text-base mb-1">${item.name}</h3>
          <p class="text-xs text-ink/50 mb-3 leading-relaxed">${item.desc}</p>
          <div class="flex items-center justify-between">
            <span class="font-display font-bold text-forest">Rp ${item.price}</span>
            <button class="btn-ripple bg-forest hover:bg-gold hover:text-forest text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors">Order</button>
          </div>
        </div>`;
      menuGrid.appendChild(card);
    });
    AOS.refreshHard();
  }
  document.querySelectorAll('.menu-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderMenu(tab.dataset.tab);
    });
  });
  renderMenu('coffee');

  // ===== Packaged products + modal =====
  const productsData = JSON.parse(document.getElementById('productsData').textContent);
  const productsGrid = document.getElementById('productsGrid');
  productsData.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'lift bg-white rounded-2xl overflow-hidden border border-forest/5 shadow-sm';
    card.setAttribute('data-aos','fade-up');
    card.setAttribute('data-aos-delay', i*100);
    card.innerHTML = `
       <img src="${p.img}" alt="${p.name}" loading="lazy"
       class="w-full h-48 object-cover">
      <div class="p-5">
        <h3 class="font-display font-semibold text-base mb-1">${p.name}</h3>
        <p class="text-xs text-ink/50 mb-2">${p.desc}</p>
        <p class="text-xs text-gold font-semibold mb-4">${p.weight}</p>
        <button class="view-detail btn-ripple w-full border border-forest text-forest hover:bg-forest hover:text-white text-xs font-semibold py-2.5 rounded-full transition-colors" data-idx="${i}">View Details</button>
      </div>`;
    productsGrid.appendChild(card);
  });

  const productModal = document.getElementById('productModal');
  function openModal(idx){
    const p = productsData[idx];
    document.getElementById('modalImg').src = p.img;
    document.getElementById('modalName').textContent = p.name;
    document.getElementById('modalDesc').textContent = p.desc + ' — ' + p.weight;
    document.getElementById('modalIngredients').textContent = p.ingredients;
    document.getElementById('modalNutrition').textContent = p.nutrition;
    document.getElementById('modalPrep').textContent = p.prep;
    document.getElementById('modalPackaging').textContent = p.packaging;
    productModal.classList.remove('hidden');
    productModal.classList.add('flex');
    requestAnimationFrame(() => productModal.classList.add('modal-open'));
    document.body.style.overflow = 'hidden';
  }
  function closeModalFn(){
    productModal.classList.remove('modal-open');
    document.body.style.overflow = '';
    setTimeout(() => { productModal.classList.add('hidden'); productModal.classList.remove('flex'); }, 350);
  }
  productsGrid.addEventListener('click', e => {
    const btn = e.target.closest('.view-detail');
    if(btn) openModal(+btn.dataset.idx);
  });
  document.getElementById('closeModal').addEventListener('click', closeModalFn);
  productModal.addEventListener('click', e => { if(e.target === productModal) closeModalFn(); });

  // ===== Swipers =====
  new Swiper('.bestSellerSwiper', {
    slidesPerView: 1.15, spaceBetween: 20, pagination: { el: '.bestSellerSwiper .swiper-pagination', clickable: true },
    breakpoints: { 640:{slidesPerView:2.2}, 1024:{slidesPerView:4} }
  });
  new Swiper('.testiSwiper', {
    slidesPerView: 1, autoplay: { delay: 4500, disableOnInteraction:false }, loop:true,
    pagination: { el: '.testiSwiper .swiper-pagination', clickable: true }
  });

  // ===== Countdown timer =====
  const promoEnd = new Date();
  promoEnd.setDate(promoEnd.getDate() + 5);
  function updateCountdown(){
    const now = new Date();
    let diff = promoEnd - now;
    if(diff < 0) diff = 0;
    const d = Math.floor(diff/(1000*60*60*24));
    const h = Math.floor((diff/(1000*60*60))%24);
    const m = Math.floor((diff/(1000*60))%60);
    const s = Math.floor((diff/1000)%60);
    document.getElementById('cd-days').textContent = String(d).padStart(2,'0');
    document.getElementById('cd-hours').textContent = String(h).padStart(2,'0');
    document.getElementById('cd-mins').textContent = String(m).padStart(2,'0');
    document.getElementById('cd-secs').textContent = String(s).padStart(2,'0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ===== FAQ accordion =====
  document.querySelectorAll('.faq-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if(!wasOpen) item.classList.add('open');
    });
  });

  // ===== Profit calculator =====
  const calcCups = document.getElementById('calcCups');
  const calcCupsVal = document.getElementById('calcCupsVal');
  const calcPrice = document.getElementById('calcPrice');
  const calcCost = document.getElementById('calcCost');
  const outDaily = document.getElementById('outDaily');
  const outMonthly = document.getElementById('outMonthly');
  const outProfit = document.getElementById('outProfit');
  const outROI = document.getElementById('outROI');
  const outBreakeven = document.getElementById('outBreakeven');
  const INVESTMENT = 10000000;
  const rupiah = n => 'Rp ' + Math.round(n).toLocaleString('id-ID');

  function animateNumber(el, to, formatter){
    const from = parseInt(el.dataset.raw || 0);
    const duration = 500; const start = performance.now();
    function step(t){
      const p = Math.min(1, (t-start)/duration);
      const val = from + (to-from)*p;
      el.textContent = formatter(val);
      if(p < 1) requestAnimationFrame(step); else el.dataset.raw = to;
    }
    requestAnimationFrame(step);
  }

  function calcProfit(){
    const cups = +calcCups.value;
    calcCupsVal.textContent = cups;
    const price = +calcPrice.value || 0;
    const cost = +calcCost.value || 0;
    const dailyRevenue = cups*price;
    const monthlyRevenue = dailyRevenue*30;
    const dailyProfit = cups*(price-cost);
    const monthlyProfit = dailyProfit*30;
    const roi = monthlyProfit > 0 ? (monthlyProfit/INVESTMENT)*100 : 0;
    const breakeven = monthlyProfit > 0 ? (INVESTMENT/monthlyProfit) : 0;

    animateNumber(outDaily, dailyRevenue, v => rupiah(v));
    animateNumber(outMonthly, monthlyRevenue, v => rupiah(v));
    animateNumber(outProfit, monthlyProfit, v => rupiah(v));
    animateNumber(outROI, roi, v => v.toFixed(1)+'%');
    outBreakeven.textContent = (monthlyProfit > 0 ? breakeven.toFixed(1) : '—') + ' bulan';
  }
  [calcCups, calcPrice, calcCost].forEach(el => el.addEventListener('input', calcProfit));
  calcProfit();

  // ===== Gallery lightbox =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src.replace('w=500','w=1200');
      lightbox.classList.remove('hidden'); lightbox.classList.add('flex');
      requestAnimationFrame(()=>lightbox.classList.add('modal-open'));
    });
  });
  document.getElementById('closeLightbox').addEventListener('click', () => {
    lightbox.classList.remove('modal-open');
    setTimeout(()=>{ lightbox.classList.add('hidden'); lightbox.classList.remove('flex'); }, 300);
  });
  lightbox.addEventListener('click', e => { if(e.target === lightbox) document.getElementById('closeLightbox').click(); });

  // ===== Contact form =====
  document.getElementById('contactForm').addEventListener('submit', function(e){
    e.preventDefault();
    document.getElementById('formSuccess').classList.remove('hidden');
    this.reset();
    setTimeout(()=> document.getElementById('formSuccess').classList.add('hidden'), 4000);
  });

  // Escape key closes modals
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape'){
      if(!productModal.classList.contains('hidden')) closeModalFn();
      if(!lightbox.classList.contains('hidden')) document.getElementById('closeLightbox').click();
      mobileMenu.classList.add('hidden');
    }
  });
