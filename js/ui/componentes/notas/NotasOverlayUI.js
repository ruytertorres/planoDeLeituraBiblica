/* ============================================================================
   NotasOverlayUI.js — INTERFACE DE OVERLAY DE NOTAS
============================================================================
   Responsabilidade: APENAS apresentação e eventos de UI
   - Mostrar/esconder overlay
   - Registrar listeners de botões
   - Sincronizar classes CSS
   - Atalhos de teclado globais (ESC, Ctrl+Alt+N)
   
   NÃO faz: Lógica de estado, persistência, formatação
   Delegaçã para: NotasOverlayOrquestrador
   Camada: UI (Presentación)
============================================================================ */

import { initNotasToolbar } from "../../../core/services/notas/notas_toolbar.js";
import { setupEnterHandler } from "./NotasEnterHandler.js";

/**
 * Inicializa UI do overlay de notas
 * @param {NotasOverlayOrquestrador} orquestrador - Orquestrador de notas
 * @public
 */
export function initNotasOverlayUI(orquestrador) {
  /* -----------------------------------------------------------------------
     Cache de elementos
  ----------------------------------------------------------------------- */
  const botaoAbrir = document.getElementById("btn-notas");
  const overlay = document.getElementById("notas-overlay");
  const editor = document.getElementById("notas-editor");
  const btnFechar = document.getElementById("btn-fechar");
  const btnLimpar = document.getElementById("btn-limpar");
  const btnExportar = document.getElementById("btn-exportar");

  if (!botaoAbrir || !overlay || !editor) {
    console.warn("Bloco de notas não encontrado no DOM.");
    return;
  }

  /* -----------------------------------------------------------------------
     Toolbar (reutiliza notas_toolbar.js)
  ----------------------------------------------------------------------- */
  const toolbar = document.querySelector(".notas-toolbar");
  if (toolbar) {
    initNotasToolbar(editor);
  }

  /* -----------------------------------------------------------------------
     Handler de ENTER (função separada)
  ----------------------------------------------------------------------- */
  setupEnterHandler(editor);

  /* -----------------------------------------------------------------------
     Listeners de UI - Botões
  ----------------------------------------------------------------------- */
  botaoAbrir.addEventListener("click", () => {
    orquestrador.alternar();
  });

  if (btnFechar) {
    btnFechar.addEventListener("click", () => {
      orquestrador.fechar();
    });
  }

  if (btnLimpar) {
    btnLimpar.addEventListener("click", () => {
      const confirmar = confirm("Deseja apagar todas as anotações?");
      if (confirmar) {
        orquestrador.limparNotas();
      }
    });
  }

  if (btnExportar) {
    btnExportar.addEventListener("click", () => {
      orquestrador.exportarNotas();
    });
  }

  /* -----------------------------------------------------------------------
     Listeners de Teclado - Globais
  ----------------------------------------------------------------------- */
  document.addEventListener("keydown", (e) => {
    // ESC fecha overlay
    if (e.key === "Escape" && orquestrador.isAberto()) {
      e.preventDefault();
      orquestrador.fechar();
      return;
    }

    // Ctrl+Alt+N alterna overlay
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "n") {
      e.preventDefault();
      orquestrador.alternar();
      return;
    }

    // Ctrl+E exporta notas
    if (e.ctrlKey && e.key.toLowerCase() === "e" && orquestrador.isAberto()) {
      e.preventDefault();
      orquestrador.exportarNotas();
      return;
    }
  });

  /* -----------------------------------------------------------------------
     Listeners de Teclado - Editor (Atalhos de Formatação)
  ----------------------------------------------------------------------- */
  editor.addEventListener("keydown", (e) => {
    if (!e.ctrlKey && !e.metaKey) return;

    // Cache de botões (lazy-loaded)
    const _buttons = {};
    const _getButton = (action) => {
      if (!_buttons[action]) {
        _buttons[action] = document.querySelector(
          `[data-nota-action="${action}"]`,
        );
      }
      return _buttons[action];
    };

    switch (e.key.toLowerCase()) {
      case "b": // Ctrl+B - Negrito
        e.preventDefault();
        _getButton("bold")?.click();
        break;
      case "i": // Ctrl+I - Itálico
        e.preventDefault();
        _getButton("italic")?.click();
        break;
      case "u": // Ctrl+U - Sublinhado
        e.preventDefault();
        _getButton("underline")?.click();
        break;
      case "2": // Ctrl+2 - Cabeçalho 2
        e.preventDefault();
        _getButton("h2")?.click();
        break;
      case "3": // Ctrl+3 - Cabeçalho 3
        e.preventDefault();
        _getButton("h3")?.click();
        break;
      case "l": // Ctrl+L - Lista
        e.preventDefault();
        _getButton("ul")?.click();
        break;
      case " ": // Ctrl+Espaço - Limpar formatação
        e.preventDefault();
        _getButton("clear")?.click();
        break;
    }
  });

  /* -----------------------------------------------------------------------
     Listeners de Teclado - Editor (Atalhos de Marcador)
  ----------------------------------------------------------------------- */
  editor.addEventListener("keydown", (e) => {
    if (!e.altKey) return;

    // Cache de botões highlight
    const _highlightButtons = {};
    const _getHighlightButton = (color) => {
      if (!_highlightButtons[color]) {
        _highlightButtons[color] = document.querySelector(
          `[data-nota-action="highlight"][data-value="${color}"]`,
        );
      }
      return _highlightButtons[color];
    };

    switch (e.key) {
      case "1": // Alt+1 - Marcador amarelo
        e.preventDefault();
        _getHighlightButton("yellow")?.click();
        break;
      case "2": // Alt+2 - Marcador verde
        e.preventDefault();
        _getHighlightButton("#a8e6cf")?.click();
        break;
      case "3": // Alt+3 - Marcador laranja
        e.preventDefault();
        _getHighlightButton("#ffd3b6")?.click();
        break;
    }
  });

  /* -----------------------------------------------------------------------
     Listeners de Eventos - Orquestrador
  ----------------------------------------------------------------------- */

  // Quando overlay abre
  document.addEventListener("notas-abertas", (e) => {
    overlay.classList.remove("hidden");
    setTimeout(() => {
      overlay.classList.add("aberto");
      editor.focus();
    }, 10);
  });

  // Quando overlay fecha
  document.addEventListener("notas-fechadas", () => {
    overlay.classList.remove("aberto");
    setTimeout(() => {
      overlay.classList.add("hidden");
    }, 300);
  });

  // Quando notas mudam de dia
  document.addEventListener("notas-carregadas", (e) => {
    const { conteudo } = e.detail;
    editor.innerHTML = conteudo && conteudo.trim() ? conteudo : "<p></p>";
  });

  // Quando notas são limpas
  document.addEventListener("notas-limpas", () => {
    editor.innerHTML = "<p></p>";
    editor.focus();
  });

  // Quando clica em exportar vazio
  document.addEventListener("notas-exportar-vazio", (e) => {
    alert(e.detail?.mensagem || "Não há anotações para exportar.");
  });

  // Quando pronto para exportar
  document.addEventListener("notas-pronta-exportar", (e) => {
    const { conteudo, diaAtual } = e.detail;
    _downloadNotasHTML(conteudo, diaAtual);
    alert(`Anotações do dia ${diaAtual} exportadas com sucesso!`);
  });

  /* -----------------------------------------------------------------------
     Listeners do Editor - Persistência
  ----------------------------------------------------------------------- */
  editor.addEventListener("input", () => {
    orquestrador.salvarConteudo(editor.innerHTML);
  });

  /* -----------------------------------------------------------------------
     Função auxiliar - Download HTML
  ----------------------------------------------------------------------- */
  function _downloadNotasHTML(conteudo, diaAtual) {
    const blob = new Blob(
      [
        `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Anotações - Dia ${diaAtual}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
        h2, h3 { color: #333; }
        .highlight-yellow { background-color: yellow; }
        .highlight-green { background-color: #a8e6cf; }
        .highlight-orange { background-color: #ffd3b6; }
    </style>
</head>
<body>
    <h1>Anotações - Dia ${diaAtual}</h1>
    <div>${conteudo}</div>
</body>
</html>`,
      ],
      { type: "text/html" },
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `anotacoes-dia-${diaAtual}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
