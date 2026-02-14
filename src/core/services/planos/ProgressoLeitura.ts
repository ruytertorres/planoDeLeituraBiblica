/* ============================================================================
   ProgressoLeitura.ts — Gerenciador Tipado de Progresso de Leitura
   Versão: 2.0.0 (TypeScript)
   ============================================================================

   RESPONSABILIDADE ÚNICA:
   - Gerenciar estado de leitura (lido/não lido)
   - Persistir progresso em localStorage
   - Calcular estatísticas de progresso
   - Gerenciar reajustes de plano

   CONFORMIDADE COM CONTRATO_DO_SISTEMA.MD:
   - §3.1: Tempo é soberano (usa geradorDatas.ts)
   - §4: Hierarquia de Autoridade (Domínio Auxiliar)
   - §3.3: Ciclos são finitos, planos são contínuos

   Camada: DOMÍNIO AUXILIAR (§4)
   ============================================================================ */

import {
  getTimestampAtualISO,
  getDiaDoAnoAtual,
} from "../tempo/geradorDatas.js";

/* ============================================================================
   TIPOS E INTERFACES
   ============================================================================ */

/**
 * Dados de progresso persistidos
 */
interface ProgressoStorage {
  diasLidos: number[];
  ultimaAtualizacao: string;
}

/**
 * Dados de reajuste persistidos
 */
interface ReajusteStorage {
  ativo: boolean;
  numeroDia: number;
  diaHoje: number;
  dataReajuste: string;
}

/**
 * Interface pública do ProgressoLeitura
 * Contrato para outros módulos
 */
export interface IProgressoLeitura {
  alternar(numeroDia: number): void;
  marcarComoLido(numeroDia: number): void;
  marcarComoNaoLido(numeroDia: number): void;
  estaLido(numeroDia: number): boolean;
  getTotalLidos(): number;
  getUltimoDiaLido(): number | null;
  resetar(): void;
}

/* ============================================================================
   CLASSE PROGRESSO LEITURA
   ============================================================================ */

/**
 * Gerenciador de progresso de leitura bíblica.
 *
 * Responsável por:
 * - Rastrear dias lidos/não lidos
 * - Persistir estado em localStorage
 * - Gerenciar reajustes de plano
 * - Calcular estatísticas
 *
 * @implements IProgressoLeitura
 */
export class ProgressoLeitura implements IProgressoLeitura {
  /* --------------------------------------------------------------------------
     ATRIBUTOS PRIVADOS
     -------------------------------------------------------------------------- */

  private readonly chaveStorage = "progresso-leitura";
  private readonly chaveReajuste = "reajuste-plano";
  private diasLidos: Set<number> = new Set();
  private reajusteAtivo: ReajusteStorage | null = null;

  /* --------------------------------------------------------------------------
     CONSTRUTOR
     -------------------------------------------------------------------------- */

  constructor() {
    this.sincronizarComStorage();
  }

  /* --------------------------------------------------------------------------
     GERENCIAMENTO DE PROGRESSO
     -------------------------------------------------------------------------- */

  /**
   * Alterna o estado de lido/não lido para um dia
   *
   * @param numeroDia - Número do dia (1-based)
   */
  alternar(numeroDia: number): void {
    if (this.diasLidos.has(numeroDia)) {
      this.diasLidos.delete(numeroDia);
    } else {
      this.diasLidos.add(numeroDia);
    }
    this.salvarNoStorage();
  }

  /**
   * Marca um dia como lido
   *
   * @param numeroDia - Número do dia (1-based)
   */
  marcarComoLido(numeroDia: number): void {
    this.diasLidos.add(numeroDia);
    this.salvarNoStorage();
  }

  /**
   * Marca um dia como não lido
   *
   * @param numeroDia - Número do dia (1-based)
   */
  marcarComoNaoLido(numeroDia: number): void {
    this.diasLidos.delete(numeroDia);
    this.salvarNoStorage();
  }

  /**
   * Verifica se um dia está marcado como lido
   *
   * @param numeroDia - Número do dia (1-based)
   * @returns True se estiver lido
   */
  estaLido(numeroDia: number): boolean {
    return this.diasLidos.has(numeroDia);
  }

  /**
   * Retorna o total de dias lidos
   *
   * @returns Total de dias lidos
   */
  getTotalLidos(): number {
    return this.diasLidos.size;
  }

  /**
   * Retorna o último dia lido
   *
   * @returns Número do último dia lido ou null
   */
  getUltimoDiaLido(): number | null {
    if (this.diasLidos.size === 0) return null;
    return Math.max(...this.diasLidos);
  }

