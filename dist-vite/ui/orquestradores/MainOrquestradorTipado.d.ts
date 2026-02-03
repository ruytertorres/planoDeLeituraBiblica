/**
 * Dia de leitura simplificado
 */
export interface DiaSimplificado {
    readonly numero: number;
    readonly data: string;
    readonly dataFormatada: string;
    readonly antigoTestamento: readonly string[];
    readonly novoTestamento: readonly string[];
    readonly estado: 'pendente' | 'lido' | 'bloqueado';
}
/**
 * Estado da aplicação
 */
export interface EstadoAplicacao {
    readonly diaAtual: number;
    readonly diasLidos: readonly number[];
    readonly diasBloqueados: readonly number[];
    readonly tema: 'light' | 'dark';
}
/**
 * Eventos do orquestrador
 */
export interface OrquestradorEventos {
    readonly onDiaChange?: (dia: DiaSimplificado) => void;
    readonly onTemaChange?: (tema: 'light' | 'dark') => void;
}
/**
 * Orquestrador principal tipado simplificado
 */
export declare class MainOrquestradorTipado {
    private plano;
    private estado;
    private eventos;
    private initialized;
    constructor(plano: DiaSimplificado[], eventos?: OrquestradorEventos);
    /**
     * Inicializa o orquestrador
     */
    init(): Promise<void>;
    /**
     * Navega para um dia específico
     */
    navegarParaDia(numeroDia: number): Promise<boolean>;
    /**
     * Marca dia como lido
     */
    marcarComoLido(numeroDia: number): Promise<void>;
    /**
     * Desmarca dia como lido
     */
    desmarcarComoLido(numeroDia: number): Promise<void>;
    /**
     * Altera tema
     */
    alterarTema(tema: 'light' | 'dark'): void;
    /**
     * Obtém estado atual
     */
    obterEstado(): Readonly<EstadoAplicacao>;
    /**
     * Destrói o orquestrador
     */
    destroy(): void;
}
//# sourceMappingURL=MainOrquestradorTipado.d.ts.map