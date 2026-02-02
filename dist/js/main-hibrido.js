"use strict";
/* ============================================================================
   main-hibrido.js — Ponto de Entrada Híbrido Simplificado
   Versão: 1.0.0
   Aplicação: Bíblia Responsiva — Migração Parcial

   RESPONSABILIDADE:
   - Carregar núcleo TypeScript e manter compatibilidade
   - Inicializar sistema com fallback automático
   - Servir como ponte entre TS e JS
============================================================================ */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* ============================================================================
   IMPORTAÇÕES (JavaScript)
============================================================================ */
const plano_cronologico_js_1 = __importDefault(require("./cartuchos/plano_cronologico.js"));
const MainOrquestrador_js_1 = require("./ui/orquestradores/MainOrquestrador.js");
const CertificadoPlugin_js_1 = require("./ui/plugins/CertificadoPlugin.js");
const ExportacaoPlugin_js_1 = require("./ui/plugins/ExportacaoPlugin.js");
const ReajusteModalUI_js_1 = require("./ui/componentes/modais/ReajusteModalUI.js");
/* ============================================================================
   VARIÁVEIS GLOBAIS
============================================================================ */
let mainOrquestrador = null;
let nucloTypeScriptCarregado = false;
/* ============================================================================
   TENTATIVA DE CARREGAR NÚCLEO TYPESCRIPT
============================================================================ */
async function carregarNucleoTypeScript() {
    try {
        // Tentar importar do núcleo compilado
        const { planoCronologico: planoTS, MainOrquestrador: MainOrquestradorTS, inicializarSistemaTypeScript, getAdapter, } = await Promise.resolve().then(() => __importStar(require("../dist/index.js")));
        // Inicializar sistema TypeScript
        inicializarSistemaTypeScript();
        const adapter = getAdapter();
        if (adapter) {
            return {
                plano: planoTS,
                Orquestrador: MainOrquestradorTS,
                adapter: adapter,
                tipo: "typescript",
            };
        }
        throw new Error("Adaptador não disponível");
    }
    catch (error) {
        return null;
    }
}
/* ============================================================================
   INICIALIZAÇÃO HÍBRIDA
============================================================================ */
async function inicializarSistemaHibrido() {
    try {
        // 1. Tentar carregar núcleo TypeScript
        const nucleoTS = await carregarNucleoTypeScript();
        if (nucleoTS) {
            // Sistema TypeScript disponível
            // Criar orquestrador TypeScript
            mainOrquestrador = new nucleoTS.Orquestrador(nucleoTS.plano);
            nucloTypeScriptCarregado = true;
            // Adaptar plugins JavaScript para TypeScript
            const pluginCertificado = criarPluginAdapter(CertificadoPlugin_js_1.CertificadoPlugin, nucleoTS.adapter);
            const pluginExportacao = criarPluginAdapter(ExportacaoPlugin_js_1.ExportacaoPlugin, nucleoTS.adapter);
            mainOrquestrador.registerPlugin(pluginCertificado);
            mainOrquestrador.registerPlugin(pluginExportacao);
        }
        else {
            // Fallback para JavaScript
            mainOrquestrador = new MainOrquestrador_js_1.MainOrquestrador(plano_cronologico_js_1.default);
            // Plugins JavaScript normais
            mainOrquestrador.registerPlugin(new CertificadoPlugin_js_1.CertificadoPlugin());
            mainOrquestrador.registerPlugin(new ExportacaoPlugin_js_1.ExportacaoPlugin());
        }
        // 2. Inicializar orquestrador
        await mainOrquestrador.init();
        // 3. Configurar eventos
        configurarEventos();
        // 4. Verificar reajuste
        await verificarReajuste();
        return mainOrquestrador;
    }
    catch (error) {
        console.error("❌ Erro na inicialização:", error);
        throw error;
    }
}
/* ============================================================================
   ADAPTERS PARA PLUGINS
============================================================================ */
function criarPluginAdapter(PluginClass, adapter) {
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
                };
                if (typeof plugin.init === "function") {
                    plugin.init(adapterParaPlugin);
                }
            }
            catch (error) {
                console.error(`❌ Erro ao adaptar plugin ${PluginClass.name}:`, error);
            }
        },
        destroy() { },
    };
}
/* ============================================================================
   CONFIGURAÇÃO DE EVENTOS
============================================================================ */
function configurarEventos() {
    // Listener para lacuna detectada
    document.addEventListener("lacuna-detectada", (evento) => {
        try {
            const reajusteModal = new ReajusteModalUI_js_1.ReajusteModalUI(mainOrquestrador);
            reajusteModal.criarEExibir(evento.detail);
        }
        catch (error) {
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
    if (mainOrquestrador &&
        typeof mainOrquestrador.verificarAndDispararReajuste === "function") {
        try {
            await mainOrquestrador.verificarAndDispararReajuste();
        }
        catch (error) {
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
    }
    catch (error) {
        console.error("❌ Erro fatal na inicialização:", error);
        alert("Erro ao inicializar aplicação. Por favor, recarregue a página.");
    }
});
