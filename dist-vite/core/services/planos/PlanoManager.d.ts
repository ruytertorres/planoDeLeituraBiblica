import type { PlanoCartucho, DiaDoPlano } from "../../types/contratos.types";
export declare class PlanoManager {
    private readonly plano;
    private readonly dias;
    private readonly totalDias;
    private indiceAtual;
    /**
     * Cria um novo gerenciador de plano.
     *
     * @param plano - Plano cartucho válido
     * @throws Se o plano for inválido
     */
    constructor(plano: PlanoCartucho);
    /**
     * Retorna o plano gerenciado.
     */
    getPlano(): PlanoCartucho;
    /**
     * Retorna o dia atual.
     */
    getDiaAtual(): DiaDoPlano | null;
    /**
     * Retorna o índice atual (base 0).
     */
    getIndiceAtual(): number;
    /**
     * Retorna o total de dias do plano.
     */
    getTotalDias(): number;
    /**
     * Navega para um dia específico pelo número.
     *
     * @param numero - Número do dia (1-based)
     * @returns O dia encontrado ou null se não existir
     */
    irParaDia(numero: number): DiaDoPlano | null;
    /**
     * Avança para o próximo dia.
     *
     * @returns O próximo dia ou o atual se já estiver no fim
     */
    proximoDia(): DiaDoPlano | null;
    /**
     * Volta para o dia anterior.
     *
     * @returns O dia anterior ou o atual se já estiver no início
     */
    diaAnterior(): DiaDoPlano | null;
    /**
     * Verifica se existe próximo dia.
     */
    temProximo(): boolean;
    /**
     * Verifica se existe dia anterior.
     */
    temAnterior(): boolean;
    /**
     * Reseta para o primeiro dia.
     *
     * @returns O primeiro dia
     */
    resetar(): DiaDoPlano | null;
    /**
     * Reseta o plano para começar a partir de um dia específico.
     * Usado para reset customizado (opção 2 do modal)
     *
     * @param numeroDia - Número do dia para começar (ex: 1)
     * @returns Objeto com resultado da operação
     *
     * @example
     * // Resetar para que dia 01 do plano = hoje
     * planoManager.resetarAPartirDoDia(1);
     * // { sucesso: true, dia: {...}, indice: 0 }
     */
    resetarAPartirDoDia(numeroDia: number): {
        sucesso: boolean;
        dia?: DiaDoPlano;
        indice?: number;
        erro?: string;
        descricao?: string;
    };
    /**
     * Retorna o progresso atual como percentual.
     */
    getProgressoPercentual(): number;
    /**
     * Retorna informações resumidas do estado atual.
     */
    getEstadoResumido(): {
        diaAtual: number;
        totalDias: number;
        progressoPercentual: number;
        temProximo: boolean;
        temAnterior: boolean;
    };
}
//# sourceMappingURL=PlanoManager.d.ts.map