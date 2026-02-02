"use strict";
/* ============================================================================
   BaseOrquestrador.js — Classe Base para Orquestradores
============================================================================
   Responsabilidade: Gerenciar lifecycle, listeners e plugins
   
   Funcionalidades:
   - Registro de listeners com cleanup automático (AbortController)
   - Sistema de plugins modular
   - Event emission customizado
   - Lifecycle management (init → destroy)
   
   Camada: ORQUESTRAÇÃO
============================================================================ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseOrquestrador = void 0;
/**
 * Classe base reutilizável para todos os orquestradores
 * Fornece infraestrutura para:
 * - Gerenciamento de listeners (com AbortController)
 * - Sistema de plugins
 * - Emissão de eventos
 * - Cleanup automático
 *
 * @example
 * class MeuOrquestrador extends BaseOrquestrador {
 *   constructor() {
 *     super("MeuOrquestrador");
 *   }
 *
 *   async init() {
 *     await this.initPlugins();
 *   }
 * }
 */
class BaseOrquestrador {
    /**
     * Construtor
     * @param {string} name - Nome do orquestrador (para debugging)
     */
    constructor(name = "BaseOrquestrador") {
        this.name = name;
        this.listeners = new Map(); // Rastrear todos os listeners
        this.controllers = new Map(); // AbortControllers associados
        this.state = {}; // Estado compartilhado
        this.plugins = []; // Plugins registrados
    }
    /**
     * Registrar listener com cleanup automático
     *
     * @param {HTMLElement|Document} target - Elemento alvo
     * @param {string} event - Nome do evento (ex: "click", "keydown")
     * @param {Function} handler - Função handler
     * @param {Object} options - Opções adicionais
     * @returns {AbortController} Controller para cleanup manual se necessário
     *
     * @example
     * const controller = orq.on(document, "click", () => console.log("click"));
     * controller.abort(); // Remove listener quando necessário
     *
     * @public
     */
    on(target, event, handler, options = {}) {
        if (!target) {
            console.warn(`[${this.name}] Tentativa de registrar listener em target null`);
            return null;
        }
        // Criar AbortController para este listener
        const controller = new AbortController();
        // Adicionar listener com signal
        target.addEventListener(event, handler, {
            ...options,
            signal: controller.signal,
        });
        // Rastrear listener para cleanup posterior
        const key = `${target.id || target.tagName || "unknown"}-${event}`;
        if (!this.listeners.has(key)) {
            this.listeners.set(key, []);
        }
        this.listeners.get(key).push({ handler, controller, target });
        return controller;
    }
    /**
     * Remover listeners de um elemento específico
     *
     * @param {HTMLElement} target - Elemento
     * @param {string} event - (Opcional) Nome do evento
     * @public
     */
    off(target, event = null) {
        if (!target)
            return;
        const key = `${target.id || target.tagName || "unknown"}${event ? `-${event}` : ""}`;
        if (this.listeners.has(key)) {
            const handlers = this.listeners.get(key);
            handlers.forEach(({ controller }) => controller.abort());
            this.listeners.delete(key);
        }
    }
    /**
     * Registrar plugin (adicionar funcionalidade modular)
     *
     * @param {Object} plugin - Objeto plugin com propriedade `init(orquestrador)`
     * @throws {Error} Se plugin não implementar método init()
     *
     * @example
     * class MeuPlugin {
     *   name = "MeuPlugin";
     *   async init(orquestrador) { ... }
     * }
     * orq.registerPlugin(new MeuPlugin());
     *
     * @public
     */
    registerPlugin(plugin) {
        if (!plugin || !plugin.init) {
            throw new Error(`Plugin inválido: deve ter método init(). Recebido: ${typeof plugin}`);
        }
        this.plugins.push(plugin);
    }
    /**
     * Inicializar todos os plugins registrados
     *
     * Cada plugin é inicializado sequencialmente.
     * Se um falhar, log de erro mas continua com os próximos.
     *
     * @public
     */
    async initPlugins() {
        for (const plugin of this.plugins) {
            try {
                await plugin.init(this);
                console.log(`✅ [${this.name}] Plugin "${plugin.name}" inicializado com sucesso`);
            }
            catch (error) {
                console.error(`❌ [${this.name}] Erro ao inicializar plugin "${plugin.name}":`, error);
            }
        }
    }
    /**
     * Emitir evento customizado
     *
     * @param {string} eventName - Nome do evento
     * @param {Object} detail - Dados do evento
     * @param {HTMLElement} target - (Opcional) Elemento alvo (padrão: document)
     *
     * @example
     * orq.emit("leitura-completa", { diasLidos: 365 });
     *
     * @public
     */
    emit(eventName, detail = {}, target = document) {
        target.dispatchEvent(new CustomEvent(eventName, {
            detail,
            bubbles: true,
            cancelable: true,
        }));
    }
    /**
     * Escutar evento customizado
     *
     * @param {string} eventName - Nome do evento
     * @param {Function} handler - Handler
     * @param {HTMLElement} target - (Opcional) Elemento alvo
     *
     * @example
     * orq.listen("leitura-completa", (e) => console.log(e.detail));
     *
     * @public
     */
    listen(eventName, handler, target = document) {
        target.addEventListener(eventName, handler);
        // Rastrear para cleanup
        const key = `event-${eventName}`;
        if (!this.listeners.has(key)) {
            this.listeners.set(key, []);
        }
        const controller = new AbortController();
        target.addEventListener(eventName, handler, { signal: controller.signal });
        this.listeners.get(key).push({ controller });
    }
    /**
     * Limpar todos os listeners e fazer cleanup
     *
     * Chamado automaticamente ao destruir orquestrador
     * ou pode ser chamado manualmente se necessário.
     *
     * @public
     */
    destroy() {
        // Abortar todos os listeners
        for (const [key, handlers] of this.listeners) {
            handlers.forEach(({ controller }) => {
                try {
                    controller.abort();
                }
                catch (e) {
                    // Ignorar erros de abort duplo
                }
            });
        }
        this.listeners.clear();
        this.plugins = [];
        this.state = {};
        console.log(`🧹 [${this.name}] Destruído com sucesso`);
    }
    /**
     * Log estruturado para debugging
     *
     * @param {string} level - "log", "warn", "error"
     * @param {string} message - Mensagem
     * @param {any} data - Dados adicionais
     * @private
     */
    _log(level, message, data = null) {
        const prefix = `[${this.name}]`;
        if (data) {
            console[level](`${prefix} ${message}`, data);
        }
        else {
            console[level](`${prefix} ${message}`);
        }
    }
}
exports.BaseOrquestrador = BaseOrquestrador;
