/* Trava de VSL — Ascensão Empresarial
   Esconde o conteúdo abaixo do vídeo e libera aos 8 min de reprodução.
   Carregado por: <script src="/assets/vsl-ascensao.js"></script> (no <head>).
   Reaplicar após cada re-export da LP. */
(function () {
  "use strict";

  var GATE_SECONDS = 480;                              // 8 minutos
  var PLAYER_ID    = "vid-6a7e764df58befd718ababd5";   // player converteai/vturb
  var SS_KEY       = "vsl_ascensao_unlocked";          // lembra no navegador entre visitas (não re-tranca ao voltar)
  var HARD_CAP_MS  = 20 * 60 * 1000;                   // trava de segurança: libera após 20 min de qualquer forma

  var hidden = [], unlocked = false, bootAt = Date.now();

  function injectCSS() {
    if (document.getElementById("vsl-css")) return;
    var st = document.createElement("style");
    st.id = "vsl-css";
    st.textContent =
      ".vsl-hidden{display:none!important}" +
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
    // Sem placeholder/aviso: durante o vídeo fica só o vídeo; o conteúdo
    // aparece sozinho aos 8 min. (ph permanece null.)
  }

  function reveal() {
    if (unlocked) return;
    unlocked = true;
    try { localStorage.setItem(SS_KEY, "1"); } catch (e) {}
    for (var i = 0; i < hidden.length; i++) {
      hidden[i].classList.remove("vsl-hidden");
      hidden[i].classList.add("vsl-reveal");
    }
  }

  function getVideo() {
    var c = document.getElementById(PLAYER_ID);
    var v = c ? c.querySelector("video") : null;
    return v || document.querySelector("video");
  }

  function start(hero, player) {
    injectCSS();
    buildGate(hero, player);
    var iv = setInterval(function () {
      try {
        var v = getVideo(), t = null;
        if (v && !isNaN(v.currentTime)) t = v.currentTime;

        // fallback: sem <video> acessível após 30s → usa tempo decorrido
        if (t === null && (Date.now() - bootAt) > 30000) t = (Date.now() - bootAt - 30000) / 1000;

        // libera: chegou aos 8 min de vídeo  OU  trava de segurança de 20 min
        if ((t !== null && t >= GATE_SECONDS) || (Date.now() - bootAt) > HARD_CAP_MS) {
          reveal(); clearInterval(iv);
        }
      } catch (e) { reveal(); clearInterval(iv); }
    }, 1000);
  }

  function boot() {
    // já assistiu nesta aba? não tranca.
    try { if (localStorage.getItem(SS_KEY) === "1") return; } catch (e) {}

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
