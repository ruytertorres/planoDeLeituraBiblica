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
        <h3><i class="fas fa-exclamation-triangle"></i> Resetar Progresso</h3>
        
        <div class="reset-mensagem-principal">
          <p><strong>Tem certeza que deseja resetar TODO o seu progresso?</strong></p>
          <p><small>Esta ação não pode ser desfeita</small></p>
        </div>
        
        <div class="reset-opcoes">
          <!-- Opção 1: Reset Completo (Dia 01/01) -->
          <div class="reset-opcao-destaque">
            <label class="opcao-destaque">
              <input type="radio" name="reset-type" id="reset-completo" value="padrão" checked>
              <div class="opcao-conteudo">
                <h4><i class="fas fa-calendar-day"></i> Reset Completo</h4>
                <p>Reiniciar do <strong>Dia 01/01</strong> - Voltar ao início do plano</p>
                <ul class="opcao-detalhes">
                  <li><i class="fas fa-check"></i> Todos os dias marcados como lidos serão desmarcados</li>
                  <li><i class="fas fa-check"></i> Calendário retorna às datas originais</li>
                  <li><i class="fas fa-check"></i> Começa novamente do Dia 1</li>
                </ul>
              </div>
            </label>
          </div>
          
          <!-- Opção 2: Reiniciar do Dia de Hoje -->
          <div class="reset-opcao-secundaria">
            <label class="opcao-secundaria">
              <input type="radio" name="reset-type" id="reset-hoje" value="custom">
              <div class="opcao-conteudo">
                <h4><i class="fas fa-calendar-alt"></i> Reiniciar do Dia de Hoje</h4>
                <p>Manter datas reorganizadas e reiniciar do dia atual</p>
                <ul class="opcao-detalhes">
                  <li><i class="fas fa-check"></i> Progresso atual será apagado</li>
                  <li><i class="fas fa-check"></i> Mantém calendário reorganizado</li>
                  <li><i class="fas fa-check"></i> Começa do dia correspondente de hoje</li>
                </ul>
              </div>
            </label>
          </div>
        </div>

        <div class="reset-modal-security">
          <label>
            <input type="checkbox" id="reset-confirm-checkbox">
            Eu entendo que esta ação apagará permanentemente meu progresso
          </label>
        </div>
        
        <div class="reset-modal-actions">
          <button id="reset-cancel-btn" class="reset-modal-btn cancel">
            Cancelar
          </button>
          <button id="reset-confirm-btn" class="reset-modal-btn confirm">
            Confirmar Reset
          </button>
        </div>
      </div>
    `;

    // Adicionar ao body
    document.body.appendChild(modalOverlay);
    this.modal = modalOverlay;
    this.modalCriado = true;

    // Debug: Log para confirmar que modal foi criado
    console.log("✅ Modal de reset criado com opções de rádio");

    // Verificar opções no DOM
    setTimeout(() => {
      const options = document.querySelectorAll('input[name="reset-type"]');
      console.log(`📊 Opções de reset no DOM: ${options.length}`);
      options.forEach((opt, i) => {
        console.log(
          `  Opção ${i}: id="${opt.id}", value="${opt.value}", checked=${opt.checked}`,
        );
      });

      const labels = document.querySelectorAll(".reset-option-item label");
      console.log(`📌 Labels encontradas: ${labels.length}`);
      labels.forEach((label, i) => {
        console.log(`  Label ${i}: ${label.textContent.substring(0, 50)}...`);
      });
    }, 100);

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

      /* ====== OPCOES DE RESET ====== */
      .reset-opcoes {
        margin: 1.5rem 0;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .reset-opcao-destaque,
      .reset-opcao-secundaria {
        margin: 0;
      }

      .opcao-destaque,
      .opcao-secundaria {
        display: block;
        cursor: pointer;
      }

      .opcao-destaque input[type="radio"],
      .opcao-secundaria input[type="radio"] {
        display: none;
      }

      .opcao-conteudo {
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        padding: 1.5rem;
        transition: all 0.3s;
        cursor: pointer;
      }

      .opcao-destaque input[type="radio"]:checked + .opcao-conteudo {
        border-color: #dc3545;
        background: linear-gradient(135deg, #fff5f5, #ffeaea);
        box-shadow: 0 5px 20px rgba(220, 53, 69, 0.15);
      }

      .opcao-secundaria input[type="radio"]:checked + .opcao-conteudo {
        border-color: #007bff;
        background: linear-gradient(135deg, #f0f8ff, #e3f2fd);
        box-shadow: 0 5px 20px rgba(0, 123, 255, 0.15);
      }

      .opcao-conteudo:hover {
        border-color: #999;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      }

      .opcao-conteudo h4 {
        margin: 0 0 0.75rem 0;
        color: var(--text-light, #333);
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .opcao-conteudo p {
        color: #666;
        margin: 0 0 1rem 0;
        font-size: 0.95rem;
        line-height: 1.5;
      }

      .opcao-detalhes {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .opcao-detalhes li {
        color: #555;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .opcao-detalhes li:last-child {
        margin-bottom: 0;
      }

      .opcao-detalhes li i {
        color: #28a745;
        margin-top: 0.1rem;
        flex-shrink: 0;
      }

      .reset-mensagem-principal {
        background: #fff5f5;
        border-radius: 10px;
        padding: 1.25rem;
        margin-bottom: 1.5rem;
        border-left: 4px solid #dc3545;
      }

      .reset-mensagem-principal p {
        color: #721c24;
        margin: 0.75rem 0;
        line-height: 1.5;
      }

      .reset-mensagem-principal p:first-child {
        margin-top: 0;
      }

      .reset-mensagem-principal p:last-child {
        margin-bottom: 0;
      }

      .reset-modal-security {
        margin-top: 1.5rem;
        padding: 1rem;
        background: var(--hover-bg);
        border-radius: 8px;
        border-left: 3px solid #ffc107;
      }

      /* Dark mode support */
      .dark-mode .reset-mensagem-principal {
        background: #442222;
        border-left-color: #dc3545;
      }

      .dark-mode .reset-mensagem-principal p {
        color: #ffb3b3;
      }

      .dark-mode .opcao-destaque .opcao-conteudo,
      .dark-mode .opcao-secundaria .opcao-conteudo {
        border-color: #404040;
        background: rgba(255, 255, 255, 0.05);
      }

      .dark-mode .opcao-destaque input[type="radio"]:checked + .opcao-conteudo {
        background: linear-gradient(135deg, #442222, #552222);
        border-color: #dc3545;
      }

      .dark-mode .opcao-secundaria input[type="radio"]:checked + .opcao-conteudo {
        background: linear-gradient(135deg, #223344, #224455);
        border-color: #007bff;
      }

      .dark-mode .opcao-conteudo h4 {
        color: var(--text-dark, #f8f9fa);
      }

      .dark-mode .opcao-conteudo p {
        color: #b0b0b0;
      }

      .dark-mode .opcao-detalhes li {
        color: #cccccc;
      }

      .reset-modal-options {
        margin: 1.5rem 0;
        padding: 1rem;
        background: var(--bg-secondary, #f8f9fa);
        border-radius: 8px;
        border: 1px solid #e0e0e0;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .reset-option-item {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        padding: 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid transparent;
      }

      .reset-option-item:hover {
        background: rgba(0, 0, 0, 0.05);
        border-color: #ccc;
      }

      .reset-option-item input[type="radio"] {
        margin-top: 0.3rem;
        width: 18px;
        height: 18px;
        cursor: pointer;
        flex-shrink: 0;
      }

      .reset-option-item label {
        flex: 1;
        cursor: pointer;
        margin: 0;
        padding: 0;
      }

      .reset-option-item label strong {
        display: block;
        color: var(--text-light, #333);
        margin-bottom: 0.25rem;
        font-weight: 600;
      }

      .reset-option-item label small {
        display: block;
        color: #666;
        font-size: 0.8rem;
        font-style: italic;
        margin-top: 0.25rem;
      }

      /* Dark mode support */
      .dark-mode .reset-modal-options {
        background: var(--bg-secondary, #2a2a2a);
        border-color: #444;
      }

      .dark-mode .reset-option:hover {
        background: rgba(255, 255, 255, 0.08);
      }

      .dark-mode .reset-modal-security {
        border-color: #444;
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

        .reset-option {
          padding: 0.75rem;
        }

        .reset-option-content small {
          display: none;
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
      if (
        e.key === "Escape" &&
        this.modal &&
        this.modal.classList.contains("active")
      ) {
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

    // Debug
    console.log("🔍 Abrindo modal de reset...");
    const radios = document.querySelectorAll('input[name="reset-type"]');
    console.log(`📡 Inputs de rádio encontrados: ${radios.length}`);
    radios.forEach((r, i) =>
      console.log(`  Rádio ${i}: value="${r.value}", checked=${r.checked}`),
    );

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
    console.log("🔄 Iniciando reset do progresso...");

    try {
      // 1. Capturar tipo de reset escolhido (Opção 1: padrão ou Opção 2: custom)
      const resetTypeRadio = document.querySelector(
        'input[name="reset-type"]:checked',
      );
      const resetType = resetTypeRadio ? resetTypeRadio.value : "padrão";

      // 2. Resetar progresso
      const resultadoReset = this.progresso.resetarCompletamente();

      // 3. Se tipo for "custom" (Opção 2), resetar para hoje
      if (resetType === "custom" && this.planoManager) {
        const hoje = new Date();
        console.log(
          `📅 Resetando para hoje: ${hoje.toLocaleDateString("pt-BR")}`,
        );

        // Usar o novo método resetarAPartirDoDia para resetar a partir de dia 1 com data de hoje
        const resultadoCustom = this.planoManager.resetarAPartirDoDia(1);
        if (resultadoCustom.sucesso) {
          resultadoReset.resetType = "custom";
          resultadoReset.dataInicio = hoje;
          console.log("✅ Reset customizado aplicado (Dia 1 → Hoje)");
        }
      } else {
        resultadoReset.resetType = "padrão";
        resultadoReset.dataInicio = new Date(new Date().getFullYear(), 0, 1); // 01/01
      }

      // 4. Esconder modal
      this.esconderModal();

      // 5. Feedback visual
      this.mostrarFeedbackSucesso(resultadoReset);

      // 6. Disparar evento para outros módulos
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
        totalLidos: this.progresso.getTotalLidos(),
      },
    });

    document.dispatchEvent(evento);
  }

  mostrarFeedbackSucesso(resultado) {
    // Determinar mensagem baseada no tipo de reset
    let mensagem = "✅ Progresso resetado!";

    if (resultado.resetType === "custom") {
      mensagem = "✅ Progresso resetado! Dia 1 → Hoje";
    } else if (resultado.resetType === "padrão") {
      mensagem = "✅ Progresso resetado! Dia 1 → 01/01";
    }

    if (resultado.diasResetados) {
      mensagem += ` (${resultado.diasResetados} dias desmarcados)`;
    }

    // Criar toast de sucesso dinamicamente
    const toast = document.createElement("div");
    toast.className = "reset-toast success";
    toast.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${mensagem}</span>
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
