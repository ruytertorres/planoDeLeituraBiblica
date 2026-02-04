/* ============================================================================
   ResetProgressoOrquestrador.ts — Orquestrador Tipado de Reset de Progresso
   Versão: 2.0.0 (TypeScript)
   ============================================================================

   RESPONSABILIDADE ÚNICA:
   - Orquestrar operações de reset de progresso
   - Gerenciar diferentes tipos de reset
   - Coordenar entre managers de plano e progresso
   - Emitir eventos de reset

   CONFORMIDADE COM CONTRATO_DO_SISTEMA.MD:
   - §3.1: Tempo é soberano (usa geradorDatas.ts)
   - §4: Hierarquia de Autoridade (Orquestração)
   - §3.3: Ciclos são finitos, planos são contínuos

   Camada: ORQUESTRAÇÃO
   ============================================================================ */

import { BaseOrquestrador } from "../../../ui/orquestradores/BaseOrquestrador.js";
import {
  getDiaDoAnoAtual,
  getTotalDiasDoAno,
  getAnoAtual,
} from "../../services/tempo/geradorDatas.js";
import type { IProgressoLeitura } from "./ProgressoLeitura.js";

/* ============================================================================
   TIPOS E INTERFACES
   ============================================================================ */

/**
 * Interface para gerenciadores de plano
 */
interface IPlanoManager {
  resetar(): void;
  resetarAPartirDoDia(numeroDia: number): { sucesso: boolean; erro?: string };
  getTotalDias(): number;
  getIndiceAtual(): number;
}

/**
 * Resultado de operação de reset
 */
interface ResultadoReset {
  sucesso: boolean;
  tipo: "completo" | "customizado" | "hoje";
  mensagem: string;
  diasBloqueados?: number[];
  deslocamentoDatas?: number;
  aviso?: string;
  erro?: string;
  numeroDia?: number;
}

/**
 * Estatísticas de progresso
 */
interface EstatisticasProgresso {
  totalLidos: number;
  totalDias: number;
  diaAtual: number;
  percentualConcluido: number;
  percentualProgresso: number;
}

/* ============================================================================
   CLASSE RESET PROGRESSO ORQUESTRADOR
   ============================================================================ */

/**
 * Orquestrador de reset de progresso de leitura.
 *
 * Responsável por:
 * - Reset completo do progresso
 * - Reset customizado a partir de dia específico
 * - Reset "para hoje" com bloqueio de dias anteriores
 * - Cálculo de deslocamentos temporais
 *
 * @extends BaseOrquestrador
 */
export class ResetProgressoOrquestrador extends BaseOrquestrador {
  /* --------------------------------------------------------------------------
     ATRIBUTOS PRIVADOS
     -------------------------------------------------------------------------- */

  private progressoManager: IProgressoLeitura;
  private planoManager: IPlanoManager;

  /* --------------------------------------------------------------------------
     CONSTRUTOR
     -------------------------------------------------------------------------- */

  /**
   * Cria orquestrador de reset
   *
   * @param progressoManager - Gerenciador de progresso
   * @param planoManager - Gerenciador de plano
   */
  constructor(
    progressoManager: IProgressoLeitura,
    planoManager: IPlanoManager,
  ) {
    super("ResetProgressoOrquestrador");
    this.progressoManager = progressoManager;
    this.planoManager = planoManager;
  }

  /* --------------------------------------------------------------------------
     OPERAÇÕES DE RESET
     -------------------------------------------------------------------------- */

  /**
   * Reset completo - volta tudo ao início SEM BLOQUEAR DIAS
   *
   * @returns Resultado da operação
   */
  resetCompleto(): ResultadoReset {
    // Resetar progresso
    this.progressoManager.resetar();

    // Resetar plano para o primeiro dia
    this.planoManager.resetar();

    // ✅ CORREÇÃO: Reset completo NÃO bloqueia dias
    // Sistema volta ao estado original: tudo clicável, dia 1 disponível
    const diasBloqueados: number[] = []; // Array vazio = nenhum dia bloqueado

    // Emitir evento SEM dias bloqueados
    this.emit("progresso-resetado", {
      tipo: "completo",
      descricao: "Progresso resetado completamente",
      diasBloqueados, // Array vazio para reset completo
    });

    return {
      sucesso: true,
      tipo: "completo",
      mensagem: "Progresso resetado com sucesso - Sistema reiniciado do Dia 1",
      diasBloqueados, // Array vazio
    };
  }

