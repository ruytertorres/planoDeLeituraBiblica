/* ============================================================================
   MainOrquestrador.js — Orquestrador Central da Aplicação
============================================================================
   Responsabilidade: Orquestrar todo o fluxo da leitura bíblica
   
   Funcionalidades:
   - Inicializar managers de domínio
   - Gerenciar navegação entre dias
   - Renderizar componentes
   - Comunicar via CustomEvents
   - Suportar plugins para features futuras
   
   Camada: ORQUESTRAÇÃO
   Estende: BaseOrquestrador
============================================================================ */

import { BaseOrquestrador } from "./BaseOrquestrador.js";
import { PlanoManager } from "../../core/services/planos/PlanoManager.js";
import { ProgressoLeitura } from "../../core/services/planos/ProgressoLeitura.js";
import { NotasLeituraManager } from "../../core/services/notas/NotasLeituraManager.js";
import { SearchEngine } from "../../core/services/busca/SearchEngine.js";
import { SearchUI } from "../components/busca/search_ui.js";
import { ResetProgressoOrquestrador } from "../../core/services/planos/ResetProgressoOrquestrador.js";
import { ResetModal } from "../componentes/ResetModal.js";
import { renderDiaCard } from "../components/planos/render_dia_card.js";
import { renderCalendario } from "../components/calendario/render_calendario.js";
import { CalendarioViewModel } from "../components/calendario/CalendarioViewModel.js";
import { NotasOverlayOrquestrador } from "../../core/services/notas/NotasOverlayOrquestrador.js";
import { initNotasOverlayUI } from "../componentes/notas/NotasOverlayUI.js";
import { initDarkMode } from "../components/darkmode.js";
import {
  getDiaDoAnoAtual,
  getAnoAtual,
} from "../../core/models/parametroGerador.js";

/**
 * Orquestrador Central da Aplicação
 *
 * Responsável por:
 * - Inicializar todos os managers e subsistemas
 * - Gerenciar estado global (dia atual, dia hoje, etc)
 * - Orquestrar renderizações
 * - Suportar sistema de plugins para features futuras
 * - Gerenciar lifecycle completo
 */
export class MainOrquestrador extends BaseOrquestrador {
  /**
   * Construtor
   * @param {Object} planoCronologico - Objeto do plano a ser usado
   */
  constructor(planoCronologico) {
    super("MainOrquestrador");

    this.planoCronologico = planoCronologico;

    // Estado da aplicação
    this.state = {
      diaAtualNumero: 1,
      diaHojeNumero: 1,
      managers: {
        plano: null,
        progresso: null,
        notas: null,
        busca: null,
      },
      orquestradores: {
        reset: null,
        resetModal: null,
        notasOverlay: null,
      },
      apis: {
        calendario: null,
        calendarioVM: null,
      },
    };
  }

  /**
   * Inicializar todo o sistema
   *
   * Sequência:
   * 1. Ativar tema escuro
   * 2. Criar managers de domínio
   * 3. Descobrir dia atual
   * 4. Setup de event delegation
   * 5. Inicializar plugins
   * 6. Renderizar UI inicial
   *
   * @throws {Error} Se falhar em inicialização crítica
   * @public
   */
  async init() {
    try {
      console.log(`🚀 [${this.name}] Iniciando aplicação...`);

      // Passo 1: Tema escuro
      initDarkMode();

      // Passo 2: Managers
      this.initManagers();

      // Passo 3: Estado inicial
      this.setupInitialState();

      // Passo 4: Event delegation (listeners estáveis)
      this.setupEventDelegation();

      // Passo 5: Renderização inicial
      this.renderInitial();

      // Passo 6: Inicializar subsistemas
      this.initSubsystems();

      // Passo 7: Plugins
      await this.initPlugins();

      console.log(`✅ [${this.name}] Aplicação inicializada com sucesso`);
    } catch (error) {
      console.error(`❌ [${this.name}] Erro na inicialização:`, error);
      this.destroy();
      throw error;
    }
  }

  /**
   * Criar managers de domínio
   * @private
   */
  initManagers() {
    this.state.managers.plano = new PlanoManager(this.planoCronologico);
    this.state.managers.progresso = new ProgressoLeitura();
    this.state.managers.notas = new NotasLeituraManager();
    this.state.managers.busca = new SearchEngine(
      this.state.managers.plano.getPlano(),
    );
  }

