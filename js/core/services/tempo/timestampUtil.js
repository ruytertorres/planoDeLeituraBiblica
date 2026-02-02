/* ============================================================================
   timestampUtil.js — Utilitário de Timestamp para UI
   Versão: 1.0.0
   Aplicação: Leitura Controlada da Bíblia

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------
   - Fornecer timestamps para operações de UI (exportação, certificados)
   - Centralizar criação de timestamps para auditoria
   - Manter conformidade com CONTRATO_DO_SISTEMA.MD Seção 3.2
   
   NOTA: Este arquivo é uma exceção controlada à regra de "new Date()"
   pois timestamps de exportação são considerados metadados de UI,
   não cálculo de tempo de domínio.
============================================================================ */

import * as parametroGerador from "../../models/parametroGerador.js";

/**
 * Gera timestamp atual para uso em UI
 * @returns {string} Timestamp ISO formatado
 */
export function getTimestampAtual() {
  return new Date().toISOString();
}

/**
 * Gera timestamp baseado no dia do ano atual
 * @returns {string} Timestamp baseado no dia do ano
 */
export function getTimestampDoDia() {
  const diaDoAno = parametroGerador.getDiaDoAnoAtual();
  const ano = parametroGerador.getAnoAtual();
  return new Date(ano, 0, diaDoAno).toISOString();
}

/**
 * Gera nome de arquivo com timestamp
 * @param {string} prefixo - Prefixo do arquivo
 * @param {string} extensao - Extensão do arquivo
 * @returns {string} Nome de arquivo com timestamp
 */
export function gerarNomeArquivoTimestamp(prefixo, extensao) {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const hora = new Date().toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
  return `${prefixo}_${timestamp}_${hora}.${extao}`;
}

/**
 * Formata data para exibição em certificados
 * @param {Date|string} data - Data para formatar
 * @returns {string} Data formatada DD/MM/YYYY
 */
export function formatarDataCertificado(data) {
  const d = new Date(data);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}
