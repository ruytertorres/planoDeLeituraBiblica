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
    modalOverlay.className =
      "fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm";
    modalOverlay.style.display = "none";

    modalOverlay.innerHTML = `
      <div class="bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full mx-4 p-6 border border-slate-700">
        <h3 class="text-xl font-bold text-center text-white mb-4 flex items-center justify-center gap-2">
          <span class="text-yellow-500">⚠️</span> Resetar Progresso
        </h3>

        <div class="bg-red-900/30 border border-red-500/30 rounded-lg p-4 mb-4">
          <p class="text-red-200 text-sm">Tem certeza que deseja <strong class="text-red-400">resetar TODO o seu progresso</strong> de leitura?</p>
          <p class="text-red-300 text-sm font-semibold mt-1">Esta ação não pode ser desfeita!</p>
        </div>

        <div class="space-y-3 mb-4">
          <div class="border-2 border-red-500/50 rounded-lg p-3 bg-red-900/20 cursor-pointer hover:bg-red-900/30 transition">
            <label class="flex items-start gap-3 cursor-pointer">
              <input type="radio" name="reset-tipo" id="reset-completo" value="completo" checked class="mt-1 accent-red-500">
              <div>
                <h4 class="font-semibold text-white flex items-center gap-2">
                  <i class="fas fa-calendar-day text-red-400"></i> Reset Completo
                </h4>
                <p class="text-slate-300 text-sm mt-1">Reiniciar do <strong class="text-white">Dia 01 do plano</strong> com as datas originais (01/01, 02/01, ...).</p>
                <ul class="text-slate-400 text-xs mt-2 space-y-1">
                  <li class="flex items-center gap-1"><i class="fas fa-check text-green-400"></i> Todos os dias marcados como lidos serão desmarcados</li>
                  <li class="flex items-center gap-1"><i class="fas fa-check text-green-400"></i> O calendário volta a usar a linha do tempo original</li>
                  <li class="flex items-center gap-1"><i class="fas fa-check text-green-400"></i> Você recomeça do Dia 1 no plano padrão</li>
                </ul>
              </div>
            </label>
          </div>

          <div class="border border-slate-600 rounded-lg p-3 bg-slate-700/50 cursor-pointer hover:bg-slate-700 transition">
            <label class="flex items-start gap-3 cursor-pointer">
              <input type="radio" name="reset-tipo" id="reset-hoje" value="hoje" class="mt-1 accent-blue-500">
              <div>
                <h4 class="font-semibold text-white flex items-center gap-2">
                  <i class="fas fa-calendar-alt text-blue-400"></i> Dia 01 do Plano na Data de Hoje
                </h4>
                <p class="text-slate-300 text-sm mt-1">Alinhar o <strong class="text-white">Dia 1 do plano</strong> com a data civil atual (por exemplo, 05/05).</p>
                <ul class="text-slate-400 text-xs mt-2 space-y-1">
                  <li class="flex items-center gap-1"><i class="fas fa-check text-green-400"></i> Progresso atual será apagado</li>
                  <li class="flex items-center gap-1"><i class="fas fa-check text-green-400"></i> As leituras serão empurradas para frente a partir de hoje</li>
                  <li class="flex items-center gap-1"><i class="fas fa-check text-green-400"></i> O plano poderá ultrapassar 31/12 e continuar no próximo ano</li>
                </ul>
              </div>
            </label>
          </div>
        </div>

        <div class="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3 mb-4">
          <label class="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" id="reset-confirm-checkbox" class="mt-0.5 accent-yellow-500">
            <span class="text-yellow-200 text-sm">Eu entendo que esta ação <strong class="text-yellow-400">apagará permanentemente</strong> todo o meu progresso e não poderá ser desfeita.</span>
          </label>
        </div>

        <div class="flex gap-3">
          <button id="reset-cancel-btn" class="flex-1 px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition">
            Cancelar
          </button>
          <button id="reset-confirm-btn" class="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            Confirmar Reset
          </button>
        </div>
      </div>
    `;

    // Inserir no início do body para garantir z-index correto
    if (document.body.firstChild) {
      document.body.insertBefore(modalOverlay, document.body.firstChild);
    } else {
      document.body.appendChild(modalOverlay);
    }

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
