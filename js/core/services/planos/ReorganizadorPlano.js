/* ============================================================================
   ReorganizadorPlano.js — Detecção e Reajuste de Lacuna de Atraso
   Versão: 1.0.0
   Aplicação: Leitura Bíblica Cronológica

   RESPONSABILIDADE ÚNICA:
   --------------------------------------------------------------------------
   - Detectar lacunas de atraso (3+ dias sem leitura)
   - Calcular mapeamento de dias para fechar lacuna
   - Verificar ultrapassagem de ciclo (31/12)
   - Fornecer avisos e notificações
   - NÃO conter UI
   - NÃO conter persistência
   - NÃO conter lógica de orquestração
============================================================================ */

export class ReorganizadorPlano {
  constructor() {
    this.MIN_DIAS_LACUNA = 3;
    this.MAX_DIA_ANO = 365; // Será validado para bissexto em tempo de execução
  }

  /* ========================================================================
     DETECÇÃO DE LACUNA
  ======================================================================== */

  /**
   * Detecta se existe lacuna de atraso entre último dia lido e dia atual do plano
   *
   * @param {number} ultimoDiaLido - Número do último dia lido (ex: 22)
   * @param {number} diaAtualDoPlano - Número do dia atual do plano (ex: 22)
   * @param {number} diasTotaisPlano - Total de dias do plano (ex: 365)
   * @returns {object} { temLacuna, diasGapCount, percentualAtraso, descricao }
   *
   * @example
   * // Parou no dia 22, retomou no dia 27 (5 dias depois)
   * const resultado = reorganizador.detectarLacuna(22, 22, 365);
   * // { temLacuna: true, diasGapCount: 5, percentualAtraso: 1.37, ... }
   */
  detectarLacuna(ultimoDiaLido, diaAtualDoPlano, diasTotaisPlano) {
    if (!Number.isInteger(ultimoDiaLido) || ultimoDiaLido < 0) {
      throw new Error(`ultimoDiaLido inválido: ${ultimoDiaLido}`);
    }
    if (!Number.isInteger(diaAtualDoPlano) || diaAtualDoPlano < 0) {
      throw new Error(`diaAtualDoPlano inválido: ${diaAtualDoPlano}`);
    }
    if (!Number.isInteger(diasTotaisPlano) || diasTotaisPlano <= 0) {
      throw new Error(`diasTotaisPlano inválido: ${diasTotaisPlano}`);
    }

    // Calcular diferença (gap de dias)
    const diasGap = diaAtualDoPlano - ultimoDiaLido;

    // Validar se há lacuna
    const temLacuna = diasGap >= this.MIN_DIAS_LACUNA;

    // Calcular percentual de atraso
    const percentualAtraso = (diasGap / diasTotaisPlano) * 100;

    return {
      temLacuna,
      diasGapCount: diasGap,
      percentualAtraso: Math.round(percentualAtraso * 100) / 100,
      descricao: temLacuna
        ? `Você parou no dia ${ultimoDiaLido} e retomou no dia ${diaAtualDoPlano} (${diasGap} dias de diferença)`
        : `Atraso de apenas ${diasGap} dia(s) - sem reajuste necessário`,
      timestamp: new Date().toISOString(),
    };
  }

  /* ========================================================================
     CÁLCULO DE NOVO ÍNDICE
  ======================================================================== */

  /**
   * Calcula o novo índice do plano após reajuste
   * Fecha a lacuna mantendo continuidade
   *
   * @param {number} ultimoDiaLido - Último dia que foi lido (ex: 22)
   * @param {number} diaAtualDoPlano - Dia atual do plano (não é mais usado nesse cálc)
   * @returns {number} Novo número do dia (próximo após parada)
   *
   * @example
   * // Parou no dia 22, próximo = 23
   * const novoIndice = reorganizador.calcularNovoIndice(22, 100);
   * // 23
   */
  calcularNovoIndice(ultimoDiaLido, diaAtualDoPlano) {
    if (!Number.isInteger(ultimoDiaLido) || ultimoDiaLido < 0) {
      throw new Error(`ultimoDiaLido inválido: ${ultimoDiaLido}`);
    }

    // Simples: próximo dia após o último lido
    const novoIndice = ultimoDiaLido + 1;

    return {
      numeroDia: novoIndice,
      descricao: `Plano reajustado para continuar do dia ${novoIndice}`,
      timestamp: new Date().toISOString(),
    };
  }

