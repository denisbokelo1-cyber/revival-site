/**
 * ApplicationModalSimple
 * Gere la fenetre de candidature : ouverture, validation, envoi via fetch POST
 * vers application-submit.php, et confirmation par email a recruitment@revival-business.com
 */
class ApplicationModalSimple {
  constructor() {
    this.overlay = null;
    this.modal = null;
    this.currentJob = {};
    this._boundKeydown = this._onKeydown.bind(this);
    this._init();
  }

  _init() {
    // Injecter le conteneur si absent
    if (!document.getElementById('applicationModal')) {
      const div = document.createElement('div');
      div.id = 'applicationModal';
      document.body.appendChild(div);
    }
  }

  open(jobData) {
    this.currentJob = jobData || {};
    this._render();
    requestAnimationFrame(() => {
      this.overlay.classList.add('open');
    });
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', this._boundKeydown);
  }

  close() {
    if (!this.overlay) return;
    this.overlay.classList.remove('open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this._boundKeydown);
    setTimeout(() => {
      if (this.overlay && this.overlay.parentNode) {
        this.overlay.parentNode.removeChild(this.overlay);
      }
      this.overlay = null;
      this.modal = null;
    }, 350);
  }

  _onKeydown(e) {
    if (e.key === 'Escape') this.close();
  }

  _isExpired(job) {
    return job.expired === true;
  }

  _render() {
    const job = this.currentJob;
    const expired = this._isExpired(job);

    const html = `
    <div class="app-modal-overlay" id="appModalOverlay">
      <div class="app-modal" role="dialog" aria-modal="true" aria-labelledby="appModalTitle">
        <div class="app-modal__header">
          <div>
            <div class="app-modal__title" id="appModalTitle">${expired ? gettext("Details de l'offre") : gettext('Postuler')}</div>
            <div class="app-modal__subtitle">${job.title || ''} ${job.company ? '&bull; ' + job.company : ''} ${job.location ? '&bull; ' + job.location : ''}</div>
          </div>
          <button class="app-modal__close" id="appModalClose" aria-label="${gettext('Fermer')}">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="app-modal__body">
          ${expired ? this._renderExpiredBanner() : ''}
          ${expired ? this._renderJobDetails(job) : this._renderForm(job)}
        </div>
        ${!expired ? this._renderFooter() : `<div class="app-modal__footer"><button class="btn btn--outline" id="appModalCancel">${gettext('Fermer')}</button></div>`}
      </div>
    </div>`;

    const container = document.getElementById('applicationModal');
    container.innerHTML = html;

    this.overlay = document.getElementById('appModalOverlay');
    this.modal = this.overlay.querySelector('.app-modal');

    // Events
    document.getElementById('appModalClose').addEventListener('click', () => this.close());
    const cancelBtn = document.getElementById('appModalCancel');
    if (cancelBtn) cancelBtn.addEventListener('click', () => this.close());

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    if (!expired) {
      this._bindFileInputs();
      document.getElementById('appForm').addEventListener('submit', (e) => {
        e.preventDefault();
        this._submit();
      });
    }
  }

  _renderExpiredBanner() {
    return `<div class="app-modal__expired-banner">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      ${gettext("Cette offre est expiree. Le depot de candidature n'est plus possible.")}
    </div>`;
  }

  _renderJobDetails(job) {
    return `<div>
      <p style="font-size:14px;color:var(--gray);line-height:1.7;">${job.description || gettext('Aucune description disponible.')}</p>
    </div>`;
  }

  _renderForm(job) {
    return `
    <form id="appForm" novalidate>
      <!-- Champs caches -->
      <input type="hidden" name="job_id" value="${this._esc(job.id || '')}" />
      <input type="hidden" name="job_title" value="${this._esc(job.title || '')}" />
      <input type="hidden" name="job_company" value="${this._esc(job.company || '')}" />
      <input type="hidden" name="job_location" value="${this._esc(job.location || '')}" />
      <input type="hidden" name="job_description" value="${this._esc(job.description || '')}" />
      <input type="hidden" name="recipient_email" value="recruitment@revival-business.com" />

      <!-- Section 1 : Informations personnelles -->
      <div class="app-form__section">
        <div class="app-form__section-title">${gettext('1. Informations personnelles')}</div>
        <div class="form-group">
          <label for="appFullName">${gettext('Nom complet')} <span class="req">*</span></label>
          <input type="text" id="appFullName" name="full_name" placeholder="${gettext('Votre nom complet')}" autocomplete="name" />
          <div class="form-error" id="errFullName">${gettext('Veuillez saisir votre nom complet.')}</div>
        </div>
        <div class="form-group">
          <label for="appEmail">${gettext('Adresse email')} <span class="req">*</span></label>
          <input type="email" id="appEmail" name="email" placeholder="votre@email.com" autocomplete="email" />
          <div class="form-error" id="errEmail">${gettext('Veuillez saisir une adresse email valide.')}</div>
        </div>
      </div>

      <!-- Section 2 : Infos RH -->
      <div class="app-form__section">
        <div class="app-form__section-title">${gettext('2. Informations RH')}</div>
        <div class="form-group">
          <label for="appSalary">${gettext('Pretention salariale (USD)')}</label>
          <input type="text" id="appSalary" name="salary_expectation" placeholder="${gettext('Ex: 50 000 USD')}" />
        </div>
        <div class="form-group">
          <label for="appAvailability">${gettext('Disponibilite / Preavis')} <span class="req">*</span></label>
          <select id="appAvailability" name="availability">
            <option value="">${gettext('-- Selectionnez --')}</option>
            <option value="Immediatement">${gettext('Immediatement')}</option>
            <option value="1 semaine">${gettext('1 semaine')}</option>
            <option value="2 semaines">${gettext('2 semaines')}</option>
            <option value="1 mois">${gettext('1 mois')}</option>
            <option value="2 mois">${gettext('2 mois')}</option>
            <option value="3 mois">${gettext('3 mois')}</option>
            <option value="Plus de 3 mois">${gettext('Plus de 3 mois')}</option>
          </select>
          <div class="form-error" id="errAvailability">${gettext('Veuillez indiquer votre disponibilite.')}</div>
        </div>
      </div>

      <!-- Section 3 : Pieces jointes -->
      <div class="app-form__section">
        <div class="app-form__section-title">${gettext('3. Pieces jointes')}</div>
        <div class="form-group">
          <label>CV <span class="req">*</span></label>
          <label class="file-upload-label" id="cvLabel" for="appCV">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span id="cvLabelText">${gettext('Choisir un fichier (PDF, DOC, DOCX — max 5 Mo)')}</span>
            <input type="file" id="appCV" name="cv" accept=".pdf,.doc,.docx" />
          </label>
          <div class="file-info" id="cvInfo"></div>
          <div class="form-error" id="errCV">${gettext('Veuillez joindre votre CV (PDF/DOC/DOCX, max 5 Mo).')}</div>
        </div>
        <div class="form-group">
          <label>${gettext('Lettre de motivation')} <span class="req">*</span></label>
          <label class="file-upload-label" id="coverLabel" for="appCover">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span id="coverLabelText">${gettext('Choisir un fichier (PDF, DOC, DOCX — max 5 Mo)')}</span>
            <input type="file" id="appCover" name="cover_letter" accept=".pdf,.doc,.docx" />
          </label>
          <div class="file-info" id="coverInfo"></div>
          <div class="form-error" id="errCover">${gettext('Veuillez joindre votre lettre de motivation (PDF/DOC/DOCX, max 5 Mo).')}</div>
        </div>
      </div>

      <!-- Section 4 : Consentement -->
      <div class="app-form__section">
        <div class="app-form__section-title">${gettext('4. Consentement')}</div>
        <div class="form-check">
          <input type="checkbox" id="appRgpd" name="rgpd_consent" value="1" />
          <label for="appRgpd">${gettext("J'accepte que mes donnees personnelles soient traitees dans le cadre de ma candidature.")} <span class="req">*</span></label>
        </div>
        <div class="form-error" id="errRgpd" style="margin-top:-8px;margin-bottom:8px;">${gettext('Vous devez accepter le traitement de vos donnees.')}</div>
        <div class="form-check">
          <input type="checkbox" id="appRecontact" name="recontact_consent" value="1" />
          <label for="appRecontact">${gettext("J'accepte d'etre recontacte(e) pour d'autres offres correspondant a mon profil.")}</label>
        </div>
      </div>
    </form>`;
  }

  _renderFooter() {
    return `<div class="app-modal__footer">
      <button class="btn btn--outline" id="appModalCancel">${gettext('Annuler')}</button>
      <button class="btn btn--primary" id="appSubmitBtn" type="submit" form="appForm">
        ${gettext('Envoyer ma candidature')}
      </button>
    </div>`;
  }

  _bindFileInputs() {
    this._bindFile('appCV', 'cvLabel', 'cvLabelText', 'cvInfo', 'errCV');
    this._bindFile('appCover', 'coverLabel', 'coverLabelText', 'coverInfo', 'errCover');
  }

  _bindFile(inputId, labelId, textId, infoId, errId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.addEventListener('change', () => {
      const file = input.files[0];
      const label = document.getElementById(labelId);
      const text = document.getElementById(textId);
      const info = document.getElementById(infoId);
      const err = document.getElementById(errId);

      if (!file) return;

      const valid = this._validateFile(file);
      if (!valid.ok) {
        label.classList.add('error');
        label.classList.remove('has-file');
        text.textContent = gettext('Choisir un fichier (PDF, DOC, DOCX — max 5 Mo)');
        info.textContent = '';
        err.textContent = valid.msg;
        err.classList.add('visible');
        input.value = '';
        return;
      }

      label.classList.remove('error');
      label.classList.add('has-file');
      text.textContent = file.name;
      info.textContent = this._formatSize(file.size);
      err.classList.remove('visible');
    });
  }

  _validateFile(file) {
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const ext = file.name.split('.').pop().toLowerCase();
    const allowedExt = ['pdf', 'doc', 'docx'];
    if (!allowedExt.includes(ext)) return { ok: false, msg: gettext('Format non accepte. Utilisez PDF, DOC ou DOCX.') };
    if (file.size > 5 * 1024 * 1024) return { ok: false, msg: gettext('Fichier trop volumineux (max 5 Mo).') };
    return { ok: true };
  }

  _formatSize(bytes) {
    if (bytes < 1024) return bytes + ' o';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
    return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
  }

  _esc(str) {
    return String(str).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  _validate() {
    let valid = true;
    const show = (id, msg) => {
      const el = document.getElementById(id);
      if (el) { el.textContent = msg || el.textContent; el.classList.add('visible'); }
    };
    const hide = (id) => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('visible');
    };
    const setErr = (inputId, errId, msg) => {
      const inp = document.getElementById(inputId);
      if (inp) inp.classList.add('error');
      show(errId, msg);
      valid = false;
    };
    const clearErr = (inputId, errId) => {
      const inp = document.getElementById(inputId);
      if (inp) inp.classList.remove('error');
      hide(errId);
    };

    // Nom
    const name = document.getElementById('appFullName');
    if (!name || !name.value.trim()) setErr('appFullName', 'errFullName');
    else clearErr('appFullName', 'errFullName');

    // Email
    const email = document.getElementById('appEmail');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRe.test(email.value.trim())) setErr('appEmail', 'errEmail');
    else clearErr('appEmail', 'errEmail');

    // Disponibilite
    const avail = document.getElementById('appAvailability');
    if (!avail || !avail.value) setErr('appAvailability', 'errAvailability');
    else clearErr('appAvailability', 'errAvailability');

    // CV
    const cv = document.getElementById('appCV');
    if (!cv || !cv.files[0]) {
      document.getElementById('cvLabel').classList.add('error');
      show('errCV');
      valid = false;
    } else {
      document.getElementById('cvLabel').classList.remove('error');
      hide('errCV');
    }

    // Cover
    const cover = document.getElementById('appCover');
    if (!cover || !cover.files[0]) {
      document.getElementById('coverLabel').classList.add('error');
      show('errCover');
      valid = false;
    } else {
      document.getElementById('coverLabel').classList.remove('error');
      hide('errCover');
    }

    // RGPD
    const rgpd = document.getElementById('appRgpd');
    if (!rgpd || !rgpd.checked) {
      show('errRgpd');
      valid = false;
    } else {
      hide('errRgpd');
    }

    return valid;
  }

