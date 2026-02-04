/* ============================================================================
   FooterComponent.ts — Componente de Footer em TypeScript
   Versão: 1.0.0
   ============================================================================

   RESPONSABILIDADE:
   - Atualizar informações dinâmicas do footer
   - Gerenciar navegação do footer
   - Compartilhamento social
   - Integrar com geradorDatas

   CONFORMIDADE COM CONTRATO_DO_SISTEMA.MD:
   - §3.1: Tempo é soberano (usa geradorDatas)
   ============================================================================ */

import {
  getAnoAtual,
  getTimestampAtualISO,
  gerarDataBR,
  getDataAtualFormatada,
} from "../../../core/services/tempo/geradorDatas.js";

export class FooterComponent {
  private eventListeners: Array<{
    element: Element;
    type: string;
    handler: EventListener;
  }> = [];

  constructor() {
    this.init();
  }

  /**
   * Inicializa o footer
   */
  public init(): void {
    this.atualizarInformacoes();
    this.configurarNavegacao();
    this.configurarAcoes();
    this.configurarSocial();
    this.configurarLegais();
  }

  /**
   * Atualiza informações dinâmicas (ano, versão, data)
   */
  private atualizarInformacoes(): void {
    // Atualizar ano atual
    const currentYearElement = document.getElementById("current-year");
    if (currentYearElement) {
      currentYearElement.textContent = String(getAnoAtual());
    }

    // Atualizar versão do app
    const appVersionElement = document.getElementById("app-version");
    if (appVersionElement) {
      appVersionElement.textContent = "2.1.0";
    }

    // Atualizar data da última atualização
    const lastUpdateElement = document.getElementById("last-update");
    if (lastUpdateElement) {
      lastUpdateElement.textContent = getDataAtualFormatada("pt-BR");
    }
  }

  /**
   * Configura links de navegação
   */
  private configurarNavegacao(): void {
    document.querySelectorAll("[data-nav]").forEach((link) => {
      const handler = (e: Event) => {
        e.preventDefault();
        const section = link.getAttribute("data-nav");

        switch (section) {
          case "home":
            window.scrollTo({ top: 0, behavior: "smooth" });
            break;
          case "calendar":
            const calendarElement = document.getElementById("calendar");
            if (calendarElement) {
              calendarElement.scrollIntoView({ behavior: "smooth" });
            }
            break;
          case "notes":
            const notasButton = document.getElementById("btn-notas");
            if (notasButton) {
              notasButton.click();
            }
            break;
        }
      };

      link.addEventListener("click", handler);
      this.eventListeners.push({ element: link, type: "click", handler });
    });
  }

  /**
   * Configura links de ação
   */
  private configurarAcoes(): void {
    document.querySelectorAll("[data-action]").forEach((link) => {
      const handler = (e: Event) => {
        e.preventDefault();
        const action = link.getAttribute("data-action");

        switch (action) {
          case "faq":
            alert("FAQ: Em desenvolvimento");
            break;
          case "tips":
            alert("Dicas de Leitura: Em desenvolvimento");
            break;
          case "versions":
            alert("Versões da Bíblia: Em desenvolvimento");
            break;
          case "guide":
            alert("Guia de Uso: Em desenvolvimento");
            break;
          case "contact":
            alert("Contato: Em desenvolvimento");
            break;
        }
      };

      link.addEventListener("click", handler);
      this.eventListeners.push({ element: link, type: "click", handler });
    });
  }

  /**
   * Configura ícones sociais
   */
  private configurarSocial(): void {
    document.querySelectorAll(".social-icon").forEach((icon) => {
      const handler = (e: Event) => {
        e.preventDefault();
        const title = icon.getAttribute("title");

        switch (title) {
          case "Compartilhar":
            this.compartilhar();
            break;
          case "Feedback":
            alert("Feedback: Em desenvolvimento");
            break;
          case "Ajuda":
            alert("Ajuda: Em desenvolvimento");
            break;
        }
      };

      icon.addEventListener("click", handler);
      this.eventListeners.push({ element: icon, type: "click", handler });
    });
  }

  /**
   * Compartilha o link da página
   */
  private compartilhar(): void {
    if (navigator.share) {
      navigator.share({
        title: "Leitura Bíblica Cronológica",
        text: "Transforme sua vida através da leitura organizada das Escrituras.",
        url: window.location.href,
      });
    } else {
      // Fallback para navegadores que não suportam Web Share API
      const dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = window.location.href;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
      alert("Link copiado para a área de transferência!");
    }
  }

  /**
   * Configura links legais
   */
  private configurarLegais(): void {
    document.querySelectorAll(".legal-link").forEach((link) => {
      const handler = (e: Event) => {
        e.preventDefault();
        const text = link.textContent || "";
        alert(`${text}: Em desenvolvimento`);
      };

      link.addEventListener("click", handler);
      this.eventListeners.push({ element: link, type: "click", handler });
    });
  }

  /**
   * Remove todos os event listeners
   */
  public destroy(): void {
    this.eventListeners.forEach(({ element, type, handler }) => {
      element.removeEventListener(type, handler);
    });
    this.eventListeners = [];
  }
}

/**
 * Inicializa o footer
 */
export function initFooter(): FooterComponent {
  return new FooterComponent();
}

// Auto-inicializar se o DOM já estiver carregado
if (document.readyState !== "loading") {
  initFooter();
} else {
  document.addEventListener("DOMContentLoaded", () => initFooter());
}