  /* ========================================================================
     VERIFICAÇÃO DE ULTRAPASSAGEM DE CICLO
  ======================================================================== */

  /**
   * Verifica se após reajuste, o plano ultrapassará 31/12
   * Retorna avisos ao usuário se necessário
   *
   * @param {number} novoIndice - Novo número do dia (ex: 340)
   * @param {number} totalDias - Total de dias do plano (ex: 365)
   * @returns {object} { ultrapassaCiclo, diasRestantes, aviso, proxCiclo }
   *
   * @example
   * // Se novo índice = 340 e total = 365
   * const resultado = reorganizador.verificarUltrapassagemCiclo(340, 365);
   * // { ultrapassaCiclo: false, diasRestantes: 26, aviso: null, ... }
   *
   * // Se novo índice = 360 e total = 365
   * const resultado = reorganizador.verificarUltrapassagemCiclo(360, 365);
   * // { ultrapassaCiclo: false, diasRestantes: 6, aviso: null, ... }
   */
  verificarUltrapassagemCiclo(novoIndice, totalDias) {
    if (!Number.isInteger(novoIndice) || novoIndice < 1) {
      throw new Error(`novoIndice inválido: ${novoIndice}`);
    }
    if (!Number.isInteger(totalDias) || totalDias <= 0) {
      throw new Error(`totalDias inválido: ${totalDias}`);
    }

    const diasRestantes = totalDias - novoIndice;
    const ultrapassaCiclo = diasRestantes <= 0;
    const proximoCicloEm = Math.abs(diasRestantes) + 1;

    return {
      ultrapassaCiclo,
      diasRestantes: Math.max(0, diasRestantes),
      proximoCicloEm: ultrapassaCiclo ? proximoCicloEm : null,
      aviso: ultrapassaCiclo
        ? `Plano ultrapassará 31/12 em ${proximoCicloEm} dia(s) e continuará no próximo ciclo`
        : null,
      percentualRestante: Math.round((diasRestantes / totalDias) * 100),
      timestamp: new Date().toISOString(),
    };
  }

  /* ========================================================================
     VALIDAÇÃO DE INTEGRIDADE
  ======================================================================== */

  /**
   * Valida se todos os parâmetros fazem sentido juntos
   * @private
   */
  _validarIntegridade(ultimoDiaLido, diaAtualDoPlano, diasTotaisPlano) {
    if (ultimoDiaLido > diasTotaisPlano) {
      throw new Error(
        `ultimoDiaLido (${ultimoDiaLido}) não pode ser maior que diasTotaisPlano (${diasTotaisPlano})`,
      );
    }
    if (diaAtualDoPlano > diasTotaisPlano + this.MIN_DIAS_LACUNA) {
      throw new Error(`diaAtualDoPlano parece inválido: ${diaAtualDoPlano}`);
    }
  }

  /* ========================================================================
     UTILS
  ======================================================================== */

  /**
   * Formata dados de lacuna para display
   */
  formatarLacunaParaDisplay(dadosLacuna) {
    return {
      titulo: "⏸️ Você teve um atraso",
      mensagem: `${dadosLacuna.diasGapCount} dias sem leitura`,
      descricao: dadosLacuna.descricao,
      percentual: `${dadosLacuna.percentualAtraso}%`,
    };
  }

  /**
   * Formata dados de ultrapassagem para display
   */
  formatarUltrapassagemParaDisplay(dadosUltrapassagem) {
    if (!dadosUltrapassagem.ultrapassaCiclo) {
      return null;
    }

    return {
      tipo: "info",
      titulo: "📅 Plano ultrapassará 31/12",
      mensagem: dadosUltrapassagem.aviso,
      acao: "O plano continuará automaticamente no próximo ciclo (01/01)",
    };
  }
}
