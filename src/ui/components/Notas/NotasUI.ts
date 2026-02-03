/* ============================================================================
   NotasUI.ts — Interface de Notas em TypeScript
   Versão: 1.0.0
   ============================================================================

   RESPONSABILIDADE:
   - Gerenciar overlay de notas
   - Toolbar de formatação
   - Atalhos de teclado
   - Eventos de UI

   CONFORMIDADE COM CONTRATO_DO_SISTEMA.MD:
   - §10: UI é reflexo
   - Sem lógica de estado (delegada ao orquestrador)
   ============================================================================ */

// ============================================================================
// TIPOS
// ============================================================================

interface NotasOverlayOrquestrador {
  alternar: () => void;
  fechar: () => void;
  limparNotas: () => void;
  exportarNotas: () => void;
  salvarConteudo: (conteudo: string) => void;
  isAberto: () => boolean;
}

interface NotasUIConfig {
  orquestrador: NotasOverlayOrquestrador;
}

// ============================================================================
// COMPONENTE
// ============================================================================

export class NotasUI {
  private orquestrador: NotasOverlayOrquestrador;
  private elementos: {
    botaoAbrir: HTMLElement | null;
    overlay: HTMLElement | null;
    editor: HTMLElement | null;
    btnFechar: HTMLElement | null;
    btnLimpar: HTMLElement | null;
    btnExportar: HTMLElement | null;
  };
  private eventListeners: Array<{ element: Element | Document; type: string; handler: EventListener }> = [];
  private highlightButtons: Map<string, Element> = new Map();
  private actionButtons: Map<string, Element> = new Map();

  constructor(config: NotasUIConfig) {
    this.orquestrador = config.orquestrador;
    this.elementos = {
      botaoAbrir: null,
      overlay: null,
      editor: null,
      btnFechar: null,
      btnLimpar: null,
      btnExportar: null,
    };
    this._init();
  }

  /**
   * Inicialização
   */
  private _init(): void {
    this._cachearElementos();
    if (!this._validarElementos()) {
      console.warn("Bloco de notas não encontrado no DOM.");
      return;
    }
    this._configurarToolbar();
    this._configurarEventos();
    this._configurarListenersOrquestrador();
  }

  /**
   * Cache de elementos DOM
   */
  private _cachearElementos(): void {
    this.elementos = {
      botaoAbrir: document.getElementById("btn-notas"),
      overlay: document.getElementById("notas-overlay"),
      editor: document.getElementById("notas-editor"),
      btnFechar: document.getElementById("btn-fechar"),
      btnLimpar: document.getElementById("btn-limpar"),
      btnExportar: document.getElementById("btn-exportar"),
    };
  }

  /**
   * Valida se elementos essenciais existem
   */
  private _validarElementos(): boolean {
    return !!(this.elementos.botaoAbrir && this.elementos.overlay && this.elementos.editor);
  }

  /**
   * Configura toolbar de formatação
   */
  private _configurarToolbar(): void {
    const toolbar = document.querySelector(".notas-toolbar");
    if (toolbar && this.elementos.editor) {
      // Inicializar toolbar (simplificado - pode ser expandido)
      this._initToolbar(this.elementos.editor, toolbar);
    }
  }

  /**
   * Inicializa toolbar (implementação básica)
   */
  private _initToolbar(editor: HTMLElement, toolbar: Element): void {
    const buttons = toolbar.querySelectorAll("[data-nota-action]");
    buttons.forEach((btn) => {
      const action = btn.getAttribute("data-nota-action");
      const value = btn.getAttribute("data-value");
      
      const handler = () => {
        this._executarFormatacao(action || "", value || "");
      };
      
      btn.addEventListener("click", handler);
      this.eventListeners.push({ element: btn, type: "click", handler });
      
      // Guardar referência para atalhos de teclado
      if (action) {
        this.actionButtons.set(action, btn);
        if (action === "highlight" && value) {
          this.highlightButtons.set(value, btn);
        }
      }
    });
  }

  /**
   * Executa formatação no editor
   */
  private _executarFormatacao(action: string, value: string): void {
    if (!this.elementos.editor) return;
    
    document.execCommand(action, false, value || undefined);
    this.elementos.editor.focus();
    
    // Disparar evento de input para salvar
    this.elementos.editor.dispatchEvent(new Event("input"));
  }

