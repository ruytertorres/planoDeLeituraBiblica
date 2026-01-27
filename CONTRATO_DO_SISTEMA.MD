# ============================================================================

# CONTRATO_DO_SISTEMA.md — Fonte de Verdade Conceitual

# Versão: 1.1.0

# Aplicação: Bíblia Responsiva — Domínio de Planos, Tempo e Orquestração

#

# Autor: Ruyter Torres

# GitHub: https://github.com/ruytertorres

# LinkedIn: https://www.linkedin.com/in/ruytertorres

# Email: ruytertorres.gmail.com

#

# RESPONSABILIDADE:

# ----------------------------------------------------------------------------

# - Definir regras de domínio e hierarquias de autoridade

# - Estabelecer contratos formais entre módulos

# - Delimitar responsabilidades explícitas

# - Servir como fonte de verdade conceitual do sistema

#

# NÃO É RESPONSABILIDADE DESTE DOCUMENTO:

# ----------------------------------------------------------------------------

# - Implementar código específico

# - Substituir testes automatizados

# - Documentar APIs técnicas em baixo nível

#

# PRINCÍPIOS / CONTRATOS:

# ----------------------------------------------------------------------------

# - O código IMPLEMENTA este contrato

# - O contrato NÃO se adapta ao código

# - Toda refatoração DEVE obedecer este documento

# ============================================================================

# ============================================================================

# 0. NATUREZA DESTE DOCUMENTO (FONTE DE VERDADE)

# ============================================================================

Este documento é a **fonte de verdade conceitual do sistema**.

Ele define, de forma explícita:

- regras de domínio
- hierarquias de autoridade
- contratos entre módulos
- limites formais de responsabilidade

Regras fundamentais:

- O código implementa o contrato
- O contrato não se adapta ao código
- Qualquer divergência exige refatoração do código

Alterar este documento **impacta o sistema inteiro**
e deve ser feito com máxima cautela.

# ============================================================================

# 1. REGRA-ALMA DO SISTEMA

# ============================================================================

O tempo passa.  
O sistema reconhece.  
O usuário decide.  
O plano continua com verdade.

Nenhuma decisão estrutural, técnica ou de domínio
pode violar essa sequência causal.

# ============================================================================

# 2. PRINCÍPIOS FUNDAMENTAIS

# ============================================================================

# ----------------------------------------------------------------------------

# 2.1 TEMPO É SOBERANO

# ----------------------------------------------------------------------------

O sistema:

- NÃO cria tempo
- NÃO simula calendários
- NÃO fixa datas ou anos
- NÃO calcula ciclos sozinho

Todo conceito temporal é fornecido **exclusivamente**
por `geradorDatas.js`.

Se um módulo precisar saber:

- o dia atual
- o ano atual
- o total de dias do ano
- se o ano é bissexto

➡️ **DEVE consultar o `geradorDatas.js`.**

Se a informação não existir, o módulo
**DEVE ser estendido**, nunca contornado.

# ----------------------------------------------------------------------------

# 2.2 PROIBIÇÃO ABSOLUTA DE TEMPO FORA DO GERADOR

# ----------------------------------------------------------------------------

É proibido no sistema:

- `new Date()` fora de `geradorDatas.js`
- anos hardcoded (ex.: 2026)
- suposições de 365 dias
- contadores temporais locais ou paralelos

Essa regra é absoluta e não negociável.

# ----------------------------------------------------------------------------

# 2.3 CICLOS SÃO FINITOS, PLANOS SÃO CONTÍNUOS

# ----------------------------------------------------------------------------

- Um ciclo representa um **ano civil real**
- Todo ciclo termina inevitavelmente
- Um plano NÃO termina automaticamente com o ciclo
- Um plano pode atravessar múltiplos ciclos

O fim de um ciclo é um **evento detectável**,
nunca uma decisão.

# ----------------------------------------------------------------------------

# 2.4 O SISTEMA DETECTA, O USUÁRIO DECIDE

# ----------------------------------------------------------------------------

O sistema pode:

