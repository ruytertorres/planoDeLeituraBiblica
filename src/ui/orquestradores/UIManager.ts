/* ============================================================================
   UIManager.ts — Orquestrador Central de UI em TypeScript
   Versão: 1.0.0
   ============================================================================

   RESPONSABILIDADE:
   - Orquestrar todos os componentes de UI
   - Gerenciar lifecycle dos componentes
   - Coordenar comunicação entre componentes
   - Inicialização e cleanup centralizado

   CONFORMIDADE COM CONTRATO_DO_SISTEMA.MD:
   - §4: Hierarquia de autoridade
   - §10: UI é reflexo do estado
   ============================================================================ */

// ============================================================================
// TIPOS
// ============================================================================

import type { CalendarioComponent } from "../components/Calendario/CalendarioComponent.js";
import type { SearchUI } from "../components/Busca/SearchUI.js";
import type { NotasUI } from "../components/Notas/NotasUI.js";

interface UIManagerConfig {
  calendario?: CalendarioComponent;
  searchUI?: SearchUI;
  notasUI?: NotasUI;
}

interface UIState {
  componentes: {
    calendario: CalendarioComponent | null;
    searchUI: SearchUI | null;
    notasUI: NotasUI | null;
  };
  ativos: {
    calendario: boolean;
    searchUI: boolean;
    notasUI: boolean;
  };
}

// ============================================================================
// ORQUESTRADOR
// ============================================================================

export class UIManager {
  private state: UIState;
  private eventListeners: Array<{ element: Element | Document; type: string; handler: EventListener }> = [];

  constructor(config: UIManagerConfig = {}) {
    this.state = {
      componentes: {
        calendario: config.calendario || null,
        searchUI: config.searchUI || null,
        notasUI: config.notasUI || null,
      },
      ativos: {
        calendario: false,
        searchUI: false,
        notasUI: false,
      },
    };
  }

  /**
   * Registra um componente no manager
   */
  public registrarComponente<T extends CalendarioComponent | SearchUI | NotasUI>(
    nome: "calendario" | "searchUI" | "notasUI",
    componente: T
  ): void {
    this.state.componentes[nome] = componente as any;
  }

  /**
   * Obtém um componente registrado
   */
  public getComponente(nome: "calendario" | "searchUI" | "notasUI"): CalendarioComponent | SearchUI | NotasUI | null {
    return this.state.componentes[nome];
  }

  /**
   * Verifica se um componente está ativo
   */
  public isAtivo(nome: "calendario" | "searchUI" | "notasUI"): boolean {
    return this.state.ativos[nome];
  }

  /**
   * Ativa um componente
   */
  public ativar(nome: "calendario" | "searchUI" | "notasUI"): void {
    this.state.ativos[nome] = true;
  }

  /**
   * Desativa um componente
   */
  public desativar(nome: "calendario" | "searchUI" | "notasUI"): void {
    this.state.ativos[nome] = false;
  }

  /**
   * Destrói todos os componentes registrados
   */
  public destroy(): void {
    // Destruir componentes
    Object.values(this.state.componentes).forEach((componente) => {
      if (componente && typeof (componente as any).destroy === "function") {
        (componente as any).destroy();
      }
    });

    // Limpar event listeners
    this.eventListeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });
    this.eventListeners = [];

    // Reset state
    this.state.componentes = {
      calendario: null,
      searchUI: null,
      notasUI: null,
    };
    this.state.ativos = {
      calendario: false,
      searchUI: false,
      notasUI: false,
    };
  }

  /**
   * Configura atalhos de teclado globais
   */
  public configurarAtalhosGlobais(): void {
    const handler = (e: Event) => {
      const keyboardEvent = e as KeyboardEvent;

      // Ctrl+K - Foco na busca
      if (keyboardEvent.ctrlKey && keyboardEvent.key.toLowerCase() === "k") {
        e.preventDefault();
        const searchUI = this.state.componentes.searchUI;
        if (searchUI && typeof searchUI.focus === "function") {
          searchUI.focus();
        }
      }
    };

    document.addEventListener("keydown", handler);
    this.eventListeners.push({ element: document, type: "keydown", handler });
  }

  /**
   * Obtém estatísticas de uso dos componentes
   */
  public getEstatisticas(): {
    total: number;
    ativos: number;
    inativos: number;
    nomes: string[];
  } {
    const nomes = Object.keys(this.state.componentes).filter(
      (nome) => this.state.componentes[nome as keyof UIState["componentes"]] !== null
    );

    const ativos = nomes.filter((nome) => this.state.ativos[nome as keyof UIState["ativos"]]).length;

    return {
      total: nomes.length,
      ativos,
      inativos: nomes.length - ativos,
      nomes,
    };
  }
}

// ============================================================================
// FUNÇÃO DE FÁBRICA
// ============================================================================

export function criarUIManager(config?: UIManagerConfig): UIManager {
  return new UIManager(config);
}

// Exportar como default
export default UIManager;
