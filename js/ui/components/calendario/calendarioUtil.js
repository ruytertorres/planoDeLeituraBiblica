/* ============================================================================
   calendarioUtil.js — Utilitários de Calendário para UI
   Versão: 1.0.0
   Aplicação: Leitura Controlada da Bíblia

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------
   - Fornecer funções de calendário para UI (dias do mês, semanas, etc.)
   - Separar lógica de calendário da UI
   - Manter conformidade com CONTRATO_DO_SISTEMA.MD Seção 3.2
   
   NOTA: Este arquivo foi migrado para usar geradorDatas.js
   As funções de calendário são consideradas metadados de UI,
   não tempo de domínio do plano.
============================================================================ */

import * as geradorDatas from "../../../core/services/tempo/geradorDatas.js";

/**
 * Obtém o primeiro dia da semana para um mês/ano
 * @param {number} ano - Ano
 * @param {number} mes - Mês (0-11)
 * @returns {number} Dia da semana (0=Dom, 1=Seg, ...)
 */
export function getPrimeiroDiaMes(ano, mes) {
  // MIGRADO: Usa gerador de tempo autorizado
  return geradorDatas.getPrimeiroDiaMes(ano, mes);
}

/**
 * Obtém o número de dias em um mês
 * @param {number} ano - Ano
 * @param {number} mes - Mês (0-11)
 * @returns {number} Número de dias no mês
 */
export function getDiasNoMes(ano, mes) {
  // MIGRADO: Usa gerador de tempo autorizado
  return geradorDatas.getDiasNoMes(ano, mes);
}

/**
 * Formata data ISO para exibição
 * @param {number} ano - Ano
 * @param {number} mes - Mês (0-11)
 * @param {number} dia - Dia
 * @returns {string} Data formatada YYYY-MM-DD
 */
export function formatarDataISO(ano, mes, dia) {
  // MIGRADO: Usa gerador de tempo autorizado
  return geradorDatas.formatarDataISO(ano, mes, dia);
}

/**
 * Verifica se uma data está no passado
 * @param {string} dataISO - Data no formato ISO
 * @returns {boolean} True se estiver no passado
 */
export function estaNoPassado(dataISO) {
  // MIGRADO: Usa gerador de tempo autorizado
  return geradorDatas.estaNoPassado(dataISO);
}
