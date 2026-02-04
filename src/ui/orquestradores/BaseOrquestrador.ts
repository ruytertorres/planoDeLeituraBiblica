/* ============================================================================
   BaseOrquestrador.ts — Classe Base Tipada para Orquestradores
   Versão: 2.0.0 (TypeScript)
   ============================================================================

   RESPONSABILIDADE:
   - Gerenciar lifecycle, listeners e plugins
   - Fornecer infraestrutura de orquestração tipada
   - Garantir cleanup automático de recursos

   CONFORMIDADE COM CONTRATO_DO_SISTEMA.MD:
   - §4: Hierarquia de Autoridade (Orquestração)
   - §10: UI é reflexo do estado
   - Nenhuma regra de domínio aqui (apenas infraestrutura)

   Camada: ORQUESTRAÇÃO (§4)
   ============================================================================ */

/* ============================================================================
   TIPOS E INTERFACES
   ============================================================================ */

/**
 * Interface que todo plugin deve implementar
 * Contrato formal entre plugins e orquestrador
 */
export interface Plugin {
  /** Nome identificador do plugin */
  readonly name: string;

  /**
   * Inicializar plugin
   * @param orquestrador - Referência ao orquestrador pai
   */
  init(orquestrador: BaseOrquestrador): void | Promise<void>;
}

/**
 * Estrutura de um listener registrado
 */
interface ListenerEntry {
  handler: EventListener;
  controller: AbortController;
  target: EventTarget;
}

/**
 * Estado genérico do orquestrador
 */
type OrquestradorState = Record<string, unknown>;

/* ============================================================================
   CLASSE BASE ORQUESTRADOR
   ============================================================================ */

/**
 * Classe base abstrata para todos os orquestradores do sistema.
 *
 * Fornece:
 * - Gerenciamento de listeners com AbortController
 * - Sistema de plugins tipado
 * - Emissão de eventos customizados
 * - Lifecycle management (init → destroy)
 *
 * @example
 * class MeuOrquestrador extends BaseOrquestrador {
 *   constructor() {
 *     super("MeuOrquestrador");
 *   }
 *
 *   async init(): Promise<void> {
 *     await this.initPlugins();
 *   }
 * }
 */
export abstract class BaseOrquestrador {
  /** Nome identificador para debugging */
  protected readonly name: string;

  /** Mapa de listeners registrados por chave */
  protected listeners = new Map<string, ListenerEntry[]>();

  /** Estado compartilhado do orquestrador */
  protected state: OrquestradorState = {};

  /** Plugins registrados */
  protected plugins: Plugin[] = [];

  /** Flag de destruição */
  protected destroyed = false;

  /**
   * Cria nova instância do orquestrador base
   *
   * @param name - Nome identificador (para debugging)
   */
  constructor(name = "BaseOrquestrador") {
    this.name = name;
  }

  /* --------------------------------------------------------------------------
     MÉTODOS ABSTRATOS (devem ser implementados pelas subclasses)
     -------------------------------------------------------------------------- */

  /**
   * Inicializar o orquestrador
   * Chamado uma vez durante o lifecycle
   */
  abstract init(): void | Promise<void>;

  /* --------------------------------------------------------------------------
     GERENCIAMENTO DE LISTENERS
     -------------------------------------------------------------------------- */

  /**
   * Registrar listener com cleanup automático via AbortController
   *
   * @param target - Elemento alvo do evento
   * @param event - Nome do evento (ex: "click", "keydown")
   * @param handler - Função handler do evento
   * @param options - Opções adicionais do addEventListener
   * @returns AbortController para cleanup manual (opcional)
   *
   * @example
   * const ctrl = orq.on(document, "click", () => console.log("click"));
   * ctrl?.abort(); // Remove listener manualmente
   */
  on(
    target: EventTarget | null,
    event: string,
    handler: EventListener,
    options: AddEventListenerOptions = {},
  ): AbortController | null {
    if (!target) {
      this._log("warn", "Tentativa de registrar listener em target null");
      return null;
    }

    if (this.destroyed) {
      this._log("warn", "Orquestrador destruído, ignorando registro de listener");
      return null;
    }

    const controller = new AbortController();

    target.addEventListener(event, handler, {
      ...options,
      signal: controller.signal,
    });

    // Rastrear para cleanup posterior
    const key = this._generateListenerKey(target, event);
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key)!.push({ handler, controller, target });

