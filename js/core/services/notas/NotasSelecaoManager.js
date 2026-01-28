/* ============================================================================
   NotasSelecaoManager.js — GERENCIADOR DE SELEÇÃO
============================================================================
   Responsabilidade: APENAS gerenciar seleção de texto
   - Salvar/restaurar Range
   - Encontrar texto nodes
   - Posicionar cursor
   
   NÃO faz: Manipulação de HTML, listeners
   Camada: UI (Utilitários)
============================================================================ */

/**
 * Gerenciador de seleção e cursor
 */
export class NotasSelecaoManager {
  /**
   * Salva seleção atual
   * @param {HTMLElement} editor - Editor contenteditable
   * @returns {Object|null} Snapshot de seleção
   * @public
   */
  static salvar(editor) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;

    try {
      const range = sel.getRangeAt(0);
      return {
        range: range.cloneRange(),
        texto: sel.toString(),
        estadoColapsed: sel.isCollapsed,
      };
    } catch (e) {
      return null;
    }
  }

  /**
   * Restaura seleção salva
   * @param {Object} selecaoSalva - Snapshot retornado por salvar()
   * @public
   */
  static restaurar(selecaoSalva) {
    if (!selecaoSalva || !selecaoSalva.range) return;

    const sel = window.getSelection();
    sel.removeAllRanges();

    try {
      sel.addRange(selecaoSalva.range);
    } catch (e) {
      // Se falhar, apenas deixa sem seleção (não silencioso)
      console.warn("Falha ao restaurar seleção:", e.message);
    }
  }

  /**
   * Encontra todos os text nodes de um elemento
   * @param {HTMLElement} element - Elemento para buscar
   * @returns {Text[]} Array de text nodes
   * @public
   */
  static encontrarTextNodes(element) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false,
    );

    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }
    return textNodes;
  }

  /**
   * Encontra bloco (P, H2, H3, LI, etc) contendo cursor
   * @param {HTMLElement} editor - Editor
   * @returns {HTMLElement|null} Bloco encontrado
   * @public
   */
  static encontrarBlocoComCursor(editor) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;

    let node = sel.anchorNode;
    const BLOCOS_PERMITIDOS = [
      "P",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "LI",
      "DIV",
    ];

    while (node && node !== editor) {
      if (node.nodeType === 1 && BLOCOS_PERMITIDOS.includes(node.tagName)) {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  }

  /**
   * Posiciona cursor no fim de elemento
   * @param {HTMLElement} element - Elemento
   * @public
   */
  static posicionarNoFim(element) {
    const sel = window.getSelection();
    const range = document.createRange();

    range.selectNodeContents(element);
    range.collapse(false); // Collapse para fim

    sel.removeAllRanges();
    sel.addRange(range);
  }

  /**
   * Posiciona cursor no início de elemento
   * @param {HTMLElement} element - Elemento
   * @public
   */
  static posicionarNoInicio(element) {
    const sel = window.getSelection();
    const range = document.createRange();

    range.selectNodeContents(element);
    range.collapse(true); // Collapse para início

    sel.removeAllRanges();
    sel.addRange(range);
  }

  /**
   * Obtém texto selecionado
   * @returns {string} Texto selecionado
   * @public
   */
  static obterTextoselecionado() {
    const sel = window.getSelection();
    return sel ? sel.toString() : "";
  }

  /**
   * Verifica se há seleção
   * @returns {boolean}
   * @public
   */
  static temSelecao() {
    const sel = window.getSelection();
    return sel && !sel.isCollapsed && sel.rangeCount > 0;
  }

  /**
   * Remove seleção
   * @public
   */
  static limpar() {
    const sel = window.getSelection();
    if (sel) sel.removeAllRanges();
  }
}