  /**
   * Reset customizado - começa a partir de um dia específico
   *
   * @param numeroDia - Dia para começar (ex: 1)
   * @returns Resultado da operação
   */
  resetCustomizado(numeroDia: number): ResultadoReset {
    // Resetar progresso
    this.progressoManager.resetar();

    // Resetar plano para o dia específico
    const resultado = this.planoManager.resetarAPartirDoDia(numeroDia);

    if (!resultado.sucesso) {
      return {
        sucesso: false,
        tipo: "customizado",
        erro: resultado.erro,
        mensagem: "Falha ao resetar plano",
      };
    }

    // Emitir evento
    this.emit("progresso-resetado", {
      tipo: "customizado",
      numeroDia,
      descricao: `Progresso resetado para começar no dia ${numeroDia}`,
    });

    return {
      sucesso: true,
      tipo: "customizado",
      numeroDia,
      mensagem: `Progresso resetado para começar no dia ${numeroDia}`,
    };
  }

  /**
   * Reset para hoje - ajusta o plano para que o dia atual corresponda à data de hoje
   *
   * @returns Resultado da operação
   */
  resetParaHoje(): ResultadoReset {
    // Obter dia atual ANTES de resetar o progresso
    const diaAtualAntesDoReset =
      (this.progressoManager as any).getUltimoDiaLido?.() || 0;

    // Resetar progresso
    this.progressoManager.resetar();

    // Resetar plano para o Dia 1 (começar do início)
    const resultado = this.planoManager.resetarAPartirDoDia(1);

    if (!resultado.sucesso) {
      return {
        sucesso: false,
        tipo: "hoje",
        erro: resultado.erro,
        mensagem: "Falha ao resetar plano",
      };
    }

    // Criar lista de dias bloqueados (todos os dias anteriores ao reset)
    const diasBloqueados: number[] = [];
    for (let i = 1; i <= diaAtualAntesDoReset; i++) {
      diasBloqueados.push(i);
    }

    // ✅ CORREÇÃO: Calcular deslocamento para alinhar Dia 1 com hoje
    const diaDoAnoHoje = this.getDiaDoAnoAtual();
    const deslocamentoDatas = diaDoAnoHoje - 1; // Dia 1 deve virar hoje

    // Verificar se o plano ultrapassará o fim do ciclo civil atual
    const totalDias = this.planoManager.getTotalDias();
    const diaFinalDoAno = getTotalDiasDoAno(getAnoAtual());

    let avisoUltrapassagem: string | undefined;
    if (totalDias > diaFinalDoAno - diaDoAnoHoje + 1) {
      avisoUltrapassagem =
        "Atenção: Este plano ultrapassará 31/12 e continuará no próximo ano civil.";
    }

    // ✅ CORREÇÃO: Aplicar deslocamento de datas no progresso
    (this.progressoManager as any).definirDeslocamentoDatas?.(
      deslocamentoDatas,
    );

    // Emitir evento com dias bloqueados e deslocamento
    this.emit("progresso-resetado", {
      tipo: "hoje",
      mensagem: "Progresso resetado para começar hoje",
      diasBloqueados, // Enviar dias que devem ser bloqueados
      deslocamentoDatas, // Enviar deslocamento para alinhamento
      aviso: avisoUltrapassagem,
    });

    return {
      sucesso: true,
      tipo: "hoje",
      mensagem: "Progresso resetado para começar hoje",
      diasBloqueados,
      deslocamentoDatas,
      aviso: avisoUltrapassagem,
    };
  }

  /* --------------------------------------------------------------------------
     UTILIDADES
     -------------------------------------------------------------------------- */

  /**
   * Obtém o dia do ano atual
   *
   * @returns Dia do ano (1-366)
   */
  getDiaDoAnoAtual(): number {
    return getDiaDoAnoAtual();
  }

  /**
   * Obtém estatísticas atuais do progresso
   *
   * @returns Estatísticas
   */
  getEstatisticas(): EstatisticasProgresso {
    const totalLidos = this.progressoManager.getTotalLidos();
    const totalDias = this.planoManager.getTotalDias();
    const diaAtual = this.planoManager.getIndiceAtual() + 1;

    return {
      totalLidos,
      totalDias,
      diaAtual,
      percentualConcluido: Math.round((totalLidos / totalDias) * 100),
      percentualProgresso: Math.round((diaAtual / totalDias) * 100),
    };
  }

  /**
   * Inicializa o orquestrador
   */
  init(): void {
    // Não requer inicialização específica
    console.log(`[${this.name}] Orquestrador de reset inicializado`);
  }
}

export default ResetProgressoOrquestrador;
