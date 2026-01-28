/* ============================================================================
   NotasToolbarUI.js — ORQUESTRAÇÃO DA TOOLBAR
============================================================================
   Responsabilidade: APENAS eventos de botões e estado visual
   - Setup listeners nos botões
   - Atualizar estado visual (ativo/inativo)
   - Coordenar Formatador + Estruturador + Histórico
   
   Camada: UI
============================================================================ */

/**
 * Orquestrador da toolbar de notas
 * Coordena Formatador, Estruturador, Histórico
 */
export class NotasToolbarUI {
  constructor(toolbar, editor, formatador, estruturador, historicoManager) {
    this.toolbar = toolbar;
    this.editor = editor;
    this.formatador = formatador;
    this.estruturador = estruturador;
    this.historicoManager = historicoManager;

    this.botoes = {};
    this.setupBotoes();
    this.setupListeners();
  }

  /**
   * Cachea referências dos botões
   * @private
   */
  setupBotoes() {
    // Formatação
    this.botoes.bold = this.toolbar.querySelector("[data-cmd='bold']");
    this.botoes.italic = this.toolbar.querySelector("[data-cmd='italic']");
    this.botoes.underline = this.toolbar.querySelector(
      "[data-cmd='underline']",
    );
    this.botoes.highlight = this.toolbar.querySelector(
      "[data-cmd='highlight']",
    );

    // Estrutura
    this.botoes.h2 = this.toolbar.querySelector("[data-cmd='h2']");
    this.botoes.h3 = this.toolbar.querySelector("[data-cmd='h3']");
    this.botoes.ul = this.toolbar.querySelector("[data-cmd='ul']");
    this.botoes.ol = this.toolbar.querySelector("[data-cmd='ol']");

    // Histórico
    this.botoes.undo = this.toolbar.querySelector("[data-cmd='undo']");
    this.botoes.redo = this.toolbar.querySelector("[data-cmd='redo']");

    // Limpeza
    this.botoes.limparInline = this.toolbar.querySelector(
      "[data-cmd='limpar-inline']",
    );
    this.botoes.limparTudo = this.toolbar.querySelector(
      "[data-cmd='limpar-tudo']",
    );
  }

  /**
   * Associa listeners aos botões
   * @private
   */
  setupListeners() {
    // Formatação
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

    if (this.botoes.highlight) {
      this.botoes.highlight.addEventListener("click", (e) => {
        e.preventDefault();
        const cor = prompt("Cor (ex: yellow, #ffff00):", "yellow");
        if (cor) {
          this.formatador.highlight(cor);
        }
        this.atualizarEstadoBotoes();
      });
    }

    // Estrutura
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

    // Histórico
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

    // Limpeza
    if (this.botoes.limparInline) {
      this.botoes.limparInline.addEventListener("click", (e) => {
        e.preventDefault();
        this.estruturador.limparFormatacaoInline();
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

    // Atualizar estado ao selecionar texto
    this.editor.addEventListener("mouseup", () => this.atualizarEstadoBotoes());
    this.editor.addEventListener("keyup", () => this.atualizarEstadoBotoes());
  }

  /**
   * Atualiza estado visual dos botões (ativo/inativo)
   * @public
   */
  atualizarEstadoBotoes() {
    // Formatação
    this.atualizarEstadoBotao(this.botoes.bold, this.formatador.estaBold());
    this.atualizarEstadoBotao(
      this.botoes.italic,
      this.formatador.estaItalico(),
    );
    this.atualizarEstadoBotao(
      this.botoes.underline,
      this.formatador.estaUnderlined(),
    );

    // Estrutura
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

    // Histórico (habilita/desabilita)
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

  /**
   * Atualiza classe visual de um botão
   * @private
   */
  atualizarEstadoBotao(botao, ativo) {
    if (!botao) return;

    if (ativo) {
      botao.classList.add("ativo");
    } else {
      botao.classList.remove("ativo");
    }
  }

  /**
   * Desfaz última ação
   * @private
   */
  desfazer() {
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

  /**
   * Refaz última ação desfeita
   * @private
   */
  refazer() {
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

  /**
   * Habilita/desabilita toda a toolbar
   * @param {boolean} habilitado
   * @public
   */
  habilitarToolbar(habilitado) {
    const botoes = this.toolbar.querySelectorAll("button");
    botoes.forEach((botao) => {
      botao.disabled = !habilitado;
    });
  }
}
