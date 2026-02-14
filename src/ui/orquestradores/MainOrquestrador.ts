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
import { ResetModal } from "../../ui/componentes/modais/ResetModal.js";
import { ReorganizadorPlano } from "../../core/services/planos/ReorganizadorPlano.js";
import { NotasOverlayOrquestrador } from "../../core/services/notas/NotasOverlayOrquestrador.js";
import {
  getDiaDoAnoAtual,
  getTimestampAtualISO,
  getMesAtual,
  getAnoAtual,
} from "../../core/services/tempo/geradorDatas.js";
import type {
  PlanoCartucho,
  DiaDoPlano,
  TrechoBiblico,
} from "../../core/types/contratos.types";
import { CalendarioViewModel } from "../components/Calendario/CalendarioViewModel.js";
import { CalendarioComponent } from "../components/Calendario/CalendarioComponent.js";
import { ReajusteModalUI } from "../componentes/modais/ReajusteModalUI.js";

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
    reajusteModal?: ReajusteModalUI;
  };
  apis: {
    calendario?: ReturnType<CalendarioComponent["render"]>;
    calendarioVM?: CalendarioViewModel;
    calendarioComponent?: CalendarioComponent;
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

      // Verificar se há lacuna para reajuste (após subsistemas inicializados)
      setTimeout(() => {
        this.verificarAndDispararReajuste();
      }, 500);

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
    console.log("[MainOrquestrador] Configurando event delegation...");

    // Container estável: dia-view
    const diaView = document.getElementById("dia-view");
    if (diaView) {
      console.log(
        "[MainOrquestrador] #dia-view encontrado, adicionando listener",
      );
      this.on(diaView, "click", (e) => {
        const target = e.target as HTMLElement;
        console.log("[MainOrquestrador] Click em:", target);
        if (target.matches("[data-action='toggle-lido']")) {
          console.log("[MainOrquestrador] Toggle lido clicado");
          this.toggleLido();
        }
      });
    } else {
      console.error("[MainOrquestrador] #dia-view NÃO encontrado");
    }

    // Botões de navegação
    const btnProximo = document.getElementById("btn-dia-proximo");
    const btnAnterior = document.getElementById("btn-dia-anterior");

    console.log(
      "[MainOrquestrador] Botão próximo:",
      btnProximo ? "encontrado" : "NÃO encontrado",
    );
    console.log(
      "[MainOrquestrador] Botão anterior:",
      btnAnterior ? "encontrado" : "NÃO encontrado",
    );

    if (btnProximo) {
      this.on(btnProximo, "click", () => {
        console.log("[MainOrquestrador] Botão próximo clicado");
        this.navegarParaDia(this._state.diaAtualNumero + 1);
      });
    }

    if (btnAnterior) {
      this.on(btnAnterior, "click", () => {
        console.log("[MainOrquestrador] Botão anterior clicado");
        this.navegarParaDia(this._state.diaAtualNumero - 1);
      });
    }

    // Atalhos de teclado
    this.on(document, "keydown", (e) => this.handleKeydown(e as KeyboardEvent));

    // Dropdown de descrição (Sobre o Plano Cronológico)
    const btnDescricao = document.getElementById("btn-descricao-toggle");
    if (btnDescricao) {
      this.on(btnDescricao, "click", () => {
        const conteudo = document.getElementById("descricao-conteudo");
        const icon = document.getElementById("descricao-icon");
        if (conteudo) {
          const isHidden = conteudo.classList.contains("hidden");
          if (isHidden) {
            conteudo.classList.remove("hidden");
            btnDescricao.setAttribute("aria-expanded", "true");
          } else {
            conteudo.classList.add("hidden");
            btnDescricao.setAttribute("aria-expanded", "false");
          }
        }
        if (icon) {
          icon.classList.toggle("rotate-180");
        }
      });
    }

    // Botão de reset de progresso
    const btnReset = document.getElementById("btn-resetar-progresso");
    if (btnReset) {
      this.on(btnReset, "click", () => {
        console.log("[MainOrquestrador] Botão resetar progresso clicado");
        this._state.orquestradores.reset?.resetCompleto();
      });
    }

    // Botão de notas flutuante
    const btnNotas = document.getElementById("btn-notas");
    if (btnNotas) {
      this.on(btnNotas, "click", () => {
        console.log("[MainOrquestrador] Botão notas clicado");
        this._state.orquestradores.notasOverlay?.alternar();
      });
    }
  }

  /* --------------------------------------------------------------------------
     RENDERIZAÇÃO
     -------------------------------------------------------------------------- */

  /**
   * Renderização inicial da UI
   */
  private renderInitial(): void {
    console.log("[MainOrquestrador] Renderizando UI inicial...");

    this.renderEstatisticas();
    this.renderCardDia();
    this.renderCalendario();

    this.emit("dia-alterado", { dia: this._state.diaAtualNumero });

    console.log("[MainOrquestrador] UI inicial renderizada");
  }

  /**
   * Renderizar card do dia atual
   */
  private renderCardDia(): void {
    const diaView = document.getElementById("dia-view");
    if (!diaView) {
      console.error("[MainOrquestrador] Elemento #dia-view não encontrado");
      return;
    }

    const dia = this._state.managers.plano.getDiaAtual();
    if (!dia) {
      console.error(`[MainOrquestrador] Dia atual não encontrado`);
      return;
    }

    diaView.innerHTML = this.gerarHTMLCardDia(dia);
    console.log(`[MainOrquestrador] Card do dia ${dia.numero} renderizado`);
  }

  /**
   * Gerar HTML para o card do dia
   */
  private gerarHTMLCardDia(dia: DiaDoPlano): string {
    const lido = this._state.managers.progresso.estaLido(dia.numero);
    const bloqueado = this._state.diasBloqueados.includes(dia.numero);

    // Formatar leituras: "GÊNESIS 1-2, ÊXODO 3"
    const formatarLeituras = (trechos: readonly TrechoBiblico[]): string => {
      return trechos
        .map((t) => {
          const capituloStr =
            t.capituloFim && t.capituloFim !== t.capituloInicio
              ? `${t.capituloInicio}-${t.capituloFim}`
              : `${t.capituloInicio}`;
          return `${t.livroNome.toUpperCase()} ${capituloStr}`;
        })
        .join(", ");
    };

    const leiturasAT = formatarLeituras(dia.antigoTestamento);
    const leiturasNT = formatarLeituras(dia.novoTestamento);
    const todasLeituras = [leiturasAT, leiturasNT].filter(Boolean).join("; ");

    return `
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Dia ${dia.numero}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">${dia.dataFormatada}</p>
          </div>
          <div class="flex gap-2">
            ${lido ? '<span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm dark:bg-green-900/30 dark:text-green-400">✓ Lido</span>' : ""}
            ${bloqueado ? '<span class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm dark:bg-red-900/30 dark:text-red-400">🔒 Bloqueado</span>' : ""}
          </div>
        </div>

        <div class="space-y-4">
          ${
            todasLeituras
              ? `
            <div class="p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
              <strong class="text-blue-800 dark:text-blue-300 text-sm uppercase tracking-wide">Leitura</strong>
              <p class="text-gray-800 dark:text-gray-200 mt-2 font-medium">${todasLeituras}</p>
            </div>
          `
              : ""
          }

          ${
            dia.observacoes
              ? `
            <div class="p-3 bg-yellow-50 rounded-lg dark:bg-yellow-900/20">
              <strong class="text-yellow-700 dark:text-yellow-300 text-sm">Observações</strong>
              <p class="text-gray-700 dark:text-gray-300 mt-1">${dia.observacoes}</p>
            </div>
          `
              : ""
          }
        </div>

        <div class="mt-6 flex gap-3">
          <button data-action="toggle-lido"
            class="px-4 py-2 rounded-lg font-medium transition ${
              lido
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-slate-700 dark:text-gray-300"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }">
            ${lido ? "Marcar como não lido" : "Marcar como lido"}
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Renderizar calendário
   */
  private renderCalendario(): void {
    const calendarioEl = document.getElementById("calendario");
    if (!calendarioEl) {
      console.error("[MainOrquestrador] Elemento #calendario não encontrado");
      return;
    }

    // Criar ou reutilizar ViewModel
    if (!this._state.apis.calendarioVM) {
      this._state.apis.calendarioVM = new CalendarioViewModel(
        {
          totalDias: this.planoCronologico.dias.length,
          getDia: (numero: number) =>
            this.planoCronologico.dias.find((d) => d.numero === numero) || null,
        },
        {
          estaLido: (diaNumero: number) =>
            this._state.managers.progresso.estaLido(diaNumero),
        },
        () => this._state.diaHojeNumero,
        () => this._state.diaAtualNumero,
        (diaNumero: number, diaDoAno?: number) =>
          this.navegarParaDia(diaNumero, diaDoAno),
        this._state.diasBloqueados,
        () => this._state.managers.progresso.obterDeslocamentoDatas(),
        () => this._state.managers.progresso.obterDiaRetomada(),
      );
    } else {
      // Atualizar dias bloqueados no ViewModel existente
      this._state.apis.calendarioVM.diasBloqueados = this._state.diasBloqueados;
    }

    // Criar componente apenas na primeira vez, depois reutilizar
    if (!this._state.apis.calendarioComponent) {
      this._state.apis.calendarioComponent = new CalendarioComponent({
        containerId: "calendario",
        viewModel: this._state.apis.calendarioVM,
      });
    }

    // Renderizar (reutiliza a mesma instância)
    this._state.apis.calendario = this._state.apis.calendarioComponent.render();

    // Destacar o dia atual
    if (this._state.apis.calendario) {
      this._state.apis.calendario.highlightDay(this._state.diaAtualNumero);
    }

    console.log("[MainOrquestrador] Calendário mensal renderizado");
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

    // Reset Modal - UI para confirmação de reset
    const resetModal = new ResetModal(this._state.orquestradores.reset);
    resetModal.inicializar();

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

    // Reajuste de lacuna (modal)
    this._state.orquestradores.reajusteModal = new ReajusteModalUI(this);

    // Listener para evento de lacuna detectada - mostrar modal
    this.listen("lacuna-detectada", (evento) => {
      const customEvent = evento as CustomEvent;
      const dadosBrutos = customEvent.detail;
      console.log("[MainOrquestrador] Lacuna detectada (bruto):", dadosBrutos);

      // Mapear dados do ReorganizadorPlano para formato do ReajusteModalUI
      const dadosLacuna = {
        temLacuna: true,
        diasGapCount: dadosBrutos.diasAtraso || dadosBrutos.diasNaoLidos || 0,
        percentualAtraso: Math.round(
          ((dadosBrutos.diasAtraso || dadosBrutos.diasNaoLidos || 0) /
            (dadosBrutos.totalDias || 365)) *
            100,
        ),
        descricao: dadosBrutos.descricao,
        buracos: dadosBrutos.buracos,
        tipo: dadosBrutos.tipo,
      };

      console.log("[MainOrquestrador] Dados mapeados para modal:", dadosLacuna);
      console.log(
        "[MainOrquestrador] reajusteModal existe?",
        !!this._state.orquestradores.reajusteModal,
      );

      if (this._state.orquestradores.reajusteModal) {
        console.log("[MainOrquestrador] Chamando criarEExibir...");
        this._state.orquestradores.reajusteModal.criarEExibir(dadosLacuna);
      } else {
        console.error("[MainOrquestrador] ERRO: reajusteModal não existe!");
      }
    });
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
  navegarParaDia(numeroDia: number, diaDoAno?: number): NavegacaoResult {
    console.log(
      `[MainOrquestrador] Navegando para dia ${numeroDia}, diaDoAno=${diaDoAno}`,
    );

    const plano = this._state.managers.plano;
    const totalDias = plano.getTotalDias();

    if (numeroDia < 1 || numeroDia > totalDias) {
      return { sucesso: false, erro: "Dia fora do range" };
    }

    // Bloqueio: Não permitir navegar para dias bloqueados na região do gap
    const deslocamento =
      this._state.managers.progresso.obterDeslocamentoDatas();
    const diaRetomada = this._state.managers.progresso.obterDiaRetomada();
    const estaNaRegiaoGap =
      diaRetomada !== null &&
      deslocamento > 0 &&
      diaDoAno !== undefined &&
      diaDoAno < diaRetomada + deslocamento;

    console.log(
      `[MainOrquestrador] deslocamento=${deslocamento}, diaRetomada=${diaRetomada}, estaNaRegiaoGap=${estaNaRegiaoGap}`,
    );
    console.log(
      `[MainOrquestrador] diasBloqueados includes ${numeroDia}: ${this._state.diasBloqueados.includes(numeroDia)}`,
    );

    if (this._state.diasBloqueados.includes(numeroDia) && estaNaRegiaoGap) {
      console.log(
        `[MainOrquestrador] Dia ${numeroDia} bloqueado na região do gap`,
      );
      return { sucesso: false, erro: `Dia ${numeroDia} está bloqueado` };
    }

    this._state.diaAtualNumero = numeroDia;
    this._state.managers.plano.irParaDia(numeroDia);
    this._state.managers.notas.setDiaAtual(numeroDia);

    // Atualizar UI
    this.renderCardDia();
    this.renderCalendario();
    this.renderEstatisticas();

    // Focar no card do dia
    const cardDia = document.getElementById("card-dia");
    if (cardDia) {
      cardDia.focus();
      cardDia.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    this.emit("dia-alterado", { dia: numeroDia });

    return { sucesso: true };
  }

  /**
   * Alternar lido/não lido do dia atual
   */
  toggleLido(): void {
    const diaNumero = this._state.diaAtualNumero;
    console.log(`[MainOrquestrador] Alternando estado do dia ${diaNumero}`);

    this._state.managers.progresso.alternar(diaNumero);

    // Re-renderizar card e calendário para mostrar novo estado
    this.renderCardDia();
    this.renderCalendario();
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
    console.log("[DEBUG] ========== Verificando lacuna ==========");

    this._state.managers.progresso.sincronizarComStorage();
    const ultimoDiaLido = this._state.managers.progresso.getUltimoDiaLido();
    const diasLidos = this._state.managers.progresso.getDiasLidos();

    console.log("[DEBUG] últimoDiaLido:", ultimoDiaLido);
    console.log("[DEBUG] diasLidos:", diasLidos);
    console.log("[DEBUG] total dias lidos:", diasLidos.length);

    if (ultimoDiaLido === null) {
      console.log("[DEBUG] Sem último dia lido - retornando null");
      return null;
    }

    const reajusteRecente = this._state.managers.progresso.obterReajuste();
    console.log("[DEBUG] reajusteRecente:", reajusteRecente);

    if (reajusteRecente) {
      console.log("[DEBUG] Já existe reajuste ativo - retornando null");
      return null;
    }

    const diaQueDeveSerHoje = getDiaDoAnoAtual();
    const totalDias = this._state.managers.plano.getTotalDias();

    console.log("[DEBUG] diaQueDeveSerHoje:", diaQueDeveSerHoje);
    console.log("[DEBUG] totalDias:", totalDias);
    console.log(
      "[DEBUG] diasGap calculado:",
      diaQueDeveSerHoje - ultimoDiaLido - 1,
    );

    if (!this.reorganizador) {
      this.reorganizador = new ReorganizadorPlano();
    }

    const lacuna = this.reorganizador.detectarLacuna(
      ultimoDiaLido,
      diaQueDeveSerHoje,
      totalDias,
      new Set(diasLidos),
    );

    console.log("[DEBUG] Resultado detectarLacuna:", lacuna);

    if (lacuna.temLacuna) {
      console.log("[DEBUG] ✅ Lacuna detectada! Emitindo evento...");
      this.emit("lacuna-detectada", lacuna);

      if (lacuna.ultrapassagemCiclo?.ultrapassaCiclo) {
        this.emit("plano-ultrapassara-ciclo", lacuna.ultrapassagemCiclo);
      }

      return lacuna;
    }

    console.log("[DEBUG] Nenhuma lacuna detectada");
    return null;
  }

  /**
   * Aplicar reajuste de lacuna - chamado pelo modal quando usuário confirma
   *
   * @param lacuna - Dados da lacuna detectada (opcional, para buracos esparsos)
   * @returns Resultado do reajuste
   */
  aplicarReajuste(lacuna?: { buracos?: number[]; tipo?: string }): {
    sucesso: boolean;
    novoIndice: number;
    aviso?: string;
  } {
    console.log("[MainOrquestrador] Aplicando reajuste de lacuna...", lacuna);

    const ultimoDiaLido = this._state.managers.progresso.getUltimoDiaLido();
    const diaQueDeveSerHoje = getDiaDoAnoAtual();
    const totalDias = this._state.managers.plano.getTotalDias();

    if (ultimoDiaLido === null) {
      return { sucesso: false, novoIndice: this._state.diaAtualNumero };
    }

    // Calcular novo índice (próximo dia após o último lido)
    const novoDia = ultimoDiaLido + 1;

    // Calcular deslocamento para alinhar o plano
    const deslocamento = diaQueDeveSerHoje - novoDia;

    // Salvar reajuste no progresso
    this._state.managers.progresso.salvarReajuste(novoDia, diaQueDeveSerHoje);

    // Calcular dias bloqueados
    let diasBloqueados: number[] = [];

    if (lacuna?.buracos && lacuna.buracos.length > 0) {
      // Caso de buracos esparsos: bloquear os dias não lidos específicos
      // exceto o dia de retomada (novoDia)
      diasBloqueados = lacuna.buracos.filter((dia) => dia !== novoDia);
      console.log(
        `[MainOrquestrador] Dias bloqueados (buracos esparsos, exceto ${novoDia}):`,
        diasBloqueados,
      );
    } else {
      // Caso de lacuna consecutiva: bloquear dias do plano entre último lido e novo dia
      // Ex: último lido 7, hoje é 45 (14/02), novo dia é 8
      // Bloquear dias 8-44 do plano (dias que ficaram para trás)
      // Mas o dia 8 (novoDia) NÃO deve ser bloqueado - é onde retoma
      for (let i = ultimoDiaLido + 1; i < diaQueDeveSerHoje; i++) {
        if (i !== novoDia) {
          diasBloqueados.push(i);
        }
      }
      console.log(
        `[MainOrquestrador] Dias bloqueados (${ultimoDiaLido} -> ${diaQueDeveSerHoje}, exceto ${novoDia}):`,
        diasBloqueados,
      );
    }

    this._state.diasBloqueados = diasBloqueados;
    localStorage.setItem("dias-bloqueados", JSON.stringify(diasBloqueados));

    // Atualizar dia atual
    this._state.diaAtualNumero = novoDia;
    this._state.managers.plano.irParaDia(novoDia);

    // Verificar se há aviso de ultrapassagem de ciclo
    let aviso: string | undefined;
    if (novoDia + totalDias > 366) {
      aviso =
        "Este plano ultrapassará 31/12 e continuará no próximo ano civil.";
    }

    // Re-renderizar UI
    this.renderCardDia();
    this.renderCalendario();
    this.renderEstatisticas();

    // Emitir evento
    this.emit("reajuste-aplicado", {
      sucesso: true,
      novoIndice: novoDia,
      deslocamento,
      diasBloqueados,
      aviso,
    });

    console.log(
      `[MainOrquestrador] Reajuste aplicado: Dia ${novoDia}, deslocamento: ${deslocamento}`,
    );

    return {
      sucesso: true,
      novoIndice: novoDia,
      aviso,
    };
  }

  /**
   * Destrói o orquestrador e faz cleanup
   */
  destroy(): void {
    // Cleanup orquestradores
    this._state.orquestradores.notasOverlay?.destroy();

    // Cleanup calendario
    this._state.apis.calendarioComponent?.destroy();

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
