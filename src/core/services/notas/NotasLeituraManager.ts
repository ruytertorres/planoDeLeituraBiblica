/* ============================================================================
   NotasLeituraManager.ts — Gerenciador Tipado de Notas por Dia
   Versão: 2.0.0 (TypeScript)
   ============================================================================

   RESPONSABILIDADE:
   - Gerenciar notas de leitura por dia
   - Persistir em localStorage
   - CRUD de notas

   CONFORMIDADE COM CONTRATO_DO_SISTEMA.MD:
   - §4: Hierarquia de Autoridade (Domínio Auxiliar)
   - §10: UI é reflexo (apenas persistência, sem lógica de domínio)

   Camada: DOMÍNIO AUXILIAR
   ============================================================================ */

/* ============================================================================
   TIPOS E INTERFACES
   ============================================================================ */

/**
 * Interface do gerenciador de notas
 */
export interface INotasLeituraManager {
  setDiaAtual(numeroDia: number): void;
  getDiaAtual(): number | null;
  getConteudo(): string;
  setConteudo(html: string): void;
  limpar(): void;
}

/* ============================================================================
   CLASSE NOTAS LEITURA MANAGER
   ============================================================================ */

/**
 * Gerenciador de notas de leitura bíblica.
 *
 * Responsável por:
 * - CRUD de notas por dia
 * - Persistência em localStorage
 * - Controle de dia atual
 *
 * @implements INotasLeituraManager
 */
export class NotasLeituraManager implements INotasLeituraManager {
  /* --------------------------------------------------------------------------
     ATRIBUTOS PRIVADOS
     -------------------------------------------------------------------------- */

  private readonly prefixo: string;
  private diaAtual: number | null = null;

  /* --------------------------------------------------------------------------
     CONSTRUTOR
     -------------------------------------------------------------------------- */

  /**
   * Cria gerenciador de notas
   *
   * @param prefixoChave - Prefixo para chaves do localStorage
   */
  constructor(prefixoChave = "notas_dia_") {
    this.prefixo = prefixoChave;
  }

  /* --------------------------------------------------------------------------
     CONTROLE DE DIA
     -------------------------------------------------------------------------- */

  /**
   * Define o dia atual para operações de notas
   *
   * @param numeroDia - Número do dia (1-based)
   */
  setDiaAtual(numeroDia: number): void {
    this.diaAtual = Number(numeroDia);
  }

  /**
   * Obtém o dia atual configurado
   *
   * @returns Número do dia ou null
   */
  getDiaAtual(): number | null {
    return this.diaAtual;
  }

  /* --------------------------------------------------------------------------
     CHAVE DE PERSISTÊNCIA
     -------------------------------------------------------------------------- */

  /**
   * Gera chave de localStorage para o dia atual
   *
   * @returns Chave formatada ou null se dia não definido
   */
  private getChave(): string | null {
    if (!this.diaAtual) return null;
    return `${this.prefixo}${String(this.diaAtual).padStart(3, "0")}`;
  }

  /* --------------------------------------------------------------------------
     API PÚBLICA - CRUD
     -------------------------------------------------------------------------- */

  /**
   * Obtém conteúdo das notas do dia atual
   *
   * @returns HTML das notas ou string vazia
   */
  getConteudo(): string {
    const chave = this.getChave();
    if (!chave) return "";

    try {
      return localStorage.getItem(chave) || "";
    } catch (error) {
      console.error("[NotasLeituraManager] Erro ao ler notas:", error);
      return "";
    }
  }

  /**
   * Salva conteúdo das notas do dia atual
   *
   * @param html - Conteúdo HTML das notas
   */
  setConteudo(html: string): void {
    const chave = this.getChave();
    if (!chave) return;

    try {
      localStorage.setItem(chave, html);
    } catch (error) {
      console.error("[NotasLeituraManager] Erro ao salvar notas:", error);
    }
  }

  /**
   * Remove notas do dia atual
   */
  limpar(): void {
    const chave = this.getChave();
    if (!chave) return;

    try {
      localStorage.removeItem(chave);
    } catch (error) {
      console.error("[NotasLeituraManager] Erro ao limpar notas:", error);
    }
  }

  /**
   * Verifica se há notas para o dia atual
   *
   * @returns True se há conteúdo
   */
  temConteudo(): boolean {
    return this.getConteudo().trim().length > 0;
  }

  /**
   * Exporta todas as notas (para backup/exportação)
   *
   * @returns Objeto com todas as notas indexadas por dia
   */
  exportarTodas(): Record<string, string> {
    const notas: Record<string, string> = {};

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const chave = localStorage.key(i);
        if (chave?.startsWith(this.prefixo)) {
          const dia = chave.replace(this.prefixo, "");
          const conteudo = localStorage.getItem(chave);
          if (conteudo) {
            notas[dia] = conteudo;
          }
        }
      }
    } catch (error) {
      console.error("[NotasLeituraManager] Erro ao exportar notas:", error);
    }

    return notas;
  }
}

export default NotasLeituraManager;