- detectar atraso
- detectar fim de ciclo
- detectar conflitos

O sistema **NUNCA** pode:

- decidir reset
- decidir continuação
- decidir encerramento
- adaptar planos silenciosamente

Decisão é sempre:

- explícita
- rastreável
- atribuída ao usuário

# ============================================================================

# 3. HIERARQUIA DE AUTORIDADE (QUEM OBEDECE QUEM)

# ============================================================================

Tempo Real  
└─ `geradorDatas.js`

Orquestração  
└─ `PlanoManager`

Domínio Auxiliar  
├─ Status do Plano  
├─ Regras de Atraso  
├─ Reorganizador de Plano  
└─ Progresso de Leitura

Interface  
└─ UI

# ----------------------------------------------------------------------------

# REGRAS HIERÁRQUICAS

# ----------------------------------------------------------------------------

- `geradorDatas.js` NÃO depende de nenhum outro módulo
- `PlanoManager` NUNCA gera tempo
- Módulos auxiliares NÃO governam fluxo
- A UI NÃO contém regra de negócio

Violação de hierarquia é erro conceitual grave.

# ============================================================================

# 4. CONCEITOS DO DOMÍNIO

# ============================================================================

# ----------------------------------------------------------------------------

# 4.1 PLANO

# ----------------------------------------------------------------------------

Um plano representa uma **intenção contínua de leitura**.

Características:

- pode atravessar ciclos
- possui estado explícito
- reage ao tempo, não o controla

Um plano NUNCA muda de estado
sem causa rastreável.

# ----------------------------------------------------------------------------

# 4.2 CICLO

# ----------------------------------------------------------------------------

Um ciclo representa um **ano civil real**.

- possui início e fim definidos pelo tempo real
- NÃO é criado artificialmente
- NÃO é estendido
- NÃO é reiniciado

O sistema apenas **reconhece** o ciclo.

# ----------------------------------------------------------------------------

# 4.3 DIA

# ----------------------------------------------------------------------------

Regras absolutas:

- Dia é unidade indivisível
- Não existe dia 0
- Não existe dia fora do calendário real
- Não existe redistribuição retroativa de dias

# ============================================================================

# 5. ESTADOS DO PLANO (CONTRATO DE ESTADO)

# ============================================================================

Estados válidos:

- ATIVO
- ATRASADO
- AGUARDANDO_DECISAO
- FIM_DE_CICLO
- CONCLUIDO
- ENCERRADO

# ----------------------------------------------------------------------------

# REGRAS DE ESTADO

# ----------------------------------------------------------------------------

- Todo estado tem causa explícita
- Transições são controladas
- Nenhum estado muda silenciosamente
- O estado define comportamento permitido

# ============================================================================

# 6. REGRA DE ATRASO (CONTRATO GLOBAL)

# ============================================================================

A regra de atraso:

- é definida por **função única**
- vive em módulo dedicado
- NÃO possui valores hardcoded espalhados

Fluxo conceitual:

- Sistema define: “plano está atrasado após X dias”
- UI consome: “Seu plano está atrasado há X dias”
- Nenhum módulo replica essa lógica

Alterar essa regra
altera o sistema inteiro de forma consistente.

# ============================================================================

# 7. DECISÕES DO USUÁRIO (CONTRATO DE INTERAÇÃO)

# ============================================================================

Decisões reconhecidas:

- Continuar adaptando o plano
- Reset inteligente (reancoragem)
- Reset total
- Continuar no novo ciclo
- Encerrar plano
- Adiar decisão

Toda decisão:

- é explícita
- é registrada
- produz efeito rastreável

Decisões implícitas **NÃO existem**.

# ============================================================================

# 8. CONTRATO DA UI

# ============================================================================

A interface pode:

- informar
- perguntar
- exibir estado

A interface NÃO pode:

- calcular regras
- decidir fluxo
- interpretar domínio

UI é reflexo. Nunca motor.

# ============================================================================

# 9. CONTRATO DE IMPLEMENTAÇÃO

# ============================================================================

É obrigatório:

