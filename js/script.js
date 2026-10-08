// ===== Товары =====
const products = [
  {name:'Пульсометр Polar FT1', cat:'fitness', desc:'Для первых шагов в тренировках, основанных на сердечном ритме', price:4500, old:5200},
  {name:'Пульсометр Бьюти SB2', cat:'fitness', desc:'Для первых шагов в тренировках, основанных на сердечном ритме', price:6641, old:7400},
  {name:'Пульсометр Polar FT4', cat:'fitness', desc:'Для первых шагов в тренировках, основанных на сердечном ритме', price:6641, old:7400},
  {name:'Polar M200', cat:'run', desc:'Бег с GPS и пульсом на запястье', price:9900, old:11200},
  {name:'Garmin Forerunner 35', cat:'run', desc:'Лёгкие часы для ежедневных пробежек', price:12500, old:13900},
  {name:'Suunto Spartan Trainer', cat:'run', desc:'Точный GPS и планы подготовки', price:21900, old:24500},
  {name:'Polar V800', cat:'tri', desc:'Мультиспорт: плавание, велосипед, бег', price:34900, old:38000},
  {name:'Garmin Fenix 5', cat:'tri', desc:'Топовые часы для триатлона', price:39900, old:43000},
  {name:'Suunto Ambit3 Peak', cat:'tri', desc:'Маршруты, навигация, длинные старты', price:29900, old:32500}
];
const fmt = n => n.toLocaleString('ru-RU') + ' руб.';
const grid = document.getElementById('grid');

function render(filter){
  const list = products.filter(p => p.cat === filter);
  grid.innerHTML = '<div class="info-card"><ul>' +
    ['Наступившие нормы измерения сердечного пульса','Информативный графический показатель нагрузки','Таким образом информацию о пульсе']
    .map(t=>'<li>'+t+'</li>').join('') + '</ul></div>' +
    list.map((p,i)=>`
    <div class="card" style="animation-delay:${i*80}ms">
      <img class="pimg" src="img/watch-ft1.png" alt="${p.name}">
      <h4>${p.name}</h4><p>${p.desc}</p>
      <a data-buy="${p.name}">подробнее</a>
      <div class="buy-row"><div><small>${fmt(p.old)}</small><b>${fmt(p.price)}</b></div>
      <button class="btn" data-buy="${p.name}">КУПИТЬ</button></div>
    </div>`).join('');
}
render('fitness');

document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
  t.classList.add('active');
  render(t.dataset.filter);
}));

// ===== Модальное окно =====
const modal = document.getElementById('modal');
const openModal = (title, item) => {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalItem').textContent = item || '';
  document.getElementById('msg').textContent = '';
  modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
};
const closeModal = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); };

document.addEventListener('click', e => {
  const buy = e.target.closest('[data-buy]');
  if (buy) return openModal('Заказать', buy.dataset.buy);
  const m = e.target.closest('[data-modal]');
  if (m) return openModal(m.dataset.modal);
  if (e.target === modal || e.target.closest('.close')) closeModal();
});
document.addEventListener('keydown', e => e.key === 'Escape' && closeModal());

// ===== Валидация форм =====
function handle(form, done){
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach(i => {
      const bad = !i.value.trim() || (i.type==='email' && !/^\S+@\S+\.\S+$/.test(i.value)) ||
                  (i.type==='tel' && i.value.replace(/\D/g,'').length < 10);
      i.classList.toggle('err', bad); if (bad) ok = false;
    });
    if (ok) done(form);
  });
}
handle(document.getElementById('orderForm'), f => {
  const data = Object.fromEntries(new FormData(f));
  data.item = document.getElementById('modalItem').textContent;
  console.log('Заявка:', data); // здесь подключите отправку на сервер
  document.getElementById('msg').textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.';
  f.reset(); setTimeout(closeModal, 2000);
});
handle(document.getElementById('consultForm'), f => {
  openModal('Спасибо!', 'Мы перезвоним в течение 10 минут'); f.reset();
});

// ===== Плавное появление блоков =====
const io = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting){ en.target.classList.add('visible'); io.unobserve(en.target); }
}), {threshold:.15});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ===== Кнопка «Наверх» =====
const toTop = document.getElementById('toTop');
addEventListener('scroll', () => toTop.classList.toggle('show', scrollY > 400));
toTop.addEventListener('click', () => scrollTo({top:0, behavior:'smooth'}));

// ===== Слайдер: стрелки, точки, автопрокрутка, свайп =====
const slides = [...document.querySelectorAll('.slide')];
const dotsBox = document.getElementById('dots');
let cur = 0, timer;
slides.forEach((_, i) => {
  const d = document.createElement('button');
  d.setAttribute('aria-label', 'Слайд ' + (i + 1));
  d.addEventListener('click', () => { go(i); restart(); });
  dotsBox.appendChild(d);
});
function go(n){
  slides[cur].classList.remove('active'); dotsBox.children[cur].classList.remove('active');
  cur = (n + slides.length) % slides.length;
  slides[cur].classList.add('active'); dotsBox.children[cur].classList.add('active');
}
function restart(){ clearInterval(timer); timer = setInterval(() => go(cur + 1), 5000); }
document.querySelectorAll('.arrow').forEach(b => b.addEventListener('click', () => { go(cur + +b.dataset.dir); restart(); }));
const show = document.querySelector('.showcase');
show.addEventListener('mouseenter', () => clearInterval(timer));
show.addEventListener('mouseleave', restart);
let x0 = null;
show.addEventListener('touchstart', e => x0 = e.touches[0].clientX, {passive:true});
show.addEventListener('touchend', e => {
  if (x0 === null) return;
  const dx = e.changedTouches[0].clientX - x0;
  if (Math.abs(dx) > 40){ go(cur + (dx < 0 ? 1 : -1)); restart(); }
  x0 = null;
});
go(0); restart();

// ===== Карточка контактов: можно закрыть и вернуть =====
const card = document.getElementById('contactCard'), cardOpen = document.getElementById('cardOpen');
document.getElementById('cardClose').addEventListener('click', () => { card.classList.add('hidden'); cardOpen.classList.add('show'); });
cardOpen.addEventListener('click', () => { card.classList.remove('hidden'); cardOpen.classList.remove('show'); });
