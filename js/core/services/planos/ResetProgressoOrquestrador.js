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

import { getContextoTemporalAtual } from "../../dominio/geradorDatas.js";

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
   * Executa o reset completo do progresso
   * @returns {Object} Resultado do reset
   * @throws {Error} Se houver erro ao resetar
   */
  confirmarReset() {
    try {
      // 1. Resetar progresso (domínio)
      const resultadoReset = this.progresso.resetarCompletamente();

      // 2. Disparar evento para UI camada
      this.dispararEventoReset(resultadoReset);

      return {
        sucesso: true,
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
   * @param {Object} detalhes - Dados do reset
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
