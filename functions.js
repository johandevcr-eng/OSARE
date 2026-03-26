
// Carrusel
let isAnimating = false;

function moveCarousel(direction) {
    const track = document.getElementById('carouselTrack');
    if (!track || isAnimating) {
        return;
    }

    const items = track.querySelectorAll('.carousel-item');
    if (items.length === 0) {
        return;
    }

    const itemWidth = items[0].offsetWidth + 20; // width + gap

    if (direction > 0) {
        isAnimating = true;
        track.style.transition = 'transform 0.4s ease';
        track.style.transform = 'translateX(-' + itemWidth + 'px)';

        track.addEventListener('transitionend', function handleNext() {
            track.style.transition = 'none';
            track.appendChild(track.firstElementChild);
            track.style.transform = 'translateX(0)';
            track.offsetHeight; // force reflow before re-enabling transition
            track.style.transition = 'transform 0.4s ease';
            isAnimating = false;
        }, { once: true });
    }

    if (direction < 0) {
        isAnimating = true;
        track.style.transition = 'none';
        track.insertBefore(track.lastElementChild, track.firstElementChild);
        track.style.transform = 'translateX(-' + itemWidth + 'px)';
        track.offsetHeight; // force reflow so the transition starts from shifted position
        track.style.transition = 'transform 0.4s ease';
        track.style.transform = 'translateX(0)';

        track.addEventListener('transitionend', function handlePrev() {
            isAnimating = false;
        }, { once: true });
    }
}