  /**
   * Configura eventos de UI
   */
  private _configurarEventos(): void {
    const { botaoAbrir, btnFechar, btnLimpar, btnExportar, editor } = this.elementos;

    // Botão abrir
    if (botaoAbrir) {
      const handler = () => this.orquestrador.alternar();
      botaoAbrir.addEventListener("click", handler);
      this.eventListeners.push({ element: botaoAbrir, type: "click", handler });
    }

    // Botão fechar
    if (btnFechar) {
      const handler = () => this.orquestrador.fechar();
      btnFechar.addEventListener("click", handler);
      this.eventListeners.push({ element: btnFechar, type: "click", handler });
    }

    // Botão limpar
    if (btnLimpar) {
      const handler = () => {
        const confirmar = confirm("Deseja apagar todas as anotações?");
        if (confirmar) {
          this.orquestrador.limparNotas();
        }
      };
      btnLimpar.addEventListener("click", handler);
      this.eventListeners.push({ element: btnLimpar, type: "click", handler });
    }

    // Botão exportar
    if (btnExportar) {
      const handler = () => this.orquestrador.exportarNotas();
      btnExportar.addEventListener("click", handler);
      this.eventListeners.push({ element: btnExportar, type: "click", handler });
    }

    // Teclado global
    const keydownGlobalHandler = (e: Event) => {
      const keyboardEvent = e as KeyboardEvent;
      
      // ESC fecha overlay
      if (keyboardEvent.key === "Escape" && this.orquestrador.isAberto()) {
        e.preventDefault();
        this.orquestrador.fechar();
        return;
      }

      // Ctrl+Alt+N alterna overlay
      if (keyboardEvent.ctrlKey && keyboardEvent.altKey && keyboardEvent.key.toLowerCase() === "n") {
        e.preventDefault();
        this.orquestrador.alternar();
        return;
      }

      // Ctrl+E exporta notas (quando aberto)
      if (keyboardEvent.ctrlKey && keyboardEvent.key.toLowerCase() === "e" && this.orquestrador.isAberto()) {
        e.preventDefault();
        this.orquestrador.exportarNotas();
        return;
      }
    };
    document.addEventListener("keydown", keydownGlobalHandler);
    this.eventListeners.push({ element: document, type: "keydown", handler: keydownGlobalHandler });

    // Teclado do editor - atalhos de formatação
    if (editor) {
      const keydownEditorHandler = (e: Event) => {
        const keyboardEvent = e as KeyboardEvent;
        if (!keyboardEvent.ctrlKey && !keyboardEvent.metaKey) return;

        switch (keyboardEvent.key.toLowerCase()) {
          case "b": // Negrito
            e.preventDefault();
            this.actionButtons.get("bold")?.dispatchEvent(new Event("click"));
            break;
          case "i": // Itálico
            e.preventDefault();
            this.actionButtons.get("italic")?.dispatchEvent(new Event("click"));
            break;
          case "u": // Sublinhado
            e.preventDefault();
            this.actionButtons.get("underline")?.dispatchEvent(new Event("click"));
            break;
          case "2": // Cabeçalho 2
            e.preventDefault();
            this.actionButtons.get("h2")?.dispatchEvent(new Event("click"));
            break;
          case "3": // Cabeçalho 3
            e.preventDefault();
            this.actionButtons.get("h3")?.dispatchEvent(new Event("click"));
            break;
          case "l": // Lista
            e.preventDefault();
            this.actionButtons.get("ul")?.dispatchEvent(new Event("click"));
            break;
          case " ": // Limpar formatação
            e.preventDefault();
            this.actionButtons.get("clear")?.dispatchEvent(new Event("click"));
            break;
        }
      };
      editor.addEventListener("keydown", keydownEditorHandler);
      this.eventListeners.push({ element: editor, type: "keydown", handler: keydownEditorHandler });

      // Atalhos de marcador (Alt)
      const keydownAltHandler = (e: Event) => {
        const keyboardEvent = e as KeyboardEvent;
        if (!keyboardEvent.altKey) return;

        switch (keyboardEvent.key) {
          case "1": // Amarelo
            e.preventDefault();
            this.highlightButtons.get("yellow")?.dispatchEvent(new Event("click"));
            break;
          case "2": // Verde
            e.preventDefault();
            this.highlightButtons.get("#a8e6cf")?.dispatchEvent(new Event("click"));
            break;
          case "3": // Laranja
            e.preventDefault();
            this.highlightButtons.get("#ffd3b6")?.dispatchEvent(new Event("click"));
            break;
        }
      };
      editor.addEventListener("keydown", keydownAltHandler);
      this.eventListeners.push({ element: editor, type: "keydown", handler: keydownAltHandler });

      // Persistência
      const inputHandler = () => {
        this.orquestrador.salvarConteudo(editor.innerHTML);
      };
      editor.addEventListener("input", inputHandler);
      this.eventListeners.push({ element: editor, type: "input", handler: inputHandler });
    }
  }

