/* Google Tag Manager + Consent Mode (LGPD) — Ednaldo Henper
   Carregado por: <script src="/assets/gtm.js"></script> o mais alto possível no <head>.
   Container: GTM-NMC7PDM9  |  GA4 é configurado DENTRO do GTM. */
(function () {
  "use strict";
  var GTM_ID = "GTM-NMC7PDM9";

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }

  // Consent Mode — padrão: mede audiência (analytics) com aviso de cookies;
  // cookies de anúncio/remarketing só depois do aceite.
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "granted",
    wait_for_update: 500
  });

  // Se a pessoa já aceitou cookies antes (qualquer banner do site), libera anúncios.
  try {
    var keys = ["eh_cookie_consent", "eh_ascensao_cookies"];
    for (var k = 0; k < keys.length; k++) {
      if (localStorage.getItem(keys[k]) === "accepted") {
        gtag("consent", "update", {
          ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted"
        });
        break;
      }
    }
  } catch (e) {}

  // Expõe uma função global pros banners chamarem no "Aceitar".
  window.ehConsentGranted = function () {
    gtag("consent", "update", {
      ad_storage: "granted", ad_user_data: "granted",
      ad_personalization: "granted", analytics_storage: "granted"
    });
  };

  // GA4 é configurado DENTRO do container GTM (Tag do Google · G-F5ZKX2H0ZM,
  // acionamento "Inicialização - Todas as páginas"). Não duplicar aqui.

  // Loader do GTM
  (function (w, d, s, l, i) {
    w[l] = w[l] || []; w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var f = d.getElementsByTagName(s)[0], j = d.createElement(s),
        dl = l != "dataLayer" ? "&l=" + l : "";
    j.async = true; j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, "script", "dataLayer", GTM_ID);
})();
