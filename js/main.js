/* ============================================================================
   main.js — Orquestrador Central de Inicialização
   Versão: 0.4
   Aplicação: Leitura Cronológica Controlada da Bíblia
   Autor: Ruyter Torres

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------
   - Inicialização da aplicação
   - Orquestração das camadas do sistema
   - Coordenação entre domínio e interface
   - Nenhuma lógica de negócio
   - Nenhuma lógica de UI detalhada

   PRINCÍPIOS ARQUITETURAIS:
   ----------------------------------------------------------------------------
   - main.js NÃO conhece regras bíblicas
   - main.js NÃO distribui capítulos ou versículos
   - main.js NÃO formata HTML complexo
   - main.js NÃO gerencia estado de leitura
   - main.js apenas conecta módulos

   CONTRATOS CONSUMIDOS:
   ----------------------------------------------------------------------------
   - planoCronologico.js → planoCronologico
   - render_plano.js    → renderPlanoCronologico()
============================================================================ */

/* ============================================================================
   IMPORTAÇÕES
============================================================================ */

/* Domínio — Plano cronológico estruturado */
import planoCronologico from "./dominio/planos/plano_cronologico.js";

/* UI — Renderização do plano */
import { renderPlanoCronologico } from "./ui/render_plano.js";

/* ============================================================================
   FUNÇÃO DE CONVERSÃO: DIA → HTML
============================================================================ */

function converterDiasParaHTML(dias) {
  return dias.map((dia) => {
    // Cria HTML para cada dia
    const html = `
      <div class="dia" data-numero="${dia.numero}" data-data="${dia.data}">
        <h3>Dia ${dia.numero} - ${dia.data}</h3>
        ${
          dia.antigoTestamento.length > 0
            ? `<div class="antigo-testamento">
            <h4>Antigo Testamento</h4>
            ${dia.antigoTestamento
              .map(
                (trecho) =>
                  `<p>${trecho.livroNome} ${trecho.capituloInicio}-${trecho.capituloFim}</p>`
              )
              .join("")}
          </div>`
            : ""
        }
        ${
          dia.novoTestamento.length > 0
            ? `<div class="novo-testamento">
            <h4>Novo Testamento</h4>
            ${dia.novoTestamento
              .map(
                (trecho) =>
                  `<p>${trecho.livroNome} ${trecho.capituloInicio}-${trecho.capituloFim}</p>`
              )
              .join("")}
          </div>`
            : ""
        }
        ${
          dia.observacoes ? `<p class="observacoes">${dia.observacoes}</p>` : ""
        }
      </div>
    `;

    return { html };
  });
}

/* ============================================================================
   BOOTSTRAP DA APLICAÇÃO
============================================================================ */

document.addEventListener("DOMContentLoaded", () => {
  try {
    /* ------------------------------------------------------------------------
       CAMADA 1 — DOMÍNIO
       Obtenção do plano cronológico estruturado
       --------------------------------------------------------------------- */
    const dias = planoCronologico.dias;

    /* ------------------------------------------------------------------------
       CONVERSÃO: DIA → HTML
       Transformação de objetos de domínio para formato compatível com UI
       --------------------------------------------------------------------- */
    const planoComHTML = converterDiasParaHTML(dias);

    /* ------------------------------------------------------------------------
       CAMADA 2 — INTERFACE
       Renderização do plano na interface
       --------------------------------------------------------------------- */
    renderPlanoCronologico({
      containerId: "plano-leitura",
      plano: planoComHTML,
    });

    /* ------------------------------------------------------------------------
       APLICAÇÃO PRONTA
       --------------------------------------------------------------------- */
    console.log(
      `Aplicação inicializada com sucesso (v0.4): ${dias.length} dias`
    );
  } catch (error) {
    /* ------------------------------------------------------------------------
       FALHA CRÍTICA DE INICIALIZAÇÃO
       --------------------------------------------------------------------- */
    console.error("Falha crítica na inicialização da aplicação:", error);
  }
});
