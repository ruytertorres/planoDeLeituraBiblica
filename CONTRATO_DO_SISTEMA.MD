📘 CONTRATO DO SISTEMA
Biblia Responsiva — Domínio de Planos, Tempo e Orquestração
/\* ============================================================================
CONTRATO_DO_SISTEMA.md — Fonte de Verdade Conceitual
Versão: 1.0.0
Aplicação: Sistema Biblia Responsiva — Domínio de Planos, Tempo e Orquestração

Autor: Ruyter Torres
GitHub: https://github.com/ruytertorres
LinkedIn: https://www.linkedin.com/in/ruytertorres
Email: ruytertorres.gmail.com

RESPONSABILIDADE:

Define regras de domínio e hierarquias de autoridade

Estabelece contratos entre módulos e limites de responsabilidade

Serve como fonte de verdade conceitual para todo o sistema

NÃO É RESPONSABILIDADE DESTE DOCUMENTO:

Implementar código específico

Substituir testes automatizados

Documentar APIs técnicas detalhadas

PRINCÍPIOS / CONTRATOS:

O código implementa este contrato

O contrato não se adapta ao código

Qualquer refatoração deve obedecer este documento
============================================================================ \*/

/_ ============================================================================ 0. Natureza deste documento (Fonte de Verdade)
============================================================================ _/

Este documento é a fonte de verdade conceitual do sistema.

Ele define:

regras de domínio

hierarquias de autoridade

contratos entre módulos

limites explícitos de responsabilidade

Qualquer refatoração, correção ou expansão do código DEVE obedecer a este documento.

Alterar este documento impacta o sistema inteiro e deve ser feito com máxima cautela.

O código implementa o contrato.
O contrato não se adapta ao código.

/\* ============================================================================

Regra-Alma do Sistema
============================================================================ \*/

O tempo passa.
O sistema reconhece.
O usuário decide.
O plano continua com verdade.

Nenhuma decisão estrutural do sistema pode violar essa sequência.

/_ ============================================================================ 2. Princípios Fundamentais
============================================================================ _/

/_ ---------------------------------------------------------------------------
2.1 Tempo é soberano
--------------------------------------------------------------------------- _/

O sistema não cria tempo

O sistema não simula calendários

O sistema não fixa datas ou anos

O sistema não calcula ciclos sozinho

Todo conceito temporal é fornecido exclusivamente por geradorDatas.js.

Se um módulo precisar saber:

o dia atual

o ano atual

o total de dias do ano

se o ano é bissexto

➡️ DEVE perguntar ao geradorDatas.js.

Se geradorDatas.js não oferecer a informação necessária,
ele deve ser estendido, nunca contornado.

/_ ---------------------------------------------------------------------------
2.2 Nenhum tempo fora do geradorDatas.js
--------------------------------------------------------------------------- _/

É proibido no sistema:

new Date() fora de geradorDatas.js

anos hardcoded (ex: 2026)

suposições de 365 dias

contadores temporais locais

Essa regra é absoluta.

/_ ---------------------------------------------------------------------------
2.3 Ciclos são finitos, planos são contínuos
--------------------------------------------------------------------------- _/

Um ciclo representa um ano civil real

Todo ciclo termina inevitavelmente

Um plano não termina automaticamente com o ciclo

Um plano pode atravessar múltiplos ciclos

O fim de um ciclo é um evento, não uma decisão.

/_ ---------------------------------------------------------------------------
2.4 O sistema detecta, o usuário decide
--------------------------------------------------------------------------- _/

O sistema:

detecta atraso

detecta fim de ciclo

detecta conflitos

O sistema nunca:

decide reset

decide continuação

decide encerramento

decide adaptação silenciosa

Decisão é sempre explícita e atribuída ao usuário.

/_ ============================================================================ 3. Hierarquia de Autoridade (quem obedece quem)
============================================================================ _/

Tempo Real
└─ geradorDatas.js
└─ PlanoManager (orquestrador)
├─ Status do Plano
├─ Regras de Atraso
├─ Reorganizador de Plano
└─ Progresso de Leitura

/_ ---------------------------------------------------------------------------
Regras hierárquicas
--------------------------------------------------------------------------- _/

geradorDatas.js não depende de nenhum outro módulo

PlanoManager nunca gera tempo

Módulos auxiliares não governam fluxo

A UI não contém regra de negócio

Violação de hierarquia é erro conceitual grave.

/_ ============================================================================ 4. Conceitos do Domínio
============================================================================ _/

/_ ---------------------------------------------------------------------------
4.1 Plano
--------------------------------------------------------------------------- _/

Um plano representa uma intenção contínua de leitura.

Características:

pode atravessar ciclos

possui estado explícito

reage ao tempo, não o controla

Um plano nunca muda de estado sem causa rastreável.

/_ ---------------------------------------------------------------------------
4.2 Ciclo
--------------------------------------------------------------------------- _/

Um ciclo representa um ano civil real.

possui início e fim definidos pelo tempo real

não é criado artificialmente

não é estendido

não é reiniciado

O sistema apenas reconhece o ciclo.

/_ ---------------------------------------------------------------------------
4.3 Dia
--------------------------------------------------------------------------- _/

Dia é unidade indivisível

Não existe dia 0

Não existe dia além do calendário real

Não existe redistribuição retroativa de dias

/_ ============================================================================ 5. Estados do Plano (Contrato de Estado)
============================================================================ _/

Estados válidos:

ATIVO

ATRASADO

AGUARDANDO_DECISAO

FIM_DE_CICLO

CONCLUIDO

ENCERRADO

/_ ---------------------------------------------------------------------------
Regras
--------------------------------------------------------------------------- _/

Todo estado tem causa explícita

