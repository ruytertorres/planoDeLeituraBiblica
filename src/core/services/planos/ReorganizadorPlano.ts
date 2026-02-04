/* ============================================================================
   ReorganizadorPlano.ts — Reorganizador Tipado de Plano
   Versão: 2.0.0 (TypeScript)
   ============================================================================

   RESPONSABILIDADE:
   - Detectar lacunas no plano de leitura
   - Gerar opções de decisão para o usuário
   - Executar decisões de reorganização
   - Verificar ultrapassagem de ciclo

   CONFORMIDADE COM CONTRATO_DO_SISTEMA.MD:
   - §3.4: O sistema detecta, o usuário decide
   - §9: Decisões do usuário (contrato de interação)

   Camada: DOMÍNIO AUXILIAR
   ============================================================================ */

/* ============================================================================
   TIPOS E INTERFACES
   ============================================================================ */

/**
 * Resultado da detecção de lacuna
 */
export interface ResultadoLacuna {
  temLacuna: boolean;
  motivo?: string;
  tipo?: "aleatorio" | "consecutivo";
  ultimoDiaLido?: number;
  diaHoje?: number;
  diasAtraso?: number;
  diasNaoLidos?: number;
  totalDias?: number;
  proximoDia?: number;
  descricao?: string;
  requerDecisao?: boolean;
  ultrapassagemCiclo?: {
    ultrapassaCiclo: boolean;
    aviso?: string;
  };
  [key: string]: unknown;
}

/**
 * Opção de decisão para o usuário
 */
export interface OpcaoDecisao {
  id: string;
  descricao: string;
  acao: string;
  impacto: string;
}

/**
 * Resultado da execução de decisão
 */
export interface ResultadoDecisao {
  sucesso: boolean;
  acao?: string;
  descricao: string;
  requerConfirmacao?: boolean;
  proximoDia?: number;
  erro?: string;
}

/**
 * Resultado do cálculo de novo índice
 */
export interface ResultadoNovoIndice {
  numeroDia: number;
  descricao: string;
}

/**
 * Resultado da verificação de ultrapassagem
 */
export interface ResultadoUltrapassagem {
  ultrapassaCiclo: boolean;
  aviso?: string;
}

/* ============================================================================
   CLASSE REORGANIZADOR PLANO
   ============================================================================ */

/**
 * Detecta e gerencia lacunas no plano de leitura.
 *
 * Princípio: Apenas detecta, não decide (CONTRATO §3.4)
 * O usuário deve tomar decisões explicitamente (CONTRATO §9)
 */
export class ReorganizadorPlano {
  /**
   * Detecta lacuna no plano de leitura
   *
   * @param ultimoDiaLido - Último dia marcado como lido
   * @param diaHoje - Dia que deveria ser "hoje"
   * @param totalDias - Total de dias do plano
   * @param diasLidosSet - Set de dias lidos (opcional)
   * @returns Resultado da detecção
   */
  detectarLacuna(
    ultimoDiaLido: number | null,
    diaHoje: number,
    totalDias: number,
    diasLidosSet: Set<number> | null = null,
  ): ResultadoLacuna {
    if (ultimoDiaLido === null || ultimoDiaLido === 0) {
      return { temLacuna: false, motivo: "nenhum-dia-lido" };
    }
    if (ultimoDiaLido >= totalDias) {
      return { temLacuna: false, motivo: "plano-concluido" };
    }

    // 🔄 DETECÇÃO: Apenas detecta, não decide
    if (diasLidosSet && diasLidosSet.size > 0) {
      const diasNaoLidosRecentes = this.contarDiasNaoLidosRecentes(
        diasLidosSet,
        diaHoje,
      );

      if (diasNaoLidosRecentes >= 3) {
        const proximoDia = this.encontrarProximoDiaNaoLido(
          diasLidosSet,
          ultimoDiaLido,
          totalDias,
        );

        return {
          temLacuna: true,
          tipo: "aleatorio",
          ultimoDiaLido,
          diaHoje,
          diasNaoLidos: diasNaoLidosRecentes,
          totalDias,
          proximoDia,
          descricao: `Detectados ${diasNaoLidosRecentes} dias não lidos recentemente. Requer decisão do usuário.`,
          requerDecisao: true,
          ultrapassagemCiclo: this.verificarUltrapassagemCiclo(
            proximoDia,
            totalDias,
          ),
        };
      }
    }

    // Lógica original para dias consecutivos
    const diasAtraso = diaHoje - ultimoDiaLido - 1;
    if (diasAtraso <= 1) {
      return {
        temLacuna: false,
        motivo: "sem-atraso-significativo",
        diasAtraso,
      };
    }

    // CORREÇÃO: Apenas detecta, não toma decisão
    return {
      temLacuna: true,
      tipo: "consecutivo",
      ultimoDiaLido,
      diaHoje,
      diasAtraso,
      totalDias,
      proximoDia: ultimoDiaLido + 1,
      descricao: `Detectado atraso de ${diasAtraso} dias. Último dia lido: ${ultimoDiaLido}, hoje deveria ser: ${diaHoje}. Requer decisão do usuário.`,
      requerDecisao: true,
      ultrapassagemCiclo: this.verificarUltrapassagemCiclo(
        ultimoDiaLido + 1,
        totalDias,
      ),
    };
  }

