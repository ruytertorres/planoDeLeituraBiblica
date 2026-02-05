/* ============================================================================
   ReajusteModalUI.ts — UI Modal para Reajuste de Lacuna
   Versão: 2.0.0 (TypeScript)
   ============================================================================ */

import type { MainOrquestrador } from "../../orquestradores/MainOrquestrador.js";

declare module "../../orquestradores/MainOrquestrador.js" {
  interface MainOrquestrador {
    aplicarReajuste(): { sucesso: boolean; novoIndice: number; aviso?: string };
  }
}

interface DadosLacuna {
  temLacuna: boolean;
  diasGapCount: number;
  descricao?: string;
  percentualAtraso: number;
}

interface ToastOptions {
  tipo?: "sucesso" | "info" | "erro";
  mensagem: string;
  duracao?: number;
}

export class ReajusteModalUI {
  private orq: MainOrquestrador;
  private modal: HTMLElement | null = null;
  private modalCriado = false;
  private dadosLacuna: DadosLacuna | null = null;

  constructor(orquestrador: MainOrquestrador) {
    if (!orquestrador) {
      throw new Error("ReajusteModalUI requer orquestrador");
    }
    this.orq = orquestrador;
  }

  criarEExibir(dadosLacuna: DadosLacuna): void {
    if (!dadosLacuna || !dadosLacuna.temLacuna) {
      console.warn("ReajusteModalUI: Dados de lacuna inválidos");
      return;
    }

    this.dadosLacuna = dadosLacuna;

    let existente = document.getElementById("reajuste-modal-overlay");
    if (existente && existente.parentNode) {
      this.modal = existente;
      this.atualizarConteudo();
      return;
    }

    if (this.modal && !this.modal.parentNode) {
      this.modal = null;
      this.modalCriado = false;
    }

    const modalOverlay = document.createElement("div");
    modalOverlay.id = "reajuste-modal-overlay";
    modalOverlay.className = "reajuste-modal-overlay";

    modalOverlay.innerHTML = this.gerarHTMLModal(dadosLacuna);

    document.body.appendChild(modalOverlay);

    this.modal = modalOverlay;
    this.modalCriado = true;

    this.configurarEventos();
  }

  private gerarHTMLModal(dadosLacuna: DadosLacuna): string {
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

  private configurarEventos(): void {
    const btnSim = document.getElementById("reajuste-sim-btn");
    const btnNao = document.getElementById("reajuste-nao-btn");
    const overlay = document.getElementById("reajuste-modal-overlay");

    if (!btnSim || !btnNao || !overlay) {
      return;
    }

    btnSim.addEventListener("click", () => {
      this.aoClicarSim();
    });

    btnNao.addEventListener("click", () => {
      this.aoClicarNao();
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        this.aoClicarNao();
      }
    });
  }

  private aoClicarSim(): void {
    const resultado = this.orq.aplicarReajuste();
    this.orq.emit("reajuste-aplicado", {
      sucesso: true,
      novoIndice: resultado.novoIndice,
      aviso: resultado.aviso,
    });

    this.fechar();
    this.mostrarNotificacaoSucesso(resultado);
  }

  private aoClicarNao(): void {
    this.orq.emit("reajuste-cancelado", {
      sucesso: false,
      motivo: "usuário_negou",
    });

    this.fechar();
    this.mostrarNotificacaoAguarde();
  }

  private mostrarNotificacaoSucesso(resultado: any): void {
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

  private mostrarNotificacaoAguarde(): void {
    this.mostrarToast({
      tipo: "info",
      mensagem: "⏳ Reajuste aguardando sua ação",
      duracao: 2000,
    });
  }

  private mostrarToast(options: ToastOptions): void {
    const { tipo = "info", mensagem, duracao = 3000 } = options;
    const toast = document.createElement("div");
    toast.className = `reajuste-toast reajuste-toast-${tipo}`;
    toast.innerHTML = mensagem;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("reajuste-toast-visible");
    }, 10);

    setTimeout(() => {
      toast.classList.remove("reajuste-toast-visible");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duracao);
  }

  private atualizarConteudo(): void {
    if (!this.modal || !this.dadosLacuna) return;

    const conteudoNovo = this.gerarHTMLModal(this.dadosLacuna);
    this.modal.innerHTML = conteudoNovo;
    this.configurarEventos();
  }

  private formatarDadosParaDisplay(dadosLacuna: DadosLacuna) {
    return {
      titulo: "⏸️ Você teve um atraso",
      mensagem: `${dadosLacuna.diasGapCount} dia(s) sem leitura`,
      descricao:
        dadosLacuna.descricao || "Detectamos uma lacuna em sua leitura",
      percentual: `${dadosLacuna.percentualAtraso}%`,
    };
  }

  fechar(): void {
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

  destroy(): void {
    this.fechar();
    this.orq = null as any;
    this.dadosLacuna = null;
  }
}

export default ReajusteModalUI;
