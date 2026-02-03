/* ============================================================================
   DarkModeManager.ts — Gerenciador de Tema Escuro em TypeScript
   Versão: 1.0.0
   ============================================================================

   RESPONSABILIDADE:
   - Gerenciar alternância entre tema claro e escuro
   - Persistir preferência do usuário no localStorage
   - Sincronizar com preferência do sistema
   - Disparar eventos para outros componentes

   CONFORMIDADE COM CONTRATO_DO_SISTEMA.MD:
   - §10: UI é reflexo
   - Independente de outros módulos
   ============================================================================ */

// ============================================================================
// TIPOS
// ============================================================================

type Theme = "dark" | "light";

interface ThemeChangedEventDetail {
  isDarkMode: boolean;
}

// ============================================================================
// GERENCIADOR
// ============================================================================

export class DarkModeManager {
  private storageKey: string = "dark_mode_preference";
  private mediaQuery: MediaQueryList;
  private themeToggle: HTMLElement | null = null;
  private _isDarkMode: boolean = false;

  constructor() {
    this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    this.init();
  }

  /**
   * Inicialização
   */
  private init(): void {
    // 1. Carregar preferência salva ou detectar do sistema
    this.loadPreference();

    // 2. Configurar listener para mudanças do sistema
    this.setupSystemPreferenceListener();

    // 3. Encontrar e configurar botão de alternância
    this.findThemeToggle();

    // 4. Aplicar tema inicial
    this.applyTheme();
  }

  /**
   * Carrega preferência do localStorage ou do sistema
   */
  private loadPreference(): void {
    try {
      const savedPreference = localStorage.getItem(this.storageKey);

      if (savedPreference !== null) {
        // Usar preferência salva
        this._isDarkMode = savedPreference === "true";
      } else {
        // Se não houver preferência salva, usar preferência do sistema
        this._isDarkMode = this.mediaQuery.matches;
      }
    } catch (error) {
      console.error("❌ Erro ao carregar preferência do tema:", error);
      // Fallback para tema claro
      this._isDarkMode = false;
    }
  }

  /**
   * Salva preferência no localStorage
   */
  private savePreference(): void {
    try {
      localStorage.setItem(this.storageKey, this._isDarkMode.toString());
    } catch (error) {
      console.error("❌ Erro ao salvar preferência do tema:", error);
    }
  }

  /**
   * Configura listener para mudanças de preferência do sistema
   */
  private setupSystemPreferenceListener(): void {
    const handler = (event: MediaQueryListEvent) => {
      // Só mudar se o usuário não tiver uma preferência explícita
      const hasUserPreference = localStorage.getItem(this.storageKey) !== null;

      if (!hasUserPreference) {
        this._isDarkMode = event.matches;
        this.applyTheme();
      }
    };

    this.mediaQuery.addEventListener("change", handler);
  }

  /**
   * Encontra e configura o botão de alternância de tema
   */
  private findThemeToggle(): void {
    this.themeToggle = document.getElementById("theme-toggle");

    if (this.themeToggle) {
      this.updateToggleIcon();
      this.themeToggle.addEventListener("click", () => this.toggle());
    } else {
      console.warn("⚠️ Botão de alternância de tema não encontrado");
    }
  }

  /**
   * Atualiza o ícone do botão de alternância
   */
  private updateToggleIcon(): void {
    if (!this.themeToggle) return;

    const icon = this.themeToggle.querySelector("i");
    if (icon) {
      icon.className = this._isDarkMode ? "fas fa-sun" : "fas fa-moon";
      this.themeToggle.title = this._isDarkMode
        ? "Alternar para tema claro"
        : "Alternar para tema escuro";
    }
  }

  /**
   * Alterna entre temas claro e escuro
   */
  public toggle(): void {
    this._isDarkMode = !this._isDarkMode;
    this.savePreference();
    this.applyTheme();
    this.updateToggleIcon();

    // Disparar evento customizado para outros módulos
    document.dispatchEvent(
      new CustomEvent<ThemeChangedEventDetail>("theme-changed", {
        detail: { isDarkMode: this._isDarkMode },
      })
    );
  }

  /**
   * Aplica o tema atual ao body
   */
  private applyTheme(): void {
    if (this._isDarkMode) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }

    // Adicionar classe de transição (após a primeira aplicação)
    if (!document.body.classList.contains("theme-initialized")) {
      setTimeout(() => {
        document.body.classList.add("theme-initialized");
      }, 100);
    }
  }

  /**
   * Ativa o modo escuro
   */
  public enableDarkMode(): void {
    if (!this._isDarkMode) {
      this._isDarkMode = true;
      this.savePreference();
      this.applyTheme();
      this.updateToggleIcon();
    }
  }

  /**
   * Ativa o modo claro
   */
  public enableLightMode(): void {
    if (this._isDarkMode) {
      this._isDarkMode = false;
      this.savePreference();
      this.applyTheme();
      this.updateToggleIcon();
    }
  }

  /**
   * Retorna o tema atual
   */
  public getCurrentTheme(): Theme {
    return this._isDarkMode ? "dark" : "light";
  }

  /**
   * Verifica se o modo escuro está ativo
   */
  public isDarkModeEnabled(): boolean {
    return this._isDarkMode;
  }
}

// ============================================================================
// INSTÂNCIA GLOBAL
// ============================================================================

let darkModeManagerInstance: DarkModeManager | null = null;

/**
 * Inicializa o gerenciador de tema escuro
 */
export function initDarkMode(): DarkModeManager {
  if (!darkModeManagerInstance) {
    darkModeManagerInstance = new DarkModeManager();
  }
  return darkModeManagerInstance;
}

/**
 * Obtém a instância do gerenciador
 */
export function getDarkModeManager(): DarkModeManager | null {
  return darkModeManagerInstance;
}

/**
 * Configura o tema escuro (conveniência para HTML)
 */
export function setupDarkMode(): void {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initDarkMode());
  } else {
    initDarkMode();
  }
}

// Exportar como default
export default DarkModeManager;
