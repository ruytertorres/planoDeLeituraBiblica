/* ============================================================================
   search_ui.js — Interface de Usuário para Busca
   Versão: 1.0.0
   Aplicação: Leitura Bíblica Cronológica

   RESPONSABILIDADE:
   ----------------------------------------------------------------------------
   - Gerenciar a interface de busca
   - Mostrar resultados em tempo real
   - Navegar para o dia selecionado
   - Integrar com o sistema principal
============================================================================ */

export class SearchUI {
  constructor(searchEngine, onSelecionarDiaCallback) {
    this.searchEngine = searchEngine;
    this.onSelecionarDia = onSelecionarDiaCallback;
    this.resultsContainer = null;
    this.searchInput = null;
    this.isOpen = false;

    this._init();
  }

  /* --------------------------------------------------------------------------
     INICIALIZAÇÃO
  -------------------------------------------------------------------------- */
  _init() {
    this._criarDOM();
    this._configurarEventos();
  }

  /* --------------------------------------------------------------------------
     CRIAR ELEMENTOS DO DOM
  -------------------------------------------------------------------------- */
  _criarDOM() {
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
    this.searchInput.placeholder =
      'Buscar dia ou capítulo (ex: "Dia 15" ou "Gênesis 1")';
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
      navbarContainer.insertBefore(
        searchContainer,
        navbarContainer.querySelector(".navbar-stats"),
      );
    }
  }

  /* --------------------------------------------------------------------------
     CONFIGURAR EVENTOS
  -------------------------------------------------------------------------- */
  _configurarEventos() {
    // Input de busca
    this.searchInput.addEventListener("input", (e) => {
      this._onSearchInput(e.target.value);
    });

    // Foco no input
    this.searchInput.addEventListener("focus", () => {
      this._showResults();
    });

    // Clique fora para fechar
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-container")) {
        this._hideResults();
      }
    });

    // Tecla Escape para fechar
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this._hideResults();
        this.searchInput.blur();
      }

      // Tecla Enter para selecionar primeiro resultado
      if (e.key === "Enter" && this.isOpen && this.searchInput.value.trim()) {
        const firstResult = this.resultsContainer.querySelector(
          ".search-result-item",
        );
        if (firstResult) {
          firstResult.click();
        }
      }
    });

    // Botão limpar
    document.getElementById("search-clear").addEventListener("click", () => {
      this.searchInput.value = "";
      this._hideResults();
      this.searchInput.focus();
    });
  }

  /* --------------------------------------------------------------------------
     MANIPULAR INPUT DE BUSCA
  -------------------------------------------------------------------------- */
  _onSearchInput(termo) {
    const trimmed = termo.trim();

    if (trimmed.length < 2) {
      this._hideResults();
      return;
    }

    const resultados = this.searchEngine.buscar(termo);
    this._renderResults(resultados);
    this._showResults();
  }

  /* --------------------------------------------------------------------------
     RENDERIZAR RESULTADOS
  -------------------------------------------------------------------------- */
  _renderResults(resultados) {
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
    this.resultsContainer
      .querySelectorAll(".search-result-item")
      .forEach((item) => {
        item.addEventListener("click", (e) => {
          const diaNumero = parseInt(item.dataset.dia);
          this._selecionarResultado(diaNumero);
        });

        item.addEventListener("mouseenter", () => {
          this.resultsContainer
            .querySelectorAll(".search-result-item")
            .forEach((r) => {
              r.classList.remove("selected");
            });
          item.classList.add("selected");
        });
      });
  }

  /* --------------------------------------------------------------------------
     OBTER RÓTULO DO TIPO DE RESULTADO
  -------------------------------------------------------------------------- */
  _getTypeLabel(type) {
    const labels = {
      dia: "Dia",
      capitulo: "Capítulo",
      cap_range: "Capítulos",
      livro: "Livro",
    };
    return labels[type] || "Resultado";
  }

  /* --------------------------------------------------------------------------
     SELECIONAR RESULTADO
  -------------------------------------------------------------------------- */
  _selecionarResultado(diaNumero) {
    // Chamar callback para navegar para o dia
    if (typeof this.onSelecionarDia === "function") {
      this.onSelecionarDia(diaNumero);
    }
  }

  /* --------------------------------------------------------------------------
     MOSTRAR/ESCONDER RESULTADOS
  -------------------------------------------------------------------------- */
  _showResults() {
    this.resultsContainer.classList.remove("hidden");
    this.resultsContainer.classList.add("active");
    this.isOpen = true;
  }

  _hideResults() {
    this.resultsContainer.classList.remove("active");
    this.resultsContainer.classList.add("hidden");
    this.isOpen = false;
  }

  /* --------------------------------------------------------------------------
     FOCUS NO INPUT (método público)
  -------------------------------------------------------------------------- */
  focus() {
    this.searchInput.focus();
  }

  /* --------------------------------------------------------------------------
     LIMPAR BUSCA (método público)
  -------------------------------------------------------------------------- */
  clear() {
    this.searchInput.value = "";
    this._hideResults();
  }
}
