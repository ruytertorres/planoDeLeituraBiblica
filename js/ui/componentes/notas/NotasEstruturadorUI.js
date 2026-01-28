/* ============================================================================
   NotasEstruturadorUI.js — ESTRUTURA DE CONTEÚDO
============================================================================
   Responsabilidade: APENAS aplicar estrutura (headings, listas, limpeza)
   - Cabeçalhos (H2, H3)
   - Listas (UL, OL)
   - Limpar formatação
   
   NÃO faz: Formatação (bold, italic), histórico
   Camada: UI
============================================================================ */

import { NotasSelecaoManager } from "../../../core/services/notas/NotasSelecaoManager.js";

/**
 * Aplicar estrutura de conteúdo
 */
export class NotasEstruturadorUI {
  constructor(editor, historicoManager) {
    this.editor = editor;
    this.historicoManager = historicoManager;
  }

  /**
   * Toggler para H2
   * @public
   */
  toggleCabecalhoH2() {
    this.toggleBlockFormat("h2");
  }

  /**
   * Toggler para H3
   * @public
   */
  toggleCabecalhoH3() {
    this.toggleBlockFormat("h3");
  }

  /**
   * Toggler para lista (UL)
   * @public
   */
  toggleListaNaoOrdenada() {
    this.toggleBlockFormat("ul");
  }

  /**
   * Toggler para lista (OL)
   * @public
   */
  toggleListaOrdenada() {
    this.toggleBlockFormat("ol");
  }

  /**
   * Limpa toda formatação inline do bloco selecionado
   * Preserva estrutura (h2, ul, etc)
   * @public
   */
  limparFormatacaoInline() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    // Salva seleção
    const selecaoSalva = NotasSelecaoManager.salvar(this.editor);

    this.editor.focus();

    // Remove formatações inline
    document.execCommand("removeFormat", false, null);

    // Tenta restaurar
    try {
      NotasSelecaoManager.restaurar(selecaoSalva);
    } catch (e) {
      console.warn("Falha ao restaurar seleção");
    }

    // Salva no histórico
    if (this.historicoManager) {
      setTimeout(() => {
        this.historicoManager.salvar(this.editor.innerHTML);
      }, 10);
    }
  }

  /**
   * Limpa TODA formatação (inline + estrutura)
   * Retorna só texto limpo
   * @public
   */
  limparFormatacaoCompleta() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    let conteudo = range.toString(); // Apenas texto puro

    if (!conteudo) return;

    // Remove formatações inline
    document.execCommand("removeFormat", false, null);

    // Remove estrutura (block elements)
    this.removerEstrutura();

    // Tenta restaurar seleção básica
    try {
      this.editor.focus();
      const pos = NotasSelecaoManager.posicionarNoInicio(this.editor);
      if (pos) pos.focus();
    } catch (e) {
      console.warn("Falha ao posicionar cursor");
    }

    // Salva histórico
    if (this.historicoManager) {
      setTimeout(() => {
        this.historicoManager.salvar(this.editor.innerHTML);
      }, 10);
    }
  }

  /**
   * Toggler genérico para block elements
   * @private
   */
  toggleBlockFormat(formatTag) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    const bloco = this.encontrarBlocoComTag(
      range.commonAncestorContainer,
      formatTag,
    );

    this.editor.focus();

    if (bloco) {
      // Já tem tag, remove
      document.execCommand("formatBlock", false, `<div>`);
    } else {
      // Não tem, adiciona
      document.execCommand("formatBlock", false, `<${formatTag}>`);
    }

    // Salva
    if (this.historicoManager) {
      setTimeout(() => {
        this.historicoManager.salvar(this.editor.innerHTML);
      }, 10);
    }
  }

  /**
   * Encontra bloco (div, h2, h3, ul, ol) contendo o cursor
   * @private
   */
  encontrarBlocoComTag(node, tag) {
    let current = node;
    while (current && current !== this.editor) {
      if (current.tagName?.toLowerCase() === tag.toLowerCase()) {
        return current;
      }
      current = current.parentNode;
    }
    return null;
  }

  /**
   * Remove todas tags de estrutura (h2, h3, ul, ol)
   * Deixa conteúdo em divs
   * @private
   */
  removerEstrutura() {
    const tags = ["H2", "H3", "UL", "OL", "LI"];

    tags.forEach((tag) => {
      const elementos = this.editor.querySelectorAll(tag);
      elementos.forEach((el) => {
        // Substitui por div com conteúdo
        const div = document.createElement("div");
        div.innerHTML = el.innerHTML;

        // Se é LI, extrai só o texto
        if (tag === "LI") {
          el.replaceWith(document.createTextNode(el.textContent + "\n"));
        } else {
          el.replaceWith(div);
        }
      });
    });
  }

  /**
   * Verifica se bloco está em H2
   * @returns {boolean}
   * @public
   */
  estaH2() {
    return this.estaEmTag("H2");
  }

  /**
   * Verifica se bloco está em H3
   * @returns {boolean}
   * @public
   */
  estaH3() {
    return this.estaEmTag("H3");
  }

  /**
   * Verifica se bloco está em UL
   * @returns {boolean}
   * @public
   */
  estaEmListaNaoOrdenada() {
    return this.estaEmTag("UL");
  }

  /**
   * Verifica se bloco está em OL
   * @returns {boolean}
   * @public
   */
  estaEmListaOrdenada() {
    return this.estaEmTag("OL");
  }

  /**
   * Verifica se cursor está dentro de tag específica
   * @private
   */
  estaEmTag(tagName) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;

    let node = sel.anchorNode;
    while (node && node !== this.editor) {
      if (node.tagName?.toUpperCase() === tagName.toUpperCase()) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }
}
