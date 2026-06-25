# Landing Pages

Repositório que hospeda múltiplas landing pages, cada uma na sua própria subpasta.

## Estrutura

```
/
├── index.html          # página raiz mínima (evita listagem/403; pode trocar ou remover)
├── lp-exemplo-1/
│   └── index.html      # Landing Page 1  ->  /lp-exemplo-1/
└── lp-exemplo-2/
    └── index.html      # Landing Page 2  ->  /lp-exemplo-2/
```

## Como adicionar uma nova LP

1. Crie uma pasta nova na raiz, ex.: `lp-minha-campanha/`.
2. Coloque o arquivo da landing page dentro dela com o nome `index.html`.
3. Faça commit e push.
4. A LP fica acessível em `seudominio.com.br/lp-minha-campanha/`.

> Importante: o arquivo dentro de cada pasta precisa se chamar **`index.html`**
> para que o servidor sirva a página automaticamente só com a URL da pasta,
> sem precisar digitar o nome do arquivo.
