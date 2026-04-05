
document.addEventListener('DOMContentLoaded', function () {
    const dropdowns = Array.from(document.querySelectorAll('.has-dropdown'));
    const backToTopButton = document.getElementById('backToTopBtn');

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

    if (backToTopButton) {
        const toggleBackToTopButton = function () {
            backToTopButton.classList.toggle('is-visible', window.scrollY > 350);
        };

        window.addEventListener('scroll', toggleBackToTopButton, { passive: true });

        backToTopButton.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        toggleBackToTopButton();
    }

});
