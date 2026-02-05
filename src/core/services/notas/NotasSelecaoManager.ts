/* ============================================================================
   NotasSelecaoManager.ts — Gerenciador de Seleção de Texto
   Versão: 2.0.0 (TypeScript)
   ============================================================================

   Responsabilidade: APENAS gerenciar seleção de texto
   - Salvar/restaurar Range
   - Encontrar texto nodes
   - Posicionar cursor

   NÃO faz: Manipulação de HTML, listeners
   Camada: UI (Utilitários)

   CONFORMIDADE COM CONTRATO_DO_SISTEMA.MD:
   - §10: UI é reflexo (não manipula estado)
   ============================================================================ */

/**
 * Snapshot de seleção para salvar/restaurar
 */
export interface SnapshotSelecao {
  range: Range;
  texto: string;
  estadoColapsed: boolean;
}

/**
 * Gerenciador de seleção e cursor
 */
export class NotasSelecaoManager {
  /**
   * Salva seleção atual
   *
   * @param editor - Editor contenteditable
   * @returns Snapshot de seleção ou null
   */
  static salvar(editor: HTMLElement): SnapshotSelecao | null {
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
   *
   * @param selecaoSalva - Snapshot retornado por salvar()
   */
  static restaurar(selecaoSalva: SnapshotSelecao | null): void {
    if (!selecaoSalva?.range) return;

    const sel = window.getSelection();
    sel?.removeAllRanges();

    try {
      sel?.addRange(selecaoSalva.range);
    } catch (e) {
      console.warn("Falha ao restaurar seleção:", (e as Error).message);
    }
  }

  /**
   * Encontra todos os text nodes de um elemento
   *
   * @param element - Elemento para buscar
   * @returns Array de text nodes
   */
  static encontrarTextNodes(element: HTMLElement): Text[] {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false,
    );

    const textNodes: Text[] = [];
    let node: Node | null;
    while ((node = walker.nextNode())) {
      textNodes.push(node as Text);
    }
    return textNodes;
  }

  /**
   * Encontra bloco (P, H2, H3, LI, etc) contendo cursor
   *
   * @param editor - Editor
   * @returns Bloco encontrado ou null
   */
  static encontrarBlocoComCursor(editor: HTMLElement): HTMLElement | null {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;

    let node: Node | null = sel.anchorNode;
    const BLOCOS_PERMITIDOS = [
      "P", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "DIV",
    ];

    while (node && node !== editor) {
      if (
        node.nodeType === 1 &&
        BLOCOS_PERMITIDOS.includes((node as HTMLElement).tagName)
      ) {
        return node as HTMLElement;
      }
      node = node.parentNode;
    }
    return null;
  }

  /**
   * Posiciona cursor no fim de elemento
   *
   * @param element - Elemento
   */
  static posicionarNoFim(element: HTMLElement): void {
    const sel = window.getSelection();
    const range = document.createRange();

    range.selectNodeContents(element);
    range.collapse(false); // Collapse para fim

    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  /**
   * Posiciona cursor no início de elemento
   *
   * @param element - Elemento
   */
  static posicionarNoInicio(element: HTMLElement): void {
    const sel = window.getSelection();
    const range = document.createRange();

    range.selectNodeContents(element);
    range.collapse(true); // Collapse para início

    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  /**
   * Obtém texto selecionado
   *
   * @returns Texto selecionado
   */
  static obterTextoSelecionado(): string {
    const sel = window.getSelection();
    return sel?.toString() || "";
  }

  /**
   * Verifica se há seleção
   *
   * @returns true se houver seleção
   */
  static temSelecao(): boolean {
    const sel = window.getSelection();
    return !!(sel && !sel.isCollapsed && sel.rangeCount > 0);
  }

  /**
   * Remove seleção
   */
  static limpar(): void {
    window.getSelection()?.removeAllRanges();
  }
}

export default NotasSelecaoManager;
