/* ============================================================================
   MainOrquestradorTipado.ts — Orquestrador Principal Simplificado
   Versão: 1.0.0 (TypeScript)
   Aplicação: Bíblia Responsiva — UI Orquestradores

   RESPONSABILIDADE:
   - Orquestrar UI básica com tipagem forte
   - Gerenciar estado simples
   - Implementar navegação e eventos básicos

   CONTRATO:
   - Tipagem forte para estado e eventos
   - Interface simples e funcional
   - Sem dependências externas complexas
============================================================================ */
/* ============================================================================
   ORQUESTRADOR PRINCIPAL
============================================================================ */
/**
 * Orquestrador principal tipado simplificado
 */
export class MainOrquestradorTipado {
    plano;
    estado;
    eventos;
    initialized = false;
    constructor(plano, eventos) {
        this.plano = plano;
        this.eventos = eventos || {};
        this.estado = {
            diaAtual: 1,
            diasLidos: [],
            diasBloqueados: [],
            tema: 'light'
        };
    }
    /**
     * Inicializa o orquestrador
     */
    async init() {
        if (this.initialized) {
            throw new Error('Orquestrador já foi inicializado');
        }
        try {
            // Configurar eventos básicos
            this.configurarEventos();
            // Renderizar UI inicial
            await this.renderizarUI();
            this.initialized = true;
            console.log('✅ MainOrquestradorTipado inicializado');
        }
        catch (error) {
            console.error('❌ Erro ao inicializar:', error);
            throw error;
        }
    }
    /**
     * Navega para um dia específico
     */
    async navegarParaDia(numeroDia) {
        try {
            if (numeroDia < 1 || numeroDia > this.plano.length) {
                return false;
            }
            if (this.estado.diasBloqueados.includes(numeroDia)) {
                console.warn(`Dia ${numeroDia} está bloqueado`);
                return false;
            }
            this.estado = {
                ...this.estado,
                diaAtual: numeroDia
            };
            await this.renderizarDiaAtual();
            this.eventos.onDiaChange?.(this.plano[numeroDia - 1]);
            return true;
        }
        catch (error) {
            console.error('Erro ao navegar:', error);
            return false;
        }
    }
    /**
     * Marca dia como lido
     */
    async marcarComoLido(numeroDia) {
        if (!this.estado.diasLidos.includes(numeroDia)) {
            this.estado = {
                ...this.estado,
                diasLidos: [...this.estado.diasLidos, numeroDia]
            };
            await this.renderizarDiaAtual();
            this.atualizarEstatisticas();
        }
    }
    /**
     * Desmarca dia como lido
     */
    async desmarcarComoLido(numeroDia) {
        this.estado = {
            ...this.estado,
            diasLidos: this.estado.diasLidos.filter(d => d !== numeroDia)
        };
        await this.renderizarDiaAtual();
        this.atualizarEstatisticas();
    }
    /**
     * Altera tema
     */
    alterarTema(tema) {
        this.estado = { ...this.estado, tema };
        document.body.className = document.body.className.replace(/light-mode|dark-mode/g, '');
        document.body.classList.add(`${tema}-mode`);
        this.eventos.onTemaChange?.(tema);
    }
    /**
     * Obtém estado atual
     */
    obterEstado() {
        return this.estado;
    }
    /**
     * Destrói o orquestrador
     */
    destroy() {
        this.initialized = false;
        console.log('✅ MainOrquestradorTipado destruído');
    }
}
