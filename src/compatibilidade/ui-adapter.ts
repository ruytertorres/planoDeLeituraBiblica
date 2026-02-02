/* ============================================================================
   ui-adapter.ts — Ponte de Integração TypeScript ↔ JavaScript
   Versão: 1.0.0
   Aplicação: Bíblia Responsiva — Compatibilidade durante Migração

   RESPONSABILIDADE:
   - Expor núcleo TypeScript para UI JavaScript de forma segura
   - Manter compatibilidade com código existente
   - Facilitar migração gradual de componentes
   - Garantir que contratos sejam respeitados

   CONTRATO:
   - Nenhuma regra de domínio na UI (Seção 10 CONTRATO_DO_SISTEMA.md)
   - Interface JavaScript consome núcleo TypeScript
   - Tipagem forte no núcleo, flexibilidade na fronteira
============================================================================ */

import { PlanoManager } from "../core/services/planos/PlanoManager";
import type {
  PlanoCartucho,
  DiaDoPlano,
  ProgressoLeitura,
  EstadoPlano,
} from "../core/types/contratos.types";

/* ============================================================================
   ADAPTER PRINCIPAL
============================================================================ */

/**
 * Adaptador que expõe o núcleo TypeScript para a UI JavaScript.
 *
 * Este adaptador serve como ponte, permitindo que a UI existente
 * continue funcionando enquanto se beneficia do núcleo tipado.
 */
export class UIAdapter {
  private planoManager: PlanoManager;
  private plano: PlanoCartucho;

  /**
   * Cria um novo adaptador UI.
   *
   * @param plano - Plano cartucho válido
   */
  constructor(plano: PlanoCartucho) {
    this.plano = plano;
    this.planoManager = new PlanoManager(plano);
  }

  /* --------------------------------------------------------------------------
     API COMPATÍVEL COM UI JAVASCRIPT
     -------------------------------------------------------------------------- */

  /**
   * Retorna o plano gerenciado (compatível com código existente).
   */
  getPlano(): PlanoCartucho {
    return this.planoManager.getPlano();
  }

  /**
   * Retorna o dia atual (formato esperado pela UI).
   */
  getDiaAtual(): DiaDoPlano | null {
    return this.planoManager.getDiaAtual();
  }

  /**
   * Navega para um dia específico.
   *
   * @param numero - Número do dia (1-based)
   * @returns O dia encontrado ou null
   */
  irParaDia(numero: number): DiaDoPlano | null {
    return this.planoManager.irParaDia(numero);
  }

  /**
   * Avança para o próximo dia.
   */
  proximoDia(): DiaDoPlano | null {
    return this.planoManager.proximoDia();
  }

  /**
   * Volta para o dia anterior.
   */
  diaAnterior(): DiaDoPlano | null {
    return this.planoManager.diaAnterior();
  }

  /**
   * Verifica se existe próximo dia.
   */
  temProximo(): boolean {
    return this.planoManager.temProximo();
  }

  /**
   * Verifica se existe dia anterior.
   */
  temAnterior(): boolean {
    return this.planoManager.temAnterior();
  }

  /**
   * Reseta para o primeiro dia.
   */
  resetar(): DiaDoPlano | null {
    return this.planoManager.resetar();
  }

  /**
   * Retorna informações resumidas do estado atual.
   */
  getEstadoResumido(): {
    diaAtual: number;
    totalDias: number;
    progressoPercentual: number;
    temProximo: boolean;
    temAnterior: boolean;
  } {
    return this.planoManager.getEstadoResumido();
  }

  /* --------------------------------------------------------------------------
     MÉTODOS DE CONVENIÊNCIA PARA UI
     -------------------------------------------------------------------------- */

  /**
   * Retorna o total de dias do plano.
   */
  getTotalDias(): number {
    return this.planoManager.getTotalDias();
  }

  /**
   * Retorna o índice atual (base 0).
   */
  getIndiceAtual(): number {
    return this.planoManager.getIndiceAtual();
  }

  /**
   * Retorna todos os dias do plano.
   */
  getTodosDias(): DiaDoPlano[] {
    return this.planoManager.getPlano().getDias();
  }

  /**
   * Busca um dia específico pelo número.
   */
  buscarDia(numero: number): DiaDoPlano | undefined {
    return this.plano.getDia(numero);
  }

  /* --------------------------------------------------------------------------
     VALIDAÇÃO E SEGURANÇA
     -------------------------------------------------------------------------- */

  /**
   * Valida se um número de dia é válido.
   */
  diaValido(numero: number): boolean {
    return numero >= 1 && numero <= this.getTotalDias();
  }

  /**
   * Retorna o progresso como percentual (0-100).
   */
  getProgressoPercentual(): number {
    return this.planoManager.getProgressoPercentual();
  }

  /**
   * Verifica se o plano está no último dia.
   */
  isUltimoDia(): boolean {
    return !this.temProximo();
  }

  /**
   * Verifica se o plano está no primeiro dia.
   */
  isPrimeiroDia(): boolean {
    return !this.temAnterior();
  }
}

/* ============================================================================
   FACTORY PARA CRIAÇÃO SEGURA
============================================================================ */

/**
 * Cria um adaptador UI de forma segura.
 *
 * @param plano - Plano cartucho (pode ser JavaScript ou TypeScript)
 * @returns Instância do adaptador
 * @throws Se o plano for inválido
 */
export function criarUIAdapter(plano: unknown): UIAdapter {
  // Validação básica para garantir segurança
  if (!plano || typeof plano !== "object") {
    throw new Error("Plano inválido fornecido ao UIAdapter");
  }

  const planoObj = plano as PlanoCartucho;

  // Validações críticas
  if (!planoObj.id || !planoObj.nome || !Array.isArray(planoObj.dias)) {
    throw new Error("Plano não possui estrutura válida");
  }

  if (
    typeof planoObj.getDia !== "function" ||
    typeof planoObj.getDias !== "function"
  ) {
    throw new Error("Plano não implementa métodos obrigatórios");
  }

  return new UIAdapter(planoObj);
}

/* ============================================================================
   EXPORTAÇÃO GLOBAL (Compatibilidade com módulos JavaScript)
============================================================================ */

/**
 * Instância global do adaptador para uso pela UI JavaScript.
 *
 * Esta instância será inicializada quando a aplicação carregar.
 */
export let uiAdapterGlobal: UIAdapter | null = null;

/**
 * Inicializa o adaptador global com um plano.
 *
 * @param plano - Plano a ser gerenciado
 */
export function inicializarAdapter(plano: unknown): void {
  uiAdapterGlobal = criarUIAdapter(plano);
}

/**
 * Retorna o adaptador global inicializado.
 *
 * @returns Instância do adaptador ou null
 */
export function getUIAdapter(): UIAdapter | null {
  return uiAdapterGlobal;
}
