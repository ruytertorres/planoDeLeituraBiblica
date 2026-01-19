/* ============================================================================
   notas_overlay.js — COM ENTER FUNCIONAL
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
    setTimeout(() => {
      overlay.classList.add("hidden");
    }, 300);
  };

  const alternarNotas = () => {
    if (overlay.classList.contains("aberto")) {
      fecharNotas();
    } else {
      abrirNotas();
    }
  };

  const notasAbertas = () => overlay.classList.contains("aberto");

  /* ------------------------------------------------------------------------
     Inicialização do conteúdo
  ------------------------------------------------------------------------ */
  const conteudoSalvo = notasManager.getConteudo();
  editor.innerHTML =
    conteudoSalvo && conteudoSalvo.trim() ? conteudoSalvo : "<p></p>";

  /* ------------------------------------------------------------------------
     Inicialização da Toolbar
  ------------------------------------------------------------------------ */
  initNotasToolbar(editor);

  /* ------------------------------------------------------------------------
     Eventos de Abertura / Fechamento
  ------------------------------------------------------------------------ */
  botaoAbrir.addEventListener("click", alternarNotas);

  if (btnFechar) {
    btnFechar.addEventListener("click", fecharNotas);
  }

  /* ------------------------------------------------------------------------
     Atalhos de teclado
  ------------------------------------------------------------------------ */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && notasAbertas()) {
      e.preventDefault();
      fecharNotas();
      return;
    }

    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "n") {
      e.preventDefault();
      alternarNotas();
    }
  });

  /* ------------------------------------------------------------------------
     Persistência das anotações
  ------------------------------------------------------------------------ */
  editor.addEventListener("input", () => {
    notasManager.setConteudo(editor.innerHTML);
  });

  /* ------------------------------------------------------------------------
     ENTER FUNCIONAL - CORRIGIDO
  ------------------------------------------------------------------------ */
  editor.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    const startContainer = range.startContainer;
    const startOffset = range.startOffset;

    // Encontra o bloco atual (P, H2, H3, LI)
    let blocoAtual = startContainer;
    while (blocoAtual && blocoAtual !== editor) {
      if (
        blocoAtual.nodeType === 1 &&
        ["P", "H2", "H3", "LI", "DIV"].includes(blocoAtual.tagName)
      ) {
        break;
      }
      blocoAtual = blocoAtual.parentNode;
    }

    if (!blocoAtual || blocoAtual === editor) {
      // Se não encontrou bloco válido, cria um parágrafo
      const p = document.createElement("p");
      editor.appendChild(p);

      const novoRange = document.createRange();
      novoRange.setStart(p, 0);
      novoRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(novoRange);
      return;
    }

    // Se o cursor está no início do bloco
    if (startOffset === 0) {
      const novoBloco = document.createElement(blocoAtual.tagName);
      blocoAtual.before(novoBloco);

      const novoRange = document.createRange();
      novoRange.setStart(novoBloco, 0);
      novoRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(novoRange);
      return;
    }

    // Se o cursor está no final do bloco
    const textoBloco = blocoAtual.textContent || "";
    if (startOffset >= textoBloco.length) {
      const novoBloco = document.createElement(blocoAtual.tagName);
      blocoAtual.after(novoBloco);

      const novoRange = document.createRange();
      novoRange.setStart(novoBloco, 0);
      novoRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(novoRange);
      return;
    }

    // Se o cursor está no meio do bloco - DIVIDE
    const textoAntes = textoBloco.substring(0, startOffset);
    const textoDepois = textoBloco.substring(startOffset);

    // Atualiza o bloco atual
    blocoAtual.textContent = textoAntes;

    // Cria novo bloco
    const novoBloco = document.createElement(blocoAtual.tagName);
    novoBloco.textContent = textoDepois;
    blocoAtual.after(novoBloco);

    // Move cursor para início do novo bloco
    const novoRange = document.createRange();
    novoRange.setStart(novoBloco, 0);
    novoRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(novoRange);
  });

  /* ------------------------------------------------------------------------
     Limpeza manual
  ------------------------------------------------------------------------ */
  if (btnLimpar) {
    btnLimpar.addEventListener("click", () => {
      const confirmar = confirm("Deseja apagar todas as anotações?");
      if (!confirmar) return;

      editor.innerHTML = "<p></p>";
      notasManager.limpar();
      editor.focus();
    });
  }

  /* ------------------------------------------------------------------------
     Exportação
  ------------------------------------------------------------------------ */
  const btnExportar = document.getElementById("btn-exportar");
  if (btnExportar) {
    btnExportar.addEventListener("click", () => {
      alert("Funcionalidade de exportação será implementada em breve!");
    });
  }
}
