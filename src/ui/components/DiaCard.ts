/* ============================================================================
   DiaCard.ts — Componente de Renderização de Dia Tipado
   Versão: 1.0.0 (TypeScript)
   Aplicação: Bíblia Responsiva — Migração Parcial

   RESPONSABILIDADE:
   - Substituir render_dia_card.js com tipagem forte
   - Renderizar cards de dia com validação estrutural
   - Integrar com núcleo TypeScript via adapter
   - Manter compatibilidade visual e funcional

   CONTRATO:
   - Nenhuma regra de domínio na UI (Seção 10 CONTRATO_DO_SISTEMA.md)
   - Componente puro de apresentação
   - Consome dados tipados, não cria regras
============================================================================ */

import type {
  DiaDoPlano,
  ProgressoLeitura,
} from "../../core/types/contratos.types";
import { UIAdapter } from "../../compatibilidade/ui-adapter";

/* ============================================================================
   INTERFACES DO COMPONENTE
============================================================================ */

interface OpcoesRenderizacao {
  readonly mostrarProgresso?: boolean;
  readonly tema?: "light" | "dark";
  readonly compacto?: boolean;
}

interface EventosDiaCard {
  onDiaChange?: (dia: DiaDoPlano) => void;
  onProgressoUpdate?: (progresso: number) => void;
}

/* ============================================================================
   COMPONENTE DIACARD
============================================================================ */

export class DiaCard {
  private elemento: HTMLElement | null = null;
  private adapter: UIAdapter;
  private opcoes: OpcoesRenderizacao;
  private eventos: EventosDiaCard;

  /**
   * Cria um novo componente DiaCard.
   *
   * @param adapter - Adaptador UI com acesso ao plano
   * @param opcoes - Opções de renderização
   * @param eventos - Callbacks de eventos
   */
  constructor(
    adapter: UIAdapter,
    opcoes: OpcoesRenderizacao = {},
    eventos: EventosDiaCard = {},
  ) {
    this.adapter = adapter;
    this.opcoes = {
      mostrarProgresso: true,
      tema: "light",
      compacto: false,
      ...opcoes,
    };
    this.eventos = eventos;
  }

  /* --------------------------------------------------------------------------
     RENDERIZAÇÃO PRINCIPAL
     -------------------------------------------------------------------------- */

  /**
   * Renderiza o card do dia atual.
   *
   * @param container - Elemento onde o card será renderizado
   * @param progresso - Progresso de leitura (opcional)
   */
  renderizar(container: HTMLElement, progresso?: ProgressoLeitura): void {
    const dia = this.adapter.getDiaAtual();
    if (!dia) {
      this.renderizarVazio(container);
      return;
    }

    this.elemento = this.criarElementoDia(dia, progresso);
    container.innerHTML = "";
    container.appendChild(this.elemento);

    // Disparar eventos
    this.eventos.onDiaChange?.(dia);
    if (progresso && this.opcoes.mostrarProgresso) {
      this.eventos.onProgressoUpdate?.(
        this.calcularProgressoPercentual(progresso),
      );
    }
  }

  /**
   * Atualiza o card com novo progresso.
   *
   * @param progresso - Novo progresso de leitura
   */
  atualizarProgresso(progresso: ProgressoLeitura): void {
    if (!this.elemento) return;

    const progressoElement = this.elemento.querySelector(".progresso-info");
    if (progressoElement) {
      const percentual = this.calcularProgressoPercentual(progresso);
      progressoElement.textContent = `${percentual}%`;

      // Atualizar classe de estado
      this.elemento.className = this.elemento.className.replace(
        /\b(pendente|lido|atrasado)\b/g,
        this.getClasseProgresso(progresso),
      );
    }

    this.eventos.onProgressoUpdate?.(
      this.calcularProgressoPercentual(progresso),
    );
  }

  /* --------------------------------------------------------------------------
     CRIAÇÃO DE ELEMENTOS
     -------------------------------------------------------------------------- */

  private criarElementoDia(
    dia: DiaDoPlano,
    progresso?: ProgressoLeitura,
  ): HTMLElement {
    const article = document.createElement("article");
    article.className = this.getClasseCard(dia, progresso);
    article.setAttribute("aria-live", "polite");
    article.setAttribute("data-dia", dia.numero.toString());

    // Cabeçalho do card
    const header = this.criarHeader(dia);
    article.appendChild(header);

    // Conteúdo bíblico
    const content = this.criarConteudoBiblico(dia);
    article.appendChild(content);

    // Progresso (se habilitado)
    if (this.opcoes.mostrarProgresso) {
      const progressoElement = this.criarProgresso(dia, progresso);
      article.appendChild(progressoElement);
    }

    // Observações (se existir)
    if (dia.observacoes) {
      const observacoes = this.criarObservacoes(dia);
      article.appendChild(observacoes);
    }

    return article;
  }

  private criarHeader(dia: DiaDoPlano): HTMLElement {
    const header = document.createElement("header");
    header.className = "card-header";

    // Número do dia
    const numero = document.createElement("h2");
    numero.className = "dia-numero";
    numero.textContent = `Dia ${dia.numero}`;
    header.appendChild(numero);

    // Data formatada
    const data = document.createElement("div");
    data.className = "dia-data";
    data.textContent = dia.dataFormatada;
    header.appendChild(data);

    return header;
  }

