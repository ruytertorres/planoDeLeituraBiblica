/* ============================================================================
   DiaCard.ts — Componente de Card de Dia em TypeScript
   Versão: 1.0.0
   ============================================================================

   RESPONSABILIDADE:
   - Renderizar card do dia de leitura bíblica
   - Mostrar trechos de AT e NT
   - Indicar estado (hoje, lido)
   - Botão de marcar como lido

   CONFORMIDADE COM CONTRATO_DO_SISTEMA.MD:
   - §10: UI é reflexo
   - Sem lógica de negócio
   ============================================================================ */

// ============================================================================
// TIPOS
// ============================================================================

interface TrechoLeitura {
  livroId: string;
  livroNome: string;
  capituloInicio: number;
  capituloFim: number;
}

interface Dia {
  numero: number;
  dataFormatada: string;
  antigoTestamento: TrechoLeitura[];
  novoTestamento: TrechoLeitura[];
  observacoes?: string;
  trechos?: Array<{
    testamento: string;
    livroId: string;
    livroNome: string;
    capituloInicio: number;
    capituloFim: number;
  }>;
}

interface EstadoUI {
  isHoje?: boolean;
  isLido?: boolean;
}

// ============================================================================
// COMPONENTE
// ============================================================================

export class DiaCard {
  /**
   * Renderiza o card de um dia
   */
  public static render(dia: Dia, estadoUI: EstadoUI = {}): string {
    if (!dia) {
      return `
        <article class="dia-card erro">
          <p>Dia inválido ou inexistente.</p>
        </article>
      `;
    }

    const { isHoje = false, isLido = false } = estadoUI;

    // Processar trechos
    let antigoTestamentoData = dia.antigoTestamento || [];
    let novoTestamentoData = dia.novoTestamento || [];

    // Fallback: se getters retornarem vazio, processar trechos diretamente
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
          ${this.renderSecao("Antigo Testamento", antigoTestamentoData)}
          ${this.renderSecao("Novo Testamento", novoTestamentoData)}
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

  /**
   * Renderiza uma seção de leitura (AT ou NT)
   */
  private static renderSecao(titulo: string, leituras: TrechoLeitura[]): string {
    if (!leituras || leituras.length === 0) return "";

    return `
      <div class="dia-secao">
        <h3>${titulo}</h3>
        <ul>
          ${leituras
            .map((leitura) => {
              // Se for apenas um capítulo, mostrar apenas o número
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
}

// Função de fábrica para compatibilidade
export function renderDiaCard(dia: Dia, estadoUI: EstadoUI = {}): string {
  return DiaCard.render(dia, estadoUI);
}

// Exportar como default
export default DiaCard;
