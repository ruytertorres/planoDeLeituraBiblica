/* ============================================================================
   render_plano.js — Renderizador do Plano Cronológico
   Versão: 0.1
   Aplicação: Leitura Cronológica Controlada da Bíblia
   Autor: Ruyter Torres

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------
   - Renderizar o plano cronológico no DOM
   - Converter dados estruturados em HTML
   - Inserir conteúdo no container definido

   O QUE ESTE MÓDULO NÃO FAZ:
   ----------------------------------------------------------------------------
   - Não define ordem cronológica
   - Não valida capítulos bíblicos
   - Não controla progresso de leitura
   - Não gerencia estado do usuário
   - Não aplica regras de negócio

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
    throw new Error(
      `Container com id "${containerId}" não encontrado no DOM.`
    );
  }

  /* --------------------------------------------------------------------------
     LIMPEZA PREVENTIVA
     --------------------------------------------------------------------------
     - Evita render duplicado
     - Permite re-render futuro (filtros, busca, etc.)
     ----------------------------------------------------------------------- */
  container.innerHTML = "";

  /* --------------------------------------------------------------------------
     RENDERIZAÇÃO DOS DIAS
     --------------------------------------------------------------------------
     - Cada item do plano já vem pronto em HTML
     - Este módulo não interpreta conteúdo bíblico
     ----------------------------------------------------------------------- */
  plano.forEach((dia, index) => {

    if (!dia || typeof dia.html !== "string") {
      console.warn(
        `Entrada inválida no plano cronológico (índice ${index}).`,
        dia
      );
      return;
    }

    /* Wrapper semântico (futuro uso com Tailwind / CSS Grid) */
    const wrapper = document.createElement("div");
    wrapper.className = "dia-wrapper";
    wrapper.innerHTML = dia.html;

    container.appendChild(wrapper);
  });

  /* --------------------------------------------------------------------------
     FINALIZAÇÃO
     ----------------------------------------------------------------------- */
  console.log(
    `Plano cronológico renderizado com sucesso (${plano.length} dias).`
  );
}
