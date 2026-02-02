"use strict";
/* ============================================================================
   render_dia_card.js — Renderizador do Card de Dia
   Versão: 0.2.1 (CORRIGIDO: exibição de capítulo único)
============================================================================ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderDiaCard = renderDiaCard;
/**
 * @param {Dia} dia
 * @param {Object} estadoUI
 * @param {boolean} estadoUI.isHoje
 * @param {boolean} estadoUI.isLido
 */
function renderDiaCard(dia, estadoUI = {}) {
    if (!dia) {
        return `
      <article class="dia-card erro">
        <p>Dia inválido ou inexistente.</p>
      </article>
    `;
    }
    const { isHoje = false, isLido = false } = estadoUI;
    return `
    <article 
      class="dia-card ${isHoje ? "dia-hoje" : ""} ${isLido ? "dia-lido" : ""}"
      data-dia="${dia.numero}"
    >
      <header class="dia-card-header">
        <h2>
          Dia ${dia.numero}
          ${isHoje ? '<span class="badge-hoje">HOJE</span>' : ""}
        </h2>
        <span class="dia-data">${dia.dataFormatada}</span>
      </header>

      <section class="dia-leitura">
        ${renderSecao("Antigo Testamento", dia.trechos.filter((t) => t.testamento === "antigoTestamento"))}
        ${renderSecao("Novo Testamento", dia.trechos.filter((t) => t.testamento === "novoTestamento"))}
      </section>

      <footer class="dia-card-footer">
        ${dia.observacoes
        ? `
          <div class="dia-secao">
            <h3>Observações</h3>
            <p>${dia.observacoes}</p>
          </div>
        `
        : ""}
        
        <button data-action="toggle-lido">
          ${isLido ? "Desmarcar como lido" : "Marcar como lido"}
        </button>
      </footer>
    </article>
  `;
}
/* ===================== FUNÇÃO AUXILIAR UI ===================== */
function renderSecao(titulo, leituras) {
    if (!leituras || leituras.length === 0)
        return "";
    return `
    <div class="dia-secao">
      <h3>${titulo}</h3>
      <ul>
        ${leituras
        .map((leitura) => {
        // CORREÇÃO: Se for apenas um capítulo, mostrar apenas o número
        if (leitura.capituloInicio === leitura.capituloFim) {
            return `<li>${leitura.livroNome} ${leitura.capituloInicio}</li>`;
        }
        else {
            return `<li>${leitura.livroNome} ${leitura.capituloInicio}–${leitura.capituloFim}</li>`;
        }
    })
        .join("")}
      </ul>
    </div>
  `;
}
