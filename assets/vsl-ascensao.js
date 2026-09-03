/* Trava de VSL — Ascensão Empresarial
   Esconde o conteúdo abaixo do vídeo e libera aos 8 min de reprodução.
   Carregado por: <script src="/assets/vsl-ascensao.js"></script> (no <head>).
   Reaplicar após cada re-export da LP. */
(function () {
  "use strict";

  var GATE_SECONDS = 480;                              // 8 minutos
  var PLAYER_ID    = "vid-6a7e764df58befd718ababd5";   // player converteai/vturb
  var SS_KEY       = "vsl_ascensao_unlocked";          // lembra na aba (refresh não re-tranca)
  var HARD_CAP_MS  = 20 * 60 * 1000;                   // trava de segurança: libera após 20 min de qualquer forma

  var hidden = [], ph = null, unlocked = false, bootAt = Date.now();

  function injectCSS() {
    if (document.getElementById("vsl-css")) return;
    var st = document.createElement("style");
    st.id = "vsl-css";
    st.textContent =
      ".vsl-hidden{display:none!important}" +
      "#vsl-lock{max-width:640px;margin:22px auto 4px;padding:20px 24px;text-align:center;" +
        "font-family:'Hanken Grotesk',-apple-system,BlinkMacSystemFont,sans-serif;color:#C9B4A3}" +
      "#vsl-lock .vsl-ic{font-size:22px;line-height:1;margin-bottom:8px}" +
      "#vsl-lock .vsl-tx{font-size:14.5px;line-height:1.6}" +
      "#vsl-lock .vsl-tx b{color:#EA9A5E}" +
      "#vsl-lock .vsl-bar{margin:13px auto 0;max-width:320px;height:6px;border-radius:99px;" +
        "background:rgba(226,116,46,0.16);overflow:hidden}" +
      "#vsl-lock .vsl-bar>i{display:block;height:100%;width:0;background:#E2742E;" +
        "box-shadow:0 0 10px rgba(226,116,46,.6);transition:width .6s linear}" +
      ".vsl-reveal{animation:vslfade .7s ease both}" +
      "@keyframes vslfade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}";
    (document.head || document.documentElement).appendChild(st);
  }

  function hide(el) { if (el) { el.classList.add("vsl-hidden"); hidden.push(el); } }

  function buildGate(hero, player) {
    // Sobe do vídeo até o hero escondendo, em CADA nível, tudo que vem DEPOIS.
    // Assim pega o CTA/legenda que ficam dentro do container interno do hero.
    var wrapper = null, cur = player;
    while (cur && cur !== hero) {
      var sib = cur.nextElementSibling;
      if (sib && !wrapper) wrapper = cur;   // 1º nível com irmão seguinte = wrapper do vídeo
      while (sib) { hide(sib); sib = sib.nextElementSibling; }
      cur = cur.parentNode;
    }
    // esconde todas as seções/irmãos depois do hero
    var n = hero.nextElementSibling;
    while (n) { hide(n); n = n.nextElementSibling; }
    // placeholder logo abaixo do vídeo (antes do CTA)
    var anchor = wrapper || player;
    ph = document.createElement("div");
    ph.id = "vsl-lock";
    ph.innerHTML =
      '<div class="vsl-ic">🔒</div>' +
      '<div class="vsl-tx">Continue assistindo — o conteúdo abaixo <b>libera sozinho</b> conforme você avança no vídeo.</div>' +
      '<div class="vsl-bar"><i></i></div>';
    anchor.parentNode.insertBefore(ph, anchor.nextSibling);
  }

  function reveal() {
    if (unlocked) return;
    unlocked = true;
    try { sessionStorage.setItem(SS_KEY, "1"); } catch (e) {}
    for (var i = 0; i < hidden.length; i++) {
      hidden[i].classList.remove("vsl-hidden");
      hidden[i].classList.add("vsl-reveal");
    }
    if (ph && ph.parentNode) ph.parentNode.removeChild(ph);
  }

  function getVideo() {
    var c = document.getElementById(PLAYER_ID);
    var v = c ? c.querySelector("video") : null;
    return v || document.querySelector("video");
  }

  function progress(t) {
    if (!ph) return;
    var bar = ph.querySelector(".vsl-bar>i");
    if (bar) bar.style.width = Math.max(0, Math.min(100, (t / GATE_SECONDS) * 100)) + "%";
  }

  function start(hero, player) {
    injectCSS();
    buildGate(hero, player);
    var videoSeenAt = 0;
    var iv = setInterval(function () {
      try {
        var v = getVideo(), t = null;
        if (v && !isNaN(v.currentTime)) { t = v.currentTime; if (!videoSeenAt) videoSeenAt = Date.now(); }

        // fallback: sem <video> acessível após 30s → usa tempo decorrido
        if (t === null && (Date.now() - bootAt) > 30000) t = (Date.now() - bootAt - 30000) / 1000;

        if (t !== null) progress(t);

        // libera: chegou aos 8 min de vídeo  OU  trava de segurança de 20 min
        if ((t !== null && t >= GATE_SECONDS) || (Date.now() - bootAt) > HARD_CAP_MS) {
          reveal(); clearInterval(iv);
        }
      } catch (e) { reveal(); clearInterval(iv); }
    }, 1000);
  }

  function boot() {
    // já assistiu nesta aba? não tranca.
    try { if (sessionStorage.getItem(SS_KEY) === "1") return; } catch (e) {}

    var tries = 0;
    var wait = setInterval(function () {
      tries++;
      var player = document.getElementById(PLAYER_ID);
      var hero = player ? player.closest("section") : null;
      if (player && hero) {
        clearInterval(wait);
        start(hero, player);
      }
      // se o player não aparecer em ~15s, aborta: NÃO tranca (não quebra a página)
      if (tries > 60) clearInterval(wait);
    }, 250);
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
