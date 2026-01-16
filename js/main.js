/* ============================================================================
   main.js — Orquestrador Central de Inicialização
   Versão: 0.5
   Aplicação: Leitura Cronológica Controlada da Bíblia
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
        <div class="dia-header">
          <h3>
            <span class="dia-number">${dia.numero}</span>
            Dia ${dia.numero} - ${formatarData(dia.data)}
          </h3>
          <span class="dia-date">${formatarDataExtenso(dia.data)}</span>
        </div>
        
        <div class="dia-conteudo">
          ${
            dia.antigoTestamento.length > 0
              ? `
          <div class="antigo-testamento">
            <h4>Antigo Testamento</h4>
            ${dia.antigoTestamento
              .map(
                (trecho) => `
                <div class="trecho ${
                  dia.antigoTestamento.length === 1 ? "livro-unico" : ""
                }">
                  <span class="livro-nome">${trecho.livroNome}</span>
                  <span class="capitulos">Capítulos ${trecho.capituloInicio}${
                  trecho.capituloFim > trecho.capituloInicio
                    ? `-${trecho.capituloFim}`
                    : ""
                }</span>
                </div>
              `
              )
              .join("")}
          </div>`
              : ""
          }
          
          ${
            dia.novoTestamento.length > 0
              ? `
          <div class="novo-testamento">
            <h4>Novo Testamento</h4>
            ${dia.novoTestamento
              .map(
                (trecho) => `
                <div class="trecho ${
                  dia.novoTestamento.length === 1 ? "livro-unico" : ""
                }">
                  <span class="livro-nome">${trecho.livroNome}</span>
                  <span class="capitulos">Capítulos ${trecho.capituloInicio}${
                  trecho.capituloFim > trecho.capituloInicio
                    ? `-${trecho.capituloFim}`
                    : ""
                }</span>
                </div>
              `
              )
              .join("")}
          </div>`
              : ""
          }
        </div>
        
        ${
          dia.observacoes
            ? `
        <div class="observacoes">
          ${formatarObservacoes(dia.observacoes)}
        </div>`
            : ""
        }
        
        <div class="dia-controles">
          <button class="btn btn-secondary marcar-lido" data-dia="${
            dia.numero
          }" title="Marcar como lido">
            <i class="far fa-check-circle"></i> Marcar como lido
          </button>
          <a href="#" class="btn btn-primary" title="Ler agora">
            <i class="fas fa-book-open"></i> Ler agora
          </a>
        </div>
      </div>
    `;

    return { html };
  });
}

/* ============================================================================
   FUNÇÕES AUXILIARES
============================================================================ */

function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

function formatarDataExtenso(dataISO) {
  const data = new Date(dataISO);
  const opcoes = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return data.toLocaleDateString("pt-BR", opcoes);
}

function formatarObservacoes(obs) {
  // Converte tags separadas por vírgula em badges
  return obs
    .split(",")
    .map(
      (tag) =>
        `<span class="tag" style="
      background: #e9ecef;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.8rem;
      margin-right: 4px;
      display: inline-block;
      margin-bottom: 4px;
    ">${tag.trim()}</span>`
    )
    .join(" ");
}

/* ============================================================================
   BOOTSTRAP DA APLICAÇÃO
============================================================================ */

