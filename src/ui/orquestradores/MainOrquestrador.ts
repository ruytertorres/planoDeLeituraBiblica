/* ============================================================================
   MainOrquestrador.ts — Orquestrador Principal Completo
   Versão: 2.0.0 (TypeScript)
   ============================================================================

   RESPONSABILIDADE:
   - Orquestrar todo o fluxo da leitura bíblica
   - Gerenciar estado global (dia atual, progresso, etc)
   - Coordenar entre managers, orquestradores e UI
   - Implementar navegação, renderização e eventos

   CONFORMIDADE COM CONTRATO_DO_SISTEMA.MD:
   - §3.1: Tempo é soberano (usa geradorDatas.ts)
   - §4: Hierarquia de Autoridade
   - §10: UI é reflexo do estado

   Camada: ORQUESTRAÇÃO
   ============================================================================ */

import { BaseOrquestrador } from "./BaseOrquestrador.js";
import { PlanoManager } from "../../core/services/planos/PlanoManager.js";
import { ProgressoLeitura } from "../../core/services/planos/ProgressoLeitura.js";
import { NotasLeituraManager } from "../../core/services/notas/NotasLeituraManager.js";
import { SearchEngine } from "../../core/services/busca/SearchEngine.js";
import { ResetProgressoOrquestrador } from "../../core/services/planos/ResetProgressoOrquestrador.js";
import { ReorganizadorPlano } from "../../core/services/planos/ReorganizadorPlano.js";
import { NotasOverlayOrquestrador } from "../../core/services/notas/NotasOverlayOrquestrador.js";
import {
  getDiaDoAnoAtual,
  getTimestampAtualISO,
} from "../../core/services/tempo/geradorDatas.js";
import type {
  PlanoCartucho,
  DiaDoPlano,
} from "../../core/types/contratos.types";

/* ============================================================================
   TIPOS E INTERFACES
   ============================================================================ */

/**
 * Estado do orquestrador
 */
interface MainState {
  diaAtualNumero: number;
  diaHojeNumero: number;
  diasBloqueados: number[];
  managers: {
    plano: PlanoManager;
    progresso: ProgressoLeitura;
    notas: NotasLeituraManager;
    busca: SearchEngine;
  };
  orquestradores: {
    reset?: ResetProgressoOrquestrador;
    notasOverlay?: NotasOverlayOrquestrador;
  };
  apis: {
    calendario?: unknown;
    calendarioVM?: unknown;
  };
  [key: string]: unknown;
}

/**
 * Resultado de navegação
 */
interface NavegacaoResult {
  sucesso: boolean;
  dia?: DiaDoPlano;
  erro?: string;
}

/* ============================================================================
   CLASSE MAIN ORQUESTRADOR
   ============================================================================ */

/**
 * Orquestrador principal da aplicação.
 *
 * Responsável por:
 * - Inicializar todos os managers e subsistemas
 * - Gerenciar estado global (dia atual, dia hoje, etc)
 * - Orquestrar renderizações
 * - Suportar sistema de plugins
 * - Gerenciar lifecycle completo
 *
 * @extends BaseOrquestrador
 */
export class MainOrquestrador extends BaseOrquestrador {
  /* --------------------------------------------------------------------------
     ATRIBUTOS PRIVADOS
     -------------------------------------------------------------------------- */

  private planoCronologico: PlanoCartucho;
  private _state: MainState;
  private reorganizador?: ReorganizadorPlano;

  /* --------------------------------------------------------------------------
     CONSTRUTOR
     -------------------------------------------------------------------------- */

  /**
   * Cria orquestrador principal
   *
   * @param planoCronologico - Objeto do plano a ser usado
   */
  constructor(planoCronologico: PlanoCartucho) {
    super("MainOrquestrador");
    this.planoCronologico = planoCronologico;
    this._state = {
      diaAtualNumero: 1,
      diaHojeNumero: 1,
      diasBloqueados: [],
      managers: {} as MainState["managers"],
      orquestradores: {},
      apis: {},
    };
  }

  /* --------------------------------------------------------------------------
     INICIALIZAÇÃO
     -------------------------------------------------------------------------- */

  /**
   * Inicializa todo o sistema
   */
  async init(): Promise<void> {
    try {
      // Inicializar managers
      this.initManagers();

      // Setup estado inicial
      this.setupInitialState();

      // Setup event delegation
      this.setupEventDelegation();

      // Renderização inicial
      this.renderInitial();

      // Inicializar subsistemas
      this.initSubsystems();

      // Inicializar plugins
      await this.initPlugins();

      console.log("[MainOrquestrador] Sistema inicializado com sucesso");
    } catch (error) {
      this.destroy();
      throw error;
    }
  }

