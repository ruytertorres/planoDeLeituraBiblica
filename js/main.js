/* ============================================================================
   main.js — Orquestrador Central de Inicialização
   Versão: 0.8
   Aplicação: Leitura Cronológica Controlada da Bíblia

   RESPONSABILIDADE:
   ----------------------------------------------------------------------------
   - Orquestrar a inicialização da aplicação
   - Adaptar dados do domínio (Dia) para apresentação (HTML)
   - Coordenar camadas: Domínio → Adaptação → UI → Eventos
   - Gerenciar estado de progresso e interações do usuário

   INTEGRAÇÃO COM DIA.JS (VERSÃO 0.7):
   ----------------------------------------------------------------------------
   - Utiliza dia.getResumo() que agora retorna { numero, data, dataFormatada, ... }
   - Data formatada já vem pré-calculada do geradorDatas.js via plano_cronologico.js
   - Preserva compatibilidade com versões anteriores da classe Dia
============================================================================ */

/* ============================================================================
   IMPORTAÇÕES
   ----------------------------------------------------------------------------
   Nota: Importações mantidas conforme versão anterior para compatibilidade
============================================================================ */

/* Domínio — Plano Cronológico (contém os Dias) */
import planoCronologico from "./dominio/planos/plano_cronologico.js";

/* Domínio — Orquestração do Plano */
import { PlanoManager } from "./dominio/planos/PlanoManager.js";

/* Domínio — Gerenciamento de Progresso */
import { ProgressoLeitura } from "./dominio/planos/ProgressoLeitura.js";

/* UI — Renderização do Plano */
import { renderPlanoCronologico } from "./ui/render_plano.js";

/* NOTAS FLUTUANTES (funcionalidade adicional) */
import { NotasLeituraManager } from "./dominio/notas/NotasLeituraManager.js";
import { initNotasOverlay } from "./ui/notas/notas_overlay.js";

/* ============================================================================
   ADAPTADOR — CONVERSÃO DE DIA (DOMÍNIO) PARA HTML (UI)
   ----------------------------------------------------------------------------
   RESPONSABILIDADE: Adaptar objetos Dia da camada de domínio para
   estruturas HTML prontas para renderização, sem expor detalhes internos.

   CONTRATO COM DIA.JS (V0.7):
   ----------------------------------------------------------------------------
   - Utiliza dia.getResumo() que retorna objeto com:
       { numero, data, dataFormatada, totalCapitulos, temAT, temNT }
   - Data formatada já vem pré-calculada (dataFormatada)
   - Mantém retrocompatibilidade: se dataFormatada não existir, 
     usa formatação local como fallback
============================================================================ */

/**
 * Converte array de objetos Dia para array de objetos com HTML renderizado
 * @param {Array<Dia>} dias - Array de objetos Dia da camada de domínio
 * @returns {Array<{html: string}>} Array de objetos prontos para renderização
 */
