"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function () { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function (m, exports) {
    for (var p in m)
        if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p))
            __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.planoCronologico = void 0;
/* ============================================================================
   NÚCLEO TEMPORAL (Prioridade 1)
============================================================================ */
__exportStar(require("./core/services/tempo/geradorDatas"), exports);
/* ============================================================================
   MODELOS DE DOMÍNIO (Prioridade 1)
============================================================================ */
__exportStar(require("./core/models/Dia"), exports);
/* ============================================================================
   TIPOS E CONTRATOS (Prioridade 2)
============================================================================ */
__exportStar(require("./core/types/contratos.types"), exports);
/* ============================================================================
   SERVIÇOS DE ORQUESTRAÇÃO (Prioridade 1)
============================================================================ */
__exportStar(require("./core/services/planos/PlanoManager"), exports);
__exportStar(require("./core/services/planos/validadorPlano"), exports);
/* ============================================================================
   COMPATIBILIDADE E INTEGRAÇÃO
============================================================================ */
__exportStar(require("./compatibilidade/ui-adapter"), exports);
__exportStar(require("./main"), exports);
/* ============================================================================
   UI MIGRADA (Prioridade 4 - Parcial)
============================================================================ */
__exportStar(require("./ui/orquestradores/MainOrquestrador"), exports);
__exportStar(require("./ui/components/DiaCard"), exports);
/* ============================================================================
   PLANOS-CARTUCHO (Prioridade 3)
============================================================================ */
var planoCronologico_1 = require("./cartuchos/planoCronologico");
Object.defineProperty(exports, "planoCronologico", { enumerable: true, get: function () { return __importDefault(planoCronologico_1).default; } });