  /**
   * Configurar estado inicial
   * @private
   */
  setupInitialState() {
    const plano = this.state.managers.plano.getPlano();

    // Descobrir dia de hoje
    const diaDoAno = getDiaDoAnoAtual();
    this.state.diaHojeNumero =
      diaDoAno < 1
        ? 1
        : diaDoAno > plano.dias.length
          ? plano.dias.length
          : diaDoAno;

    this.state.diaAtualNumero = this.state.diaHojeNumero;

    // Mostrar total de dias na UI
    const totalDiasEl = document.getElementById("total-dias");
    if (totalDiasEl) {
      totalDiasEl.textContent = plano.dias.length;
    }
  }

  /**
   * Setup de event delegation (listeners em elementos estáveis)
   *
   * ✅ SOLUÇÃO para memory leak:
   * - Listeners adicionados UMA VEZ em containers estáveis
   * - Elementos dinâmicos (botões) usam event delegation
   * - Sem acumulação de listeners
   *
   * @private
   */
  setupEventDelegation() {
    // ✅ CONTAINER ESTÁVEL: dia-view
    const diaView = document.getElementById("dia-view");
    this.on(diaView, "click", (e) => {
      if (e.target.matches("[data-action='toggle-lido']")) {
        this.toggleLido();
      }
    });

    // ✅ Botões de navegação
    const btnProximo = document.getElementById("btn-dia-proximo");
    const btnAnterior = document.getElementById("btn-dia-anterior");

    this.on(btnProximo, "click", () =>
      this.navegarParaDia(this.state.diaAtualNumero + 1),
    );

    this.on(btnAnterior, "click", () =>
      this.navegarParaDia(this.state.diaAtualNumero - 1),
    );

    // ✅ Atalhos de teclado
    this.on(document, "keydown", (e) => this.handleKeydown(e));
  }

  /**
   * Renderização inicial da UI
   * @private
   */
  renderInitial() {
    const plano = this.state.managers.plano.getPlano();

    this.renderDia();
    this.renderEstatisticas();
    this.renderCalendario(plano);
  }

  /**
   * Inicializar subsistemas (busca, reset, notas)
   * @private
   */
  initSubsystems() {
    // Busca
    const searchUI = new SearchUI(this.state.managers.busca, (diaNumero) =>
      this.navegarParaDia(diaNumero),
    );

    // Reset de progresso
    this.state.orquestradores.reset = new ResetProgressoOrquestrador(
      this.state.managers.progresso,
      this.state.managers.plano,
    );

    this.state.orquestradores.resetModal = new ResetModal(
      this.state.orquestradores.reset,
    );
    this.state.orquestradores.resetModal.inicializar();

    // Listener para evento de reset
    this.listen("progresso-resetado", () => {
      const plano = this.state.managers.plano.getPlano();
      this.renderCalendario(plano);
      this.renderEstatisticas();
      this.renderDia();
    });

    // Notas
    this.state.orquestradores.notasOverlay = new NotasOverlayOrquestrador(
      this.state.managers.notas,
    );

    initNotasOverlayUI(this.state.orquestradores.notasOverlay);
    this.state.orquestradores.notasOverlay.carregarNotasDoDia();
  }

  /**
   * Alternar lido/não lido
   * @private
   */
  toggleLido() {
    const plano = this.state.managers.plano.getPlano();
    const dia = plano.getDia(this.state.diaAtualNumero);

    this.state.managers.progresso.alternar(dia.numero);
    this.render();
  }

  /**
   * Navegar para um dia específico
   *
   * @param {number} numeroDia - Número do dia (1-based)
   * @returns {boolean} true se sucesso, false caso contrário
   * @public
   */
  navegarParaDia(numeroDia) {
    const plano = this.state.managers.plano.getPlano();

    if (numeroDia < 1 || numeroDia > plano.dias.length) {
      return false;
    }

    this.state.diaAtualNumero = numeroDia;
    this.render();
    return true;
  }

  /**
   * Renderizar tudo (atalho para render completo)
   * @private
   */
  render() {
    const plano = this.state.managers.plano.getPlano();

    this.renderDia();
    this.renderEstatisticas();
    this.renderCalendario(plano);

    // Scroll para card
    this.scrollParaCardDoDia();
  }

