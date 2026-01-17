/* ============================================================================
   main.js — Orquestrador Central de Inicialização
   Versão: 0.7
   Aplicação: Leitura Cronológica Controlada da Bíblia
============================================================================ */

/* ============================================================================
   IMPORTAÇÕES
============================================================================ */

/* Domínio — Plano */
import planoCronologico from "./dominio/planos/plano_cronologico.js";

/* Domínio — Orquestração */
import { PlanoManager } from "./dominio/planos/PlanoManager.js";

/* Domínio — Progresso */
import { ProgressoLeitura } from "./dominio/planos/ProgressoLeitura.js";

/* UI — Renderização */
import { renderPlanoCronologico } from "./ui/render_plano.js";

/* NOTAS FLUTUANTES */
import { NotasLeituraManager } from "./dominio/notas/NotasLeituraManager.js";
import { initNotasOverlay } from "./ui/notas/notas_overlay.js";


/* ============================================================================
   ADAPTADOR — DIA → HTML (UI NÃO CONHECE DOMÍNIO)
============================================================================ */

function converterDiasParaHTML(dias) {
  return dias.map((dia) => {
    const { numero, data } = dia.getResumo();
    const antigo = dia.getAntigoTestamento();
    const novo = dia.getNovoTestamento();
    const obs = dia.getObservacoes();

    const renderTrechos = (titulo, trechos) => `
      <div class="${titulo.toLowerCase().replace(" ", "-")}">
        <h4>${titulo}</h4>
        ${trechos.map(t => `
          <div class="trecho">
            <span class="livro-nome">${t.livroNome}</span>
            <span class="capitulos">
              Capítulos ${t.capituloInicio}${t.capituloFim > t.capituloInicio ? `-${t.capituloFim}` : ""}
            </span>
          </div>
        `).join("")}
      </div>
    `;

    const html = `
      <div class="dia" data-numero="${numero}" data-data="${data}">
        <div class="dia-header">
          <h3>Dia ${numero}</h3>
          <span class="dia-date">${formatarDataExtenso(data)}</span>
        </div>

        <div class="dia-conteudo">
          ${antigo.length ? renderTrechos("Antigo Testamento", antigo) : ""}
          ${novo.length ? renderTrechos("Novo Testamento", novo) : ""}
        </div>

        ${obs ? `<div class="observacoes">${formatarObservacoes(obs)}</div>` : ""}

        <div class="dia-controles">
          <button class="btn btn-secondary marcar-lido" data-dia="${numero}">
            Marcar como lido
          </button>
        </div>
      </div>
    `;

    return { html };
  });
}

/* ============================================================================
   FUNÇÕES AUXILIARES
============================================================================ */

function formatarDataExtenso(dataISO) {
  return new Date(dataISO).toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatarObservacoes(obs) {
  return obs
    .split(",")
    .map(tag => `<span class="tag">${tag.trim()}</span>`)
    .join(" ");
}

/* ============================================================================
   BOOTSTRAP DA APLICAÇÃO
============================================================================ */

document.addEventListener("DOMContentLoaded", () => {
  try {
    console.log("Inicializando aplicação...");

    /* ------------------------------------------------------------------------
       CAMADA 1 — DOMÍNIO
    ------------------------------------------------------------------------ */

    const planoManager = new PlanoManager(planoCronologico);
    const progresso = new ProgressoLeitura(planoManager);

    const dias = planoManager.getPlano().dias;
    console.log(`Plano carregado: ${dias.length} dias`);

    document.getElementById("total-dias").textContent = dias.length;

    /* ------------------------------------------------------------------------
       CAMADA 2 — ADAPTAÇÃO PARA UI
    ------------------------------------------------------------------------ */

    const planoComHTML = converterDiasParaHTML(dias);

    /* ------------------------------------------------------------------------
       CAMADA 3 — RENDERIZAÇÃO
    ------------------------------------------------------------------------ */

    renderPlanoCronologico({
      containerId: "plano-leitura",
      plano: planoComHTML,
    });

    /* ------------------------------------------------------------------------
       PASSO 4.3 — RESTAURAR ESTADO VISUAL
    ------------------------------------------------------------------------ */

    dias.forEach((dia) => {
      if (progresso.estaLido(dia.numero)) {
        const el = document.querySelector(`.dia[data-numero="${dia.numero}"]`);
        const btn = el?.querySelector(".marcar-lido");

        if (el && btn) {
          el.classList.add("dia-lido");
          btn.innerHTML = '<i class="fas fa-check-circle"></i> Lido';
          btn.title = "Desmarcar";
        }
      }
    });

    /* ------------------------------------------------------------------------
       PASSO 4.4 — EVENTOS (UI NÃO CONTROLA ESTADO)
    ------------------------------------------------------------------------ */

    document.querySelectorAll(".marcar-lido").forEach((btn) => {
      btn.addEventListener("click", function () {
        const numero = Number(this.dataset.dia);
        const el = document.querySelector(`.dia[data-numero="${numero}"]`);

        progresso.alternar(numero);

        if (progresso.estaLido(numero)) {
          el.classList.add("dia-lido");
          this.innerHTML = '<i class="fas fa-check-circle"></i> Lido';
        } else {
          el.classList.remove("dia-lido");
          this.innerHTML =
            '<i class="far fa-check-circle"></i> Marcar como lido';
        }

        atualizarEstatisticas();
      });
    });

    /* ------------------------------------------------------------------------
       ESTATÍSTICAS
    ------------------------------------------------------------------------ */

    function atualizarEstatisticas() {
      const lidos = progresso.getTotalLidos();
      const total = dias.length;
      const percentual = Math.round((lidos / total) * 100);

      document.getElementById("dias-lidos").textContent = lidos;
      document.getElementById("progresso").textContent = `${percentual}%`;
    }

    atualizarEstatisticas();

    console.log("Aplicação inicializada com sucesso.");

  } catch (erro) {
    console.error("Falha crítica:", erro);
    document.getElementById("plano-leitura").innerHTML = `
      <div class="error-state">
        <p>Erro ao carregar o plano</p>
        <pre>${erro.message}</pre>
      </div>
    `;
  }
  
  /* ------------------------------------------------------------------------
   BLOCO DE ANOTAÇÕES
------------------------------------------------------------------------ */

const notasManager = new NotasLeituraManager();
initNotasOverlay(notasManager);

  
});
