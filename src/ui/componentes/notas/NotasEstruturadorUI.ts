/* ============================================================================
   NotasEstruturadorUI.ts — Estrutura de Conteúdo (Headings, Listas)
   Versão: 2.0.0 (TypeScript)
   ============================================================================ */

import { NotasSelecaoManager } from "../../../core/services/notas/NotasSelecaoManager.js";

export class NotasEstruturadorUI {
  private editor: HTMLElement;
  private historicoManager: { salvar: (html: string) => void } | null;

  constructor(
    editor: HTMLElement,
    historicoManager: { salvar: (html: string) => void } | null,
  ) {
    this.editor = editor;
    this.historicoManager = historicoManager;
  }

  toggleCabecalhoH2(): void {
    this.toggleBlockFormat("h2");
  }

  toggleCabecalhoH3(): void {
    this.toggleBlockFormat("h3");
  }

  toggleListaNaoOrdenada(): void {
    this.editor.focus();
    document.execCommand("insertUnorderedList", false, undefined);
    this.salvarHistorico();
  }

  toggleListaOrdenada(): void {
    this.editor.focus();
    document.execCommand("insertOrderedList", false, undefined);
    this.salvarHistorico();
  }

  limparFormatacaoInline(): void {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const selecaoSalva = NotasSelecaoManager.salvar(this.editor);
    this.editor.focus();
    document.execCommand("removeFormat", false, undefined);

    try {
      if (selecaoSalva) NotasSelecaoManager.restaurar(selecaoSalva);
    } catch (e) {
      console.warn("Falha ao restaurar seleção");
    }

    this.salvarHistorico();
  }

  limparFormatacaoCompleta(): void {
    this.editor.focus();
    document.execCommand("removeFormat", false, undefined);
    document.execCommand("removeFormat", false, undefined);
    this.removerEstrutura();
    this.salvarHistorico();
  }

  private toggleBlockFormat(formatTag: string): void {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    const bloco = this.encontrarBlocoComTag(
      range.commonAncestorContainer,
      formatTag,
    );

    this.editor.focus();

    if (bloco) {
      document.execCommand("formatBlock", false, "<div>");
    } else {
      document.execCommand("formatBlock", false, `<${formatTag}>`);
    }

    this.salvarHistorico();
  }

  private encontrarBlocoComTag(node: Node, tag: string): HTMLElement | null {
    let current: Node | null = node;
    while (current && current !== this.editor) {
      if (
        (current as HTMLElement).tagName?.toLowerCase() === tag.toLowerCase()
      ) {
        return current as HTMLElement;
      }
      current = current.parentNode;
    }
    return null;
  }

  private removerEstrutura(): void {
    const tagsDeLista = ["UL", "OL"];
    const tagsDeCabecalho = ["H1", "H2", "H3", "H4", "H5", "H6"];

    this.editor.focus();

    // Remover listas
    tagsDeLista.forEach((listTag) => {
      const listas = Array.from(this.editor.querySelectorAll(listTag));
      listas.forEach((lista) => {
        const itensDeLista = Array.from(lista.querySelectorAll("LI"));
        itensDeLista.forEach((item) => {
          const p = document.createElement("p");
          p.innerHTML = item.innerHTML;
          lista.parentNode?.insertBefore(p, lista);
        });
        lista.remove();
      });
    });

    // Converter blocos para <p>
    let currentNode: Node | null = this.editor.firstChild;
    while (currentNode) {
      if (
        currentNode.nodeType === Node.TEXT_NODE &&
        currentNode.textContent?.trim() === ""
      ) {
        currentNode = currentNode.nextSibling;
        continue;
      }

      const nextNode = currentNode.nextSibling;
      if (currentNode.nodeType === Node.ELEMENT_NODE) {
        const tagName = (currentNode as HTMLElement).tagName.toUpperCase();
        if (tagName !== "P" || (currentNode as HTMLElement).style.cssText) {
          const p = document.createElement("p");
          p.innerHTML = (currentNode as HTMLElement).innerHTML;
          (currentNode as Element).replaceWith(p);
        }
      }
      currentNode = nextNode;
    }

    // Remover cabeçalhos residuais
    tagsDeCabecalho.forEach((tag) => {
      const elementos = Array.from(this.editor.querySelectorAll(tag));
      elementos.forEach((el) => {
        const p = document.createElement("p");
        p.innerHTML = el.innerHTML;
        el.replaceWith(p);
      });
    });

    // Limpar divs vazias
    const emptyDivs = Array.from(this.editor.querySelectorAll("div:empty"));
    emptyDivs.forEach((div) => div.remove());
  }

  private salvarHistorico(): void {
    if (this.historicoManager) {
      setTimeout(() => {
        this.historicoManager?.salvar(this.editor.innerHTML);
      }, 10);
    }
  }

  estaH2(): boolean {
    return this.estaEmTag("H2");
  }

  estaH3(): boolean {
    return this.estaEmTag("H3");
  }

  estaEmListaNaoOrdenada(): boolean {
    return this.estaEmTag("UL");
  }

  estaEmListaOrdenada(): boolean {
    return this.estaEmTag("OL");
  }

  private estaEmTag(tagName: string): boolean {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;

    let node: Node | null = sel.anchorNode;
    while (node && node !== this.editor) {
      if (
        (node as HTMLElement).tagName?.toUpperCase() === tagName.toUpperCase()
      ) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }
}

export default NotasEstruturadorUI;
