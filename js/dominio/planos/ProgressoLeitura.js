/* ============================================================================
   ProgressoLeitura.js — Estado de Progresso de Leitura
   Versão: 0.6
   Aplicação: Leitura Controlada da Bíblia

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------
   - Gerenciar quais dias foram lidos
   - Calcular progresso
   - Persistir estado (localStorage por enquanto)
   - NÃO conter lógica de UI
============================================================================ */

export class ProgressoLeitura {
  constructor(chave = "progresso_leitura") {
    this.chave = chave;
    this.diasLidos = new Set();
    this._carregar();
  }

  /* --------------------------------------------------------------------------
     MARCAÇÃO DE ESTADO
  -------------------------------------------------------------------------- */

  marcarLido(numeroDia) {
    this.diasLidos.add(Number(numeroDia));
    this._salvar();
  }

  desmarcarLido(numeroDia) {
    this.diasLidos.delete(Number(numeroDia));
    this._salvar();
  }

  alternar(numeroDia) {
    if (this.isLido(numeroDia)) {
      this.desmarcarLido(numeroDia);
    } else {
      this.marcarLido(numeroDia);
    }
  }

  /* --------------------------------------------------------------------------
     CONSULTAS (API INTERNA)
  -------------------------------------------------------------------------- */

  isLido(numeroDia) {
    return this.diasLidos.has(Number(numeroDia));
  }

  totalLidos() {
    return this.diasLidos.size;
  }

  progressoPercentual(totalDias) {
    if (!totalDias) return 0;
    return Math.round((this.totalLidos() / totalDias) * 100);
  }

  /* --------------------------------------------------------------------------
     CONSULTAS (API PÚBLICA — CONTRATO DO APP)
     Mantém estabilidade com a main.js
  -------------------------------------------------------------------------- */

  estaLido(numeroDia) {
    return this.isLido(numeroDia);
  }

  getTotalLidos() {
    return this.totalLidos();
  }

  /* --------------------------------------------------------------------------
     PERSISTÊNCIA
  -------------------------------------------------------------------------- */

  _salvar() {
    localStorage.setItem(
      this.chave,
      JSON.stringify([...this.diasLidos])
    );
  }

  _carregar() {
    const dados = JSON.parse(localStorage.getItem(this.chave) || "[]");
    dados.forEach((n) => this.diasLidos.add(Number(n)));
  }

  resetar() {
    this.diasLidos.clear();
    this._salvar();
  }
}
