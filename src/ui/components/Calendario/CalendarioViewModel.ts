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
  diaDoAno?: number;
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
  private getDeslocamento: () => number;
  private getDiaRetomada: () => number | null;
  private selecionarDiaCallback: (diaNumero: number) => void;
  public diasBloqueados: number[];
  private mesAtual: number;
  private anoAtual: number;

  constructor(
    plano: Plano,
    progresso: Progresso,
    getDiaHoje: () => number,
    getDiaAtual: () => number,
    onSelecionarDia: (diaNumero: number, diaDoAno?: number) => void,
    diasBloqueados: number[] = [],
    getDeslocamento?: () => number,
    getDiaRetomada?: () => number | null,
  ) {
    this.plano = plano;
    this.progresso = progresso;
    this.getDiaHoje = getDiaHoje;
    this.getDiaAtual = getDiaAtual;
    this.selecionarDiaCallback = onSelecionarDia;
    this.diasBloqueados = diasBloqueados;
    this.getDeslocamento = getDeslocamento || (() => 0);
    this.getDiaRetomada = getDiaRetomada || (() => null);

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
    const deslocamento = this.getDeslocamento();
    const diaRetomada = this.getDiaRetomada();
    const hojeDiaDoAno = getDiaDoAnoAtual();
    for (let dia = 1; dia <= ultimoDiaMes; dia++) {
      const diaDoAno = calcularDiaDoAnoFromData(
        this.anoAtual,
        this.mesAtual,
        dia,
      );

      // Calcular dia do plano
      let diaPlano: number | null = null;

      if (diaRetomada !== null && deslocamento > 0) {
        // Com reajuste ativo: dias antes da retomada não têm deslocamento
        // dias a partir da retomada têm deslocamento
        const diaRetomadaDoAno = diaRetomada + deslocamento; // dia do ano onde o dia de retomada aparece
        if (diaDoAno < diaRetomadaDoAno) {
          // Antes do gap: sem deslocamento
          diaPlano =
            diaDoAno >= 1 && diaDoAno <= this.plano.totalDias ? diaDoAno : null;
        } else {
          // Após o gap: com deslocamento
          const diaPlanoCalculado = diaDoAno - deslocamento;
          diaPlano =
            diaPlanoCalculado >= 1 && diaPlanoCalculado <= this.plano.totalDias
              ? diaPlanoCalculado
              : null;
        }
      } else {
        // Sem reajuste: sem deslocamento
        diaPlano =
          diaDoAno >= 1 && diaDoAno <= this.plano.totalDias ? diaDoAno : null;
      }
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

        // É o dia de hoje? (considerando deslocamento)
        if (diaDoAno === diaHoje) {
          classes.push("dia-hoje");
          tooltip = "Hoje";
        }

        // É o dia atual selecionado?
        if (diaPlano === diaAtual) {
          classes.push("dia-atual");
        }

        // Dia bloqueado?
        // Só bloqueia se o dia do plano está na lista E estamos na região do gap (antes da retomada)
        const estaNaRegiaoGap =
          diaRetomada !== null &&
          deslocamento > 0 &&
          diaDoAno < diaRetomada + deslocamento;
        if (this.diasBloqueados.includes(diaPlano) && estaNaRegiaoGap) {
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
        diaDoAno,
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
  public onSelecionarDia(diaNumero: number, diaDoAno?: number): void {
    console.log(
      `[CalendarioViewModel] onSelecionarDia chamado: diaNumero=${diaNumero}, diaDoAno=${diaDoAno}`,
    );

    // Verificar se o dia está bloqueado considerando a região do gap
    const deslocamento = this.getDeslocamento();
    const diaRetomada = this.getDiaRetomada();
    const estaNaRegiaoGap =
      diaRetomada !== null &&
      deslocamento > 0 &&
      diaDoAno !== undefined &&
      diaDoAno < diaRetomada + deslocamento;

    console.log(
      `[CalendarioViewModel] deslocamento=${deslocamento}, diaRetomada=${diaRetomada}, estaNaRegiaoGap=${estaNaRegiaoGap}`,
    );
    console.log(
      `[CalendarioViewModel] diasBloqueados=${JSON.stringify(this.diasBloqueados)}, includes=${this.diasBloqueados.includes(diaNumero)}`,
    );

    if (
      diaNumero &&
      (!this.diasBloqueados.includes(diaNumero) || !estaNaRegiaoGap)
    ) {
      console.log(
        `[CalendarioViewModel] Chamando callback para dia ${diaNumero}`,
      );
      this.selecionarDiaCallback(diaNumero);
    } else {
      console.log(
        `[CalendarioViewModel] Dia ${diaNumero} bloqueado - não chamando callback`,
      );
    }
  }
}

// Exportar como default
export default CalendarioViewModel;
