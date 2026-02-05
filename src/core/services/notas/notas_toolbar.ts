/* ============================================================================
   notas_toolbar.ts — Wrapper Orquestrador
   Versão: 2.0.0 (TypeScript)
   ============================================================================ */

import { NotasHistoricoManager } from "./NotasHistoricoManager.js";
import { NotasFormatadorUI } from "../../../ui/componentes/notas/NotasFormatadorUI.js";
import { NotasEstruturadorUI } from "../../../ui/componentes/notas/NotasEstruturadorUI.js";
import { NotasToolbarUI } from "../../../ui/componentes/notas/NotasToolbarUI.js";

interface NotasToolbarAPI {
  undo(): void;
  redo(): void;
  desfazer(): void;
  refazer(): void;
  __debug: {
    historicoManager: NotasHistoricoManager;
    formatador: NotasFormatadorUI;
    estruturador: NotasEstruturadorUI;
    toolbarUI: NotasToolbarUI | null;
  };
}

export function initNotasToolbar(
  editor: HTMLElement,
  toolbar: HTMLElement | null,
): NotasToolbarAPI | null {
  if (!editor) return null;

  const historicoManager = new NotasHistoricoManager(editor.innerHTML);
  const formatador = new NotasFormatadorUI(editor, historicoManager);
  const estruturador = new NotasEstruturadorUI(editor, historicoManager);

  let toolbarUI: NotasToolbarUI | null = null;
  if (toolbar) {
    toolbarUI = new NotasToolbarUI(toolbar, editor, formatador, estruturador, historicoManager);
    toolbarUI.atualizarEstadoBotoes();
  }

  editor.addEventListener("input", () => {
    historicoManager.salvar(editor.innerHTML);
  });

  return {
    undo(): void {
      if (!historicoManager.podeUndo()) return;
      const estado = historicoManager.undo();
      if (estado !== null) {
        editor.innerHTML = estado;
      }
      if (toolbarUI) toolbarUI.atualizarEstadoBotoes();
    },

    redo(): void {
      if (!historicoManager.podeRedo()) return;
      const estado = historicoManager.redo();
      if (estado !== null) {
        editor.innerHTML = estado;
      }
      if (toolbarUI) toolbarUI.atualizarEstadoBotoes();
    },

    desfazer(): void {
      this.undo();
    },

    refazer(): void {
      this.redo();
    },

    __debug: {
      historicoManager,
      formatador,
      estruturador,
      toolbarUI,
    },
  };
}

export {
  NotasHistoricoManager,
  NotasFormatadorUI,
  NotasEstruturadorUI,
  NotasToolbarUI,
};

export default { initNotasToolbar };
