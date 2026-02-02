"use strict";
/* ============================================================================
   calendarioUtil.js — Utilitários de Calendário para UI
   Versão: 1.0.0
   Aplicação: Leitura Controlada da Bíblia

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------
   - Fornecer funções de calendário para UI (dias do mês, semanas, etc.)
   - Separar lógica de calendário da UI
   - Manter conformidade com CONTRATO_DO_SISTEMA.MD Seção 3.2
   
   NOTA: Este arquivo contém exceção controlada à regra de "new Date()"
   pois funções de calendário (dias do mês, layout semanal) são consideradas
   metadados de UI, não tempo de domínio do plano.
============================================================================ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrimeiroDiaMes = getPrimeiroDiaMes;
exports.getDiasNoMes = getDiasNoMes;
exports.formatarDataISO = formatarDataISO;
exports.estaNoPassado = estaNoPassado;
/**
 * Obtém o primeiro dia da semana para um mês/ano
 * @param {number} ano - Ano
 * @param {number} mes - Mês (0-11)
 * @returns {number} Dia da semana (0=Dom, 1=Seg, ...)
 */
function getPrimeiroDiaMes(ano, mes) {
    return new Date(ano, mes, 1).getDay();
}
/**
 * Obtém o número de dias em um mês
 * @param {number} ano - Ano
 * @param {number} mes - Mês (0-11)
 * @returns {number} Número de dias no mês
 */
function getDiasNoMes(ano, mes) {
    return new Date(ano, mes + 1, 0).getDate();
}
/**
 * Formata data ISO para exibição
 * @param {number} ano - Ano
 * @param {number} mes - Mês (0-11)
 * @param {number} dia - Dia
 * @returns {string} Data formatada YYYY-MM-DD
 */
function formatarDataISO(ano, mes, dia) {
    return `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}
/**
 * Verifica se uma data está no passado
 * @param {string} dataISO - Data no formato ISO
 * @returns {boolean} True se estiver no passado
 */
function estaNoPassado(dataISO) {
    const data = new Date(dataISO);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    data.setHours(0, 0, 0, 0);
    return data < hoje;
}
