/* ============================================================================
   NotasLeituraManager.js — Domínio de Anotações de Leitura
   Versão: 0.3 — persistência pura (DOM-safe)
============================================================================ */

export class NotasLeituraManager {
  constructor(chave = "notas_leitura_default") {
    this.chave = chave;
    this.conteudoHTML = "";
    this._carregar();
  }

  /* --------------------------------------------------------------------------
     CONTEÚDO
     --------------------------------------------------------------------------
     Regra:
       - O domínio NÃO normaliza
       - O domínio NÃO interpreta
       - O domínio apenas armazena o HTML produzido pelo editor
  -------------------------------------------------------------------------- */

  setConteudo(html) {
    this.conteudoHTML = html || "";
    this._salvar();
  }

  getConteudo() {
    return this.conteudoHTML;
  }

  limpar() {
    this.conteudoHTML = "";
    this._salvar();
  }

  /* --------------------------------------------------------------------------
     PERSISTÊNCIA
  -------------------------------------------------------------------------- */

  _salvar() {
    localStorage.setItem(this.chave, this.conteudoHTML);
  }

  _carregar() {
    this.conteudoHTML = localStorage.getItem(this.chave) || "";
  }
}
