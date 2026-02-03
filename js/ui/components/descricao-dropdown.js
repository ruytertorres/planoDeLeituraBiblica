/* ============================================================================
   descricao-dropdown.js - Toggle functionality for #descricao section
   ============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('btn-descricao-toggle');
  const conteudo = document.getElementById('descricao-conteudo');
  const icon = document.getElementById('descricao-icon');

  if (!toggleBtn || !conteudo || !icon) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    
    toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
    
    if (isExpanded) {
      conteudo.classList.add('hidden');
      icon.classList.remove('rotate-180');
    } else {
      conteudo.classList.remove('hidden');
      icon.classList.add('rotate-180');
    }
  });
});
