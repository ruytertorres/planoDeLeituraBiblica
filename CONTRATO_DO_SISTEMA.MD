# 📘 CONTRATO DO SISTEMA

## Biblia Responsiva — Domínio de Planos, Tempo e Orquestração

---

## 0. Natureza deste documento (Fonte de Verdade)

Este documento é a **fonte de verdade conceitual do sistema**.

Ele define:

- regras de domínio
- hierarquias de autoridade
- contratos entre módulos
- limites explícitos de responsabilidade

Qualquer refatoração, correção ou expansão do código **DEVE** obedecer a este documento.

Alterar este documento **impacta o sistema inteiro** e deve ser feito com máxima cautela.

O código implementa o contrato.  
O contrato **não** se adapta ao código.

---

## 1. Regra-Alma do Sistema

> **O tempo passa.  
> O sistema reconhece.  
> O usuário decide.  
> O plano continua com verdade.**

Nenhuma decisão estrutural do sistema pode violar essa sequência.

---

## 2. Princípios Fundamentais

### 2.1 Tempo é soberano

- O sistema **não cria tempo**
- O sistema **não simula calendários**
- O sistema **não fixa datas ou anos**
- O sistema **não calcula ciclos sozinho**

Todo conceito temporal é fornecido **exclusivamente** por `geradorDatas.js`.

Se um módulo precisar saber:

- o dia atual
- o ano atual
- o total de dias do ano
- se o ano é bissexto

➡️ **DEVE perguntar ao `geradorDatas.js`**.

Se `geradorDatas.js` não oferecer a informação necessária,  
**ele deve ser estendido**, nunca contornado.

---

### 2.2 Nenhum tempo fora do geradorDatas.js

É **proibido** no sistema:

- `new Date()` fora de `geradorDatas.js`
- anos hardcoded (ex: 2026)
- suposições de 365 dias
- contadores temporais locais

Essa regra é absoluta.

---

### 2.3 Ciclos são finitos, planos são contínuos

- Um ciclo representa um **ano civil real**
- Todo ciclo termina inevitavelmente
- Um plano **não termina automaticamente** com o ciclo
- Um plano pode atravessar múltiplos ciclos

O fim de um ciclo é um **evento**, não uma decisão.

---

### 2.4 O sistema detecta, o usuário decide

O sistema:

- detecta atraso
- detecta fim de ciclo
- detecta conflitos

O sistema **nunca**:

- decide reset
- decide continuação
- decide encerramento
- decide adaptação silenciosa

Decisão é sempre explícita e atribuída ao usuário.

---

## 3. Hierarquia de Autoridade (quem obedece quem)

Tempo Real
└─ geradorDatas.js
└─ PlanoManager (orquestrador)
├─ Status do Plano
├─ Regras de Atraso
├─ Reorganizador de Plano
└─ Progresso de Leitura

### Regras hierárquicas

- `geradorDatas.js` **não depende** de nenhum outro módulo
- `PlanoManager` **nunca gera tempo**
- Módulos auxiliares **não governam fluxo**
- A UI **não contém regra de negócio**

Violação de hierarquia é erro conceitual grave.

---

## 4. Conceitos do Domínio

### 4.1 Plano

Um plano representa uma **intenção contínua de leitura**.

Características:

- pode atravessar ciclos
- possui estado explícito
- reage ao tempo, não o controla

Um plano nunca muda de estado sem causa rastreável.

---

### 4.2 Ciclo

Um ciclo representa um **ano civil real**.

- possui início e fim definidos pelo tempo real
- não é criado artificialmente
- não é estendido
- não é reiniciado

O sistema apenas **reconhece** o ciclo.

---

### 4.3 Dia

- Dia é unidade indivisível
- Não existe dia 0
- Não existe dia além do calendário real
- Não existe redistribuição retroativa de dias

---

## 5. Estados do Plano (Contrato de Estado)

Estados válidos:

- `ATIVO`
- `ATRASADO`
- `AGUARDANDO_DECISAO`
- `FIM_DE_CICLO`
- `CONCLUIDO`
- `ENCERRADO`

### Regras:

- Todo estado tem causa explícita
- Transições são controladas
- Nenhum estado muda silenciosamente
- Estado define comportamento permitido

---

## 6. Regra de Atraso (Contrato Global)

A regra de atraso:

- é definida por **função única**
- vive em módulo dedicado
- não possui valores hardcoded espalhados

Exemplo conceitual:

- O sistema define: “plano está atrasado após X dias”
- UI consome: “Seu plano está atrasado há X dias”
- Nenhum módulo replica essa lógica

Alterar a regra **altera o sistema inteiro**, de forma consistente.

---

## 7. Decisões do Usuário (Contrato de Interação)

Decisões reconhecidas pelo sistema:

- Continuar adaptando o plano
- Reset inteligente (reancoragem)
- Reset total
- Continuar no novo ciclo
- Encerrar plano
- Adiar decisão

Cada decisão:

- é explícita
- é registrada
- produz efeito rastreável

Não existem decisões implícitas.

---

## 8. Contrato da UI

A interface:

- **informa**
- **pergunta**
- **exibe estado**

A interface **não**:

- calcula regras
- decide fluxo
- interpreta domínio

UI é reflexo, não motor.

---

## 9. Contrato de Implementação

É obrigatório:

- Nenhum tempo fora do `geradorDatas.js`
- Nenhuma regra de domínio na UI
- Nenhuma adaptação silenciosa
- Nenhum reset ambíguo
- Nenhuma lógica duplicada

Toda violação exige refatoração imediata.

---

## 10. Evolução do Documento

Este documento é **vivo**, porém **controlado**.

Ele cresce à medida que:

- regras são consolidadas
- contratos são descobertos
- ambiguidades são eliminadas

Refatorar este documento **é refatorar o sistema inteiro**.

Nenhuma alteração deve ser feita sem consciência sistêmica.

---

## 11. Declaração Final

Este sistema é orientado por verdade temporal, clareza de decisão
e continuidade honesta.

O código muda.  
O contrato governa.
