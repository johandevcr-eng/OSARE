
// Carrusel
let isAnimating = false;

document.addEventListener('DOMContentLoaded', function () {
    const dropdown = document.querySelector('.has-dropdown');
    const toggle = document.querySelector('.dropdown-toggle');

    if (!dropdown || !toggle) {
        return;
    }

    function setDropdownState(isOpen) {
        dropdown.classList.toggle('is-open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
    }

    toggle.addEventListener('click', function (event) {
        event.stopPropagation();
        setDropdownState(!dropdown.classList.contains('is-open'));
    });

    document.addEventListener('click', function (event) {
        if (!dropdown.contains(event.target)) {
            setDropdownState(false);
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            setDropdownState(false);
            toggle.blur();
        }
    });
});

function moveCarousel(direction) {
    const track = document.getElementById('carouselTrack');
    if (!track || isAnimating) {
        return;
    }

    const items = track.querySelectorAll('.carousel-item');
    if (items.length === 0) {
        return;
    }

    const trackStyle = window.getComputedStyle(track);
    const gap = parseFloat(trackStyle.columnGap || trackStyle.gap || '0') || 0;
    const itemWidth = items[0].offsetWidth + gap;

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