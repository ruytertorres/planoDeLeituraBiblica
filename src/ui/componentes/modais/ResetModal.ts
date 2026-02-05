/* ============================================================================
   ResetModal.ts — Modal e UI de Reset (Apresentação)
   Versão: 2.0.0 (TypeScript)
   ============================================================================ */

import type { ResetProgressoOrquestrador } from "../../../core/services/planos/ResetProgressoOrquestrador.js";

export class ResetModal {
  private orquestrador: ResetProgressoOrquestrador;
  private modal: HTMLElement | null = null;
  private modalCriado = false;

  constructor(orquestrador: ResetProgressoOrquestrador) {
    if (!orquestrador) {
      throw new Error("ResetModal requer ResetProgressoOrquestrador.");
    }
    this.orquestrador = orquestrador;
  }

  inicializar(): void {
    this.criarBotaoReset();
    this.criarModalDinamico();
    this.configurarEventos();
    this.configurarListeners();
  }

  private criarBotaoReset(): void {
    if (document.getElementById("btn-resetar-progresso")) {
      return;
    }

    const btnReset = document.createElement("button");
    btnReset.id = "btn-resetar-progresso";
    btnReset.className = "btn-reset";
    btnReset.title = "Resetar progresso";
    btnReset.innerHTML = '<i class="fas fa-redo"></i>';

    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle && themeToggle.parentNode) {
      themeToggle.parentNode.insertBefore(btnReset, themeToggle.nextSibling);
    } else {
      const navbarStats = document.querySelector(".navbar-stats");
      if (navbarStats) {
        navbarStats.appendChild(btnReset);
      }
    }
  }

  private criarModalDinamico(): void {
    if (document.getElementById("reset-modal-overlay")) {
      this.modal = document.getElementById("reset-modal-overlay");
      this.modalCriado = true;
      return;
    }

    const modalOverlay = document.createElement("div");
    modalOverlay.id = "reset-modal-overlay";
    modalOverlay.className = "reset-modal-overlay";

    modalOverlay.innerHTML = `
      <div class="reset-modal">
        <h3>⚠️ Resetar Progresso</h3>

        <div class="reset-mensagem-principal">
          <p>Tem certeza que deseja <strong>resetar TODO o seu progresso</strong> de leitura?</p>
          <p><strong>Esta ação não pode ser desfeita!</strong></p>
        </div>

        <div class="reset-opcoes">
          <div class="reset-opcao-destaque">
            <label class="opcao-destaque">
              <input type="radio" name="reset-tipo" id="reset-completo" value="completo" checked>
              <div class="opcao-conteudo">
                <h4><i class="fas fa-calendar-day"></i> Reset Completo</h4>
                <p>Reiniciar do <strong>Dia 01 do plano</strong> com as datas originais (01/01, 02/01, ...).</p>
                <ul class="opcao-detalhes">
                  <li><i class="fas fa-check"></i> Todos os dias marcados como lidos serão desmarcados</li>
                  <li><i class="fas fa-check"></i> O calendário volta a usar a linha do tempo original</li>
                  <li><i class="fas fa-check"></i> Você recomeça do Dia 1 no plano padrão</li>
                </ul>
              </div>
            </label>
          </div>

          <div class="reset-opcao-secundaria">
            <label class="opcao-secundaria">
              <input type="radio" name="reset-tipo" id="reset-hoje" value="hoje">
              <div class="opcao-conteudo">
                <h4><i class="fas fa-calendar-alt"></i> Dia 01 do Plano na Data de Hoje</h4>
                <p>Alinhar o <strong>Dia 1 do plano</strong> com a data civil atual (por exemplo, 05/05).</p>
                <ul class="opcao-detalhes">
                  <li><i class="fas fa-check"></i> Progresso atual será apagado</li>
                  <li><i class="fas fa-check"></i> As leituras serão empurradas para frente a partir de hoje</li>
                  <li><i class="fas fa-check"></i> O plano poderá ultrapassar 31/12 e continuar no próximo ano</li>
                </ul>
              </div>
            </label>
          </div>
        </div>

        <div class="reset-modal-security">
          <label>
            <input type="checkbox" id="reset-confirm-checkbox">
            Eu entendo que esta ação <strong>apagará permanentemente</strong> todo o meu progresso e não poderá ser desfeita.
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

    document.body.appendChild(modalOverlay);
    this.modal = modalOverlay;
    this.modalCriado = true;
  }

  private configurarEventos(): void {
    const btnReset = document.getElementById("btn-resetar-progresso");
    if (btnReset) {
      btnReset.addEventListener("click", () => this.mostrarModal());
    }

    setTimeout(() => {
      const btnCancel = document.getElementById("reset-cancel-btn");
      const btnConfirm = document.getElementById(
        "reset-confirm-btn",
      ) as HTMLButtonElement;
      const checkboxConfirm = document.getElementById(
        "reset-confirm-checkbox",
      ) as HTMLInputElement;

      if (btnCancel) {
        btnCancel.addEventListener("click", () => this.esconderModal());
      }

      if (btnConfirm) {
        btnConfirm.disabled = true;
        btnConfirm.addEventListener("click", () => this.aoClicarConfirmar());
      }

      if (checkboxConfirm) {
        checkboxConfirm.addEventListener("change", (e) => {
          if (btnConfirm) {
            btnConfirm.disabled = !checkboxConfirm.checked;
          }
        });
      }
    }, 100);

    if (this.modal) {
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) {
          this.esconderModal();
        }
      });
    }

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

  private configurarListeners(): void {
    document.addEventListener("progresso-resetado", (evento) => {
      this.mostrarFeedbackSucesso(
        (evento as CustomEvent).detail?.diasResetados,
      );
    });
  }

  private mostrarModal(): void {
    if (!this.modal || !this.modalCriado) {
      console.error("Modal não foi criado corretamente");
      return;
    }

    const checkbox = document.getElementById(
      "reset-confirm-checkbox",
    ) as HTMLInputElement;
    const btnConfirm = document.getElementById(
      "reset-confirm-btn",
    ) as HTMLButtonElement;
    if (checkbox) checkbox.checked = false;
    if (btnConfirm) btnConfirm.disabled = true;

    this.modal.classList.add("active");

    setTimeout(() => {
      if (checkbox) checkbox.focus();
    }, 100);
  }

  private esconderModal(): void {
    if (!this.modal) return;
    this.modal.classList.remove("active");
  }

  private aoClicarConfirmar(): void {
    try {
      const tipoRadio = document.querySelector<HTMLInputElement>(
        'input[name="reset-tipo"]:checked',
      );
      const tipoReset = tipoRadio ? tipoRadio.value : "completo";

      let resultado;
      switch (tipoReset) {
        case "completo":
          resultado = this.orquestrador.resetCompleto();
          break;
        case "customizado":
          resultado = this.orquestrador.resetCustomizado(1);
          break;
        case "hoje":
          resultado = this.orquestrador.resetParaHoje();
          break;
        default:
          resultado = this.orquestrador.resetCompleto();
      }

      this.esconderModal();
    } catch (error) {
      console.error("Erro ao confirmar reset:", error);
      this.mostrarFeedbackErro((error as Error).message);
    }
  }

  private mostrarFeedbackSucesso(diasResetados?: number): void {
    const toast = document.createElement("div");
    toast.className = "reset-toast success";
    toast.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>✅ Progresso resetado! ${diasResetados} dias foram desmarcados.</span>
    `;

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
    }, 3000);
  }

  private mostrarFeedbackErro(mensagem: string): void {
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
}

export default ResetModal;
