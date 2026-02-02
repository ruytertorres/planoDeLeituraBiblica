"use strict";
/* ============================================================================
   NotasOverlayOrquestrador.js — ORQUESTRAÇÃO DE OVERLAY DE NOTAS
============================================================================
   Responsabilidade: APENAS coordenação de estado e eventos
   - Gerenciar abertura/fechamento de overlay
   - Sincronizar com mudança de dia
   - Emitir eventos para UI consumir
   
   NÃO faz: Manipulação de DOM, listeners, renderização
   Camada: Serviços (Domínio/Orquestração)
============================================================================ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotasOverlayOrquestrador = void 0;
/**
 * Orquestrador de overlay de notas
 * Coordena abertura/fechamento e sincronização com dias
 */
class NotasOverlayOrquestrador {
    constructor(notasManager) {
        this.notasManager = notasManager;
        this.aberto = false;
        this._setupListeners();
    }
    /**
     * Registra listeners de eventos do sistema
     * @private
     */
    _setupListeners() {
        // Sincronizar quando dia muda
        document.addEventListener("dia-alterado", (e) => {
            this.carregarNotasDoDia(e.detail?.dia);
        });
    }
    /**
     * Abre o overlay de notas
     * Emite evento "notas-abertas" para UI consumir
     * @public
     */
    abrir() {
        if (this.aberto)
            return;
        this.aberto = true;
        document.dispatchEvent(new CustomEvent("notas-abertas", {
            detail: {
                conteudo: this.notasManager.getConteudo(),
            },
        }));
    }
    /**
     * Fecha o overlay de notas
     * Emite evento "notas-fechadas" para UI consumir
     * @public
     */
    fechar() {
        if (!this.aberto)
            return;
        this.aberto = false;
        document.dispatchEvent(new CustomEvent("notas-fechadas"));
    }
    /**
     * Alterna abertura/fechamento
     * @public
     */
    alternar() {
        this.aberto ? this.fechar() : this.abrir();
    }
    /**
     * Carrega notas do dia atual
     * Emite evento "notas-carregadas" com conteúdo
     * @param {Dia} dia - Objeto dia (opcional)
     * @public
     */
    carregarNotasDoDia(dia) {
        const conteudo = this.notasManager.getConteudo();
        document.dispatchEvent(new CustomEvent("notas-carregadas", {
            detail: {
                conteudo: conteudo && conteudo.trim() ? conteudo : "<p></p>",
                dia,
            },
        }));
    }
    /**
     * Persiste conteúdo de notas
     * @param {string} conteudo - HTML do editor
     * @public
     */
    salvarConteudo(conteudo) {
        this.notasManager.setConteudo(conteudo);
    }
    /**
     * Limpa todas as notas do dia atual
     * @public
     */
    limparNotas() {
        this.notasManager.limpar();
        document.dispatchEvent(new CustomEvent("notas-limpas"));
    }
    /**
     * Exporta notas como arquivo HTML
     * @returns {boolean} true se sucesso, false se vazio
     * @public
     */
    exportarNotas() {
        const conteudo = this.notasManager.getConteudo();
        if (!conteudo || conteudo.trim() === "" || conteudo === "<p></p>") {
            document.dispatchEvent(new CustomEvent("notas-exportar-vazio", {
                detail: { mensagem: "Não há anotações para exportar." },
            }));
            return false;
        }
        // Emite evento com dados de exportação
        document.dispatchEvent(new CustomEvent("notas-pronta-exportar", {
            detail: {
                conteudo,
                diaAtual: this.notasManager.diaAtual,
            },
        }));
        return true;
    }
    /**
     * Verifica se overlay está aberto
     * @returns {boolean}
     * @public
     */
    isAberto() {
        return this.aberto;
    }
}
exports.NotasOverlayOrquestrador = NotasOverlayOrquestrador;
