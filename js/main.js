/* ============================================================================
   main.js — Ponto de Entrada da Aplicação (Refatorado v3.0)
   Versão: 3.0.0 — ARQUITETURA COM PLUGIN SYSTEM
============================================================================
   
   RESPONSABILIDADE: Apenas inicializar MainOrquestrador com plugins
   
   Mudança: A lógica de orquestração foi movida para MainOrquestrador.js
   Benefícios:
   - Testável isoladamente
   - Suporta plugins modulares
   - Gerenciamento de listeners centralizado (sem memory leaks)
   - Preparado para escalar
   
============================================================================ */

/* ===================== IMPORTAÇÕES ===================== */
import planoCronologico from "./core/services/planos/plano_cronologico.js";
import { MainOrquestrador } from "./ui/orquestradores/MainOrquestrador.js";
import { CertificadoPlugin } from "./ui/plugins/CertificadoPlugin.js";
import { ExportacaoPlugin } from "./ui/plugins/ExportacaoPlugin.js";
import { ReajusteModalUI } from "./ui/componentes/modais/ReajusteModalUI.js";

/* ===================== INICIALIZAÇÃO ===================== */

/**
 * DOMContentLoaded: Inicializar aplicação
 */
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Criar orquestrador central
    const mainOrquestrador = new MainOrquestrador(planoCronologico);

    // Registrar plugins
    mainOrquestrador.registerPlugin(new CertificadoPlugin());
    mainOrquestrador.registerPlugin(new ExportacaoPlugin());

    // TODO: Adicionar mais plugins conforme necessário:
    // - VersaoBibliaPlugin (para múltiplas versões)
    // - ImportacaoPlugin (para importar dados)
    // - ExportacaoPDFPlugin (para PDF real)
    // etc.

    // Inicializar
    await mainOrquestrador.init();

    // Listener para lacuna detectada - CRIAR ANTES (para não perder evento)
    document.addEventListener("lacuna-detectada", (evento) => {
      console.log(
        "📢 Lacuna detectada, abrindo modal de reajuste",
        evento.detail,
      );
      const reajusteModal = new ReajusteModalUI(mainOrquestrador);
      reajusteModal.criarEExibir(evento.detail);
    });

    // Verificar e disparar reajuste de lacuna (se aplicável)
    // Isso deve acontecer logo após a inicialização para detectar gaps
    await mainOrquestrador.verificarAndDispararReajuste();

    // Cleanup ao sair
    window.addEventListener("beforeunload", () => {
      mainOrquestrador.destroy();
    });

    // Cleanup em tab close (para SPA)
    window.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        console.log("Aplicação em background");
      }
    });

    console.log("✅ Aplicação iniciada com sucesso");
  } catch (error) {
    console.error("❌ Erro fatal na inicialização:", error);
    alert("Erro ao inicializar aplicação. Por favor, recarregue a página.");
  }
});