  private criarConteudoBiblico(dia: DiaDoPlano): HTMLElement {
    const content = document.createElement("div");
    content.className = "conteudo-biblico";

    // Antigo Testamento
    if (dia.antigoTestamento.length > 0) {
      const atSection = this.criarSecaoLeitura(
        "Antigo Testamento",
        dia.antigoTestamento,
      );
      content.appendChild(atSection);
    }

    // Novo Testamento
    if (dia.novoTestamento.length > 0) {
      const ntSection = this.criarSecaoLeitura(
        "Novo Testamento",
        dia.novoTestamento,
      );
      content.appendChild(ntSection);
    }

    return content;
  }

  private criarSecaoLeitura(
    titulo: string,
    leituras: readonly any[],
  ): HTMLElement {
    const section = document.createElement("section");
    section.className = "leitura-section";

    const title = document.createElement("h3");
    title.className = "leitura-titulo";
    title.textContent = titulo;
    section.appendChild(title);

    const lista = document.createElement("ul");
    lista.className = "leitura-lista";

    leituras.forEach((leitura) => {
      const item = document.createElement("li");
      item.className = "leitura-item";

      const texto = this.formatarLeitura(leitura);
      item.textContent = texto;
      lista.appendChild(item);
    });

    section.appendChild(lista);
    return section;
  }

  private criarProgresso(
    dia: DiaDoPlano,
    progresso?: ProgressoLeitura,
  ): HTMLElement {
    const progressoDiv = document.createElement("div");
    progressoDiv.className = "progresso-container";

    const info = document.createElement("div");
    info.className = "progresso-info";

    const percentual = progresso
      ? this.calcularProgressoPercentual(progresso)
      : 0;
    info.textContent = `${percentual}%`;

    progressoDiv.appendChild(info);
    return progressoDiv;
  }

  private criarObservacoes(dia: DiaDoPlano): HTMLElement {
    const observacoesDiv = document.createElement("div");
    observacoesDiv.className = "observacoes";

    const titulo = document.createElement("h4");
    titulo.className = "observacoes-titulo";
    titulo.textContent = "Observações";
    observacoesDiv.appendChild(titulo);

    const texto = document.createElement("p");
    texto.className = "observacoes-texto";
    texto.textContent = dia.observacoes;
    observacoesDiv.appendChild(texto);

    return observacoesDiv;
  }

  private renderizarVazio(container: HTMLElement): void {
    container.innerHTML = `
      <div class="card-dia empty">
        <div class="empty-message">
          <p>Nenhum dia disponível</p>
        </div>
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     UTILITÁRIOS
     -------------------------------------------------------------------------- */

  private formatarLeitura(leitura: any): string {
    if (!leitura.livroNome) return "Leitura não identificada";

    let texto = `${leitura.livroNome} ${leitura.capituloInicio}`;

    if (leitura.capituloFim && leitura.capituloFim !== leitura.capituloInicio) {
      texto += `-${leitura.capituloFim}`;
    }

    return texto;
  }

  private calcularProgressoPercentual(progresso: ProgressoLeitura): number {
    if (!progresso.diasLidos || this.adapter.getTotalDias() === 0) return 0;
    return Math.round(
      (progresso.diasLidos / this.adapter.getTotalDias()) * 100,
    );
  }

  private getClasseCard(dia: DiaDoPlano, progresso?: ProgressoLeitura): string {
    const base = "card-dia";
    const tema = this.opcoes.tema || "light";
    const progressoClasse = this.getClasseProgresso(progresso);
    const compacto = this.opcoes.compacto ? " compacto" : "";

    return `${base} ${tema} ${progressoClasse}${compacto}`;
  }

  private getClasseProgresso(progresso?: ProgressoLeitura): string {
    if (!progresso || !progresso.diasLidos) return "pendente";

    const diaAtual = this.adapter.getIndiceAtual() + 1;

    if (progresso.diasLidos >= diaAtual) {
      return "lido";
    } else if (progresso.diasLidos < diaAtual - 1) {
      return "atrasado";
    }

    return "pendente";
  }

  /* --------------------------------------------------------------------------
     LIFECYCLE
     -------------------------------------------------------------------------- */

  /**
   * Destrói o componente e limpa referências.
   */
  destroy(): void {
    if (this.elemento && this.elemento.parentNode) {
      this.elemento.parentNode.removeChild(this.elemento);
    }
    this.elemento = null;
  }

  /**
   * Retorna o elemento renderizado.
   */
  getElemento(): HTMLElement | null {
    return this.elemento;
  }
}

/* ============================================================================
   FACTORY PARA CRIAÇÃO FACILITADA
============================================================================ */

/**
 * Cria um DiaCard com configurações padrão.
 *
 * @param adapter - Adaptador UI
 * @param container - Elemento container (opcional)
 * @returns Instância do DiaCard
 */
export function criarDiaCard(
  adapter: UIAdapter,
  container?: HTMLElement,
): DiaCard {
  const card = new DiaCard(adapter);

  if (container) {
    card.renderizar(container);
  }

  return card;
}
