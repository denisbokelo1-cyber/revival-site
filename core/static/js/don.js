/**
 * don.js — Page Faire un don
 */
(function () {
  'use strict';

  const state = {
    type: 'once',
    amount: 25,
    currency: 'USD',
    custom: false
  };

  const onceAmounts = [10, 25, 50, 100];
  const monthlyAmounts = [5, 10, 25];

  const amountGrid = document.getElementById('donAmountGrid');
  const customWrap = document.getElementById('donCustomWrap');
  const customInput = document.getElementById('donCustomAmount');
  const formAmount = document.getElementById('donFormAmount');
  const formType = document.getElementById('donFormType');
  const formCurrency = document.getElementById('donFormCurrency');
  const tabs = document.querySelectorAll('.don-type-tab');
  const form = document.getElementById('donForm');

  if (!amountGrid || !form) return;

  function formatAmount(n) {
    return state.type === 'monthly' ? n + ' USD/mois' : n + ' USD';
  }

  function syncFormFields() {
    if (formAmount) formAmount.value = state.amount;
    if (formType) formType.value = state.type === 'monthly' ? 'Don mensuel' : 'Don ponctuel';
    if (formCurrency && formCurrency.value) state.currency = formCurrency.value;
  }

  function renderAmountButtons() {
    const amounts = state.type === 'monthly' ? monthlyAmounts : onceAmounts;
    const suffix = state.type === 'monthly' ? '/mois' : '';
    amountGrid.innerHTML = amounts.map(function (a) {
      const active = !state.custom && state.amount === a ? ' active' : '';
      return '<button type="button" class="don-amount-btn' + active + '" data-amount="' + a + '">' + a + ' USD' + suffix + '</button>';
    }).join('') +
      '<button type="button" class="don-amount-btn don-amount-btn--custom' + (state.custom ? ' active' : '') + '" id="donCustomBtn">Montant personnalisé</button>';

    amountGrid.querySelectorAll('.don-amount-btn[data-amount]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.custom = false;
        state.amount = parseInt(btn.dataset.amount, 10);
        customWrap.classList.remove('visible');
        if (customInput) customInput.value = '';
        renderAmountButtons();
        syncFormFields();
      });
    });

    const customBtn = document.getElementById('donCustomBtn');
    if (customBtn) {
      customBtn.addEventListener('click', function () {
        state.custom = true;
        customWrap.classList.add('visible');
        renderAmountButtons();
        if (customInput) customInput.focus();
      });
    }
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const type = tab.dataset.type;
      if (type === state.type) return;
      state.type = type;
      state.custom = false;
      state.amount = type === 'monthly' ? 10 : 25;
      customWrap.classList.remove('visible');
      if (customInput) customInput.value = '';
      tabs.forEach(function (t) { t.classList.toggle('active', t.dataset.type === type); });
      renderAmountButtons();
      syncFormFields();
    });
  });

  if (customInput) {
    customInput.addEventListener('input', function () {
      const v = parseFloat(customInput.value);
      if (v > 0) {
        state.amount = v;
        syncFormFields();
      }
    });
  }

  if (formCurrency) {
    formCurrency.addEventListener('change', function () {
      state.currency = formCurrency.value;
    });
  }

  document.querySelectorAll('a[href="#don-form"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      document.getElementById('don-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const successEl = document.getElementById('donSuccess');
    const originalHTML = btn.innerHTML;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    btn.disabled = true;
    btn.innerHTML = 'Préparation du parcours…';

    window.setTimeout(function () {
      successEl.classList.add('visible');
      form.reset();
      state.type = 'once';
      state.amount = 25;
      state.custom = false;
      tabs.forEach(function (t) { t.classList.toggle('active', t.dataset.type === 'once'); });
      customWrap.classList.remove('visible');
      renderAmountButtons();
      syncFormFields();
      document.getElementById('don-form').scrollIntoView({ behavior: 'smooth' });
      btn.disabled = false;
      btn.innerHTML = originalHTML;
    }, 450);
  });

  renderAmountButtons();
  syncFormFields();
})();
