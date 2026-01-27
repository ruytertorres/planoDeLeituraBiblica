/* ============================================================================
   darkmode.js — Sistema de Tema Escuro
   Versão: 1.0.0
   Aplicação: Leitura Bíblica Cronológica

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------
   - Gerenciar alternância entre tema claro e escuro
   - Persistir preferência do usuário
   - Sincronizar com preferência do sistema
   - NÃO conter lógica de UI específica
   - NÃO depender de outros módulos
============================================================================ */

export class DarkModeManager {
  constructor() {
    this.storageKey = "dark_mode_preference";
    this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    this.themeToggle = null;

    this.init();
  }

  /* ========================================================================
     INICIALIZAÇÃO
  ======================================================================== */

  init() {
    // 1. Carregar preferência salva ou detectar do sistema
    this.loadPreference();

    // 2. Configurar listener para mudanças do sistema
    this.setupSystemPreferenceListener();

    // 3. Encontrar e configurar botão de alternância
    this.findThemeToggle();

    // 4. Aplicar tema inicial
    this.applyTheme();
  }

  /* ========================================================================
     GERENCIAMENTO DE PREFERÊNCIAS
  ======================================================================== */

  loadPreference() {
    try {
      const savedPreference = localStorage.getItem(this.storageKey);

      if (savedPreference !== null) {
        // Usar preferência salva
        this.isDarkMode = savedPreference === "true";
      } else {
        // Se não houver preferência salva, usar preferência do sistema
        this.isDarkMode = this.mediaQuery.matches;
      }
    } catch (error) {
      console.error("❌ Erro ao carregar preferência do tema:", error);
      // Fallback para tema claro
      this.isDarkMode = false;
    }
  }

  savePreference() {
    try {
      localStorage.setItem(this.storageKey, this.isDarkMode.toString());
    } catch (error) {
      console.error("❌ Erro ao salvar preferência do tema:", error);
    }
  }

  /* ========================================================================
     DETECÇÃO DE PREFERÊNCIA DO SISTEMA
  ======================================================================== */

  setupSystemPreferenceListener() {
    this.mediaQuery.addEventListener("change", (event) => {
      // Só mudar se o usuário não tiver uma preferência explícita
      const hasUserPreference = localStorage.getItem(this.storageKey) !== null;

      if (!hasUserPreference) {
        this.isDarkMode = event.matches;
        this.applyTheme();
      }
    });
  }

  /* ========================================================================
     CONTROLE DO BOTÃO DE ALTERNÂNCIA
  ======================================================================== */

  findThemeToggle() {
    this.themeToggle = document.getElementById("theme-toggle");

    if (this.themeToggle) {
      this.updateToggleIcon();
      this.themeToggle.addEventListener("click", () => this.toggle());
    } else {
      console.warn("⚠️ Botão de alternância de tema não encontrado");
    }
  }

  updateToggleIcon() {
    if (!this.themeToggle) return;

    const icon = this.themeToggle.querySelector("i");
    if (icon) {
      icon.className = this.isDarkMode ? "fas fa-sun" : "fas fa-moon";
      this.themeToggle.title = this.isDarkMode
        ? "Alternar para tema claro"
        : "Alternar para tema escuro";
    }
  }

  /* ========================================================================
     CONTROLE DO TEMA
  ======================================================================== */

  toggle() {
    this.isDarkMode = !this.isDarkMode;
    this.savePreference();
    this.applyTheme();
    this.updateToggleIcon();

    // Disparar evento customizado para outros módulos
    document.dispatchEvent(
      new CustomEvent("theme-changed", {
        detail: { isDarkMode: this.isDarkMode },
      }),
    );
  }

  applyTheme() {
    if (this.isDarkMode) {
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

  /* ========================================================================
     API PÚBLICA
  ======================================================================== */

  enableDarkMode() {
    if (!this.isDarkMode) {
      this.isDarkMode = true;
      this.savePreference();
      this.applyTheme();
      this.updateToggleIcon();
    }
  }

  enableLightMode() {
    if (this.isDarkMode) {
      this.isDarkMode = false;
      this.savePreference();
      this.applyTheme();
      this.updateToggleIcon();
    }
  }

  getCurrentTheme() {
    return this.isDarkMode ? "dark" : "light";
  }

  isDarkModeEnabled() {
    return this.isDarkMode;
  }
}

/* ========================================================================
   INICIALIZAÇÃO GLOBAL
   Para uso imediato no main.js
======================================================================= */

let darkModeManagerInstance = null;

export function initDarkMode() {
  if (!darkModeManagerInstance) {
    darkModeManagerInstance = new DarkModeManager();
  }
  return darkModeManagerInstance;
}

export function getDarkModeManager() {
  return darkModeManagerInstance;
}

/* ========================================================================
   FUNÇÃO DE CONVENIÊNCIA PARA HTML
   Para inicializar diretamente no HTML se necessário
======================================================================= */

export function setupDarkMode() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initDarkMode());
  } else {
    initDarkMode();
  }
}
