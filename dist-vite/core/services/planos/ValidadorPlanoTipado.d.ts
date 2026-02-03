import type { ResultadoValidacao } from '../../types';
/**
 * Validador estrutural de planos usando TypeScript
 */
export declare class ValidadorPlanoTipado {
    /**
     * Valida um plano completo contra o contrato
     */
    static validarPlano(plano: unknown): ResultadoValidacao;
    /**
     * Valida metadados do plano
     */
    private static validarMetadados;
    /**
     * Valida um dia individual
     */
    private static validarDia;
}
//# sourceMappingURL=ValidadorPlanoTipado.d.ts.map