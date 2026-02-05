/* ============================================================================
   NotasOverlayUI.ts — Interface de Overlay de Notas
   Versão: 2.0.0 (TypeScript)
   ============================================================================ */

import type { INotasOverlayOrquestrador } from "../../../core/services/notas/NotasOverlayOrquestrador.js";
import { setupEnterHandler } from "./NotasEnterHandler.js";

export function initNotasOverlayUI(
  orquestrador: INotasOverlayOrquestrador,
): void {
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

  // Toolbar
  const toolbar = document.querySelector(".notas-toolbar");
  if (toolbar) {
    import("../../../core/services/notas/notas_toolbar").then((m) => {
      m.initNotasToolbar(editor as HTMLElement, toolbar as HTMLElement);
    });
  }

  // Handler de ENTER
  setupEnterHandler(editor as HTMLElement);

  // Listeners de UI
  botaoAbrir.addEventListener("click", () => orquestrador.alternar());
  btnFechar?.addEventListener("click", () => orquestrador.fechar());
  btnLimpar?.addEventListener("click", () => {
    if (confirm("Deseja apagar todas as anotações?")) {
      orquestrador.limparNotas();
    }
  });
  btnExportar?.addEventListener("click", () => orquestrador.exportarNotas());

  // Teclado global
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && orquestrador.isAberto()) {
      e.preventDefault();
      orquestrador.fechar();
      return;
    }
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "n") {
      e.preventDefault();
      orquestrador.alternar();
      return;
    }
    if (e.ctrlKey && e.key.toLowerCase() === "e" && orquestrador.isAberto()) {
      e.preventDefault();
      orquestrador.exportarNotas();
      return;
    }
  });

  // Eventos do orquestrador
  document.addEventListener("notas-abertas", () => {
    overlay.classList.remove("hidden");
    setTimeout(() => {
      overlay.classList.add("aberto");
      (editor as HTMLElement).focus();
    }, 10);
  });

  document.addEventListener("notas-fechadas", () => {
    overlay.classList.remove("aberto");
    setTimeout(() => overlay.classList.add("hidden"), 300);
  });

  document.addEventListener("notas-carregadas", (e) => {
    const { conteudo } = (e as CustomEvent).detail;
    (editor as HTMLElement).innerHTML = conteudo?.trim() ? conteudo : "<p></p>";
  });

  document.addEventListener("notas-limpas", () => {
    (editor as HTMLElement).innerHTML = "<p></p>";
    (editor as HTMLElement).focus();
  });

  document.addEventListener("notas-exportar-vazio", (e) => {
    alert((e as CustomEvent).detail?.mensagem || "Não há anotações.");
  });

  document.addEventListener("notas-pronta-exportar", (e) => {
    const { conteudo, diaAtual } = (e as CustomEvent).detail;
    _downloadNotasHTML(conteudo, diaAtual);
    alert(`Anotações do dia ${diaAtual} exportadas!`);
  });

  // Persistência
  editor.addEventListener("input", () => {
    orquestrador.salvarConteudo((editor as HTMLElement).innerHTML);
  });
}

function _downloadNotasHTML(conteudo: string, diaAtual: number): void {
  const html = `<!DOCTYPE html>
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
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `anotacoes-dia-${diaAtual}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default { initNotasOverlayUI };