  /**
   * Retorna todos os dias lidos como array ordenado
   *
   * @returns Array de números de dias lidos
   */
  getDiasLidos(): number[] {
    return Array.from(this.diasLidos).sort((a, b) => a - b);
  }

  /* --------------------------------------------------------------------------
     PERSISTÊNCIA
     -------------------------------------------------------------------------- */

  /**
   * Sincroniza com localStorage
   */
  sincronizarComStorage(): void {
    try {
      const salvo = localStorage.getItem(this.chaveStorage);
      if (salvo) {
        const dados: ProgressoStorage = JSON.parse(salvo);
        this.diasLidos = new Set(dados.diasLidos || []);
      }

      const reajusteSalvo = localStorage.getItem(this.chaveReajuste);
      if (reajusteSalvo) {
        this.reajusteAtivo = JSON.parse(reajusteSalvo) as ReajusteStorage;
      }
    } catch (error) {
      console.error(
        "[ProgressoLeitura] Erro ao sincronizar com storage:",
        error,
      );
    }
  }

  /**
   * Salva estado atual no localStorage
   */
  salvarNoStorage(): void {
    try {
      const dados: ProgressoStorage = {
        diasLidos: Array.from(this.diasLidos),
        ultimaAtualizacao: getTimestampAtualISO(),
      };
      localStorage.setItem(this.chaveStorage, JSON.stringify(dados));
    } catch (error) {
      console.error("[ProgressoLeitura] Erro ao salvar no storage:", error);
    }
  }

  /**
   * Reseta todo o progresso
   */
  resetar(): void {
    this.diasLidos.clear();
    this.reajusteAtivo = null;
    this.salvarNoStorage();
    localStorage.removeItem(this.chaveReajuste);
  }

  /* --------------------------------------------------------------------------
     GERENCIAMENTO DE REAJUSTE
     -------------------------------------------------------------------------- */

  /**
   * Salva informações de reajuste
   *
   * @param numeroDia - Número do dia ajustado
   * @param diaHoje - Dia que deveria ser hoje
   */
  salvarReajuste(numeroDia: number, diaHoje: number): void {
    this.reajusteAtivo = {
      ativo: true,
      numeroDia,
      diaHoje,
      dataReajuste: getTimestampAtualISO(),
    };
    this.persistirReajuste();
  }

  /**
   * Obtém informações de reajuste
   *
   * @returns Informações do reajuste ou null
   */
  obterReajuste(): ReajusteStorage | null {
    return this.reajusteAtivo;
  }

  /**
   * Calcula deslocamento de datas baseado no reajuste
   *
   * @returns Deslocamento em dias
   */
  obterDeslocamentoDatas(): number {
    if (!this.reajusteAtivo?.ativo) {
      return 0;
    }
    return this.reajusteAtivo.diaHoje - this.reajusteAtivo.numeroDia;
  }

  /**
   * Obtém o dia de retomada do reajuste (primeiro dia após o gap)
   *
   * @returns Número do dia de retomada ou null se não houver reajuste
   */
  obterDiaRetomada(): number | null {
    if (!this.reajusteAtivo?.ativo) {
      return null;
    }
    return this.reajusteAtivo.numeroDia;
  }

  /**
   * Define deslocamento de datas para alinhamento
   *
   * @param deslocamento - Deslocamento em dias
   */
  definirDeslocamentoDatas(deslocamento: number): void {
    // Criar reajuste ativo se não existir
    if (!this.reajusteAtivo) {
      this.reajusteAtivo = {
        ativo: true,
        numeroDia: 1,
        diaHoje: getDiaDoAnoAtual(),
        dataReajuste: getTimestampAtualISO(),
      };
    }

    // Atualizar deslocamento
    this.reajusteAtivo.diaHoje = this.reajusteAtivo.numeroDia + deslocamento;

    // Persistir reajuste
    this.persistirReajuste();
  }

  /**
   * Persiste reajuste no localStorage
   */
  private persistirReajuste(): void {
    if (this.reajusteAtivo) {
      localStorage.setItem(
        this.chaveReajuste,
        JSON.stringify(this.reajusteAtivo),
      );
    }
  }

  /**
   * Verifica se há reajuste ativo
   *
   * @returns True se há reajuste ativo
   */
  temReajusteAtivo(): boolean {
    return this.reajusteAtivo?.ativo ?? false;
  }
}

export default ProgressoLeitura;
