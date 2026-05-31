document.addEventListener("DOMContentLoaded", function () {
  const e = "function" == typeof window.matchMedia,
    t = document.querySelector(
      ".home-topbar, .serv-adm-topbar, .serv-cont-topbar, .serv-leg-topbar, .serv-mark-topbar",
    ),
    n = document.getElementById("primarySidebar");
  (e &&
    window.matchMedia("(max-width: 768px)").matches &&
    document.querySelectorAll(".full-viewport-video").forEach(function (e) {
      e.remove();
    }),
    t &&
      n &&
      !t.contains(n) &&
      (n.classList.add("topbar-menu"), t.appendChild(n)),
    document.querySelectorAll("footer .footer-inner").forEach(function (e) {
      if (e.querySelector(".footer-company-data")) return;
      let t = e.querySelector(".footer-right");
      if (!t) {
        ((t = document.createElement("div")), (t.className = "footer-right"));
        const n = e.querySelector(".footer-copy");
        n ? e.insertBefore(t, n) : e.appendChild(t);
      }
      const n = e.querySelector(".footer-links");
      n && !t.contains(n) && t.appendChild(n);
    }));
  const o = Array.from(document.querySelectorAll(".has-dropdown")),
    i = document.getElementById("backToTopBtn"),
    a = document.getElementById("floatingSidebar"),
    r = document.getElementById("benefitsAccordion"),
    c = document.getElementById("benefitsPreview"),
    s = document.getElementById("osareScrolly"),
    d = document.getElementById("chaosField"),
    l = document.getElementById("magneticCta"),
    u = !!e && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    f = e
      ? window.matchMedia("(max-width: 1200px)").matches
      : window.innerWidth <= 1200;
  (!(function () {
    if (!t || !n) return;
    const o = "mobileMenuToggle",
      i = function () {
        return e
          ? window.matchMedia("(max-width: 1200px)").matches
          : window.innerWidth <= 1200;
      };
    let a = t.querySelector("#" + o);
    a ||
      ((a = document.createElement("button")),
      (a.id = o),
      (a.type = "button"),
      (a.className = "topbar-compact-toggle"),
      a.setAttribute("aria-label", "Abrir menu"),
      a.setAttribute("aria-controls", "primarySidebar"),
      a.setAttribute("aria-expanded", "false"),
      (a.innerHTML =
        '<span class="dots" aria-hidden="true"><span></span><span></span><span></span></span>'),
      t.appendChild(a));
    const r = function (e) {
        (t.classList.toggle("is-mobile-menu-open", e),
          a.setAttribute("aria-expanded", String(e)),
          a.setAttribute("aria-label", e ? "Cerrar menu" : "Abrir menu"));
      },
      c = function () {
        r(!1);
      },
      s = function () {
        if (!i()) return (c(), void t.classList.remove("is-mobile-compact"));
        t.classList.add("is-mobile-compact");
      };
    (a.addEventListener("click", function (e) {
      if (!i()) return;
      e.stopPropagation();
      const n = !t.classList.contains("is-mobile-menu-open");
      r(n);
    }),
      document.addEventListener("click", function (e) {
        i() && (t.contains(e.target) || c());
      }),
      n.addEventListener("click", function (e) {
        e.target.closest(".menu-link-btn, .submenu-link") && i() && c();
      }),
      document.addEventListener("keydown", function (e) {
        "Escape" === e.key && c();
      }),
      window.addEventListener("resize", s),
      s());
  })(),
    (function () {
      const e = Array.from(
        document.querySelectorAll(".full-viewport-video video"),
      );
      0 !== e.length &&
        e.forEach(function (e) {
          const t = [
            e.getAttribute("src") || "video/osare-hero.mp4",
            "video/banner.mp4",
          ].filter(function (e, t, n) {
            return e && n.indexOf(e) === t;
          });
          let n = 0,
            o = !1;
          ((e.getAttribute("poster") || "").toLowerCase().endsWith(".avif") &&
            e.setAttribute("poster", "img/banner-princ.webp"),
            (e.muted = !0),
            (e.playsInline = !0));
          const i = function () {
            for (; n < t.length && e.getAttribute("src") === t[n]; ) n += 1;
            if (n >= t.length) return;
            const o = t[n];
            ((n += 1),
              e.setAttribute("src", o),
              e.load(),
              e.play().catch(function () {}));
          };
          (e.addEventListener(
            "loadeddata",
            function () {
              o = !0;
            },
            { once: !0 },
          ),
            e.addEventListener("error", function () {
              i();
            }),
            window.setTimeout(function () {
              !o && e.readyState < 2 && i();
            }, 3500));
        });
    })(),
    document.querySelectorAll("img").forEach(function (e) {
      if ("1" === e.dataset.fallbackReady) return;
      e.dataset.fallbackReady = "1";
      const t = (function (e) {
        if (!e) return [];
        const t = {
            avif: ["webp", "png", "jpg", "jpeg"],
            webp: ["png", "jpg", "jpeg"],
            png: ["jpg", "jpeg"],
            jpg: ["jpeg", "png"],
            jpeg: ["jpg", "png"],
          },
          n = [],
          o = e.trim();
        0 === o.indexOf("img//") && n.push(o.replace(/^img\/+/, "img/"));
        const i = o.match(/\.(avif|webp|png|jpe?g)(?=([?#].*)?$)/i);
        return (
          i &&
            (t[i[1].toLowerCase()] || []).forEach(function (e) {
              n.push(
                o.replace(/\.(avif|webp|png|jpe?g)(?=([?#].*)?$)/i, "." + e),
              );
            }),
          n.filter(function (e, t, n) {
            return e && e !== o && n.indexOf(e) === t;
          })
        );
      })(e.getAttribute("src"));
      if (0 === t.length) return;
      let n = 0;
      e.addEventListener("error", function () {
        (function () {
          for (; n < t.length; ) {
            const o = t[n];
            if (((n += 1), o !== e.getAttribute("src")))
              return (
                e.removeAttribute("srcset"),
                e.setAttribute("src", o),
                !0
              );
          }
          return !1;
        })() ||
          ("1" !== e.dataset.fallbackExhausted &&
            ((e.dataset.fallbackExhausted = "1"),
            e.removeAttribute("srcset"),
            e.setAttribute(
              "src",
              "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221%22 height=%221%22 viewBox=%220 0 1 1%22%3E%3C/svg%3E",
            )));
      });
    }));
  const g = document.querySelector(".logo-track");
  if (g && !g.dataset.loopReady) {
    (Array.from(g.children).forEach(function (e) {
      const t = e.cloneNode(!0);
      (t.setAttribute("aria-hidden", "true"), g.appendChild(t));
    }),
      (g.dataset.loopReady = "true"));
  }
  function m(e) {
    let t = !1;
    return function () {
      t ||
        ((t = !0),
        window.requestAnimationFrame(function () {
          ((t = !1), e());
        }));
    };
  }
  if (t) {
    let e = null;
    const n = function () {
        const n = window.scrollY > 14;
        n !== e && (t.classList.toggle("is-scrolled", n), (e = n));
      },
      o = m(n);
    (window.addEventListener("scroll", o, { passive: !0 }), n());
  }
  function p() {
    const e = Array.from(
      document.querySelectorAll('img[loading="lazy"]'),
    ).filter(function (e) {
      return !e.complete;
    });
    if (0 === e.length) return;
    const t = f ? 6 : 3;
    e.slice(0, t).forEach(function (e) {
      ((e.loading = "eager"),
        e.getAttribute("fetchpriority") ||
          e.setAttribute("fetchpriority", "low"),
        "function" == typeof e.decode && e.decode().catch(function () {}));
    });
  }
  function b(e, t) {
    const n = e.querySelector(".dropdown-toggle");
    (e.classList.toggle("is-open", t),
      n && n.setAttribute("aria-expanded", String(t)));
  }
  ("requestIdleCallback" in window
    ? window.requestIdleCallback(p, { timeout: 1200 })
    : window.setTimeout(p, 450),
    o.length > 0 &&
      (o.forEach(function (e) {
        b(e, !1);
      }),
      o.forEach(function (e) {
        const t = e.querySelector(".dropdown-toggle");
        t &&
          t.addEventListener("click", function (t) {
            t.stopPropagation();
            const n = !e.classList.contains("is-open");
            (o.forEach(function (t) {
              t !== e && b(t, !1);
            }),
              b(e, n));
          });
      }),
      document.addEventListener("click", function (e) {
        o.forEach(function (t) {
          t.contains(e.target) || b(t, !1);
        });
      }),
      document.addEventListener("keydown", function (e) {
        "Escape" === e.key &&
          o.forEach(function (e) {
            b(e, !1);
          });
      })),
    document.querySelectorAll("[data-href]").forEach(function (e) {
      (e.addEventListener("click", function () {
        const t = e.getAttribute("data-href");
        t &&
          (t.startsWith("http://") || t.startsWith("https://")
            ? window.open(t, "_blank", "noopener,noreferrer")
            : (window.location.href = t));
      }),
        e.classList.contains("service-card") &&
          e.addEventListener("keydown", function (t) {
            if ("Enter" === t.key || " " === t.key) {
              t.preventDefault();
              const n = e.getAttribute("data-href");
              n &&
                (n.startsWith("http://") || n.startsWith("https://")
                  ? window.open(n, "_blank", "noopener,noreferrer")
                  : (window.location.href = n));
            }
          }));
    }));
  const h = document.getElementById("blogSuggestToggle"),
    v = document.getElementById("blogSuggestPanel"),
    y = document.getElementById("blogSuggestFeedback");
  if (h && v) {
    const e = document.getElementById("blogSuggestEmail"),
      t = document.getElementById("blogSuggestComment"),
      n = function (t) {
        ((v.hidden = !t),
          h.setAttribute("aria-expanded", String(t)),
          t && e && e.focus());
      };
    (h.addEventListener("click", function () {
      const e = v.hidden;
      n(e);
    }),
      v.addEventListener("submit", function (n) {
        if (!e || !t || !y) return;
        const o = t.value.trim(),
          i = e.reportValidity(),
          a = t.reportValidity();
        return (
          y.classList.remove("is-error"),
          i && a
            ? o.length < 10
              ? (n.preventDefault(),
                y.classList.add("is-error"),
                (y.textContent =
                  "Escribe un comentario un poco mas detallado."),
                void t.focus())
              : void (y.textContent = "")
            : (y.classList.add("is-error"),
              void (y.textContent =
                "Revisa los campos marcados antes de enviar."))
        );
      }));
  }
  const w = function (e, t) {
      try {
        window.localStorage.setItem(e, t);
      } catch (e) {}
    },
    E = function (e) {
      try {
        window.localStorage.removeItem(e);
      } catch (e) {}
    },
    k = "osare-cookie-consent-v1",
    A = (function (e) {
      try {
        return window.localStorage.getItem(e);
      } catch (e) {
        return null;
      }
    })(k),
    L = function (e) {
      const t = { choice: e, savedAt: new Date().toISOString() };
      w(k, JSON.stringify(t));
    },
    x = function () {
      const e = document.createElement("section");
      return (
        (e.id = "cookieNotice"),
        (e.className = "cookie-notice"),
        e.setAttribute("role", "dialog"),
        e.setAttribute("aria-modal", "true"),
        e.setAttribute("aria-live", "polite"),
        e.setAttribute("aria-label", "Aviso de cookies"),
        (e.innerHTML = [
          '<div class="cookie-notice__panel">',
          '<div class="cookie-notice__body">',
          '<div class="cookie-notice__text-wrap">',
          '<p class="cookie-notice__text">',
          "<strong>OSARE</strong> utiliza cookies propias y de terceros para mejorar su experiencia y analizar el uso del sitio.",
          " Al continuar navegando, acepta su uso según nuestra política.",
          "</p>",
          '<div class="cookie-notice__links">',
          '<a class="cookie-notice__link" href="politicas.html">Política de Privacidad</a>',
          '<a class="cookie-notice__link" href="terminos.html">Términos y Condiciones</a>',
          "</div>",
          "</div>",
          "</div>",
          '<div class="cookie-notice__actions">',
          '<button class="cookie-notice__btn cookie-notice__btn--primary" type="button" data-cookie-action="accept">Aceptar</button>',
          '<button class="cookie-notice__btn cookie-notice__btn--ghost" type="button" data-cookie-action="essential">Solo esenciales</button>',
          '<button class="cookie-notice__btn cookie-notice__btn--danger" type="button" data-cookie-action="reject">Rechazar</button>',
          "</div>",
          "</div>",
        ].join("")),
        e.querySelectorAll("[data-cookie-action]").forEach(function (e) {
          e.addEventListener("click", function () {
            const t = e.getAttribute("data-cookie-action");
            (L(
              "accept" === t
                ? "accepted"
                : "essential" === t
                  ? "essential-only"
                  : "rejected-non-essential",
            ),
              (function () {
                const e = document.getElementById("cookieNotice");
                e &&
                  (e.classList.remove("is-visible"),
                  document.body.classList.remove("cookie-banner-visible"),
                  window.setTimeout(function () {
                    e && e.parentNode && e.parentNode.removeChild(e);
                  }, 260));
              })());
          });
        }),
        e
      );
    },
    S = function () {
      if (document.getElementById("cookieNotice")) return;
      const e = x();
      (document.body.appendChild(e),
        window.requestAnimationFrame(function () {
          (document.body.classList.add("cookie-banner-visible"),
            e.classList.add("is-visible"));
        }));
    };
  if (
    (document.querySelectorAll(".footer-links").forEach(function (e) {
      if (e.querySelector("[data-cookie-settings]")) return;
      const t = document.createElement("span");
      ((t.className = "footer-divider"),
        t.setAttribute("aria-hidden", "true"),
        (t.textContent = "·"));
      const n = document.createElement("button");
      ((n.className = "footer-link-btn"),
        (n.type = "button"),
        n.setAttribute("data-cookie-settings", ""),
        (n.textContent = "Configurar cookies"),
        n.addEventListener("click", function () {
          (E(k), S());
        }),
        e.appendChild(t),
        e.appendChild(n));
    }),
    A || S(),
    i)
  ) {
    let e = null;
    const t = function () {
        const t = window.scrollY > 350;
        t !== e && (i.classList.toggle("is-visible", t), (e = t));
      },
      n = m(t);
    (window.addEventListener("scroll", n, { passive: !0 }),
      i.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: f || u ? "auto" : "smooth" });
      }),
      t());
  }
  if (n && a) {
    (a.classList.remove("is-visible"), f && (a.style.display = "none"));
    let e = !0,
      o = window.scrollY > 120;
    const i = function () {
      a.classList.toggle("is-visible", !e && o);
    };
    if (!f) {
      if ("IntersectionObserver" in window) {
        const t = new IntersectionObserver(
          function (t) {
            0 !== t.length && ((e = t[0].isIntersecting), i());
          },
          { threshold: 0.08, rootMargin: "-88px 0px 0px 0px" },
        );
        t.observe(n);
      }
      const t = function () {
          o = window.scrollY > 120;
          i();
        },
        r = m(t);
      (window.addEventListener("scroll", r, { passive: !0 }),
        window.addEventListener("resize", t),
        t());
    }
  }
  if (s && d) {
    const e = Array.from(d.querySelectorAll(".chaos-chip")),
      t = Array.from(s.querySelectorAll(".osare-word span"));
    e.length;
    e.forEach(function (e, t) {
      const n = 0.12 + 0.76 * Math.random(),
        o = 0.14 + 0.72 * Math.random(),
        i = 0.17 + 0.17 * (t % 5),
        a = 0.28 + 0.24 * Math.floor(t / 5);
      (e.style.setProperty("--x", n.toFixed(3)),
        e.style.setProperty("--y", o.toFixed(3)),
        e.style.setProperty("--gx", i.toFixed(3)),
        e.style.setProperty("--gy", a.toFixed(3)));
    });
    const n = function (e) {
      const n = Math.max(0, Math.min(e, 1)),
        o = Math.min(5, Math.max(0, Math.ceil(5 * n)));
      (d.classList.toggle("is-ordered", o > 0.45),
        t.forEach(function (e, t) {
          e.classList.toggle("is-visible", t < o);
        }),
        (d.style.opacity = String(Math.max(0.35, 1 - 0.5 * n))),
        (d.style.filter = "saturate(" + (0.85 + 0.4 * n).toFixed(2) + ")"));
    };
    if (f || u)
      (d.classList.add("is-ordered"),
        t.forEach(function (e) {
          e.classList.add("is-visible");
        }),
        (d.style.opacity = "0.9"),
        (d.style.filter = "none"));
    else if ("IntersectionObserver" in window) {
      const e = Array.from({ length: 11 }, function (_, e) {
          return e / 10;
        }),
        o = new IntersectionObserver(
          function (e) {
            0 !== e.length && n(e[0].intersectionRatio || 0);
          },
          { threshold: e },
        );
      o.observe(s);
    } else {
      n(0);
    }
  }
  if (r && c) {
    const e = Array.from(r.querySelectorAll(".benefit-item")),
      t = {
        strategy: {
          title: "Reduccion inteligente de costos",
          text: "Reducir tus costos administrativos, al igual que disminuir la cantidad de espacio fisico dedicado a equipos de oficina y personal destacado en el sitio.",
          gradient:
            "linear-gradient(145deg, rgba(0,166,209,0.75), rgba(0, 23, 42, 0.92))",
        },
        team: {
          title: "Equipos con foco real",
          text: "Mejorar el rendimiento del personal que quizas este sobrecargado de funciones o tareas que no corresponden a la razon de ser del negocio.",
          gradient:
            "linear-gradient(145deg, rgba(52,131,255,0.78), rgba(8, 22, 56, 0.92))",
        },
        focus: {
          title: "Mas tiempo para crecer",
          text: "Enfocarte en los objetivos de tu empresa, sin preocuparte por las labores de oficina que solo son accesorias o complementarias.",
          gradient:
            "linear-gradient(145deg, rgba(32,180,130,0.8), rgba(5, 35, 27, 0.92))",
        },
        specialists: {
          title: "Especialistas sin inflar planilla",
          text: "Contar con servicios especializados en areas o tareas indispensables sin la necesidad de aumentar tu planilla ni aumentar las cargas y responsabilidades patronales.",
          gradient:
            "linear-gradient(145deg, rgba(110,123,255,0.78), rgba(20, 18, 62, 0.92))",
        },
        service: {
          title: "Acompanamiento siempre disponible",
          text: "Recibir un servicio profesional, confiable y eficaz en una modalidad externa pero siempre a la mano, gracias a medios tecnologicos y una politica de comunicacion abierta y fluida.",
          gradient:
            "linear-gradient(145deg, rgba(205,126,64,0.82), rgba(45, 21, 11, 0.92))",
        },
        growth: {
          title: "Rentabilidad que se nota",
          text: "Obtener servicios a la medida, que impactaran positivamente la rentabilidad de tu negocio.",
          gradient:
            "linear-gradient(145deg, rgba(233,178,71,0.84), rgba(53, 31, 7, 0.94))",
        },
      },
      n = function (n) {
        const o = n.getAttribute("data-image"),
          i = t[o];
        i &&
          (e.forEach(function (e) {
            const t = e === n;
            (e.classList.toggle("is-active", t),
              e.setAttribute("aria-selected", String(t)));
          }),
          c.style.setProperty("--benefit-preview", i.gradient));
      };
    (e.forEach(function (e) {
      e.addEventListener("click", function () {
        n(e);
      });
    }),
      e.length > 0 && n(e[0]));
  }
  if (l) {
    const t = 14,
      n = !!e && window.matchMedia("(pointer: coarse)").matches,
      o = function () {
        l.style.transform = "translate3d(0, 0, 0)";
      };
    if (f || u || n) return void o();
    let i = null;
    const a = function () {
      i = l.getBoundingClientRect();
    };
    (a(),
      window.addEventListener("resize", a),
      window.addEventListener("scroll", a, { passive: !0 }),
      l.addEventListener("pointerenter", a),
      document.addEventListener("mousemove", function (e) {
        const n = i || (a(), i),
          r = n.left + n.width / 2,
          c = n.top + n.height / 2,
          s = e.clientX - r,
          d = e.clientY - c,
          u = Math.hypot(s, d),
          g = 170;
        if (u > g) return void o();
        const f = (1 - u / g) * t,
          x = (s / g) * f,
          y = (d / g) * f;
        l.style.transform =
          "translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px,0)";
    }),
      l.addEventListener("mouseleave", o),
      window.addEventListener("scroll", o, { passive: !0 }));
  }
});
