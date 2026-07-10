/* coi-serviceworker DESATIVADO.
   A versão anterior (COOP/COEP para ffmpeg multi-thread) estava quebrando o
   carregamento do app: interceptava as requisições e, quando uma falhava,
   devolvia um valor inválido ("Failed to convert value to 'Response'"),
   deixando a página em branco.
   Este arquivo agora NÃO intercepta nada e ainda REMOVE qualquer service
   worker antigo que tenha ficado registrado. */
if (typeof window === "undefined") {
  // --- contexto do Service Worker ---
  self.addEventListener("install", () => self.skipWaiting());
  self.addEventListener("activate", (event) => {
    event.waitUntil((async () => {
      try { await self.registration.unregister(); } catch (e) {}
      try {
        const clients = await self.clients.matchAll({ type: "window" });
        clients.forEach((c) => { try { c.navigate(c.url); } catch (e) {} });
      } catch (e) {}
    })());
  });
  // Sem listener de "fetch": não intercepta requisição nenhuma → não quebra nada.
} else {
  // --- contexto da página: desregistra qualquer SW deste escopo ---
  if (navigator.serviceWorker) {
    navigator.serviceWorker.getRegistrations()
      .then((regs) => regs.forEach((r) => { try { r.unregister(); } catch (e) {} }))
      .catch(() => {});
  }
}
