/* ============================================================================
   CalendarioViewModel.js — ViewModel do Calendário (Conforme Contrato §3)
   Camada: UI / ViewModel
   
   RESPONSABILIDADE:
   - Construir estrutura visual para render_calendario
   - NÃO calcula tempo (recebe de geradorDatas)
   - NÃO toma decisões (apenas exibe opções)
   - Totalmente testável sem Date
============================================================================ */

import * as parametroGerador from "../../../core/models/parametroGerador.js";
import {
  getPrimeiroDiaMes,
  getDiasNoMes,
  formatarDataISO,
} from "./calendarioUtil.js";

const NOMES_MESES = [
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

export class CalendarioViewModel {
  constructor(
    plano,
    progresso,
    getDiaHoje,
    getDiaAtivo,
    onSelecionarDia,
    diasBloqueados = [],
  ) {
    this.plano = plano;
    this.progresso = progresso;
    this.getDiaHoje = getDiaHoje;
    this.getDiaAtivo = getDiaAtivo;
    this.onSelecionarDia = onSelecionarDia;
    this.diasBloqueados = diasBloqueados; // Dias que não podem ser clicados

    // ✅ CORREÇÃO: Inicializar com o mês atual real
    const dataAtual = new Date();
    this.mesAtual = dataAtual.getMonth(); // Mês atual (0-11)
    this.anoAtual = parametroGerador.getAnoAtual();
  }

  /**
   * Define qual mês está sendo exibido
   */
  definirMes(mesIndex, ano) {
    this.mesAtual = mesIndex;
    this.anoAtual = ano;
  }

  /**
   * Navega para o mês anterior
   */
  proximoMes() {
    if (this.mesAtual === 11) {
      this.mesAtual = 0;
      this.anoAtual += 1;
    } else {
      this.mesAtual += 1;
    }
  }

  /**
   * Navega para o mês anterior
   */
  mesPosterior() {
    if (this.mesAtual === 0) {
      this.mesAtual = 11;
      this.anoAtual -= 1;
    } else {
      this.mesAtual -= 1;
    }
  }

  /**
   * Gera estrutura de um único mês para render_calendario (burra render)
   *
   * @param {number} ano - Ano civil real (fornecido por geradorDatas)
   * @returns {Object} ViewModel com um mês e dias prontos para renderizar
   */
  gerarViewModel(ano) {
    // Atualizar ano ao inicializar
    this.anoAtual = ano;
    return {
      mes: this.gerarMesAtual(),
      onSelecionarDia: this.onSelecionarDia,
      onProximoMes: () => this.proximoMes(),
      onMesPosterior: () => this.mesPosterior(),
      gerarMesAtual: () => this.gerarMesAtual(), // Adicionar método para recalcular dinâmicamente
    };
  }

  /**
   * Gera apenas o mês atualmente selecionado
   * Pode ser chamado múltiplas vezes para atualizar após navegação
   *
   * @private
   * @returns {Object} Estrutura do mês com dias
   */
  gerarMesAtual() {
    const diasPlanoPorData = new Map();

    // 1. Calcular deslocamento ativo (se houver reajuste)
    const deslocamento =
      typeof this.progresso.obterDeslocamentoDatas === "function"
        ? this.progresso.obterDeslocamentoDatas()
        : 0;

    const reajuste =
      typeof this.progresso.obterReajuste === "function"
        ? this.progresso.obterReajuste()
        : null;

    const numeroDiaReajuste = reajuste?.numeroDia ?? null;

    // Dia civil de hoje (dia do ano) convertido em data ISO
    const diaHojeNumero = this.getDiaHoje();
    const dataHojeISO = parametroGerador.gerarDataISO(
      diaHojeNumero,
      this.anoAtual,
    );

    // 1. Mapear dias do plano por data ISO, aplicando deslocamento quando houver
    this.plano.dias.forEach((dia) => {
      if (!dia.data) return;

      let dataISO = dia.data;

      // Quando existe um reajuste ativo, todos os dias a partir do
      // próximo dia de leitura (numeroDiaReajuste) são deslocados no calendário.
      if (deslocamento !== 0 && numeroDiaReajuste !== null) {
        if (dia.numero >= numeroDiaReajuste) {
          const novoDiaAno = dia.numero + deslocamento;
          dataISO = parametroGerador.gerarDataISO(novoDiaAno, this.anoAtual);
        } else {
          // Dias lidos antes da parada mantêm a data original
          dataISO = dia.data;
        }
      }

      diasPlanoPorData.set(dataISO, {
        numero: dia.numero,
        dataISO,
        // "Hoje" é definido pela data civil, não mais pelo número do dia do plano
        isHoje: dataISO === dataHojeISO,
        isAtivo: dia.numero === this.getDiaAtivo(),
        isLido: this.progresso.estaLido(dia.numero),
      });
    });

    // 2. Construir o mês atual
    const mesIndex = this.mesAtual;
    const mes = {
      nome: NOMES_MESES[mesIndex],
      ano: this.anoAtual,
      dias: [],
    };

    // Primeiro dia do mês (0=Dom, 1=Seg, ...)
    const primeiroDia = getPrimeiroDiaMes(this.anoAtual, mesIndex);

    // Dias vazios iniciais
    for (let i = 0; i < primeiroDia; i++) {
      mes.dias.push({
        label: "",
        numero: null,
        dataISO: null,
        clicavel: false,
        classes: ["calendario-dia-vazio"],
        tooltip: null,
      });
    }

    // Dias do mês
    const diasNoMes = getDiasNoMes(this.anoAtual, mesIndex);

    for (let dia = 1; dia <= diasNoMes; dia++) {
      const dataISO = formatarDataISO(this.anoAtual, mesIndex, dia);
      const infoDia = diasPlanoPorData.get(dataISO);

      if (infoDia && !infoDia.numero) {
        // Dia sem plano
        mes.dias.push({
          label: String(dia),
          numero: null,
          dataISO,
          clicavel: false,
          classes: ["calendario-sem-plano"],
          tooltip: `${dataISO}\nSem leitura neste plano`,
        });
      } else if (infoDia) {
        // Dia com plano
        const classes = [];
        const tooltipParts = [
          `Dia ${infoDia.numero} do plano`,
          dataISO,
          infoDia.isLido ? "✓ Lido" : "○ Não lido",
        ];

        // 🔒 Verificar se dia está bloqueado após reajuste
        const estaBloqueado = this.diasBloqueados.includes(infoDia.numero);

        classes.push("calendario-com-plano");
        if (infoDia.isLido) classes.push("lido");
        if (infoDia.isAtivo) classes.push("ativo");
        if (infoDia.isHoje) classes.push("calendario-hoje-plano");
        if (estaBloqueado) classes.push("dia-bloqueado");

        if (estaBloqueado) {
          tooltipParts.push("⛔ Dia pulado (bloqueado)");
        }

        mes.dias.push({
          label: String(dia),
          numero: infoDia.numero,
          dataISO,
          clicavel: !estaBloqueado, // Desabilita clique se bloqueado
          classes,
          tooltip: tooltipParts.join("\n"),
        });
      } else {
        // Dia sem dados (não deve acontecer normalmente)
        mes.dias.push({
          label: String(dia),
          numero: null,
          dataISO,
          clicavel: false,
          classes: ["calendario-dia-vazio"],
          tooltip: null,
        });
      }
    }

    return mes;
  }
}
