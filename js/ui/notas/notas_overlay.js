/* ============================================================================
   notas_overlay.js — UI do Bloco de Anotações
   Versão: 0.1 (visual)
============================================================================ */

export function initNotasOverlay(notasManager) {
  const botao = document.getElementById("btn-notas");
  const overlay = document.getElementById("notas-overlay");
  const editor = document.getElementById("notas-editor");
  const btnFechar = document.getElementById("btn-fechar");
  const btnLimpar = document.getElementById("btn-limpar");

  if (!botao || !overlay || !editor) {
    console.warn("Bloco de notas não encontrado no DOM.");
    return;
  }

  /* Restaurar conteúdo salvo */
  editor.innerHTML = notasManager.getConteudo();

  /* Abrir / fechar */
  botao.addEventListener("click", () => {
    overlay.classList.toggle("aberto");
  });

  btnFechar?.addEventListener("click", () => {
    overlay.classList.remove("aberto");
  });

  /* Persistência */
  editor.addEventListener("input", () => {
    notasManager.setConteudo(editor.innerHTML);
  });

  /* Limpar */
  btnLimpar?.addEventListener("click", () => {
    const ok = confirm("Deseja apagar todas as anotações?");
    if (!ok) return;

    editor.innerHTML = "";
    notasManager.limpar();
  });
}
