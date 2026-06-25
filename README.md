# Landing Pages

Repositório que hospeda múltiplas landing pages, cada uma na sua própria subpasta.

## Estrutura

```
/
├── index.html                  # página raiz mínima (evita listagem/403; pode trocar ou remover)
├── imersaofoco2026/index.html      ->  /imersaofoco2026/
├── protocolomaestria/index.html    ->  /protocolomaestria/
├── ascensaoempresarial/index.html  ->  /ascensaoempresarial/
├── oconselho/index.html            ->  /oconselho/
├── achavedotempo/index.html        ->  /achavedotempo/
└── ciclodainovacao/index.html      ->  /ciclodainovacao/
```

## Landing pages

| LP | Pasta | URL |
|----|-------|-----|
| Imersão Foco 2026 | `imersaofoco2026/` | `/imersaofoco2026/` |
| Protocolo Maestria | `protocolomaestria/` | `/protocolomaestria/` |
| Ascensão Empresarial | `ascensaoempresarial/` | `/ascensaoempresarial/` |
| O Conselho | `oconselho/` | `/oconselho/` |
| A Chave do Tempo | `achavedotempo/` | `/achavedotempo/` |
| Ciclo da Inovação | `ciclodainovacao/` | `/ciclodainovacao/` |

> As páginas atuais são provisórias (placeholder). Substitua o conteúdo de cada
> `index.html` pela landing page de verdade.

## Como adicionar uma nova LP

1. Crie uma pasta nova na raiz, ex.: `lp-minha-campanha/`.
2. Coloque o arquivo da landing page dentro dela com o nome `index.html`.
3. Faça commit e push.
4. A LP fica acessível em `seudominio.com.br/lp-minha-campanha/`.

> Importante: o arquivo dentro de cada pasta precisa se chamar **`index.html`**
> para que o servidor sirva a página automaticamente só com a URL da pasta,
> sem precisar digitar o nome do arquivo.
