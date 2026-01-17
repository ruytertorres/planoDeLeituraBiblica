/* ============================================================================
   dia.js — Entidade de Domínio: Dia de Leitura
   Versão: 0.6
   Aplicação: Bíblia Responsiva App

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------
   - Representar UM dia de leitura bíblica
   - Garantir consistência estrutural e semântica
   - Expor intenção por meio de métodos públicos
   - NÃO conter lógica de UI
   - NÃO conter lógica de persistência
============================================================================ */

/* ============================================================================
   TIPOS SUPORTADOS
============================================================================ */

export const TIPOS_LEITURA = Object.freeze({
  ANTIGO_TESTAMENTO: "antigoTestamento",
  NOVO_TESTAMENTO: "novoTestamento",
});

/* ============================================================================
   CLASSE DIA
============================================================================ */

export class Dia {
  constructor({
    numero,
    data,
    antigoTestamento = [],
    novoTestamento = [],
    livros = [],
    capitulos = [],
    versiculos = [],
    observacoes = "",
  }) {
    if (!Number.isInteger(numero) || numero < 1 || numero > 366) {
      throw new Error("Dia inválido: número deve estar entre 1 e 366.");
    }

    if (typeof data !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      throw new Error("Data inválida: formato esperado YYYY-MM-DD.");
    }

    this._validateTrechos(antigoTestamento, TIPOS_LEITURA.ANTIGO_TESTAMENTO);
    this._validateTrechos(novoTestamento, TIPOS_LEITURA.NOVO_TESTAMENTO);

    this.numero = numero;
    this.data = data;

    this.antigoTestamento = Object.freeze([...antigoTestamento]);
    this.novoTestamento = Object.freeze([...novoTestamento]);
    this.livros = Object.freeze([...livros]);
    this.capitulos = Object.freeze([...capitulos]);
    this.versiculos = Object.freeze([...versiculos]);
    this.observacoes = observacoes;

    Object.freeze(this);
  }

  /* --------------------------------------------------------------------------
     VALIDAÇÕES INTERNAS
  -------------------------------------------------------------------------- */

  _validateTrechos(trechos, tipo) {
    if (!Array.isArray(trechos)) {
      throw new Error(`Trechos de ${tipo} devem ser um array.`);
    }

    trechos.forEach((trecho, index) => {
      if (typeof trecho.livroId !== "string") {
        throw new Error(`Trecho inválido (${tipo}) [${index}]: livroId obrigatório.`);
      }

      if (!Number.isInteger(trecho.capituloInicio)) {
        throw new Error(`Trecho inválido (${tipo}) [${index}]: capituloInicio obrigatório.`);
      }

      if (trecho.capituloFim && trecho.capituloFim < trecho.capituloInicio) {
        throw new Error(`Trecho inválido (${tipo}) [${index}]: capituloFim menor que início.`);
      }
    });
  }

  /* --------------------------------------------------------------------------
     MÉTODOS DE INTENÇÃO — API DO DOMÍNIO
  -------------------------------------------------------------------------- */

  getAntigoTestamento() {
    return this.antigoTestamento;
  }

  getNovoTestamento() {
    return this.novoTestamento;
  }

  temAntigoTestamento() {
    return this.antigoTestamento.length > 0;
  }

  temNovoTestamento() {
    return this.novoTestamento.length > 0;
  }

  temLeitura() {
    return this.temAntigoTestamento() || this.temNovoTestamento();
  }

  totalCapitulos() {
    return this.capitulos.length;
  }

  getObservacoes() {
    return this.observacoes || null;
  }

  getResumo() {
    return {
      numero: this.numero,
      data: this.data,
      totalCapitulos: this.totalCapitulos(),
      temAT: this.temAntigoTestamento(),
      temNT: this.temNovoTestamento(),
    };
  }

  toJSON() {
    return {
      numero: this.numero,
      data: this.data,
      antigoTestamento: this.antigoTestamento,
      novoTestamento: this.novoTestamento,
      livros: this.livros,
      capitulos: this.capitulos,
      versiculos: this.versiculos,
      observacoes: this.observacoes,
    };
  }
}
