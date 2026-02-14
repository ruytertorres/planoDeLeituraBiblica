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
  buracos?: number[];
  tipo?: string;
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
    console.log("[ReajusteModalUI] Construtor chamado");
    if (!orquestrador) {
      throw new Error("ReajusteModalUI requer orquestrador");
    }
    this.orq = orquestrador;
    console.log("[ReajusteModalUI] Instanciado com sucesso");
  }

  criarEExibir(dadosLacuna: DadosLacuna): void {
    console.log("[ReajusteModalUI] criarEExibir chamado com:", dadosLacuna);

    if (!dadosLacuna || !dadosLacuna.temLacuna) {
      console.warn("[ReajusteModalUI] Dados de lacuna inválidos");
      return;
    }

    this.dadosLacuna = dadosLacuna;

    let existente = document.getElementById("reajuste-modal-overlay");
    console.log("[ReajusteModalUI] Modal existente?", !!existente);

    if (existente && existente.parentNode) {
      console.log("[ReajusteModalUI] Reutilizando modal existente");
      this.modal = existente;
      this.atualizarConteudo();
      return;
    }

    if (this.modal && !this.modal.parentNode) {
      console.log("[ReajusteModalUI] Limpando referência de modal removido");
      this.modal = null;
      this.modalCriado = false;
    }

    console.log("[ReajusteModalUI] Criando novo modal...");
    const modalOverlay = document.createElement("div");
    modalOverlay.id = "reajuste-modal-overlay";
    modalOverlay.className =
      "fixed inset-0 z-[99999] flex items-center justify-center bg-black/50";

    const html = this.gerarHTMLModal(dadosLacuna);
    console.log(
      "[ReajusteModalUI] HTML gerado:",
      html.substring(0, 100) + "...",
    );

    modalOverlay.innerHTML = html;

    console.log("[ReajusteModalUI] Adicionando ao DOM...");
    document.body.appendChild(modalOverlay);
    console.log("[ReajusteModalUI] Modal adicionado ao body");

    // Verificar se modal está no DOM
    const verificacao = document.getElementById("reajuste-modal-overlay");
    console.log(
      "[ReajusteModalUI] Verificação DOM:",
      verificacao ? "ENCONTRADO" : "NÃO ENCONTRADO",
    );
    if (verificacao) {
      const computedStyle = window.getComputedStyle(verificacao);
      console.log("[ReajusteModalUI] display:", computedStyle.display);
      console.log("[ReajusteModalUI] visibility:", computedStyle.visibility);
      console.log("[ReajusteModalUI] opacity:", computedStyle.opacity);
      console.log("[ReajusteModalUI] z-index:", computedStyle.zIndex);
    }

    this.modal = modalOverlay;
    this.modalCriado = true;

    this.configurarEventos();
    console.log("[ReajusteModalUI] Modal criado e exibido com sucesso");
  }

  private gerarHTMLModal(dadosLacuna: DadosLacuna): string {
    const formatado = this.formatarDadosParaDisplay(dadosLacuna);

    return `
      <div class="w-[90%] max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-slate-800">
        <div class="mb-6 border-b-2 border-gray-200 pb-4 dark:border-slate-600">
          <h3 class="flex items-center gap-2 text-xl font-bold text-slate-700 dark:text-slate-200">
            ${formatado.titulo}
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${formatado.mensagem}</p>
        </div>

        <div class="mb-4">
          <p class="mb-4 text-gray-700 dark:text-gray-300">${formatado.descricao}</p>
          <div class="mb-4 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
            <strong>Percentual de atraso:</strong> ${formatado.percentual}
          </div>
          <p class="rounded-lg bg-gray-50 p-4 text-center font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
            Deseja reajustar o plano para retomar de hoje?
          </p>
        </div>

        <div class="mt-6 flex justify-end gap-4">
          <button id="reajuste-nao-btn" class="reajuste-modal-btn inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-100 px-6 py-3 font-semibold text-gray-600 transition-all duration-200 hover:bg-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-300">
            <span>×</span> Não, Aguardar
          </button>
          <button id="reajuste-sim-btn" class="reajuste-modal-btn inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-0.5">
            <span>✓</span> Sim, Reajustar
          </button>
        </div>

        <div class="mt-6 border-t border-gray-200 pt-4 text-center text-xs text-gray-400 dark:border-slate-600 dark:text-gray-500">
          <small>Esta ação reorganizará seu plano de leitura</small>
        </div>
      </div>
    `;
  }

  private configurarEventos(): void {
    console.log("[ReajusteModalUI] Configurando eventos...");

    // Aguardar próximo tick para garantir que DOM esteja pronto
    setTimeout(() => {
      const btnSim = document.getElementById("reajuste-sim-btn");
      const btnNao = document.getElementById("reajuste-nao-btn");
      const overlay = document.getElementById("reajuste-modal-overlay");

      console.log(
        "[ReajusteModalUI] btnSim:",
        btnSim ? "ENCONTRADO" : "NÃO ENCONTRADO",
      );
      console.log(
        "[ReajusteModalUI] btnNao:",
        btnNao ? "ENCONTRADO" : "NÃO ENCONTRADO",
      );
      console.log(
        "[ReajusteModalUI] overlay:",
        overlay ? "ENCONTRADO" : "NÃO ENCONTRADO",
      );

      if (!btnSim || !btnNao || !overlay) {
        console.warn(
          "[ReajusteModalUI] Elementos não encontrados, abortando configuração de eventos",
        );
        return;
      }

      // Remover listeners antigos para evitar duplicação
      const novoBtnSim = btnSim.cloneNode(true) as HTMLElement;
      const novoBtnNao = btnNao.cloneNode(true) as HTMLElement;
      btnSim.parentNode?.replaceChild(novoBtnSim, btnSim);
      btnNao.parentNode?.replaceChild(novoBtnNao, btnNao);

      novoBtnSim.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("[ReajusteModalUI] Botão SIM clicado");
        this.aoClicarSim();
      });

      novoBtnNao.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("[ReajusteModalUI] Botão NÃO clicado");
        this.aoClicarNao();
      });

      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          console.log("[ReajusteModalUI] Overlay clicado, fechando modal");
          this.aoClicarNao();
        }
      });

      console.log("[ReajusteModalUI] Eventos configurados com sucesso");
    }, 0);
  }

  private aoClicarSim(): void {
    const resultado = this.orq.aplicarReajuste(this.dadosLacuna || undefined);
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
