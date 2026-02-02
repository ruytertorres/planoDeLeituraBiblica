import planoCronologico from "./cartuchos/plano_cronologico";
/**
 * Inicializa o núcleo TypeScript e cria ponte para UI.
 *
 * Esta função substituirá gradualmente a inicialização JavaScript
 * mantendo compatibilidade total com o código existente.
 */
export declare function inicializarSistemaTypeScript(): void;
/**
 * Retorna o adaptador UI para uso pela interface JavaScript.
 *
 * @returns Instância do adaptador ou null
 */
export declare function getAdapter(): any;
/**
 * Verifica se o núcleo TypeScript está inicializado.
 *
 * @returns True se inicializado
 */
export declare function nucleoInicializado(): boolean;
export { planoCronologico };
export type { DiaDoPlano, PlanoCartucho, EstadoPlano, DecisaoUsuario, ProgressoLeitura, } from "./core/types/contratos.types";
export { UIAdapter, criarUIAdapter } from "./compatibilidade/ui-adapter";
//# sourceMappingURL=main.d.ts.map