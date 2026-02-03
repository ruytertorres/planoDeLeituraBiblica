/* ============================================================================
   SearchUI.ts — Interface de Busca em TypeScript
   Versão: 1.0.0
   ============================================================================

   RESPONSABILIDADE:
   - Gerenciar interface de busca de dias/capítulos
   - Mostrar resultados em tempo real
   - Navegar para dia selecionado
   - Integrar com SearchEngine

   CONFORMIDADE COM CONTRATO_DO_SISTEMA.MD:
   - §10: UI é reflexo do estado
   - Sem lógica de busca (apenas interface)
   ============================================================================ */

// ============================================================================
// TIPOS
// ============================================================================

interface ResultadoBusca {
  dia: number;
  title: string;
  subtitle: string;
  type: "dia" | "capitulo" | "cap_range" | "livro";
}

interface SearchEngine {
  buscar: (termo: string) => ResultadoBusca[];
}

type OnSelecionarDiaCallback = (diaNumero: number) => void;

// ============================================================================
// COMPONENTE
// ============================================================================

export class SearchUI {
  private searchEngine: SearchEngine;
  private onSelecionarDia: OnSelecionarDiaCallback;
  private resultsContainer: HTMLElement | null = null;
  private searchInput: HTMLInputElement | null = null;
  private isOpen: boolean = false;
  private eventListeners: Array<{ element: Element | Document; type: string; handler: EventListener }> = [];

  constructor(searchEngine: SearchEngine, onSelecionarDiaCallback: OnSelecionarDiaCallback) {
    this.searchEngine = searchEngine;
    this.onSelecionarDia = onSelecionarDiaCallback;
    this._init();
  }

  /**
   * Inicialização do componente
   */
  private _init(): void {
    this._criarDOM();
    this._configurarEventos();
  }

  /**
   * Cria elementos do DOM
   */
  private _criarDOM(): void {
    // Container principal
    const searchContainer = document.createElement("div");
    searchContainer.className = "search-container";

    // Caixa de busca
    const searchBox = document.createElement("div");
    searchBox.className = "search-box";

    // Ícone de busca
    const searchIcon = document.createElement("i");
    searchIcon.className = "fas fa-search search-icon";

    // Input de busca
    this.searchInput = document.createElement("input");
    this.searchInput.type = "text";
    this.searchInput.id = "search-input";
    this.searchInput.className = "search-input";
    this.searchInput.placeholder = 'Buscar dia ou capítulo (ex: "Dia 15" ou "Gênesis 1")';
    this.searchInput.setAttribute("aria-label", "Buscar no plano de leitura");

    // Botão limpar
    const clearBtn = document.createElement("button");
    clearBtn.id = "search-clear";
    clearBtn.className = "search-clear";
    clearBtn.title = "Limpar busca";
    clearBtn.innerHTML = '<i class="fas fa-times"></i>';

    // Container de resultados
    this.resultsContainer = document.createElement("div");
    this.resultsContainer.id = "search-results";
    this.resultsContainer.className = "search-results hidden";

    // Montar estrutura
    searchBox.appendChild(searchIcon);
    searchBox.appendChild(this.searchInput);
    searchBox.appendChild(clearBtn);

    searchContainer.appendChild(searchBox);
    searchContainer.appendChild(this.resultsContainer);

    // Inserir na navbar (após o título)
    const navbarContainer = document.querySelector(".navbar-container");
    if (navbarContainer) {
      const navbarStats = navbarContainer.querySelector(".navbar-stats");
      if (navbarStats) {
        navbarContainer.insertBefore(searchContainer, navbarStats);
      } else {
        navbarContainer.appendChild(searchContainer);
      }
    }
  }

