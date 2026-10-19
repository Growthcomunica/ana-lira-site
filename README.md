# Site Ana Lira, psicóloga clínica

Site estático (HTML, CSS e JavaScript), pronto para GitHub Pages ou Hostinger.

## Estrutura
- `index.html` Início (landing page)
- `sobre.html`, `atendimento.html`, `temas.html`, `contato.html`
- `artigos.html` + `artigo-*.html` (blog)
- `privacidade.html`, `404.html`
- `sitemap.xml`, `robots.txt`, `site.webmanifest`, `favicon.ico`
- `assets/css`, `assets/js`, `assets/img`, `assets/fonts` (fontes hospedadas no próprio site)

## Medição (GA4 / GTM)
Abra `assets/js/analytics.js` e preencha `GTM_ID`. O aviso de cookies e o Consent Mode v2 passam a funcionar automaticamente.
Eventos já disponíveis no dataLayer: `whatsapp_click` (com `link_location`) e `contact_form_submit`.

## Domínio
As URLs canônicas, o sitemap e as tags de compartilhamento usam o endereço do GitHub Pages.
Na mudança para `analirapsi.com.br`, as páginas precisam ser geradas novamente com o novo endereço.

## Novo artigo
Duplique um `artigo-*.html`, troque título, descrição, data, imagem e texto, e inclua o link em `artigos.html` e no `sitemap.xml`.
