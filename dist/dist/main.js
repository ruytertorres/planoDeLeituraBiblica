"use strict";
/* ============================================================================
   main.ts — Ponto de Entrada TypeScript da Aplicação
   Versão: 1.0.0
   Aplicação: Bíblia Responsiva — Migração Parcial da UI

   RESPONSABILIDADE:
   - Inicializar o sistema com núcleo TypeScript
   - Criar ponte de compatibilidade para UI JavaScript
   - Manter fluxo existente da aplicação
   - Facilitar migração gradual

   CONTRATO:
   - Respeitar hierarquia do sistema (Seção 4 CONTRATO_DO_SISTEMA.md)
   - Nenhuma regra de domínio na UI
   - Interface consome núcleo tipado via adapter
============================================================================ */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarUIAdapter = exports.UIAdapter = exports.planoCronologico = void 0;
exports.inicializarSistemaTypeScript = inicializarSistemaTypeScript;
exports.getAdapter = getAdapter;
exports.nucleoInicializado = nucleoInicializado;
const planoCronologico_1 = __importDefault(require("./cartuchos/planoCronologico"));
exports.planoCronologico = planoCronologico_1.default;
const ui_adapter_1 = require("./compatibilidade/ui-adapter");
/* ============================================================================
   INICIALIZAÇÃO DO SISTEMA
============================================================================ */
/**
 * Inicializa o núcleo TypeScript e cria ponte para UI.
 *
 * Esta função substituirá gradualmente a inicialização JavaScript
 * mantendo compatibilidade total com o código existente.
 */
function inicializarSistemaTypeScript() {
    try {
        // Validar plano (já feito em importação, mas dupla segurança)
        if (!planoCronologico_1.default || !planoCronologico_1.default.id) {
            throw new Error("Plano cronológico inválido");
        }
        // Inicializar adaptador global para UI JavaScript
        (0, ui_adapter_1.inicializarAdapter)(planoCronologico_1.default);
        // Expor adaptador globalmente para compatibilidade
        if (typeof window !== "undefined") {
            window.uiAdapter = (0, ui_adapter_1.getUIAdapter)();
        }
    }
    catch (error) {
        console.error("❌ Erro na inicialização do núcleo TypeScript:", error);
        throw error;
    }
}
/* ============================================================================
   FUNÇÕES DE COMPATIBILIDADE
============================================================================ */
/**
 * Retorna o adaptador UI para uso pela interface JavaScript.
 *
 * @returns Instância do adaptador ou null
 */
function getAdapter() {
    return (0, ui_adapter_1.getUIAdapter)();
}
/**
 * Verifica se o núcleo TypeScript está inicializado.
 *
 * @returns True se inicializado
 */
function nucleoInicializado() {
    return (0, ui_adapter_1.getUIAdapter)() !== null;
}
/* ============================================================================
   AUTO-INICIALIZAÇÃO (Ambiente Browser)
============================================================================ */
// Inicializar automaticamente em ambiente de navegador
if (typeof window !== "undefined" && typeof document !== "undefined") {
    // Aguardar DOM estar pronto
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", inicializarSistemaTypeScript);
    }
    else {
        // DOM já está pronto
        inicializarSistemaTypeScript();
    }
}
var ui_adapter_2 = require("./compatibilidade/ui-adapter");
Object.defineProperty(exports, "UIAdapter", { enumerable: true, get: function () { return ui_adapter_2.UIAdapter; } });
Object.defineProperty(exports, "criarUIAdapter", { enumerable: true, get: function () { return ui_adapter_2.criarUIAdapter; } });
