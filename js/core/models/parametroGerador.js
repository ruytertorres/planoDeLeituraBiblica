/* ============================================================================
   parametroGerador.js — Gerador de Parâmetros de Data
   Versão: 1.0.0
   Aplicação: Leitura Controlada da Bíblia

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------
   - Gerar datas baseadas no dia do ano
   - Calcular dia do ano atual
   - Formatar datas em diferentes padrões
   - Fornecer utilitários de data para o sistema
============================================================================ */

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
  const dataAlvo = new Date(
    inicioDoAno.getTime() + (diaDoAno - 1) * milissegundosDia,
  );

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
  const dataAlvo = new Date(
    inicioDoAno.getTime() + (diaDoAno - 1) * milissegundosDia,
  );

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
   EXPORTAÇÕES ADICIONAIS PARA COMPATIBILIDADE
============================================================================ */

// Exportações nomeadas para uso com import * as
export {
  gerarDataISO as gerarDataISO,
  gerarDataBR as gerarDataBR,
  getDiaDoAnoAtual as getDiaDoAnoAtual,
  getAnoAtual as getAnoAtual,
};

// Exportação padrão para compatibilidade
export default {
  gerarDataISO,
  gerarDataBR,
  getDiaDoAnoAtual,
  getAnoAtual,
};
