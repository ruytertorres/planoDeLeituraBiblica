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

import * as geradorDatas from "../tempo/geradorDatas.js";

/**
 * Gera timestamp atual para uso em UI
 * @returns {string} Timestamp ISO formatado
 */
export function getTimestampAtual() {
  // MIGRADO: Usa gerador de tempo autorizado
  return geradorDatas.getTimestampAtual();
}

/**
 * Gera timestamp baseado no dia do ano atual
 * @returns {string} Timestamp baseado no dia do ano
 */
export function getTimestampDoDia() {
  // MIGRADO: Usa gerador de tempo autorizado
  return geradorDatas.getTimestampDoDia();
}

/**
 * Gera nome de arquivo com timestamp
 * @param {string} prefixo - Prefixo do arquivo
 * @param {string} extensao - Extensão do arquivo
 * @returns {string} Nome de arquivo com timestamp
 */
export function gerarNomeArquivoTimestamp(prefixo, extensao) {
  // MIGRADO: Usa gerador de tempo autorizado
  return geradorDatas.gerarNomeArquivoTimestamp(prefixo, extensao);
}

/**
 * Formata data para exibição em certificados
 * @param {Date|string} data - Data para formatar
 * @returns {string} Data formatada DD/MM/YYYY
 */
export function formatarDataCertificado(data) {
  // MIGRADO: Usa gerador de tempo autorizado
  return geradorDatas.formatarDataCertificado(data);
}
