/* ============================================================================
   notas_toolbar.js — COM HISTÓRICO MANUAL PARA UNDO
============================================================================ */

export function initNotasToolbar(editor) {
  if (!editor) return;

  console.log("Toolbar inicializada para editor:", editor);

  /* ------------------------------------------------------------------------
     HISTÓRICO PARA UNDO/REDO
  ------------------------------------------------------------------------ */
  let historico = [editor.innerHTML];
  let historicoIndex = 0;
  let salvandoHistorico = false;

  function salvarNoHistorico() {
    if (salvandoHistorico) return;

    const htmlAtual = editor.innerHTML;
    const ultimoEstado = historico[historicoIndex];

    // Só salva se houve mudança
    if (htmlAtual === ultimoEstado) return;

    // Remove estados futuros se estamos no meio do histórico
    if (historicoIndex < historico.length - 1) {
      historico = historico.slice(0, historicoIndex + 1);
    }

    // Adiciona novo estado
    historico.push(htmlAtual);
    historicoIndex++;

    // Limita o histórico a 50 estados
    if (historico.length > 50) {
      historico.shift();
      historicoIndex--;
    }

    console.log(`Histórico: ${historicoIndex + 1}/${historico.length} estados`);
  }

  function undo() {
    if (historicoIndex > 0) {
      salvandoHistorico = true;
      historicoIndex--;
      editor.innerHTML = historico[historicoIndex];
      salvandoHistorico = false;

      // Mantém o foco no editor
      editor.focus();
      console.log(`Undo para estado ${historicoIndex + 1}/${historico.length}`);
    }
  }

  function redo() {
    if (historicoIndex < historico.length - 1) {
      salvandoHistorico = true;
      historicoIndex++;
      editor.innerHTML = historico[historicoIndex];
      salvandoHistorico = false;

      editor.focus();
      console.log(`Redo para estado ${historicoIndex + 1}/${historico.length}`);
    }
  }

  // Salva no histórico periodicamente
  editor.addEventListener("input", () => {
    setTimeout(() => salvarNoHistorico(), 100);
  });

  /* ------------------------------------------------------------------------
     DEFINIÇÃO DAS FUNÇÕES
  ------------------------------------------------------------------------ */

  // Utilitários para salvar/restaurar seleção
  function salvarSelecao() {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      return {
        range: sel.getRangeAt(0).cloneRange(),
        texto: sel.toString(),
      };
    }
    return null;
  }

  function restaurarSelecao(selecaoSalva) {
    if (!selecaoSalva || !selecaoSalva.range) return;

    const sel = window.getSelection();
    sel.removeAllRanges();

    try {
      sel.addRange(selecaoSalva.range);
    } catch (e) {
      // Se falhar, tenta restaurar por texto
      const texto = selecaoSalva.texto;
      if (texto) {
        const range = document.createRange();
        const textNodes = getTextNodes(editor);

        for (const node of textNodes) {
          const index = node.textContent.indexOf(texto);
          if (index !== -1) {
            range.setStart(node, index);
            range.setEnd(node, index + texto.length);
            sel.addRange(range);
            break;
          }
        }
      }
    }
  }

  function getTextNodes(element) {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null,
      false,
    );

    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }
    return textNodes;
  }

  // Função para obter bloco contendo cursor
  function getBlocoContendoCursor() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;

    let node = sel.anchorNode;
    while (node && node !== editor) {
      if (
        node.nodeType === 1 &&
        ["P", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "DIV", "SPAN"].includes(
          node.tagName,
        )
      ) {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  }

  /* ------------------------------------------------------------------------
     FUNÇÕES DE FORMATAÇÃO COM SELEÇÃO PRESERVADA
  ------------------------------------------------------------------------ */
  function aplicarFormatoComHistorico(acao, valor = null) {
    // Salva estado atual antes da formatação
    salvarNoHistorico();

    const selecaoSalva = salvarSelecao();
    if (!selecaoSalva || !selecaoSalva.range) {
      console.log("Nenhuma seleção para formatar");
      return;
    }

    editor.focus();

    // Executa o comando de formatação
    if (valor) {
      document.execCommand(acao, false, valor);
    } else {
      document.execCommand(acao, false, null);
    }

    // Tenta restaurar a seleção
    setTimeout(() => {
      restaurarSelecao(selecaoSalva);
      // Salva novo estado após formatação
      setTimeout(() => salvarNoHistorico(), 50);
    }, 10);
  }

  function toggleFormato(formato) {
    aplicarFormatoComHistorico(formato);
  }

  function toggleHighlight(cor = "yellow") {
    aplicarFormatoComHistorico("backColor", cor);
  }

  function toggleCabecalho(tag) {
    salvarNoHistorico(); // Salva antes da mudança

    const bloco = getBlocoContendoCursor();
    if (!bloco) return;

    const selecaoSalva = salvarSelecao();
    editor.focus();

    if (bloco.tagName === tag.toUpperCase()) {
      // Converte para parágrafo
      const p = document.createElement("p");
      p.innerHTML = bloco.innerHTML;
      bloco.replaceWith(p);

      // Tenta manter a seleção
      setTimeout(() => {
        if (selecaoSalva) {
          restaurarSelecao(selecaoSalva);
        } else {
          const range = document.createRange();
          range.selectNodeContents(p);
          range.collapse(false);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
        salvarNoHistorico(); // Salva após a mudança
      }, 10);
    } else {
      // Converte para cabeçalho
      const novoCabecalho = document.createElement(tag);
      novoCabecalho.innerHTML = bloco.innerHTML;
      bloco.replaceWith(novoCabecalho);

      setTimeout(() => {
        if (selecaoSalva) {
          restaurarSelecao(selecaoSalva);
        } else {
          const range = document.createRange();
          range.selectNodeContents(novoCabecalho);
          range.collapse(false);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
        salvarNoHistorico();
      }, 10);
    }
  }

  function toggleLista() {
    salvarNoHistorico();

    const bloco = getBlocoContendoCursor();
    if (!bloco) return;

    const selecaoSalva = salvarSelecao();
    editor.focus();

    if (bloco.tagName === "LI") {
      // Converte para parágrafo
      const lista = bloco.parentNode;
      const p = document.createElement("p");
      p.innerHTML = bloco.innerHTML;

      if (lista.children.length === 1) {
        lista.replaceWith(p);
      } else {
        bloco.remove();
        lista.parentNode.insertBefore(p, lista);
      }

      setTimeout(() => {
        if (selecaoSalva) {
          restaurarSelecao(selecaoSalva);
        }
        salvarNoHistorico();
      }, 10);
    } else {
      // Converte para lista
      const ul = document.createElement("ul");
      const li = document.createElement("li");
      li.innerHTML = bloco.innerHTML;
      ul.appendChild(li);
      bloco.replaceWith(ul);

      setTimeout(() => {
        if (selecaoSalva) {
          restaurarSelecao(selecaoSalva);
        }
        salvarNoHistorico();
      }, 10);
    }
  }

  /* ------------------------------------------------------------------------
     FUNÇÃO LIMPAR FORMATACAO MELHORADA
  ------------------------------------------------------------------------ */
  function limparFormatacao() {
    salvarNoHistorico(); // Salva antes de limpar

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const selecaoSalva = salvarSelecao();
    editor.focus();

    // Se não há seleção (cursor piscando)
    if (sel.isCollapsed) {
      const bloco = getBlocoContendoCursor();
      if (bloco) {
        const texto = bloco.textContent;
        const tagOriginal = bloco.tagName;

        // Cria um elemento limpo
        let novoElemento;
        if (tagOriginal === "LI") {
          novoElemento = document.createElement("p");
          const lista = bloco.parentNode;
          if (lista && (lista.tagName === "UL" || lista.tagName === "OL")) {
            lista.replaceChild(novoElemento, bloco);
            if (lista.children.length === 0) {
              lista.parentNode.removeChild(lista);
            }
          }
        } else if (tagOriginal === "H2" || tagOriginal === "H3") {
          novoElemento = document.createElement("p");
          bloco.replaceWith(novoElemento);
        } else {
          novoElemento = document.createElement("p");
          bloco.replaceWith(novoElemento);
        }

        novoElemento.textContent = texto;

        // Move cursor para o novo elemento
        const range = document.createRange();
        range.selectNodeContents(novoElemento);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);

        // Salva após limpar
        setTimeout(() => salvarNoHistorico(), 10);
      }
      return;
    }

    // Se há texto selecionado
    const range = sel.getRangeAt(0);
    const textoSelecionado = range.toString();

    // Remove formatação usando execCommand
    document.execCommand("removeFormat", false, null);

    // Se ainda houver tags de formatação, remove manualmente
    const fragment = range.cloneContents();
    const divTemp = document.createElement("div");
    divTemp.appendChild(fragment);

    // Remove tags de formatação
    const tagsParaRemover = [
      "b",
      "strong",
      "i",
      "em",
      "u",
      "ins",
      "span",
      "mark",
      "font",
    ];
    tagsParaRemover.forEach((tag) => {
      const elementos = divTemp.getElementsByTagName(tag);
      while (elementos[0]) {
        const parent = elementos[0].parentNode;
        while (elementos[0].firstChild) {
          parent.insertBefore(elementos[0].firstChild, elementos[0]);
        }
        parent.removeChild(elementos[0]);
      }
    });

    // Remove estilos
    const elementosComEstilo = divTemp.querySelectorAll("[style]");
    elementosComEstilo.forEach((el) => el.removeAttribute("style"));

    // Converte cabeçalhos e listas para span temporário
    const elementosBloco = divTemp.querySelectorAll(
      "h1, h2, h3, h4, h5, h6, li",
    );
    elementosBloco.forEach((el) => {
      const span = document.createElement("span");
      span.textContent = el.textContent;
      el.parentNode.replaceChild(span, el);
    });

    // Substitui o conteúdo
    range.deleteContents();

    // Insere o conteúdo limpo
    const childNodes = Array.from(divTemp.childNodes);
    childNodes.forEach((node) => {
      range.insertNode(node.cloneNode(true));
    });

    // Foca no texto limpo
    editor.focus();

    // Salva estado após limpeza
    setTimeout(() => salvarNoHistorico(), 10);
  }

  /* ------------------------------------------------------------------------
     EVENTOS DA TOOLBAR
  ------------------------------------------------------------------------ */
  document.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-nota-action]");
    if (!btn) return;

    e.preventDefault();

    const action = btn.dataset.notaAction;
    const value = btn.dataset.value;

    console.log("Toolbar action:", action, value);

    editor.focus();

    switch (action) {
      case "bold":
        toggleFormato("bold");
        break;
      case "italic":
        toggleFormato("italic");
        break;
      case "underline":
        toggleFormato("underline");
        break;
      case "highlight":
        toggleHighlight(value || "yellow");
        break;
      case "h2":
        toggleCabecalho("h2");
        break;
      case "h3":
        toggleCabecalho("h3");
        break;
      case "ul":
        toggleLista();
        break;
      case "clear":
        limparFormatacao();
        break;
    }
  });

  /* ------------------------------------------------------------------------
     UNDO/REDO COM TECLADO
  ------------------------------------------------------------------------ */
  editor.addEventListener("keydown", function (e) {
    // CTRL+Z - Undo
    if ((e.ctrlKey || e.metaKey) && e.key === "z") {
      e.preventDefault();
      undo();
      return;
    }

    // CTRL+Y ou CTRL+SHIFT+Z - Redo
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === "y" || (e.shiftKey && e.key === "Z"))
    ) {
      e.preventDefault();
      redo();
      return;
    }

    // Para teclas normais, salva no histórico após um delay
    if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key.length === 1) {
      setTimeout(() => salvarNoHistorico(), 100);
    }
  });

  /* ------------------------------------------------------------------------
     Estado ativo dos botões
  ------------------------------------------------------------------------ */
  function atualizarEstadoBotoes() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const parent = sel.anchorNode.parentElement;
    const bloco = getBlocoContendoCursor();

    document.querySelectorAll("[data-nota-action]").forEach((btn) => {
      btn.classList.remove("active");
    });

    if (parent) {
      if (
        parent.tagName === "B" ||
        parent.tagName === "STRONG" ||
        parent.style.fontWeight === "bold"
      ) {
        document
          .querySelector('[data-nota-action="bold"]')
          ?.classList.add("active");
      }
      if (
        parent.tagName === "I" ||
        parent.tagName === "EM" ||
        parent.style.fontStyle === "italic"
      ) {
        document
          .querySelector('[data-nota-action="italic"]')
          ?.classList.add("active");
      }
      if (
        parent.tagName === "U" ||
        parent.tagName === "INS" ||
        parent.style.textDecoration === "underline"
      ) {
        document
          .querySelector('[data-nota-action="underline"]')
          ?.classList.add("active");
      }
    }

    if (bloco) {
      if (bloco.tagName === "H2") {
        document
          .querySelector('[data-nota-action="h2"]')
          ?.classList.add("active");
      }
      if (bloco.tagName === "H3") {
        document
          .querySelector('[data-nota-action="h3"]')
          ?.classList.add("active");
      }
      if (bloco.tagName === "LI") {
        document
          .querySelector('[data-nota-action="ul"]')
          ?.classList.add("active");
      }
    }
  }

  editor.addEventListener("mouseup", atualizarEstadoBotoes);
  editor.addEventListener("keyup", atualizarEstadoBotoes);
  editor.addEventListener("click", atualizarEstadoBotoes);

  setTimeout(atualizarEstadoBotoes, 100);

  /* ------------------------------------------------------------------------
     INICIALIZAÇÃO FINAL
  ------------------------------------------------------------------------ */
  console.log("Toolbar inicializada com histórico de undo/redo");
}
