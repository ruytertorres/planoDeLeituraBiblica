/* ============================================================================
   NotasLeituraManager.js — Notas por Dia
   Versão: 1.0 — ETAPA 3.4
============================================================================ */

export class NotasLeituraManager {
  constructor(prefixoChave = "notas_dia_") {
    this.prefixo = prefixoChave;
    this.diaAtual = null;
  }

  /* --------------------------------------------------------------------------
     CONTROLE DE DIA
  -------------------------------------------------------------------------- */

  setDiaAtual(numeroDia) {
    this.diaAtual = Number(numeroDia);
  }

  getDiaAtual() {
    return this.diaAtual;
  }

  /* --------------------------------------------------------------------------
     CHAVE DE PERSISTÊNCIA
  -------------------------------------------------------------------------- */

  _getChave() {
    if (!this.diaAtual) return null;
    return `${this.prefixo}${String(this.diaAtual).padStart(3, "0")}`;
  }

  /* --------------------------------------------------------------------------
     API PÚBLICA
  -------------------------------------------------------------------------- */

  getConteudo() {
    const chave = this._getChave();
    if (!chave) return "";

    return localStorage.getItem(chave) || "";
  }

  setConteudo(html) {
    const chave = this._getChave();
    if (!chave) return;

    localStorage.setItem(chave, html);
  }

  limpar() {
    const chave = this._getChave();
    if (!chave) return;

    localStorage.removeItem(chave);
  }
}
