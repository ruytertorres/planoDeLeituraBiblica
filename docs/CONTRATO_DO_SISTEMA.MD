# ============================================================================

# CONTRATO_DO_SISTEMA.md — Fonte de Verdade Conceitual

# ============================================================================

# Versão: 1.2.1

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

➡️ VIDE: 1.3.2 SOBERANIA DA DECISÃO SOBRE O CONTRATO DO SISTEMA

# ============================================================================

# 1. CONTRATO DE INTERPRETAÇÃO, ASSISTÊNCIA E SOBERANIA

# ============================================================================

## 1.1 PRINCÍPIO DE LEGIBILIDADE UNIVERSAL

Este contrato **DEVE** ser legível, interpretável e aplicável por:

- pessoas
- sistemas automatizados de apoio (incluindo IA)

A redação:

- evita ambiguidade intencional
- prioriza termos normativos claros
- mantém estrutura previsível e hierárquica

Interpretação correta **NÃO** depende
de contexto implícito ou inferência subjetiva.

## 1.2 PAPEL DOS SISTEMAS ASSISTIVOS (IA)

Sistemas automatizados podem:

- ler este contrato
- validá-lo contra implementações
- apontar violações
- sugerir refatorações
- auxiliar no raciocínio técnico e conceitual

Sistemas automatizados **NÃO** podem:

- tomar decisões de domínio
- decidir por reset, continuidade ou encerramento de planos
- escolher caminhos em estados de conflito
- substituir decisão explícita do usuário técnico

IA **assiste**.  
IA **não governa**.

## 1.3 SOBERANIA DA DECISÃO

### 1.3.1 SOBERANIA DA DECISÃO DO USUÁRIO TÉCNICO

Toda decisão relevante no sistema:

- pertence a um usuário técnico
- é explícita
- é rastreável
- é registrada como ato consciente

Em qualquer cenário de:

- ambiguidade
- conflito
- bifurcação de fluxo
- múltiplos estados possíveis

➡️ **A decisão final pertence sempre ao usuário técnico.**

Nenhum módulo, algoritmo ou sistema assistivo
pode automatizar essa decisão,
nem direta nem indiretamente.

### 1.3.2 SOBERANIA DA DECISÃO SOBRE O CONTRATO DO SISTEMA

A autoridade para **alterar, invalidar ou redefinir**
qualquer regra deste contrato
pertence **exclusivamente** ao usuário técnico responsável designado
(líder técnico ou responsável pelo projeto).

Somente essa pessoa pode:

- aprovar alterações neste documento
- autorizar exceções conscientes às regras aqui definidas
- validar refatorações que impactem contratos existentes
- assumir responsabilidade por violações deliberadas do contrato

Não cabe a:

- sistemas automatizados (incluindo IA)
- membros da equipe sem essa atribuição formal
- processos implícitos ou decisões distribuídas

auditar, modificar ou reinterpretar este documento.

Qualquer ação que viole este contrato
**DEVE** ser explícita, consciente
e autorizada pelo usuário técnico responsável.

A ausência dessa autorização
configura violação arquitetural e conceitual do sistema.

## 1.4 EVOLUÇÃO DO DOCUMENTO

Este documento é vivo,
porém controlado.

Refatorar este documento
é refatorar o sistema inteiro.

➡️ VIDE: 1.3.2 SOBERANIA DA DECISÃO SOBRE O CONTRATO DO SISTEMA

## 1.5 REGRA DE NÃO-DELEGAÇÃO

A introdução de inteligência assistiva:

- **NÃO** cria exceções decisórias
- **NÃO** autoriza delegação implícita
- **NÃO** reduz a responsabilidade do usuário técnico

Assistência técnica **NÃO É**
transferência de autoridade.

# ============================================================================

# 2. REGRA-ALMA DO SISTEMA

# ============================================================================

O tempo passa.  
O sistema reconhece.  
O usuário decide.  
O plano continua com verdade.

Nenhuma decisão estrutural, técnica ou de domínio
pode violar essa sequência causal.

# ============================================================================

# 3. PRINCÍPIOS FUNDAMENTAIS

# ============================================================================

## 3.1 TEMPO É SOBERANO

O sistema:

- NÃO cria tempo
- NÃO simula calendários
- NÃO fixa datas ou anos
- NÃO calcula ciclos sozinho

Todo conceito temporal é fornecido **exclusivamente**
por `geradorDatas.ts` (TypeScript) ou `parametroGerador.js` (legado).

Se um módulo precisar saber:

- o dia atual
- o ano atual
- o total de dias do ano
- se o ano é bissexto

➡️ **DEVE consultar o `geradorDatas.ts` (preferencial) ou `parametroGerador.js` (legado).**

Se a informação não existir,
o módulo **DEVE ser estendido**, nunca contornado.