  /**
   * Gera opções de decisão para o usuário
   *
   * @param lacunaDetectada - Resultado da detecção de lacuna
   * @returns Array de opções disponíveis
   */
  gerarOpcoesDecisao(lacunaDetectada: ResultadoLacuna): OpcaoDecisao[] {
    if (!lacunaDetectada.temLacuna || !lacunaDetectada.requerDecisao) {
      return [];
    }

    const opcoes: OpcaoDecisao[] = [
      {
        id: "continuar-normal",
        descricao: "Continuar leitura normal",
        acao: "manter-plano",
        impacto: "sem-mudanca",
      },
      {
        id: "ajustar-plano",
        descricao: "Ajustar plano para eliminar lacuna",
        acao: "reajustar-datas",
        impacto: "reorganizacao",
      },
      {
        id: "pular-dias",
        descricao: "Pular dias não lidos",
        acao: "avançar-para-hoje",
        impacto: "perda-conteudo",
      },
    ];

    // Adicionar opção de reset se for atraso significativo
    if (
      lacunaDetectada.tipo === "consecutivo" &&
      (lacunaDetectada.diasAtraso || 0) > 7
    ) {
      opcoes.push({
        id: "reset-plano",
        descricao: "Resetar plano do início",
        acao: "reset-completo",
        impacto: "perda-total",
      });
    }

    return opcoes;
  }

  /**
   * Executa decisão explícita do usuário
   *
   * @param idDecisao - ID da decisão escolhida
   * @param contexto - Contexto da lacuna
   * @returns Resultado da execução
   */
  executarDecisaoUsuario(
    idDecisao: string,
    contexto: ResultadoLacuna,
  ): ResultadoDecisao {
    const decisao = this.gerarOpcoesDecisao(contexto).find(
      (op) => op.id === idDecisao,
    );

    if (!decisao) {
      return {
        sucesso: false,
        erro: "Decisão inválida",
        descricao: "A decisão escolhida não está entre as opções disponíveis.",
      };
    }

    // Executa a ação escolhida pelo usuário
    switch (decisao.acao) {
      case "manter-plano":
        return {
          sucesso: true,
          acao: decisao.acao,
          descricao: "Plano mantido sem alterações.",
          proximoDia: contexto.proximoDia,
        };

      case "reajustar-datas":
        return {
          sucesso: true,
          acao: decisao.acao,
          descricao: "Plano será reajustado para eliminar lacuna.",
          requerConfirmacao: true,
          proximoDia: contexto.proximoDia,
        };

      case "avançar-para-hoje":
        return {
          sucesso: true,
          acao: decisao.acao,
          descricao: "Avançando para dia atual, pulando dias não lidos.",
          proximoDia: contexto.diaHoje,
        };

      case "reset-completo":
        return {
          sucesso: true,
          acao: decisao.acao,
          descricao: "Plano será resetado do início.",
          requerConfirmacao: true,
          proximoDia: 1,
        };

      default:
        return {
          sucesso: false,
          erro: "ação não implementada",
          descricao: `Ação ${decisao.acao} ainda não foi implementada.`,
        };
    }
  }

  /**
   * Contar dias não lidos nos últimos dias (considerando aleatoriedade)
   *
   * @param diasLidosSet - Set de dias lidos
   * @param diaHoje - Dia atual
   * @param janela - Tamanho da janela de análise (padrão: 7)
   * @returns Número de dias não lidos
   */
  contarDiasNaoLidosRecentes(
    diasLidosSet: Set<number>,
    diaHoje: number,
    janela = 7,
  ): number {
    let diasNaoLidos = 0;
    const inicio = Math.max(1, diaHoje - janela + 1);

    for (let dia = inicio; dia <= diaHoje; dia++) {
      if (!diasLidosSet.has(dia)) {
        diasNaoLidos++;
      }
    }

    return diasNaoLidos;
  }

  /**
   * Encontrar o próximo dia não lido após o último dia lido
   *
   * @param diasLidosSet - Set de dias lidos
   * @param ultimoDiaLido - Último dia lido
   * @param totalDias - Total de dias
   * @returns Próximo dia não lido
   */
  encontrarProximoDiaNaoLido(
    diasLidosSet: Set<number>,
    ultimoDiaLido: number,
    totalDias: number,
  ): number {
    for (let dia = ultimoDiaLido + 1; dia <= totalDias; dia++) {
      if (!diasLidosSet.has(dia)) {
        return dia;
      }
    }
    return ultimoDiaLido + 1; // Fallback
  }

  /**
   * Calcula novo índice após reorganização
   *
   * @param ultimoDiaLido - Último dia lido
   * @param diaAtualDoPlano - Dia atual do plano
   * @returns Resultado com novo número de dia
   */
  calcularNovoIndice(
    ultimoDiaLido: number,
    diaAtualDoPlano: number,
  ): ResultadoNovoIndice {
    const novoNumeroDia = ultimoDiaLido + 1;
    return {
      numeroDia: novoNumeroDia,
      descricao: `Próximo dia a ser lido: ${novoNumeroDia}`,
    };
  }

  /**
   * Verifica se haverá ultrapassagem de ciclo
   *
   * @param novoNumeroDia - Novo número de dia
   * @param totalDias - Total de dias
   * @returns Resultado da verificação
   */
  verificarUltrapassagemCiclo(
    novoNumeroDia: number,
    totalDias: number,
  ): ResultadoUltrapassagem {
    if (novoNumeroDia > totalDias) {
      return {
        ultrapassaCiclo: true,
        aviso:
          "Atenção: Você irá ultrapassar o ciclo anual do plano. O plano será reiniciado.",
      };
    }
    return { ultrapassaCiclo: false };
  }
}

export default ReorganizadorPlano;
