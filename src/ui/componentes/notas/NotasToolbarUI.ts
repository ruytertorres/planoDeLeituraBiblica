/* ============================================================================
   NotasToolbarUI.ts — Orquestração da Toolbar de Notas
   Versão: 2.0.0 (TypeScript)
   ============================================================================ */

import { NotasFormatadorUI } from "./NotasFormatadorUI.js";
import { NotasEstruturadorUI } from "./NotasEstruturadorUI.js";
import type { NotasHistoricoManager } from "../../../core/services/notas/NotasHistoricoManager.js";

interface Botoes {
  bold?: HTMLElement | null;
  italic?: HTMLElement | null;
  underline?: HTMLElement | null;
  highlightBtn?: HTMLElement | null;
  highlightDropdown?: HTMLElement | null;
  highlightColors?: NodeListOf<HTMLElement>;
  h2?: HTMLElement | null;
  h3?: HTMLElement | null;
  ul?: HTMLElement | null;
  ol?: HTMLElement | null;
  undo?: HTMLElement | null;
  redo?: HTMLElement | null;
  limparInline?: HTMLElement | null;
  limparTudo?: HTMLElement | null;
}

export class NotasToolbarUI {
  private toolbar: HTMLElement;
  private editor: HTMLElement;
  private formatador: NotasFormatadorUI;
  private estruturador: NotasEstruturadorUI;
  private historicoManager: NotasHistoricoManager | null;
  private botoes: Botoes = {};

  constructor(
    toolbar: HTMLElement,
    editor: HTMLElement,
    formatador: NotasFormatadorUI,
    estruturador: NotasEstruturadorUI,
    historicoManager: NotasHistoricoManager | null,
  ) {
    this.toolbar = toolbar;
    this.editor = editor;
    this.formatador = formatador;
    this.estruturador = estruturador;
    this.historicoManager = historicoManager;

    this.setupBotoes();
    this.setupListeners();
  }

  private setupBotoes(): void {
    this.botoes.bold = this.toolbar.querySelector("[data-cmd='bold']");
    this.botoes.italic = this.toolbar.querySelector("[data-cmd='italic']");
    this.botoes.underline = this.toolbar.querySelector(
      "[data-cmd='underline']",
    );
    this.botoes.highlightBtn = this.toolbar.querySelector(
      "[data-cmd='highlight']",
    );
    this.botoes.highlightDropdown =
      this.toolbar.querySelector(".highlight-options");
    this.botoes.highlightColors = this.toolbar.querySelectorAll(
      "[data-cmd='highlight-color']",
    );

    this.botoes.h2 = this.toolbar.querySelector("[data-cmd='h2']");
    this.botoes.h3 = this.toolbar.querySelector("[data-cmd='h3']");
    this.botoes.ul = this.toolbar.querySelector("[data-cmd='ul']");
    this.botoes.ol = this.toolbar.querySelector("[data-cmd='ol']");

    this.botoes.undo = this.toolbar.querySelector("[data-cmd='undo']");
    this.botoes.redo = this.toolbar.querySelector("[data-cmd='redo']");

    this.botoes.limparInline = this.toolbar.querySelector(
      "[data-cmd='limpar-inline']",
    );
    this.botoes.limparTudo = this.toolbar.querySelector(
      "[data-cmd='limpar-tudo']",
    );
  }

