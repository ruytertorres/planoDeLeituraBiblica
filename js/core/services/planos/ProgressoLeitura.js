/* ============================================================================
   ProgressoLeitura.js — Gerenciador de Progresso de Leitura
   Versão: 1.0.0
   Aplicação: Leitura Controlada da Bíblia

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------
   - Gerenciar estado de leitura (lido/não lido)
   - Persistir progresso em localStorage
   - Calcular estatísticas de progresso
   - Gerenciar reajustes de plano
============================================================================ */

import * as parametroGerador from "../../models/parametroGerador.js";

/* ============================================================================
   CLASSE PROGRESSOLEITURA
============================================================================ */

export class ProgressoLeitura {
  /* --------------------------------------------------------------------------
     ATRIBUTOS PRIVADOS
     -------------------------------------------------------------------------- */

  constructor() {
    this.chaveStorage = "progresso-leitura";
    this.chaveReajuste = "reajuste-plano";
    this.diasLidos = new Set();
    this.reajusteAtivo = null;
  }

  /* --------------------------------------------------------------------------
     GERENCIAMENTO DE PROGRESSO
     -------------------------------------------------------------------------- */

  /**
   * Alterna o estado de lido/não lido para um dia
   * @param {number} numeroDia - Número do dia (1-based)
   */
  alternar(numeroDia) {
    if (this.diasLidos.has(numeroDia)) {
      this.diasLidos.delete(numeroDia);
    } else {
      this.diasLidos.add(numeroDia);
    }
    this.salvarNoStorage();
  }

  /**
   * Marca um dia como lido
   * @param {number} numeroDia - Número do dia (1-based)
   */
  marcarComoLido(numeroDia) {
    this.diasLidos.add(numeroDia);
    this.salvarNoStorage();
  }

  /**
   * Marca um dia como não lido
   * @param {number} numeroDia - Número do dia (1-based)
   */
  marcarComoNaoLido(numeroDia) {
    this.diasLidos.delete(numeroDia);
    this.salvarNoStorage();
  }

  /**
   * Verifica se um dia está marcado como lido
   * @param {number} numeroDia - Número do dia (1-based)
   * @returns {boolean} True se estiver lido
   */
  estaLido(numeroDia) {
    return this.diasLidos.has(numeroDia);
  }

  /**
   * Retorna o total de dias lidos
   * @returns {number} Total de dias lidos
   */
  getTotalLidos() {
    return this.diasLidos.size;
  }

  /**
   * Retorna o último dia lido
   * @returns {number|null} Número do último dia lido ou null
   */
  getUltimoDiaLido() {
    if (this.diasLidos.size === 0) return null;
    return Math.max(...this.diasLidos);
  }

  /* --------------------------------------------------------------------------
     PERSISTÊNCIA
     -------------------------------------------------------------------------- */

  /**
   * Sincroniza com localStorage
   */
  sincronizarComStorage() {
    try {
      const salvo = localStorage.getItem(this.chaveStorage);
      if (salvo) {
        const dados = JSON.parse(salvo);
        this.diasLidos = new Set(dados.diasLidos || []);
      }

      const reajusteSalvo = localStorage.getItem(this.chaveReajuste);
      if (reajusteSalvo) {
        this.reajusteAtivo = JSON.parse(reajusteSalvo);
      }
    } catch (error) {
      console.error("Erro ao sincronizar com storage:", error);
    }
  }

  /**
   * Salva estado atual no localStorage
   */
  salvarNoStorage() {
    try {
      const dados = {
        diasLidos: Array.from(this.diasLidos),
        ultimaAtualizacao: new Date(
          parametroGerador.getDiaDoAnoAtual(),
        ).toISOString(),
      };
      localStorage.setItem(this.chaveStorage, JSON.stringify(dados));
    } catch (error) {
      console.error("Erro ao salvar no storage:", error);
    }
  }

  /**
   * Reseta todo o progresso
   */
  resetar() {
    this.diasLidos.clear();
    this.reajusteAtivo = null;
    this.salvarNoStorage();
    localStorage.removeItem(this.chaveReajuste);
  }

  /* --------------------------------------------------------------------------
     GERENCIAMENTO DE REAJUSTE
     -------------------------------------------------------------------------- */

  /**
   * Salva informações de reajuste
   * @param {number} numeroDia - Número do dia ajustado
   * @param {number} diaHoje - Dia que deveria ser hoje
   */
  salvarReajuste(numeroDia, diaHoje) {
    this.reajusteAtivo = {
      ativo: true,
      numeroDia,
      diaHoje,
      dataReajuste: new Date(parametroGerador.getDiaDoAnoAtual()).toISOString(),
    };
    localStorage.setItem(
      this.chaveReajuste,
      JSON.stringify(this.reajusteAtivo),
    );
  }

  /**
   * Obtém informações de reajuste
   * @returns {Object|null} Informações do reajuste ou null
   */
  obterReajuste() {
    return this.reajusteAtivo;
  }

  /**
   * Calcula deslocamento de datas baseado no reajuste
   * @returns {number} Deslocamento em dias
   */
  obterDeslocamentoDatas() {
    if (!this.reajusteAtivo || !this.reajusteAtivo.ativo) {
      return 0;
    }
    return this.reajusteAtivo.diaHoje - this.reajusteAtivo.numeroDia;
  }
}
