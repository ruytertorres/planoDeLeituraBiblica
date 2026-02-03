/* ============================================================================
   testeUI.ts — Testes de Componentes UI
   Versão: 1.0.0
   ============================================================================
   Execute no console do navegador: testarUI()
   ============================================================================ */

import { CalendarioComponent } from "./components/Calendario/CalendarioComponent.js";
import { SearchUI } from "./components/Busca/SearchUI.js";
import { NotasUI } from "./components/Notas/NotasUI.js";
import { DiaCard } from "./components/DiaCard/DiaCard.js";
import { DarkModeManager } from "./components/DarkMode/DarkModeManager.js";
import { FooterComponent } from "./components/Footer/FooterComponent.js";
import { UIManager } from "./orquestradores/UIManager.js";

// ============================================================================
// TESTES
// ============================================================================

async function testarCalendario(): Promise<boolean> {
  console.log("🧪 Testando CalendarioComponent...");
  
  const mockViewModel = {
    gerarMesAtual: () => ({
      nome: "Janeiro",
      ano: 2025,
      dias: [
        { label: "1", numero: 1, classes: [], clicavel: true },
        { label: "2", numero: 2, classes: [], clicavel: true },
      ],
    }),
    onMesPosterior: () => {},
    onProximoMes: () => {},
    onSelecionarDia: () => {},
  };

  try {
    const calendario = new CalendarioComponent({
      containerId: "calendario",
      viewModel: mockViewModel,
    });

    // Verificar se renderiza (vai falhar silenciosamente se container não existir)
    calendario.render();
    console.log("  ✅ CalendarioComponent criado com sucesso");
    return true;
  } catch (error) {
    console.error("  ❌ Erro no CalendarioComponent:", error);
    return false;
  }
}

async function testarSearchUI(): Promise<boolean> {
  console.log("🧪 Testando SearchUI...");
  
  const mockSearchEngine = {
    buscar: () => [
      { dia: 1, title: "Dia 1", subtitle: "Gênesis 1", type: "dia" as const },
    ],
  };

  try {
    const searchUI = new SearchUI(mockSearchEngine, () => {});
    console.log("  ✅ SearchUI criado com sucesso");
    
    // Testar métodos públicos
    searchUI.clear();
    console.log("  ✅ Métodos públicos funcionam");
    
    searchUI.destroy();
    return true;
  } catch (error) {
    console.error("  ❌ Erro no SearchUI:", error);
    return false;
  }
}

async function testarNotasUI(): Promise<boolean> {
  console.log("🧪 Testando NotasUI...");
  
  const mockOrquestrador = {
    alternar: () => {},
    fechar: () => {},
    limparNotas: () => {},
    exportarNotas: () => {},
    salvarConteudo: () => {},
    isAberto: () => false,
  };

  try {
    const notasUI = new NotasUI({ orquestrador: mockOrquestrador });
    console.log("  ✅ NotasUI criado com sucesso");
    notasUI.destroy();
    return true;
  } catch (error) {
    console.error("  ❌ Erro no NotasUI:", error);
    return false;
  }
}

async function testarDiaCard(): Promise<boolean> {
  console.log("🧪 Testando DiaCard...");
  
  try {
    const mockDia = {
      numero: 1,
      dataFormatada: "01/01/2025",
      antigoTestamento: [{ livroId: "genesis", livroNome: "Gênesis", capituloInicio: 1, capituloFim: 3 }],
      novoTestamento: [],
      observacoes: "Teste",
    };

    const html = DiaCard.render(mockDia, { isHoje: true, isLido: false });
    
    if (html.includes("Dia 1") && html.includes("Gênesis")) {
      console.log("  ✅ DiaCard renderiza corretamente");
      return true;
    } else {
      console.error("  ❌ DiaCard não renderizou conteúdo esperado");
      return false;
    }
  } catch (error) {
    console.error("  ❌ Erro no DiaCard:", error);
    return false;
  }
}

async function testarDarkModeManager(): Promise<boolean> {
  console.log("🧪 Testando DarkModeManager...");
  
  try {
    const manager = new DarkModeManager();
    
    // Testar API pública
    const tema = manager.getCurrentTheme();
    const isDark = manager.isDarkModeEnabled();
    
    console.log(`  ✅ Tema atual: ${tema}, Dark: ${isDark}`);
    
    // Testar toggle (sem alterar preferência)
    // manager.toggle(); // Comentado para não mudar tema do usuário
    
    return true;
  } catch (error) {
    console.error("  ❌ Erro no DarkModeManager:", error);
    return false;
  }
}

async function testarFooterComponent(): Promise<boolean> {
  console.log("🧪 Testando FooterComponent...");
  
  try {
    const footer = new FooterComponent();
    console.log("  ✅ FooterComponent criado com sucesso");
    footer.destroy();
    return true;
  } catch (error) {
    console.error("  ❌ Erro no FooterComponent:", error);
    return false;
  }
}

async function testarUIManager(): Promise<boolean> {
  console.log("🧪 Testando UIManager...");
  
  try {
    const uiManager = new UIManager();
    
    // Testar registro de componentes
    uiManager.registrarComponente("calendario", null as any);
    uiManager.ativar("calendario");
    
    const stats = uiManager.getEstatisticas();
    console.log(`  ✅ UIManager: ${stats.total} componentes registrados`);
    
    uiManager.destroy();
    return true;
  } catch (error) {
    console.error("  ❌ Erro no UIManager:", error);
    return false;
  }
}

// ============================================================================
// EXECUÇÃO DOS TESTES
// ============================================================================

export async function testarUI(): Promise<void> {
  console.log("========================================");
  console.log("🧪 TESTES DE COMPONENTES UI - FASE 3.8");
  console.log("========================================\n");

  const resultados = {
    calendario: await testarCalendario(),
    searchUI: await testarSearchUI(),
    notasUI: await testarNotasUI(),
    diaCard: await testarDiaCard(),
    darkMode: await testarDarkModeManager(),
    footer: await testarFooterComponent(),
    uiManager: await testarUIManager(),
  };

  console.log("\n========================================");
  console.log("📊 RESULTADOS");
  console.log("========================================");

  const todosPassaram = Object.values(resultados).every((r) => r);

  Object.entries(resultados).forEach(([nome, passou]) => {
    console.log(`  ${passou ? "✅" : "❌"} ${nome}: ${passou ? "PASSOU" : "FALHOU"}`);
  });

  console.log("\n" + (todosPassaram ? "🎉 TODOS OS TESTES PASSARAM!" : "⚠️ ALGUNS TESTES FALHARAM"));
  console.log("========================================");

  // Disponibilizar globalmente
  if (typeof window !== "undefined") {
    (window as any).uiTestResults = resultados;
    (window as any).uiTestPass = todosPassaram;
  }
}

// Disponibilizar globalmente
if (typeof window !== "undefined") {
  (window as any).testarUI = testarUI;
}

console.log("🧪 Testes de UI disponíveis: testarUI()");
