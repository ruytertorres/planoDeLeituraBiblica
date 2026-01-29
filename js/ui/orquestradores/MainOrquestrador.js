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
import { ReorganizadorPlano } from "../../core/services/planos/ReorganizadorPlano.js";
import * as parametroGerador from "../../core/models/parametroGerador.js";
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
      diasBloqueados: [], // Array de dias que foram pulados no reajuste
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

    // 🔄 SINCRONIZAÇÃO CRÍTICA: Carregar estado do localStorage PRIMEIRO
    // Isso garante que temos dados frescos antes de qualquer renderização
    this.state.managers.progresso.sincronizarComStorage();

    // 🔄 RESTAURAÇÃO: Se há reajuste ativo, restaurar diaAtualNumero ANTES de renderizar
    const reajuste = this.state.managers.progresso.obterReajuste();
    if (reajuste && reajuste.ativo) {
      this.state.diaAtualNumero = reajuste.numeroDia;

      // Calcular diaHoje normalmente (para referência)
      const diaDoAno = getDiaDoAnoAtual();
      this.state.diaHojeNumero =
        diaDoAno < 1
          ? 1
          : diaDoAno > plano.dias.length
            ? plano.dias.length
            : diaDoAno;

      console.log(
        `📝 setupInitialState: Restaurado dia ${reajuste.numeroDia} (reajuste ativo)`,
      );

      // Mostrar total de dias na UI
      const totalDiasEl = document.getElementById("total-dias");
      if (totalDiasEl) {
        totalDiasEl.textContent = plano.dias.length;
      }

      return; // ✅ Estado restaurado, renderizará com dia correto
    }

    // Inicialização normal (sem reajuste ativo)
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

    // ✅ NOTA: diaAtualNumero foi restaurado em setupInitialState() se havia reajuste
    // setupInitialState() já sincronizou e restaurou o estado correto
    // Agora renderizamos com dados FRESCOS

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
    this.listen("progresso-resetado", (evento) => {
      const detalhes = evento.detail || {};

      // Sempre que resetar, vamos voltar o dia atual para 1
      // (tanto para reset completo quanto para "Dia 1 → hoje")
      this.state.diaAtualNumero = 1;

      // Limpar qualquer bloqueio de dias (nova jornada)
      this.state.diasBloqueados = [];

      const plano = this.state.managers.plano.getPlano();
      this.renderCalendario(plano);
      this.renderEstatisticas();
      this.renderDia();

      if (detalhes.avisoUltrapassagem) {
        console.log(`📅 Aviso reset: ${detalhes.avisoUltrapassagem}`);
      }
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

    console.log(
      `🔀 navegarParaDia(${numeroDia}) - stack:`,
      new Error().stack.split("\n")[2],
    );
    this.state.diaAtualNumero = numeroDia;
    this.render();
    return true;
  }

  /**
   * Renderizar tudo (atalho para render completo)
   * @private
   */
  render() {
    console.log(
      `🎨 render() - diaAtualNumero=${this.state.diaAtualNumero}, stack:`,
      new Error().stack.split("\n")[2],
    );
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

    // 🔄 SINCRONIZAÇÃO: Recarregar progresso antes de renderizar o card
    // Garante que "isLido" reflete o estado mais recente
    this.state.managers.progresso.sincronizarComStorage();

    console.log(
      `📄 renderDia() - diaAtualNumero=${this.state.diaAtualNumero}, dia=`,
      dia,
      `container=${container ? "OK" : "NULL"}`,
    );

    if (!container || !dia) {
      console.warn(
        `⚠️ renderDia() retornando cedo - container=${!!container}, dia=${!!dia}`,
      );
      return;
    }

    // ✅ NOVO: Aplicar deslocamento de datas se há reajuste ativo
    let diaParaRenderizar = dia;
    const deslocamento = this.state.managers.progresso.obterDeslocamentoDatas();
    if (deslocamento !== 0) {
      // Criar um Dia com datas ajustadas
      const novaDataNum = dia.numero + deslocamento;
      const novaData = parametroGerador.gerarDataISO(novaDataNum, dia.ano);
      const novaDataFormatada = parametroGerador.gerarDataBR(
        novaDataNum,
        dia.ano,
      );

      // Criar uma cópia do Dia com datas corrigidas
      diaParaRenderizar = {
        ...dia,
        data: novaData,
        dataFormatada: novaDataFormatada,
      };

      console.log(
        `🔄 Renderizando com deslocamento: dia ${dia.numero} (${dia.dataFormatada}) → ${novaDataFormatada}`,
      );
    }

    // ✅ Renderizar card
    container.innerHTML = renderDiaCard(diaParaRenderizar, {
      isHoje: diaParaRenderizar.numero === this.state.diaHojeNumero,
      isLido: this.state.managers.progresso.estaLido(diaParaRenderizar.numero),
    });

    // ✅ Atualizar estado de notas
    this.state.managers.notas.setDiaAtual(diaParaRenderizar.numero);

    // ✅ Emitir evento
    this.emit("dia-alterado", { dia: diaParaRenderizar.numero });

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

    // 🔄 SINCRONIZAÇÃO: Recarregar progresso do localStorage antes de renderizar
    // Garante que temos os dias mais recentes marcados como lidos
    progresso.sincronizarComStorage();

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
        this.state.diasBloqueados, // Passar dias bloqueados
      );
    } else {
      // Atualizar diasBloqueados no ViewModel existente
      this.state.apis.calendarioVM.diasBloqueados = this.state.diasBloqueados;
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

  /**
   * NOVO: Verificar e disparar reajuste de lacuna
   * Chamado pelo sistema quando usuário retoma leitura após atraso
   *
   * @returns {object|null} Dados da lacuna se detectada, null caso contrário
   * @public
   */
  verificarAndDispararReajuste() {
    // 🔄 SINCRONIZAÇÃO: Recarregar progresso do localStorage
    // Isso garante que temos o estado mais recente
    this.state.managers.progresso.sincronizarComStorage();

    const ultimoDiaLido = this.state.managers.progresso.getUltimoDiaLido();

    // Se nenhum dia foi lido ainda, não há lacuna
    if (ultimoDiaLido === null) {
      console.log("ℹ️ Nenhum dia lido ainda - sem verificação de lacuna");
      return null;
    }

    // ✅ Verificar se há reajuste recente (mesma data)
    // Se houver, não redetecta lacuna
    const reajusteRecente = this.state.managers.progresso.obterReajuste();
    if (reajusteRecente) {
      console.log(
        `✅ Reajuste recente encontrado - pulando detecção de lacuna`,
      );
      return null;
    }

    // Usar o dia REAL de hoje (soberano temporal)
    const diaQueDeveSerHoje = parametroGerador.getDiaDoAnoAtual();
    const totalDias = this.state.managers.plano.getTotalDias();

    console.log(
      `🔍 Verificando lacuna: ultimoDiaLido=${ultimoDiaLido}, diaQueDeveSerHoje=${diaQueDeveSerHoje}, totalDias=${totalDias}`,
    );

    // Usar reorganizador para detectar
    if (!this.reorganizador) {
      this.reorganizador = new ReorganizadorPlano();
    }

    const lacuna = this.reorganizador.detectarLacuna(
      ultimoDiaLido,
      diaQueDeveSerHoje,
      totalDias,
    );

    console.log("📊 Resultado da detecção:", lacuna);

    if (lacuna.temLacuna) {
      // ✅ Sistema DETECTOU (conforme CONTRATO)
      console.log("🔔 Lacuna detectada:", lacuna);
      this.emit("lacuna-detectada", lacuna);
      return lacuna;
    }

    console.log("✅ Nenhuma lacuna detectada");
    return null;
  }

  /**
   * NOVO: Aplicar reajuste após usuário confirmar
   * Fecha a lacuna e mapeia dias
   *
   * @returns {object} { sucesso, novoIndice, aviso }
   * @public
   */
  aplicarReajuste() {
    if (!this.reorganizador) {
      this.reorganizador = new ReorganizadorPlano();
    }

    const ultimoDiaLido = this.state.managers.progresso.getUltimoDiaLido();
    const diaAtualDoPlano = this.state.managers.plano.getIndiceAtual() + 1;

    console.log(
      `🔧 Calculando reajuste: ultimoDiaLido=${ultimoDiaLido}, diaAtualDoPlano=${diaAtualDoPlano}`,
    );

    // Calcular novo índice (próximo após parada)
    const resultadoNovoIndice = this.reorganizador.calcularNovoIndice(
      ultimoDiaLido,
      diaAtualDoPlano,
    );

    const novoNumeroDia = resultadoNovoIndice.numeroDia;
    const totalDias = this.state.managers.plano.getTotalDias();

    console.log(
      `📊 Novo dia calculado: ${novoNumeroDia} (total: ${totalDias})`,
    );

    // Verificar ultrapassagem de ciclo
    const ultrapassagem = this.reorganizador.verificarUltrapassagemCiclo(
      novoNumeroDia,
      totalDias,
    );

    if (ultrapassagem.ultrapassaCiclo) {
      // 📢 Notificação ao usuário (não requer ação)
      console.log("📅 Aviso de ultrapassagem:", ultrapassagem.aviso);
      this.emit("plano-ultrapassara-ciclo", ultrapassagem);
    }

    // Aplicar novo índice
    const diaReajustado = this.state.managers.plano.irParaDia(novoNumeroDia);

    // ⚠️ IMPORTANTE: Atualizar o estado para que render() use o novo dia
    this.state.diaAtualNumero = novoNumeroDia;

    // 💾 Salvar reajuste em localStorage para evitar redetecção
    // Agora o deslocamento é calculado para que o PRÓXIMO dia de leitura
    // (novoNumeroDia) caia exatamente na data de hoje.
    const diaHoje = this.state.diaHojeNumero; // Exemplo: 28
    this.state.managers.progresso.salvarReajuste(novoNumeroDia, diaHoje);

    // 🔄 A partir de agora NÃO marcamos mais a lacuna como "lida" artificialmente.
    // A lacuna é simplesmente desconsiderada: as datas entre a parada e o retorno
    // ficam sem plano, e o dia seguinte passa a ocupar a data de hoje.
    this.state.diasBloqueados = [];

    console.log("✅ Reajuste aplicado:", {
      novoIndice: novoNumeroDia,
      dia: diaReajustado,
      estadoAtualizado: this.state.diaAtualNumero,
    });

    // Renderizar UI atualizada
    console.log("🎨 Renderizando UI...");
    this.render();

    return {
      sucesso: true,
      novoIndice: novoNumeroDia,
      aviso: ultrapassagem.aviso,
      descricao: resultadoNovoIndice.descricao,
    };
  }
}
