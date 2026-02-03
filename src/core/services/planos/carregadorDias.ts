/* ============================================================================
   carregadorDias.ts — Carregamento Lazy de Dias com Cache
   Versão: 1.0.0
   ============================================================================

   RESPONSABILIDADE:
   - Carregar dias sob demanda (lazy loading)
   - Cachear dias já materializados
   - Respeitar a soberania do tempo via geradorDatas.ts

   CONFORMIDADE COM CONTRATO_DO_SISTEMA.MD:
   - §3.1: Tempo é soberano (usa geradorDatas.ts)
   - §3.2: Sem new Date() fora do gerador
   - §6: Cartucho puro + materialização no core
   - §4: Hierarquia de autoridade respeitada
   ============================================================================ */

import type { DiaDoPlano, PlanoCartucho } from "../../types/contratos.types";
import { getAnoAtual } from "../tempo/geradorDatas.js";
import { materializarDia } from "./materializarDia.js";

// ============================================================================
// TIPOS
// ============================================================================

type DiaCache = {
  dia: DiaDoPlano;
  timestamp: number;
  acessoCount: number;
};

type PlanoCartuchoRaw = {
  id: string;
  nome: string;
  descricao: string;
  totalDias: number;
  dias: DiaPlanoRaw[];
};

type DiaPlanoRaw = {
  numero: number;
  antigoTestamento: unknown[];
  novoTestamento: unknown[];
  livros: string[];
  capitulos: number[];
  versiculos: string[];
  observacoes: string;
};

// ============================================================================
// CACHE GLOBAL
// ============================================================================

const cacheDias = new Map<number, DiaCache>();
const MAX_CACHE_SIZE = 50; // Máximo de dias em cache
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

let planoRaw: PlanoCartuchoRaw | null = null;

// ============================================================================
// FUNÇÕES PÚBLICAS
// ============================================================================

/**
 * Inicializa o carregador com o cartucho raw
 * @param cartucho - Plano cartucho com dados puros (não materializado)
 */
export function inicializarCarregador(cartucho: PlanoCartuchoRaw): void {
  planoRaw = cartucho;
  cacheDias.clear();
}

/**
 * Carrega um dia específico (lazy + cache)
 * Complexidade: O(1) para cache hit, O(1) para materialização
 * 
 * @param numero - Número do dia (1-317)
 * @returns Dia materializado ou undefined se inválido
 */
export async function carregarDia(numero: number): Promise<DiaDoPlano | undefined> {
  // Validação de entrada
  if (!planoRaw || numero < 1 || numero > planoRaw.totalDias) {
    return undefined;
  }

  // Verifica cache
  const cacheHit = cacheDias.get(numero);
  if (cacheHit) {
    cacheHit.acessoCount++;
    cacheHit.timestamp = Date.now();
    return cacheHit.dia;
  }

  // Materializa sob demanda
  const diaRaw = planoRaw.dias[numero - 1];
  if (!diaRaw) {
    return undefined;
  }

  const ano = getAnoAtual(); // Soberania do tempo
  const diaMaterializado = materializarDia(diaRaw, ano);

  // Armazena em cache
  adicionarAoCache(numero, diaMaterializado);

  return diaMaterializado;
}

/**
 * Carrega múltiplos dias (para calendário, histórico, etc)
 * @param numeros - Array de números de dias
 * @returns Array de dias materializados
 */
export async function carregarDias(numeros: number[]): Promise<DiaDoPlano[]> {
  const promessas = numeros.map((numero) => carregarDia(numero));
  const dias = await Promise.all(promessas);
  return dias.filter((d): d is DiaDoPlano => d !== undefined);
}

/**
 * Carrega dias em um range (ex: semana atual)
 * @param inicio - Dia inicial (inclusive)
 * @param fim - Dia final (inclusive)
 * @returns Array de dias do range
 */
export async function carregarDiasRange(
  inicio: number,
  fim: number
): Promise<DiaDoPlano[]> {
  const numeros: number[] = [];
  for (let i = inicio; i <= fim && i <= (planoRaw?.totalDias || 0); i++) {
    numeros.push(i);
  }
  return carregarDias(numeros);
}

/**
 * Pré-carrega dias próximos ao atual (para UX fluida)
 * Carrega em background sem bloquear a thread principal
 * 
 * @param atual - Dia atual
 * @param margem - Quantos dias antes/depois carregar (default: 3)
 */
export function precarregarProximos(atual: number, margem: number = 3): void {
  const diasParaCarregar: number[] = [];

  for (let i = atual - margem; i <= atual + margem; i++) {
    if (i >= 1 && i <= (planoRaw?.totalDias || 0) && i !== atual) {
      // Só adiciona se não estiver no cache
      if (!cacheDias.has(i)) {
        diasParaCarregar.push(i);
      }
    }
  }

  // Executa em background (não await)
  if (diasParaCarregar.length > 0) {
    carregarDias(diasParaCarregar).catch(console.error);
  }
}

/**
 * Obtém estatísticas do cache (para debug/monitoramento)
 */
export function getEstatisticasCache(): {
  tamanho: number;
  taxaHit: number;
  hits: number;
  misses: number;
} {
  let hits = 0;
  let misses = 0;

  // Simulação simples - em produção usar contadores reais
  cacheDias.forEach((cache) => {
    if (cache.acessoCount > 1) {
      hits += cache.acessoCount - 1;
    }
    misses++;
  });

  const total = hits + misses;
  return {
    tamanho: cacheDias.size,
    taxaHit: total > 0 ? hits / total : 0,
    hits,
    misses,
  };
}

/**
 * Limpa o cache (útil para tests ou reset de memória)
 */
export function limparCache(): void {
  cacheDias.clear();
}

// ============================================================================
// FUNÇÕES INTERNAS
// ============================================================================

/**
 * Adiciona dia ao cache com LRU eviction
 */
function adicionarAoCache(numero: number, dia: DiaDoPlano): void {
  // Evita cache overflow (LRU - Least Recently Used)
  if (cacheDias.size >= MAX_CACHE_SIZE) {
    evictLRU();
  }

  cacheDias.set(numero, {
    dia,
    timestamp: Date.now(),
    acessoCount: 1,
  });
}

/**
 * Remove o item menos recentemente usado do cache
 */
function evictLRU(): void {
  let maisAntigo = Infinity;
  let chaveParaRemover: number | null = null;

  cacheDias.forEach((cache, chave) => {
    if (cache.timestamp < maisAntigo) {
      maisAntigo = cache.timestamp;
      chaveParaRemover = chave;
    }
  });

  if (chaveParaRemover !== null) {
    cacheDias.delete(chaveParaRemover);
  }
}

/**
 * Limpa entradas expiradas do cache (TTL)
 * Pode ser chamado periodicamente
 */
export function limparCacheExpirado(): void {
  const agora = Date.now();
  const chavesParaRemover: number[] = [];

  cacheDias.forEach((cache, chave) => {
    if (agora - cache.timestamp > CACHE_TTL_MS) {
      chavesParaRemover.push(chave);
    }
  });

  chavesParaRemover.forEach((chave) => cacheDias.delete(chave));
}

// Limpa cache expirado a cada 30 segundos (em background)
if (typeof window !== "undefined") {
  setInterval(limparCacheExpirado, 30000);
}
