/* ============================================================================
   NotasLeituraManager.js — Domínio de Anotações de Leitura
   Versão: 0.2
============================================================================ */

import { normalizarHTMLNota } from "./normalizar_html_nota.js";

export class NotasLeituraManager {
  constructor(chave = "notas_leitura_default") {
    this.chave = chave;
    this.conteudoHTML = "";
    this._carregar();
  }

  /* --------------------------------------------------------------------------
     CONTEÚDO
  -------------------------------------------------------------------------- */

  setConteudo(html) {
    this.conteudoHTML = normalizarHTMLNota(html || "");
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
