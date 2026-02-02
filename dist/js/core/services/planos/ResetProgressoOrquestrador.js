"use strict";
/* ============================================================================
   ResetProgressoOrquestrador.js — Orquestrador de Reset de Progresso
   Versão: 1.0.0
   Aplicação: Leitura Controlada da Bíblia

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------
   - Orquestrar operações de reset de progresso
   - Gerenciar diferentes tipos de reset
   - Coordenar entre managers de plano e progresso
   - Emitir eventos de reset
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
exports.ResetProgressoOrquestrador = void 0;
const BaseOrquestrador_js_1 = require("../../../ui/orquestradores/BaseOrquestrador.js");
const parametroGerador = __importStar(require("../../models/parametroGerador.js"));
/* ============================================================================
   CLASSE RESETPROGRESSOORQUESTRADOR
============================================================================ */
class ResetProgressoOrquestrador extends BaseOrquestrador_js_1.BaseOrquestrador {
    /* --------------------------------------------------------------------------
       ATRIBUTOS PRIVADOS
       -------------------------------------------------------------------------- */
    constructor(progressoManager, planoManager) {
        super("ResetProgressoOrquestrador");
        this.progressoManager = progressoManager;
        this.planoManager = planoManager;
    }
    /* --------------------------------------------------------------------------
       OPERAÇÕES DE RESET
       -------------------------------------------------------------------------- */
    /**
     * Reset completo - volta tudo ao início
     */
    resetCompleto() {
        console.log("🔄 Executando reset completo...");
        // Resetar progresso
        this.progressoManager.resetar();
        // Resetar plano para o primeiro dia
        this.planoManager.resetar();
        // Emitir evento
        this.emit("progresso-resetado", {
            tipo: "completo",
            descricao: "Progresso resetado completamente",
        });
        return {
            sucesso: true,
            tipo: "completo",
            mensagem: "Progresso resetado com sucesso",
        };
    }
    /**
     * Reset customizado - começa a partir de um dia específico
     * @param {number} numeroDia - Dia para começar (ex: 1)
     */
    resetCustomizado(numeroDia) {
        console.log(`🔄 Executando reset customizado para dia ${numeroDia}...`);
        // Resetar progresso
        this.progressoManager.resetar();
        // Resetar plano para o dia específico
        const resultado = this.planoManager.resetarAPartirDoDia(numeroDia);
        if (!resultado.sucesso) {
            return {
                sucesso: false,
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
     */
    resetParaHoje() {
        console.log("🔄 Executando reset para hoje...");
        // Obter dia atual do ano
        const diaDoAno = this.getDiaDoAnoAtual();
        const totalDias = this.planoManager.getTotalDias();
        // Ajustar para não ultrapassar o total
        const diaAjustado = Math.min(diaDoAno, totalDias);
        // Resetar progresso
        this.progressoManager.resetar();
        // Resetar plano para o dia de hoje
        const resultado = this.planoManager.resetarAPartirDoDia(diaAjustado);
        if (!resultado.sucesso) {
            return {
                sucesso: false,
                erro: resultado.erro,
                mensagem: "Falha ao ajustar plano para hoje",
            };
        }
        // Verificar se houve ultrapassagem de ciclo
        let avisoUltrapassagem = null;
        if (diaDoAno > totalDias) {
            avisoUltrapassagem = `O plano de ${totalDias} dias já foi concluído. Começando novo ciclo.`;
        }
        // Emitir evento
        this.emit("progresso-resetado", {
            tipo: "hoje",
            diaDoAno: diaAjustado,
            avisoUltrapassagem,
            descricao: `Progresso ajustado para o dia de hoje (${diaAjustado})`,
        });
        return {
            sucesso: true,
            tipo: "hoje",
            diaDoAno: diaAjustado,
            avisoUltrapassagem,
            mensagem: `Progresso ajustado para o dia ${diaAjustado}`,
        };
    }
    /* --------------------------------------------------------------------------
       UTILIDADES
       -------------------------------------------------------------------------- */
    /**
     * Obtém o dia do ano atual
     * @returns {number} Dia do ano (1-366)
     */
    getDiaDoAnoAtual() {
        return parametroGerador.getDiaDoAnoAtual();
    }
    /**
     * Obtém estatísticas atuais do progresso
     * @returns {Object} Estatísticas
     */
    getEstatisticas() {
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
}
exports.ResetProgressoOrquestrador = ResetProgressoOrquestrador;
