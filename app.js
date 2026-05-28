
document.addEventListener('DOMContentLoaded', function () {
    const supportsMatchMedia = typeof window.matchMedia === 'function';
    const pageTopbar = document.querySelector('.home-topbar, .serv-adm-topbar, .serv-cont-topbar, .serv-leg-topbar, .serv-mark-topbar');
    const primarySidebar = document.getElementById('primarySidebar');

    // En mobile: eliminar el video del hero para ahorrar ancho de banda y mejorar LCP
    if (supportsMatchMedia && window.matchMedia('(max-width: 768px)').matches) {
        document.querySelectorAll('.full-viewport-video').forEach(function (wrap) {
            wrap.remove();
        });
    }

    function setupHeroVideoFallback() {
        const heroVideos = Array.from(document.querySelectorAll('.full-viewport-video video'));
        if (heroVideos.length === 0) {
            return;
        }

        heroVideos.forEach(function (video) {
            const originalSrc = video.getAttribute('src') || 'video/OSARE-HERO.mp4';
            const sourceCandidates = [originalSrc, 'video/banner.mp4'].filter(function (src, index, list) {
                return src && list.indexOf(src) === index;
            });
            const fallbackPoster = 'img/banner-princ.webp';
            let sourceIndex = 0;
            let ready = false;

            // Use a broadly compatible poster to avoid empty gray bars on older browsers.
            if ((video.getAttribute('poster') || '').toLowerCase().endsWith('.avif')) {
                video.setAttribute('poster', fallbackPoster);
            }

            video.muted = true;
            video.playsInline = true;

            const loadNextSource = function () {
                while (sourceIndex < sourceCandidates.length && video.getAttribute('src') === sourceCandidates[sourceIndex]) {
                    sourceIndex += 1;
                }

                if (sourceIndex >= sourceCandidates.length) {
                    return;
                }

                const nextSrc = sourceCandidates[sourceIndex];
                sourceIndex += 1;

                video.setAttribute('src', nextSrc);
                video.load();
                video.play().catch(function () {
                    // Ignore autoplay rejections.
                });
            };

            video.addEventListener('loadeddata', function () {
                ready = true;
            }, { once: true });

            video.addEventListener('error', function () {
                loadNextSource();
            });

            window.setTimeout(function () {
                if (!ready && video.readyState < 2) {
                    loadNextSource();
                }
            }, 3500);
        });
    }

    function getImageFallbackCandidates(src) {
        if (!src) {
            return [];
        }

        const chainByExtension = {
            avif: ['webp', 'png', 'jpg', 'jpeg'],
            webp: ['png', 'jpg', 'jpeg'],
            png: ['jpg', 'jpeg'],
            jpg: ['jpeg', 'png'],
            jpeg: ['jpg', 'png']
        };
        const candidates = [];
        const trimmedSrc = src.trim();

        if (trimmedSrc.indexOf('img//') === 0) {
            candidates.push(trimmedSrc.replace(/^img\/+/, 'img/'));
        }

        const extMatch = trimmedSrc.match(/\.(avif|webp|png|jpe?g)(?=([?#].*)?$)/i);
        if (extMatch) {
            const currentExtension = extMatch[1].toLowerCase();
            const chain = chainByExtension[currentExtension] || [];
            chain.forEach(function (targetExtension) {
                candidates.push(trimmedSrc.replace(/\.(avif|webp|png|jpe?g)(?=([?#].*)?$)/i, '.' + targetExtension));
            });
        }

        return candidates.filter(function (candidate, index, list) {
            return candidate && candidate !== trimmedSrc && list.indexOf(candidate) === index;
        });
    }

    function setupImageFallbacks() {
        const transparentPlaceholder = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221%22 height=%221%22 viewBox=%220 0 1 1%22%3E%3C/svg%3E';

        document.querySelectorAll('img').forEach(function (img) {
            if (img.dataset.fallbackReady === '1') {
                return;
            }

            img.dataset.fallbackReady = '1';
            const originalSrc = img.getAttribute('src');
            const candidates = getImageFallbackCandidates(originalSrc);

            if (candidates.length === 0) {
                return;
            }

            let candidateIndex = 0;
            const applyNextCandidate = function () {
                while (candidateIndex < candidates.length) {
                    const nextSrc = candidates[candidateIndex];
                    candidateIndex += 1;
                    if (nextSrc === img.getAttribute('src')) {
                        continue;
                    }

                    // Avoid the browser re-requesting a broken srcset candidate.
                    img.removeAttribute('srcset');
                    img.setAttribute('src', nextSrc);
                    return true;
                }

                return false;
            };

            img.addEventListener('error', function () {
                if (applyNextCandidate()) {
                    return;
                }

                if (img.dataset.fallbackExhausted === '1') {
                    return;
                }

                img.dataset.fallbackExhausted = '1';
                img.removeAttribute('srcset');
                img.setAttribute('src', transparentPlaceholder);
            });
        });
    }

    if (pageTopbar && primarySidebar && !pageTopbar.contains(primarySidebar)) {
        primarySidebar.classList.add('topbar-menu');
        pageTopbar.appendChild(primarySidebar);
    }

    // if (primarySidebar) {
    //     const primaryList = primarySidebar.querySelector('ul');
    //     if (primaryList && !primaryList.querySelector('.topbar-cta-item')) {
    //         const ctaItem = document.createElement('li');
    //         ctaItem.className = 'nav-button-item topbar-cta-item';
    //         ctaItem.innerHTML = '<button class="menu-link-btn" type="button" data-href="contacto.html"><span>Hablemos</span></button>';
    //         primaryList.appendChild(ctaItem);
    //     }
    // }

    document.querySelectorAll('footer .footer-inner').forEach(function (footerInner) {
        if (footerInner.querySelector('.footer-company-data')) {
            return;
        }
        let footerRight = footerInner.querySelector('.footer-right');
        if (!footerRight) {
            footerRight = document.createElement('div');
            footerRight.className = 'footer-right';
            // Insert before .footer-copy (always at the end of grid)
            const footerCopy = footerInner.querySelector('.footer-copy');
            if (footerCopy) {
                footerInner.insertBefore(footerRight, footerCopy);
            } else {
                footerInner.appendChild(footerRight);
            }
        }

        

        // Links legales
        const footerLinks = footerInner.querySelector('.footer-links');
        if (footerLinks && !footerRight.contains(footerLinks)) {
            footerRight.appendChild(footerLinks);
        }
    });

    const dropdowns = Array.from(document.querySelectorAll('.has-dropdown'));
    const backToTopButton = document.getElementById('backToTopBtn');
    const floatingSidebar = document.getElementById('floatingSidebar');
    // const themeToggle = document.getElementById('themeToggle');
    const benefitsAccordion = document.getElementById('benefitsAccordion');
    const benefitsPreview = document.getElementById('benefitsPreview');
    const scrolly = document.getElementById('osareScrolly');
    const chaosField = document.getElementById('chaosField');
    const magneticCta = document.getElementById('magneticCta');
    const prefersReducedMotion = supportsMatchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;
    const isMobileViewport = supportsMatchMedia
        ? window.matchMedia('(max-width: 1200px)').matches
        : window.innerWidth <= 1200;

    function setupCompactMobileTopbar() {
        if (!pageTopbar || !primarySidebar) {
            return;
        }

        const toggleId = 'mobileMenuToggle';
        const isMobileMenuViewport = function () {
            return supportsMatchMedia
                ? window.matchMedia('(max-width: 1200px)').matches
                : window.innerWidth <= 1200;
        };

        let compactToggle = pageTopbar.querySelector('#' + toggleId);
        if (!compactToggle) {
            compactToggle = document.createElement('button');
            compactToggle.id = toggleId;
            compactToggle.type = 'button';
            compactToggle.className = 'topbar-compact-toggle';
            compactToggle.setAttribute('aria-label', 'Abrir menu');
            compactToggle.setAttribute('aria-controls', 'primarySidebar');
            compactToggle.setAttribute('aria-expanded', 'false');
            compactToggle.innerHTML = '<span class="dots" aria-hidden="true"><span></span><span></span><span></span></span>';
            pageTopbar.appendChild(compactToggle);
        }

        const syncCompactState = function (open) {
            pageTopbar.classList.toggle('is-mobile-menu-open', open);
            compactToggle.setAttribute('aria-expanded', String(open));
            compactToggle.setAttribute('aria-label', open ? 'Cerrar menu' : 'Abrir menu');
        };

        const closeCompactMenu = function () {
            syncCompactState(false);
        };

        const ensureViewportState = function () {
            if (!isMobileMenuViewport()) {
                closeCompactMenu();
                pageTopbar.classList.remove('is-mobile-compact');
                return;
            }

            pageTopbar.classList.add('is-mobile-compact');
        };

        compactToggle.addEventListener('click', function (event) {
            if (!isMobileMenuViewport()) {
                return;
            }

            event.stopPropagation();
            const willOpen = !pageTopbar.classList.contains('is-mobile-menu-open');
            syncCompactState(willOpen);
        });

        document.addEventListener('click', function (event) {
            if (!isMobileMenuViewport()) {
                return;
            }

            if (!pageTopbar.contains(event.target)) {
                closeCompactMenu();
            }
        });

        primarySidebar.addEventListener('click', function (event) {
            const interactive = event.target.closest('.menu-link-btn, .submenu-link');
            if (!interactive || !isMobileMenuViewport()) {
                return;
            }

            closeCompactMenu();
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeCompactMenu();
            }
        });

        window.addEventListener('resize', ensureViewportState);
        ensureViewportState();
    }

    setupCompactMobileTopbar();
    setupHeroVideoFallback();
    setupImageFallbacks();

    const logoTrack = document.querySelector('.logo-track');
    if (logoTrack && !logoTrack.dataset.loopReady) {
        const originalItems = Array.from(logoTrack.children);
        originalItems.forEach(function (item) {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            logoTrack.appendChild(clone);
        });
        logoTrack.dataset.loopReady = 'true';
    }

    function rafThrottle(callback) {
        let ticking = false;
        return function () {
            if (ticking) {
                return;
            }
            ticking = true;
            window.requestAnimationFrame(function () {
                ticking = false;
                callback();
            });
        };
    }

    if (pageTopbar) {
        const updateTopbarState = function () {
            pageTopbar.classList.toggle('is-scrolled', window.scrollY > 14);
        };
        const onScrollTopbar = rafThrottle(updateTopbarState);
        window.addEventListener('scroll', onScrollTopbar, { passive: true });
        updateTopbarState();
    }

    function warmUpLazyImages() {
        const lazyImages = Array.from(document.querySelectorAll('img[loading="lazy"]')).filter(function (img) {
            return !img.complete;
        });

        if (lazyImages.length === 0) {
            return;
        }

        const warmupCount = isMobileViewport ? 6 : 3;
        lazyImages.slice(0, warmupCount).forEach(function (img) {
            img.loading = 'eager';
            if (!img.getAttribute('fetchpriority')) {
                img.setAttribute('fetchpriority', 'low');
            }
            if (typeof img.decode === 'function') {
                img.decode().catch(function () {
                    // Ignore decode errors for still-loading images.
                });
            }
        });
    }

    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(warmUpLazyImages, { timeout: 1200 });
    } else {
        window.setTimeout(warmUpLazyImages, 450);
    }

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
                if (target.startsWith('http://') || target.startsWith('https://')) {
                    window.open(target, '_blank', 'noopener,noreferrer');
                } else {
                    window.location.href = target;
                }
            }
        });

        // Add keyboard activation for non-button interactive cards.
        if (element.classList.contains('service-card')) {
            element.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    const target = element.getAttribute('data-href');
                    if (target) {
                        if (target.startsWith('http://') || target.startsWith('https://')) {
                            window.open(target, '_blank', 'noopener,noreferrer');
                        } else {
                            window.location.href = target;
                        }
                    }
                }
            });
        }
    });

    const blogSuggestToggle = document.getElementById('blogSuggestToggle');
    const blogSuggestPanel = document.getElementById('blogSuggestPanel');
    const blogSuggestFeedback = document.getElementById('blogSuggestFeedback');

    if (blogSuggestToggle && blogSuggestPanel) {
        const blogSuggestEmail = document.getElementById('blogSuggestEmail');
        const blogSuggestComment = document.getElementById('blogSuggestComment');

        const setSuggestionVisibility = function (isOpen) {
            blogSuggestPanel.hidden = !isOpen;
            blogSuggestToggle.setAttribute('aria-expanded', String(isOpen));
            if (isOpen && blogSuggestEmail) {
                blogSuggestEmail.focus();
            }
        };

        blogSuggestToggle.addEventListener('click', function () {
            const willOpen = blogSuggestPanel.hidden;
            setSuggestionVisibility(willOpen);
        });

        blogSuggestPanel.addEventListener('submit', function (event) {
            if (!blogSuggestEmail || !blogSuggestComment || !blogSuggestFeedback) {
                return;
            }

            const comment = blogSuggestComment.value.trim();
            const isEmailValid = blogSuggestEmail.reportValidity();
            const isCommentValid = blogSuggestComment.reportValidity();

            blogSuggestFeedback.classList.remove('is-error');

            if (!isEmailValid || !isCommentValid) {
                blogSuggestFeedback.classList.add('is-error');
                blogSuggestFeedback.textContent = 'Revisa los campos marcados antes de enviar.';
                return;
            }

            if (comment.length < 10) {
                event.preventDefault();
                blogSuggestFeedback.classList.add('is-error');
                blogSuggestFeedback.textContent = 'Escribe un comentario un poco mas detallado.';
                blogSuggestComment.focus();
                return;
            }

            blogSuggestFeedback.textContent = '';
        });
    }

    const storage = {
        getItem: function (key) {
            try {
                return window.localStorage.getItem(key);
            } catch (error) {
                return null;
            }
        },
        setItem: function (key, value) {
            try {
                window.localStorage.setItem(key, value);
            } catch (error) {
                // Ignore storage errors (private mode, blocked storage, quotas).
            }
        },
        removeItem: function (key) {
            try {
                window.localStorage.removeItem(key);
            } catch (error) {
                // Ignore storage errors.
            }
        }
    };

    const cookieBannerStorageKey = 'osare-cookie-consent-v1';
    const savedCookieConsent = storage.getItem(cookieBannerStorageKey);

    const removeCookieBanner = function () {
        const existingBanner = document.getElementById('cookieNotice');
        if (!existingBanner) {
            return;
        }
        existingBanner.classList.remove('is-visible');
        document.body.classList.remove('cookie-banner-visible');
        window.setTimeout(function () {
            if (existingBanner && existingBanner.parentNode) {
                existingBanner.parentNode.removeChild(existingBanner);
            }
        }, 260);
    };

    const saveCookieConsent = function (choice) {
        const payload = {
            choice: choice,
            savedAt: new Date().toISOString()
        };
        storage.setItem(cookieBannerStorageKey, JSON.stringify(payload));
    };

    const buildCookieBanner = function () {
        const banner = document.createElement('section');
        banner.id = 'cookieNotice';
        banner.className = 'cookie-notice';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-modal', 'true');
        banner.setAttribute('aria-live', 'polite');
        banner.setAttribute('aria-label', 'Aviso de cookies');

        banner.innerHTML = [
            '<div class="cookie-notice__panel">',
            '<div class="cookie-notice__body">',
            '<div class="cookie-notice__text-wrap">',
            '<p class="cookie-notice__text">',
            '<strong>OSARE</strong> utiliza cookies propias y de terceros para mejorar su experiencia y analizar el uso del sitio.',
            ' Al continuar navegando, acepta su uso según nuestra política.',
            '</p>',
            '<div class="cookie-notice__links">',
            '<a class="cookie-notice__link" href="politicas.html">Política de Privacidad</a>',
            '<a class="cookie-notice__link" href="terminos.html">Términos y Condiciones</a>',
            '</div>',
            '</div>',
            '</div>',
            '<div class="cookie-notice__actions">',
            '<button class="cookie-notice__btn cookie-notice__btn--primary" type="button" data-cookie-action="accept">Aceptar</button>',
            '<button class="cookie-notice__btn cookie-notice__btn--ghost" type="button" data-cookie-action="essential">Solo esenciales</button>',
            '<button class="cookie-notice__btn cookie-notice__btn--danger" type="button" data-cookie-action="reject">Rechazar</button>',
            '</div>',
            '</div>'
        ].join('');

        banner.querySelectorAll('[data-cookie-action]').forEach(function (button) {
            button.addEventListener('click', function () {
                const action = button.getAttribute('data-cookie-action');
                if (action === 'accept') {
                    saveCookieConsent('accepted');
                } else if (action === 'essential') {
                    saveCookieConsent('essential-only');
                } else {
                    saveCookieConsent('rejected-non-essential');
                }
                removeCookieBanner();
            });
        });

        return banner;
    };

    const showCookieBanner = function () {
        if (document.getElementById('cookieNotice')) {
            return;
        }
        const cookieBanner = buildCookieBanner();
        document.body.appendChild(cookieBanner);
        window.requestAnimationFrame(function () {
            document.body.classList.add('cookie-banner-visible');
            cookieBanner.classList.add('is-visible');
        });
    };

    // Inyectar enlace "Configurar cookies" en todos los footers (Ley 8968: derecho a revocar consentimiento)
    document.querySelectorAll('.footer-links').forEach(function (nav) {
        if (nav.querySelector('[data-cookie-settings]')) {
            return;
        }
        const divider = document.createElement('span');
        divider.className = 'footer-divider';
        divider.setAttribute('aria-hidden', 'true');
        divider.textContent = '\u00B7';

        const btn = document.createElement('button');
        btn.className = 'footer-link-btn';
        btn.type = 'button';
        btn.setAttribute('data-cookie-settings', '');
        btn.textContent = 'Configurar cookies';
        btn.addEventListener('click', function () {
            storage.removeItem(cookieBannerStorageKey);
            showCookieBanner();
        });

        nav.appendChild(divider);
        nav.appendChild(btn);
    });

    if (!savedCookieConsent) {
        showCookieBanner();
    }

    if (backToTopButton) {
        const toggleBackToTopButton = function () {
            backToTopButton.classList.toggle('is-visible', window.scrollY > 350);
        };

        const onScrollBackToTop = rafThrottle(toggleBackToTopButton);
        window.addEventListener('scroll', onScrollBackToTop, { passive: true });

        backToTopButton.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: isMobileViewport || prefersReducedMotion ? 'auto' : 'smooth'
            });
        });

        toggleBackToTopButton();
    }

    if (primarySidebar && floatingSidebar) {
        floatingSidebar.classList.remove('is-visible');
        if (isMobileViewport) {
            floatingSidebar.style.display = 'none';
        }
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

        if (!isMobileViewport) {
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

            const onScrollFloatingSidebar = rafThrottle(toggleFloatingSidebar);
            window.addEventListener('scroll', onScrollFloatingSidebar, { passive: true });
            window.addEventListener('resize', toggleFloatingSidebar);
            toggleFloatingSidebar();
        }
    }

    // if (themeToggle) {
    //     const savedTheme = localStorage.getItem('osare-theme');
    //     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    //     const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    //     let switchAnimationTimeout;

    //     const setThemeLabel = function (theme) {
    //         themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    //     };

    //     document.body.setAttribute('data-theme', initialTheme);
    //     themeToggle.setAttribute('aria-pressed', String(initialTheme === 'dark'));
    //     setThemeLabel(initialTheme);

    //     themeToggle.addEventListener('click', function () {
    //         themeToggle.classList.remove('is-switching');
    //         void themeToggle.offsetWidth;
    //         themeToggle.classList.add('is-switching');

    //         if (switchAnimationTimeout) {
    //             clearTimeout(switchAnimationTimeout);
    //         }

    //         switchAnimationTimeout = window.setTimeout(function () {
    //             themeToggle.classList.remove('is-switching');
    //         }, 360);

    //         const nextTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    //         document.body.setAttribute('data-theme', nextTheme);
    //         themeToggle.setAttribute('aria-pressed', String(nextTheme === 'dark'));
    //         setThemeLabel(nextTheme);
    //         localStorage.setItem('osare-theme', nextTheme);
    //     });
    // }
        /*
        if (themeToggle) {
            const savedTheme = localStorage.getItem('osare-theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
            let switchAnimationTimeout;

            const setThemeLabel = function (theme) {
                themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
            };

            document.body.setAttribute('data-theme', initialTheme);
            themeToggle.setAttribute('aria-pressed', String(initialTheme === 'dark'));
            setThemeLabel(initialTheme);

            themeToggle.addEventListener('click', function () {
                themeToggle.classList.remove('is-switching');
                void themeToggle.offsetWidth;
                themeToggle.classList.add('is-switching');

                if (switchAnimationTimeout) {
                    clearTimeout(switchAnimationTimeout);
                }

                switchAnimationTimeout = window.setTimeout(function () {
                    themeToggle.classList.remove('is-switching');
                }, 360);

                const nextTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                document.body.setAttribute('data-theme', nextTheme);
                themeToggle.setAttribute('aria-pressed', String(nextTheme === 'dark'));
                setThemeLabel(nextTheme);
                localStorage.setItem('osare-theme', nextTheme);
            });
        }
        */

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

        if (isMobileViewport || prefersReducedMotion) {
            chaosField.classList.add('is-ordered');
            letters.forEach(function (letter) {
                letter.classList.add('is-visible');
            });
            chaosField.style.opacity = '0.9';
            chaosField.style.filter = 'none';
        } else {
            const onScrollScrolly = rafThrottle(updateScrolly);
            window.addEventListener('scroll', onScrollScrolly, { passive: true });
            window.addEventListener('resize', updateScrolly);
            updateScrolly();
        }
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

            benefitsPreview.style.setProperty('--benefit-preview', details.gradient);
        };

        benefitButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                setActiveBenefit(button);
            });
        });

        if (benefitButtons.length > 0) {
            setActiveBenefit(benefitButtons[0]);
        }

    }

    if (magneticCta) {
        const maxShift = 14;
        const isCoarsePointer = supportsMatchMedia
            ? window.matchMedia('(pointer: coarse)').matches
            : false;
        const resetMagnet = function () {
            magneticCta.style.transform = 'translate3d(0, 0, 0)';
        };

        if (isMobileViewport || prefersReducedMotion || isCoarsePointer) {
            resetMagnet();
            return;
        }

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
