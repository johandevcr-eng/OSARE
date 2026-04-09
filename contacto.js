(function () {
    'use strict';

    function getCaptchaErrorElement() {
        return document.getElementById('captchaError');
    }

    function setCaptchaError(message) {
        var errorElement = getCaptchaErrorElement();
        if (!errorElement) {
            return;
        }
        errorElement.textContent = message || '';
    }

    window.onContactCaptchaChange = function () {
        setCaptchaError('');
    };

    window.onContactCaptchaExpired = function () {
        setCaptchaError('Valide el reCAPTCHA para enviar el formulario.');
    };

    document.addEventListener('DOMContentLoaded', function () {
        var form = document.getElementById('contactForm');
        if (!form) {
            return;
        }

        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                form.reportValidity();
                return;
            }

            if (typeof window.grecaptcha === 'undefined') {
                event.preventDefault();
                setCaptchaError('No se pudo cargar reCAPTCHA. Recargue la pagina e intente de nuevo.');
                return;
            }

            var response = window.grecaptcha.getResponse();
            if (!response) {
                event.preventDefault();
                setCaptchaError('Debe completar el reCAPTCHA antes de enviar.');
                return;
            }

            setCaptchaError('');
        });
    });
})();
