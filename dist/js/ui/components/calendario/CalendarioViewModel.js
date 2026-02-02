"use strict";
/* ============================================================================
   CalendarioViewModel.js — ViewModel do Calendário (Conforme Contrato §3)
   Camada: UI / ViewModel
   
   RESPONSABILIDADE:
   - Construir estrutura visual para render_calendario
   - NÃO calcula tempo (recebe de geradorDatas)
   - NÃO toma decisões (apenas exibe opções)
   - Totalmente testável sem Date
============================================================================ */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarioViewModel = void 0;
const parametroGerador = __importStar(require("../../../core/models/parametroGerador.js"));
const calendarioUtil_js_1 = require("./calendarioUtil.js");
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
class CalendarioViewModel {
    constructor(plano, progresso, getDiaHoje, getDiaAtivo, onSelecionarDia, diasBloqueados = []) {
        this.plano = plano;
        this.progresso = progresso;
        this.getDiaHoje = getDiaHoje;
        this.getDiaAtivo = getDiaAtivo;
        this.onSelecionarDia = onSelecionarDia;
        this.diasBloqueados = diasBloqueados; // Dias que não podem ser clicados
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
        }
        else {
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
        }
        else {
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
        const deslocamento = typeof this.progresso.obterDeslocamentoDatas === "function"
            ? this.progresso.obterDeslocamentoDatas()
            : 0;
        const reajuste = typeof this.progresso.obterReajuste === "function"
            ? this.progresso.obterReajuste()
            : null;
        const numeroDiaReajuste = reajuste?.numeroDia ?? null;
        // Dia civil de hoje (dia do ano) convertido em data ISO
        const diaHojeNumero = this.getDiaHoje();
        const dataHojeISO = parametroGerador.gerarDataISO(diaHojeNumero, this.anoAtual);
        // 1. Mapear dias do plano por data ISO, aplicando deslocamento quando houver
        this.plano.dias.forEach((dia) => {
            if (!dia.data)
                return;
            let dataISO = dia.data;
            // Quando existe um reajuste ativo, todos os dias a partir do
            // próximo dia de leitura (numeroDiaReajuste) são deslocados no calendário.
            if (deslocamento !== 0 && numeroDiaReajuste !== null) {
                if (dia.numero >= numeroDiaReajuste) {
                    const novoDiaAno = dia.numero + deslocamento;
                    dataISO = parametroGerador.gerarDataISO(novoDiaAno, this.anoAtual);
                }
                else {
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
        const primeiroDia = (0, calendarioUtil_js_1.getPrimeiroDiaMes)(this.anoAtual, mesIndex);
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
        const diasNoMes = (0, calendarioUtil_js_1.getDiasNoMes)(this.anoAtual, mesIndex);
        for (let dia = 1; dia <= diasNoMes; dia++) {
            const dataISO = (0, calendarioUtil_js_1.formatarDataISO)(this.anoAtual, mesIndex, dia);
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
            }
            else if (infoDia) {
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
                if (infoDia.isLido)
                    classes.push("lido");
                if (infoDia.isAtivo)
                    classes.push("ativo");
                if (infoDia.isHoje)
                    classes.push("calendario-hoje-plano");
                if (estaBloqueado)
                    classes.push("dia-bloqueado");
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
            }
            else {
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
exports.CalendarioViewModel = CalendarioViewModel;
