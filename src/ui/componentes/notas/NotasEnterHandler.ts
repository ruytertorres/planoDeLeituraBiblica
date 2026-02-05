/* ============================================================================
   NotasEnterHandler.ts — Handler de Tecla ENTER para Editor
   Versão: 2.0.0 (TypeScript)
   ============================================================================ */

/**
 * Configura handler de ENTER para editor de notas
 * @param editor - Elemento editor contenteditable
 */
export function setupEnterHandler(editor: HTMLElement): void {
  editor.addEventListener("keydown", handleEnter);
}

/**
 * Handler para tecla ENTER
 */
function handleEnter(e: KeyboardEvent): void {
  if (e.key !== "Enter") return;
  e.preventDefault();

  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0);
  const startContainer = range.startContainer;
  const startOffset = range.startOffset;

  // Encontra bloco atual
  let blocoAtual: Node | null = startContainer;
  const target = e.target as HTMLElement;
  while (blocoAtual && blocoAtual !== target) {
    if (
      blocoAtual.nodeType === 1 &&
      ["P", "H2", "H3", "LI", "DIV"].includes((blocoAtual as HTMLElement).tagName)
    ) {
      break;
    }
    blocoAtual = blocoAtual.parentNode;
  }

  // Se não encontrou bloco válido, cria parágrafo
  if (!blocoAtual || blocoAtual === target) {
    _criarBlocoNovo("P", target);
    return;
  }

  const textoBloco = (blocoAtual as HTMLElement).textContent || "";

  // CASO 1: Cursor no início
  if (startOffset === 0) {
    _criarBlocoAntes(blocoAtual as HTMLElement);
    return;
  }

  // CASO 2: Cursor no final
  if (startOffset >= textoBloco.length) {
    _criarBlocoDepois(blocoAtual as HTMLElement);
    return;
  }

  // CASO 3: Cursor no meio - dividir
  _dividirBloco(blocoAtual as HTMLElement, startOffset, sel);
}

function _criarBlocoNovo(tag: string, editor: HTMLElement): void {
  const novoBloco = document.createElement(tag);
  editor.appendChild(novoBloco);

  const novoRange = document.createRange();
  novoRange.setStart(novoBloco, 0);
  novoRange.collapse(true);

  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(novoRange);
}

function _criarBlocoAntes(blocoAtual: HTMLElement): void {
  const novoBloco = document.createElement(blocoAtual.tagName);
  blocoAtual.before(novoBloco);

  const novoRange = document.createRange();
  novoRange.setStart(novoBloco, 0);
  novoRange.collapse(true);

  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(novoRange);
}

function _criarBlocoDepois(blocoAtual: HTMLElement): void {
  const novoBloco = document.createElement(blocoAtual.tagName);
  blocoAtual.after(novoBloco);

  const novoRange = document.createRange();
  novoRange.setStart(novoBloco, 0);
  novoRange.collapse(true);

  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(novoRange);
}

function _dividirBloco(blocoAtual: HTMLElement, startOffset: number, sel: Selection): void {
  const textoBloco = blocoAtual.textContent || "";
  const textoAntes = textoBloco.substring(0, startOffset);
  const textoDepois = textoBloco.substring(startOffset);

  blocoAtual.textContent = textoAntes;

  const novoBloco = document.createElement(blocoAtual.tagName);
  novoBloco.textContent = textoDepois;
  blocoAtual.after(novoBloco);

  const novoRange = document.createRange();
  novoRange.setStart(novoBloco, 0);
  novoRange.collapse(true);

  sel.removeAllRanges();
  sel.addRange(novoRange);
}

/**
 * Remove handler de ENTER
 * @param editor - Elemento editor
 */
export function removeEnterHandler(editor: HTMLElement): void {
  editor.removeEventListener("keydown", handleEnter);
}

export default { setupEnterHandler, removeEnterHandler };
