interface TrechoLeitura {
    livroId: string;
    livroNome: string;
    capituloInicio: number;
    capituloFim: number;
}
interface DiaPlanoRaw {
    numero: number;
    antigoTestamento: TrechoLeitura[];
    novoTestamento: TrechoLeitura[];
    livros: string[];
    capitulos: number[];
    versiculos: string[];
    observacoes: string;
}
declare const planoCronologico: {
    id: string;
    nome: string;
    descricao: string;
    totalDias: number;
    dias: DiaPlanoRaw[];
};
export default planoCronologico;
//# sourceMappingURL=plano_cronologico.d.ts.map