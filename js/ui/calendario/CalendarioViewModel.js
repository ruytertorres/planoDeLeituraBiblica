/* ============================================================================
   CalendarioViewModel.js — ViewModel do Calendário (Conforme Contrato §3)
   Camada: UI / ViewModel
   
   RESPONSABILIDADE:
   - Construir estrutura visual para render_calendario
   - NÃO calcula tempo (recebe de geradorDatas)
   - NÃO toma decisões (apenas exibe opções)
   - Totalmente testável sem Date
============================================================================ */

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
  constructor(plano, progresso, getDiaHoje, getDiaAtivo, onSelecionarDia) {
    this.plano = plano;
    this.progresso = progresso;
    this.getDiaHoje = getDiaHoje;
    this.getDiaAtivo = getDiaAtivo;
    this.onSelecionarDia = onSelecionarDia;
    this.mesAtual = 0; // Janeiro (0-11)
    this.anoAtual = 2026;
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

    // 1. Mapear dias do plano por data ISO
    this.plano.dias.forEach((dia) => {
      if (!dia.data) return;

      diasPlanoPorData.set(dia.data, {
        numero: dia.numero,
        dataISO: dia.data,
        isHoje: dia.numero === this.getDiaHoje(),
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
    const primeiroDia = new Date(this.anoAtual, mesIndex, 1).getDay();

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
    const diasNoMes = new Date(this.anoAtual, mesIndex + 1, 0).getDate();

    for (let dia = 1; dia <= diasNoMes; dia++) {
      const dataISO = `${this.anoAtual}-${String(mesIndex + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
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

        classes.push("calendario-com-plano");
        if (infoDia.isLido) classes.push("lido");
        if (infoDia.isAtivo) classes.push("ativo");
        if (infoDia.isHoje) classes.push("calendario-hoje-plano");

        mes.dias.push({
          label: String(dia),
          numero: infoDia.numero,
          dataISO,
          clicavel: true,
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
