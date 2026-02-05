/* ============================================================================
   NotasHistoricoManager.ts — Gerenciador de Undo/Redo
   Versão: 2.0.0 (TypeScript)
   ============================================================================ */

export class NotasHistoricoManager {
  private historico: string[];
  private historicoIndex: number;
  private readonly MAX_ESTADOS = 50;

  constructor(estadoInicial = "") {
    this.historico = [estadoInicial];
    this.historicoIndex = 0;
  }

  salvar(novoEstado: string): boolean {
    if (!novoEstado) return false;

    const estadoAnterior = this.historico[this.historicoIndex];
    if (novoEstado === estadoAnterior) return false;

    if (this.historicoIndex < this.historico.length - 1) {
      this.historico = this.historico.slice(0, this.historicoIndex + 1);
    }

    this.historico.push(novoEstado);
    this.historicoIndex++;

    if (this.historico.length > this.MAX_ESTADOS) {
      this.historico.shift();
      this.historicoIndex--;
    }

    return true;
  }

  undo(): string | null {
    if (this.historicoIndex > 0) {
      this.historicoIndex--;
      return this.historico[this.historicoIndex];
    }
    return null;
  }

  redo(): string | null {
    if (this.historicoIndex < this.historico.length - 1) {
      this.historicoIndex++;
      return this.historico[this.historicoIndex];
    }
    return null;
  }

  estadoAtual(): string {
    return this.historico[this.historicoIndex];
  }

  podeUndo(): boolean {
    return this.historicoIndex > 0;
  }

  podeRedo(): boolean {
    return this.historicoIndex < this.historico.length - 1;
  }

  limpar(): void {
    this.historico = [this.historico[this.historicoIndex]];
    this.historicoIndex = 0;
  }

  tamanho(): number {
    return this.historico.length;
  }
}

export default NotasHistoricoManager;