  /**
   * Configura listeners de eventos do orquestrador
   */
  private _configurarListenersOrquestrador(): void {
    const { overlay, editor } = this.elementos;
    if (!overlay || !editor) return;

    // Overlay aberto
    const abertasHandler = () => {
      overlay.classList.remove("hidden");
      setTimeout(() => {
        overlay.classList.add("aberto");
        editor.focus();
      }, 10);
    };
    document.addEventListener("notas-abertas", abertasHandler);
    this.eventListeners.push({ element: document, type: "notas-abertas", handler: abertasHandler });

    // Overlay fechado
    const fechadasHandler = () => {
      overlay.classList.remove("aberto");
      setTimeout(() => {
        overlay.classList.add("hidden");
      }, 300);
    };
    document.addEventListener("notas-fechadas", fechadasHandler);
    this.eventListeners.push({ element: document, type: "notas-fechadas", handler: fechadasHandler });

    // Notas carregadas
    const carregadasHandler = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { conteudo } = customEvent.detail;
      editor.innerHTML = conteudo && conteudo.trim() ? conteudo : "<p></p>";
    };
    document.addEventListener("notas-carregadas", carregadasHandler);
    this.eventListeners.push({ element: document, type: "notas-carregadas", handler: carregadasHandler });

    // Notas limpas
    const limpasHandler = () => {
      editor.innerHTML = "<p></p>";
      editor.focus();
    };
    document.addEventListener("notas-limpas", limpasHandler);
    this.eventListeners.push({ element: document, type: "notas-limpas", handler: limpasHandler });

    // Exportar vazio
    const exportarVazioHandler = (e: Event) => {
      const customEvent = e as CustomEvent;
      alert(customEvent.detail?.mensagem || "Não há anotações para exportar.");
    };
    document.addEventListener("notas-exportar-vazio", exportarVazioHandler);
    this.eventListeners.push({ element: document, type: "notas-exportar-vazio", handler: exportarVazioHandler });

    // Pronto para exportar
    const prontoExportarHandler = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { conteudo, diaAtual } = customEvent.detail;
      this._downloadNotasHTML(conteudo, diaAtual);
      alert(`Anotações do dia ${diaAtual} exportadas com sucesso!`);
    };
    document.addEventListener("notas-pronta-exportar", prontoExportarHandler);
    this.eventListeners.push({ element: document, type: "notas-pronta-exportar", handler: prontoExportarHandler });
  }

  /**
   * Download de notas em HTML
   */
  private _downloadNotasHTML(conteudo: string, diaAtual: number): void {
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Anotações - Dia ${diaAtual}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
        h2, h3 { color: #333; }
        .highlight-yellow { background-color: yellow; }
        .highlight-green { background-color: #a8e6cf; }
        .highlight-orange { background-color: #ffd3b6; }
    </style>
</head>
<body>
    <h1>Anotações - Dia ${diaAtual}</h1>
    <div>${conteudo}</div>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `anotacoes-dia-${diaAtual}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Remove todos os event listeners
   */
  public destroy(): void {
    this.eventListeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });
    this.eventListeners = [];
    this.actionButtons.clear();
    this.highlightButtons.clear();
  }
}

// Função de fábrica para compatibilidade
export function initNotasOverlayUI(orquestrador: NotasOverlayOrquestrador): NotasUI | null {
  try {
    return new NotasUI({ orquestrador });
  } catch (error) {
    console.warn("Erro ao inicializar NotasUI:", error);
    return null;
  }
}
