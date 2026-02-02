# ============================================================================

# CONTRATO_DE_REMODULAÇÃO_TYPESCRIPT.md — Fonte de Verdade da Migração

# ============================================================================

Versão: 1.0.0 (CONGELADA)
Aplicação: Bíblia Responsiva — Domínio de Planos, Tempo e Orquestração

Autor: Ruyter Torres
GitHub: [https://github.com/ruytertorres](https://github.com/ruytertorres)
LinkedIn: [https://www.linkedin.com/in/ruytertorres](https://www.linkedin.com/in/ruytertorres)
Email: ruytertorres.gmail.com

RESPONSABILIDADE DESTE DOCUMENTO:

* Definir **as leis da remodulação** do sistema para TypeScript
* Regular **o processo**, não o domínio
* Garantir que a evolução técnica **não viole** o `CONTRATO_DO_SISTEMA.md`
* Tornar a migração **auditável, rastreável e verificável**

NÃO É RESPONSABILIDADE DESTE DOCUMENTO:

* Alterar regras de domínio
* Introduzir novas decisões de usuário
* Justificar refatorações fora do escopo declarado
* Substituir o `CONTRATO_DO_SISTEMA.md`

PRINCÍPIOS / CONTRATOS:

* O sistema IMPLEMENTA o `CONTRATO_DO_SISTEMA.md`
* A remodulação IMPLEMENTA este contrato
* Este contrato **OBEDECE** integralmente ao contrato-mãe

Regra soberana:

> Caso seja identificado conflito entre este documento e o `CONTRATO_DO_SISTEMA.md`,
> a decisão **não é automática** e deve ser definida pelo responsável técnico do projeto,
> com orientação explícita e devidamente registrada.

> Em caso de conflito entre este documento e o `CONTRATO_DO_SISTEMA.md`,
> **este documento está errado**.

# ============================================================================

# 0. NATUREZA DESTE DOCUMENTO (FONTE DE VERDADE DA MIGRAÇÃO)

# ============================================================================

Este documento é a **fonte de verdade da remodulação técnica**.

Ele define, de forma explícita:

* objetivos permitidos da migração
* limites absolutos de atuação
* fases formais de execução
* critérios objetivos de auditoria

Este contrato é escrito para:

* ser **interpretado sem ambiguidade por assistentes de IA**
* ser **compreendido claramente por humanos técnicos**

Ambiguidade é considerada **erro contratual**.

# ============================================================================

# 1. OBJETIVO DA REMODULAÇÃO

# ============================================================================

A remodulação para TypeScript tem como objetivos **explícitos e cumulativos**:

* Tornar contratos explícitos **executáveis e verificáveis** pelo compilador
* Reduzir violações arquiteturais silenciosas
* Aumentar a confiabilidade estrutural do sistema
* Melhorar previsibilidade, escalabilidade e facilidade de manutenção
* Sustentar ganhos indiretos de performance **estrutural**

Esses objetivos existem para **validar e reforçar**, de forma coerente, os
princípios definidos no `CONTRATO_DO_SISTEMA.md`.

A remodulação **NÃO tem** como objetivo:

* Alterar comportamento funcional
* Introduzir novas regras de domínio
* Modificar decisões do usuário

Regra fundamental:

* Ganhos de performance, escalabilidade ou manutenção **DEVEM emergir da estrutura**
* Nenhum ganho pode ser obtido por alteração comportamental

A migração é **estrutural e contratual**, nunca funcional.

# ============================================================================

# 2. PRINCÍPIOS FUNDAMENTAIS DA MIGRAÇÃO

# ============================================================================

# ----------------------------------------------------------------------------

# 2.1 MIGRAÇÃO NÃO É REESCRITA

# ----------------------------------------------------------------------------

* Código existente deve ser preservado sempre que possível
* Mudanças devem ser mínimas, justificadas e rastreáveis
* Refatoração só ocorre quando exigida por:

  * tipagem
  * contrato
  * auditoria estrutural

Refatorar sem exigência estrutural explícita **é violação deste contrato**.

# ----------------------------------------------------------------------------

# 2.2 TYPESCRIPT NÃO DECIDE DOMÍNIO

# ----------------------------------------------------------------------------

* Tipos descrevem contratos
* Tipos impõem limites estruturais
* Tipos NÃO contêm regra de negócio
* Tipos NÃO substituem validações conceituais

TypeScript atua como **mecanismo de garantia**, nunca como motor decisório.

# ----------------------------------------------------------------------------

# 2.3 PROGRESSÃO CONTROLADA E AUDITÁVEL

# ----------------------------------------------------------------------------

* Nenhuma fase começa sem a anterior estar formalmente concluída
* Cada fase possui critérios objetivos de entrada e saída
* Progresso é validado por evidência técnica, não por percepção

Avançar sem critério concluído **invalida a migração**.

# ----------------------------------------------------------------------------

# 2.4 PADRÃO DE ESTILIZAÇÃO (TAILWIND CSS)

# ----------------------------------------------------------------------------

Para garantir organização, previsibilidade e redução de complexidade no fluxo de CSS:

* O projeto adota oficialmente **Tailwind CSS** como padrão de estilização
* Tailwind é ferramenta de organização visual, não de domínio
* Nenhuma lógica de negócio pode depender de classes CSS

Regras explícitas:

* ❌ Proibido criar CSS global arbitrário

* ❌ Proibido introduzir frameworks CSS paralelos

* ❌ Proibido codificar estado ou decisão em classes CSS

* ✅ Permitido usar classes utilitárias Tailwind na UI

* ✅ Permitido extrair componentes visuais quando houver repetição justificada

Tailwind CSS:

* NÃO governa fluxo
* NÃO decide estado
* NÃO substitui regras do `CONTRATO_DO_SISTEMA.md`

# ============================================================================

# 3. ESTRUTURA DE FASES (INÍCIO, MEIO E FIM)

# ============================================================================

A migração ocorre em **quatro fases formais e auditáveis**.

# ----------------------------------------------------------------------------

# FASE 1 — FUNDAÇÃO TIPADA (INÍCIO)

# ----------------------------------------------------------------------------

Objetivo:

* Tipar o núcleo do sistema sem alterar comportamento

Escopo:

* geradorDatas.*
* PlanoManager.*
* Regras de atraso
* Detectores de ciclo
* Orquestração central

Ações permitidas:

* Conversão de .js para .ts
* Criação de tipos auxiliares
* Ajustes mínimos para satisfazer o compilador

Ações proibidas:

* Alterar fluxo de tempo
* Alterar regras de decisão
* Introduzir lógica nova

Critérios de conclusão:

* Build TypeScript sem erros
* Comportamento idêntico ao JS original
* Nenhuma violação ao `CONTRATO_DO_SISTEMA.md`

# ----------------------------------------------------------------------------

# FASE 2 — CONTRATOS COMO TIPOS (MEIO)

# ----------------------------------------------------------------------------

Objetivo:

* Formalizar contratos conceituais como tipos TypeScript

Escopo:

* PlanoCartucho.ts
* DiaDoPlano.ts
* EstadoPlano.ts
* Tipos de decisão do usuário

Regras absolutas:

* Arquivos de tipo NÃO executam lógica
* NÃO importam módulos do sistema
* NÃO possuem efeitos colaterais

Critérios de conclusão:

* Todo contrato central possui representação tipada
* Tipos refletem fielmente o `CONTRATO_DO_SISTEMA.md`

# ----------------------------------------------------------------------------

# FASE 3 — PLANOS SOB CONTRATO (MEIO)

# ----------------------------------------------------------------------------

Objetivo:

* Garantir que planos-cartucho obedeçam contratos de forma verificável

Estratégias válidas:

* Planos em JS validados por tipos
* Planos em TS exportando objeto puro

Regras inegociáveis:

* Planos permanecem independentes
* Nenhum plano importa módulos do sistema
* Nenhum plano contém lógica de tempo

Critérios de conclusão:

* Planos inválidos falham em validação ou build
* Planos válidos encaixam sem modificação no sistema

# ----------------------------------------------------------------------------

# FASE 4 — UI E FRONTEIRAS (FIM)

# ----------------------------------------------------------------------------

Objetivo:

* Decidir conscientemente o escopo de TypeScript na UI

Observação:

* O `CONTRATO_DO_SISTEMA.md` NÃO exige TypeScript na UI

Resultados possíveis:

* UI parcialmente tipada
* UI integralmente tipada
* UI mantida em JavaScript

Critério de encerramento:

* Decisão explícita registrada
* Nenhuma regra de domínio na UI

# ============================================================================

# 4. ORDEM FORMAL DE REFATORAÇÃO

# ============================================================================

1. Núcleo temporal
2. Orquestração
3. Contratos declarativos
4. Planos-cartucho
5. UI (opcional)

Quebrar esta ordem **é violação deste contrato**.

# ============================================================================

# 5. AUDITORIA E ACOMPANHAMENTO

# ============================================================================

Cada fase DEVE produzir:

* Lista explícita de arquivos afetados
* Diferença de código clara (diff)
* Declaração formal de conformidade

Pergunta de auditoria soberana:

> Este código viola alguma cláusula do `CONTRATO_DO_SISTEMA.md`?

Se a resposta não for **"não, comprovadamente"**, a fase NÃO está concluída.

# ============================================================================

# 6. CONDIÇÃO DE SUCESSO FINAL

# ============================================================================

A remodulação é considerada concluída quando:

* O núcleo do sistema é tipado
* Contratos conceituais são representados como tipos
* Planos são validados estruturalmente
* Nenhuma regra do `CONTRATO_DO_SISTEMA.md` foi violada

# ============================================================================

# 7. DECLARAÇÃO FINAL

# ============================================================================

Este contrato existe para garantir que:

* A evolução técnica não destrua a arquitetura
* A tipagem fortaleça — e não substitua — o contrato
* O sistema permaneça governado por verdade conceitual

O código muda.
A linguagem evolui.
O contrato governa.

# ============================================================================
