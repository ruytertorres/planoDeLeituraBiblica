import type { PlanoCartucho, TrechoBiblico } from "../../types/contratos.types";
type DiaPlanoRaw = {
    numero: number;
    antigoTestamento: TrechoBiblico[];
    novoTestamento: TrechoBiblico[];
    livros: string[];
    capitulos: number[];
    versiculos: string[];
    observacoes: string;
};
type PlanoCartuchoRaw = {
    id: string;
    nome: string;
    descricao: string;
    totalDias: number;
    dias: DiaPlanoRaw[];
};
export declare function materializarPlanoCartucho(planoRaw: PlanoCartuchoRaw): PlanoCartucho;
export {};
//# sourceMappingURL=materializarPlanoCartucho.d.ts.map