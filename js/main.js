/* ============================================================================
   main.js — Orquestrador Central
   Versão: 0.9.2 — ETAPA 3.3 (HOTFIX DIA ATUAL)
============================================================================ */

/* ===================== IMPORTAÇÕES ===================== */
import planoCronologico from "./dominio/planos/plano_cronologico.js";
import { PlanoManager } from "./dominio/planos/config/PlanoManager.js";
import { ProgressoLeitura } from "./dominio/planos/config/ProgressoLeitura.js";

import { renderPlanoCronologico } from "./ui/planos/render_plano.js";
import { renderDiaCard } from "./ui/planos/render_dia_card.js";

import { NotasLeituraManager } from "./dominio/notas/NotasLeituraManager.js";
import { initNotasOverlay } from "./dominio/notas/notas_overlay.js";

/* 🔧 RELÓGIO CENTRAL (ANO REAL → POSIÇÃO NO PLANO) */
import { getDiaDoAnoAtual } from "./dominio/geradorDatas.js";

/* ===================== ESTADO GLOBAL ===================== */
/**
 * REGRA DE OURO:
 * ----------------------------------------------------------------------------
 * - main.js é o ÚNICO arquivo que decide qual dia está ativo
 * - toda navegação e sincronização passam por aqui
 */
let diaAtualNumero = 1;
let diaHojeNumero = 1;

/* ===================== RESOLVER "HOJE" ===================== */
/**
 * Resolve o dia atual do plano com base no dia do ano
 * REGRA:
 * - Dia 1 do plano = 1º de janeiro
 * - Independe do ANO do plano (ex: 2026)
 */
function descobrirDiaDeHoje(plano) {
  const diaDoAno = getDiaDoAnoAtual();

  if (diaDoAno < 1) return 1;
  if (diaDoAno > plano.dias.length) return plano.dias.length;

  return diaDoAno;
}

/* ===================== ATUALIZAÇÃO CENTRAL ===================== */
/**
 * FUNÇÃO NÚCLEO DA ETAPA 3
 * ----------------------------------------------------------------------------
 * Sempre que algo muda:
 * - navegação
 * - progresso
 * - inicialização
 *
 * ESTA função é chamada.
 */
function atualizarDiaAtivo(planoManager, progresso, notasManager) {
  const plano = planoManager.getPlano();
  const dia = plano.getDia(diaAtualNumero);
  const container = document.getElementById("dia-view");

  if (!container || !dia) return;

  /* ===== Render ===== */
  container.innerHTML = renderDiaCard(dia, {
    isHoje: dia.numero === diaHojeNumero,
    isLido: progresso.estaLido(dia.numero),
  });

  /* ===== Progresso ===== */
  container
    .querySelector("[data-action='toggle-lido']")
    ?.addEventListener("click", () => {
      progresso.alternar(dia.numero);
      atualizarDiaAtivo(planoManager, progresso, notasManager);
      atualizarEstatisticas(plano, progresso);
    });

  /* ===== Notas ===== */
  notasManager.setDiaAtual(dia.numero);
  document.dispatchEvent(new CustomEvent("dia-alterado"));

  atualizarNavegacao(plano.dias.length);
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
  const percentual = Math.round((lidos / total) * 100);

  document.getElementById("dias-lidos").textContent = lidos;
  document.getElementById("progresso").textContent = `${percentual}%`;
}

/* ===================== INIT ===================== */
document.addEventListener("DOMContentLoaded", () => {
  try {
    /* ===== Núcleo de domínio ===== */
    const planoManager = new PlanoManager(planoCronologico);
    const progresso = new ProgressoLeitura();
    const notasManager = new NotasLeituraManager();
    const plano = planoManager.getPlano();

    /* ===== Resolver "HOJE" (CORRIGIDO) ===== */
    diaHojeNumero = descobrirDiaDeHoje(plano);
    diaAtualNumero = diaHojeNumero;

    /* ===== Indicadores globais ===== */
    document.getElementById("total-dias").textContent = plano.dias.length;

    /* ===== MODO LISTA (VISÃO GERAL) ===== */
    renderPlanoCronologico({
      containerId: "plano-leitura",
      plano: plano.dias.map((dia) => ({
        html: renderDiaCard(dia, {
          isHoje: dia.numero === diaHojeNumero,
          isLido: progresso.estaLido(dia.numero),
        }),
      })),
    });

    /* ===== MODO DIA (FOCO ATUAL) ===== */
    atualizarDiaAtivo(planoManager, progresso, notasManager);
    atualizarEstatisticas(plano, progresso);

    /* ===== Navegação ===== */
    document
      .getElementById("btn-dia-proximo")
      ?.addEventListener("click", () => {
        if (diaAtualNumero < plano.dias.length) {
          diaAtualNumero++;
          atualizarDiaAtivo(planoManager, progresso, notasManager);
        }
      });

    document
      .getElementById("btn-dia-anterior")
      ?.addEventListener("click", () => {
        if (diaAtualNumero > 1) {
          diaAtualNumero--;
          atualizarDiaAtivo(planoManager, progresso, notasManager);
        }
      });

    /* ===== Notas ===== */
    initNotasOverlay(notasManager);
  } catch (e) {
    console.error("Erro crítico:", e);
  }
});
