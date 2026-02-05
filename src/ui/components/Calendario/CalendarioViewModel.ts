/* ============================================================================
   CalendarioViewModel.ts — ViewModel do Calendário em TypeScript
   Versão: 1.0.0
   ============================================================================

   RESPONSABILIDADE:
   - Gerar modelo de visualização do calendário
   - Calcular meses e dias
   - Marcar dias lidos, atuais, bloqueados
   - Navegação entre meses

   CONFORMIDADE COM CONTRATO_DO_SISTEMA.MD:
   - §10: UI é reflexo do estado
   ============================================================================ */

import {
  getAnoAtual,
  getDiaDoAnoAtual,
  getTotalDiasDoAno,
  getMesAtual,
  getPrimeiroDiaMes,
  getUltimoDiaMes,
  calcularDiaDoAnoFromData,
  gerarDataISOFromComponents,
} from "../../../core/services/tempo/geradorDatas.js";

// ============================================================================
// TIPOS
// ============================================================================

interface Plano {
  totalDias: number;
  getDia: (numero: number) => any;
}

interface Progresso {
  estaLido: (diaNumero: number) => boolean;
}

interface DiaCalendarioViewModel {
  label: string;
  numero: number | null;
  classes: string[];
  clicavel: boolean;
  tooltip?: string;
  dataISO?: string;
}

interface MesCalendarioViewModel {
  nome: string;
  ano: number;
  dias: DiaCalendarioViewModel[];
}

// ============================================================================
// VIEWMODEL
// ============================================================================

export class CalendarioViewModel {
  private plano: Plano;
  private progresso: Progresso;
  private getDiaHoje: () => number;
  private getDiaAtual: () => number;
  private selecionarDiaCallback: (diaNumero: number) => void;
  public diasBloqueados: number[];
  private mesAtual: number;
  private anoAtual: number;

  constructor(
    plano: Plano,
    progresso: Progresso,
    getDiaHoje: () => number,
    getDiaAtual: () => number,
    onSelecionarDia: (diaNumero: number) => void,
    diasBloqueados: number[] = [],
  ) {
    this.plano = plano;
    this.progresso = progresso;
    this.getDiaHoje = getDiaHoje;
    this.getDiaAtual = getDiaAtual;
    this.selecionarDiaCallback = onSelecionarDia;
    this.diasBloqueados = diasBloqueados;

    this.mesAtual = getMesAtual();
    this.anoAtual = getAnoAtual();
  }

  /**
   * Gera o ViewModel do mês atual
   */
  public gerarMesAtual(): MesCalendarioViewModel {
    return this.gerarViewModel(this.anoAtual, this.mesAtual);
  }

  /**
   * Gera ViewModel para um mês específico
   */
  public gerarViewModel(ano: number, mes?: number): MesCalendarioViewModel {
    if (mes !== undefined) {
      this.anoAtual = ano;
      this.mesAtual = mes;
    }

    const nomesMeses = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

    const diaHoje = this.getDiaHoje();
    const diaAtual = this.getDiaAtual();

    // Calcular primeiro dia do mês usando geradorDatas (§3.2)
    const primeiroDiaInfo = getPrimeiroDiaMes(this.anoAtual, this.mesAtual);
    const ultimoDiaMes = getUltimoDiaMes(this.anoAtual, this.mesAtual);
    const diaDaSemanaInicio = primeiroDiaInfo.diaSemana; // 0 = Domingo

    const dias: DiaCalendarioViewModel[] = [];

    // Dias vazios antes do início do mês
    for (let i = 0; i < diaDaSemanaInicio; i++) {
      dias.push({
        label: "",
        numero: null,
        classes: ["vazio"],
        clicavel: false,
      });
    }

    // Dias do mês - usar funções do geradorDatas (§3.2)
    for (let dia = 1; dia <= ultimoDiaMes; dia++) {
      const diaDoAno = calcularDiaDoAnoFromData(
        this.anoAtual,
        this.mesAtual,
        dia,
      );
      const diaPlano = diaDoAno <= this.plano.totalDias ? diaDoAno : null;
      const dataISO = gerarDataISOFromComponents(
        this.anoAtual,
        this.mesAtual,
        dia,
      );

      const classes: string[] = [];
      let clicavel = false;
      let tooltip = "";

      if (diaPlano !== null) {
        clicavel = true;
        classes.push("dia-plano");

        // Dia está lido?
        if (this.progresso.estaLido(diaPlano)) {
          classes.push("dia-lido");
        }

        // É o dia de hoje?
        if (diaPlano === diaHoje) {
          classes.push("dia-hoje");
          tooltip = "Hoje";
        }

        // É o dia atual selecionado?
        if (diaPlano === diaAtual) {
          classes.push("dia-atual");
        }

        // Dia bloqueado?
        if (this.diasBloqueados.includes(diaPlano)) {
          classes.push("dia-bloqueado");
          clicavel = false;
          tooltip = "Dia bloqueado";
        }
      } else {
        classes.push("fora-do-plano");
      }

      dias.push({
        label: String(dia),
        numero: diaPlano,
        classes,
        clicavel,
        tooltip,
        dataISO,
      });
    }

    return {
      nome: nomesMeses[this.mesAtual],
      ano: this.anoAtual,
      dias,
    };
  }

  /**
   * Calcula o dia do ano a partir de uma data
   * @deprecated Use calcularDiaDoAnoFromData de geradorDatas.ts
   */
  private calcularDiaDoAno(_data: Date): number {
    // Este método está deprecated - usar calcularDiaDoAnoFromData
    return 0;
  }

  /**
   * Navega para o mês anterior
   */
  public onMesPosterior(): void {
    this.mesAtual--;
    if (this.mesAtual < 0) {
      this.mesAtual = 11;
      this.anoAtual--;
    }
  }

  /**
   * Navega para o próximo mês
   */
  public onProximoMes(): void {
    this.mesAtual++;
    if (this.mesAtual > 11) {
      this.mesAtual = 0;
      this.anoAtual++;
    }
  }

  /**
   * Seleciona um dia
   */
  public onSelecionarDia(diaNumero: number): void {
    if (diaNumero && !this.diasBloqueados.includes(diaNumero)) {
      this.selecionarDiaCallback(diaNumero);
    }
  }
}

// Exportar como default
export default CalendarioViewModel;
