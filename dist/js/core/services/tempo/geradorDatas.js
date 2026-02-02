"use strict";
/* ============================================================================
   geradorDatas.js — Relógio Universal do Sistema
   Versão: 1.0.0
   Aplicação: Leitura Controlada da Bíblia

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------
   - Gerar datas de forma determinística
   - Servir como fonte única de verdade para datas
   - Calcular dia do ano atual
   - Formatar datas em diferentes padrões
   - NÃO conter lógica de UI
   - NÃO conter lógica de negócio
============================================================================ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.gerarDataISO = gerarDataISO;
exports.gerarDataBR = gerarDataBR;
exports.getDiaDoAnoAtual = getDiaDoAnoAtual;
exports.getAnoAtual = getAnoAtual;
exports.isAnoBissexto = isAnoBissexto;
exports.getTotalDiasNoAno = getTotalDiasNoAno;
exports.converterDataISOParaDiaDoAno = converterDataISOParaDiaDoAno;
exports.getInfoDataCompleta = getInfoDataCompleta;
/* ============================================================================
   FUNÇÕES PRINCIPAIS
============================================================================ */
/**
 * Gera data ISO para um dia específico do ano
 * @param {number} diaDoAno - Dia do ano (1-366)
 * @param {number} ano - Ano (ex: 2025)
 * @returns {string} Data no formato ISO (YYYY-MM-DD)
 */
function gerarDataISO(diaDoAno, ano = new Date().getFullYear()) {
    if (diaDoAno < 1) {
        throw new Error("Dia do ano deve ser maior que 0");
    }
    // Criar data usando milissegundos para evitar problemas com dias inválidos
    const inicioDoAno = new Date(ano, 0, 1);
    const milissegundosDia = 24 * 60 * 60 * 1000;
    const dataAlvo = new Date(inicioDoAno.getTime() + (diaDoAno - 1) * milissegundosDia);
    // Verificar se a data é válida
    if (isNaN(dataAlvo.getTime())) {
        throw new Error(`Data inválida para dia ${diaDoAno} do ano ${ano}`);
    }
    return dataAlvo.toISOString().split("T")[0];
}
/**
 * Gera data formatada em português brasileiro
 * @param {number} diaDoAno - Dia do ano (1-366)
 * @param {number} ano - Ano (ex: 2025)
 * @returns {string} Data formatada (DD/MM/YYYY)
 */
function gerarDataBR(diaDoAno, ano = new Date().getFullYear()) {
    if (diaDoAno < 1) {
        throw new Error("Dia do ano deve ser maior que 0");
    }
    // Criar data usando milissegundos para evitar problemas com dias inválidos
    const inicioDoAno = new Date(ano, 0, 1);
    const milissegundosDia = 24 * 60 * 60 * 1000;
    const dataAlvo = new Date(inicioDoAno.getTime() + (diaDoAno - 1) * milissegundosDia);
    // Verificar se a data é válida
    if (isNaN(dataAlvo.getTime())) {
        throw new Error(`Data inválida para dia ${diaDoAno} do ano ${ano}`);
    }
    return dataAlvo.toLocaleDateString("pt-BR");
}
/**
 * Retorna o dia do ano atual (1-366)
 * @returns {number} Dia do ano atual
 */
function getDiaDoAnoAtual() {
    const agora = new Date();
    const inicio = new Date(agora.getFullYear(), 0, 0);
    const diff = agora - inicio;
    const diaDoAno = Math.floor(diff / (1000 * 60 * 60 * 24));
    return diaDoAno;
}
/**
 * Retorna o ano atual
 * @returns {number} Ano atual
 */
function getAnoAtual() {
    return new Date().getFullYear();
}
/* ============================================================================
   FUNÇÕES ADICIONAIS
============================================================================ */
/**
 * Verifica se um ano é bissexto
 * @param {number} ano - Ano para verificar
 * @returns {boolean} True se for bissexto
 */
function isAnoBissexto(ano) {
    return (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;
}
/**
 * Retorna o total de dias em um ano
 * @param {number} ano - Ano para verificar
 * @returns {number} Total de dias (365 ou 366)
 */
function getTotalDiasNoAno(ano) {
    return isAnoBissexto(ano) ? 366 : 365;
}
/**
 * Converte data ISO para dia do ano
 * @param {string} dataISO - Data no formato YYYY-MM-DD
 * @returns {number} Dia do ano (1-366)
 */
function converterDataISOParaDiaDoAno(dataISO) {
    const data = new Date(dataISO);
    const inicio = new Date(data.getFullYear(), 0, 0);
    const diff = data - inicio;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}
/**
 * Retorna informações completas sobre uma data
 * @param {number} diaDoAno - Dia do ano (1-366)
 * @param {number} ano - Ano (ex: 2025)
 * @returns {Object} Informações detalhadas da data
 */
function getInfoDataCompleta(diaDoAno, ano = new Date().getFullYear()) {
    const data = new Date(ano, 0, diaDoAno);
    return {
        diaDoAno,
        ano,
        dataISO: gerarDataISO(diaDoAno, ano),
        dataBR: gerarDataBR(diaDoAno, ano),
        diaSemana: data.getDay(), // 0 = Domingo, 6 = Sábado
        nomeDiaSemana: data.toLocaleDateString("pt-BR", { weekday: "long" }),
        mes: data.getMonth() + 1, // 1-12
        nomeMes: data.toLocaleDateString("pt-BR", { month: "long" }),
        dia: data.getDate(),
        isBissexto: isAnoBissexto(ano),
        totalDiasAno: getTotalDiasNoAno(ano),
    };
}
// Exportação padrão para compatibilidade
exports.default = {
    gerarDataISO,
    gerarDataBR,
    getDiaDoAnoAtual,
    getAnoAtual,
    isAnoBissexto,
    getTotalDiasNoAno,
    converterDataISOParaDiaDoAno,
    getInfoDataCompleta,
};