  /**
   * Renderizar card do dia
   * @private
   */
  renderDia() {
    const plano = this.state.managers.plano.getPlano();
    const dia = plano.getDia(this.state.diaAtualNumero);
    const container = document.getElementById("dia-view");

    if (!container || !dia) return;

    // ✅ Renderizar card
    container.innerHTML = renderDiaCard(dia, {
      isHoje: dia.numero === this.state.diaHojeNumero,
      isLido: this.state.managers.progresso.estaLido(dia.numero),
    });

    // ✅ Atualizar estado de notas
    this.state.managers.notas.setDiaAtual(dia.numero);

    // ✅ Emitir evento
    this.emit("dia-alterado", { dia: dia.numero });

    // ✅ Atualizar navegação
    this.updateNavigation(plano.dias.length);

    // ✅ Highlight no calendário
    if (this.state.apis.calendario) {
      this.state.apis.calendario.highlightDay(dia.numero);
    }
  }

  /**
   * Renderizar estatísticas
   * @private
   */
  renderEstatisticas() {
    const plano = this.state.managers.plano.getPlano();
    const lidos = this.state.managers.progresso.getTotalLidos();
    const total = plano.dias.length;

    const diasLidosEl = document.getElementById("dias-lidos");
    const progressoEl = document.getElementById("progresso");

    if (diasLidosEl) diasLidosEl.textContent = lidos;
    if (progressoEl)
      progressoEl.textContent = `${Math.round((lidos / total) * 100)}%`;
  }

  /**
   * Renderizar calendário
   * @private
   */
  renderCalendario(plano) {
    const progresso = this.state.managers.progresso;

    // Lazy init ViewModel
    if (!this.state.apis.calendarioVM) {
      this.state.apis.calendarioVM = new CalendarioViewModel(
        plano,
        progresso,
        () => this.state.diaHojeNumero,
        () => this.state.diaAtualNumero,
        (numeroDia) => {
          if (numeroDia) {
            this.navegarParaDia(numeroDia);
            this.scrollParaCardDoDia();
          }
        },
      );
    }

    // Gerar ViewModel
    const anoAtual = getAnoAtual();
    const viewModel = this.state.apis.calendarioVM.gerarViewModel(anoAtual);

    // Renderizar
    this.state.apis.calendario = renderCalendario({
      containerId: "calendario",
      viewModel,
    });
  }

  /**
   * Atualizar estado de navegação (desabilitar botões nos limites)
   * @private
   */
  updateNavigation(total) {
    const btnProximo = document.getElementById("btn-dia-proximo");
    const btnAnterior = document.getElementById("btn-dia-anterior");

    if (btnProximo) btnProximo.disabled = this.state.diaAtualNumero >= total;
    if (btnAnterior) btnAnterior.disabled = this.state.diaAtualNumero <= 1;
  }

  /**
   * Scroll suave para card do dia
   * @private
   */
  scrollParaCardDoDia() {
    setTimeout(() => {
      const cardDia = document.getElementById("card-dia");
      if (!cardDia) return;

      cardDia.scrollIntoView({ behavior: "smooth", block: "start" });
      cardDia.classList.add("card-highlight");
      setTimeout(() => cardDia.classList.remove("card-highlight"), 1500);
    }, 100);
  }

  /**
   * Handler de atalhos de teclado
   * @private
   */
  handleKeydown(e) {
    // Ctrl+F / Cmd+F - Foco na busca
    if ((e.ctrlKey || e.metaKey) && e.key === "f") {
      e.preventDefault();
      const searchInput = document.querySelector("[data-search-input]");
      searchInput?.focus();
    }

    // / - Foco na busca
    if (e.key === "/" && e.target.tagName !== "INPUT") {
      e.preventDefault();
      const searchInput = document.querySelector("[data-search-input]");
      searchInput?.focus();
    }

    // Setas - Navegação
    if (e.key === "ArrowRight") {
      e.preventDefault();
      this.navegarParaDia(this.state.diaAtualNumero + 1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      this.navegarParaDia(this.state.diaAtualNumero - 1);
    }

    // Space - Toggle lido
    if (e.key === " " && e.target.tagName !== "INPUT") {
      e.preventDefault();
      this.toggleLido();
    }
  }

  /**
   * Cleanup ao destruir
   * @public
   */
  destroy() {
    // Cleanup plugins
    for (const plugin of this.plugins) {
      if (plugin.destroy) {
        try {
          plugin.destroy();
        } catch (e) {
          console.warn(`Erro ao cleanup plugin ${plugin.name}:`, e);
        }
      }
    }

    // Cleanup orquestradores
    if (this.state.orquestradores.notasOverlay) {
      this.state.orquestradores.notasOverlay.destroy?.();
    }

    // Limpar estado
    this.state = {};

    // Chamar super
    super.destroy();
  }
}