Transições são controladas

Nenhum estado muda silenciosamente

Estado define comportamento permitido

/_ ============================================================================ 6. Regra de Atraso (Contrato Global)
============================================================================ _/

A regra de atraso:

é definida por função única

vive em módulo dedicado

não possui valores hardcoded espalhados

Exemplo conceitual:

O sistema define: "plano está atrasado após X dias"

UI consome: "Seu plano está atrasado há X dias"

Nenhum módulo replica essa lógica

Alterar a regra altera o sistema inteiro, de forma consistente.

/_ ============================================================================ 7. Decisões do Usuário (Contrato de Interação)
============================================================================ _/

Decisões reconhecidas pelo sistema:

Continuar adaptando o plano

Reset inteligente (reancoragem)

Reset total

Continuar no novo ciclo

Encerrar plano

Adiar decisão

Cada decisão:

é explícita

é registrada

produz efeito rastreável

Não existem decisões implícitas.

/_ ============================================================================ 8. Contrato da UI
============================================================================ _/

A interface:

informa

pergunta

exibe estado

A interface não:

calcula regras

decide fluxo

interpreta domínio

UI é reflexo, não motor.

/_ ============================================================================ 9. Contrato de Implementação
============================================================================ _/

É obrigatório:

Nenhum tempo fora do geradorDatas.js

Nenhuma regra de domínio na UI

Nenhuma adaptação silenciosa

Nenhum reset ambíguo

Nenhuma lógica duplicada

Toda violação exige refatoração imediata.

/_ ============================================================================ 10. Evolução do Documento
============================================================================ _/

Este documento é vivo, porém controlado.

Ele cresce à medida que:

regras são consolidadas

contratos são descobertos

ambiguidades são eliminadas

Refatorar este documento é refatorar o sistema inteiro.

Nenhuma alteração deve ser feita sem consciência sistêmica.

/_ ============================================================================ 11. Declaração Final
============================================================================ _/

Este sistema é orientado por verdade temporal, clareza de decisão
e continuidade honesta.

O código muda.
O contrato governa.

/_ ============================================================================ 12. Cabeçalhos e Comentários de Arquivo (Contrato de Arquitetura)
============================================================================ _/

Todo arquivo de domínio, serviço ou orquestração DEVE obedecer às seguintes regras de documentação:

/_ ---------------------------------------------------------------------------
12.1 Cabeçalho Obrigatório
--------------------------------------------------------------------------- _/

Todo arquivo deve começar com um cabeçalho contratual no formato:

/\* ============================================================================
nomeDoArquivo.js — Papel claro e inequívoco
Versão: X.Y.Z
Aplicação: Nome do sistema ou subdomínio

Autor: Ruyter Torres
GitHub: https://github.com/ruytertorres
LinkedIn: https://www.linkedin.com/in/ruytertorres
Email: ruytertorres.gmail.com

RESPONSABILIDADE:

O que ESTE arquivo faz

O que ELE é dono

O que ELE garante

NÃO É RESPONSABILIDADE DESTE ARQUIVO:

O que explicitamente NÃO pode fazer

Onde essa responsabilidade vive

PRINCÍPIOS / CONTRATOS:

Regras arquiteturais que ESTE arquivo obedece

Dependências permitidas

Dependências proibidas
============================================================================ \*/

Regra implícita: se algo não cabe nesse cabeçalho, provavelmente o arquivo está grande demais ou violando o princípio de responsabilidade única.

/_ ---------------------------------------------------------------------------
12.2 Blocos de Seção
--------------------------------------------------------------------------- _/

Blocos de seção DEVEM ser usados para organizar lógica conceitual, nunca estética:

/_ ============================================================================
NOME DA SEÇÃO
============================================================================ _/

Indicados para:

Tipos

Constantes

Classes

API pública

Regras de negócio

Fluxos de controle

Proibido: criar bloco apenas para separar visualmente código sem intenção conceitual.

/_ ---------------------------------------------------------------------------
12.3 Sub-blocos
--------------------------------------------------------------------------- _/

Sub-blocos DEVEM contextualizar decisões locais complexas:

/_ ---------------------------------------------------------------------------
VALIDAÇÕES ESTRUTURAIS
--------------------------------------------------------------------------- _/

Indicados quando:

O código impõe regras explícitas

Há risco de uso incorreto

A intenção não é óbvia só pelo código

Proibido: comentar código óbvio, como:

// incrementa contador
contador++

/_ ---------------------------------------------------------------------------
12.4 Comentários de Função / Método
--------------------------------------------------------------------------- _/

Contratos de funções DEVEM ser documentados assim:

/\*\*

Descrição objetiva do que o método garante

@param {tipo} nome - Regra do parâmetro (não repetir o nome)

@returns {tipo} O que é garantido ao retornar

@throws Quando falha e por quê
\*/

Regra: o comentário NUNCA explica como o método funciona, apenas o quê faz e sob quais condições.

/_ ---------------------------------------------------------------------------
12.5 Comentários Internos
--------------------------------------------------------------------------- _/

Comentários internos são permitidos somente para decisões não triviais:

// MÉTODO BULLETPROOF: criar data no meio do dia (12:00) para evitar fuso

Permitido: explicação de decisões, riscos evitados, contratos não óbvios.
Proibido: narrar o código ou ensinar sintaxe.

/_ ---------------------------------------------------------------------------
12.6 Regra-Mãe do Padrão
--------------------------------------------------------------------------- _/

Comentário existe para declarar intenções, contratos e limites arquiteturais.

Comentário correto: se o código muda, o comentário continua válido.

Comentário incorreto: se o código muda e o comentário se torna falso.

Este padrão serve como régua de refatoração e garante consistência no código de todo o sistema.
