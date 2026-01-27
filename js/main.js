/* ============================================================================
   main.js — Orquestrador Central REFATORADO com Sistema de Busca
   Versão: 2.0.0 — COM SISTEMA DE RESET E BUSCA INTEGRADOS
============================================================================ */

/* ===================== IMPORTAÇÕES ===================== */
import planoCronologico from "./dominio/planos/plano_cronologico.js";
import { PlanoManager } from "./dominio/planos/config/PlanoManager.js";
import { ProgressoLeitura } from "./dominio/planos/config/ProgressoLeitura.js";

// NOVO: Import do sistema de busca
import { SearchEngine } from "./dominio/busca/SearchEngine.js";
import { SearchUI } from "./ui/busca/search_ui.js";

// NOVO: Import do ResetProgresso
import { ResetProgresso } from "./dominio/planos/config/ResetProgresso.js";

import { renderDiaCard } from "./ui/planos/render_dia_card.js";
import { renderCalendario } from "./ui/calendario/render_calendario.js";

import { NotasLeituraManager } from "./dominio/notas/NotasLeituraManager.js";
import { initNotasOverlay } from "./dominio/notas/notas_overlay.js";

// NOVO: Import do Dark Mode
import { initDarkMode } from "./ui/darkmode.js";

/* 🔧 RELÓGIO CENTRAL (ANO REAL → POSIÇÃO NO PLANO) */
import { getDiaDoAnoAtual } from "./dominio/geradorDatas.js";

/* ===================== ESTADO GLOBAL ===================== */
let diaAtualNumero = 1;
let diaHojeNumero = 1;

let planoManagerGlobal;
let progressoGlobal;
let notasManagerGlobal;
let calendarioAPI = null;
let resetManagerGlobal;

// NOVO: Variáveis para sistema de busca
let searchEngineGlobal = null;
let searchUIGlobal = null;

/* ===================== RESOLVER "HOJE" ===================== */
function descobrirDiaDeHoje(plano) {
  const diaDoAno = getDiaDoAnoAtual();
  if (diaDoAno < 1) return 1;
  if (diaDoAno > plano.dias.length) return plano.dias.length;
  return diaDoAno;
}

/* ===================== FUNÇÃO: SCROLL PARA CARD ===================== */
function scrollParaCardDoDia() {
  setTimeout(() => {
    const cardDia = document.getElementById("card-dia");
    if (cardDia) {
      cardDia.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      cardDia.classList.add("card-highlight");
      setTimeout(() => cardDia.classList.remove("card-highlight"), 1500);
    }
  }, 100);
}

/* ============================================================================
   FUNÇÃO: GERAR DADOS DO CALENDÁRIO
   CORREÇÃO: Prevenir espelhamento usando apenas dados válidos
============================================================================ */
function gerarDadosCalendario(plano, progresso) {
  const todosDiasDoAno = [];

  // Criar um mapa rápido de dias do plano por dataISO
  const diasPlanoPorData = new Map();
  plano.dias.forEach((dia) => {
    if (dia.data) {
      diasPlanoPorData.set(dia.data, {
        numero: dia.numero,
        dataISO: dia.data,
        // Estados SÓ se aplicam a dias que existem no plano
        isHoje: dia.numero === diaHojeNumero,
        isLido: progresso.estaLido(dia.numero),
        isAtivo: dia.numero === diaAtualNumero,
      });
    }
  });

  // Usar gerador de datas para criar todos os dias do ano
  const ano = 2026; // Ano fixo do plano
  for (let diaNumero = 1; diaNumero <= 366; diaNumero++) {
    const data = new Date(ano, 0, diaNumero);
    const anoStr = String(data.getFullYear());
    const mesStr = String(data.getMonth() + 1).padStart(2, "0");
    const diaStr = String(data.getDate()).padStart(2, "0");
    const dataISO = `${anoStr}-${mesStr}-${diaStr}`;

    // Verificar se este dia existe no plano
    const diaDoPlano = diasPlanoPorData.get(dataISO);

    if (diaDoPlano) {
      // Dia existe no plano - usar dados reais
      todosDiasDoAno.push(diaDoPlano);
    } else {
      // Dia não existe no plano - criar objeto vazio SEM estados
      todosDiasDoAno.push({
        numero: null,
        dataISO: dataISO,
        isHoje: false,
        isLido: false,
        isAtivo: false,
        semPlano: true,
      });
    }
  }

  return todosDiasDoAno;
}