  /**
   * Inicializa managers de domínio
   */
  private initManagers(): void {
    const planoManager = new PlanoManager(this.planoCronologico);
    const progressoManager = new ProgressoLeitura();
    const notasManager = new NotasLeituraManager();
    const buscaManager = new SearchEngine(this.planoCronologico);

    this._state.managers = {
      plano: planoManager,
      progresso: progressoManager,
      notas: notasManager,
      busca: buscaManager,
    };
  }

  /**
   * Configura estado inicial
   */
  private setupInitialState(): void {
    // Carregar dias bloqueados do localStorage
    try {
      const diasBloqueadosSalvos = localStorage.getItem("dias-bloqueados");
      if (diasBloqueadosSalvos) {
        this._state.diasBloqueados = JSON.parse(diasBloqueadosSalvos);
      }
    } catch (error) {
      console.error(
        "[MainOrquestrador] Erro ao carregar dias bloqueados:",
        error,
      );
      this._state.diasBloqueados = [];
    }

    // Restauração: Se há reajuste ativo
    const reajuste = this._state.managers.progresso.obterReajuste();
    if (reajuste?.ativo) {
      this._state.diaAtualNumero = reajuste.numeroDia;
      const diaDoAno = getDiaDoAnoAtual();
      this._state.diaHojeNumero = Math.min(
        Math.max(diaDoAno, 1),
        this.planoCronologico.dias.length,
      );
      return;
    }

    // Inicialização normal
    const diaDoAno = getDiaDoAnoAtual();
    this._state.diaHojeNumero = Math.min(
      Math.max(diaDoAno, 1),
      this.planoCronologico.dias.length,
    );
    this._state.diaAtualNumero = this._state.diaHojeNumero;
  }

  /* --------------------------------------------------------------------------
     EVENT DELEGATION
     -------------------------------------------------------------------------- */

  /**
   * Setup de event delegation (listeners em elementos estáveis)
   */
  private setupEventDelegation(): void {
    // Container estável: dia-view
    const diaView = document.getElementById("dia-view");
    if (diaView) {
      this.on(diaView, "click", (e) => {
        const target = e.target as HTMLElement;
        if (target.matches("[data-action='toggle-lido']")) {
          this.toggleLido();
        }
      });
    }

    // Botões de navegação
    const btnProximo = document.getElementById("btn-dia-proximo");
    const btnAnterior = document.getElementById("btn-dia-anterior");

    if (btnProximo) {
      this.on(btnProximo, "click", () =>
        this.navegarParaDia(this._state.diaAtualNumero + 1),
      );
    }

    if (btnAnterior) {
      this.on(btnAnterior, "click", () =>
        this.navegarParaDia(this._state.diaAtualNumero - 1),
      );
    }

    // Atalhos de teclado
    this.on(document, "keydown", (e) => this.handleKeydown(e as KeyboardEvent));
  }

  /* --------------------------------------------------------------------------
     RENDERIZAÇÃO
     -------------------------------------------------------------------------- */

  /**
   * Renderização inicial da UI
   */
  private renderInitial(): void {
    this.renderEstatisticas();
    this.emit("dia-alterado", { dia: this._state.diaAtualNumero });
  }

  /**
   * Renderizar estatísticas
   */
  private renderEstatisticas(): void {
    const lidos = this._state.managers.progresso.getTotalLidos();
    const total = this.planoCronologico.dias.length;

    const diasLidosEl = document.getElementById("dias-lidos");
    const progressoEl = document.getElementById("progresso");

    if (diasLidosEl) diasLidosEl.textContent = String(lidos);
    if (progressoEl)
      progressoEl.textContent = `${Math.round((lidos / total) * 100)}%`;
  }

  /* --------------------------------------------------------------------------
     SUBSISTEMAS
     -------------------------------------------------------------------------- */

  /**
   * Inicializar subsistemas (busca, reset, notas)
   */
  private initSubsystems(): void {
    // Reset de progresso
    this._state.orquestradores.reset = new ResetProgressoOrquestrador(
      this._state.managers.progresso,
      this._state.managers.plano,
    );

    // Listener para evento de reset
    this.listen("progresso-resetado", (evento) => {
      const customEvent = evento as CustomEvent;
      const detalhes = customEvent.detail || {};

      // Atualizar estado
      this._state.diaAtualNumero = 1;

      // Aplicar dias bloqueados
      if (detalhes.diasBloqueados) {
        this._state.diasBloqueados = detalhes.diasBloqueados;
        localStorage.setItem(
          "dias-bloqueados",
          JSON.stringify(this._state.diasBloqueados),
        );
      } else {
        this._state.diasBloqueados = [];
        localStorage.removeItem("dias-bloqueados");
      }

      this.renderEstatisticas();
      this.emit("dia-alterado", { dia: 1 });

      if (detalhes.aviso) {
        alert(detalhes.aviso);
      }
    });

    // Notas
    this._state.orquestradores.notasOverlay = new NotasOverlayOrquestrador(
      this._state.managers.notas,
    );
  }

  /* --------------------------------------------------------------------------
     NAVEGAÇÃO
     -------------------------------------------------------------------------- */

