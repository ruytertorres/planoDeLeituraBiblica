/* ============================================================================
   notas_toolbar.js — Toolbar Semântica do Bloco de Notas
   versão 0.6
   Força o contrato HTML permitido
============================================================================ */

export function initNotasToolbar(editor) {
  if (!editor) return;

  const exec = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const map = {
    bold: () => exec("bold"),
    italic: () => exec("italic"),
    underline: () => exec("underline"),
    h1: () => exec("formatBlock", "h1"),
    h2: () => exec("formatBlock", "h2"),
    ul: () => exec("insertUnorderedList"),
    highlight: (color) => aplicarHighlight(color),
  };

  function aplicarHighlight(color) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    span.setAttribute("data-highlight", color);
    span.appendChild(range.extractContents());
    range.insertNode(span);
  }

  document.querySelectorAll("[data-nota-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.notaAction;
      const value = btn.dataset.value || null;

      map[action]?.(value);
      editor.focus();
    });
  });
}
