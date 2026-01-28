/* ============================================================================
   NotasHistoricoManager.js — GERENCIADOR DE UNDO/REDO
============================================================================
   Responsabilidade: APENAS gerenciar histórico de estados
   - Manter fila de 50 estados
   - Undo/Redo
   - Snapshot de HTML
   
   NÃO faz: Manipulação de DOM, listeners, formatação
   Camada: Domínio/Serviços
============================================================================ */

/**
 * Gerenciador de histórico para undo/redo
 */
export class NotasHistoricoManager {
  constructor(estadoInicial = "") {
    this.historico = [estadoInicial];
    this.historicoIndex = 0;
    this.MAX_ESTADOS = 50;
  }

  /**
   * Salva novo estado
   * @param {string} novoEstado - Novo estado HTML
   * @public
   */
  salvar(novoEstado) {
    if (!novoEstado) return false;

    const estadoAnterior = this.historico[this.historicoIndex];

    // Não salva se conteúdo é igual
    if (novoEstado === estadoAnterior) {
      return false;
    }

    // Remove estados futuros se estamos no meio do histórico
    if (this.historicoIndex < this.historico.length - 1) {
      this.historico = this.historico.slice(0, this.historicoIndex + 1);
    }

    // Adiciona novo estado
    this.historico.push(novoEstado);
    this.historicoIndex++;

    // Limita a MAX_ESTADOS
    if (this.historico.length > this.MAX_ESTADOS) {
      this.historico.shift();
      this.historicoIndex--;
    }

    return true;
  }

  /**
   * Desfaz última ação
   * @returns {string|null} Estado anterior ou null se no início
   * @public
   */
  undo() {
    if (this.historicoIndex > 0) {
      this.historicoIndex--;
      return this.historico[this.historicoIndex];
    }
    return null;
  }

  /**
   * Refaz ação desfeita
   * @returns {string|null} Próximo estado ou null se no fim
   * @public
   */
  redo() {
    if (this.historicoIndex < this.historico.length - 1) {
      this.historicoIndex++;
      return this.historico[this.historicoIndex];
    }
    return null;
  }

  /**
   * Estado atual
   * @returns {string} HTML atual
   * @public
   */
  estadoAtual() {
    return this.historico[this.historicoIndex];
  }

  /**
   * Verifica se pode fazer undo
   * @returns {boolean}
   * @public
   */
  podeUndo() {
    return this.historicoIndex > 0;
  }

  /**
   * Verifica se pode fazer redo
   * @returns {boolean}
   * @public
   */
  podeRedo() {
    return this.historicoIndex < this.historico.length - 1;
  }

  /**
   * Limpa histórico
   * @public
   */
  limpar() {
    this.historico = [this.historico[this.historicoIndex]];
    this.historicoIndex = 0;
  }

  /**
   * Obtém tamanho do histórico
   * @returns {number} Quantidade de estados
   * @public
   */
  tamanho() {
    return this.historico.length;
  }
}
