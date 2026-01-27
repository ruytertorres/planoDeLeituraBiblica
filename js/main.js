/* ============================================================================
   main.js — Orquestrador Central
   Versão: 2.1.0 — REFATORAÇÃO COM CALENDARIO VIEWMODEL
============================================================================ */

/* ===================== IMPORTAÇÕES ===================== */
import planoCronologico from "./core/services/planos/plano_cronologico.js";
import { PlanoManager } from "./core/services/planos/PlanoManager.js";
import { ProgressoLeitura } from "./core/services/planos/ProgressoLeitura.js";

import { SearchEngine } from "./core/services/busca/SearchEngine.js";
import { SearchUI } from "./ui/components/busca/search_ui.js";

import { ResetProgressoOrquestrador } from "./core/services/planos/ResetProgressoOrquestrador.js";
import { ResetModal } from "./ui/componentes/ResetModal.js";

import { renderDiaCard } from "./ui/components/planos/render_dia_card.js";
import { renderCalendario } from "./ui/components/calendario/render_calendario.js";
import { CalendarioViewModel } from "./ui/components/calendario/CalendarioViewModel.js";

import { NotasLeituraManager } from "./core/services/notas/NotasLeituraManager.js";
import { initNotasOverlay } from "./core/services/notas/notas_overlay.js";

import { initDarkMode } from "./ui/components/darkmode.js";
import {
  getDiaDoAnoAtual,
  getAnoAtual,
} from "./core/models/parametroGerador.js";

/* ===================== ESTADO GLOBAL ===================== */
let diaAtualNumero = 1;
let diaHojeNumero = 1;

let planoManagerGlobal;
let progressoGlobal;
let notasManagerGlobal;
let calendarioAPI = null;
let calendarioVM = null;
let resetOrquestrador = null;
let resetModal = null;

let searchEngineGlobal = null;
let searchUIGlobal = null;

/* ===================== RESOLVER "HOJE" ===================== */
function descobrirDiaDeHoje(plano) {
  const diaDoAno = getDiaDoAnoAtual();
  if (diaDoAno < 1) return 1;
  if (diaDoAno > plano.dias.length) return plano.dias.length;
  return diaDoAno;
}

/* ===================== SCROLL PARA CARD ===================== */
function scrollParaCardDoDia() {
  setTimeout(() => {
    const cardDia = document.getElementById("card-dia");
    if (!cardDia) return;

    cardDia.scrollIntoView({ behavior: "smooth", block: "start" });
    cardDia.classList.add("card-highlight");
    setTimeout(() => cardDia.classList.remove("card-highlight"), 1500);
  }, 100);
}

/* ===================== CALENDÁRIO ===================== */
function atualizarCalendario(plano, progresso) {
  if (!calendarioVM) {
    calendarioVM = new CalendarioViewModel(
      plano,
      progresso,
      () => diaHojeNumero,
      () => diaAtualNumero,
      (numeroDia) => {
        if (!numeroDia) return;

        diaAtualNumero = numeroDia;
        atualizarDiaAtivo(
          planoManagerGlobal,
          progressoGlobal,
          notasManagerGlobal,
        );
        scrollParaCardDoDia();
        calendarioAPI?.highlightDay(numeroDia);
      },
    );
  }

  // Obter ano real de geradorDatas (Contrato §2.1)
  const anoAtual = getAnoAtual();

  // Gerar ViewModel (estrutura pronta para renderizar)
  const viewModel = calendarioVM.gerarViewModel(anoAtual);

  // Renderizar (função burra que apenas desenha)
  calendarioAPI = renderCalendario({
    containerId: "calendario",
    viewModel,
  });
}

/* ===================== DIA ATIVO ===================== */
function atualizarDiaAtivo(planoManager, progresso, notasManager) {
  const plano = planoManager.getPlano();
  const dia = plano.getDia(diaAtualNumero);
  const container = document.getElementById("dia-view");

  if (!container || !dia) return;

  container.innerHTML = renderDiaCard(dia, {
    isHoje: dia.numero === diaHojeNumero,
    isLido: progresso.estaLido(dia.numero),
  });

  const btnLido = container.querySelector("[data-action='toggle-lido']");
  btnLido?.addEventListener("click", () => {
    progresso.alternar(dia.numero);
    atualizarDiaAtivo(planoManager, progresso, notasManager);
    atualizarEstatisticas(plano, progresso);
    atualizarCalendario(plano, progresso);
  });

  notasManager.setDiaAtual(dia.numero);
  document.dispatchEvent(new CustomEvent("dia-alterado"));

  atualizarNavegacao(plano.dias.length);
  calendarioAPI?.highlightDay(dia.numero);
}

