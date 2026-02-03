/* ============================================================================
   render_dia_card.js — Renderizador do Card de Dia
   Versão: 0.2.1 (CORRIGIDO: exibição de capítulo único)
============================================================================ */

/**
 * @param {Dia} dia
 * @param {Object} estadoUI
 * @param {boolean} estadoUI.isHoje
 * @param {boolean} estadoUI.isLido
 */
export function renderDiaCard(dia, estadoUI = {}) {
  if (!dia) {
    return `
      <article class="dia-card erro">
        <p>Dia inválido ou inexistente.</p>
      </article>
    `;
  }

  const { isHoje = false, isLido = false } = estadoUI;

  // CORREÇÃO CRÍTICA: Processar trechos diretamente se getters falharem
  let antigoTestamentoData = dia.antigoTestamento || [];
  let novoTestamentoData = dia.novoTestamento || [];

  // Se getters retornarem vazio, processar trechos diretamente
  if (
    (!antigoTestamentoData || antigoTestamentoData.length === 0) &&
    dia.trechos &&
    dia.trechos.length > 0
  ) {
    antigoTestamentoData = dia.trechos
      .filter((trecho) => trecho.testamento === "antigoTestamento")
      .map((trecho) => ({
        livroId: trecho.livroId,
        livroNome: trecho.livroNome,
        capituloInicio: trecho.capituloInicio,
        capituloFim: trecho.capituloFim,
      }));

    novoTestamentoData = dia.trechos
      .filter((trecho) => trecho.testamento === "novoTestamento")
      .map((trecho) => ({
        livroId: trecho.livroId,
        livroNome: trecho.livroNome,
        capituloInicio: trecho.capituloInicio,
        capituloFim: trecho.capituloFim,
      }));
  }

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
        ${renderSecao("Antigo Testamento", antigoTestamentoData)}
        ${renderSecao("Novo Testamento", novoTestamentoData)}
      </section>

      <footer class="dia-card-footer">
        ${
          dia.observacoes
            ? `
          <div class="dia-secao">
            <h3>Observações</h3>
            <p>${dia.observacoes}</p>
          </div>
        `
            : ""
        }
        
        <button data-action="toggle-lido">
          ${isLido ? "Desmarcar como lido" : "Marcar como lido"}
        </button>
      </footer>
    </article>
  `;
}

/* ===================== FUNÇÃO AUXILIAR UI ===================== */
function renderSecao(titulo, leituras) {
  if (!leituras || leituras.length === 0) return "";

  return `
    <div class="dia-secao">
      <h3>${titulo}</h3>
      <ul>
        ${leituras
          .map((leitura) => {
            // CORREÇÃO: Se for apenas um capítulo, mostrar apenas o número
            if (leitura.capituloInicio === leitura.capituloFim) {
              return `<li>${leitura.livroNome} ${leitura.capituloInicio}</li>`;
            } else {
              return `<li>${leitura.livroNome} ${leitura.capituloInicio}–${leitura.capituloFim}</li>`;
            }
          })
          .join("")}
      </ul>
    </div>
  `;
}