function converterDiasParaHTML(dias) {
  return dias.map((dia) => {
    /* ------------------------------------------------------------------------
       EXTRAÇÃO DOS DADOS DO DIA
       ------------------------------------------------------------------------
       Usa dia.getResumo() que na versão 0.7 do dia.js inclui:
       - numero: número do dia (1-317)
       - data: data no formato ISO (YYYY-MM-DD)
       - dataFormatada: data já formatada (DD/MM/YYYY) pelo geradorDatas.js
       - totalCapitulos, temAT, temNT: metadados adicionais
    ------------------------------------------------------------------------ */

    // Obtém resumo completo do dia (incluindo dataFormatada da versão 0.7)
    const resumo = dia.getResumo();

    // Desestruturação com fallback para compatibilidade
    const numero = resumo.numero;
    const data = resumo.data;

    // PREFERÊNCIA: usa dataFormatada do resumo (já vem formatada)
    // FALLBACK: se não existir, usa formatação local
    const dataParaExibicao = resumo.dataFormatada
      ? resumo.dataFormatada
      : formatarDataExtenso(data);

    // Obtém trechos de leitura diretamente dos métodos do Dia
    const antigo = dia.getAntigoTestamento();
    const novo = dia.getNovoTestamento();
    const obs = dia.getObservacoes();

    /* ------------------------------------------------------------------------
       FUNÇÃO AUXILIAR: RENDERIZAÇÃO DE TRECHOS
       ------------------------------------------------------------------------
       Gera HTML para trechos do Antigo ou Novo Testamento
    ------------------------------------------------------------------------ */
    const renderTrechos = (titulo, trechos) => `
      <div class="${titulo.toLowerCase().replace(" ", "-")}">
        <h4>${titulo}</h4>
        ${trechos
          .map(
            (t) => `
          <div class="trecho">
            <span class="livro-nome">${t.livroNome}</span>
            <span class="capitulos">
              Capítulos ${t.capituloInicio}${t.capituloFim > t.capituloInicio ? `-${t.capituloFim}` : ""}
            </span>
          </div>
        `,
          )
          .join("")}
      </div>
    `;

    /* ------------------------------------------------------------------------
       CONSTRUÇÃO DO HTML DO DIA
       ------------------------------------------------------------------------
       Estrutura semântica com atributos de dados para referência
       IMPORTANTE: data-numero e data-data usados para seleção posterior
    ------------------------------------------------------------------------ */
    const html = `
      <div class="dia" data-numero="${numero}" data-data="${data}">
        <div class="dia-header">
          <h3>Dia ${numero}</h3>
          <!-- 
            ATUALIZAÇÃO V0.8: Usa dataFormatada do resumo quando disponível
            Melhoria de performance: evita recalcular formatação
          -->
          <span class="dia-date">${dataParaExibicao}</span>
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
   FUNÇÕES AUXILIARES (MANTIDAS DA VERSÃO ANTERIOR)
   ----------------------------------------------------------------------------
   Estas funções são utilitários puros de formatação
   Nota: formatarDataExtenso agora é fallback quando dataFormatada não existe
============================================================================ */

/**
 * Formata data ISO para formato extenso em português
 * FUNÇÃO FALLBACK: Usada apenas se dataFormatada não estiver disponível
 * @param {string} dataISO - Data no formato YYYY-MM-DD
 * @returns {string} Data formatada extensamente (ex: "segunda-feira, 1 de janeiro de 2026")
 */
function formatarDataExtenso(dataISO) {
  return new Date(dataISO).toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formata observações separadas por vírgula em tags HTML
 * @param {string} obs - String de observações separadas por vírgula
 * @returns {string} HTML com tags formatadas
 */
function formatarObservacoes(obs) {
  return obs
    .split(",")
    .map((tag) => `<span class="tag">${tag.trim()}</span>`)
    .join(" ");
}

/* ============================================================================
   INICIALIZAÇÃO DA APLICAÇÃO
   ----------------------------------------------------------------------------
   Fluxo de inicialização em camadas:
   1. DOMÍNIO: Carrega plano e cria gerenciadores
   2. ADAPTAÇÃO: Converte Dias para HTML
   3. UI: Renderiza HTML no DOM
   4. ESTADO: Restaura progresso salvo
   5. EVENTOS: Configura interações
============================================================================ */

document.addEventListener("DOMContentLoaded", () => {
  try {
    /* ------------------------------------------------------------------------
       CAMADA 1 — DOMÍNIO (DADOS E LÓGICA DE NEGÓCIO)
       ------------------------------------------------------------------------
       Responsabilidade: Carregar plano, gerenciar estado do domínio
    ------------------------------------------------------------------------ */

    // Gerenciador principal do plano (contém os objetos Dia)
    const planoManager = new PlanoManager(planoCronologico);

    // Gerenciador de progresso (usa localStorage para persistência)
    const progresso = new ProgressoLeitura(planoManager);

    // Obtém array de objetos Dia do plano
    const dias = planoManager.getPlano().dias;

    // Log informativo (debug)

    // Atualiza contador total na UI
    document.getElementById("total-dias").textContent = dias.length;

    /* ------------------------------------------------------------------------
       CAMADA 2 — ADAPTAÇÃO (DOMÍNIO → UI)
       ------------------------------------------------------------------------
       Responsabilidade: Converter objetos Dia em estruturas renderizáveis
    ------------------------------------------------------------------------ */

    const planoComHTML = converterDiasParaHTML(dias);

    /* ------------------------------------------------------------------------
       CAMADA 3 — RENDERIZAÇÃO (UI PURA)
       ------------------------------------------------------------------------
       Responsabilidade: Injetar HTML no DOM sem conhecer lógica de negócio
    ------------------------------------------------------------------------ */

    renderPlanoCronologico({
      containerId: "plano-leitura",
      plano: planoComHTML,
    });

    /* ------------------------------------------------------------------------
       CAMADA 4 — RESTAURAÇÃO DE ESTADO
       ------------------------------------------------------------------------
       Responsabilidade: Aplicar estado salvo (dias lidos) à UI recém-renderizada
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
       CAMADA 5 — CONFIGURAÇÃO DE EVENTOS
       ------------------------------------------------------------------------
       Responsabilidade: Vincular interações do usuário a ações no domínio
       Nota: UI apenas dispara eventos, não controla estado
    ------------------------------------------------------------------------ */

    document.querySelectorAll(".marcar-lido").forEach((btn) => {
      btn.addEventListener("click", function () {
        const numero = Number(this.dataset.dia);
        const el = document.querySelector(`.dia[data-numero="${numero}"]`);

        // Alterna estado no domínio (ProgressoLeitura)
        progresso.alternar(numero);

        // Atualiza UI baseado no novo estado
        if (progresso.estaLido(numero)) {
          el.classList.add("dia-lido");
          this.innerHTML = '<i class="fas fa-check-circle"></i> Lido';
        } else {
          el.classList.remove("dia-lido");
          this.innerHTML =
            '<i class="far fa-check-circle"></i> Marcar como lido';
        }

        // Atualiza estatísticas globais
        atualizarEstatisticas();
      });
    });

    /* ------------------------------------------------------------------------
       FUNÇÃO AUXILIAR: ATUALIZAÇÃO DE ESTATÍSTICAS
       ------------------------------------------------------------------------
       Responsabilidade: Calcular e exibir progresso geral
    ------------------------------------------------------------------------ */
    function atualizarEstatisticas() {
      const lidos = progresso.getTotalLidos();
      const total = dias.length;
      const percentual = Math.round((lidos / total) * 100);

      document.getElementById("dias-lidos").textContent = lidos;
      document.getElementById("progresso").textContent = `${percentual}%`;
    }

    // Atualiza estatísticas na inicialização
    atualizarEstatisticas();
  } catch (erro) {
    /* ------------------------------------------------------------------------
       TRATAMENTO DE ERROS
       ------------------------------------------------------------------------
       Exibe erro amigável ao usuário em caso de falha crítica
    ------------------------------------------------------------------------ */
    console.error("❌ Falha crítica:", erro);
    document.getElementById("plano-leitura").innerHTML = `
      <div class="error-state">
        <p>Erro ao carregar o plano</p>
        <pre>${erro.message}</pre>
      </div>
    `;
  }

  /* ------------------------------------------------------------------------
   INICIALIZAÇÃO DE FUNCIONALIDADES ADICIONAIS
   ----------------------------------------------------------------------------
   Bloco de anotações flutuantes (funcionalidade separada)
------------------------------------------------------------------------ */

  const notasManager = new NotasLeituraManager();
  initNotasOverlay(notasManager);
});

/* ============================================================================
   NOTAS DE MIGRAÇÃO (VERSÃO 0.7 → 0.8)
   ----------------------------------------------------------------------------
   ALTERAÇÕES REALIZADAS:
   
   1. ATUALIZAÇÃO EM converterDiasParaHTML():
      - Agora usa dia.getResumo() que na versão 0.7 do dia.js retorna 
        dataFormatada pré-calculada
      - Preferência: usa dataFormatada do resumo quando disponível
      - Fallback: mantém formatação local para compatibilidade
   
   2. BENEFÍCIOS:
      - Performance: Evita recalcular formatação de datas
      - Consistência: Usa mesma formatação do geradorDatas.js
      - Retrocompatibilidade: Funciona com versões antigas do dia.js
   
   3. INTEGRAÇÃO COM DIA.JS V0.7:
      - dia.getResumo() agora inclui { ..., dataFormatada }
      - dataFormatada vem do geradorDatas.js via plano_cronologico.js
      - Se dataFormatada não existir (versão antiga), usa fallback local
============================================================================ */
