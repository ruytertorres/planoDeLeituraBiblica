/* ============================================================================
   ResetProgressoOrquestrador.js — Lógica de Reset (Domínio)
   Versão: 2.0.0
   Aplicação: Leitura Bíblica Cronológica
   Camada: Orquestração (Domínio)

   RESPONSABILIDADE ÚNICA:
   - Orquestrar reset de progresso
   - Chamar progressoLeitura.resetarCompletamente()
   - Disparar eventos para UI reagir
   - NÃO gerencia UI, DOM ou styling
============================================================================ */

import { getContextoTemporalAtual } from "../../models/parametroGerador.js";

export class ResetProgressoOrquestrador {
  constructor(progressoLeitura, planoManager) {
    if (!progressoLeitura || !planoManager) {
      throw new Error(
        "ResetProgressoOrquestrador requer progressoLeitura e planoManager.",
      );
    }

    this.progresso = progressoLeitura;
    this.planoManager = planoManager;
  }

  /* ========================================================================
     ORQUESTRAÇÃO DO RESET
  ======================================================================== */

  /**
   * Executa o reset do progresso, com estratégia escolhida pelo usuário.
   *
   * @param {"completo"|"hoje"} tipoReset
   *   - "completo": volta o plano para o estado original
   *                 (Dia 1 em 01/01, sem deslocamento de datas)
   *   - "hoje": alinha o Dia 1 do plano com a data civil atual
   *             (pode ultrapassar 31/12 e continuar no próximo ano)
   *
   * @returns {Object} Resultado do reset
   * @throws {Error} Se houver erro ao resetar
   */
  confirmarReset(tipoReset = "completo") {
    try {
      // 0. Snapshot temporal atual (ano, dia do ano, total de dias)
      const contextoTemporal = getContextoTemporalAtual();

      // 1. Limpar qualquer reajuste anterior (datas voltam para o plano base)
      this.progresso.limparReajuste();

      // 2. Resetar progresso (domínio)
      const resultadoReset = this.progresso.resetarCompletamente();

      // 3. Decidir estratégia de datas:
      //    - "completo": não cria novo reajuste → plano volta a 01/01, 02/01, ...
      //    - "hoje": cria um novo reajuste simulando "Dia 1 → hoje"
      let avisoUltrapassagem = null;

      if (tipoReset === "hoje") {
        // Dia 1 deve cair na data civil de hoje
        const diaHoje = contextoTemporal.diaDoAno;

        // Persistir reajuste com númeroDia = 1
        this.progresso.salvarReajuste(1, diaHoje);

        // Calcular se o plano ultrapassará 31/12
        const totalDiasPlano = this.planoManager.getTotalDias();
        const diaFinalPlano = diaHoje + (totalDiasPlano - 1);

        if (diaFinalPlano > contextoTemporal.totalDias) {
          const diasAposFimAno = diaFinalPlano - contextoTemporal.totalDias;
          avisoUltrapassagem = `O plano ultrapassará 31/12 e continuará no próximo ano (aprox. +${diasAposFimAno} dia(s) após 31/12).`;
        }

        resultadoReset.resetType = "hoje";
      } else {
        // Reset clássico: linha do tempo original
        resultadoReset.resetType = "completo";
      }

      // 4. Disparar evento para camada de UI
      this.dispararEventoReset({
        ...resultadoReset,
        tipoReset,
        avisoUltrapassagem,
      });

      // 5. Retornar resumo para quem chamou
      return {
        sucesso: true,
        tipoReset,
        avisoUltrapassagem,
        ...resultadoReset,
      };
    } catch (error) {
      console.error("Erro ao resetar progresso:", error);
      throw error;
    }
  }

  /**
   * Executa reset sem interface (forçado)
   * Útil para testes ou automação
   * @returns {Object} Resultado do reset
   */
  resetarForcado() {
    console.warn("Reset forçado do progresso");
    const resultado = this.confirmarReset();
    return resultado;
  }

  /* ========================================================================
     EVENTOS
  ======================================================================== */

  /**
   * Dispara evento customizado para notificar UI e main.js
   * @private
   * @param {Object} detalhes - Dados do reset (inclui tipoReset/avisoUltrapassagem)
   */
  dispararEventoReset(detalhes) {
    const contextoTemporal = getContextoTemporalAtual();

    const evento = new CustomEvent("progresso-resetado", {
      detail: {
        ...detalhes,
        ano: contextoTemporal.ano,
        diaAtual: contextoTemporal.diaDoAno,
        totalLidos: this.progresso.getTotalLidos(),
      },
    });

    document.dispatchEvent(evento);
  }

  /* ========================================================================
     CALLBACKS PARA UI
  ======================================================================== */

  /**
   * Callback para quando usuário confirma reset no modal
   * Chamado por ResetModal após confirmação
   */
  aoConfirmarReset(callback) {
    document.addEventListener("progresso-resetado", (evento) => {
      if (typeof callback === "function") {
        callback(evento.detail);
      }
    });
  }

  /**
   * Callback para quando há erro no reset
   * Chamado por ResetModal para mostrar erro
   */
  aoErroReset(callback) {
    // Emitir evento de erro se houver
    window.addEventListener("erro-reset-progresso", (evento) => {
      if (typeof callback === "function") {
        callback(evento.detail);
      }
    });
  }
}
