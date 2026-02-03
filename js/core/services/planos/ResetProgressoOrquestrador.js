/* ============================================================================
   ResetProgressoOrquestrador.js — Orquestrador de Reset de Progresso
   Versão: 1.0.0
   Aplicação: Leitura Controlada da Bíblia

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------
   - Orquestrar operações de reset de progresso
   - Gerenciar diferentes tipos de reset
   - Coordenar entre managers de plano e progresso
   - Emitir eventos de reset
============================================================================ */

import { BaseOrquestrador } from "../../../ui/orquestradores/BaseOrquestrador.js";
import * as parametroGerador from "../../models/parametroGerador.js";

/* ============================================================================
   CLASSE RESETPROGRESSOORQUESTRADOR
============================================================================ */

export class ResetProgressoOrquestrador extends BaseOrquestrador {
  /* --------------------------------------------------------------------------
     ATRIBUTOS PRIVADOS
     -------------------------------------------------------------------------- */

  constructor(progressoManager, planoManager) {
    super("ResetProgressoOrquestrador");
    this.progressoManager = progressoManager;
    this.planoManager = planoManager;
  }

  /* --------------------------------------------------------------------------
     OPERAÇÕES DE RESET
     -------------------------------------------------------------------------- */

  /**
   * Reset completo - volta tudo ao início SEM BLOQUEAR DIAS
   */
  resetCompleto() {
    // Resetar progresso
    this.progressoManager.resetar();

    // Resetar plano para o primeiro dia
    this.planoManager.resetar();

    // ✅ CORREÇÃO: Reset completo NÃO bloqueia dias
    // Sistema volta ao estado original: tudo clicável, dia 1 disponível
    const diasBloqueados = []; // Array vazio = nenhum dia bloqueado

    // Emitir evento SEM dias bloqueados
    this.emit("progresso-resetado", {
      tipo: "completo",
      descricao: "Progresso resetado completamente",
      diasBloqueados, // Array vazio para reset completo
    });

    return {
      sucesso: true,
      tipo: "completo",
      mensagem: "Progresso resetado com sucesso - Sistema reiniciado do Dia 1",
      diasBloqueados, // Array vazio
    };
  }

  /**
   * Reset customizado - começa a partir de um dia específico
   * @param {number} numeroDia - Dia para começar (ex: 1)
   */
  resetCustomizado(numeroDia) {
    // Resetar progresso
    this.progressoManager.resetar();

    // Resetar plano para o dia específico
    const resultado = this.planoManager.resetarAPartirDoDia(numeroDia);

    if (!resultado.sucesso) {
      return {
        sucesso: false,
        erro: resultado.erro,
        mensagem: "Falha ao resetar plano",
      };
    }

    // Emitir evento
    this.emit("progresso-resetado", {
      tipo: "customizado",
      numeroDia,
      descricao: `Progresso resetado para começar no dia ${numeroDia}`,
    });

    return {
      sucesso: true,
      tipo: "customizado",
      numeroDia,
      mensagem: `Progresso resetado para começar no dia ${numeroDia}`,
    };
  }

  /**
   * Reset para hoje - ajusta o plano para que o dia atual corresponda à data de hoje
   */
  resetParaHoje() {
    // Obter dia atual ANTES de resetar o progresso
    const diaAtualAntesDoReset = this.progressoManager.getUltimoDiaLido() || 0;

    // Resetar progresso
    this.progressoManager.resetar();

    // Resetar plano para o Dia 1 (começar do início)
    const resultado = this.planoManager.resetarAPartirDoDia(1);

    if (!resultado.sucesso) {
      return {
        sucesso: false,
        erro: resultado.erro,
        mensagem: "Falha ao resetar plano",
      };
    }

    // Criar lista de dias bloqueados (todos os dias anteriores ao reset)
    const diasBloqueados = [];
    for (let i = 1; i <= diaAtualAntesDoReset; i++) {
      diasBloqueados.push(i);
    }

    // ✅ CORREÇÃO: Calcular deslocamento para alinhar Dia 1 com hoje
    const diaDoAnoHoje = this.getDiaDoAnoAtual();
    const deslocamentoDatas = diaDoAnoHoje - 1; // Dia 1 deve virar hoje

    // Verificar se o plano ultrapassará 31/12 (365 dias)
    const totalDias = this.planoManager.getTotalDias();
    const diaFinalDoAno = 365; // 31/12

    let avisoUltrapassagem = null;
    if (totalDias > diaFinalDoAno - diaDoAnoHoje + 1) {
      avisoUltrapassagem = `Atenção: Este plano ultrapassará 31/12 e continuará no próximo ano civil.`;
    }

    // ✅ CORREÇÃO: Aplicar deslocamento de datas no progresso
    this.progressoManager.definirDeslocamentoDatas(deslocamentoDatas);

    // Emitir evento com dias bloqueados e deslocamento
    this.emit("progresso-resetado", {
      tipo: "hoje",
      mensagem: "Progresso resetado para começar hoje",
      diasBloqueados, // Enviar dias que devem ser bloqueados
      deslocamentoDatas, // Enviar deslocamento para alinhamento
      aviso: avisoUltrapassagem,
    });

    return {
      sucesso: true,
      tipo: "hoje",
      mensagem: "Progresso resetado para começar hoje",
      diasBloqueados,
      deslocamentoDatas,
      aviso: avisoUltrapassagem,
    };
  }

  /* --------------------------------------------------------------------------
     UTILIDADES
     -------------------------------------------------------------------------- */

  /**
   * Obtém o dia do ano atual
   * @returns {number} Dia do ano (1-366)
   */
  getDiaDoAnoAtual() {
    return parametroGerador.getDiaDoAnoAtual();
  }

  /**
   * Obtém estatísticas atuais do progresso
   * @returns {Object} Estatísticas
   */
  getEstatisticas() {
    const totalLidos = this.progressoManager.getTotalLidos();
    const totalDias = this.planoManager.getTotalDias();
    const diaAtual = this.planoManager.getIndiceAtual() + 1;

    return {
      totalLidos,
      totalDias,
      diaAtual,
      percentualConcluido: Math.round((totalLidos / totalDias) * 100),
      percentualProgresso: Math.round((diaAtual / totalDias) * 100),
    };
  }
}
