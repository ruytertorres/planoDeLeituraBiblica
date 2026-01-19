/* ============================================================================
   notas_overlay.js — Notas vinculadas ao Dia Atual
   Versão: 1.0 — ETAPA 3.4
============================================================================ */

import { initNotasToolbar } from "./notas_toolbar.js";

export function initNotasOverlay(notasManager) {
  /* ------------------------------------------------------------------------
     Cache de elementos de UI
  ------------------------------------------------------------------------ */
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

  /* ------------------------------------------------------------------------
     Helpers de estado visual
  ------------------------------------------------------------------------ */
  const abrirNotas = () => {
    overlay.classList.remove("hidden");
    setTimeout(() => {
      overlay.classList.add("aberto");
      editor.focus();
    }, 10);
  };

  const fecharNotas = () => {
    overlay.classList.remove("aberto");
    setTimeout(() => overlay.classList.add("hidden"), 300);
  };

  const alternarNotas = () => {
    overlay.classList.contains("aberto") ? fecharNotas() : abrirNotas();
  };

  /* ------------------------------------------------------------------------
     Inicialização da Toolbar (isolada da lógica de estado)
  ------------------------------------------------------------------------ */
  initNotasToolbar(editor);

  /* ------------------------------------------------------------------------
     SINCRONIZAÇÃO COM DIA ATUAL
     ------------------------------------------------------------------------
     - main.js decide qual é o dia ativo
     - este módulo apenas reage ao evento "dia-alterado"
  ------------------------------------------------------------------------ */
  function carregarNotasDoDia() {
    const conteudo = notasManager.getConteudo();
    editor.innerHTML = conteudo && conteudo.trim() ? conteudo : "<p></p>";
  }

  document.addEventListener("dia-alterado", carregarNotasDoDia);

  /* ------------------------------------------------------------------------
     Persistência automática — SEMPRE vinculada ao dia atual
  ------------------------------------------------------------------------ */
  editor.addEventListener("input", () => {
    notasManager.setConteudo(editor.innerHTML);
  });

  /* ------------------------------------------------------------------------
     ENTER FUNCIONAL
     ------------------------------------------------------------------------
     - Comportamento previsível
     - Sem dependência de plano ou dia
     - Apenas manipulação estrutural do editor
  ------------------------------------------------------------------------ */
  editor.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    let bloco = range.startContainer;

    // Encontrar o bloco pai válido
    while (bloco && bloco !== editor) {
      if (
        bloco.nodeType === 1 &&
        ["P", "H2", "H3", "LI", "DIV"].includes(bloco.tagName)
      ) {
        break;
      }
      bloco = bloco.parentNode;
    }

    // Fallback: cria novo parágrafo
    if (!bloco || bloco === editor) {
      const p = document.createElement("p");
      editor.appendChild(p);

      const r = document.createRange();
      r.setStart(p, 0);
      r.collapse(true);
      sel.removeAllRanges();
      sel.addRange(r);
      return;
    }

    const texto = bloco.textContent || "";
    const offset = range.startOffset;

    const antes = texto.slice(0, offset);
    const depois = texto.slice(offset);

    bloco.textContent = antes;

    const novo = document.createElement(bloco.tagName);
    novo.textContent = depois;
    bloco.after(novo);

    const r = document.createRange();
    r.setStart(novo, 0);
    r.collapse(true);
    sel.removeAllRanges();
    sel.addRange(r);
  });

  /* ------------------------------------------------------------------------
     Limpeza das notas DO DIA ATUAL
  ------------------------------------------------------------------------ */
  if (btnLimpar) {
    btnLimpar.addEventListener("click", () => {
      if (!confirm("Deseja apagar as anotações deste dia?")) return;

      notasManager.limpar();
      editor.innerHTML = "<p></p>";
      editor.focus();
    });
  }

  /* ------------------------------------------------------------------------
     Abertura / Fechamento do Overlay
  ------------------------------------------------------------------------ */
  botaoAbrir.addEventListener("click", alternarNotas);
  btnFechar?.addEventListener("click", fecharNotas);

  /* ------------------------------------------------------------------------
     Inicialização explícita
     ------------------------------------------------------------------------
     - Necessária para o primeiro dia carregado
     - Evita editor vazio ou fora de sincronia
  ------------------------------------------------------------------------ */
  carregarNotasDoDia();
}
