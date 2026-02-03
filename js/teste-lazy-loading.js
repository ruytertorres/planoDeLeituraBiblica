/* ============================================================================
   teste-lazy-loading.js — Script de teste para navegador
   Execute no console: testarLazyLoading()
   ============================================================================ */

async function testarLazyLoading() {
  console.log("========================================");
  console.log("🧪 TESTE DE LAZY LOADING - FASE 2.5");
  console.log("========================================\n");

  // Verificar se o carregador está disponível
  if (typeof window.carregadorDias === "undefined") {
    console.log("⚠️ carregadorDias não encontrado no window");
    console.log("Verificando módulos carregados...");
    
    // Tentar acessar via import dinâmico se disponível
    try {
      const modulo = await import("./dist-vite/core/services/planos/carregadorDias.js");
      window.carregadorDias = modulo;
      console.log("✅ Módulo carregadorDias importado dinamicamente");
    } catch (e) {
      console.error("❌ Não foi possível carregar carregadorDias:", e);
      return;
    }
  }

  const { inicializarCarregador, carregarDia, getEstatisticasCache, limparCache } = window.carregadorDias;

  // Teste 1: Carregamento único
  console.log("🧪 TESTE 1: Carregamento único de dia");
  limparCache();
  inicializarCarregador(window.planoCronologico);

  const statsInicio = getEstatisticasCache();
  console.log(`  Cache no início: ${statsInicio.tamanho} dias`);

  const inicio = performance.now();
  const dia1 = await carregarDia(1);
  const fim = performance.now();

  const statsFim = getEstatisticasCache();
  console.log(`  Cache após carregar dia 1: ${statsFim.tamanho} dias`);
  console.log(`  Tempo de carregamento: ${(fim - inicio).toFixed(2)}ms`);

  const teste1Passou = statsFim.tamanho === 1 && dia1?.numero === 1;
  console.log(`  ✅ Apenas 1 dia em cache: ${teste1Passou ? "SIM" : "NÃO"}\n`);

  // Teste 2: Cache hit
  console.log("🧪 TESTE 2: Cache hit");
  const inicio2 = performance.now();
  const dia1Again = await carregarDia(1);
  const fim2 = performance.now();
  const tempoCache = fim2 - inicio2;
  console.log(`  Tempo de cache hit: ${tempoCache.toFixed(2)}ms`);
  const teste2Passou = tempoCache < 1;
  console.log(`  ✅ Cache hit rápido (< 1ms): ${teste2Passou ? "SIM" : "NÃO"}\n`);

  // Teste 3: Múltiplos dias
  console.log("🧪 TESTE 3: Carregamento múltiplo (dias 2, 3)");
  await carregarDia(2);
  await carregarDia(3);
  const statsMulti = getEstatisticasCache();
  console.log(`  Dias em cache: ${statsMulti.tamanho}`);
  const teste3Passou = statsMulti.tamanho === 3;
  console.log(`  ✅ 3 dias em cache: ${teste3Passou ? "SIM" : "NÃO"}\n`);

  // Teste 4: Não carregou todos
  console.log("🧪 TESTE 4: Verificar que NÃO carregou todos os 317 dias");
  const totalDias = window.planoCronologico?.totalDias || 317;
  console.log(`  Total de dias no plano: ${totalDias}`);
  console.log(`  Dias em cache: ${statsMulti.tamanho}`);
  const teste4Passou = statsMulti.tamanho < totalDias;
  console.log(`  ✅ Não carregou todos: ${teste4Passou ? "SIM" : "NÃO"}\n`);

  // Teste 5: Performance
  console.log("🧪 TESTE 5: Performance < 100ms");
  limparCache();
  inicializarCarregador(window.planoCronologico);
  const inicioPerf = performance.now();
  await carregarDia(150);
  const fimPerf = performance.now();
  const tempoPerf = fimPerf - inicioPerf;
  console.log(`  Tempo para carregar dia 150: ${tempoPerf.toFixed(2)}ms`);
  const teste5Passou = tempoPerf < 100;
  console.log(`  ✅ < 100ms: ${teste5Passou ? "SIM" : "NÃO"}\n`);

  // Resultado final
  console.log("========================================");
  console.log("📊 RESULTADO FINAL");
  console.log("========================================");
  
  const todosPassaram = teste1Passou && teste2Passou && teste3Passou && teste4Passou && teste5Passou;
  
  console.log(`  ${teste1Passou ? "✅" : "❌"} Teste 1: Carregamento único`);
  console.log(`  ${teste2Passou ? "✅" : "❌"} Teste 2: Cache hit`);
  console.log(`  ${teste3Passou ? "✅" : "❌"} Teste 3: Múltiplos dias`);
  console.log(`  ${teste4Passou ? "✅" : "❌"} Teste 4: Não carregou todos`);
  console.log(`  ${teste5Passou ? "✅" : "❌"} Teste 5: Performance < 100ms`);
  
  console.log("\n" + (todosPassaram ? "🎉 TODOS OS TESTES PASSARAM!" : "⚠️ ALGUNS TESTES FALHARAM"));
  console.log("========================================");

  return {
    todosPassaram,
    testes: {
      carregamentoUnico: teste1Passou,
      cacheHit: teste2Passou,
      multiplo: teste3Passou,
      naoTodos: teste4Passou,
      performance: teste5Passou,
    },
    metricas: {
      diasEmCache: statsMulti.tamanho,
      tempoCarregamento: tempoPerf,
    },
  };
}

// Disponibilizar globalmente
window.testarLazyLoading = testarLazyLoading;

console.log("🧪 Teste de lazy loading disponível: testarLazyLoading()");