## 3.2 PROIBIÇÃO ABSOLUTA DE TEMPO FORA DO GERADOR

É proibido no sistema:

- `new Date()` fora de `geradorDatas.ts` ou `parametroGerador.js`
- anos hardcoded (ex.: 2026)
- suposições de 365 dias
- contadores temporais locais ou paralelos

Essa regra é absoluta e não negociável.

## 3.3 CICLOS SÃO FINITOS, PLANOS SÃO CONTÍNUOS

- Um ciclo representa um **ano civil real**
- Todo ciclo termina inevitavelmente
- Um plano NÃO termina automaticamente com o ciclo
- Um plano pode atravessar múltiplos ciclos

O fim de um ciclo é um **evento detectável**,
nunca uma decisão.

## 3.4 O SISTEMA DETECTA, O USUÁRIO DECIDE

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

# 4. HIERARQUIA DE AUTORIDADE (QUEM OBEDECE QUEM)

# ============================================================================

Tempo Real  
└─ `geradorDatas.ts` (TypeScript) ou `parametroGerador.js` (legado)

Orquestração  
└─ `PlanoManager`

Domínio Auxiliar  
├─ Status do Plano  
├─ Regras de Atraso  
├─ Reorganizador de Plano  
└─ Progresso de Leitura

Interface  
└─ UI

### Regras Hierárquicas

- `geradorDatas.ts`/`parametroGerador.js` NÃO depende de nenhum outro módulo
- `PlanoManager` NUNCA gera tempo
- Módulos auxiliares NÃO governam fluxo
- A UI NÃO contém regra de negócio

Violação de hierarquia é erro conceitual grave.

# ============================================================================

# 5. CONCEITOS DO DOMÍNIO

# ============================================================================

## 5.1 PLANO

Um plano representa uma **intenção contínua de leitura**.

Características:

- pode atravessar ciclos
- possui estado explícito
- reage ao tempo, não o controla

Um plano NUNCA muda de estado
sem causa rastreável.

## 5.2 CICLO

Um ciclo representa um **ano civil real**.

- possui início e fim definidos pelo tempo real
- NÃO é criado artificialmente
- NÃO é estendido
- NÃO é reiniciado

O sistema apenas **reconhece** o ciclo.

## 5.3 DIA

Regras absolutas:

- Dia é unidade indivisível
- Não existe dia 0
- Não existe dia fora do calendário real
- Não existe redistribuição retroativa de dias

# ============================================================================

# 6. PRINCÍPIO DO CARTUCHO: MODULARIDADE DE PLANOS

# ============================================================================

Um plano é um **CARTUCHO** —
uma unidade independente e intercambiável
que encaixa no sistema mediante uma interface padronizada.

O sistema é modular com QUALQUER plano
que respeite o contrato definido.

# ============================================================================

# 7. ESTADOS DO PLANO (CONTRATO DE ESTADO)

# ============================================================================

Estados válidos:

- ATIVO
- ATRASADO
- AGUARDANDO_DECISAO
- FIM_DE_CICLO
- CONCLUIDO
- ENCERRADO

Regras:

- Todo estado tem causa explícita
- Transições são controladas
- Nenhum estado muda silenciosamente
- O estado define comportamento permitido

# ============================================================================

# 8. REGRA DE ATRASO (CONTRATO GLOBAL)

# ============================================================================

A regra de atraso:

- é definida por função única
- vive em módulo dedicado
- NÃO possui valores hardcoded espalhados

Alterar essa regra
altera o sistema inteiro de forma consistente.

# ============================================================================

# 9. DECISÕES DO USUÁRIO (CONTRATO DE INTERAÇÃO)

# ============================================================================

Decisões reconhecidas:

- Continuar adaptando o plano
- Reset inteligente
- Reset total
- Continuar no novo ciclo
- Encerrar plano
- Adiar decisão

Decisões implícitas **NÃO existem**.

# ============================================================================

# 10. CONTRATO DA UI

# ============================================================================

A interface pode:

- informar
- perguntar
- exibir estado

A interface **NÃO** pode:

- calcular regras
- decidir fluxo
- interpretar domínio

UI é reflexo. Nunca motor.

# ============================================================================

# 11. CONTRATO DE IMPLEMENTAÇÃO

# ============================================================================

É obrigatório:

- Nenhum tempo fora do `geradorDatas.ts` ou `parametroGerador.js`
- Nenhuma regra de domínio na UI
- Nenhuma adaptação silenciosa
- Nenhum reset ambíguo
- Nenhuma lógica duplicada

Toda violação exige refatoração imediata.

# ============================================================================

# 14. CONTRATO DE RESPONSIVIDADE, HARMONIA VISUAL E QUALIDADE DE EXPERIÊNCIA

# ============================================================================

## 14.1 PRINCÍPIO DE RESPONSIVIDADE UNIVERSAL

