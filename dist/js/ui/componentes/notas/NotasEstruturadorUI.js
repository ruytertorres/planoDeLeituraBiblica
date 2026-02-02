"use strict";
/* ============================================================================
   NotasEstruturadorUI.js — ESTRUTURA DE CONTEÚDO
============================================================================
   Responsabilidade: APENAS aplicar estrutura (headings, listas, limpeza)
   - Cabeçalhos (H2, H3)
   - Listas (UL, OL)
   - Limpar formatação
   
   NÃO faz: Formatação (bold, italic), histórico
   Camada: UI
============================================================================ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotasEstruturadorUI = void 0;
const NotasSelecaoManager_js_1 = require("../../../core/services/notas/NotasSelecaoManager.js");
/**
 * Aplicar estrutura de conteúdo
 */
class NotasEstruturadorUI {
    constructor(editor, historicoManager) {
        this.editor = editor;
        this.historicoManager = historicoManager;
    }
    /**
     * Toggler para H2
     * @public
     */
    toggleCabecalhoH2() {
        this.toggleBlockFormat("h2");
    }
    /**
     * Toggler para H3
     * @public
     */
    toggleCabecalhoH3() {
        this.toggleBlockFormat("h3");
    }
    /**
     * Toggler para lista (UL)
     * @public
     */
    toggleListaNaoOrdenada() {
        this.editor.focus();
        document.execCommand("insertUnorderedList", false, null);
        if (this.historicoManager) {
            setTimeout(() => {
                this.historicoManager.salvar(this.editor.innerHTML);
            }, 10);
        }
    }
    /**
     * Toggler para lista (OL)
     * @public
     */
    toggleListaOrdenada() {
        this.editor.focus();
        document.execCommand("insertOrderedList", false, null);
        if (this.historicoManager) {
            setTimeout(() => {
                this.historicoManager.salvar(this.editor.innerHTML);
            }, 10);
        }
    }
    /**
     * Limpa toda formatação inline do bloco selecionado
     * Preserva estrutura (h2, ul, etc)
     * @public
     */
    limparFormatacaoInline() {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0)
            return;
        // Salva seleção
        const selecaoSalva = NotasSelecaoManager_js_1.NotasSelecaoManager.salvar(this.editor);
        this.editor.focus();
        // Remove formatações inline
        document.execCommand("removeFormat", false, null);
        // Tenta restaurar
        try {
            NotasSelecaoManager_js_1.NotasSelecaoManager.restaurar(selecaoSalva);
        }
        catch (e) {
            console.warn("Falha ao restaurar seleção");
        }
        // Salva no histórico
        if (this.historicoManager) {
            setTimeout(() => {
                this.historicoManager.salvar(this.editor.innerHTML);
            }, 10);
        }
    }
    /**
     * Limpa TODA formatação (inline + estrutura)
     * Retorna só texto limpo
     * @public
     */
    limparFormatacaoCompleta() {
        this.editor.focus();
        document.execCommand("removeFormat", false, null); // Remove formatações inline
        document.execCommand("removeFormat", false, null); // Chama duas vezes para garantir
        // Remove estrutura de blocos (h2, h3, ul, ol)
        this.removerEstrutura();
        // Salva histórico
        if (this.historicoManager) {
            setTimeout(() => {
                this.historicoManager.salvar(this.editor.innerHTML);
            }, 10);
        }
    }
    /**
     * Toggler genérico para block elements
     * @private
     */
    toggleBlockFormat(formatTag) {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0)
            return;
        const range = sel.getRangeAt(0);
        const bloco = this.encontrarBlocoComTag(range.commonAncestorContainer, formatTag);
        this.editor.focus();
        if (bloco) {
            // Já tem tag, remove
            document.execCommand("formatBlock", false, `<div>`);
        }
        else {
            // Não tem, adiciona
            document.execCommand("formatBlock", false, `<${formatTag}>`);
        }
        // Salva
        if (this.historicoManager) {
            setTimeout(() => {
                this.historicoManager.salvar(this.editor.innerHTML);
            }, 10);
        }
    }
    /**
     * Encontra bloco (div, h2, h3, ul, ol) contendo o cursor
     * @private
     */
    encontrarBlocoComTag(node, tag) {
        let current = node;
        while (current && current !== this.editor) {
            if (current.tagName?.toLowerCase() === tag.toLowerCase()) {
                return current;
            }
            current = current.parentNode;
        }
        return null;
    }
    /**
     * Remove todas tags de estrutura (h2, h3, ul, ol)
     * Deixa conteúdo em divs
     * @private
     */
    removerEstrutura() {
        const tagsDeLista = ["UL", "OL"];
        const tagsDeCabecalho = ["H1", "H2", "H3", "H4", "H5", "H6"];
        this.editor.focus();
        // 1. Remover todas as listas (UL e OL) e converter LIs em parágrafos
        tagsDeLista.forEach((listTag) => {
            const listas = Array.from(this.editor.querySelectorAll(listTag));
            listas.forEach((lista) => {
                const itensDeLista = Array.from(lista.querySelectorAll("LI"));
                itensDeLista.forEach((item) => {
                    const p = document.createElement("p");
                    p.innerHTML = item.innerHTML; // Preserva formatação inline dentro do LI
                    lista.parentNode.insertBefore(p, lista); // Insere o parágrafo antes da lista
                });
                lista.remove(); // Remove a lista completa (UL ou OL)
            });
        });
        // 2. Converte todos os blocos restantes para <p>
        // Isso também pega o conteúdo que estava em Hx ou DIVs genéricas
        let currentNode = this.editor.firstChild;
        while (currentNode) {
            // Pular nós de texto que não são filhos diretos de blocos
            if (currentNode.nodeType === Node.TEXT_NODE &&
                currentNode.textContent.trim() === "") {
                currentNode = currentNode.nextSibling;
                continue;
            }
            const nextNode = currentNode.nextSibling;
            if (currentNode.nodeType === Node.ELEMENT_NODE) {
                const tagName = currentNode.tagName.toUpperCase();
                // Se for um bloco diferente de P, ou um P com estilos indesejados, converte
                if (tagName !== "P" || currentNode.style.cssText) {
                    const p = document.createElement("p");
                    p.innerHTML = currentNode.innerHTML;
                    currentNode.replaceWith(p);
                }
            }
            currentNode = nextNode;
        }
        // 3. Remover tags de cabeçalho residuais (se a conversão acima não pegou tudo)
        tagsDeCabecalho.forEach((tag) => {
            const elementos = Array.from(this.editor.querySelectorAll(tag));
            elementos.forEach((el) => {
                const p = document.createElement("p");
                p.innerHTML = el.innerHTML;
                el.replaceWith(p);
            });
        });
        // 4. Limpeza final: remover divs vazias que podem ter sobrado
        const emptyDivs = Array.from(this.editor.querySelectorAll("div:empty"));
        emptyDivs.forEach((div) => div.remove());
    }
    /**
     * Verifica se bloco está em H2
     * @returns {boolean}
     * @public
     */
    estaH2() {
        return this.estaEmTag("H2");
    }
    /**
     * Verifica se bloco está em H3
     * @returns {boolean}
     * @public
     */
    estaH3() {
        return this.estaEmTag("H3");
    }
    /**
     * Verifica se bloco está em UL
     * @returns {boolean}
     * @public
     */
    estaEmListaNaoOrdenada() {
        return this.estaEmTag("UL");
    }
    /**
     * Verifica se bloco está em OL
     * @returns {boolean}
     * @public
     */
    estaEmListaOrdenada() {
        return this.estaEmTag("OL");
    }
    /**
     * Verifica se cursor está dentro de tag específica
     * @private
     */
    estaEmTag(tagName) {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0)
            return false;
        let node = sel.anchorNode;
        while (node && node !== this.editor) {
            if (node.tagName?.toUpperCase() === tagName.toUpperCase()) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }
}
exports.NotasEstruturadorUI = NotasEstruturadorUI;