    return controller;
  }

  /**
   * Remover listeners de um elemento específico
   *
   * @param target - Elemento alvo
   * @param event - (Opcional) Nome específico do evento
   */
  off(target: EventTarget | null, event?: string): void {
    if (!target) return;

    const key = this._generateListenerKey(target, event);

    if (event) {
      // Remover listeners específicos do evento
      const entries = this.listeners.get(key);
      if (entries) {
        entries.forEach(({ controller }) => controller.abort());
        this.listeners.delete(key);
      }
    } else {
      // Remover todos os listeners do target
      for (const [mapKey, entries] of this.listeners) {
        if (mapKey.startsWith(`${(target as HTMLElement).id || (target as HTMLElement).tagName || "unknown"}-`)) {
          entries.forEach(({ controller }) => controller.abort());
          this.listeners.delete(mapKey);
        }
      }
    }
  }

  /* --------------------------------------------------------------------------
     SISTEMA DE PLUGINS
     -------------------------------------------------------------------------- */

  /**
   * Registrar um plugin no orquestrador
   *
   * @param plugin - Plugin que implementa a interface Plugin
   * @throws Error se plugin for inválido
   */
  registerPlugin(plugin: Plugin): void {
    if (this.destroyed) {
      throw new Error(`[${this.name}] Orquestrador destruído, não pode registrar plugins`);
    }

    if (!plugin || typeof plugin.init !== "function") {
      throw new Error(
        `Plugin inválido: deve ter método init(). Recebido: ${typeof plugin}`,
      );
    }

    // Verificar duplicidade
    if (this.plugins.some((p) => p.name === plugin.name)) {
      this._log("warn", `Plugin "${plugin.name}" já registrado, ignorando`);
      return;
    }

    this.plugins.push(plugin);
    this._log("log", `Plugin "${plugin.name}" registrado`);
  }

  /**
   * Inicializar todos os plugins registrados sequencialmente
   *
   * Erros em um plugin não impedem os outros de inicializar
   */
  async initPlugins(): Promise<void> {
    for (const plugin of this.plugins) {
      try {
        await plugin.init(this);
        this._log("log", `Plugin "${plugin.name}" inicializado`);
      } catch (error) {
        this._log("error", `Erro ao inicializar plugin "${plugin.name}":`, error);
      }
    }
  }

  /**
   * Remover um plugin específico
   *
   * @param pluginName - Nome do plugin a remover
   */
  unregisterPlugin(pluginName: string): void {
    const index = this.plugins.findIndex((p) => p.name === pluginName);
    if (index === -1) {
      this._log("warn", `Plugin "${pluginName}" não encontrado`);
      return;
    }

    this.plugins.splice(index, 1);
    this._log("log", `Plugin "${pluginName}" removido`);
  }

  /* --------------------------------------------------------------------------
     EMISSÃO DE EVENTOS
     -------------------------------------------------------------------------- */

  /**
   * Emitir evento customizado
   *
   * @param eventName - Nome do evento
   * @param detail - Dados do evento
   * @param target - Elemento alvo (padrão: document)
   */
  emit(
    eventName: string,
    detail: Record<string, unknown> = {},
    target: EventTarget = document,
  ): void {
    if (this.destroyed) {
      this._log("warn", `Orquestrador destruído, ignorando emit: ${eventName}`);
      return;
    }

    target.dispatchEvent(
      new CustomEvent(eventName, {
        detail,
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  /**
   * Escutar evento customizado com rastreamento
   *
   * @param eventName - Nome do evento
   * @param handler - Handler do evento
   * @param target - Elemento alvo (padrão: document)
   */
  listen(
    eventName: string,
    handler: EventListener,
    target: EventTarget = document,
  ): void {
    if (this.destroyed) {
      this._log("warn", `Orquestrador destruído, ignorando listen: ${eventName}`);
      return;
    }

    // Usar o método on() para consistência
    this.on(target, eventName, handler);
  }

  /* --------------------------------------------------------------------------
     LIFECYCLE
     -------------------------------------------------------------------------- */

  /**
   * Destruir orquestrador e fazer cleanup de todos os recursos
   *
   * - Aborta todos os listeners
   * - Limpa plugins
   * - Reseta estado
   */
  destroy(): void {
    if (this.destroyed) {
      return;
    }

    this._log("log", "Destruindo orquestrador...");

    // Abortar todos os listeners
    for (const [, entries] of this.listeners) {
      entries.forEach(({ controller }) => {
        try {
          controller.abort();
        } catch {
          // Ignorar erros de abort duplo
        }
      });
    }

    this.listeners.clear();
    this.plugins = [];
    this.state = {};
    this.destroyed = true;

    this._log("log", "Orquestrador destruído");
  }

  /* --------------------------------------------------------------------------
     MÉTODOS UTILITÁRIOS (privados)
     -------------------------------------------------------------------------- */

  /**
   * Gerar chave única para identificar listeners
   */
  private _generateListenerKey(target: EventTarget, event?: string): string {
    const targetId = (target as HTMLElement).id || (target as HTMLElement).tagName || "unknown";
    return event ? `${targetId}-${event}` : targetId;
  }

  /**
   * Log estruturado para debugging
   */
  private _log(
    level: "log" | "warn" | "error",
    message: string,
    data?: unknown,
  ): void {
    const prefix = `[${this.name}]`;
    if (data !== undefined) {
      console[level](`${prefix} ${message}`, data);
    } else {
      console[level](`${prefix} ${message}`);
    }
  }
}

export default BaseOrquestrador;
