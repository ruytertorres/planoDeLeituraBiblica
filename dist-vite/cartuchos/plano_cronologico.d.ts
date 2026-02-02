import { Dia } from "../core/models/Dia.js";
declare const planoCronologico: {
    id: string;
    nome: string;
    descricao: string;
    totalDias: number;
    dias: Dia[];
    /**
     * Retorna um dia específico pelo número (O(1))
     * @param {number} numero
     * @returns {Dia | undefined}
     */
    getDia(numero: number): Dia | undefined;
    /**
     * Retorna todos os dias do plano
     * @returns {Dia[]}
     */
    getDias(): Dia[];
};
export default planoCronologico;
//# sourceMappingURL=plano_cronologico.d.ts.map