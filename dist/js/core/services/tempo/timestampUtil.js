"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimestampAtual = getTimestampAtual;
exports.getTimestampDoDia = getTimestampDoDia;
exports.gerarNomeArquivoTimestamp = gerarNomeArquivoTimestamp;
exports.formatarDataCertificado = formatarDataCertificado;
const parametroGerador = __importStar(require("../../models/parametroGerador.js"));
/**
 * Gera timestamp atual para uso em UI
 * @returns {string} Timestamp ISO formatado
 */
function getTimestampAtual() {
    return new Date().toISOString();
}
/**
 * Gera timestamp baseado no dia do ano atual
 * @returns {string} Timestamp baseado no dia do ano
 */
function getTimestampDoDia() {
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
function gerarNomeArquivoTimestamp(prefixo, extensao) {
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const hora = new Date().toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
    return `${prefixo}_${timestamp}_${hora}.${extao}`;
}
/**
 * Formata data para exibição em certificados
 * @param {Date|string} data - Data para formatar
 * @returns {string} Data formatada DD/MM/YYYY
 */
function formatarDataCertificado(data) {
    const d = new Date(data);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
}