/* ============================================================================
   FUNÇÃO: ATUALIZAR CALENDÁRIO
============================================================================ */
function atualizarCalendario(plano, progresso) {
  const dadosCalendario = {
    containerId: "calendario",
    dias: gerarDadosCalendario(plano, progresso),
    onSelecionarDia: (numeroDia) => {
      if (numeroDia && numeroDia > 0) {
        diaAtualNumero = numeroDia;
        atualizarDiaAtivo(
          planoManagerGlobal,
          progressoGlobal,
          notasManagerGlobal,
        );
        scrollParaCardDoDia();
        if (calendarioAPI) calendarioAPI.highlightDay(numeroDia);
      }
    },
  };

  calendarioAPI = renderCalendario(dadosCalendario);
}

/* ============================================================================
   FUNÇÃO: ATUALIZAR DIA ATIVO
============================================================================ */
function atualizarDiaAtivo(planoManager, progresso, notasManager) {
  const plano = planoManager.getPlano();
  const dia = plano.getDia(diaAtualNumero);
  const container = document.getElementById("dia-view");

  if (!container || !dia) {
    console.error("Container ou dia não encontrado:", { diaAtualNumero, dia });
    return;
  }

  // 1. Renderizar card do dia
  container.innerHTML = renderDiaCard(dia, {
    isHoje: dia.numero === diaHojeNumero,
    isLido: progresso.estaLido(dia.numero),
  });

  // 2. Configurar botão "marcar como lido"
  const btnLido = container.querySelector("[data-action='toggle-lido']");
  if (btnLido) {
    btnLido.addEventListener("click", () => {
      progresso.alternar(dia.numero);
      atualizarDiaAtivo(planoManager, progresso, notasManager);
      atualizarEstatisticas(plano, progresso);
      atualizarCalendario(plano, progresso);
    });
  }

  // 3. Sincronizar notas
  notasManager.setDiaAtual(dia.numero);
  document.dispatchEvent(new CustomEvent("dia-alterado"));

  // 4. Atualizar navegação
  atualizarNavegacao(plano.dias.length);

  // 5. Destacar no calendário
  if (calendarioAPI) {
    calendarioAPI.highlightDay(dia.numero);
  }
}

/* ===================== NAVEGAÇÃO ===================== */
function atualizarNavegacao(total) {
  const btnAnterior = document.getElementById("btn-dia-anterior");
  const btnProximo = document.getElementById("btn-dia-proximo");
  if (btnAnterior) btnAnterior.disabled = diaAtualNumero <= 1;
  if (btnProximo) btnProximo.disabled = diaAtualNumero >= total;
}

/* ===================== ESTATÍSTICAS ===================== */
function atualizarEstatisticas(plano, progresso) {
  const lidos = progresso.getTotalLidos();
  const total = plano.dias.length;
  const percentual = Math.round((lidos / total) * 100);
  document.getElementById("dias-lidos").textContent = lidos;
  document.getElementById("progresso").textContent = `${percentual}%`;
}

/* ===================== FUNÇÃO DE NAVEGAÇÃO ===================== */
function navegarParaDia(numeroDia) {
  const plano = planoManagerGlobal?.getPlano();
  if (!plano) return false;

  if (numeroDia < 1 || numeroDia > plano.dias.length) return false;

  diaAtualNumero = numeroDia;
  atualizarDiaAtivo(planoManagerGlobal, progressoGlobal, notasManagerGlobal);
  atualizarCalendario(plano, progressoGlobal);
  scrollParaCardDoDia();
  return true;
}

/* ============================================================================
   FUNÇÃO: CALLBACK PARA SELEÇÃO DE DIA VIA BUSCA
   Responsável por navegar para o dia selecionado nos resultados da busca
============================================================================ */
function onSelecionarDiaViaBusca(diaNumero) {
  navegarParaDia(diaNumero);
}

/* ============================================================================
   FUNÇÃO: INICIALIZAR SISTEMA DE BUSCA
   Configura o motor de busca e a interface de usuário
============================================================================ */
function inicializarSistemaDeBusca(plano) {
  try {
    // 1. Criar motor de busca com índice do plano
    searchEngineGlobal = new SearchEngine(plano);

    // 2. Criar interface de busca
    searchUIGlobal = new SearchUI(searchEngineGlobal, onSelecionarDiaViaBusca);

    // 3. Mostrar estatísticas do índice (apenas para debug)
    console.log(
      "📊 Estatísticas do índice de busca:",
      searchEngineGlobal.getEstatisticas(),
    );

    console.log("✅ Sistema de busca inicializado com sucesso");
    return true;
  } catch (error) {
    console.error("❌ Erro ao inicializar sistema de busca:", error);
    return false;
  }
}

