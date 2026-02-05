/* ============================================================================
   NotasFormatadorUI.ts — Formatação de Texto (Bold, Italic, etc)
   Versão: 2.0.0 (TypeScript)
   ============================================================================ */

import { NotasSelecaoManager } from "../../../core/services/notas/NotasSelecaoManager.js";

export class NotasFormatadorUI {
  private editor: HTMLElement;
  private historicoManager: { salvar: (html: string) => void } | null;

  constructor(
    editor: HTMLElement,
    historicoManager: { salvar: (html: string) => void } | null,
  ) {
    this.editor = editor;
    this.historicoManager = historicoManager;
  }

  bold(): void {
    this.aplicarFormato("bold");
  }

  italic(): void {
    this.aplicarFormato("italic");
  }

  underline(): void {
    this.aplicarFormato("underline");
  }

  highlight(cor = "yellow"): void {
    this.aplicarFormato("backColor", cor);
  }

  private aplicarFormato(comando: string, valor: string | null = null): void {
    const selecaoSalva = NotasSelecaoManager.salvar(this.editor);
    if (!selecaoSalva) return;

    this.editor.focus();

    try {
      document.execCommand(comando, false, valor ?? undefined);
    } catch (e) {
      console.warn(`Erro ao aplicar formatação ${comando}:`, (e as Error).message);
      return;
    }

    try {
      NotasSelecaoManager.restaurar(selecaoSalva);
    } catch (e) {
      console.warn("Falha ao restaurar seleção após formatação");
    }

    if (this.historicoManager) {
      setTimeout(() => {
        this.historicoManager?.salvar(this.editor.innerHTML);
      }, 10);
    }
  }

  estaBold(): boolean {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;

    let node: Node | null = sel.anchorNode;
    while (node && node !== this.editor) {
      const el = node as HTMLElement;
      if (
        el.tagName === "B" ||
        el.tagName === "STRONG" ||
        el.style?.fontWeight === "bold"
      ) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }

  estaItalico(): boolean {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;

    let node: Node | null = sel.anchorNode;
    while (node && node !== this.editor) {
      const el = node as HTMLElement;
      if (
        el.tagName === "I" ||
        el.tagName === "EM" ||
        el.style?.fontStyle === "italic"
      ) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }

  estaUnderlined(): boolean {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;

    let node: Node | null = sel.anchorNode;
    while (node && node !== this.editor) {
      const el = node as HTMLElement;
      if (
        el.tagName === "U" ||
        el.tagName === "INS" ||
        el.style?.textDecoration === "underline"
      ) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }
}

export default NotasFormatadorUI;
