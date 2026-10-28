# Instituto SaxFisio

Site institucional de fisioterapia e reabilitação da Sandra Xavier. A página apresenta os tratamentos, explica as etapas do atendimento e permite que visitantes solicitem uma avaliação pelo WhatsApp.

## O site

A página reúne:

- Apresentação da clínica e chamada para agendamento.
- Tratamentos ortopédicos, esportivos, capilares, de feridas, faciais e para a terceira idade.
- Etapas do atendimento: avaliação, plano de cuidado, tratamento e acompanhamento.
- Apresentação da Sandra Xavier, com um carrossel de imagens.
- Formulário de solicitação de horário e atalho para contato pelo WhatsApp.

O formulário não envia dados para um servidor: ao ser enviado, ele prepara uma mensagem com os dados preenchidos e abre uma conversa no WhatsApp. A pessoa precisa confirmar o envio no aplicativo.

## Tecnologias

- HTML5
- CSS3
- JavaScript sem dependências de terceiros
- Google Fonts (Fraunces, Inter e IBM Plex Mono)

## Estrutura

```text
.
├── assets/       # Imagens e logotipo
├── index.html    # Conteúdo e estrutura da página
├── script.js     # Menu, animações, carrossel e formulário
├── style.css     # Estilos e layout responsivo
└── README.md
```

## Como executar

Abra `index.html` diretamente no navegador ou inicie um servidor local na pasta do projeto:

```bash
python -m http.server 8000
```

Em seguida, acesse <http://localhost:8000>.

## Atualização de informações

- Edite textos, tratamentos, horários e dados de contato em `index.html`.
- Os links e o número de destino do WhatsApp também estão em `index.html`.
- O número usado para enviar o formulário pelo WhatsApp está em `script.js`.
- Atualize imagens e logotipo na pasta `assets/` e ajuste os caminhos correspondentes em `index.html`.
- Personalize cores, tipografia e apresentação em `style.css`.

## Contato exibido no site

- Telefone: (21) 99479-2249
- E-mail: sandraxavierfisioterapia@gmail.com
- Horário: segunda a sexta-feira, das 7h às 20h
