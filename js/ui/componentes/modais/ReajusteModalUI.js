/* ============================================================================
   ReajusteModalUI.js — UI Modal para Reajuste de Lacuna
   Versão: 1.0.0
   Aplicação: Leitura Bíblica Cronológica

   RESPONSABILIDADE ÚNICA:
   --------------------------------------------------------------------------
   - Criar modal visual para reajuste de lacuna
   - Gerenciar interações do usuário (SIM/NÃO)
   - Comunicar decisão do usuário ao orquestrador
   - NÃO conter lógica de domínio
============================================================================ */

export class ReajusteModalUI {
  /**
   * Construtor
   * @param {MainOrquestrador} orquestrador - Orquestrador principal
   */
  constructor(orquestrador) {
    if (!orquestrador) {
      throw new Error("ReajusteModalUI requer orquestrador");
    }

    this.orq = orquestrador;
    this.modal = null;
    this.modalCriado = false;
    this.dadosLacuna = null;
  }

  /* ========================================================================
     CRIAÇÃO DO MODAL
  ======================================================================== */

  /**
   * Criar e exibir modal de reajuste
   * @param {object} dadosLacuna - Dados da lacuna detectada
   * @public
   */
  criarEExibir(dadosLacuna) {
    if (!dadosLacuna || !dadosLacuna.temLacuna) {
      console.warn("ReajusteModalUI: Dados de lacuna inválidos");
      return;
    }

    this.dadosLacuna = dadosLacuna;

    // Verificar se modal já existe e está no DOM
    let existente = document.getElementById("reajuste-modal-overlay");
    if (existente && existente.parentNode) {
      this.modal = existente;
      this.atualizarConteudo();
      return;
    }

    // Se existe mas não está no DOM, remover a referência
    if (this.modal && !this.modal.parentNode) {
      this.modal = null;
      this.modalCriado = false;
    }

    // Criar overlay do modal
    const modalOverlay = document.createElement("div");
    modalOverlay.id = "reajuste-modal-overlay";
    modalOverlay.className = "reajuste-modal-overlay";

    // Criar conteúdo do modal
    modalOverlay.innerHTML = this.gerarHTMLModal(dadosLacuna);

    // Inserir no DOM
    document.body.appendChild(modalOverlay);

    this.modal = modalOverlay;
    this.modalCriado = true;

    // Configurar eventos
    this.configurarEventos();
  }

  /* ========================================================================
     GERAÇÃO DE HTML
  ======================================================================== */

  /**
   * Gerar HTML do modal
   * @private
   */
  gerarHTMLModal(dadosLacuna) {
    const formatado = this.formatarDadosParaDisplay(dadosLacuna);

    return `
      <div class="reajuste-modal">
        <div class="reajuste-modal-header">
          <h3>${formatado.titulo}</h3>
          <p class="reajuste-modal-subtitle">${formatado.mensagem}</p>
        </div>

        <div class="reajuste-modal-body">
          <p class="reajuste-modal-description">
            ${formatado.descricao}
          </p>
          <p class="reajuste-modal-info">
            <strong>Percentual de atraso:</strong> ${formatado.percentual}
          </p>
          <p class="reajuste-modal-question">
            Deseja reajustar o plano para retomar de hoje?
          </p>
        </div>

        <div class="reajuste-modal-actions">
          <button id="reajuste-nao-btn" class="reajuste-modal-btn nao">
            <i class="fas fa-times"></i> Não, Aguardar
          </button>
          <button id="reajuste-sim-btn" class="reajuste-modal-btn sim">
            <i class="fas fa-check"></i> Sim, Reajustar
          </button>
        </div>

        <div class="reajuste-modal-footer">
          <small>Esta ação reorganizará seu plano de leitura</small>
        </div>
      </div>
    `;
  }

  /* ========================================================================
     EVENTOS
  ======================================================================== */

