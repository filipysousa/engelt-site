# Relatório de Alterações — 20/04/2026

## 1. Área Interna — Seção "Ferramentas Internas"

**Arquivo:** `area-interna.html`

- Adicionada nova seção "Ferramentas Internas" abaixo dos cards existentes
- Criado card **Gerador de Assinatura** com ícone de caneta
- Acesso protegido por senha via `window.prompt()` — senha: `@assinatura`
- Ao errar a senha, exibe alerta "Senha incorreta"

---

## 2. Gerador de Assinatura de E-mail

**Arquivo:** `gerador-assinatura-engelt.html` *(arquivo novo)*

- Página criada do zero com tema visual idêntico ao restante do site
- Fontes Barlow / Barlow Condensed (mesmo do `style.css`)
- Navbar e footer iguais às demais páginas internas
- Hero com label "Ferramentas Internas"
- Formulário com campos: Nome, Cargo, Obra/Projeto, E-mail, Telefone, Celular
- Preview em tempo real da assinatura gerada
- Geração de HTML compatível com Outlook e Thunderbird
- Botões de ação: Copiar HTML, Salvar para Outlook (3 arquivos), Abrir pasta de Assinaturas
- Todos os emojis removidos dos botões e do JavaScript

### Layout da assinatura gerada
Replicado exatamente do padrão já usado no Outlook (arquivo `Filipy 4`):
- Nome em azul, negrito, fonte Cambria — linha própria
- Cargo em preto, negrito — linha própria
- Logo ENGELT à esquerda (192×64px), sem borda lateral
- Contatos à direita: obra, telefones, endereço em duas linhas, e-mail, site
- Mensagem de meio ambiente em verde com negrito nos termos certos

---

## 3. Ajustes pós-entrega

| # | Alteração | Arquivo |
|---|-----------|---------|
| 1 | Removido pré-preenchimento com dados do funcionário Brayon | `gerador-assinatura-engelt.html` |
| 2 | Placeholders substituídos pelo nome do campo (ex: "Nome completo", "Cargo") | `gerador-assinatura-engelt.html` |

---

## 4. Deploy

Todos os arquivos foram versionados no GitHub (`master`) e enviados via FTP para:
- Servidor: `ftp.engeltengenharia.com.br`
- Caminho: `/engeltengenharia.com.br/web/`

### Commits do dia
| Hash | Mensagem |
|------|----------|
| `79d9a37` | Adiciona gerador de assinatura e acesso protegido por senha na área interna |
| `3e61fbf` | Remove pré-preenchimento de dados de exemplo no gerador de assinatura |
| `32be376` | Remove exemplos de funcionário dos placeholders do gerador de assinatura |
