const rail = document.querySelector('[data-rail]');
const left = document.querySelector('.arrow--left');
const right = document.querySelector('.arrow--right');

function updateArrows(){
  const max = rail.scrollWidth - rail.clientWidth;
  const noOverflow = rail.scrollWidth <= rail.clientWidth + 1;

  // center items when short & hide both arrows
  rail.classList.toggle('is-short', noOverflow);
  left.style.display  = noOverflow ? 'none' : (rail.scrollLeft <= 2 ? 'none' : 'grid');
  right.style.display = noOverflow ? 'none' : (rail.scrollLeft >= max - 2 ? 'none' : 'grid');
}

function scrollByCards(dir = 1){
  const card = rail.querySelector('.card');
  const amount = card ? card.getBoundingClientRect().width + 16 : 320;
  rail.scrollBy({ left: dir * amount, behavior: 'smooth' });
}

left.addEventListener('click', () => scrollByCards(-1));
right.addEventListener('click', () => scrollByCards(1));
rail.addEventListener('scroll', updateArrows);
window.addEventListener('resize', updateArrows);

// run once on load
updateArrows();

// WORKPLAATS SCROLLER
// === Werkplaats IG-style slider ===
document.querySelectorAll('[data-ig]').forEach(initIGSlider);

function initIGSlider(root){
  const track = root.querySelector('.ig-track');
  const slides = Array.from(root.querySelectorAll('.ig-slide'));
  const prev = root.querySelector('.ig-prev');
  const next = root.querySelector('.ig-next');
  const dotsWrap = root.querySelector('.ig-dots');

  let index = 0, startX = 0, currentX = 0, dragging = false;

  // build dots
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Ga naar foto ${i+1}`);
    b.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(b);
  });

  function update(){
    track.style.transform = `translateX(-${index * 100}%)`;
    Array.from(dotsWrap.children).forEach((d, i) => {
      d.setAttribute('aria-current', i === index ? 'true' : 'false');
    });
    // hide buttons at ends (optional)
    prev.style.visibility = index === 0 ? 'hidden' : 'visible';
    next.style.visibility = index === slides.length - 1 ? 'hidden' : 'visible';
  }

  function goTo(i){
    index = Math.max(0, Math.min(slides.length - 1, i));
    update();
  }

  prev.addEventListener('click', () => goTo(index - 1));
  next.addEventListener('click', () => goTo(index + 1));

  // touch / drag
  track.addEventListener('pointerdown', e => {
    dragging = true;
    startX = e.clientX;
    currentX = startX;
    track.style.transition = 'none';
    track.setPointerCapture(e.pointerId);
  });
  track.addEventListener('pointermove', e => {
    if(!dragging) return;
    currentX = e.clientX;
    const dx = currentX - startX;
    track.style.transform = `translateX(calc(-${index * 100}% + ${dx}px))`;
  });
  track.addEventListener('pointerup', e => {
    if(!dragging) return;
    dragging = false;
    track.style.transition = '';
    const dx = currentX - startX;
    const threshold = root.clientWidth * 0.15;
    if (dx > threshold) goTo(index - 1);
    else if (dx < -threshold) goTo(index + 1);
    else update();
  });

  // keyboard
  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
  });
  root.tabIndex = 0; // focusable for keyboard

  // on load
  update();
}
