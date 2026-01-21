/* ============================================================================
   main.js — Orquestrador Central
   Versão: 1.2.0 — CALENDÁRIO CORRIGIDO SEM ESPELHAMENTO
============================================================================ */

/* ===================== IMPORTAÇÕES ===================== */
import planoCronologico from "./dominio/planos/plano_cronologico.js";
import { PlanoManager } from "./dominio/planos/config/PlanoManager.js";
import { ProgressoLeitura } from "./dominio/planos/config/ProgressoLeitura.js";

import { renderDiaCard } from "./ui/planos/render_dia_card.js";
import { renderCalendario } from "./ui/calendario/render_calendario.js";

import { NotasLeituraManager } from "./dominio/notas/NotasLeituraManager.js";
import { initNotasOverlay } from "./dominio/notas/notas_overlay.js";

/* 🔧 RELÓGIO CENTRAL (ANO REAL → POSIÇÃO NO PLANO) */
import { getDiaDoAnoAtual } from "./dominio/geradorDatas.js";

/* ===================== ESTADO GLOBAL ===================== */
let diaAtualNumero = 1;
let diaHojeNumero = 1;

let planoManagerGlobal;
let progressoGlobal;
let notasManagerGlobal;
let calendarioAPI = null;

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
  // Mapear TODOS os dias do ano (1 a 366) para garantir estrutura completa
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
    // Gerar data ISO para este dia do ano
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
        numero: null, // Importante: null indica que não é um dia do plano
        dataISO: dataISO,
        isHoje: false, // Não pode ser hoje se não existe no plano
        isLido: false, // Não pode ser lido se não existe no plano
        isAtivo: false, // Não pode ser ativo se não existe no plano
        semPlano: true, // Flag especial para dias sem plano
      });
    }
  }

  return todosDiasDoAno;
}

/* ============================================================================
   FUNÇÃO: ATUALIZAR CALENDÁRIO
============================================================================ */
function atualizarCalendario(plano, progresso) {
  console.log("📅 Atualizando calendário...");

  // Gerar dados CORRETOS sem espelhamento
  const dadosCalendario = {
    containerId: "calendario",
    dias: gerarDadosCalendario(plano, progresso),
    onSelecionarDia: (numeroDia) => {
      console.log(`📅 Calendário: navegando para dia ${numeroDia}`);
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

  console.log(
    `📖 Atualizando para dia ${diaAtualNumero} - ${dia.dataFormatada}`,
  );

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
      console.log(
        `✅ Dia ${dia.numero} ${progresso.estaLido(dia.numero) ? "lido" : "não lido"}`,
      );
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

/* ===================== INIT ===================== */
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Inicializando aplicação...");

  try {
    // 1. Inicializar núcleo
    planoManagerGlobal = new PlanoManager(planoCronologico);
    progressoGlobal = new ProgressoLeitura();
    notasManagerGlobal = new NotasLeituraManager();
    const plano = planoManagerGlobal.getPlano();

    // 2. Resolver "hoje"
    diaHojeNumero = descobrirDiaDeHoje(plano);
    diaAtualNumero = diaHojeNumero;
    console.log(`📍 Dia de hoje no plano: ${diaHojeNumero}`);
    console.log(`📊 Total de dias no plano: ${plano.dias.length}`);

    // 3. Atualizar indicadores
    document.getElementById("total-dias").textContent = plano.dias.length;

    // 4. Inicializar dia ativo
    atualizarDiaAtivo(planoManagerGlobal, progressoGlobal, notasManagerGlobal);
    atualizarEstatisticas(plano, progressoGlobal);

    // 5. Inicializar calendário (IMPORTANTE: depois de definir diaAtualNumero)
    atualizarCalendario(plano, progressoGlobal);

    // 6. Configurar navegação principal
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

    // 7. Inicializar notas
    initNotasOverlay(notasManagerGlobal);

    // 8. Atalhos de teclado
    document.addEventListener("keydown", (e) => {
      if (
        e.key === "ArrowRight" &&
        !e.altKey &&
        diaAtualNumero < plano.dias.length
      ) {
        e.preventDefault();
        navegarParaDia(diaAtualNumero + 1);
      }
      if (e.key === "ArrowLeft" && !e.altKey && diaAtualNumero > 1) {
        e.preventDefault();
        navegarParaDia(diaAtualNumero - 1);
      }
      if (e.key === " " && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        document.querySelector("[data-action='toggle-lido']")?.click();
      }
    });

    console.log("✅ Aplicação inicializada!");
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
