export * from "./core/services/tempo/geradorDatas";
export * from "./core/models/Dia";
export * from "./core/types/contratos.types";
export * from "./core/services/planos/PlanoManager";
export * from "./core/services/planos/validadorPlano";
export * from "./compatibilidade/ui-adapter";
export * from "./main";
export * from "./ui/orquestradores/MainOrquestrador";
export * from "./ui/components/DiaCard";
export { default as planoCronologico } from "./cartuchos/plano_cronologico";
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