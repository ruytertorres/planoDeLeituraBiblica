import type { TrechoBiblico } from "../types/contratos.types";
export declare const TIPOS_LEITURA: Readonly<{
    ANTIGO_TESTAMENTO: "antigoTestamento";
    NOVO_TESTAMENTO: "novoTestamento";
}>;
export type TipoLeitura = (typeof TIPOS_LEITURA)[keyof typeof TIPOS_LEITURA];
/**
 * Factory estático: cria um Dia de forma pura e garantidamente correto.
 * Responsável por orquestrar a consulta a geradorDatas.
 *
 * @param numero - Número do dia (1-366)
 * @param ano - Ano civil real
 * @param antigoTestamento - Trechos do Antigo Testamento
 * @param novoTestamento - Trechos do Novo Testamento
 * @param livros - Lista de livros
 * @param capitulos - Lista de capítulos
 * @param versiculos - Lista de versículos
 * @param observacoes - Observações opcionais
 * @returns Nova instância de Dia
 * @throws Se os parâmetros forem inválidos
 */
export declare function criarDia(numero: number, ano: number, antigoTestamento?: TrechoBiblico[], novoTestamento?: TrechoBiblico[], livros?: string[], capitulos?: number[], versiculos?: string[], observacoes?: string): Dia;
export declare class Dia {
    #private;
    readonly numero: number;
    readonly ano: number;
    readonly data: string;
    readonly dataFormatada: string;
    readonly antigoTestamento: readonly TrechoBiblico[];
    readonly novoTestamento: readonly TrechoBiblico[];
    readonly livros: readonly string[];
    readonly capitulos: readonly number[];
    readonly versiculos: readonly string[];
    readonly observacoes: string;
    /**
     * Constructor para uso interno e testes.
     * Preferencialmente use criarDia() para criar instâncias normalmente.
     *
     * @param params - Parâmetros de criação do Dia
     */
    constructor(params: {
        numero: number;
        ano: number;
        data: string;
        dataFormatada: string;
        antigoTestamento: TrechoBiblico[];
        novoTestamento: TrechoBiblico[];
        livros: string[];
        capitulos: number[];
        versiculos: string[];
        observacoes: string;
    });
    getAntigoTestamento(): readonly TrechoBiblico[];
    getNovoTestamento(): readonly TrechoBiblico[];
    temAntigoTestamento(): boolean;
    temNovoTestamento(): boolean;
    temLeitura(): boolean;
    totalCapitulos(): number;
    getObservacoes(): string | null;
    getResumo(): {
        numero: number;
        ano: number;
        data: string;
        dataFormatada: string;
        totalCapitulos: number;
        temAT: boolean;
        temNT: boolean;
    };
    toJSON(): {
        numero: number;
        ano: number;
        data: string;
        dataFormatada: string;
        antigoTestamento: readonly TrechoBiblico[];
        novoTestamento: readonly TrechoBiblico[];
        livros: readonly string[];
        capitulos: readonly number[];
        versiculos: readonly string[];
        observacoes: string;
    };
}
//# sourceMappingURL=Dia.d.ts.map