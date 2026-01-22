/* ============================================================================
   ResetProgresso.js — Gerenciador de Reset de Progresso com Modal Dinâmico
   Versão: 1.1.0
   Aplicação: Leitura Bíblica Cronológica

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------
   - Gerenciar a funcionalidade de reset completo do progresso
   - Criar modal dinamicamente (não hardcoded no HTML)
   - Implementar sistema de segurança com confirmação dupla
   - Notificar outras partes do sistema sobre o reset
============================================================================ */

// CORREÇÃO: Exportação correta da classe
export class ResetProgresso {
  constructor(progressoLeitura, planoManager) {
    if (!progressoLeitura || !planoManager) {
      throw new Error("ResetProgresso requer progressoLeitura e planoManager.");
    }

    this.progresso = progressoLeitura;
    this.planoManager = planoManager;
    this.modal = null;
    this.modalCriado = false;
  }

  /* ========================================================================
     INICIALIZAÇÃO
  ======================================================================== */

  inicializar() {
    // 1. Criar botão na navbar (se não existir)
    this.criarBotaoReset();
    
    // 2. Criar modal dinamicamente
    this.criarModalDinamico();
    
    // 3. Configurar eventos
    this.configurarEventos();
    
    console.log("🔄 Sistema de reset inicializado");
  }

  /* ========================================================================
     CRIAÇÃO DINÂMICA DOS ELEMENTOS
  ======================================================================== */