A interface do sistema **DEVE** ser plenamente utilizável, legível e funcional
em **todos os tamanhos de tela**, do menor ao maior, incluindo, mas não se limitando a:

- dispositivos móveis de tela reduzida
- tablets
- desktops
- telas amplas e monitores de alta resolução

A responsividade **NÃO é opcional**  
e **NÃO pode** ser tratada como melhoria futura.

A ausência de adaptação adequada de layout, tipografia ou interação
configura violação deste contrato.

## 14.2 ADAPTAÇÃO PROGRESSIVA E DEGRADAÇÃO GRACIOSA

A UI **DEVE**:

- adaptar-se progressivamente conforme o espaço disponível
- preservar hierarquia visual e legibilidade mínima
- evitar colapsos funcionais em telas menores
- degradar de forma graciosa quando houver limitações técnicas

Nenhuma funcionalidade essencial
pode ser perdida por limitação de tamanho de tela.

## 14.3 HARMONIA VISUAL E ESPIRITUALIDADE

A experiência visual do sistema **DEVE** ser:

- moderna
- amigável
- respeitosa
- coerente com um contexto de espiritualidade e reflexão

O design **NÃO** deve induzir:

- ansiedade
- pressão
- agressividade visual
- poluição cognitiva

A estética serve ao propósito do plano.  
Nunca o contrário.

## 14.4 DARK MODE E MODOS DE TEMA

O sistema **DEVE** oferecer suporte a dark mode
ou a modos de tema equivalentes,
observando obrigatoriamente:

- contraste adequado
- legibilidade prolongada
- redução de fadiga visual
- coerência cromática entre estados e componentes

Dark mode **NÃO é inversão de cores**.  
Dark mode é **harmonia adaptada**.

A escolha do tema **NÃO altera** regras de domínio,
estado ou decisão.

## 14.5 RESPEITO AO USUÁRIO E À EQUIPE DE MANUTENÇÃO

A UI **DEVE** respeitar:

- a autonomia do usuário
- a clareza das ações
- a previsibilidade dos efeitos

E o código da UI **DEVE** respeitar:

- a equipe de manutenção
- a legibilidade do código
- a clareza de intenção

Código de UI **DEVE ser**:

- limpo
- organizado
- comentado quando necessário
- escrito de forma profissional
- consistente ao longo do sistema

## 14.6 PROIBIÇÃO DE DUPLICAÇÃO E ACOPLAMENTO INDEVIDO

É proibido:

- duplicar lógica de layout ou estado sem necessidade
- espalhar regras visuais conflitantes
- acoplar UI a regras de domínio
- criar exceções visuais que alterem comportamento do plano

A UI **reflete** o sistema.  
A UI **não o redefine**.

## 14.7 RESPONSABILIDADE E VIOLAÇÃO

Qualquer violação desta seção configura:

- falha de experiência do usuário
- quebra de qualidade de vida do produto
- violação do contrato arquitetural
- responsabilidade técnica explícita

Essa seção é **normativa**,  
não apenas orientativa.

# ============================================================================

# 15. CONTRATO DE PORTABILIDADE, EXECUÇÃO NATIVA E INTEROPERABILIDADE

# ============================================================================

## 15.1 PRINCÍPIO DE EXECUÇÃO NATIVA MULTIPLATAFORMA

Este sistema **DEVE** possuir como horizonte de estabilidade
a execução como aplicativo nativo em:

- Windows
- Android

A versão web é meio legítimo,
não destino final.

## 15.2 PARIDADE FUNCIONAL ENTRE PLATAFORMAS

Diferenças permitidas:

- interface
- persistência
- distribuição

Diferenças proibidas:

- regras de domínio divergentes
- lógica temporal específica
- decisões implícitas

## 15.3 COMUNICAÇÃO ENTRE INSTÂNCIAS

Instâncias **DEVEM** compartilhar:

- planos
- progresso
- decisões explícitas

Sem violar tempo,
estado ou soberania decisória.

## 15.4 ISOLAMENTO DE PLATAFORMA

Lógica específica de plataforma:

- DEVE estar isolada
- DEVE ser substituível
- NÃO pode vazar para domínio

## 15.5 CONTINUIDADE DE IDENTIDADE

A troca de plataforma:

- NÃO reinicia planos
- NÃO reseta ciclos
- NÃO altera decisões

## 15.6 REGRA DE EVOLUÇÃO

Execução nativa:

- NÃO autoriza atalhos
- NÃO flexibiliza contratos
- NÃO cria exceções temporais

O sistema é conceitualmente único,
mesmo em múltiplos corpos.

# ============================================================================

# 16. DECLARAÇÃO FINAL

# ============================================================================

Este sistema é orientado por:

- verdade temporal
- clareza de decisão
- continuidade honesta

O código muda.  
O contrato governa.