- Nenhum tempo fora do `geradorDatas.js`
- Nenhuma regra de domínio na UI
- Nenhuma adaptação silenciosa
- Nenhum reset ambíguo
- Nenhuma lógica duplicada

Toda violação exige refatoração imediata.

# ============================================================================

# 10. EVOLUÇÃO DO DOCUMENTO

# ============================================================================

Este documento é **vivo**, porém **controlado**.

Ele evolui quando:

- regras são consolidadas
- contratos são descobertos
- ambiguidades são eliminadas

Refatorar este documento
é refatorar o sistema inteiro.

# ============================================================================

# 11. DECLARAÇÃO FINAL

# ============================================================================

Este sistema é orientado por:

- verdade temporal
- clareza de decisão
- continuidade honesta

O código muda.  
O contrato governa.

# ============================================================================

# 12. CABEÇALHOS E COMENTÁRIOS DE ARQUIVO (CONTRATO DE ARQUITETURA)

# ============================================================================

# ----------------------------------------------------------------------------

# 12.1 CABEÇALHO OBRIGATÓRIO

# ----------------------------------------------------------------------------

Todo arquivo de domínio, serviço ou orquestração
DEVE iniciar com o seguinte cabeçalho:

# /\*

nomeDoArquivo.js — Papel claro e inequívoco
Versão: X.Y.Z
Aplicação: Nome do sistema ou subdomínio

Autor: Ruyter Torres
GitHub: https://github.com/ruytertorres
LinkedIn: https://www.linkedin.com/in/ruytertorres
Email: ruytertorres.gmail.com

RESPONSABILIDADE:

- O que ESTE arquivo faz
- O que ELE é dono
- O que ELE garante

NÃO É RESPONSABILIDADE DESTE ARQUIVO:

- O que explicitamente NÃO pode fazer
- Onde essa responsabilidade vive

PRINCÍPIOS / CONTRATOS:

- Regras arquiteturais obedecidas
- Dependências permitidas
- # Dependências proibidas
  \*/

Regra implícita:
se algo não cabe nesse cabeçalho,
o arquivo provavelmente viola responsabilidade única.

# ----------------------------------------------------------------------------

# 12.2 BLOCOS DE SEÇÃO

# ----------------------------------------------------------------------------

Blocos DEVEM ser usados apenas para organização conceitual:

# /\*

# NOME DA SEÇÃO

\*/

Indicados para:

- Tipos
- Constantes
- Classes
- API pública
- Regras de negócio
- Fluxos de controle

Proibido:
blocos apenas para separação estética.

# ----------------------------------------------------------------------------

# 12.3 SUB-BLOCOS

# ----------------------------------------------------------------------------

Sub-blocos DEVEM contextualizar decisões não triviais:

## /\*

## VALIDAÇÕES ESTRUTURAIS

\*/

Usar quando:

- há regra explícita
- existe risco de uso incorreto
- a intenção não é óbvia

Proibido comentar código óbvio.

# ----------------------------------------------------------------------------

# 12.4 COMENTÁRIOS DE FUNÇÃO / MÉTODO

# ----------------------------------------------------------------------------

/\*\*

- Descrição objetiva do que o método garante
-
- @param {tipo} nome - Regra do parâmetro
- @returns {tipo} Garantia de retorno
- @throws Quando falha e por quê
  \*/

Regra:
o comentário explica **o quê**, nunca **como**.

# ----------------------------------------------------------------------------

# 12.5 COMENTÁRIOS INTERNOS

# ----------------------------------------------------------------------------

Permitidos apenas para decisões não triviais:

// MÉTODO BULLETPROOF: criar data ao meio-dia para evitar fuso

Proibido:
narrar sintaxe ou explicar código óbvio.

# ----------------------------------------------------------------------------

# 12.6 REGRA-MÃE DO PADRÃO

# ----------------------------------------------------------------------------

Comentário existe para declarar:

- intenção
- contrato
- limite arquitetural

Comentário correto:
continua válido mesmo se o código mudar.

Comentário incorreto:
torna-se falso quando o código muda.