  criarBotaoReset() {
    // Verificar se o botão já existe
    if (document.getElementById("btn-resetar-progresso")) {
      return;
    }

    // Criar botão
    const btnReset = document.createElement("button");
    btnReset.id = "btn-resetar-progresso";
    btnReset.className = "btn-reset";
    btnReset.title = "Resetar progresso";
    btnReset.innerHTML = '<i class="fas fa-redo"></i>';
    
    // Inserir após o botão de tema
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle && themeToggle.parentNode) {
      themeToggle.parentNode.insertBefore(btnReset, themeToggle.nextSibling);
    } else {
      // Fallback: adicionar ao final da navbar-stats
      const navbarStats = document.querySelector(".navbar-stats");
      if (navbarStats) {
        navbarStats.appendChild(btnReset);
      }
    }
  }

  criarModalDinamico() {
    // Verificar se o modal já existe
    if (document.getElementById("reset-modal-overlay")) {
      this.modal = document.getElementById("reset-modal-overlay");
      this.modalCriado = true;
      return;
    }

    // Criar overlay do modal
    const modalOverlay = document.createElement("div");
    modalOverlay.id = "reset-modal-overlay";
    modalOverlay.className = "reset-modal-overlay";
    
    // Criar conteúdo do modal
    modalOverlay.innerHTML = `
      <div class="reset-modal">
        <h3>⚠️ Resetar Progresso</h3>
        <p>Tem certeza que deseja resetar TODO o seu progresso de leitura?</p>
        <p><strong>Esta ação não pode ser desfeita!</strong></p>
        <p>Todos os dias marcados como lidos serão desmarcados.</p>
        
        <div class="reset-modal-actions">
          <button id="reset-cancel-btn" class="reset-modal-btn cancel">
            Cancelar
          </button>
          <button id="reset-confirm-btn" class="reset-modal-btn confirm">
            Sim, Resetar Tudo
          </button>
        </div>
        
        <div class="reset-modal-security">
          <label>
            <input type="checkbox" id="reset-confirm-checkbox">
            Eu entendo que esta ação apagará permanentemente todo o meu progresso
          </label>
        </div>
      </div>
    `;
    
    // Adicionar ao body
    document.body.appendChild(modalOverlay);
    this.modal = modalOverlay;
    this.modalCriado = true;
    
    // Aplicar estilos dinamicamente se não existirem
    this.aplicarEstilosDinamicos();
  }

  aplicarEstilosDinamicos() {
    // Verificar se os estilos já foram aplicados
    if (document.getElementById("reset-progresso-styles")) {
      return;
    }

    const styleElement = document.createElement("style");
    styleElement.id = "reset-progresso-styles";
    styleElement.textContent = `
      .reset-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }
      
      .reset-modal-overlay.active {
        opacity: 1;
        visibility: visible;
      }
      
      .reset-modal {
        background: var(--card-bg, #ffffff);
        border-radius: 12px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        transform: translateY(-20px);
        transition: transform 0.3s ease;
      }
      
      .reset-modal-overlay.active .reset-modal {
        transform: translateY(0);
      }
      
      .reset-modal h3 {
        color: var(--text-light, #333);
        margin-bottom: 1rem;
        font-size: 1.3rem;
        text-align: center;
      }
      
      .reset-modal p {
        color: var(--text-light, #333);
        margin-bottom: 1rem;
        text-align: center;
        line-height: 1.5;
      }
      
      .reset-modal-security {
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid #e0e0e0;
      }
      
      .reset-modal-security label {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        color: var(--text-light, #333);
        font-size: 0.9rem;
        cursor: pointer;
      }
      
      .reset-modal-security input[type="checkbox"] {
        margin-top: 0.2rem;
      }
      
      .reset-modal-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 1.5rem;
      }
      
      .reset-modal-btn {
        padding: 0.7rem 1.5rem;
        border-radius: 8px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        min-width: 120px;
      }
      
      .reset-modal-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .reset-modal-btn.cancel {
        background: #6c757d;
        color: white;
      }
      
      .reset-modal-btn.cancel:hover:not(:disabled) {
        background: #5a6268;
      }
      
      .reset-modal-btn.confirm {
        background: #dc3545;
        color: white;
      }
      
      .reset-modal-btn.confirm:hover:not(:disabled) {
        background: #c82333;
      }
      
      @media (max-width: 768px) {
        .reset-modal {
          padding: 1.5rem;
        }
        
        .reset-modal-actions {
          flex-direction: column;
        }
        
        .reset-modal-btn {
          width: 100%;
        }
      }
    `;
    
    document.head.appendChild(styleElement);
  }

  /* ========================================================================
     CONFIGURAÇÃO DE EVENTOS
  ======================================================================== */

  configurarEventos() {
    // Botão de abrir modal
    const btnReset = document.getElementById("btn-resetar-progresso");
    if (btnReset) {
      btnReset.addEventListener("click", () => this.mostrarModal());
    }

    // Configurar botões do modal
    setTimeout(() => {
      const btnCancel = document.getElementById("reset-cancel-btn");
      const btnConfirm = document.getElementById("reset-confirm-btn");
      const checkboxConfirm = document.getElementById("reset-confirm-checkbox");

      if (btnCancel) {
        btnCancel.addEventListener("click", () => this.esconderModal());
      }

      if (btnConfirm) {
        btnConfirm.disabled = true;
        btnConfirm.addEventListener("click", () => this.confirmarReset());
      }

      if (checkboxConfirm) {
        checkboxConfirm.addEventListener("change", (e) => {
          if (btnConfirm) {
            btnConfirm.disabled = !e.target.checked;
          }
        });
      }
    }, 100);

    // Fechar modal ao clicar fora
    if (this.modal) {
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) {
          this.esconderModal();
        }
      });
    }

    // Fechar com ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal && this.modal.classList.contains("active")) {
        this.esconderModal();
      }
    });
  }

  /* ========================================================================
     CONTROLE DO MODAL
  ======================================================================== */

  mostrarModal() {
    if (!this.modal || !this.modalCriado) {
      console.error("Modal não foi criado corretamente");
      return;
    }
    
    // Resetar checkbox de confirmação
    const checkbox = document.getElementById("reset-confirm-checkbox");
    const btnConfirm = document.getElementById("reset-confirm-btn");
    if (checkbox) checkbox.checked = false;
    if (btnConfirm) btnConfirm.disabled = true;
    
    // Mostrar modal
    this.modal.classList.add("active");
    
    // Focar no checkbox (mais seguro)
    setTimeout(() => {
      if (checkbox) checkbox.focus();
    }, 100);
    
    console.log("🔄 Modal de reset exibido");
  }

  esconderModal() {
    if (!this.modal) return;
    this.modal.classList.remove("active");
    console.log("🔄 Modal de reset escondido");
  }

  /* ========================================================================
     RESET DO PROGRESSO
  ======================================================================== */

  confirmarReset() {
    console.log("🔄 Iniciando reset completo do progresso...");
    
    try {
      // 1. Resetar progresso
      const resultadoReset = this.progresso.resetarCompletamente();
      
      // 2. Esconder modal
      this.esconderModal();
      
      // 3. Feedback visual
      this.mostrarFeedbackSucesso(resultadoReset.diasResetados);
      
      // 4. Disparar evento para outros módulos
      this.dispararEventoReset(resultadoReset);
      
      console.log("✅ Progresso resetado com sucesso!");
      
    } catch (error) {
      console.error("❌ Erro ao resetar progresso:", error);
      this.mostrarFeedbackErro(error.message);
    }
  }

  /* ========================================================================
     EVENTOS E FEEDBACK
  ======================================================================== */

  dispararEventoReset(detalhes) {
    const evento = new CustomEvent("progresso-resetado", {
      detail: {
        ...detalhes,
        timestamp: new Date().toISOString(),
        totalLidos: this.progresso.getTotalLidos()
      }
    });
    
    document.dispatchEvent(evento);
  }

  mostrarFeedbackSucesso(diasResetados) {
    // Criar toast de sucesso dinamicamente
    const toast = document.createElement("div");
    toast.className = "reset-toast success";
    toast.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>✅ Progresso resetado! ${diasResetados} dias foram desmarcados.</span>
    `;
    
    // Estilos inline para o toast
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #d4edda;
      color: #155724;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      z-index: 1100;
      transform: translateX(120%);
      transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      max-width: 350px;
      border-left: 4px solid #28a745;
    `;
    
    document.body.appendChild(toast);
    
    // Animar entrada
    setTimeout(() => {
      toast.style.transform = "translateX(0)";
    }, 10);
    
    // Remover após 3 segundos
    setTimeout(() => {
      toast.style.transform = "translateX(120%)";
      setTimeout(() => {
        if (toast.parentNode) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  mostrarFeedbackErro(mensagem) {
    const toast = document.createElement("div");
    toast.className = "reset-toast error";
    toast.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      <span>❌ Erro: ${mensagem}</span>
    `;
    
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #f8d7da;
      color: #721c24;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      z-index: 1100;
      transform: translateX(120%);
      transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      max-width: 350px;
      border-left: 4px solid #dc3545;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.transform = "translateX(0)";
    }, 10);
    
    setTimeout(() => {
      toast.style.transform = "translateX(120%)";
      setTimeout(() => {
        if (toast.parentNode) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 5000);
  }

  /* ========================================================================
     API PÚBLICA
  ======================================================================== */

  resetarForcado() {
    console.warn("⚠️ Reset forçado do progresso!");
    const resultado = this.progresso.resetarCompletamente();
    this.dispararEventoReset(resultado);
    this.mostrarFeedbackSucesso(resultado.diasResetados);
    return true;
  }
}

// CORREÇÃO: Exportação padrão alternativa (caso precise)
export default ResetProgresso;