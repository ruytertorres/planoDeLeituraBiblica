"use strict";
/* ============================================================================
   notas_toolbar.js — WRAPPER ORQUESTRADOR
============================================================================
   Responsabilidade: INICIALIZAÇÃO E COMPOSIÇÃO
   
   Orquestra:
   1. NotasHistoricoManager - Undo/Redo
   2. NotasSelecaoManager - Gerência de seleção
   3. NotasFormatadorUI - Formatação (bold, italic, etc)
   4. NotasEstruturadorUI - Estrutura (h2, listas, etc)
   5. NotasToolbarUI - Event listeners e estado dos botões
   
   Backward compatible com NotasOverlayUI.js
   Camada: ORQUESTRAÇÃO
============================================================================ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotasToolbarUI = exports.NotasEstruturadorUI = exports.NotasFormatadorUI = exports.NotasSelecaoManager = exports.NotasHistoricoManager = void 0;
exports.initNotasToolbar = initNotasToolbar;
const NotasHistoricoManager_js_1 = require("./NotasHistoricoManager.js");
Object.defineProperty(exports, "NotasHistoricoManager", { enumerable: true, get: function () { return NotasHistoricoManager_js_1.NotasHistoricoManager; } });
const NotasSelecaoManager_js_1 = require("./NotasSelecaoManager.js");
Object.defineProperty(exports, "NotasSelecaoManager", { enumerable: true, get: function () { return NotasSelecaoManager_js_1.NotasSelecaoManager; } });
const NotasFormatadorUI_js_1 = require("../../../ui/componentes/notas/NotasFormatadorUI.js");
Object.defineProperty(exports, "NotasFormatadorUI", { enumerable: true, get: function () { return NotasFormatadorUI_js_1.NotasFormatadorUI; } });
const NotasEstruturadorUI_js_1 = require("../../../ui/componentes/notas/NotasEstruturadorUI.js");
Object.defineProperty(exports, "NotasEstruturadorUI", { enumerable: true, get: function () { return NotasEstruturadorUI_js_1.NotasEstruturadorUI; } });
const NotasToolbarUI_js_1 = require("../../../ui/componentes/notas/NotasToolbarUI.js");
Object.defineProperty(exports, "NotasToolbarUI", { enumerable: true, get: function () { return NotasToolbarUI_js_1.NotasToolbarUI; } });
/**
 * Inicializa a toolbar de notas com todos os componentes
 *
 * @param {HTMLElement} editor - Elemento contenteditable do editor
 * @param {HTMLElement} toolbar - Elemento da toolbar com botões
 * @returns {Object} Interface pública (undo, redo, desfazer, refazer)
 *
 * @example
 * const notas = initNotasToolbar(editorEl, toolbarEl);
 * notas.undo();
 * notas.redo();
 *
 * @public
 */
function initNotasToolbar(editor, toolbar) {
    if (!editor)
        return null;
    // Inicializa gerenciador de histórico
    const historicoManager = new NotasHistoricoManager_js_1.NotasHistoricoManager(editor.innerHTML);
    // Cria componentes UI
    const formatador = new NotasFormatadorUI_js_1.NotasFormatadorUI(editor, historicoManager);
    const estruturador = new NotasEstruturadorUI_js_1.NotasEstruturadorUI(editor, historicoManager);
    // Inicializa toolbar (listeners + estado dos botões)
    let toolbarUI = null;
    if (toolbar) {
        toolbarUI = new NotasToolbarUI_js_1.NotasToolbarUI(toolbar, editor, formatador, estruturador, historicoManager);
        toolbarUI.atualizarEstadoBotoes();
    }
    // Listener para salvar no histórico quando editor muda
    editor.addEventListener("input", () => {
        historicoManager.salvar(editor.innerHTML);
    });
    // Interface pública backward compatible
    return {
        /**
         * Desfaz última ação
         * @public
         */
        undo: () => {
            if (!historicoManager.podeUndo())
                return;
            const estado = historicoManager.undo();
            if (estado !== null) {
                editor.innerHTML = estado;
            }
            if (toolbarUI)
                toolbarUI.atualizarEstadoBotoes();
        },
        /**
         * Refaz última ação desfeita
         * @public
         */
        redo: () => {
            if (!historicoManager.podeRedo())
                return;
            const estado = historicoManager.redo();
            if (estado !== null) {
                editor.innerHTML = estado;
            }
            if (toolbarUI)
                toolbarUI.atualizarEstadoBotoes();
        },
        /**
         * Alias: desfazer (compatibilidade)
         * @public
         */
        desfazer: function () {
            this.undo();
        },
        /**
         * Alias: refazer (compatibilidade)
         * @public
         */
        refazer: function () {
            this.redo();
        },
        /**
         * Acesso aos gerenciadores internos (para testes/debug)
         * @private
         */
        __debug: {
            historicoManager,
            formatador,
            estruturador,
            toolbarUI,
        },
    };
}
