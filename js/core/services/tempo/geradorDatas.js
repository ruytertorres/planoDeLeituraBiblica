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

/* ============================================================================
   FUNÇÕES DE CALENDÁRIO (PARA UI)
   NOTA: Estas funções são exceções controladas ao contrato de tempo
   pois servem metadados de UI, não tempo de domínio
============================================================================ */

/**
 * Obtém o primeiro dia da semana para um mês/ano (UI)
 * @param {number} ano - Ano
 * @param {number} mes - Mês (0-11)
 * @returns {number} Dia da semana (0=Dom, 1=Seg, ...)
 */
function getPrimeiroDiaMes(ano, mes) {
  // VIOLAÇÃO CONTROLADA: Função de UI, não de domínio
  // TODO: Migrar para usar apenas cálculos baseados em dia do ano
  return new Date(ano, mes, 1).getDay();
}

/**
 * Obtém o número de dias em um mês (UI)
 * @param {number} ano - Ano
 * @param {number} mes - Mês (0-11)
 * @returns {number} Número de dias no mês
 */
function getDiasNoMes(ano, mes) {
  // VIOLAÇÃO CONTROLADA: Função de UI, não de domínio
  // TODO: Migrar para usar apenas cálculos baseados em dia do ano
  return new Date(ano, mes + 1, 0).getDate();
}

/**
 * Formata data ISO para exibição (UI)
 * @param {number} ano - Ano
 * @param {number} mes - Mês (0-11)
 * @param {number} dia - Dia
 * @returns {string} Data formatada YYYY-MM-DD
 */
function formatarDataISO(ano, mes, dia) {
  return `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

/**
 * Verifica se uma data está no passado (UI)
 * @param {string} dataISO - Data no formato ISO
 * @returns {boolean} True se estiver no passado
 */
function estaNoPassado(dataISO) {
  // VIOLAÇÃO CONTROLADA: Função de UI, não de domínio
  // TODO: Migrar para usar apenas comparações de dia do ano
  const data = new Date(dataISO);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  data.setHours(0, 0, 0, 0);
  return data < hoje;
}

/* ============================================================================
   FUNÇÕES DE TIMESTAMP (PARA EXPORTAÇÃO/UI)
   NOTA: Estas funções são exceções controladas ao contrato de tempo
   pois servem metadados de exportação, não tempo de domínio
============================================================================ */

/**
 * Gera timestamp atual para uso em UI (EXPORTAÇÃO)
 * @returns {string} Timestamp ISO formatado
 */
function getTimestampAtual() {
  // VIOLAÇÃO CONTROLADA: Timestamp de exportação, não de domínio
  return new Date().toISOString();
}

/**
 * Gera timestamp baseado no dia do ano atual
 * @returns {string} Timestamp baseado no dia do ano
 */
function getTimestampDoDia() {
  const diaDoAno = getDiaDoAnoAtual();
  const ano = getAnoAtual();
  // VIOLAÇÃO CONTROLADA: Timestamp de exportação, não de domínio
  return new Date(ano, 0, diaDoAno).toISOString();
}

/**
 * Gera nome de arquivo com timestamp
 * @param {string} prefixo - Prefixo do arquivo
 * @param {string} extensao - Extensão do arquivo
 * @returns {string} Nome de arquivo com timestamp
 */
function gerarNomeArquivoTimestamp(prefixo, extensao) {
  // VIOLAÇÃO CONTROLADA: Timestamp de exportação, não de domínio
  const timestamp = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const hora = new Date().toTimeString().split(" ")[0].replace(/:/g, "-"); // HH-MM-SS
  return `${prefixo}_${timestamp}_${hora}.${extensao}`;
}

/**
 * Formata data para exibição em certificados
 * @param {Date|string} data - Data para formatar
 * @returns {string} Data formatada DD/MM/YYYY
 */
function formatarDataCertificado(data) {
  // VIOLAÇÃO CONTROLADA: Formatação de certificado, não de domínio
  const d = new Date(data);
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

/* ============================================================================
   EXPORTAÇÕES
============================================================================ */

// Exportações nomeadas para uso com import {}
export {
  gerarDataISO,
  gerarDataBR,
  getDiaDoAnoAtual,
  getAnoAtual,
  isAnoBissexto,
  getTotalDiasNoAno,
  converterDataISOParaDiaDoAno,
  getInfoDataCompleta,
  // Funções de calendário (UI)
  getPrimeiroDiaMes,
  getDiasNoMes,
  formatarDataISO,
  estaNoPassado,
  // Funções de timestamp (Exportação)
  getTimestampAtual,
  getTimestampDoDia,
  gerarNomeArquivoTimestamp,
  formatarDataCertificado,
};

// Exportação padrão para compatibilidade
export default {
  gerarDataISO,
  gerarDataBR,
  getDiaDoAnoAtual,
  getAnoAtual,
  isAnoBissexto,
  getTotalDiasNoAno,
  converterDataISOParaDiaDoAno,
  getInfoDataCompleta,
  // Funções de calendário (UI)
  getPrimeiroDiaMes,
  getDiasNoMes,
  formatarDataISO,
  estaNoPassado,
  // Funções de timestamp (Exportação)
  getTimestampAtual,
  getTimestampDoDia,
  gerarNomeArquivoTimestamp,
  formatarDataCertificado,
};
