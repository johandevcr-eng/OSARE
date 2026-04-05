
document.addEventListener('DOMContentLoaded', function () {
    const dropdowns = Array.from(document.querySelectorAll('.has-dropdown'));
    const backToTopButton = document.getElementById('backToTopBtn');
    const primarySidebar = document.getElementById('primarySidebar');
    const floatingSidebar = document.getElementById('floatingSidebar');

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

    if (primarySidebar && floatingSidebar) {
        let isPrimarySidebarVisible = true;

        const toggleFloatingSidebar = function () {
            const shouldShow = !isPrimarySidebarVisible && window.scrollY > 120;
            floatingSidebar.classList.toggle('is-visible', shouldShow);
        };

        if ('IntersectionObserver' in window) {
            const sidebarObserver = new IntersectionObserver(function (entries) {
                if (entries.length === 0) {
                    return;
                }

                isPrimarySidebarVisible = entries[0].isIntersecting;
                toggleFloatingSidebar();
            }, {
                threshold: 0.08
            });

            sidebarObserver.observe(primarySidebar);
        } else {
            const primaryRect = primarySidebar.getBoundingClientRect();
            isPrimarySidebarVisible = primaryRect.bottom > 0 && primaryRect.top < window.innerHeight;
        }

        window.addEventListener('scroll', toggleFloatingSidebar, { passive: true });
        window.addEventListener('resize', toggleFloatingSidebar);
        toggleFloatingSidebar();
    }

});
