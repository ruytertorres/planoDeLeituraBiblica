/* ============================================================================
   dia.js — Entidade de Domínio: Dia de Leitura
   Versão: 0.2
   Aplicação: Leitura Controlada da Bíblia
   Autor: [SEU NOME AQUI]

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------
   - Representar UM dia de leitura bíblica
   - Garantir consistência estrutural dos dados
   - Não conter lógica de UI
   - Não conter lógica de persistência
   - Não decidir planos (isso é responsabilidade do plano)

   CONCEITO-CHAVE:
   ----------------------------------------------------------------------------
   Um "Dia" é um contêiner semântico de leitura.
   Ele não sabe "por que" nem "como" foi montado,
   apenas garante que o que recebeu é válido.

   PRINCÍPIOS:
   ----------------------------------------------------------------------------
   - Imutabilidade lógica (dados só entram via construtor)
   - Validação rigorosa
   - Expansível sem quebra de contrato
============================================================================ */

/* ============================================================================
   TIPOS SUPORTADOS
============================================================================ */

/**
 * Tipos de leitura possíveis dentro de um dia.
 * Usado para validação semântica.
 */
export const TIPOS_LEITURA = Object.freeze({
  ANTIGO_TESTAMENTO: "antigoTestamento",
  NOVO_TESTAMENTO: "novoTestamento",
});

/* ============================================================================
   ESTRUTURA ESPERADA DE UM TRECHO
============================================================================
   {
     livroId: string,
     livroNome: string,
     capituloInicio: number,
     capituloFim: number,
     versiculoInicio?: number,
     versiculoFim?: number
   }
============================================================================ */

/* ============================================================================
   CLASSE DIA
============================================================================ */

export class Dia {
  /**
   * @param {Object} params
   * @param {number} params.numero            Número do dia (1 a 366)
   * @param {string} params.data              Data no formato ISO (YYYY-MM-DD)
   * @param {Array}  params.antigoTestamento  Lista de trechos do AT
   * @param {Array}  params.novoTestamento    Lista de trechos do NT
   * @param {Array}  params.livros             Lista consolidada de livros
   * @param {Array}  params.capitulos          Lista consolidada de capítulos
   * @param {Array}  params.versiculos         Lista consolidada de versículos (opcional)
   * @param {string} params.observacoes        Campo livre (opcional)
   */
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
    /* ------------------------------------------------------------------------
       VALIDAÇÕES BÁSICAS
    ------------------------------------------------------------------------ */

    if (!Number.isInteger(numero) || numero < 1 || numero > 366) {
      throw new Error("Dia inválido: número deve estar entre 1 e 366.");
    }

    if (typeof data !== "string" || !data.match(/^\d{4}-\d{2}-\d{2}$/)) {
      throw new Error("Data inválida: formato esperado YYYY-MM-DD.");
    }

    this._validateTrechos(antigoTestamento, TIPOS_LEITURA.ANTIGO_TESTAMENTO);
    this._validateTrechos(novoTestamento, TIPOS_LEITURA.NOVO_TESTAMENTO);

    /* ------------------------------------------------------------------------
       ATRIBUTOS IMUTÁVEIS
    ------------------------------------------------------------------------ */

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

  /* ==========================================================================
     MÉTODOS PRIVADOS
  ========================================================================== */

  /**
   * Valida a estrutura dos trechos recebidos
   */
  _validateTrechos(trechos, tipo) {
    if (!Array.isArray(trechos)) {
      throw new Error(`Trechos de ${tipo} devem ser um array.`);
    }

    trechos.forEach((trecho, index) => {
      if (typeof trecho.livroId !== "string") {
        throw new Error(
          `Trecho inválido (${tipo}) [${index}]: livroId obrigatório.`
        );
      }

      if (!Number.isInteger(trecho.capituloInicio)) {
        throw new Error(
          `Trecho inválido (${tipo}) [${index}]: capituloInicio obrigatório.`
        );
      }

      if (
        trecho.capituloFim &&
        trecho.capituloFim < trecho.capituloInicio
      ) {
        throw new Error(
          `Trecho inválido (${tipo}) [${index}]: capituloFim menor que início.`
        );
      }
    });
  }

  /* ==========================================================================
     MÉTODOS PÚBLICOS DE CONSULTA
  ========================================================================== */

  /**
   * Retorna true se o dia possui leitura no Antigo Testamento
   */
  temAntigoTestamento() {
    return this.antigoTestamento.length > 0;
  }

  /**
   * Retorna true se o dia possui leitura no Novo Testamento
   */
  temNovoTestamento() {
    return this.novoTestamento.length > 0;
  }

  /**
   * Retorna total de capítulos planejados no dia
   */
  totalCapitulos() {
    return this.capitulos.length;
  }

  /**
   * Exporta o dia em formato serializável (ex: JSON)
   */
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
