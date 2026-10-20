/* Consentimento de cookies (LGPD, Lei 13.709/2018) + Google Tag Manager com Consent Mode v2
 *
 * Como funciona
 * - Na primeira visita aparece uma faixa pedindo consentimento. Nada de medição é carregado antes da escolha.
 * - A escolha fica gravada no cookie "al_consent" (granted | denied) por 12 meses. Guardar a escolha é
 *   necessário para não perguntar de novo e não depende de consentimento.
 * - Se a pessoa ACEITAR: grava também o cookie de acesso "al_acesso" (primeira visita, última visita e
 *   número de visitas) e libera o Google Tag Manager/GA4, quando o GTM_ID estiver preenchido.
 * - Se RECUSAR: nenhum cookie de medição ou de acesso é gravado; "al_acesso" é apagado, se existir.
 * - A pessoa pode mudar de ideia a qualquer momento pelo link "Preferências de cookies" no rodapé.
 *
 * Para ativar o Google Analytics: preencha GTM_ID com o ID do contêiner (ex.: 'GTM-ABC1234').
 * Eventos enviados ao dataLayer: whatsapp_click { link_location } e contact_form_submit { modalidade }.
 */
(function () {
  var GTM_ID = '';               // ← preencher quando o GTM for criado
  var CONSENT = 'al_consent', ACCESS = 'al_acesso', DAYS = 365;

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', functionality_storage: 'granted', security_storage: 'granted',
    wait_for_update: 500
  });

  function getCookie(n) {
    var m = document.cookie.match('(?:^|; )' + n + '=([^;]*)');
    return m ? decodeURIComponent(m[1]) : null;
  }
  function setCookie(n, v, days) {
    var secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = n + '=' + encodeURIComponent(v) + '; Max-Age=' + (days * 86400) + '; Path=/; SameSite=Lax' + secure;
  }
  function delCookie(n) { document.cookie = n + '=; Max-Age=0; Path=/; SameSite=Lax'; }

  function recordAccess() {
    var now = new Date().toISOString(), data = {};
    try { data = JSON.parse(getCookie(ACCESS) || '{}'); } catch (e) { data = {}; }
    data.primeira = data.primeira || now;
    if (!sessionStorageSeen()) { data.visitas = (data.visitas || 0) + 1; }
    data.ultima = now;
    setCookie(ACCESS, JSON.stringify(data), DAYS);
  }
  function sessionStorageSeen() {
    try { if (sessionStorage.getItem('al_sess')) return true; sessionStorage.setItem('al_sess', '1'); } catch (e) {}
    return false;
  }

  var gtmLoaded = false;
  function loadGTM() {
    if (!GTM_ID || gtmLoaded) return; gtmLoaded = true;
    (function (w, d, s, l, i) {
      w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var f = d.getElementsByTagName(s)[0], j = d.createElement(s); j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i; f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', GTM_ID);
  }

  function apply(choice) {
    var g = choice === 'granted' ? 'granted' : 'denied';
    gtag('consent', 'update', { analytics_storage: g, ad_storage: g, ad_user_data: g, ad_personalization: g });
    if (g === 'granted') { recordAccess(); loadGTM(); }
    else { delCookie(ACCESS); }
    window.dataLayer.push({ event: 'consent_' + g });
  }

  function save(choice) {
    setCookie(CONSENT, choice, DAYS);
    apply(choice);
  }

  var choice = getCookie(CONSENT);
  if (choice) apply(choice);

  function banner() {
    if (document.querySelector('.cc')) return;
    var el = document.createElement('section');
    el.className = 'cc';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-labelledby', 'cc-t');
    el.innerHTML =
      '<div class="cc-in">' +
        '<div class="cc-text">' +
          '<h2 id="cc-t">Sua privacidade é importante</h2>' +
          '<p>Em conformidade com a Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018), usamos cookies para ' +
          'registrar seu acesso e entender como o site é utilizado. Eles só são ativados se você aceitar. ' +
          'Você pode mudar sua escolha quando quiser em “Preferências de cookies”, no rodapé. ' +
          '<a href="privacidade.html">Leia a política de privacidade</a>.</p>' +
        '</div>' +
        '<div class="cc-actions">' +
          '<button type="button" class="btn btn-ghost" data-cc="denied">Recusar</button>' +
          '<button type="button" class="btn btn-primary" data-cc="granted">Aceitar cookies</button>' +
        '</div>' +
      '</div>';
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cc]'); if (!b) return;
      save(b.getAttribute('data-cc'));
      el.classList.add('cc-out');
      setTimeout(function () { el.remove(); }, 300);
      var opener = document.querySelector('.cc-open'); if (opener) opener.focus({ preventScroll: true });
    });
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('cc-in-view'); });
  }

  window.SiteConsent = { open: banner, get: function () { return getCookie(CONSENT); } };
  function init() {
    if (!getCookie(CONSENT)) banner();
    document.querySelectorAll('.cc-open').forEach(function (btn) {
      btn.hidden = false;
      btn.addEventListener('click', banner);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
