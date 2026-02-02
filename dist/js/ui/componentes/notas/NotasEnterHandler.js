"use strict";
/* ============================================================================
   NotasEnterHandler.js — HANDLER DE ENTER PARA NOTAS
============================================================================
   Responsabilidade: APENAS lógica de divisão de blocos ao pressionar ENTER
   - Dividir blocos P, H2, H3, LI corretamente
   - Posicionar cursor adequadamente
   - Manter formatação do bloco
   
   NÃO faz: Manipulação de outros eventos, persistência
   Camada: UI (Presentación - Lógica de Edição)
============================================================================ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupEnterHandler = setupEnterHandler;
exports.removeEnterHandler = removeEnterHandler;
/**
 * Configura handler de ENTER para editor de notas
 * Permite quebra de linhas inteligente mantendo tipo de bloco
 * @param {HTMLElement} editor - Elemento editor contenteditable
 * @public
 */
function setupEnterHandler(editor) {
    editor.addEventListener("keydown", handleEnter);
}
/**
 * Handler para tecla ENTER
 * Implementa quebra inteligente de blocos
 * @private
 */
function handleEnter(e) {
    if (e.key !== "Enter")
        return;
    e.preventDefault();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0)
        return;
    const range = sel.getRangeAt(0);
    const startContainer = range.startContainer;
    const startOffset = range.startOffset;
    // Encontra bloco atual (P, H2, H3, LI, DIV)
    let blocoAtual = startContainer;
    while (blocoAtual && blocoAtual !== e.target) {
        if (blocoAtual.nodeType === 1 &&
            ["P", "H2", "H3", "LI", "DIV"].includes(blocoAtual.tagName)) {
            break;
        }
        blocoAtual = blocoAtual.parentNode;
    }
    // Se não encontrou bloco válido, cria parágrafo
    if (!blocoAtual || blocoAtual === e.target) {
        _criarBlocoNovo("P", e.target);
        return;
    }
    const textoBloco = blocoAtual.textContent || "";
    // CASO 1: Cursor no início do bloco
    if (startOffset === 0) {
        _criarBlocoAntes(blocoAtual);
        return;
    }
    // CASO 2: Cursor no final do bloco
    if (startOffset >= textoBloco.length) {
        _criarBlocoDepois(blocoAtual);
        return;
    }
    // CASO 3: Cursor no meio - DIVIDIR BLOCO
    _dividirBloco(blocoAtual, startOffset, sel);
}
/**
 * Cria novo bloco quando editor está vazio
 * @private
 */
function _criarBlocoNovo(tag, editor) {
    const novoBloco = document.createElement(tag);
    editor.appendChild(novoBloco);
    const novoRange = document.createRange();
    novoRange.setStart(novoBloco, 0);
    novoRange.collapse(true);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(novoRange);
}
/**
 * Cria bloco antes do bloco atual (cursor no início)
 * @private
 */
function _criarBlocoAntes(blocoAtual) {
    const novoBloco = document.createElement(blocoAtual.tagName);
    blocoAtual.before(novoBloco);
    const novoRange = document.createRange();
    novoRange.setStart(novoBloco, 0);
    novoRange.collapse(true);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(novoRange);
}
/**
 * Cria bloco depois do bloco atual (cursor no final)
 * @private
 */
function _criarBlocoDepois(blocoAtual) {
    const novoBloco = document.createElement(blocoAtual.tagName);
    blocoAtual.after(novoBloco);
    const novoRange = document.createRange();
    novoRange.setStart(novoBloco, 0);
    novoRange.collapse(true);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(novoRange);
}
/**
 * Divide bloco em dois mantendo formatação
 * @private
 */
function _dividirBloco(blocoAtual, startOffset, sel) {
    const textoBloco = blocoAtual.textContent || "";
    const textoAntes = textoBloco.substring(0, startOffset);
    const textoDepois = textoBloco.substring(startOffset);
    // Atualiza bloco atual com texto antes
    blocoAtual.textContent = textoAntes;
    // Cria novo bloco com texto depois
    const novoBloco = document.createElement(blocoAtual.tagName);
    novoBloco.textContent = textoDepois;
    blocoAtual.after(novoBloco);
    // Move cursor para início do novo bloco
    const novoRange = document.createRange();
    novoRange.setStart(novoBloco, 0);
    novoRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(novoRange);
}
/**
 * Remove handler de ENTER
 * Útil para cleanup
 * @public
 */
function removeEnterHandler(editor) {
    editor.removeEventListener("keydown", handleEnter);
}