  _scrollToFirstError() {
    const first = this.modal.querySelector('.form-error.visible, .error');
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  async _submit() {
    if (!this._validate()) {
      this._scrollToFirstError();
      return;
    }

    const btn = document.getElementById('appSubmitBtn');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> ' + gettext('Envoi en cours...');

    const form = document.getElementById('appForm');
    const formData = new FormData(form);

    try {
      const res = await fetch(window.REVIVAL_ENDPOINTS?.application || '/api/application/', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error(gettext('Erreur serveur') + ' ' + res.status);
      const data = await res.json();

      if (data.success) {
        this._toast(gettext('Candidature envoyee avec succes ! Vous recevrez une confirmation par email.'), 'success');
        setTimeout(() => this.close(), 3000);
      } else {
        throw new Error(data.message || gettext("Erreur lors de l'envoi."));
      }
    } catch (err) {
      this._toast(gettext('Une erreur est survenue :') + ' ' + err.message, 'error');
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  }

  _toast(msg, type) {
    const existing = document.querySelector('.app-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `app-toast app-toast--${type}`;
    const icon = type === 'success'
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    toast.innerHTML = icon + '<span>' + msg + '</span>';
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('visible'));
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, 5000);
  }
}

// Instance globale
window.appModal = new ApplicationModalSimple();
