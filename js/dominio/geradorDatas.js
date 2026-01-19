/* ============================================================================
   geradorDatas.js — Utilitário para geração automática de datas
   Versão: 3.0 - BULLETPROOF COM ANO FIXO 2026
   
   RESPONSABILIDADE:
   ----------------------------------------------------------------------------
   - Gerar datas automáticas baseadas no ANO FIXO 2026
   - Garantir que dia 1 = 1º de janeiro SEMPRE
   - Resolver problemas de fuso horário
   - Ser reutilizável por múltiplos planos de leitura
   ========================================================================= */

// ANO FIXO PARA TODOS OS PLANOS - ALTERE AQUI SE PRECISAR
const ANO_FIXO_PLANOS = 2026;

/**
 * Gera data ISO (YYYY-MM-DD) SEM PROBLEMAS DE FUSO HORÁRIO
 * @param {number} diaDoAno - Número do dia (1-366)
 * @param {number} ano - Ano (opcional, padrão: 2026)
 * @returns {string} Data no formato YYYY-MM-DD
 */
export function gerarDataISO(diaDoAno, ano = ANO_FIXO_PLANOS) {
  // VALIDAÇÃO
  if (diaDoAno < 1 || diaDoAno > 366) {
    throw new Error("Dia do ano deve estar entre 1 e 366");
  }

  // MÉTODO BULLETPROOF: criar data no meio do dia (12:00) para evitar fuso
  // new Date(ano, mêsIndex, dia, hora, minuto)
  // mêsIndex: 0=janeiro, 1=fevereiro, etc.

  const data = new Date(ano, 0, diaDoAno, 12, 0, 0); // 12:00 para evitar problemas

  // Extrair componentes manualmente para garantir precisão
  const anoStr = String(data.getFullYear());
  const mesStr = String(data.getMonth() + 1).padStart(2, "0");
  const diaStr = String(data.getDate()).padStart(2, "0");

  const dataFormatada = `${anoStr}-${mesStr}-${diaStr}`;

  return dataFormatada;
}

/**
 * Gera data no formato brasileiro (DD/MM/YYYY)
 * @param {number} diaDoAno - Número do dia (1-366)
 * @param {number} ano - Ano (opcional, padrão: 2026)
 * @returns {string} Data no formato DD/MM/YYYY
 */
export function gerarDataBR(diaDoAno, ano = ANO_FIXO_PLANOS) {
  const dataISO = gerarDataISO(diaDoAno, ano);

  // Converter ISO para BR: YYYY-MM-DD → DD/MM/YYYY
  const [anoStr, mesStr, diaStr] = dataISO.split("-");
  return `${diaStr}/${mesStr}/${anoStr}`;
}

/**
 * Classe opcional para gerenciamento mais estruturado
 */
export class GeradorDatas {
  constructor(ano = ANO_FIXO_PLANOS, formato = "iso") {
    this.ano = ano;
    this.formato = formato;
  }

  gerarData(diaDoAno) {
    if (this.formato === "br") {
      return gerarDataBR(diaDoAno, this.ano);
    } else {
      return gerarDataISO(diaDoAno, this.ano);
    }
  }
}
/**
 * Retorna o número do dia do ano (1–366)
 * Usa horário seguro para evitar fuso
 */
export function getDiaDoAnoAtual() {
  const agora = new Date();
  const inicioAno = new Date(agora.getFullYear(), 0, 1, 12);
  const hoje = new Date(
    agora.getFullYear(),
    agora.getMonth(),
    agora.getDate(),
    12,
  );

  const diffMs = hoje - inicioAno;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
}