  /**
   * Configura eventos do componente
   */
  private _configurarEventos(): void {
    if (!this.searchInput) return;

    // Input de busca
    const inputHandler = (e: Event) => {
      const target = e.target as HTMLInputElement;
      this._onSearchInput(target.value);
    };
    this.searchInput.addEventListener("input", inputHandler);
    this.eventListeners.push({ element: this.searchInput, type: "input", handler: inputHandler });

    // Foco no input
    const focusHandler = () => {
      this._showResults();
    };
    this.searchInput.addEventListener("focus", focusHandler);
    this.eventListeners.push({ element: this.searchInput, type: "focus", handler: focusHandler });

    // Clique fora para fechar
    const clickOutsideHandler = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".search-container")) {
        this._hideResults();
      }
    };
    document.addEventListener("click", clickOutsideHandler);
    this.eventListeners.push({ element: document, type: "click", handler: clickOutsideHandler });

    // Tecla Escape para fechar
    const keydownHandler = (e: Event) => {
      const keyboardEvent = e as KeyboardEvent;
      
      if (keyboardEvent.key === "Escape" && this.isOpen) {
        this._hideResults();
        this.searchInput?.blur();
      }

      // Tecla Enter para selecionar primeiro resultado
      if (keyboardEvent.key === "Enter" && this.isOpen && this.searchInput?.value.trim()) {
        const firstResult = this.resultsContainer?.querySelector(".search-result-item");
        if (firstResult) {
          (firstResult as HTMLElement).click();
        }
      }
    };
    document.addEventListener("keydown", keydownHandler);
    this.eventListeners.push({ element: document, type: "keydown", handler: keydownHandler });

    // Botão limpar
    const clearBtn = document.getElementById("search-clear");
    if (clearBtn) {
      const clearHandler = () => {
        if (this.searchInput) {
          this.searchInput.value = "";
          this._hideResults();
          this.searchInput.focus();
        }
      };
      clearBtn.addEventListener("click", clearHandler);
      this.eventListeners.push({ element: clearBtn, type: "click", handler: clearHandler });
    }
  }

  /**
   * Manipula input de busca
   */
  private _onSearchInput(termo: string): void {
    const trimmed = termo.trim();

    if (trimmed.length < 2) {
      this._hideResults();
      return;
    }

    const resultados = this.searchEngine.buscar(termo);
    this._renderResults(resultados);
    this._showResults();
  }

  /**
   * Renderiza resultados da busca
   */
  private _renderResults(resultados: ResultadoBusca[]): void {
    if (!this.resultsContainer || !this.searchInput) return;

    if (resultados.length === 0) {
      this.resultsContainer.innerHTML = `
        <div class="no-results">
          Nenhum resultado encontrado para "${this.searchInput.value}"
        </div>
      `;
      return;
    }

    const resultadosHTML = resultados
      .map((result, index) => {
        const isFirst = index === 0;
        return `
        <div class="search-result-item ${isFirst ? "selected" : ""}" 
             data-dia="${result.dia}"
             data-type="${result.type}">
          <div>
            <strong>${result.title}</strong>
            <span class="result-type">${this._getTypeLabel(result.type)}</span>
          </div>
          <div class="result-details">${result.subtitle}</div>
        </div>
      `;
      })
      .join("");

    this.resultsContainer.innerHTML = resultadosHTML;

    // Adicionar eventos aos resultados
    this.resultsContainer.querySelectorAll(".search-result-item").forEach((item) => {
      const clickHandler = () => {
        const diaNumero = parseInt((item as HTMLElement).dataset.dia || "0");
        this._selecionarResultado(diaNumero);
      };
      item.addEventListener("click", clickHandler);

      const mouseEnterHandler = () => {
        this.resultsContainer?.querySelectorAll(".search-result-item").forEach((r) => {
          r.classList.remove("selected");
        });
        item.classList.add("selected");
      };
      item.addEventListener("mouseenter", mouseEnterHandler);
    });
  }

  /**
   * Obtém rótulo do tipo de resultado
   */
  private _getTypeLabel(type: ResultadoBusca["type"]): string {
    const labels: Record<string, string> = {
      dia: "Dia",
      capitulo: "Capítulo",
      cap_range: "Capítulos",
      livro: "Livro",
    };
    return labels[type] || "Resultado";
  }

  /**
   * Seleciona um resultado
   */
  private _selecionarResultado(diaNumero: number): void {
    this.onSelecionarDia(diaNumero);
  }

  /**
   * Mostra resultados
   */
  private _showResults(): void {
    if (this.resultsContainer) {
      this.resultsContainer.classList.remove("hidden");
      this.resultsContainer.classList.add("active");
      this.isOpen = true;
    }
  }

  /**
   * Esconde resultados
   */
  private _hideResults(): void {
    if (this.resultsContainer) {
      this.resultsContainer.classList.remove("active");
      this.resultsContainer.classList.add("hidden");
      this.isOpen = false;
    }
  }

  /**
   * Foco no input (método público)
   */
  public focus(): void {
    this.searchInput?.focus();
  }

  /**
   * Limpa busca (método público)
   */
  public clear(): void {
    if (this.searchInput) {
      this.searchInput.value = "";
      this._hideResults();
    }
  }

  /**
   * Remove todos os event listeners e limpa o componente
   */
  public destroy(): void {
    this.eventListeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });
    this.eventListeners = [];
    
    // Remover elementos do DOM
    const searchContainer = document.querySelector(".search-container");
    if (searchContainer && searchContainer.parentNode) {
      searchContainer.parentNode.removeChild(searchContainer);
    }
    
    this.resultsContainer = null;
    this.searchInput = null;
    this.isOpen = false;
  }
}

// Exportar como default também para compatibilidade
export default SearchUI;
