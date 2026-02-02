"use strict";
/* ============================================================================
   parametroDia.js — Entidade de Domínio: Dia de Leitura
   Versão: 1.0.0 (JavaScript)
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
============================================================================ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dia = exports.TIPOS_LEITURA = void 0;
const geradorDatas_js_1 = require("../services/tempo/geradorDatas.js");
/* ============================================================================
   TIPOS SUPORTADOS
============================================================================ */
exports.TIPOS_LEITURA = Object.freeze({
    ANTIGO_TESTAMENTO: "antigoTestamento",
    NOVO_TESTAMENTO: "novoTestamento",
});
/* ============================================================================
   CLASSE DIA
============================================================================ */
class Dia {
    /* --------------------------------------------------------------------------
       ATRIBUTOS
       -------------------------------------------------------------------------- */
    constructor(numero, ano, trechos, tipo = null, metadadosAdicionais = {}) {
        this.numero = numero;
        this.ano = ano;
        this.trechos = trechos || [];
        this.tipo = tipo;
        // Metadados adicionais do plano
        this.livros = metadadosAdicionais.livros || [];
        this.capitulos = metadadosAdicionais.capitulos || [];
        this.versiculos = metadadosAdicionais.versiculos || [];
        this.observacoes = metadadosAdicionais.observacoes || "";
        // Datas calculadas uma vez (imutáveis)
        this.data = (0, geradorDatas_js_1.gerarDataISO)(numero, ano);
        this.dataFormatada = (0, geradorDatas_js_1.gerarDataBR)(numero, ano);
    }
    /* --------------------------------------------------------------------------
       FACTORY METHOD
       -------------------------------------------------------------------------- */
    /**
     * Cria um novo Dia de forma controlada
     * @param {number} numero - Número do dia (1-based)
     * @param {number} ano - Ano do plano
     * @param {Array} trechos - Array de trechos bíblicos
     * @param {string} tipo - Tipo de leitura (opcional)
     * @returns {Dia} Nova instância de Dia
     */
    static criar(numero, ano, trechos, tipo = null) {
        if (!numero || numero < 1) {
            throw new Error("Número do dia deve ser maior que 0");
        }
        if (!ano || ano < 0) {
            throw new Error("Ano deve ser válido");
        }
        if (!Array.isArray(trechos)) {
            throw new Error("Trechos deve ser um array");
        }
        return new Dia(numero, ano, trechos, tipo);
    }
    /* --------------------------------------------------------------------------
       MÉTODOS DE CONSULTA
       -------------------------------------------------------------------------- */
    /**
     * Verifica se o dia contém trechos do Antigo Testamento
     */
    temAntigoTestamento() {
        return this.trechos.some((trecho) => trecho.testamento === exports.TIPOS_LEITURA.ANTIGO_TESTAMENTO);
    }
    /**
     * Verifica se o dia contém trechos do Novo Testamento
     */
    temNovoTestamento() {
        return this.trechos.some((trecho) => trecho.testamento === exports.TIPOS_LEITURA.NOVO_TESTAMENTO);
    }
    /**
     * Retorna a quantidade de trechos
     */
    getQuantidadeTrechos() {
        return this.trechos.length;
    }
    /**
     * Retorna uma descrição resumida do dia
     */
    getDescricaoResumida() {
        if (this.trechos.length === 0) {
            return "Dia sem leitura programada";
        }
        const primeiroTrecho = this.trechos[0];
        if (this.trechos.length === 1) {
            return `${primeiroTrecho.livro} ${primeiroTrecho.capitulo}:${primeiroTrecho.versiculoInicio}`;
        }
        return `${primeiroTrecho.livro} ${primeiroTrecho.capitulo}:${primeiroTrecho.versiculoInicio} ...`;
    }
    /* --------------------------------------------------------------------------
       MÉTODOS DE VALIDAÇÃO
       -------------------------------------------------------------------------- */
    /**
     * Valida se o dia está em estado consistente
     */
    validar() {
        const erros = [];
        if (!this.numero || this.numero < 1) {
            erros.push("Número inválido");
        }
        if (!this.ano || this.ano < 0) {
            erros.push("Ano inválido");
        }
        if (!Array.isArray(this.trechos)) {
            erros.push("Trechos deve ser um array");
        }
        return {
            valido: erros.length === 0,
            erros,
        };
    }
    /* --------------------------------------------------------------------------
       SERIALIZAÇÃO
       -------------------------------------------------------------------------- */
    /**
     * Converte para objeto JSON
     */
    toJSON() {
        return {
            numero: this.numero,
            ano: this.ano,
            data: this.data,
            dataFormatada: this.dataFormatada,
            trechos: this.trechos,
            tipo: this.tipo,
        };
    }
    /**
     * Cria instância a partir de JSON
     */
    static fromJSON(json) {
        return new Dia(json.numero, json.ano, json.trechos, json.tipo);
    }
}
exports.Dia = Dia;
