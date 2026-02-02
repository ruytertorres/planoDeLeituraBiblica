import { UIAdapter } from "../../compatibilidade/ui-adapter";
import type { PlanoCartucho, DiaDoPlano } from "../../core/types/contratos.types";
interface Plugin {
    readonly nome: string;
    readonly versao: string;
    init(adapter: UIAdapter): void;
    destroy(): void;
}
export declare class MainOrquestrador {
    private adapter;
    private plugins;
    private initialized;
    private destroyed;
    /**
     * Cria novo orquestrador principal.
     *
     * @param plano - Plano cartucho válido
     */
    constructor(plano: PlanoCartucho);
    /**
     * Registra um plugin no orquestrador.
     *
     * @param plugin - Plugin a ser registrado
     */
    registerPlugin(plugin: Plugin): void;
    /**
     * Remove um plugin do orquestrador.
     *
     * @param nome - Nome do plugin a ser removido
     */
    unregisterPlugin(nome: string): void;
    /**
     * Inicializa o orquestrador e todos os plugins.
     */
    init(): Promise<void>;
    /**
     * Destrói o orquestrador e todos os plugins.
     */
    destroy(): void;
    /**
     * Retorna o adaptador UI.
     */
    getAdapter(): UIAdapter;
    /**
     * Retorna o plano gerenciado.
     */
    getPlano(): PlanoCartucho;
    /**
     * Retorna o dia atual.
     */
    getDiaAtual(): DiaDoPlano | null;
    irParaDia(numero: number): DiaDoPlano | null;
    proximoDia(): DiaDoPlano | null;
    diaAnterior(): DiaDoPlano | null;
    temProximo(): boolean;
    temAnterior(): boolean;
    resetar(): DiaDoPlano | null;
    getEstadoResumido(): {
        diaAtual: number;
        totalDias: number;
        progressoPercentual: number;
        temProximo: boolean;
        temAnterior: boolean;
    };
    getTotalDias(): number;
    getIndiceAtual(): number;
    isInitialized(): boolean;
    isDestroyed(): boolean;
    getPluginsRegistrados(): string[];
}
export {};
//# sourceMappingURL=MainOrquestrador.d.ts.map