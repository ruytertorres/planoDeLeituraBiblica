/* ============================================================================
   testeLazyLoading.ts — Teste de Lazy Loading de Dias
   Versão: 1.0.0
   ============================================================================

   RESPONSABILIDADE:
   - Verificar se apenas o dia atual está carregado na memória
   - Validar cache funcionando corretamente
   - Medir performance do carregamento

   CONFORMIDADE COM CONTRATO_DO_SISTEMA.MD:
   - §3.1: Tempo é soberano (medição precisa)
   - §6: Cartucho puro + materialização lazy
   ============================================================================ */

import {
  inicializarCarregador,
  carregarDia,
  getEstatisticasCache,
  limparCache,
} from "./carregadorDias.js";
import planoCronologico from "../../../cartuchos/plano_cronologico.js";

// ============================================================================
// TESTES
// ============================================================================

/**
 * Teste 1: Verificar se apenas um dia é carregado inicialmente
 */
export async function testeCarregamentoUnico(): Promise<boolean> {
  console.log("🧪 TESTE 1: Carregamento único de dia");

  // Reset
  limparCache();
  inicializarCarregador(planoCronologico);

  const statsInicio = getEstatisticasCache();
  console.log(`  Cache no início: ${statsInicio.tamanho} dias`);

  // Carregar apenas o dia 1
  const inicio = performance.now();
  const dia1 = await carregarDia(1);
  const fim = performance.now();

  const statsFim = getEstatisticasCache();
  console.log(`  Cache após carregar dia 1: ${statsFim.tamanho} dias`);
  console.log(`  Tempo de carregamento: ${(fim - inicio).toFixed(2)}ms`);

  // Verificações
  const passou =
    dia1 !== undefined &&
    dia1.numero === 1 &&
    statsFim.tamanho === 1 &&
    statsInicio.tamanho === 0;

  console.log(`  ✅ Apenas 1 dia em cache: ${passou ? "SIM" : "NÃO"}`);
  console.log(
    `  ✅ Dia carregado corretamente: ${dia1?.numero === 1 ? "SIM" : "NÃO"}`,
  );

  return passou;
}

/**
 * Teste 2: Verificar cache hit
 */
export async function testeCacheHit(): Promise<boolean> {
  console.log("\n🧪 TESTE 2: Cache hit");

  // Dia 1 já está no cache do teste anterior
  const inicio = performance.now();
  const dia1Again = await carregarDia(1);
  const fim = performance.now();

  const tempo = fim - inicio;
  console.log(`  Tempo de cache hit: ${tempo.toFixed(2)}ms`);
  console.log(`  ✅ Cache hit rápido (< 1ms): ${tempo < 1 ? "SIM" : "NÃO"}`);

  return tempo < 1 && dia1Again?.numero === 1;
}

/**
 * Teste 3: Carregar múltiplos dias e verificar cache
 */
export async function testeCarregamentoMultiplo(): Promise<boolean> {
  console.log("\n🧪 TESTE 3: Carregamento múltiplo (dias 1, 2, 3)");

  limparCache();
  inicializarCarregador(planoCronologico);

  // Carregar 3 dias
  await carregarDia(1);
  await carregarDia(2);
  await carregarDia(3);

  const stats = getEstatisticasCache();
  console.log(`  Dias em cache: ${stats.tamanho}`);
  console.log(
    `  ✅ Apenas 3 dias em cache: ${stats.tamanho === 3 ? "SIM" : "NÃO"}`,
  );

  return stats.tamanho === 3;
}

/**
 * Teste 4: Não carregar todos os dias
 */
export async function testeNaoCarregarTodos(): Promise<boolean> {
  console.log("\n🧪 TESTE 4: Verificar que NÃO carregou todos os 317 dias");

  const stats = getEstatisticasCache();
  const naoCarregouTodos = stats.tamanho < planoCronologico.totalDias;

  console.log(`  Total de dias no plano: ${planoCronologico.totalDias}`);
  console.log(`  Dias em cache: ${stats.tamanho}`);
  console.log(`  ✅ Não carregou todos: ${naoCarregouTodos ? "SIM" : "NÃO"}`);

  return naoCarregouTodos;
}

/**
 * Teste 5: Performance < 100ms para carregar um dia
 */
export async function testePerformance(): Promise<boolean> {
  console.log("\n🧪 TESTE 5: Performance < 100ms");

  limparCache();
  inicializarCarregador(planoCronologico);

  const inicio = performance.now();
  await carregarDia(150); // Dia do meio
  const fim = performance.now();

  const tempo = fim - inicio;
  console.log(`  Tempo para carregar dia 150: ${tempo.toFixed(2)}ms`);
  console.log(`  ✅ < 100ms: ${tempo < 100 ? "SIM" : "NÃO"}`);

  return tempo < 100;
}

/**
 * Executa todos os testes
 */
export async function executarTodosTestes(): Promise<void> {
  console.log("========================================");
  console.log("🧪 TESTES DE LAZY LOADING - FASE 2.5");
  console.log("========================================\n");

  const resultados = {
    teste1: await testeCarregamentoUnico(),
    teste2: await testeCacheHit(),
    teste3: await testeCarregamentoMultiplo(),
    teste4: await testeNaoCarregarTodos(),
    teste5: await testePerformance(),
  };

  console.log("\n========================================");
  console.log("📊 RESULTADOS");
  console.log("========================================");

  const todosPassaram = Object.values(resultados).every((r) => r);

  Object.entries(resultados).forEach(([nome, passou]) => {
    console.log(
      `  ${passou ? "✅" : "❌"} ${nome}: ${passou ? "PASSOU" : "FALHOU"}`,
    );
  });

  console.log(
    "\n" +
      (todosPassaram
        ? "🎉 TODOS OS TESTES PASSARAM!"
        : "⚠️ ALGUNS TESTES FALHARAM"),
  );
  console.log("========================================");

  // Atualizar status no window para verificação externa
  if (typeof window !== "undefined") {
    (window as any).lazyLoadingTestResults = resultados;
    (window as any).lazyLoadingTestPass = todosPassaram;
  }
}

// Auto-executar se importado diretamente
if (typeof window !== "undefined") {
  // Disponibiliza globalmente para teste manual
  (window as any).testeLazyLoading = executarTodosTestes;
  console.log("🧪 Teste de lazy loading disponível: window.testeLazyLoading()");
}
