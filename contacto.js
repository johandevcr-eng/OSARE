(function () {
    'use strict';

    function normalizeText(value) {
        return (value || '').trim().toLowerCase();
    }

    function mapServiceValue(rawValue) {
        var value = normalizeText(rawValue);
        if (!value) {
            return '';
        }

        if (value.indexOf('adm') !== -1) {
            return 'Servicios Administrativos';
        }

        if (value.indexOf('cont') !== -1) {
            return 'Servicios Contables';
        }

        if (value.indexOf('leg') !== -1) {
            return 'Servicios Legales';
        }

        if (value.indexOf('mark') !== -1 || value.indexOf('brand') !== -1) {
            return 'Marketing y Branding';
        }

        return '';
    }

    function validatePhone(input) {
        if (!input) {
            return;
        }

        var raw = input.value || '';
        var digits = raw.replace(/\D/g, '');
        if (!raw.trim()) {
            input.setCustomValidity('');
            return;
        }

        if (digits.length < 8 || digits.length > 15) {
            input.setCustomValidity('Ingresa un telefono valido (8 a 15 digitos).');
            return;
        }

        input.setCustomValidity('');
    }

    document.addEventListener('DOMContentLoaded', function () {
        var form = document.getElementById('contactForm');
        if (!form) {
            return;
        }

        var serviceField = document.getElementById('serviceInterest');
        var phoneField = form.querySelector('input[name="telefono"]');

        if (phoneField) {
            phoneField.addEventListener('input', function () {
                validatePhone(phoneField);
            });

            phoneField.addEventListener('blur', function () {
                validatePhone(phoneField);
            });
        }

        if (serviceField) {
            var params = new URLSearchParams(window.location.search);
            var mappedValue = mapServiceValue(params.get('servicio') || params.get('interes') || params.get('cta'));
            if (mappedValue) {
                serviceField.value = mappedValue;
            }
        }

        form.addEventListener('submit', function (event) {
            if (phoneField) {
                validatePhone(phoneField);
            }

            if (!form.checkValidity()) {
                event.preventDefault();
                form.reportValidity();
                return;
            }
        });
    });
})();
