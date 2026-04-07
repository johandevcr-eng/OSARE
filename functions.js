
document.addEventListener('DOMContentLoaded', function () {
    const dropdowns = Array.from(document.querySelectorAll('.has-dropdown'));
    const backToTopButton = document.getElementById('backToTopBtn');
    const primarySidebar = document.getElementById('primarySidebar');
    const floatingSidebar = document.getElementById('floatingSidebar');
    const themeToggle = document.getElementById('themeToggle');
    const benefitsAccordion = document.getElementById('benefitsAccordion');
    const benefitsPreview = document.getElementById('benefitsPreview');
    const scrolly = document.getElementById('osareScrolly');
    const chaosField = document.getElementById('chaosField');
    const magneticCta = document.getElementById('magneticCta');

    function setDropdownState(dropdown, isOpen) {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        dropdown.classList.toggle('is-open', isOpen);
        if (toggle) {
            toggle.setAttribute('aria-expanded', String(isOpen));
        }
    }

    if (dropdowns.length > 0) {
        // Force closed state on first render.
        dropdowns.forEach(function (dropdown) {
            setDropdownState(dropdown, false);
        });

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
        floatingSidebar.classList.remove('is-visible');
        let isPrimarySidebarVisible = true;

        const updatePrimarySidebarVisibility = function () {
            const rect = primarySidebar.getBoundingClientRect();
            // Consider the fixed video/header space so visibility matches what the user sees.
            const visibleTop = rect.top < window.innerHeight;
            const visibleBottom = rect.bottom > 88;
            isPrimarySidebarVisible = visibleTop && visibleBottom;
        };

        const toggleFloatingSidebar = function () {
            updatePrimarySidebarVisibility();
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
            updatePrimarySidebarVisibility();
        }

        window.addEventListener('scroll', toggleFloatingSidebar, { passive: true });
        window.addEventListener('resize', toggleFloatingSidebar);
        toggleFloatingSidebar();
    }

    if (themeToggle) {
        const savedTheme = localStorage.getItem('osare-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        const themeToggleLabel = themeToggle.querySelector('.theme-toggle-label');

        const setThemeLabel = function (theme) {
            if (!themeToggleLabel) {
                return;
            }
            if (theme === 'dark') {
                themeToggleLabel.textContent = '☀️';
                themeToggleLabel.classList.remove('is-moon');
            } else {
                themeToggleLabel.textContent = '☾';
                themeToggleLabel.classList.add('is-moon');
            }
            themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
        };

        document.body.setAttribute('data-theme', initialTheme);
        themeToggle.setAttribute('aria-pressed', String(initialTheme === 'dark'));
        setThemeLabel(initialTheme);

        themeToggle.addEventListener('click', function () {
            const nextTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.body.setAttribute('data-theme', nextTheme);
            themeToggle.setAttribute('aria-pressed', String(nextTheme === 'dark'));
            setThemeLabel(nextTheme);
            localStorage.setItem('osare-theme', nextTheme);
        });
    }

    if (scrolly && chaosField) {
        const chips = Array.from(chaosField.querySelectorAll('.chaos-chip'));
        const letters = Array.from(scrolly.querySelectorAll('.osare-word span'));
        const total = chips.length;

        chips.forEach(function (chip, index) {
            const randomX = 0.12 + Math.random() * 0.76;
            const randomY = 0.14 + Math.random() * 0.72;
            const col = index % 5;
            const row = Math.floor(index / 5);
            const gx = 0.17 + col * 0.17;
            const gy = 0.28 + row * 0.24;
            chip.style.setProperty('--x', randomX.toFixed(3));
            chip.style.setProperty('--y', randomY.toFixed(3));
            chip.style.setProperty('--gx', gx.toFixed(3));
            chip.style.setProperty('--gy', gy.toFixed(3));
        });

        const updateScrolly = function () {
            const rect = scrolly.getBoundingClientRect();
            const raw = (window.innerHeight - rect.top) / (rect.height + window.innerHeight * 0.3);
            const progress = Math.max(0, Math.min(raw, 1));
            const visibleLetters = Math.min(5, Math.max(0, Math.ceil(progress * 5)));
            chaosField.classList.toggle('is-ordered', progress > 0.45);

            letters.forEach(function (letter, index) {
                letter.classList.toggle('is-visible', index < visibleLetters);
            });

            chaosField.style.opacity = String(Math.max(0.35, 1 - progress * 0.5));
            chaosField.style.filter = 'saturate(' + (0.85 + progress * 0.4).toFixed(2) + ')';
        };

        window.addEventListener('scroll', updateScrolly, { passive: true });
        window.addEventListener('resize', updateScrolly);
        updateScrolly();
    }

    if (benefitsAccordion && benefitsPreview) {
        const benefitButtons = Array.from(benefitsAccordion.querySelectorAll('.benefit-item'));
        const benefitMap = {
            strategy: {
                title: 'Reduccion inteligente de costos',
                text: 'Reducir tus costos administrativos, al igual que disminuir la cantidad de espacio fisico dedicado a equipos de oficina y personal destacado en el sitio.',
                gradient: 'linear-gradient(145deg, rgba(0,166,209,0.75), rgba(0, 23, 42, 0.92))'
            },
            team: {
                title: 'Equipos con foco real',
                text: 'Mejorar el rendimiento del personal que quizas este sobrecargado de funciones o tareas que no corresponden a la razon de ser del negocio.',
                gradient: 'linear-gradient(145deg, rgba(52,131,255,0.78), rgba(8, 22, 56, 0.92))'
            },
            focus: {
                title: 'Mas tiempo para crecer',
                text: 'Enfocarte en los objetivos de tu empresa, sin preocuparte por las labores de oficina que solo son accesorias o complementarias.',
                gradient: 'linear-gradient(145deg, rgba(32,180,130,0.8), rgba(5, 35, 27, 0.92))'
            },
            specialists: {
                title: 'Especialistas sin inflar planilla',
                text: 'Contar con servicios especializados en areas o tareas indispensables sin la necesidad de aumentar tu planilla ni aumentar las cargas y responsabilidades patronales.',
                gradient: 'linear-gradient(145deg, rgba(110,123,255,0.78), rgba(20, 18, 62, 0.92))'
            },
            service: {
                title: 'Acompanamiento siempre disponible',
                text: 'Recibir un servicio profesional, confiable y eficaz en una modalidad externa pero siempre a la mano, gracias a medios tecnologicos y una politica de comunicacion abierta y fluida.',
                gradient: 'linear-gradient(145deg, rgba(205,126,64,0.82), rgba(45, 21, 11, 0.92))'
            },
            growth: {
                title: 'Rentabilidad que se nota',
                text: 'Obtener servicios a la medida, que impactaran positivamente la rentabilidad de tu negocio.',
                gradient: 'linear-gradient(145deg, rgba(233,178,71,0.84), rgba(53, 31, 7, 0.94))'
            }
        };

        const setActiveBenefit = function (button) {
            const key = button.getAttribute('data-image');
            const details = benefitMap[key];
            if (!details) {
                return;
            }

            benefitButtons.forEach(function (item) {
                const isActive = item === button;
                item.classList.toggle('is-active', isActive);
                item.setAttribute('aria-selected', String(isActive));
            });

            benefitsPreview.innerHTML = '<h3>' + details.title + '</h3><p>' + details.text + '</p>';
            benefitsPreview.style.setProperty('--benefit-preview', details.gradient);
        };

        benefitButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                setActiveBenefit(button);
            });
        });

    }

    if (magneticCta) {
        const maxShift = 14;
        const resetMagnet = function () {
            magneticCta.style.transform = 'translate3d(0, 0, 0)';
        };

        document.addEventListener('mousemove', function (event) {
            const rect = magneticCta.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = event.clientX - centerX;
            const dy = event.clientY - centerY;
            const distance = Math.hypot(dx, dy);
            const range = 170;

            if (distance > range) {
                resetMagnet();
                return;
            }

            const pull = (1 - distance / range) * maxShift;
            const x = (dx / range) * pull;
            const y = (dy / range) * pull;
            magneticCta.style.transform = 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0)';
        });

        magneticCta.addEventListener('mouseleave', resetMagnet);
        window.addEventListener('scroll', resetMagnet, { passive: true });
    }

});
