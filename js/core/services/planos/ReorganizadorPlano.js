export class ReorganizadorPlano {
  detectarLacuna(ultimoDiaLido, diaHoje, totalDias, diasLidosSet = null) {
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
        // CORREÇÃO: Apenas detecta, não toma decisão
        return {
          temLacuna: true,
          tipo: "aleatorio",
          ultimoDiaLido,
          diaHoje,
          diasNaoLidos: diasNaoLidosRecentes,
          totalDias,
          proximoDia: this.encontrarProximoDiaNaoLido(
            diasLidosSet,
            ultimoDiaLido,
            totalDias,
          ),
          descricao: `Detectados ${diasNaoLidosRecentes} dias não lidos recentemente. Requer decisão do usuário.`,
          requerDecisao: true, // NOVO: Indica que usuário deve decidir
          ultrapassagemCiclo: this.verificarUltrapassagemCiclo(
            this.encontrarProximoDiaNaoLido(
              diasLidosSet,
              ultimoDiaLido,
              totalDias,
            ),
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
      requerDecisao: true, // NOVO: Indica que usuário deve decidir
      ultrapassagemCiclo: this.verificarUltrapassagemCiclo(
        ultimoDiaLido + 1,
        totalDias,
      ),
    };
  }

  /**
   * NOVO: Gera opções de decisão para o usuário
   * @param {Object} lacunaDetectada - Resultado da detecção de lacuna
   * @returns {Array} Array de opções que o usuário pode escolher
   */
  gerarOpcoesDecisao(lacunaDetectada) {
    if (!lacunaDetectada.temLacuna || !lacunaDetectada.requerDecisao) {
      return [];
    }

    const opcoes = [
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
      lacunaDetectada.diasAtraso > 7
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
   * NOVO: Executa decisão explícita do usuário
   * @param {string} idDecisao - ID da decisão escolhida
   * @param {Object} contexto - Contexto da lacuna
   * @returns {Object} Resultado da execução
   */
  executarDecisaoUsuario(idDecisao, contexto) {
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
   */
  contarDiasNaoLidosRecentes(diasLidosSet, diaHoje, janela = 7) {
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
   */
  encontrarProximoDiaNaoLido(diasLidosSet, ultimoDiaLido, totalDias) {
    for (let dia = ultimoDiaLido + 1; dia <= totalDias; dia++) {
      if (!diasLidosSet.has(dia)) {
        return dia;
      }
    }
    return ultimoDiaLido + 1; // Fallback
  }

  calcularNovoIndice(ultimoDiaLido, diaAtualDoPlano) {
    const novoNumeroDia = ultimoDiaLido + 1;
    return {
      numeroDia: novoNumeroDia,
      descricao: `Próximo dia a ser lido: ${novoNumeroDia}`,
    };
  }

  verificarUltrapassagemCiclo(novoNumeroDia, totalDias) {
    if (novoNumeroDia > totalDias) {
      return {
        ultrapassaCiclo: true,
        aviso: `Atenção: Você irá ultrapassar o ciclo anual do plano. O plano será reiniciado.`,
      };
    }
    return { ultrapassaCiclo: false };
  }
}
