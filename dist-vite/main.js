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
import planoCronologico from "./cartuchos/plano_cronologico";
import { inicializarAdapter, getUIAdapter } from "./compatibilidade/ui-adapter";
/* ============================================================================
   INICIALIZAÇÃO DO SISTEMA
============================================================================ */
/**
 * Inicializa o núcleo TypeScript e cria ponte para UI.
 *
 * Esta função substituirá gradualmente a inicialização JavaScript
 * mantendo compatibilidade total com o código existente.
 */
export function inicializarSistemaTypeScript() {
    try {
        // Validar plano (já feito em importação, mas dupla segurança)
        if (!planoCronologico || !planoCronologico.id) {
            throw new Error("Plano cronológico inválido");
        }
        // Inicializar adaptador global para UI JavaScript
        inicializarAdapter(planoCronologico);
        // Expor adaptador globalmente para compatibilidade
        if (typeof window !== "undefined") {
            window.uiAdapter = getUIAdapter();
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
export function getAdapter() {
    return getUIAdapter();
}
/**
 * Verifica se o núcleo TypeScript está inicializado.
 *
 * @returns True se inicializado
 */
export function nucleoInicializado() {
    return getUIAdapter() !== null;
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
/* ============================================================================
   EXPORTAÇÕES PARA MIGRAÇÃO GRADUAL
============================================================================ */
export { planoCronologico };
export { UIAdapter, criarUIAdapter } from "./compatibilidade/ui-adapter";
