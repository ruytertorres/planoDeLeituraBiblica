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
import { materializarPlanoCartucho } from "./core/services/planos/materializarPlanoCartucho";
import { MainOrquestrador } from "./ui/orquestradores/MainOrquestrador";

/* ============================================================================
   INICIALIZAÇÃO DO SISTEMA
============================================================================ */

let mainOrquestrador: MainOrquestrador | null = null;

/**
 * Inicializa o núcleo TypeScript e cria ponte para UI.
 */
export async function inicializarSistemaTypeScript(): Promise<void> {
  try {
    // Validar plano
    if (!planoCronologico || !planoCronologico.id) {
      throw new Error("Plano cronológico inválido");
    }

    const planoMaterializado = materializarPlanoCartucho(
      planoCronologico as any,
    );

    // Inicializar adaptador global para UI JavaScript
    inicializarAdapter(planoMaterializado);

    // Inicializar MainOrquestrador (gerencia toda a UI)
    mainOrquestrador = new MainOrquestrador(planoMaterializado);
    await mainOrquestrador.init();

    // Expor adaptador globalmente para compatibilidade
    if (typeof window !== "undefined") {
      (window as any).uiAdapter = getUIAdapter();
      (window as any).mainOrquestrador = mainOrquestrador;
    }

    console.log("✅ Sistema inicializado com sucesso");
  } catch (error) {
    console.error("❌ Erro na inicialização:", error);
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
export function getAdapter(): any {
  return getUIAdapter();
}

/**
 * Verifica se o núcleo TypeScript está inicializado.
 *
 * @returns True se inicializado
 */
export function nucleoInicializado(): boolean {
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
  } else {
    // DOM já está pronto
    inicializarSistemaTypeScript();
  }
}

/* ============================================================================
   EXPORTAÇÕES PARA MIGRAÇÃO GRADUAL
============================================================================ */

export { planoCronologico };
export type {
  DiaDoPlano,
  PlanoCartucho,
  EstadoPlano,
  DecisaoUsuario,
  ProgressoLeitura,
} from "./core/types/contratos.types";

export { UIAdapter, criarUIAdapter } from "./compatibilidade/ui-adapter";
