/* ============================================================================
   PlanoManager.ts — Orquestrador de Plano Ativo
   Versão: 1.0.0 (TypeScript)
   Aplicação: Leitura Controlada da Bíblia

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------
   - Gerenciar o plano ativo
   - Navegar entre dias
   - Expor estado atual do plano
   - NÃO conter lógica de UI
   - NÃO conter persistência

   CONTRATO:
   - Implementa interface GerenciadorPlano dos contratos.types.ts
   - Respeita hierarquia de autoridade (Seção 4 CONTRATO_DO_SISTEMA.md)
============================================================================ */
/* ============================================================================
   CLASSE PLANOMANAGER
============================================================================ */
export class PlanoManager {
    /* --------------------------------------------------------------------------
       ATRIBUTOS PRIVADOS
       -------------------------------------------------------------------------- */
    plano;
    dias;
    totalDias;
    indiceAtual;
    /* --------------------------------------------------------------------------
       CONSTRUCTOR
       -------------------------------------------------------------------------- */
    /**
     * Cria um novo gerenciador de plano.
     *
     * @param plano - Plano cartucho válido
     * @throws Se o plano for inválido
     */
    constructor(plano) {
        if (!plano || !Array.isArray(plano.dias)) {
            throw new Error("Plano inválido fornecido ao PlanoManager.");
        }
        this.plano = plano;
        this.dias = plano.dias;
        this.totalDias = this.dias.length;
        this.indiceAtual = 0; // base 0
    }
    /* --------------------------------------------------------------------------
       ACESSO AO ESTADO
       -------------------------------------------------------------------------- */
    /**
     * Retorna o plano gerenciado.
     */
    getPlano() {
        return this.plano;
    }
    /**
     * Retorna o dia atual.
     */
    getDiaAtual() {
        return this.dias[this.indiceAtual] || null;
    }
    /**
     * Retorna o índice atual (base 0).
     */
    getIndiceAtual() {
        return this.indiceAtual;
    }
    /**
     * Retorna o total de dias do plano.
     */
    getTotalDias() {
        return this.totalDias;
    }
    /* --------------------------------------------------------------------------
       NAVEGAÇÃO
       -------------------------------------------------------------------------- */
    /**
     * Navega para um dia específico pelo número.
     *
     * @param numero - Número do dia (1-based)
     * @returns O dia encontrado ou null se não existir
     */
    irParaDia(numero) {
        const indice = this.dias.findIndex((d) => d.numero === numero);
        if (indice === -1) {
            return null;
        }
        this.indiceAtual = indice;
        const diaRetornado = this.getDiaAtual();
        return diaRetornado;
    }
    /**
     * Avança para o próximo dia.
     *
     * @returns O próximo dia ou o atual se já estiver no fim
     */
    proximoDia() {
        if (this.indiceAtual < this.totalDias - 1) {
            this.indiceAtual++;
        }
        return this.getDiaAtual();
    }
    /**
     * Volta para o dia anterior.
     *
     * @returns O dia anterior ou o atual se já estiver no início
     */
    diaAnterior() {
        if (this.indiceAtual > 0) {
            this.indiceAtual--;
        }
        return this.getDiaAtual();
    }
    /* --------------------------------------------------------------------------
       CONSULTAS
       -------------------------------------------------------------------------- */
    /**
     * Verifica se existe próximo dia.
     */
    temProximo() {
        return this.indiceAtual < this.totalDias - 1;
    }
    /**
     * Verifica se existe dia anterior.
     */
    temAnterior() {
        return this.indiceAtual > 0;
    }
    /**
     * Reseta para o primeiro dia.
     *
     * @returns O primeiro dia
     */
    resetar() {
        this.indiceAtual = 0;
        return this.getDiaAtual();
    }
    /**
     * Reseta o plano para começar a partir de um dia específico.
     * Usado para reset customizado (opção 2 do modal)
     *
     * @param numeroDia - Número do dia para começar (ex: 1)
     * @returns Objeto com resultado da operação
     *
     * @example
     * // Resetar para que dia 01 do plano = hoje
     * planoManager.resetarAPartirDoDia(1);
     * // { sucesso: true, dia: {...}, indice: 0 }
     */
    resetarAPartirDoDia(numeroDia) {
        const indice = this.dias.findIndex((d) => d.numero === numeroDia);
        if (indice === -1) {
            return {
                sucesso: false,
                erro: `Dia ${numeroDia} não encontrado no plano`,
            };
        }
        this.indiceAtual = indice;
        return {
            sucesso: true,
            dia: this.getDiaAtual(),
            indice: this.indiceAtual,
            descricao: `Plano resetado para começar no dia ${numeroDia}`,
        };
    }
    /* --------------------------------------------------------------------------
       MÉTODOS DE UTILIDADE
       -------------------------------------------------------------------------- */
    /**
     * Retorna o progresso atual como percentual.
     */
    getProgressoPercentual() {
        if (this.totalDias === 0)
            return 0;
        return Math.round(((this.indiceAtual + 1) / this.totalDias) * 100);
    }
    /**
     * Retorna informações resumidas do estado atual.
     */
    getEstadoResumido() {
        return {
            diaAtual: this.indiceAtual + 1,
            totalDias: this.totalDias,
            progressoPercentual: this.getProgressoPercentual(),
            temProximo: this.temProximo(),
            temAnterior: this.temAnterior(),
        };
    }
}
