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

import { NotasHistoricoManager } from "./NotasHistoricoManager.js";
import { NotasSelecaoManager } from "./NotasSelecaoManager.js";
import { NotasFormatadorUI } from "../../../ui/componentes/notas/NotasFormatadorUI.js";
import { NotasEstruturadorUI } from "../../../ui/componentes/notas/NotasEstruturadorUI.js";
import { NotasToolbarUI } from "../../../ui/componentes/notas/NotasToolbarUI.js";

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
export function initNotasToolbar(editor, toolbar) {
  if (!editor) return null;

  // Inicializa gerenciador de histórico
  const historicoManager = new NotasHistoricoManager(editor.innerHTML);

  // Cria componentes UI
  const formatador = new NotasFormatadorUI(editor, historicoManager);
  const estruturador = new NotasEstruturadorUI(editor, historicoManager);

  // Inicializa toolbar (listeners + estado dos botões)
  let toolbarUI = null;
  if (toolbar) {
    toolbarUI = new NotasToolbarUI(
      toolbar,
      editor,
      formatador,
      estruturador,
      historicoManager,
    );
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
      if (!historicoManager.podeUndo()) return;

      const estado = historicoManager.undo();
      if (estado !== null) {
        editor.innerHTML = estado;
      }
      if (toolbarUI) toolbarUI.atualizarEstadoBotoes();
    },

    /**
     * Refaz última ação desfeita
     * @public
     */
    redo: () => {
      if (!historicoManager.podeRedo()) return;

      const estado = historicoManager.redo();
      if (estado !== null) {
        editor.innerHTML = estado;
      }
      if (toolbarUI) toolbarUI.atualizarEstadoBotoes();
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

/* ============================================================================
   EXPORTS INDIVIDUAIS (Para uso modular)
============================================================================ */
export {
  NotasHistoricoManager,
  NotasSelecaoManager,
  NotasFormatadorUI,
  NotasEstruturadorUI,
  NotasToolbarUI,
};
