/**
 * don.js — Page Faire un don
 * NOTE: version minimale pour envoyer la demande de don par email.
 */
(function () {
  'use strict';

  const form = document.getElementById('donForm');
  if (!form) return;

  const successEl = document.getElementById('donSuccess');
  const btn = form.querySelector('button[type="submit"]');
  const typeHidden = document.getElementById('donFormType');
  const amountInput = document.getElementById('donFormAmount');

  // Fields
  const nameEl = document.getElementById('donName');
  const emailEl = document.getElementById('donEmail');
  const phoneEl = document.getElementById('donPhone');
  const countryEl = document.getElementById('donCountry');
  const messageEl = document.getElementById('donMessage');
  const anonEl = document.getElementById('donAnonymous');

  function getType() {
    return (typeHidden && typeHidden.value) ? typeHidden.value : 'Don ponctuel';
  }

  function getAmount() {
    if (!amountInput) return null;
    const v = parseFloat(amountInput.value);
    return Number.isFinite(v) ? v : null;
  }

  async function submitDonation() {
    const payload = {
      type: 'donation',
      name: nameEl ? nameEl.value.trim() : '',
      email: emailEl ? emailEl.value.trim() : '',
      phone: phoneEl ? phoneEl.value.trim() : '',
      country: countryEl ? countryEl.value.trim() : '',
      message: messageEl ? messageEl.value.trim() : '',
      anonymous: anonEl ? !!anonEl.checked : false,
      donation_type: getType(),
      amount: getAmount(),
      currency: (document.getElementById('donFormCurrency') || {}).value || 'USD',
      paymentMethod: (form.querySelector('input[name="paymentMethod"]:checked') || {}).value || '',
    };

    if (!payload.email || !payload.name || !payload.phone || !payload.country || !payload.amount) {
      throw new Error("Champs obligatoires manquants");
    }

    const endpoint = window.REVIVAL_ENDPOINTS && window.REVIVAL_ENDPOINTS.donation;
    if (!endpoint) {
      throw new Error('Endpoint donation manquant côté backend');
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'same-origin',
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      const msg = data && data.message ? data.message : 'Erreur lors de l’envoi.';
      throw new Error(msg);
    }

    return data;
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (btn) {
      btn.disabled = true;
      const original = btn.innerHTML;
      btn.innerHTML = 'Envoi en cours…';
      try {
        const data = await submitDonation();
        if (successEl) {
          successEl.classList.add('visible');
          if (data && data.id) {
            successEl.dataset.id = data.id;
          }
        }
        form.reset();
      } catch (err) {
        alert(err.message || 'Erreur');
      } finally {
        btn.disabled = false;
        btn.innerHTML = original;
      }
    } else {
      try {
        await submitDonation();
      } catch (err) {
        alert(err.message || 'Erreur');
      }
    }
  });
})();
