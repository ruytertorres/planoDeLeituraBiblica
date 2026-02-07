/* ============================================================================
   CalendarioComponent.ts — Componente de Calendário em TypeScript
   Versão: 1.0.0
   ============================================================================

   RESPONSABILIDADE:
   - Renderizar calendário mensal de leitura bíblica
   - Gerenciar navegação entre meses
   - Destacar dia atual e dias lidos
   - Integrar com ViewModel para lógica de negócio

   CONFORMIDADE COM CONTRATO_DO_SISTEMA.MD:
   - §10: UI é reflexo do estado
   - Sem lógica de negócio (apenas renderização)
   ============================================================================ */

// ============================================================================
// TIPOS
// ============================================================================

interface DiaCalendario {
  label: string;
  numero: number | null;
  classes: string[];
  clicavel: boolean;
  tooltip?: string;
  dataISO?: string;
}

interface MesCalendario {
  nome: string;
  ano: number;
  dias: DiaCalendario[];
}

interface CalendarioViewModel {
  gerarMesAtual: () => MesCalendario;
  onMesPosterior: () => void;
  onProximoMes: () => void;
  onSelecionarDia: (diaNumero: number) => void;
}

interface CalendarioConfig {
  containerId: string;
  viewModel: CalendarioViewModel;
}

interface CalendarioAPI {
  highlightDay: (diaNumero: number) => void;
  destroy: () => void;
}

// ============================================================================
// COMPONENTE
// ============================================================================

export class CalendarioComponent {
  private container: HTMLElement | null = null;
  private config: CalendarioConfig;
  private eventListeners: Array<{
    element: Element;
    type: string;
    handler: EventListener;
  }> = [];

  constructor(config: CalendarioConfig) {
    this.config = config;
  }

  /**
   * Renderiza o calendário no container especificado
   */
  public render(): CalendarioAPI | null {
    this.container = document.getElementById(this.config.containerId);
    if (!this.container) {
      console.warn("Container não encontrado:", this.config.containerId);
      return null;
    }

    this.limparContainer();
    this.renderizarEstrutura();

    return {
      highlightDay: (diaNumero: number) => this.highlightDay(diaNumero),
      destroy: () => this.destroy(),
    };
  }

  /**
   * Limpa o container antes de renderizar
   */
  private limparContainer(): void {
    if (this.container) {
      this.container.innerHTML = "";
    }
  }

  /**
   * Renderiza a estrutura completa do calendário
   */
  private renderizarEstrutura(): void {
    if (!this.container) return;

    const wrapper = document.createElement("div");
    wrapper.className = "calendar-wrapper";

    const mes = this.config.viewModel.gerarMesAtual();

    // Header com navegação
    const header = this.criarHeader(mes);
    wrapper.appendChild(header);

    // Grid de dias
    const grid = this.criarGrid(mes);
    wrapper.appendChild(grid);

    this.container.appendChild(wrapper);
  }

  /**
   * Cria o header com botões de navegação
   */
  private criarHeader(mes: MesCalendario): HTMLElement {
    const header = document.createElement("div");
    header.className = "calendar-header";

    // Botão anterior
    const btnAnterior = document.createElement("button");
    btnAnterior.type = "button";
    btnAnterior.className = "nav-mes-btn anterior";
    btnAnterior.textContent = "◀ anterior";

    const handlerAnterior = () => {
      this.config.viewModel.onMesPosterior();
      this.render();
    };
    btnAnterior.addEventListener("click", handlerAnterior);
    this.eventListeners.push({
      element: btnAnterior,
      type: "click",
      handler: handlerAnterior,
    });

    // Título
    const titulo = document.createElement("span");
    titulo.className = "calendar-title";
    titulo.textContent = `${mes.nome} ${mes.ano}`;

    // Botão próximo
    const btnProximo = document.createElement("button");
    btnProximo.type = "button";
    btnProximo.className = "nav-mes-btn proximo";
    btnProximo.textContent = "posterior ▶";

    const handlerProximo = () => {
      this.config.viewModel.onProximoMes();
      this.render();
    };
    btnProximo.addEventListener("click", handlerProximo);
    this.eventListeners.push({
      element: btnProximo,
      type: "click",
      handler: handlerProximo,
    });

    header.appendChild(btnAnterior);
    header.appendChild(titulo);
    header.appendChild(btnProximo);

    return header;
  }

  /**
   * Cria o grid de dias do calendário
   */
  private criarGrid(mes: MesCalendario): HTMLElement {
    const grid = document.createElement("div");
    grid.className = "calendario-grid";

    mes.dias.forEach((dia) => {
      const diaEl = this.criarDiaElement(dia);
      grid.appendChild(diaEl);
    });

    return grid;
  }

  /**
   * Cria elemento de um dia individual
   */
  private criarDiaElement(dia: DiaCalendario): HTMLElement {
    const diaEl = document.createElement("button");
    diaEl.className = "calendario-dia";
    diaEl.type = "button";
    diaEl.textContent = dia.label;

    // Adicionar classes
    dia.classes.forEach((cls) => diaEl.classList.add(cls));

    // Estado disabled
    if (!dia.clicavel) {
      diaEl.disabled = true;
    }

    // Tooltip
    if (dia.tooltip) {
      diaEl.title = dia.tooltip;
    }

    // Data attributes
    if (dia.numero !== null) {
      diaEl.dataset.diaNumero = String(dia.numero);
    }

    if (dia.dataISO) {
      diaEl.dataset.dataIso = dia.dataISO;
    }

    // Event listener de clique
    if (dia.clicavel && dia.numero !== null) {
      const handler = () => {
        this.config.viewModel.onSelecionarDia(dia.numero!);
      };
      diaEl.addEventListener("click", handler);
      this.eventListeners.push({ element: diaEl, type: "click", handler });
    } else if (dia.numero !== null && dia.classes.includes("dia-bloqueado")) {
      // Prevenir clique em dias bloqueados
      const handler = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
      };
      diaEl.addEventListener("click", handler);
      this.eventListeners.push({ element: diaEl, type: "click", handler });
    }

    return diaEl;
  }

  /**
   * Destaca um dia específico no calendário
   */
  public highlightDay(diaNumero: number): void {
    // Remover destaque anterior
    document.querySelectorAll(".calendario-dia.ativo").forEach((el) => {
      el.classList.remove("ativo");
    });

    // Adicionar novo destaque
    const diaEl = document.querySelector(
      `.calendario-dia[data-dia-numero="${diaNumero}"]`,
    ) as HTMLElement;

    if (diaEl) {
      diaEl.classList.add("ativo");
    }
  }

  /**
   * Remove todos os event listeners e limpa o componente
   */
  public destroy(): void {
    // Remover todos os event listeners registrados
    this.eventListeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });
    this.eventListeners = [];

    // Limpar container
    this.limparContainer();
    this.container = null;
  }
}

// ============================================================================
// FUNÇÃO DE FÁBRICA (para compatibilidade com código existente)
// ============================================================================

/**
 * Função de fábrica para criar e renderizar calendário
 * Mantém compatibilidade com código JavaScript existente
 */
export function renderCalendario(
  config: CalendarioConfig,
): CalendarioAPI | null {
  const componente = new CalendarioComponent(config);
  return componente.render();
}
