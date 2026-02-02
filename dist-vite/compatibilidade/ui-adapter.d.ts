import type { PlanoCartucho, DiaDoPlano } from "../core/types/contratos.types";
/**
 * Adaptador que expõe o núcleo TypeScript para a UI JavaScript.
 *
 * Este adaptador serve como ponte, permitindo que a UI existente
 * continue funcionando enquanto se beneficia do núcleo tipado.
 */
export declare class UIAdapter {
    private planoManager;
    private plano;
    /**
     * Cria um novo adaptador UI.
     *
     * @param plano - Plano cartucho válido
     */
    constructor(plano: PlanoCartucho);
    /**
     * Retorna o plano gerenciado (compatível com código existente).
     */
    getPlano(): PlanoCartucho;
    /**
     * Retorna o dia atual (formato esperado pela UI).
     */
    getDiaAtual(): DiaDoPlano | null;
    /**
     * Navega para um dia específico.
     *
     * @param numero - Número do dia (1-based)
     * @returns O dia encontrado ou null
     */
    irParaDia(numero: number): DiaDoPlano | null;
    /**
     * Avança para o próximo dia.
     */
    proximoDia(): DiaDoPlano | null;
    /**
     * Volta para o dia anterior.
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
     */
    resetar(): DiaDoPlano | null;
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
    /**
     * Retorna o total de dias do plano.
     */
    getTotalDias(): number;
    /**
     * Retorna o índice atual (base 0).
     */
    getIndiceAtual(): number;
    /**
     * Retorna todos os dias do plano.
     */
    getTodosDias(): DiaDoPlano[];
    /**
     * Busca um dia específico pelo número.
     */
    buscarDia(numero: number): DiaDoPlano | undefined;
    /**
     * Valida se um número de dia é válido.
     */
    diaValido(numero: number): boolean;
    /**
     * Retorna o progresso como percentual (0-100).
     */
    getProgressoPercentual(): number;
    /**
     * Verifica se o plano está no último dia.
     */
    isUltimoDia(): boolean;
    /**
     * Verifica se o plano está no primeiro dia.
     */
    isPrimeiroDia(): boolean;
}
/**
 * Cria um adaptador UI de forma segura.
 *
 * @param plano - Plano cartucho (pode ser JavaScript ou TypeScript)
 * @returns Instância do adaptador
 * @throws Se o plano for inválido
 */
export declare function criarUIAdapter(plano: unknown): UIAdapter;
/**
 * Instância global do adaptador para uso pela UI JavaScript.
 *
 * Esta instância será inicializada quando a aplicação carregar.
 */
export declare let uiAdapterGlobal: UIAdapter | null;
/**
 * Inicializa o adaptador global com um plano.
 *
 * @param plano - Plano a ser gerenciado
 */
export declare function inicializarAdapter(plano: unknown): void;
/**
 * Retorna o adaptador global inicializado.
 *
 * @returns Instância do adaptador ou null
 */
export declare function getUIAdapter(): UIAdapter | null;
//# sourceMappingURL=ui-adapter.d.ts.map