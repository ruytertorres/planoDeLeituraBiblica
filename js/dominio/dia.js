/* ============================================================================
   dia.js — Entidade de Domínio: Dia de Leitura
   Versão: 0.7.1
   Aplicação: Bíblia Responsiva App

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------
   - Representar UM dia de leitura bíblica
   - Garantir consistência estrutural e semântica
   - Expor intenção por meio de métodos públicos
   - NÃO conter lógica de UI
   - NÃO conter lógica de persistência
   - NÃO conter lógica de formatação de datas (usa geradorDatas.js)

   CONTRATO COM PLANO_CRONOLOGICO.JS:
   ----------------------------------------------------------------------------
   - Aceita dataFormatada como parâmetro opcional (já formatada pelo geradorDatas.js)
   - Mantém retrocompatibilidade com planos existentes
   - Gera dataFormatada automaticamente se não for fornecida

   CONTRATO COM GERADORDATAS.JS:
   ----------------------------------------------------------------------------
   - Espera data no formato ISO (YYYY-MM-DD)
   - Aceita dataFormatada pré-formatada (DD/MM/YYYY)
   - Delega formatação ao gerador centralizado quando necessário
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
   * Construtor da entidade Dia
   * @param {Object} params - Parâmetros de inicialização
   * @param {number} params.numero - Número do dia (1-366)
   * @param {string} params.data - Data no formato ISO (YYYY-MM-DD)
   * @param {string} [params.dataFormatada] - Data formatada (DD/MM/YYYY) - opcional
   * @param {Array} params.antigoTestamento - Trechos do Antigo Testamento
   * @param {Array} params.novoTestamento - Trechos do Novo Testamento
   * @param {Array} params.livros - Lista de livros do dia
   * @param {Array} params.capitulos - Lista de capítulos do dia
   * @param {Array} params.versiculos - Lista de versículos do dia
   * @param {string} params.observacoes - Observações sobre o dia
   */
  constructor({
    numero,
    data,
    dataFormatada = "", // NOVO: parâmetro opcional para data pré-formatada
    antigoTestamento = [],
    novoTestamento = [],
    livros = [],
    capitulos = [],
    versiculos = [],
    observacoes = "",
  }) {
    /* --------------------------------------------------------------------------
       VALIDAÇÃO DOS PARÂMETROS OBRIGATÓRIOS
    -------------------------------------------------------------------------- */

    // Validação do número do dia
    if (!Number.isInteger(numero) || numero < 1 || numero > 366) {
      throw new Error("Dia inválido: número deve estar entre 1 e 366.");
    }

    // Validação do formato da data ISO
    if (typeof data !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      throw new Error("Data inválida: formato esperado YYYY-MM-DD.");
    }

    /* --------------------------------------------------------------------------
       VALIDAÇÃO DOS TRECHOS DE LEITURA
    -------------------------------------------------------------------------- */

    this._validateTrechos(antigoTestamento, TIPOS_LEITURA.ANTIGO_TESTAMENTO);
    this._validateTrechos(novoTestamento, TIPOS_LEITURA.NOVO_TESTAMENTO);

    /* --------------------------------------------------------------------------
       INICIALIZAÇÃO DAS PROPRIEDADES
       --------------------------------------------------------------------------
       IMPORTANTE: dataFormatada é opcional. Se não for fornecida,
       será gerada automaticamente a partir da data ISO.
    -------------------------------------------------------------------------- */

    this.numero = numero;
    this.data = data;

    // Se dataFormatada foi fornecida, usa; senão, gera automaticamente
    // Isso mantém compatibilidade com plano_cronologico.js que já passa dataFormatada
    this.dataFormatada = dataFormatada || this._gerarDataFormatadaPadrao();

    /* --------------------------------------------------------------------------
       INICIALIZAÇÃO DOS DEMAIS DADOS (imutáveis)
    -------------------------------------------------------------------------- */

    this.antigoTestamento = Object.freeze([...antigoTestamento]);
    this.novoTestamento = Object.freeze([...novoTestamento]);
    this.livros = Object.freeze([...livros]);
    this.capitulos = Object.freeze([...capitulos]);
    this.versiculos = Object.freeze([...versiculos]);
    this.observacoes = observacoes;

    // Torna o objeto imutável após construção
    Object.freeze(this);
  }

  /* ============================================================================
     MÉTODOS PRIVADOS (implementação interna)
  ============================================================================ */

  /**
   * Valida a estrutura dos trechos de leitura
   * @private
   * @param {Array} trechos - Array de trechos a validar
   * @param {string} tipo - Tipo de leitura (antigo/novo testamento)
   */
  _validateTrechos(trechos, tipo) {
    if (!Array.isArray(trechos)) {
      throw new Error(`Trechos de ${tipo} devem ser um array.`);
    }

    trechos.forEach((trecho, index) => {
      if (typeof trecho.livroId !== "string") {
        throw new Error(
          `Trecho inválido (${tipo}) [${index}]: livroId obrigatório.`,
        );
      }

      if (!Number.isInteger(trecho.capituloInicio)) {
        throw new Error(
          `Trecho inválido (${tipo}) [${index}]: capituloInicio obrigatório.`,
        );
      }

      if (trecho.capituloFim && trecho.capituloFim < trecho.capituloInicio) {
        throw new Error(
          `Trecho inválido (${tipo}) [${index}]: capituloFim menor que início.`,
        );
      }
    });
  }

  /**
   * Gera data formatada no padrão brasileiro (DD/MM/YYYY)
   * @private
   * @returns {string} Data formatada
   *
   * NOTA: Este é um fallback. O ideal é que dataFormatada já venha
   * pré-formatada do plano_cronologico.js via geradorDatas.js
   */
  _gerarDataFormatadaPadrao() {
    if (!this.data) return "";

    try {
      // Converte data ISO (YYYY-MM-DD) para formato brasileiro (DD/MM/YYYY)
      const [ano, mes, dia] = this.data.split("-");

      // Valida os componentes
      if (!ano || !mes || !dia) return "";

      return `${dia.padStart(2, "0")}/${mes.padStart(2, "0")}/${ano}`;
    } catch (error) {
      console.warn(`Erro ao formatar data para dia ${this.numero}:`, error);
      return "";
    }
  }

  /* ============================================================================
     MÉTODOS PÚBLICOS (API do domínio)
  ============================================================================ */

  /**
   * Obtém os trechos do Antigo Testamento
   * @returns {Array} Trechos do Antigo Testamento
   */
  getAntigoTestamento() {
    return this.antigoTestamento;
  }

  /**
   * Obtém os trechos do Novo Testamento
   * @returns {Array} Trechos do Novo Testamento
   */
  getNovoTestamento() {
    return this.novoTestamento;
  }

  /**
   * Verifica se há leitura do Antigo Testamento
   * @returns {boolean} true se há trechos do Antigo Testamento
   */
  temAntigoTestamento() {
    return this.antigoTestamento.length > 0;
  }

  /**
   * Verifica se há leitura do Novo Testamento
   * @returns {boolean} true se há trechos do Novo Testamento
   */
  temNovoTestamento() {
    return this.novoTestamento.length > 0;
  }

  /**
   * Verifica se há leitura (qualquer testamento)
   * @returns {boolean} true se há qualquer trecho de leitura
   */
  temLeitura() {
    return this.temAntigoTestamento() || this.temNovoTestamento();
  }

  /**
   * Obtém o total de capítulos do dia
   * @returns {number} Total de capítulos
   */
  totalCapitulos() {
    return this.capitulos.length;
  }

  /**
   * Obtém as observações do dia
   * @returns {string|null} Observações ou null se vazias
   */
  getObservacoes() {
    return this.observacoes || null;
  }

  /**
   * Obtém a data formatada (DD/MM/YYYY)
   * @returns {string} Data formatada
   *
   * NOTA: Retorna a dataFormatada fornecida no construtor (do geradorDatas.js)
   * ou a gerada automaticamente como fallback.
   */
  getDataFormatada() {
    return this.dataFormatada;
  }

  /**
   * Obtém um resumo do dia para exibição
   * @returns {Object} Resumo contendo:
   *   - numero: número do dia
   *   - data: data ISO (YYYY-MM-DD)
   *   - dataFormatada: data formatada (DD/MM/YYYY)
   *   - totalCapitulos: total de capítulos
   *   - temAT: se tem Antigo Testamento
   *   - temNT: se tem Novo Testamento
   */
  getResumo() {
    return {
      numero: this.numero,
      data: this.data,
      dataFormatada: this.getDataFormatada(), // Usa o getter para garantir valor
      totalCapitulos: this.totalCapitulos(),
      temAT: this.temAntigoTestamento(),
      temNT: this.temNovoTestamento(),
    };
  }

  /**
   * Converte o dia para objeto JSON (serialização)
   * @returns {Object} Representação JSON do dia
   */
  toJSON() {
    return {
      numero: this.numero,
      data: this.data,
      dataFormatada: this.dataFormatada, // Inclui dataFormatada na serialização
      antigoTestamento: this.antigoTestamento,
      novoTestamento: this.novoTestamento,
      livros: this.livros,
      capitulos: this.capitulos,
      versiculos: this.versiculos,
      observacoes: this.observacoes,
    };
  }
}

