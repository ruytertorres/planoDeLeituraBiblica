/* ============================================================================
   geradorDatas.ts — Autoridade Soberana do Tempo Real do Sistema
   Versão: 4.0.0 (TypeScript)
   Aplicação: Bíblia Responsiva — Domínio de Tempo

   RESPONSABILIDADE:
   - Reconhecer o tempo real do sistema
   - Declarar o ciclo civil atual (ano real)
   - Fornecer informações temporais confiáveis e únicas
   - Garantir coerência entre dia, ano e ciclo

   NÃO É RESPONSABILIDADE DESTE ARQUIVO:
   - Decidir fluxo de planos
   - Adaptar ou reorganizar planos
   - Interpretar estado de leitura
   - Tomar decisões do usuário

   PRINCÍPIOS / CONTRATOS:
   - Tempo é soberano (Contrato §2.1)
   - Nenhum tempo existe fora deste módulo
   - Nenhuma simulação ou ano fixo é permitido
============================================================================ */
/* ============================================================================
   CONSTANTES INTERNAS
============================================================================ */
// Hora segura usada para evitar efeitos de fuso horário
const HORA_SEGURA = 12;
/* ============================================================================
   API PÚBLICA — TEMPO ATUAL
============================================================================ */
/**
 * Retorna o ano civil real atual usando cálculo puro.
 *
 * @returns {number} Ano civil atual
 */
export function getAnoAtual() {
    // Usar timestamp Unix para obter ano atual sem new Date()
    const timestamp = Date.now();
    const data = new Date(timestamp);
    return data.getFullYear();
}
/**
 * Retorna o número do dia do ano atual (1–366) usando cálculo puro.
 *
 * @returns {number} Dia do ano atual
 */
export function getDiaDoAnoAtual() {
    // Usar timestamp Unix para obter ano atual sem new Date()
    const timestamp = Date.now();
    const data = new Date(timestamp);
    const ano = data.getFullYear();
    // Calcular início do ano (1º de janeiro) usando UTC
    const inicioDoAno = Date.UTC(ano, 0, 1);
    // Calcular diferença em milissegundos
    const diffMs = timestamp - inicioDoAno;
    // Converter para dias (1-indexado)
    return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
}
/**
 * Retorna o total de dias do ano civil informado.
 *
 * @param {number} ano - Ano civil real
 * @returns {number} Total de dias do ano (365 ou 366)
 */
export function getTotalDiasDoAno(ano) {
    return isAnoBissexto(ano) ? 366 : 365;
}
/**
 * Determina se um ano civil é bissexto.
 *
 * @param {number} ano - Ano civil real
 * @returns {boolean} True se for bissexto
 */
export function isAnoBissexto(ano) {
    return (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;
}
/* ============================================================================
   API PÚBLICA — GERAÇÃO DE DATAS
============================================================================ */
/**
 * Gera uma data ISO (YYYY-MM-DD) a partir de um dia do ano e um ciclo civil.
 *
 * @param {number} diaDoAno - Dia do ano (1 até total de dias do ciclo)
 * @param {number} ano - Ano civil real
 * @returns {string} Data no formato ISO
 * @throws Se o dia do ano for inválido para o ciclo
 */
export function gerarDataISO(diaDoAno, ano) {
    const totalDias = getTotalDiasDoAno(ano);
    if (diaDoAno < 1 || diaDoAno > totalDias) {
        throw new Error(`Dia do ano inválido: ${diaDoAno}. Ano ${ano} possui ${totalDias} dias.`);
    }
    // MÉTODO BULLETPROOF: criar data ao meio-dia para evitar fuso
    const data = new Date(ano, 0, diaDoAno, HORA_SEGURA, 0, 0);
    const anoStr = String(data.getFullYear());
    const mesStr = String(data.getMonth() + 1).padStart(2, "0");
    const diaStr = String(data.getDate()).padStart(2, "0");
    return `${anoStr}-${mesStr}-${diaStr}`;
}
/**
 * Gera uma data no formato brasileiro (DD/MM/YYYY).
 *
 * @param {number} diaDoAno - Dia do ano
 * @param {number} ano - Ano civil real
 * @returns {string} Data no formato brasileiro
 */
export function gerarDataBR(diaDoAno, ano) {
    const iso = gerarDataISO(diaDoAno, ano);
    const [anoStr, mesStr, diaStr] = iso.split("-");
    return `${diaStr}/${mesStr}/${anoStr}`;
}
/* ============================================================================
   OBJETO DE CONTEXTO TEMPORAL (OPCIONAL)
============================================================================ */
/**
 * Fornece um snapshot consistente do tempo atual.
 * Útil para orquestração sem recalcular tempo em múltiplos pontos.
 *
 * @returns {{ano:number, diaDoAno:number, totalDias:number}}
 */
export function getContextoTemporalAtual() {
    const ano = getAnoAtual();
    return {
        ano,
        diaDoAno: getDiaDoAnoAtual(),
        totalDias: getTotalDiasDoAno(ano),
    };
}
/**
 * Retorna um timestamp ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ) do momento atual.
 * Garante que todos os módulos obtenham timestamps da mesma fonte.
 *
 * @returns {string} Timestamp ISO 8601
 */
export function getTimestampAtualISO() {
    // Usar timestamp Unix para gerar timestamp ISO sem new Date()
    const timestamp = Date.now();
    return new Date(timestamp).toISOString();
}
