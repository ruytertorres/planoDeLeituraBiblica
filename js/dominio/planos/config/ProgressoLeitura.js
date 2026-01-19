/* ============================================================================
   ProgressoLeitura.js — Estado de Progresso de Leitura
   Versão: 0.7.0
   Aplicação: Leitura Controlada da Bíblia

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------
   - Gerenciar quais dias foram lidos
   - Calcular progresso
   - Persistir estado (localStorage)
   - NÃO conter lógica de UI
   - NÃO depender de plano, datas ou renderização
============================================================================ */

export class ProgressoLeitura {
  constructor(chaveStorage = "progresso_leitura") {
    this.chaveStorage = chaveStorage;
    this.diasLidos = new Set();

    this._carregar();
  }

  /* --------------------------------------------------------------------------
     MARCAÇÃO DE ESTADO (DOMÍNIO)
  -------------------------------------------------------------------------- */

  marcarComoLido(numeroDia) {
    this.diasLidos.add(Number(numeroDia));
    this._salvar();
  }

  desmarcarComoLido(numeroDia) {
    this.diasLidos.delete(Number(numeroDia));
    this._salvar();
  }

  alternar(numeroDia) {
    this.estaLido(numeroDia)
      ? this.desmarcarComoLido(numeroDia)
      : this.marcarComoLido(numeroDia);
  }

  /* --------------------------------------------------------------------------
     CONSULTAS DE ESTADO
  -------------------------------------------------------------------------- */

  estaLido(numeroDia) {
    return this.diasLidos.has(Number(numeroDia));
  }

  getTotalLidos() {
    return this.diasLidos.size;
  }

  calcularPercentual(totalDias) {
    if (!totalDias || totalDias <= 0) return 0;
    return Math.round((this.getTotalLidos() / totalDias) * 100);
  }

  /* --------------------------------------------------------------------------
     PERSISTÊNCIA (INFRA LOCAL)
  -------------------------------------------------------------------------- */

  _salvar() {
    localStorage.setItem(
      this.chaveStorage,
      JSON.stringify([...this.diasLidos]),
    );
  }

  _carregar() {
    const dados = localStorage.getItem(this.chaveStorage);
    if (!dados) return;

    try {
      JSON.parse(dados).forEach((n) => this.diasLidos.add(Number(n)));
    } catch {
      this.diasLidos.clear();
    }
  }

  /* --------------------------------------------------------------------------
     UTILITÁRIOS
  -------------------------------------------------------------------------- */

  resetar() {
    this.diasLidos.clear();
    this._salvar();
  }
}