/* ============================================================================
   VALIDAÇÃO DE COMPATIBILIDADE
   ----------------------------------------------------------------------------
   Teste rápido para garantir que a classe funciona com:
   1. plano_cronologico.js (que envia dataFormatada)
   2. geradorDatas.js (que gera dataFormatada)
   
   ATUALIZAÇÃO: Removida verificação de process.env.NODE_ENV pois
   não está disponível no navegador. Teste condicional por URL.
============================================================================ */

// Teste condicional baseado em hostname (apenas em localhost para desenvolvimento)
if (
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")
) {
  // Teste 1: Criação com dataFormatada (como plano_cronologico.js faz)
  try {
    const diaComDataFormatada = new Dia({
      numero: 1,
      data: "2026-01-01",
      dataFormatada: "01/01/2026", // Fornecido pelo geradorDatas.js
      antigoTestamento: [],
      novoTestamento: [],
      observacoes: "teste",
    });
  } catch (error) {
    console.error("✗ Erro com dataFormatada:", error);
  }

  // Teste 2: Criação sem dataFormatada (fallback automático)
  try {
    const diaSemDataFormatada = new Dia({
      numero: 2,
      data: "2026-01-02",
      antigoTestamento: [],
      novoTestamento: [],
      observacoes: "teste",
    });
  } catch (error) {
    console.error("✗ Erro sem dataFormatada:", error);
  }
}