/* ============================================================================
   FUNÇÃO: CONFIGURAR ATALHOS DE TECLADO GLOBAIS
   Inclui atalhos para busca e navegação
============================================================================ */
function configurarAtalhosDeTeclado() {
  document.addEventListener("keydown", (e) => {
    // Atalho: Ctrl/Cmd + F para focar na busca
    if ((e.ctrlKey || e.metaKey) && e.key === "f") {
      e.preventDefault();
      if (searchUIGlobal) {
        searchUIGlobal.focus();
      }
      return;
    }

    // Atalho: Barra (/) para focar na busca (exceto quando já em input)
    if (
      e.key === "/" &&
      !e.ctrlKey &&
      !e.metaKey &&
      e.target.tagName !== "INPUT" &&
      e.target.tagName !== "TEXTAREA"
    ) {
      e.preventDefault();
      if (searchUIGlobal) {
        searchUIGlobal.focus();
      }
      return;
    }

    // Navegação por setas (mantido do código original)
    if (
      e.key === "ArrowRight" &&
      !e.altKey &&
      diaAtualNumero < planoManagerGlobal.getPlano().dias.length
    ) {
      e.preventDefault();
      navegarParaDia(diaAtualNumero + 1);
    }
    if (e.key === "ArrowLeft" && !e.altKey && diaAtualNumero > 1) {
      e.preventDefault();
      navegarParaDia(diaAtualNumero - 1);
    }
    if (
      e.key === " " &&
      !e.ctrlKey &&
      !e.altKey &&
      e.target.tagName !== "BUTTON"
    ) {
      e.preventDefault();
      document.querySelector("[data-action='toggle-lido']")?.click();
    }
  });
}

/* ============================================================================
   FUNÇÃO: CONFIGURAR EVENTO DE RESET
   Responsável por sincronizar UI após reset de progresso
============================================================================ */
function configurarEventoReset() {
  document.addEventListener("progresso-resetado", (evento) => {
    console.log("🔄 Evento de progresso resetado recebido", evento.detail);

    const plano = planoManagerGlobal?.getPlano();
    if (plano && progressoGlobal) {
      // Forçar atualização do calendário
      atualizarCalendario(plano, progressoGlobal);

      // Atualizar estatísticas
      atualizarEstatisticas(plano, progressoGlobal);

      // Atualizar card do dia ativo
      atualizarDiaAtivo(
        planoManagerGlobal,
        progressoGlobal,
        notasManagerGlobal,
      );
    }
  });
}

/* ===================== INIT ===================== */
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Inicializando aplicação com sistema de busca...");

  try {
    // 0. Inicializar Dark Mode (deve vir primeiro)
    initDarkMode();

    // 1. Inicializar núcleo do aplicativo
    planoManagerGlobal = new PlanoManager(planoCronologico);
    progressoGlobal = new ProgressoLeitura();
    notasManagerGlobal = new NotasLeituraManager();
    const plano = planoManagerGlobal.getPlano();

    // 2. Resolver "hoje" no plano
    diaHojeNumero = descobrirDiaDeHoje(plano);
    diaAtualNumero = diaHojeNumero;
    console.log(`📍 Dia de hoje no plano: ${diaHojeNumero}`);
    console.log(`📊 Total de dias no plano: ${plano.dias.length}`);

    // 3. Inicializar sistema de busca (NOVO)
    inicializarSistemaDeBusca(plano);

    // 4. Inicializar sistema de reset de progresso
    resetManagerGlobal = new ResetProgresso(
      progressoGlobal,
      planoManagerGlobal,
    );
    resetManagerGlobal.inicializar();

    // 5. Configurar listeners para eventos de reset
    configurarEventoReset();

    // 6. Atualizar indicadores na navbar
    document.getElementById("total-dias").textContent = plano.dias.length;

    // 7. Inicializar dia ativo (card do dia)
    atualizarDiaAtivo(planoManagerGlobal, progressoGlobal, notasManagerGlobal);
    atualizarEstatisticas(plano, progressoGlobal);

    // 8. Inicializar calendário (IMPORTANTE: depois de definir diaAtualNumero)
    atualizarCalendario(plano, progressoGlobal);

    // 9. Configurar navegação principal (botões anterior/próximo)
    document
      .getElementById("btn-dia-proximo")
      ?.addEventListener("click", () => {
        if (diaAtualNumero < plano.dias.length)
          navegarParaDia(diaAtualNumero + 1);
      });

    document
      .getElementById("btn-dia-anterior")
      ?.addEventListener("click", () => {
        if (diaAtualNumero > 1) navegarParaDia(diaAtualNumero - 1);
      });

    // 10. Inicializar sistema de notas
    initNotasOverlay(notasManagerGlobal);

    // 11. Configurar atalhos de teclado globais (incluindo busca)
    configurarAtalhosDeTeclado();

    console.log("✅ Aplicação inicializada com sistema de busca!");
  } catch (error) {
    console.error("❌ Erro na inicialização:", error);
    const container = document.getElementById("dia-view");
    if (container) {
      container.innerHTML = `
        <div class="dia-card erro">
          <h2>Erro na inicialização</h2>
          <p>${error.message}</p>
          <button onclick="location.reload()">Recarregar</button>
        </div>
      `;
    }
  }
});