/* ===================== NAVEGAÇÃO ===================== */
function atualizarNavegacao(total) {
  document.getElementById("btn-dia-anterior").disabled = diaAtualNumero <= 1;
  document.getElementById("btn-dia-proximo").disabled = diaAtualNumero >= total;
}

/* ===================== ESTATÍSTICAS ===================== */
function atualizarEstatisticas(plano, progresso) {
  const lidos = progresso.getTotalLidos();
  const total = plano.dias.length;
  document.getElementById("dias-lidos").textContent = lidos;
  document.getElementById("progresso").textContent =
    `${Math.round((lidos / total) * 100)}%`;
}

/* ===================== NAVEGAR ===================== */
function navegarParaDia(numeroDia) {
  const plano = planoManagerGlobal.getPlano();
  if (numeroDia < 1 || numeroDia > plano.dias.length) return false;

  diaAtualNumero = numeroDia;
  atualizarDiaAtivo(planoManagerGlobal, progressoGlobal, notasManagerGlobal);
  atualizarCalendario(plano, progressoGlobal);
  scrollParaCardDoDia();
  return true;
}

/* ===================== BUSCA ===================== */
function onSelecionarDiaViaBusca(diaNumero) {
  navegarParaDia(diaNumero);
}

function inicializarSistemaDeBusca(plano) {
  searchEngineGlobal = new SearchEngine(plano);
  searchUIGlobal = new SearchUI(searchEngineGlobal, onSelecionarDiaViaBusca);
}

/* ===================== ATALHOS ===================== */
function configurarAtalhosDeTeclado() {
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "f") {
      e.preventDefault();
      searchUIGlobal?.focus();
    }

    if (e.key === "/" && e.target.tagName !== "INPUT") {
      e.preventDefault();
      searchUIGlobal?.focus();
    }

    if (e.key === "ArrowRight") navegarParaDia(diaAtualNumero + 1);
    if (e.key === "ArrowLeft") navegarParaDia(diaAtualNumero - 1);
    if (e.key === " ")
      document.querySelector("[data-action='toggle-lido']")?.click();
  });
}

/* ===================== RESET ===================== */
function configurarEventoReset() {
  document.addEventListener("progresso-resetado", () => {
    const plano = planoManagerGlobal.getPlano();
    atualizarCalendario(plano, progressoGlobal);
    atualizarEstatisticas(plano, progressoGlobal);
    atualizarDiaAtivo(planoManagerGlobal, progressoGlobal, notasManagerGlobal);
  });
}

function inicializarResetProgresso() {
  // Criar orquestrador (domínio)
  resetOrquestrador = new ResetProgressoOrquestrador(
    progressoGlobal,
    planoManagerGlobal,
  );

  // Criar modal (UI) com referência ao orquestrador
  resetModal = new ResetModal(resetOrquestrador);
  resetModal.inicializar();

  // Configurar reação aos eventos de reset
  configurarEventoReset();
}

/* ===================== INIT ===================== */
document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();

  planoManagerGlobal = new PlanoManager(planoCronologico);
  progressoGlobal = new ProgressoLeitura();
  notasManagerGlobal = new NotasLeituraManager();

  const plano = planoManagerGlobal.getPlano();

  diaHojeNumero = descobrirDiaDeHoje(plano);
  diaAtualNumero = diaHojeNumero;

  inicializarSistemaDeBusca(plano);

  inicializarResetProgresso();

  document.getElementById("total-dias").textContent = plano.dias.length;

  atualizarDiaAtivo(planoManagerGlobal, progressoGlobal, notasManagerGlobal);
  atualizarEstatisticas(plano, progressoGlobal);
  atualizarCalendario(plano, progressoGlobal);

  document
    .getElementById("btn-dia-proximo")
    ?.addEventListener("click", () => navegarParaDia(diaAtualNumero + 1));

  document
    .getElementById("btn-dia-anterior")
    ?.addEventListener("click", () => navegarParaDia(diaAtualNumero - 1));

  initNotasOverlay(notasManagerGlobal);
  configurarAtalhosDeTeclado();
});
