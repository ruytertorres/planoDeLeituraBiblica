/* ============================================================================
   NotasOverlayOrquestrador.ts — Orquestração Tipada de Overlay de Notas
   Versão: 2.0.0 (TypeScript)
   ============================================================================

   Responsabilidade: APENAS coordenação de estado e eventos
   - Gerenciar abertura/fechamento de overlay
   - Sincronizar com mudança de dia
   - Emitir eventos para UI consumir
   
   NÃO faz: Manipulação de DOM, listeners, renderização
   
   CONFORMIDADE COM CONTRATO_DO_SISTEMA.MD:
   - §4: Hierarquia de Autoridade (Orquestração)
   - §10: UI é reflexo (apenas emite eventos, não manipula DOM)

   Camada: ORQUESTRAÇÃO
   ============================================================================ */

import type { INotasLeituraManager } from "./NotasLeituraManager.js";

/* ============================================================================
   TIPOS E INTERFACES
   ============================================================================ */

/**
 * Interface do orquestrador de overlay de notas
 */
export interface INotasOverlayOrquestrador {
  abrir(): void;
  fechar(): void;
  alternar(): void;
  carregarNotasDoDia(dia?: number): void;
  salvarConteudo(conteudo: string): void;
  limparNotas(): void;
  exportarNotas(): boolean;
  isAberto(): boolean;
  destroy(): void;
}

/* ============================================================================
   CLASSE NOTAS OVERLAY ORQUESTRADOR
   ============================================================================ */

/**
 * Orquestrador de overlay de notas.
 *
 * Coordena abertura/fechamento e sincronização com dias.
 * Emite eventos para UI consumir (não manipula DOM diretamente).
 */
export class NotasOverlayOrquestrador implements INotasOverlayOrquestrador {
  /* --------------------------------------------------------------------------
     ATRIBUTOS PRIVADOS
     -------------------------------------------------------------------------- */

  private notasManager: INotasLeituraManager;
  private aberto = false;
  private diaChangeHandler: (e: Event) => void;

  /* --------------------------------------------------------------------------
     CONSTRUTOR
     -------------------------------------------------------------------------- */

  /**
   * Cria orquestrador de overlay de notas
   *
   * @param notasManager - Gerenciador de notas
   */
  constructor(notasManager: INotasLeituraManager) {
    this.notasManager = notasManager;
    this.diaChangeHandler = (e: Event) => {
      const customEvent = e as CustomEvent;
      this.carregarNotasDoDia(customEvent.detail?.dia);
    };
    this.setupListeners();
  }

  /* --------------------------------------------------------------------------
     LISTENERS
     -------------------------------------------------------------------------- */

  /**
   * Registra listeners de eventos do sistema
   */
  private setupListeners(): void {
    // Sincronizar quando dia muda
    document.addEventListener("dia-alterado", this.diaChangeHandler);
  }

  /**
   * Remove listeners ao destruir
   */
  destroy(): void {
    document.removeEventListener("dia-alterado", this.diaChangeHandler);
  }

  /* --------------------------------------------------------------------------
     CONTROLE DO OVERLAY
     -------------------------------------------------------------------------- */

  /**
   * Abre o overlay de notas
   * Emite evento "notas-abertas" para UI consumir
   */
  abrir(): void {
    if (this.aberto) return;

    this.aberto = true;
    document.dispatchEvent(
      new CustomEvent("notas-abertas", {
        detail: {
          conteudo: this.notasManager.getConteudo(),
        },
      }),
    );
  }

  /**
   * Fecha o overlay de notas
   * Emite evento "notas-fechadas" para UI consumir
   */
  fechar(): void {
    if (!this.aberto) return;

    this.aberto = false;
    document.dispatchEvent(new CustomEvent("notas-fechadas"));
  }

  /**
   * Alterna abertura/fechamento
   */
  alternar(): void {
    this.aberto ? this.fechar() : this.abrir();
  }

  /* --------------------------------------------------------------------------
     OPERAÇÕES DE NOTAS
     -------------------------------------------------------------------------- */

  /**
   * Carrega notas do dia atual
   * Emite evento "notas-carregadas" com conteúdo
   *
   * @param dia - Número do dia (opcional)
   */
  carregarNotasDoDia(dia?: number): void {
    const conteudo = this.notasManager.getConteudo();

    document.dispatchEvent(
      new CustomEvent("notas-carregadas", {
        detail: {
          conteudo: conteudo && conteudo.trim() ? conteudo : "<p></p>",
          dia,
        },
      }),
    );
  }

  /**
   * Persiste conteúdo de notas
   *
   * @param conteudo - HTML do editor
   */
  salvarConteudo(conteudo: string): void {
    this.notasManager.setConteudo(conteudo);
  }

  /**
   * Limpa todas as notas do dia atual
   */
  limparNotas(): void {
    this.notasManager.limpar();
    document.dispatchEvent(new CustomEvent("notas-limpas"));
  }

  /**
   * Exporta notas como arquivo HTML
   *
   * @returns true se sucesso, false se vazio
   */
  exportarNotas(): boolean {
    const conteudo = this.notasManager.getConteudo();

    if (!conteudo || conteudo.trim() === "" || conteudo === "<p></p>") {
      document.dispatchEvent(
        new CustomEvent("notas-exportar-vazio", {
          detail: { mensagem: "Não há anotações para exportar." },
        }),
      );
      return false;
    }

    // Emite evento com dados de exportação
    document.dispatchEvent(
      new CustomEvent("notas-pronta-exportar", {
        detail: {
          conteudo,
          diaAtual: (this.notasManager as any).getDiaAtual?.(),
        },
      }),
    );

    return true;
  }

  /* --------------------------------------------------------------------------
     STATUS
     -------------------------------------------------------------------------- */

  /**
   * Verifica se overlay está aberto
   *
   * @returns true se aberto
   */
  isAberto(): boolean {
    return this.aberto;
  }
}

export default NotasOverlayOrquestrador;