  /**
   * Navegar para um dia específico
   *
   * @param numeroDia - Número do dia (1-based)
   * @returns Resultado da navegação
   */
  navegarParaDia(numeroDia: number): NavegacaoResult {
    const plano = this._state.managers.plano;
    const totalDias = plano.getTotalDias();

    if (numeroDia < 1 || numeroDia > totalDias) {
      return { sucesso: false, erro: "Dia fora do range" };
    }

    // Bloqueio: Não permitir navegar para dias bloqueados
    if (this._state.diasBloqueados.includes(numeroDia)) {
      return { sucesso: false, erro: `Dia ${numeroDia} está bloqueado` };
    }

    this._state.diaAtualNumero = numeroDia;
    this._state.managers.notas.setDiaAtual(numeroDia);
    this.emit("dia-alterado", { dia: numeroDia });
    this.renderEstatisticas();

    return { sucesso: true };
  }

  /**
   * Alternar lido/não lido do dia atual
   */
  toggleLido(): void {
    const diaNumero = this._state.diaAtualNumero;
    this._state.managers.progresso.alternar(diaNumero);
    this.renderEstatisticas();
    this.emit("progresso-alterado", { dia: diaNumero });
  }

  /* --------------------------------------------------------------------------
     TECLADO
     -------------------------------------------------------------------------- */

  /**
   * Handler de atalhos de teclado
   */
  private handleKeydown(e: KeyboardEvent): void {
    // Ctrl+F / Cmd+F - Foco na busca
    if ((e.ctrlKey || e.metaKey) && e.key === "f") {
      e.preventDefault();
      const searchInput = document.querySelector(
        "[data-search-input]",
      ) as HTMLElement;
      searchInput?.focus();
    }

    // / - Foco na busca
    if (
      e.key === "/" &&
      e.target instanceof HTMLElement &&
      e.target.tagName !== "INPUT"
    ) {
      e.preventDefault();
      const searchInput = document.querySelector(
        "[data-search-input]",
      ) as HTMLElement;
      searchInput?.focus();
    }

    // Setas - Navegação
    if (e.key === "ArrowRight") {
      e.preventDefault();
      this.navegarParaDia(this._state.diaAtualNumero + 1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      this.navegarParaDia(this._state.diaAtualNumero - 1);
    }

    // Space - Toggle lido
    if (
      e.key === " " &&
      e.target instanceof HTMLElement &&
      e.target.tagName !== "INPUT"
    ) {
      e.preventDefault();
      this.toggleLido();
    }
  }

  /* --------------------------------------------------------------------------
     REAJUSTE / LACUNA
     -------------------------------------------------------------------------- */

  /**
   * Verificar e disparar reajuste de lacuna
   *
   * @returns Dados da lacuna se detectada, null caso contrário
   */
  verificarAndDispararReajuste(): unknown {
    this._state.managers.progresso.sincronizarComStorage();
    const ultimoDiaLido = this._state.managers.progresso.getUltimoDiaLido();

    if (ultimoDiaLido === null) {
      return null;
    }

    const reajusteRecente = this._state.managers.progresso.obterReajuste();
    if (reajusteRecente) {
      return null;
    }

    const diaQueDeveSerHoje = getDiaDoAnoAtual();
    const totalDias = this._state.managers.plano.getTotalDias();

    if (!this.reorganizador) {
      this.reorganizador = new ReorganizadorPlano();
    }

    const lacuna = this.reorganizador.detectarLacuna(
      ultimoDiaLido,
      diaQueDeveSerHoje,
      totalDias,
      new Set(this._state.managers.progresso.getDiasLidos()),
    );

    if (lacuna.temLacuna) {
      this.emit("lacuna-detectada", lacuna);

      if (lacuna.ultrapassagemCiclo?.ultrapassaCiclo) {
        this.emit("plano-ultrapassara-ciclo", lacuna.ultrapassagemCiclo);
      }

      return lacuna;
    }

    return null;
  }

  /* --------------------------------------------------------------------------
     LIFECYCLE
     -------------------------------------------------------------------------- */

  /**
   * Destrói o orquestrador e faz cleanup
   */
  destroy(): void {
    // Cleanup orquestradores
    this._state.orquestradores.notasOverlay?.destroy();

    // Limpar estado
    this._state = {} as MainState;

    // Chamar super
    super.destroy();
  }

  /* --------------------------------------------------------------------------
     GETTERS
     -------------------------------------------------------------------------- */

  getPlano(): PlanoCartucho {
    return this.planoCronologico;
  }

  getDiaAtual(): number {
    return this._state.diaAtualNumero;
  }

  getDiaHoje(): number {
    return this._state.diaHojeNumero;
  }

  getManagers(): MainState["managers"] {
    return this._state.managers;
  }

  getDiasBloqueados(): number[] {
    return [...this._state.diasBloqueados];
  }
}

export default MainOrquestrador;
