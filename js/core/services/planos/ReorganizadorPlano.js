export class ReorganizadorPlano {
  detectarLacuna(ultimoDiaLido, diaHoje, totalDias, diasLidosSet = null) {
    if (ultimoDiaLido === null || ultimoDiaLido === 0) {
      return { temLacuna: false, motivo: "nenhum-dia-lido" };
    }
    if (ultimoDiaLido >= totalDias) {
      return { temLacuna: false, motivo: "plano-concluido" };
    }

    // 🔄 NOVA LÓGICA: Detectar dias não lidos de forma aleatória
    if (diasLidosSet && diasLidosSet.size > 0) {
      const diasNaoLidosRecentes = this.contarDiasNaoLidosRecentes(
        diasLidosSet,
        diaHoje,
      );

      if (diasNaoLidosRecentes >= 3) {
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
          descricao: `Você tem ${diasNaoLidosRecentes} dias não lidos recentemente. Considere reajustar o plano.`,
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

    return {
      temLacuna: true,
      tipo: "consecutivo",
      ultimoDiaLido,
      diaHoje,
      diasAtraso,
      totalDias,
      proximoDia: ultimoDiaLido + 1,
      descricao: `Você está ${diasAtraso} dias atrás. Último dia lido: ${ultimoDiaLido}, hoje deveria ser: ${diaHoje}`,
      ultrapassagemCiclo: this.verificarUltrapassagemCiclo(
        ultimoDiaLido + 1,
        totalDias,
      ),
    };
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
