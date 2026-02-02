/* ============================================================================
   MainOrquestrador.ts — Orquestrador Principal Tipado
   Versão: 1.0.0 (TypeScript)
   Aplicação: Bíblia Responsiva — Migração Parcial

   RESPONSABILIDADE:
   - Substituir MainOrquestrador.js com tipagem forte
   - Gerenciar plugins e estado da aplicação
   - Integrar núcleo TypeScript com interface
   - Manter compatibilidade com código existente

   CONTRATO:
   - Implementar mesma interface do original JavaScript
   - Respeitar hierarquia (Seção 4 CONTRATO_DO_SISTEMA.md)
   - Nenhuma regra de domínio na UI
============================================================================ */

import { UIAdapter } from "../../compatibilidade/ui-adapter";
import type {
  PlanoCartucho,
  DiaDoPlano,
} from "../../core/types/contratos.types";

/* ============================================================================
   INTERFACES DE PLUGIN (Compatibilidade)
============================================================================ */

interface Plugin {
  readonly nome: string;
  readonly versao: string;
  init(adapter: UIAdapter): void;
  destroy(): void;
}

/* ============================================================================
   MAIN ORQUESTRADOR TIPO
============================================================================ */

export class MainOrquestrador {
  private adapter: UIAdapter;
  private plugins: Plugin[] = [];
  private initialized = false;
  private destroyed = false;

  /**
   * Cria novo orquestrador principal.
   *
   * @param plano - Plano cartucho válido
   */
  constructor(plano: PlanoCartucho) {
    this.adapter = new UIAdapter(plano);
  }

  /* --------------------------------------------------------------------------
     GERENCIAMENTO DE PLUGINS
     -------------------------------------------------------------------------- */

  /**
   * Registra um plugin no orquestrador.
   *
   * @param plugin - Plugin a ser registrado
   */
  registerPlugin(plugin: Plugin): void {
    if (this.destroyed) {
      console.warn(
        "⚠️ Orquestrador destruído, não é possível registrar plugins",
      );
      return;
    }

    if (this.plugins.find((p) => p.nome === plugin.nome)) {
      console.warn(`⚠️ Plugin '${plugin.nome}' já registrado`);
      return;
    }

    this.plugins.push(plugin);

    // Se já inicializado, inicializar o plugin imediatamente
    if (this.initialized) {
      try {
        plugin.init(this.adapter);
      } catch (error) {
        console.error(`❌ Erro ao inicializar plugin '${plugin.nome}':`, error);
      }
    }
  }

  /**
   * Remove um plugin do orquestrador.
   *
   * @param nome - Nome do plugin a ser removido
   */
  unregisterPlugin(nome: string): void {
    const index = this.plugins.findIndex((p) => p.nome === nome);
    if (index === -1) {
      console.warn(`⚠️ Plugin '${nome}' não encontrado`);
      return;
    }

    const plugin = this.plugins[index];

    try {
      plugin.destroy();
    } catch (error) {
      console.error(`❌ Erro ao destruir plugin '${nome}':`, error);
    }

    this.plugins.splice(index, 1);
  }

  /* --------------------------------------------------------------------------
     INICIALIZAÇÃO E LIFECYCLE
     -------------------------------------------------------------------------- */

  /**
   * Inicializa o orquestrador e todos os plugins.
   */
  async init(): Promise<void> {
    if (this.initialized) {
      console.warn("⚠️ Orquestrador já inicializado");
      return;
    }

    if (this.destroyed) {
      throw new Error(
        "Orquestrador foi destruído, não pode ser reinicializado",
      );
    }

    try {
      // Inicializar todos os plugins registrados
      for (const plugin of this.plugins) {
        try {
          plugin.init(this.adapter);
        } catch (error) {
          console.error(
            `❌ Erro ao inicializar plugin '${plugin.nome}':`,
            error,
          );
          // Continuar com outros plugins
        }
      }

      this.initialized = true;
    } catch (error) {
      console.error(
        "❌ Erro fatal na inicialização do MainOrquestrador:",
        error,
      );
      throw error;
    }
  }

  /**
   * Destrói o orquestrador e todos os plugins.
   */
  destroy(): void {
    if (this.destroyed) {
      console.warn("⚠️ Orquestrador já destruído");
      return;
    }

    // Destruir todos os plugins na ordem inversa
    for (let i = this.plugins.length - 1; i >= 0; i--) {
      const plugin = this.plugins[i];
      try {
        plugin.destroy();
      } catch (error) {
        console.error(`❌ Erro ao destruir plugin '${plugin.nome}':`, error);
      }
    }

    this.plugins = [];
    this.initialized = false;
    this.destroyed = true;
  }

  /* --------------------------------------------------------------------------
     ACESSO AO ADAPTER (Compatibilidade)
     -------------------------------------------------------------------------- */

  /**
   * Retorna o adaptador UI.
   */
  getAdapter(): UIAdapter {
    return this.adapter;
  }

  /**
   * Retorna o plano gerenciado.
   */
  getPlano(): PlanoCartucho {
    return this.adapter.getPlano();
  }

  /**
   * Retorna o dia atual.
   */
  getDiaAtual(): DiaDoPlano | null {
    return this.adapter.getDiaAtual();
  }

  /* --------------------------------------------------------------------------
     MÉTODOS DE NAVEGAÇÃO (Delegação para Adapter)
     -------------------------------------------------------------------------- */

  irParaDia(numero: number): DiaDoPlano | null {
    return this.adapter.irParaDia(numero);
  }

  proximoDia(): DiaDoPlano | null {
    return this.adapter.proximoDia();
  }

  diaAnterior(): DiaDoPlano | null {
    return this.adapter.diaAnterior();
  }

  temProximo(): boolean {
    return this.adapter.temProximo();
  }

  temAnterior(): boolean {
    return this.adapter.temAnterior();
  }

  resetar(): DiaDoPlano | null {
    return this.adapter.resetar();
  }

  /* --------------------------------------------------------------------------
     MÉTODOS DE INFORMAÇÃO
     -------------------------------------------------------------------------- */

  getEstadoResumido(): {
    diaAtual: number;
    totalDias: number;
    progressoPercentual: number;
    temProximo: boolean;
    temAnterior: boolean;
  } {
    return this.adapter.getEstadoResumido();
  }

  getTotalDias(): number {
    return this.adapter.getTotalDias();
  }

  getIndiceAtual(): number {
    return this.adapter.getIndiceAtual();
  }

  /* --------------------------------------------------------------------------
     STATUS
     -------------------------------------------------------------------------- */

  isInitialized(): boolean {
    return this.initialized;
  }

  isDestroyed(): boolean {
    return this.destroyed;
  }

  getPluginsRegistrados(): string[] {
    return this.plugins.map((p) => p.nome);
  }
}

/* ============================================================================
   EXPORTAÇÃO GLOBAL (Compatibilidade)
============================================================================ */

// Expor globalmente para compatibilidade com código existente
if (typeof window !== "undefined") {
  (window as any).MainOrquestrador = MainOrquestrador;
}
