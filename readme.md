# 📖 Bíblia Responsiva

**Versão atual:** 1.0.0  
**Status:** Open Source · Sem fins lucrativos · Em evolução contínua

---

## 1. Visão Geral

O **Bíblia Responsiva** é uma aplicação web **gratuita, open source e sem fins lucrativos**, concebida como um ambiente completo para **leitura, organização e estudo bíblico**, com foco em rigor conceitual, soberania temporal e clareza decisória.

O projeto não é orientado por monetização, publicidade ou exploração de dados.  
Seu propósito é **educacional, arquitetural e comunitário**.

### Regra-Alma do Sistema

> **O tempo passa.  
> O sistema reconhece.  
> O usuário decide.  
> O plano continua com verdade.**

Essa regra governa todas as decisões de domínio, arquitetura e interação.

---

## 2. Princípios Fundamentais do Sistema

- O tempo nunca é criado, simulado ou inferido
- O sistema detecta estados, nunca decide por conta própria
- Toda decisão relevante é explícita e atribuída ao usuário
- O contrato governa o código, nunca o contrário

Esses princípios estão formalizados no `CONTRATO_DO_SISTEMA.md`.

---

## 3. Funcionalidades Principais

- **Planos de leitura modulares (cartuchos)**  
  Ex.: cronológico, canônico, temático (futuro)

- **Reorganização inteligente de planos**  
  O sistema detecta atraso e apresenta opções, sem decidir

- **Reset consciente**  
  Reset total ou reancoragem explícita, sempre por decisão do usuário

- **Controle de progresso persistente**

- **Bloco de notas flutuante e persistente**  
  As notas pertencem ao usuário, não ao plano nem à página

- **Busca contextual no plano**

- **Gerador temporal soberano**  
  Nenhum uso direto de `Date()` fora do módulo autorizado

- **Dark Mode nativo**

---

## 4. Arquitetura Geral

A aplicação segue uma **arquitetura em camadas**, rigorosamente alinhada ao contrato.

### 4.1 Camada de Tempo

- `js/core/models/parametroGerador.js`

Fonte **única e absoluta** de tempo no sistema.

Nenhum outro módulo pode:
- criar datas
- simular calendários
- assumir ano, dia ou ciclo

---

### 4.2 Camada de Domínio

- `parametroBibliaPlano.js`
- `parametroDia.js`
- `biblia.js`

Define conceitos estáveis:
- Bíblia como estrutura canônica
- Dia como unidade indivisível
- Plano como intenção contínua

Não depende de UI nem de orquestração.

---

### 4.3 Camada de Orquestração

- `PlanoManager.js`
- `ProgressoLeitura.js`
- `ReorganizadorPlano.js`
- `ResetProgresso.js`
- `MainOrquestrador.js`

Responsável por:
- injetar tempo
- coordenar fluxo
- aplicar regras de domínio
- manter rastreabilidade de estados

---

### 4.4 Camada de Interface (UI)

- Renderiza
- Pergunta
- Exibe estados

A UI **não governa**, **não decide** e **não interpreta domínio**.

---

## 5. Princípio do Cartucho (Modularidade de Planos)

Um plano de leitura é um **cartucho**:

- módulo independente
- testável isoladamente
- intercambiável
- sem dependência do sistema

Qualquer plano que respeite o contrato
encaixa no sistema sem modificações.

---

## 6. Sistema de Notas como Patrimônio Intelectual

As notas:

- não pertencem ao plano
- não pertencem à página
- não pertencem à versão bíblica

Pertencem ao **ato de leitura** do usuário.

Isso garante:
- continuidade intelectual
- independência estrutural
- preservação de contexto

---

## 7. Gestão de Estados do Plano

Estados reconhecidos:

- ATIVO
- ATRASADO
- AGUARDANDO_DECISAO
- FIM_DE_CICLO
- CONCLUIDO
- ENCERRADO

Regras:
- todo estado tem causa
- nenhuma transição é silenciosa
- estado nunca muda sem rastreabilidade

---

## 8. Decisões do Usuário (Explícito)

O sistema **NUNCA** toma decisões finais.

Decisões reconhecidas:

- continuar adaptando o plano
- reset inteligente (reancoragem)
- reset total
- continuar no novo ciclo
- encerrar plano
- adiar decisão

Todas são:
- explícitas
- registradas
- atribuídas ao usuário

Decisões implícitas **não existem**.

---

## 9. Transparência sobre Uso de IA

Este projeto foi desenvolvido com **apoio de ferramentas de Inteligência Artificial** em atividades como:

- revisão técnica
- organização conceitual
- documentação
- análise arquitetural

**Todas as decisões arquiteturais, conceituais e éticas são humanas.**

IA atua exclusivamente como **sistema assistivo**, conforme definido no contrato.

---

## 10. Licença, Open Source e Natureza Não Lucrativa

Este projeto é:

- **Open Source**
- **Sem fins lucrativos**
- **Sem exploração comercial**
- **Sem coleta de dados para monetização**

O objetivo é:
- educacional
- comunitário
- arquitetural
- intelectual

Qualquer uso ou contribuição deve respeitar integralmente
o `CONTRATO_DO_SISTEMA.md`.

---

## 11. Estrutura de Diretórios (Detalhada)

.
├── CONTRATO_DO_SISTEMA.md # Fonte de verdade conceitual
├── ARQUITETURA_SINCRONIZACAO.md # Estratégia futura de sincronização
├── README.md # Este documento
├── tarefas.txt # Registro conceitual de tarefas
│
├── assets/
│ ├── icons/ # Ícones da aplicação
│ └── images/ # Imagens estáticas
│
├── css/
│ ├── base/ # Reset, variáveis, temas
│ ├── layout/ # Estrutura visual
│ ├── componentes/ # Modais, overlays, botões
│ └── darkmode.css
│
├── js/
│ ├── core/
│ │ ├── models/
│ │ │ ├── parametroBibliaPlano.js
│ │ │ ├── parametroDia.js
│ │ │ └── parametroGerador.js
│ │ │
│ │ └── services/
│ │ ├── planos/
│ │ │ ├── PlanoManager.js
│ │ │ ├── ReorganizadorPlano.js
│ │ │ ├── ProgressoLeitura.js
│ │ │ └── ResetProgresso.js
│ │ ├── busca/
│ │ └── notas/
│ │
│ ├── ui/
│ │ ├── componentes/
│ │ │ ├── NotasOverlayUI.js
│ │ │ ├── ResetModal.js
│ │ │ └── CalendarUI.js
│ │ ├── orquestradores/
│ │ │ ├── BaseOrquestrador.js
│ │ │ └── MainOrquestrador.js
│ │ └── plugins/
│ │ ├── ExportacaoPlugin.js
│ │ └── CertificadoPlugin.js
│ │
│ └── main.js # Bootstrap da aplicação
│
└── plano.html # Interface principal


---

## 12. Diretriz Final

O **Bíblia Responsiva** é um projeto de longo prazo.

O código evolui.  
A interface muda.  
Mas o contrato governa.

Quem contribui, contribui conscientemente.  
Quem usa, decide com clareza.  
O sistema respeita o tempo.
