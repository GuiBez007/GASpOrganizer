# GAS+Organizer | Versão Vanilla 🚀

Um painel organizador de mídia premium, sem dependências, desenvolvido para acompanhar seus games, animes, séries, filmes, livros, músicas e conteúdo do YouTube em uma interface única, elegante e de alto desempenho.

![Status do Projeto](https://img.shields.io/badge/Status-Completo-brightgreen)
![Tecnologias](https://img.shields.io/badge/Tech-Vanilla_JS_/_CSS3_/_HTML5-blue)
![Licença](https://img.shields.io/badge/Licença-MIT-purple)

---

## ✨ Funcionalidades

- **💎 Interface Glassmorphism**: Design em modo escuro de alto contraste com acentos neon vibrantes e efeitos de desfoque premium.
- **🧱 Grid Masonry Dinâmico**: Layout de cartões escalonados e responsivos que otimizam o espaço automaticamente, criando uma estética moderna estilo "Steam".
- **🌍 Suporte Multilíngue**: Alternância contínua entre **Inglês (🇺🇸)** e **Português (🇧🇷)** em toda a interface.
- **🔍 Filtragem de Conteúdo**: Filtros específicos para cada categoria (ex: *Jogados*, *Para Assistir*, *Favoritos*, *Singleplayer*).
- **⚡ Zero Dependências**: Construído inteiramente com Vanilla JavaScript, HTML5 e CSS3. Sem frameworks, sem bundlers, sem bibliotecas pesadas—apenas velocidade pura.
- **📱 Design Responsivo**: Breakpoints customizados e otimizados para monitores padrão (1366px+) mantendo a densidade dos cartões e a legibilidade.

---

## 📂 Estrutura do Projeto

```text
GASpOrganizer/
├── assets/             # Imagens e espaços reservados de mídia
├── scripts/            # Lógica da aplicação
│   ├── data/           # Arquivos de configuração e conteúdo
│   └── app.js          # Controlador principal da UI
├── styles/             # Sistema de design CSS modular
└── index.html          # Ponto de entrada
```

---

## 🛠️ Instalação e Uso

Como este é um projeto vanilla, você não precisa de `npm install` ou etapas de compilação.

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/GuiBez007/GASpOrganizer.git
   ```
2. **Abra o projeto**:
   Basta abrir o arquivo `index.html` em qualquer navegador moderno.
   *Dica: Use a extensão **Live Server** no VS Code para uma melhor experiência de desenvolvimento.*

---

## 🚀 Implantação (Deployment)

Este projeto é otimizado para o **GitHub Pages**. Para publicar:
1. Envie suas alterações para o branch `main`.
2. Vá em **Settings > Pages** no seu repositório GitHub.
3. Selecione o branch `main` e a pasta `/ (root)` como fonte.

---

## 🎨 Sistema de Design

- **Acento Principal**: `#8b5cf6` (Roxo)
- **Fundo**: `#0d0d12` (Obsidiana Profundo)
- **Tipografia**: Inter (fallback para System-UI)
- **Animações**: Transições customizadas em curvas Bezier para efeitos de hover e expansão de sinopses.
