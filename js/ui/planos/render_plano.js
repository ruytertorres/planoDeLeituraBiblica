/* ============================================================================
   render_plano.js — Renderizador do Plano Cronológico
   Versão: 0.6
   Aplicação: Leitura Cronológica Controlada da Bíblia
   Autor: Ruyter Torres

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------
   - Renderizar o plano cronológico no DOM
   - Inserir HTML previamente preparado no container definido

   O QUE ESTE MÓDULO NÃO FAZ:
   ----------------------------------------------------------------------------
   - Não conhece a entidade Dia
   - Não valida regras bíblicas
   - Não controla progresso de leitura
   - Não gerencia estado do usuário
   - Não contém lógica de negócio

   CONTRATO DE ENTRADA:
   ----------------------------------------------------------------------------
   renderPlanoCronologico({
     containerId: string,
     plano: Array<{ html: string }>
   })

   CONTRATO DE SAÍDA:
   ----------------------------------------------------------------------------
   - HTML injetado no container informado
============================================================================ */

/* ============================================================================
   FUNÇÃO PRINCIPAL DE RENDERIZAÇÃO
============================================================================ */

export function renderPlanoCronologico({ containerId, plano }) {
  /* --------------------------------------------------------------------------
     OBTENÇÃO DO CONTAINER
     ----------------------------------------------------------------------- */
  const container = document.getElementById(containerId);

  if (!container) {
    throw new Error(`Container com id "${containerId}" não encontrado no DOM.`);
  }

  /* --------------------------------------------------------------------------
     LIMPEZA PREVENTIVA
     --------------------------------------------------------------------------
     - Evita render duplicado
     - Permite re-render futuro (filtros, busca, navegação)
     ----------------------------------------------------------------------- */
  container.innerHTML = "";

  /* --------------------------------------------------------------------------
     RENDERIZAÇÃO DOS DIAS
     --------------------------------------------------------------------------
     - Cada item do plano já vem convertido em HTML
     - A UI valida apenas o contrato visual
     ----------------------------------------------------------------------- */
  plano.forEach((item, index) => {
    if (!item || typeof item.html !== "string") {
      console.warn(
        `Entrada inválida no plano cronológico (índice ${index}). Esperado { html: string }.`,
        item,
      );
      return;
    }

    /* Wrapper semântico para layout e estilização */
    const wrapper = document.createElement("div");
    wrapper.className = "dia-wrapper";
    wrapper.innerHTML = item.html;

    container.appendChild(wrapper);
  });
}
