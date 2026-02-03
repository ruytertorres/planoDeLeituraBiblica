/* ============================================================================
   index.ts — Ponto de Entrada TypeScript da Aplicação
   Versão: 1.0.0
   Aplicação: Bíblia Responsiva — Domínio de Planos, Tempo e Orquestração

   RESPONSABILIDADE:
   - Exportar o núcleo tipado do sistema
   - Servir como ponto central de importações
   - Facilitar migração gradual de JS para TS

   CONTRATO:
   - Apenas exporta, NÃO executa lógica
   - Mantém compatibilidade com código existente
   - Segue ordem formal de refatoração (Seção 4 CONTRATO_DE_REMODULACAO_TS.MD)
============================================================================ */
/* ============================================================================
   NÚCLEO TEMPORAL (Prioridade 1)
============================================================================ */
export * from "./core/services/tempo/geradorDatas.js";
/* ============================================================================
   MODELOS DE DOMÍNIO (Prioridade 1)
============================================================================ */
export * from "./core/models/Dia.js";
/* ============================================================================
   TIPOS E CONTRATOS (Prioridade 2)
============================================================================ */
export * from "./core/types/contratos.types.js";
/* ============================================================================
   SERVIÇOS DE ORQUESTRAÇÃO (Prioridade 1)
============================================================================ */
export * from "./core/services/planos/PlanoManager.js";
export * from "./core/services/planos/validadorPlano.js";
/* ============================================================================
   COMPATIBILIDADE E INTEGRAÇÃO
============================================================================ */
export * from "./compatibilidade/ui-adapter.js";
export * from "./main.js";
/* ============================================================================
   UI MIGRADA (Prioridade 4 - Parcial)
============================================================================ */
export * from "./ui/orquestradores/MainOrquestrador.js";
export * from "./ui/components/DiaCard.js";
/* ============================================================================
   PLANOS-CARTUCHO (Prioridade 3)
============================================================================ */
export { default as planoCronologico } from "./cartuchos/plano_cronologico.js";
/* ============================================================================
   DECLARAÇÃO DE COMPATIBILIDADE
============================================================================ */
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
