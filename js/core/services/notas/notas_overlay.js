/* ============================================================================
   notas_overlay.js — COM ENTER FUNCIONAL E ATALHOS
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
     CRIAR TOOLBAR COMPLETA COM ÍCONES EMULADOS
  ------------------------------------------------------------------------ */
  function criarToolbar() {
    const toolbar = document.querySelector(".notas-toolbar");
    if (!toolbar) return;

    // Botões de formatação básica COM ÍCONES EMULADOS
    const botoes = [
      {
        action: "bold",
        title: "Negrito (Ctrl+B)",
        icon: "B",
      },
      {
        action: "italic",
        title: "Itálico (Ctrl+I)",
        icon: "I",
      },
      {
        action: "underline",
        title: "Sublinhado (Ctrl+U)",
        icon: "U",
      },
      { action: "separator" },
      {
        action: "h2",
        title: "Cabeçalho 2",
        icon: "H2",
      },
      {
        action: "h3",
        title: "Cabeçalho 3",
        icon: "H3",
      },
      { action: "separator" },
      {
        action: "highlight",
        title: "Marcador de Texto",
        isDropdown: true,
        icon: "🖍",
      },
      { action: "separator" },
      {
        action: "ul",
        title: "Lista",
        icon: "• | Lista",
      },
      { action: "separator" },
      {
        action: "clear",
        title: "Limpar Formatação",
        icon: "🧹",
      },
    ];

    toolbar.innerHTML = "";

    botoes.forEach((btn) => {
      if (btn.action === "separator") {
        const separator = document.createElement("span");
        separator.className = "toolbar-separator";
        separator.innerHTML = "|";
        toolbar.appendChild(separator);
      } else if (btn.isDropdown) {
        // Criar dropdown para cores do marca-texto
        const dropdownContainer = document.createElement("div");
        dropdownContainer.className = "highlight-dropdown";

        const mainButton = document.createElement("button");
        mainButton.type = "button";
        mainButton.dataset.notaAction = btn.action;
        mainButton.title = btn.title || btn.action;
        mainButton.className = "highlight-btn";
        mainButton.textContent = btn.icon || "🖍";
        dropdownContainer.appendChild(mainButton);

        // Menu de cores oculto
        const colorsMenu = document.createElement("div");
        colorsMenu.className = "highlight-colors";

        const colors = [
          { value: "yellow", label: "Amarelo", icon: "🟡" },
          { value: "#a8e6cf", label: "Verde", icon: "🟢" },
          { value: "#ffd3b6", label: "Laranja", icon: "🟠" },
        ];

        colors.forEach((color) => {
          const colorButton = document.createElement("button");
          colorButton.type = "button";
          colorButton.dataset.notaAction = "highlight";
          colorButton.dataset.value = color.value;
          colorButton.title = `Marcador ${color.label}`;

          const colorSwatch = document.createElement("span");
          colorSwatch.className = "color-swatch";
          colorSwatch.style.backgroundColor = color.value;

          colorButton.appendChild(colorSwatch);
          colorsMenu.appendChild(colorButton);
        });

        dropdownContainer.appendChild(colorsMenu);
        toolbar.appendChild(dropdownContainer);
      } else {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.notaAction = btn.action;
        button.title = btn.title || btn.action;
        button.className = "toolbar-btn";
        button.textContent = btn.icon || btn.action;

        toolbar.appendChild(button);
      }
    });

    // REMOVER o estilo inline pois já temos no CSS
    // Os ícones serão emulados pelo CSS via ::before
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
     Inicialização da Toolbar Completa
  ------------------------------------------------------------------------ */
  criarToolbar();
  initNotasToolbar(editor);

  /* ------------------------------------------------------------------------
     SINCRONIZAÇÃO COM DIA ATUAL
  ------------------------------------------------------------------------ */
  function carregarNotasDoDia() {
    const conteudo = notasManager.getConteudo();
    editor.innerHTML = conteudo && conteudo.trim() ? conteudo : "<p></p>";
  }

  document.addEventListener("dia-alterado", carregarNotasDoDia);

  /* ------------------------------------------------------------------------
     Eventos de Abertura / Fechamento
  ------------------------------------------------------------------------ */
  botaoAbrir.addEventListener("click", alternarNotas);

  if (btnFechar) {
    btnFechar.addEventListener("click", fecharNotas);
  }

  /* ------------------------------------------------------------------------
     ATALHOS DE TECLADO GLOBAIS
  ------------------------------------------------------------------------ */
  document.addEventListener("keydown", (e) => {
    // ESC fecha as notas
    if (e.key === "Escape" && notasAbertas()) {
      e.preventDefault();
      fecharNotas();
      return;
    }

    // Ctrl+Alt+N abre/fecha as notas
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "n") {
      e.preventDefault();
      alternarNotas();
    }

    // Ctrl+E exporta notas
    if (e.ctrlKey && e.key.toLowerCase() === "e" && notasAbertas()) {
      e.preventDefault();
      exportarNotas();
    }
  });

  /* ------------------------------------------------------------------------
     ATALHOS DE TECLADO NO EDITOR
  ------------------------------------------------------------------------ */
  editor.addEventListener("keydown", (e) => {
    // Atalhos de formatação
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case "b": // Ctrl+B - Negrito
          e.preventDefault();
          document.querySelector('[data-nota-action="bold"]')?.click();
          break;
        case "i": // Ctrl+I - Itálico
          e.preventDefault();
          document.querySelector('[data-nota-action="italic"]')?.click();
          break;
        case "u": // Ctrl+U - Sublinhado
          e.preventDefault();
          document.querySelector('[data-nota-action="underline"]')?.click();
          break;
        case "2": // Ctrl+2 - Cabeçalho 2
          e.preventDefault();
          document.querySelector('[data-nota-action="h2"]')?.click();
          break;
        case "3": // Ctrl+3 - Cabeçalho 3
          e.preventDefault();
          document.querySelector('[data-nota-action="h3"]')?.click();
          break;
        case "l": // Ctrl+L - Lista
          e.preventDefault();
          document.querySelector('[data-nota-action="ul"]')?.click();
          break;
        case " ": // Ctrl+Espaço - Limpar formatação
          e.preventDefault();
          document.querySelector('[data-nota-action="clear"]')?.click();
          break;
      }
    }

    // Atalhos com Alt
    if (e.altKey) {
      switch (e.key) {
        case "1": // Alt+1 - Marcador amarelo
          e.preventDefault();
          document
            .querySelector(
              '[data-nota-action="highlight"][data-value="yellow"]',
            )
            ?.click();
          break;
        case "2": // Alt+2 - Marcador verde
          e.preventDefault();
          document
            .querySelector(
              '[data-nota-action="highlight"][data-value="#a8e6cf"]',
            )
            ?.click();
          break;
        case "3": // Alt+3 - Marcador laranja
          e.preventDefault();
          document
            .querySelector(
              '[data-nota-action="highlight"][data-value="#ffd3b6"]',
            )
            ?.click();
          break;
      }
    }

    // ENTER FUNCIONAL (mantido do seu código)
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
     Persistência das anotações
  ------------------------------------------------------------------------ */
  editor.addEventListener("input", () => {
    notasManager.setConteudo(editor.innerHTML);
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
     Exportação de Notas
  ------------------------------------------------------------------------ */
  function exportarNotas() {
    const conteudo = notasManager.getConteudo();
    if (!conteudo || conteudo.trim() === "" || conteudo === "<p></p>") {
      alert("Não há anotações para exportar.");
      return;
    }

    // Criar um blob com o conteúdo HTML
    const blob = new Blob(
      [
        `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Anotações - Dia ${notasManager.diaAtual}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
        h2, h3 { color: #333; }
        .highlight-yellow { background-color: yellow; }
        .highlight-green { background-color: #a8e6cf; }
        .highlight-orange { background-color: #ffd3b6; }
    </style>
</head>
<body>
    <h1>Anotações - Dia ${notasManager.diaAtual}</h1>
    <div>${conteudo}</div>
</body>
</html>`,
      ],
      { type: "text/html" },
    );

    // Criar link de download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `anotacoes-dia-${notasManager.diaAtual}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert(`Anotações do dia ${notasManager.diaAtual} exportadas com sucesso!`);
  }

  const btnExportar = document.getElementById("btn-exportar");
  if (btnExportar) {
    btnExportar.addEventListener("click", exportarNotas);
  }

  /* ------------------------------------------------------------------------
     Adicionar ícones aos botões da toolbar via CSS
     (Os ícones já estão sendo emulados pelo CSS via ::before)
  ------------------------------------------------------------------------ */
  console.log("Bloco de notas inicializado com atalhos de teclado");
}