  private setupListeners(): void {
    if (this.botoes.bold) {
      this.botoes.bold.addEventListener("click", (e) => {
        e.preventDefault();
        this.formatador.bold();
        this.atualizarEstadoBotoes();
      });
    }

    if (this.botoes.italic) {
      this.botoes.italic.addEventListener("click", (e) => {
        e.preventDefault();
        this.formatador.italic();
        this.atualizarEstadoBotoes();
      });
    }

    if (this.botoes.underline) {
      this.botoes.underline.addEventListener("click", (e) => {
        e.preventDefault();
        this.formatador.underline();
        this.atualizarEstadoBotoes();
      });
    }

    if (this.botoes.highlightBtn) {
      this.botoes.highlightBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.botoes.highlightDropdown?.classList.toggle("active");
        this.atualizarEstadoBotoes();
      });
    }

    if (this.botoes.highlightColors) {
      this.botoes.highlightColors.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const cor = (btn as HTMLElement).dataset.cor;
          this.formatador.highlight(cor);
          this.botoes.highlightDropdown?.classList.remove("active");
          this.atualizarEstadoBotoes();
        });
      });
    }

    document.addEventListener("click", (e) => {
      const highlightDropdownParent = this.toolbar.querySelector(
        ".highlight-dropdown",
      );
      if (
        highlightDropdownParent &&
        !highlightDropdownParent.contains(e.target as Node)
      ) {
        this.botoes.highlightDropdown?.classList.remove("active");
      }
    });

    if (this.botoes.h2) {
      this.botoes.h2.addEventListener("click", (e) => {
        e.preventDefault();
        this.estruturador.toggleCabecalhoH2();
        this.atualizarEstadoBotoes();
      });
    }

    if (this.botoes.h3) {
      this.botoes.h3.addEventListener("click", (e) => {
        e.preventDefault();
        this.estruturador.toggleCabecalhoH3();
        this.atualizarEstadoBotoes();
      });
    }

    if (this.botoes.ul) {
      this.botoes.ul.addEventListener("click", (e) => {
        e.preventDefault();
        this.estruturador.toggleListaNaoOrdenada();
        this.atualizarEstadoBotoes();
      });
    }

    if (this.botoes.ol) {
      this.botoes.ol.addEventListener("click", (e) => {
        e.preventDefault();
        this.estruturador.toggleListaOrdenada();
        this.atualizarEstadoBotoes();
      });
    }

    if (this.botoes.undo) {
      this.botoes.undo.addEventListener("click", (e) => {
        e.preventDefault();
        this.desfazer();
        this.atualizarEstadoBotoes();
      });
    }

    if (this.botoes.redo) {
      this.botoes.redo.addEventListener("click", (e) => {
        e.preventDefault();
        this.refazer();
        this.atualizarEstadoBotoes();
      });
    }

    if (this.botoes.limparInline) {
      this.botoes.limparInline.addEventListener("click", (e) => {
        e.preventDefault();
        this.estruturador.limparFormatacaoCompleta();
        this.atualizarEstadoBotoes();
      });
    }

    if (this.botoes.limparTudo) {
      this.botoes.limparTudo.addEventListener("click", (e) => {
        e.preventDefault();
        if (
          confirm("Tem certeza? Vai remover toda a formatação e estrutura.")
        ) {
          this.estruturador.limparFormatacaoCompleta();
          this.atualizarEstadoBotoes();
        }
      });
    }

    this.editor.addEventListener("mouseup", () => this.atualizarEstadoBotoes());
    this.editor.addEventListener("keyup", () => this.atualizarEstadoBotoes());
  }

  atualizarEstadoBotoes(): void {
    this.atualizarEstadoBotao(this.botoes.bold, this.formatador.estaBold());
    this.atualizarEstadoBotao(
      this.botoes.italic,
      this.formatador.estaItalico(),
    );
    this.atualizarEstadoBotao(
      this.botoes.underline,
      this.formatador.estaUnderlined(),
    );

    this.atualizarEstadoBotao(this.botoes.h2, this.estruturador.estaH2());
    this.atualizarEstadoBotao(this.botoes.h3, this.estruturador.estaH3());
    this.atualizarEstadoBotao(
      this.botoes.ul,
      this.estruturador.estaEmListaNaoOrdenada(),
    );
    this.atualizarEstadoBotao(
      this.botoes.ol,
      this.estruturador.estaEmListaOrdenada(),
    );

    if (this.historicoManager) {
      this.atualizarEstadoBotao(
        this.botoes.undo,
        this.historicoManager.podeUndo(),
      );
      this.atualizarEstadoBotao(
        this.botoes.redo,
        this.historicoManager.podeRedo(),
      );
    }
  }

  private atualizarEstadoBotao(
    botao: HTMLElement | null | undefined,
    ativo: boolean,
  ): void {
    if (!botao) return;

    if (ativo) {
      botao.classList.add("ativo");
    } else {
      botao.classList.remove("ativo");
    }
  }

  private desfazer(): void {
    if (!this.historicoManager) return;

    if (!this.historicoManager.podeUndo()) {
      console.warn("Nada para desfazer");
      return;
    }

    const estado = this.historicoManager.undo();
    if (estado !== null) {
      this.editor.innerHTML = estado;
    }
  }

  private refazer(): void {
    if (!this.historicoManager) return;

    if (!this.historicoManager.podeRedo()) {
      console.warn("Nada para refazer");
      return;
    }

    const estado = this.historicoManager.redo();
    if (estado !== null) {
      this.editor.innerHTML = estado;
    }
  }

  habilitarToolbar(habilitado: boolean): void {
    const botoes = this.toolbar.querySelectorAll("button");
    botoes.forEach((botao) => {
      (botao as HTMLButtonElement).disabled = !habilitado;
    });
  }
}

export default NotasToolbarUI;
