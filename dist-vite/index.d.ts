export * from "./core/services/tempo/geradorDatas.js";
export * from "./core/models/Dia.js";
export * from "./core/types/contratos.types.js";
export * from "./core/services/planos/PlanoManager.js";
export * from "./core/services/planos/validadorPlano.js";
export * from "./compatibilidade/ui-adapter.js";
export * from "./main.js";
export * from "./ui/orquestradores/MainOrquestrador.js";
export * from "./ui/components/DiaCard.js";
export { default as planoCronologico } from "./cartuchos/plano_cronologico.js";
/**
 * Este arquivo serve como ponto de entrada para o sistema tipado.
 *
 * Uso recomendado durante migração:
 *
 * ```typescript
 * // Importar núcleo tipado
 * import { geradorDatas, PlanoManager, planoCronologico } from './src/index';
 *
 * // Manter UI em JavaScript enquanto migra núcleo
 * import { MainOrquestrador } from './js/ui/orquestradores/MainOrquestrador.js';
 * ```
 *
 * Regras:
 * 1. Nenhuma execução de código aqui
 * 2. Apenas exportações estruturadas
 * 3. Ordem respeita hierarquia do sistema
 */
//# sourceMappingURL=index.d.ts.map