document.addEventListener("DOMContentLoaded", () => {
  try {
    console.log("Iniciando aplicação...");

    // Remove o estado de carregamento
    const planoContainer = document.getElementById("plano-leitura");
    const loadingDiv = planoContainer.querySelector(".loading-state");
    if (loadingDiv) {
      loadingDiv.remove();
    }

    /* ------------------------------------------------------------------------
       CAMADA 1 — DOMÍNIO
       Obtenção do plano cronológico estruturado
       --------------------------------------------------------------------- */
    console.log("Carregando plano cronológico...");
    const dias = planoCronologico.dias;
    console.log(`Plano carregado: ${dias.length} dias`);

    // Atualizar estatísticas na navbar
    document.getElementById("total-dias").textContent = dias.length;

    /* ------------------------------------------------------------------------
       CONVERSÃO: DIA → HTML
       --------------------------------------------------------------------- */
    console.log("Convertendo dias para HTML...");
    const planoComHTML = converterDiasParaHTML(dias);

    /* ------------------------------------------------------------------------
       CAMADA 2 — INTERFACE
       --------------------------------------------------------------------- */
    console.log("Renderizando plano...");
    renderPlanoCronologico({
      containerId: "plano-leitura",
      plano: planoComHTML,
    });

    // Adicionar eventos aos botões
    setTimeout(() => {
      document.querySelectorAll(".marcar-lido").forEach((btn) => {
        btn.addEventListener("click", function () {
          const diaNum = this.getAttribute("data-dia");
          const diaElement = document.querySelector(
            `.dia[data-numero="${diaNum}"]`
          );

          if (diaElement.classList.contains("dia-lido")) {
            diaElement.classList.remove("dia-lido");
            this.innerHTML =
              '<i class="far fa-check-circle"></i> Marcar como lido';
            this.title = "Marcar como lido";
          } else {
            diaElement.classList.add("dia-lido");
            this.innerHTML = '<i class="fas fa-check-circle"></i> Lido';
            this.title = "Desmarcar";
          }

          atualizarEstatisticas();
        });
      });
    }, 100);

    /* ------------------------------------------------------------------------
       FUNÇÃO PARA ATUALIZAR ESTATÍSTICAS
       --------------------------------------------------------------------- */
    function atualizarEstatisticas() {
      const diasLidos = document.querySelectorAll(".dia-lido").length;
      const totalDias = dias.length;
      const progresso = Math.round((diasLidos / totalDias) * 100);

      document.getElementById("dias-lidos").textContent = diasLidos;
      document.getElementById("progresso").textContent = progresso + "%";

      // Salvar no localStorage
      localStorage.setItem(
        "diasLidos",
        JSON.stringify(
          Array.from(document.querySelectorAll(".dia-lido")).map((dia) =>
            dia.getAttribute("data-numero")
          )
        )
      );
    }

    // Restaurar dias lidos do localStorage
    const diasLidosSalvos = JSON.parse(
      localStorage.getItem("diasLidos") || "[]"
    );
    diasLidosSalvos.forEach((numero) => {
      const diaElement = document.querySelector(
        `.dia[data-numero="${numero}"]`
      );
      const btn = diaElement?.querySelector(".marcar-lido");
      if (diaElement && btn) {
        diaElement.classList.add("dia-lido");
        btn.innerHTML = '<i class="fas fa-check-circle"></i> Lido';
        btn.title = "Desmarcar";
      }
    });

    // Calcular estatísticas iniciais
    atualizarEstatisticas();

    /* ------------------------------------------------------------------------
       APLICAÇÃO PRONTA
       --------------------------------------------------------------------- */
    console.log(`Aplicação inicializada com sucesso: ${dias.length} dias`);
  } catch (error) {
    /* ------------------------------------------------------------------------
       FALHA CRÍTICA DE INICIALIZAÇÃO
       --------------------------------------------------------------------- */
    console.error("Falha na inicialização:", error);

    const planoContainer = document.getElementById("plano-leitura");
    planoContainer.innerHTML = `
      <div class="error-state">
        <i class="fas fa-exclamation-triangle fa-2x" style="margin-bottom: 1rem;"></i>
        <p>Erro ao carregar o plano de leitura</p>
        <p style="font-size: 0.9rem; margin-top: 0.5rem;">${error.message}</p>
        <button onclick="window.location.reload()" class="btn btn-primary" style="margin-top: 1rem;">
          <i class="fas fa-redo"></i> Tentar novamente
        </button>
      </div>
    `;
  }
});
