"use strict";
/* ============================================================================
   NotasFormatadorUI.js — FORMATAÇÃO DE TEXTO
============================================================================
   Responsabilidade: APENAS aplicar formatação (bold, italic, underline, highlight)
   - Bold, Italic, Underline
   - Highlight com cores
   - Preservar cursor
   
   NÃO faz: Estrutura (h2, listas), limpeza
   Camada: UI
============================================================================ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotasFormatadorUI = void 0;
const NotasSelecaoManager_js_1 = require("../../../core/services/notas/NotasSelecaoManager.js");
/**
 * Aplicar formatações de texto (bold, italic, etc)
 */
class NotasFormatadorUI {
    constructor(editor, historicoManager) {
        this.editor = editor;
        this.historicoManager = historicoManager;
    }
    /**
     * Aplica bold
     * @public
     */
    bold() {
        this.aplicarFormato("bold");
    }
    /**
     * Aplica italic
     * @public
     */
    italic() {
        this.aplicarFormato("italic");
    }
    /**
     * Aplica underline
     * @public
     */
    underline() {
        this.aplicarFormato("underline");
    }
    /**
     * Aplica highlight (background color)
     * @param {string} cor - Cor (hex ou nome)
     * @public
     */
    highlight(cor = "yellow") {
        this.aplicarFormato("backColor", cor);
    }
    /**
     * Aplica formatação usando execCommand
     * @private
     */
    aplicarFormato(comando, valor = null) {
        // Salva seleção antes
        const selecaoSalva = NotasSelecaoManager_js_1.NotasSelecaoManager.salvar(this.editor);
        if (!selecaoSalva)
            return;
        this.editor.focus();
        // Executa comando
        try {
            if (valor) {
                document.execCommand(comando, false, valor);
            }
            else {
                document.execCommand(comando, false, null);
            }
        }
        catch (e) {
            console.warn(`Erro ao aplicar formatação ${comando}:`, e.message);
            return;
        }
        // Tenta restaurar seleção
        try {
            NotasSelecaoManager_js_1.NotasSelecaoManager.restaurar(selecaoSalva);
        }
        catch (e) {
            console.warn("Falha ao restaurar seleção após formatação");
        }
        // Salva no histórico após delay mínimo
        if (this.historicoManager) {
            setTimeout(() => {
                this.historicoManager.salvar(this.editor.innerHTML);
            }, 10);
        }
    }
    /**
     * Verifica se texto está em bold
     * @returns {boolean}
     * @public
     */
    estaBold() {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0)
            return false;
        let node = sel.anchorNode;
        while (node && node !== this.editor) {
            if (node.tagName === "B" ||
                node.tagName === "STRONG" ||
                (node.style && node.style.fontWeight === "bold")) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }
    /**
     * Verifica se texto está em italic
     * @returns {boolean}
     * @public
     */
    estaItalico() {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0)
            return false;
        let node = sel.anchorNode;
        while (node && node !== this.editor) {
            if (node.tagName === "I" ||
                node.tagName === "EM" ||
                (node.style && node.style.fontStyle === "italic")) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }
    /**
     * Verifica se texto está underlined
     * @returns {boolean}
     * @public
     */
    estaUnderlined() {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0)
            return false;
        let node = sel.anchorNode;
        while (node && node !== this.editor) {
            if (node.tagName === "U" ||
                node.tagName === "INS" ||
                (node.style && node.style.textDecoration === "underline")) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }
}
exports.NotasFormatadorUI = NotasFormatadorUI;
