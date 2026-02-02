/**
 * Retorna o ano civil real atual.
 *
 * @returns {number} Ano civil atual
 */
export declare function getAnoAtual(): number;
/**
 * Retorna o número do dia do ano atual (1–366).
 *
 * @returns {number} Dia do ano atual
 */
export declare function getDiaDoAnoAtual(): number;
/**
 * Retorna o total de dias do ano civil informado.
 *
 * @param {number} ano - Ano civil real
 * @returns {number} Total de dias do ano (365 ou 366)
 */
export declare function getTotalDiasDoAno(ano: number): number;
/**
 * Determina se um ano civil é bissexto.
 *
 * @param {number} ano - Ano civil real
 * @returns {boolean} True se for bissexto
 */
export declare function isAnoBissexto(ano: number): boolean;
/**
 * Gera uma data ISO (YYYY-MM-DD) a partir de um dia do ano e um ciclo civil.
 *
 * @param {number} diaDoAno - Dia do ano (1 até total de dias do ciclo)
 * @param {number} ano - Ano civil real
 * @returns {string} Data no formato ISO
 * @throws Se o dia do ano for inválido para o ciclo
 */
export declare function gerarDataISO(diaDoAno: number, ano: number): string;
/**
 * Gera uma data no formato brasileiro (DD/MM/YYYY).
 *
 * @param {number} diaDoAno - Dia do ano
 * @param {number} ano - Ano civil real
 * @returns {string} Data no formato brasileiro
 */
export declare function gerarDataBR(diaDoAno: number, ano: number): string;
/**
 * Fornece um snapshot consistente do tempo atual.
 * Útil para orquestração sem recalcular tempo em múltiplos pontos.
 *
 * @returns {{ano:number, diaDoAno:number, totalDias:number}}
 */
export declare function getContextoTemporalAtual(): {
    ano: number;
    diaDoAno: number;
    totalDias: number;
};
/**
 * Retorna um timestamp ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ) do momento atual.
 * Garante que todos os módulos obtenham timestamps da mesma fonte.
 *
 * @returns {string} Timestamp ISO 8601
 */
export declare function getTimestampAtualISO(): string;
//# sourceMappingURL=geradorDatas.d.ts.map