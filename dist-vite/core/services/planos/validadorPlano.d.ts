import type { PlanoCartucho, ResultadoValidacao } from "../../types/contratos.types";
/**
 * Valida se um plano de leitura cumpre todos os contratos exigidos.
 *
 * @param plano - Plano a ser validado
 * @returns Resultado da validação
 */
export declare function validarPlano(plano: unknown): ResultadoValidacao;
/**
 * Valida e lança erro se inválido (compatibilidade com código legado).
 *
 * @param plano - Plano a ser validado
 * @throws Se o plano for inválido
 */
export declare function validarPlanoStrict(plano: unknown): asserts plano is PlanoCartucho;
/**
 * Verifica se um plano é válido sem lançar erros.
 *
 * @param plano - Plano a ser verificado
 * @returns True se válido
 */
export declare function planoValido(plano: unknown): plano is PlanoCartucho;
//# sourceMappingURL=validadorPlano.d.ts.map