  /**
   * Configurar eventos do modal
   * @private
   */
  configurarEventos() {
    const btnSim = document.getElementById("reajuste-sim-btn");
    const btnNao = document.getElementById("reajuste-nao-btn");
    const overlay = document.getElementById("reajuste-modal-overlay");

    if (!btnSim || !btnNao || !overlay) {
      return;
    }

    // Botão SIM
    btnSim.addEventListener("click", () => {
      this.aoClicarSim();
    });

    // Botão NÃO
    btnNao.addEventListener("click", () => {
      this.aoClicarNao();
    });

    // Clicar fora do modal (overlay)
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        this.aoClicarNao();
      }
    });
  }

  /**
   * Handler: Usuário clicou SIM
   * @private
   */
  aoClicarSim() {
    // Aplicar reajuste no orquestrador
    const resultado = this.orq.aplicarReajuste();
    this.orq.emit("reajuste-aplicado", {
      sucesso: true,
      novoIndice: resultado.novoIndice,
      aviso: resultado.aviso,
    });

    // Fechar modal
    this.fechar();

    // Notificação visual ao usuário
    this.mostrarNotificacaoSucesso(resultado);
  }

  /**
   * Handler: Usuário clicou NÃO
   * @private
   */
  aoClicarNao() {
    // Emitir evento
    this.orq.emit("reajuste-cancelado", {
      sucesso: false,
      motivo: "usuário_negou",
    });

    // Fechar modal
    this.fechar();

    // Notificação ao usuário
    this.mostrarNotificacaoAguarde();
  }

  /* ========================================================================
     NOTIFICAÇÕES
  ======================================================================== */

  /**
   * Mostrar notificação de sucesso
   * @private
   */
  mostrarNotificacaoSucesso(resultado) {
    this.mostrarToast({
      tipo: "sucesso",
      mensagem: "✅ Plano reajustado com sucesso!",
      duracao: 3000,
    });

    if (resultado.aviso) {
      this.mostrarToast({
        tipo: "info",
        mensagem: `📅 ${resultado.aviso}`,
        duracao: 5000,
      });
    }
  }

  /**
   * Mostrar notificação de aguarde
   * @private
   */
  mostrarNotificacaoAguarde() {
    this.mostrarToast({
      tipo: "info",
      mensagem: "⏳ Reajuste aguardando sua ação",
      duracao: 2000,
    });
  }

  /**
   * Mostrar toast genérico
   * @private
   */
  mostrarToast({ tipo = "info", mensagem = "", duracao = 3000 }) {
    const toast = document.createElement("div");
    toast.className = `reajuste-toast reajuste-toast-${tipo}`;
    toast.innerHTML = mensagem;

    document.body.appendChild(toast);

    // Animar entrada
    setTimeout(() => {
      toast.classList.add("reajuste-toast-visible");
    }, 10);

    // Remover após duração
    setTimeout(() => {
      toast.classList.remove("reajuste-toast-visible");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duracao);
  }

  /* ========================================================================
     AUXILIARES
  ======================================================================== */

  /**
   * Atualizar conteúdo do modal (se existir)
   * @private
   */
  atualizarConteudo() {
    if (!this.modal || !this.dadosLacuna) return;

    const conteudoNovo = this.gerarHTMLModal(this.dadosLacuna);
    this.modal.innerHTML = conteudoNovo;
    this.configurarEventos();
  }

  /**
   * Formatar dados da lacuna para display
   * @private
   */
  formatarDadosParaDisplay(dadosLacuna) {
    return {
      titulo: "⏸️ Você teve um atraso",
      mensagem: `${dadosLacuna.diasGapCount} dia(s) sem leitura`,
      descricao:
        dadosLacuna.descricao || "Detectamos uma lacuna em sua leitura",
      percentual: `${dadosLacuna.percentualAtraso}%`,
    };
  }

  /**
   * Fechar modal
   * @public
   */
  fechar() {
    if (this.modal) {
      this.modal.classList.add("reajuste-modal-fechando");

      setTimeout(() => {
        if (this.modal && this.modal.parentNode) {
          this.modal.parentNode.removeChild(this.modal);
        }
        this.modal = null;
        this.modalCriado = false;
      }, 300);
    }
  }

  /**
   * Destruir componente
   * @public
   */
  destroy() {
    this.fechar();
    this.orq = null;
    this.dadosLacuna = null;
  }
}
