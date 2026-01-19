/* ============================================================================
   dia.js — Entidade de Domínio: Dia de Leitura
   Versão: 0.8.0
   Aplicação: Leitura Bíblica Cronológica

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------
   - Representar UM dia de leitura bíblica
   - Ser uma entidade de domínio pura e determinística
   - Expor intenção por meio de métodos públicos
   - NÃO conter lógica de UI
   - NÃO conter lógica de persistência
   - NÃO conter lógica de datas
   - NÃO formatar datas
   - NÃO inferir valores ausentes

   PRINCÍPIO ARQUITETURAL:
   ----------------------------------------------------------------------------
   - TODA manipulação de datas pertence exclusivamente ao geradorDatas.js
   - Dia apenas recebe datas já resolvidas
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
  /**
   * @param {Object} params
   * @param {number} params.numero - Número do dia (1-366)
   * @param {string} params.data - Data ISO (YYYY-MM-DD) — obrigatória
   * @param {string} params.dataFormatada - Data formatada (DD/MM/YYYY) — obrigatória
   * @param {Array} params.antigoTestamento
   * @param {Array} params.novoTestamento
   * @param {Array} params.livros
   * @param {Array} params.capitulos
   * @param {Array} params.versiculos
   * @param {string} params.observacoes
   */
  constructor({
    numero,
    data,
    dataFormatada,
    antigoTestamento = [],
    novoTestamento = [],
    livros = [],
    capitulos = [],
    versiculos = [],
    observacoes = "",
  }) {
    /* ----------------------------------------------------------------------
       VALIDAÇÕES ESTRUTURAIS
    ---------------------------------------------------------------------- */

    if (!Number.isInteger(numero) || numero < 1 || numero > 366) {
      throw new Error("Dia inválido: número deve estar entre 1 e 366.");
    }

    if (typeof data !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      throw new Error("Data inválida: formato esperado YYYY-MM-DD.");
    }

    if (
      typeof dataFormatada !== "string" ||
      !/^\d{2}\/\d{2}\/\d{4}$/.test(dataFormatada)
    ) {
      throw new Error(
        "dataFormatada inválida: formato esperado DD/MM/YYYY. " +
          "A data deve ser fornecida pelo geradorDatas.js.",
      );
    }

    this.#validarTrechos(antigoTestamento, TIPOS_LEITURA.ANTIGO_TESTAMENTO);
    this.#validarTrechos(novoTestamento, TIPOS_LEITURA.NOVO_TESTAMENTO);

    /* ----------------------------------------------------------------------
       ATRIBUTOS IMUTÁVEIS
    ---------------------------------------------------------------------- */

    this.numero = numero;
    this.data = data;
    this.dataFormatada = dataFormatada;

    this.antigoTestamento = Object.freeze([...antigoTestamento]);
    this.novoTestamento = Object.freeze([...novoTestamento]);
    this.livros = Object.freeze([...livros]);
    this.capitulos = Object.freeze([...capitulos]);
    this.versiculos = Object.freeze([...versiculos]);
    this.observacoes = observacoes;

    Object.freeze(this);
  }

  /* ========================================================================
     MÉTODOS PRIVADOS
  ======================================================================== */

  #validarTrechos(trechos, tipo) {
    if (!Array.isArray(trechos)) {
      throw new Error(`Trechos de ${tipo} devem ser um array.`);
    }

    trechos.forEach((t, i) => {
      if (typeof t.livroId !== "string") {
        throw new Error(`[${tipo}] Trecho ${i}: livroId obrigatório.`);
      }

      if (!Number.isInteger(t.capituloInicio)) {
        throw new Error(`[${tipo}] Trecho ${i}: capituloInicio obrigatório.`);
      }

      if (t.capituloFim !== undefined && t.capituloFim < t.capituloInicio) {
        throw new Error(`[${tipo}] Trecho ${i}: capituloFim menor que início.`);
      }
    });
  }

  /* ========================================================================
     API PÚBLICA DO DOMÍNIO
  ======================================================================== */

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
      dataFormatada: this.dataFormatada,
      totalCapitulos: this.totalCapitulos(),
      temAT: this.temAntigoTestamento(),
      temNT: this.temNovoTestamento(),
    };
  }

  toJSON() {
    return {
      numero: this.numero,
      data: this.data,
      dataFormatada: this.dataFormatada,
      antigoTestamento: this.antigoTestamento,
      novoTestamento: this.novoTestamento,
      livros: this.livros,
      capitulos: this.capitulos,
      versiculos: this.versiculos,
      observacoes: this.observacoes,
    };
  }
}
