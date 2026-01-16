# 📖 [NOME DO PROJETO AQUI]

**Aplicação de Leitura Bíblica Estruturada e Cronológica**

---

## 🔖 Versão em Desenvolvimento

**v0.2**

---

## 📅 Data de Início do Projeto

**[DATA AQUI]**

---

## 👤 Autor

**Nome:** [SEU NOME AQUI]  
**LinkedIn:** [SEU LINK AQUI]  
**GitHub:** [SEU LINK AQUI]

---

## 🎯 Objetivo do Projeto

Este projeto tem como objetivo desenvolver uma aplicação web profissional, escalável e multiplataforma (PC e dispositivos móveis) para **leitura estruturada da Bíblia**, baseada em **modelagem de domínio**, e não em listas estáticas.

A aplicação permite:

- Navegação por **dias de leitura**
- Organização por **planos cronológicos**
- Base sólida para criação de múltiplos planos futuros
- Separação rigorosa entre domínio, aplicação e interface

---

## 🧠 Conceito Central (v0.2)

A unidade fundamental do sistema é o **Dia de Leitura**.

Cada dia é responsável por conter seus próprios dados, permitindo total flexibilidade e automação.

### Estrutura conceitual do Dia

```js
Dia {
  id,
  data,
  antigoTestamento,
  novoTestamento,
  livros,
  capitulos,
  versiculos,
  observacoes
}

### Estrura das pastas

/js
 ├── dominio/
 │    ├── biblia.js
 │    ├── dia.js
 │    └── planos/
 │         └── plano_cronologico.js
 │
 ├── ui/
 │    ├── darkmode.js
 │    └── componentes.js
 │
 ├── infra/
 │    └── storage.js
 │
 └── main.js
```
