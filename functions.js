
// Carrusel
let isAnimating = false;

document.addEventListener('DOMContentLoaded', function () {
    const dropdowns = Array.from(document.querySelectorAll('.has-dropdown'));

    function setDropdownState(dropdown, isOpen) {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        dropdown.classList.toggle('is-open', isOpen);
        if (toggle) {
            toggle.setAttribute('aria-expanded', String(isOpen));
        }
    }

    if (dropdowns.length > 0) {
        dropdowns.forEach(function (dropdown) {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            if (!toggle) {
                return;
            }

            toggle.addEventListener('click', function (event) {
                event.stopPropagation();
                const willOpen = !dropdown.classList.contains('is-open');

                dropdowns.forEach(function (otherDropdown) {
                    if (otherDropdown !== dropdown) {
                        setDropdownState(otherDropdown, false);
                    }
                });

                setDropdownState(dropdown, willOpen);
            });
        });

        document.addEventListener('click', function (event) {
            dropdowns.forEach(function (dropdown) {
                if (!dropdown.contains(event.target)) {
                    setDropdownState(dropdown, false);
                }
            });
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                dropdowns.forEach(function (dropdown) {
                    setDropdownState(dropdown, false);
                });
            }
        });
    }

    // Handle click navigation from data-href attributes.
    document.querySelectorAll('[data-href]').forEach(function (element) {
        element.addEventListener('click', function () {
            const target = element.getAttribute('data-href');
            if (target) {
                window.location.href = target;
            }
        });

        // Add keyboard activation for non-button interactive cards.
        if (element.classList.contains('service-card')) {
            element.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    const target = element.getAttribute('data-href');
                    if (target) {
                        window.location.href = target;
                    }
                }
            });
        }
    });

    // Bind carousel controls declared with data attributes.
    document.querySelectorAll('[data-carousel-direction]').forEach(function (button) {
        button.addEventListener('click', function () {
            const direction = Number(button.getAttribute('data-carousel-direction'));
            if (!Number.isNaN(direction) && direction !== 0) {
                moveCarousel(direction);
            }
        });
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