/*
  consent.js — Ednaldo Henper
  Injeta em qualquer página: (1) rodapé com links legais, (2) banner de cookies LGPD,
  (3) carrega o Meta Pixel SOMENTE após o aceite.

  COMO USAR: cole esta linha antes de </body> nas suas páginas:
    <script src="/assets/consent.js" defer></script>

  CONFIGURAÇÃO: troque o PIXEL_ID abaixo pelo seu ID real do Meta Pixel.
  Enquanto estiver "SEU_PIXEL_ID", o Pixel NÃO é carregado (nada quebra).
*/
(function () {
  "use strict";

  var PIXEL_ID = "SEU_PIXEL_ID";          // <-- troque pelo seu Pixel ID (ex.: "1234567890")
  var STORAGE_KEY = "eh_cookie_consent";  // 'accepted' | 'declined'

  // ---------- Meta Pixel (só roda após consentimento) ----------
  function loadMetaPixel() {
    if (!PIXEL_ID || PIXEL_ID === "SEU_PIXEL_ID") return; // ainda não configurado
    if (window.fbq) return;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0";
      n.queue = []; t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", PIXEL_ID);
    window.fbq("track", "PageView");
  }

  // ---------- Rodapé ----------
  function injectFooter() {
    if (document.getElementById("eh-footer")) return;
    var year = (document.lastModified || "").slice(-4) || "";
    var f = document.createElement("footer");
    f.id = "eh-footer";
    f.innerHTML =
      '<div class="eh-foot-inner">' +
        '<span>&copy; ' + (year || "") + ' Ednaldo Henper</span>' +
        '<nav>' +
          '<a href="/politica-de-privacidade/">Política de Privacidade</a>' +
          '<a href="/termos-de-uso/">Termos de Uso</a>' +
        '</nav>' +
      '</div>';
    document.body.appendChild(f);
  }

  // ---------- Banner de cookies ----------
  function injectBanner() {
    var decision = null;
    try { decision = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (decision === "accepted") { loadMetaPixel(); return; }
    if (decision === "declined") return;

    var bar = document.createElement("div");
    bar.id = "eh-cookie";
    bar.innerHTML =
      '<p>Usamos cookies para melhorar sua experiência e mensurar nossas campanhas. ' +
      'Veja a <a href="/politica-de-privacidade/">Política de Privacidade</a>.</p>' +
      '<div class="eh-cookie-btns">' +
        '<button id="eh-decline">Recusar</button>' +
        '<button id="eh-accept">Aceitar</button>' +
      '</div>';
    document.body.appendChild(bar);

    document.getElementById("eh-accept").onclick = function () {
      try { localStorage.setItem(STORAGE_KEY, "accepted"); } catch (e) {}
      bar.remove(); loadMetaPixel();
    };
    document.getElementById("eh-decline").onclick = function () {
      try { localStorage.setItem(STORAGE_KEY, "declined"); } catch (e) {}
      bar.remove();
    };
  }

  // ---------- Estilos ----------
  function injectStyles() {
    var css =
      '#eh-footer{background:#161A20;color:#C9C4B8;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding:22px 20px;margin-top:40px}' +
      '#eh-footer .eh-foot-inner{max-width:980px;margin:0 auto;display:flex;flex-wrap:wrap;gap:10px 20px;align-items:center;justify-content:space-between;font-size:13px}' +
      '#eh-footer nav a{color:#C9A24A;text-decoration:none;margin-left:18px}' +
      '#eh-footer nav a:first-child{margin-left:0}' +
      '#eh-footer nav a:hover{text-decoration:underline}' +
      '#eh-cookie{position:fixed;left:16px;right:16px;bottom:16px;max-width:560px;margin:0 auto;background:#fff;color:#161A20;border:1px solid rgba(22,26,32,.15);box-shadow:0 10px 40px rgba(22,26,32,.18);border-radius:14px;padding:18px 20px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;z-index:99999}' +
      '#eh-cookie p{font-size:14px;line-height:1.5;margin:0 0 14px}' +
      '#eh-cookie a{color:#B98F33}' +
      '#eh-cookie .eh-cookie-btns{display:flex;gap:10px;justify-content:flex-end}' +
      '#eh-cookie button{font-size:14px;font-weight:700;border:0;border-radius:8px;padding:10px 18px;cursor:pointer}' +
      '#eh-decline{background:transparent;color:#5B6675;border:1px solid rgba(22,26,32,.2)}' +
      '#eh-accept{background:#C9A24A;color:#161A20}' +
      '#eh-accept:hover{background:#B98F33}';
    var s = document.createElement("style");
    s.appendChild(document.createTextNode(css));
    document.head.appendChild(s);
  }

  function init() { injectStyles(); injectFooter(); injectBanner(); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
