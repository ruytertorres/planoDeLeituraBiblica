/* ============================================================================
   main-hibrido.js — Ponto de Entrada Híbrido Simplificado
   Versão: 1.0.0
   Aplicação: Bíblia Responsiva — Migração Parcial

   RESPONSABILIDADE:
   - Carregar núcleo TypeScript e manter compatibilidade
   - Inicializar sistema com fallback automático
   - Servir como ponte entre TS e JS
============================================================================ */

/* ============================================================================
   IMPORTAÇÕES (JavaScript)
============================================================================ */

import planoCronologico from "./cartuchos/plano_cronologico.js";
import { MainOrquestrador } from "./ui/orquestradores/MainOrquestrador.js";
import { CertificadoPlugin } from "./ui/plugins/CertificadoPlugin.js";
import { ExportacaoPlugin } from "./ui/plugins/ExportacaoPlugin.js";
import { ReajusteModalUI } from "./ui/componentes/modais/ReajusteModalUI.js";

/* ============================================================================
   VARIÁVEIS GLOBAIS
============================================================================ */

let mainOrquestrador = null;
let nucloTypeScriptCarregado = false;

/* ============================================================================
   TENTATIVA DE CARREGAR NÚCLEO TYPESCRIPT
============================================================================ */

async function carregarNucleoTypeScript() {
  // Sistema operará 100% em modo JavaScript
  // Não tentar carregar TypeScript para evitar erros 404
  console.log("📦 Sistema configurado para operar 100% em modo JavaScript");
  return null;
}

/* ============================================================================
   INICIALIZAÇÃO HÍBRIDA
============================================================================ */

async function inicializarSistemaHibrido() {
  try {
    // Sistema 100% JavaScript - sem tentativas de TypeScript
    console.log("🚀 Inicializando sistema em modo JavaScript 100% funcional");

    // Criar orquestrador JavaScript
    mainOrquestrador = new MainOrquestrador(planoCronologico);

    // Plugins JavaScript normais
    mainOrquestrador.registerPlugin(new CertificadoPlugin());
    mainOrquestrador.registerPlugin(new ExportacaoPlugin());

    // 2. Inicializar orquestrador
    await mainOrquestrador.init();

    // 3. Configurar eventos
    configurarEventos();

    // 4. Verificar reajuste
    await verificarReajuste();

    console.log(
      "✅ Sistema inicializado com sucesso - Modo JavaScript 100% funcional",
    );
    return mainOrquestrador;
  } catch (error) {
    console.error("❌ Erro na inicialização:", error);
    throw error;
  }
}

/* ============================================================================
   ADAPTERS PARA PLUGINS
============================================================================ */

function criarPluginAdapter(PluginClass, mainOrquestrador) {
  return {
    nome: PluginClass.name || "Plugin",
    versao: "1.0.0",

    init(adapterTS) {
      try {
        const plugin = new PluginClass();

        // Mapear interface do adapter TypeScript para o que o plugin espera
        const adapterParaPlugin = {
          getPlano: () => adapterTS.getPlano(),
          getDiaAtual: () => adapterTS.getDiaAtual(),
          irParaDia: (num) => adapterTS.irParaDia(num),
          proximoDia: () => adapterTS.proximoDia(),
          diaAnterior: () => adapterTS.diaAnterior(),
          temProximo: () => adapterTS.temProximo(),
          temAnterior: () => adapterTS.temAnterior(),
          resetar: () => adapterTS.resetar(),
          getTotalDias: () => adapterTS.getTotalDias(),
          getIndiceAtual: () => adapterTS.getIndiceAtual(),
          // Adicionar método on para compatibilidade com plugins
          on: (target, event, handler, options) =>
            mainOrquestrador.on(target, event, handler, options),
          // Adicionar método listen para compatibilidade com plugins
          listen: (event, handler) => mainOrquestrador.listen(event, handler),
          // Adicionar método emit para compatibilidade com plugins
          emit: (event, data) => mainOrquestrador.emit(event, data),
        };

        if (typeof plugin.init === "function") {
          plugin.init(adapterParaPlugin);
        }
      } catch (error) {
        console.error(`❌ Erro ao adaptar plugin ${PluginClass.name}:`, error);
      }
    },

    destroy() {},
  };
}

/* ============================================================================
   CONFIGURAÇÃO DE EVENTOS
============================================================================ */

function configurarEventos() {
  // Listener para lacuna detectada
  document.addEventListener("lacuna-detectada", (evento) => {
    try {
      const reajusteModal = new ReajusteModalUI(mainOrquestrador);
      reajusteModal.criarEExibir(evento.detail);
    } catch (error) {
      console.error("❌ Erro ao carregar modal de reajuste:", error);
    }
  });

  // Cleanup
  window.addEventListener("beforeunload", () => {
    if (mainOrquestrador) {
      mainOrquestrador.destroy();
    }
  });

  window.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      // Aplicação em background
    }
  });
}

async function verificarReajuste() {
  if (
    mainOrquestrador &&
    typeof mainOrquestrador.verificarAndDispararReajuste === "function"
  ) {
    try {
      await mainOrquestrador.verificarAndDispararReajuste();
    } catch (error) {
      console.error("❌ Erro ao verificar reajuste:", error);
    }
  }
}

/* ============================================================================
   PONTO DE ENTRADA
============================================================================ */

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const orquestrador = await inicializarSistemaHibrido();

    // Expor globalmente
    window.mainOrquestrador = orquestrador;
    window.tipoNucleo = nucloTypeScriptCarregado ? "TypeScript" : "JavaScript";
  } catch (error) {
    console.error("❌ Erro fatal na inicialização:", error);
    alert("Erro ao inicializar aplicação. Por favor, recarregue a página.");
  }
});
