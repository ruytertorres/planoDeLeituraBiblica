/**
 * Estado de leitura de um dia específico
 */
export interface EstadoLeituraDia {
    readonly numero: number;
    readonly lido: boolean;
    readonly dataLeitura?: string;
    readonly tempoLeitura?: number;
    readonly notas?: string;
    readonly avaliacao?: number;
}
/**
 * Estado geral do plano
 */
export interface EstadoPlano {
    readonly id: string;
    readonly diaAtual: number;
    readonly diasLidos: readonly number[];
    readonly diasPulados: readonly number[];
    readonly diasBloqueados: readonly number[];
    readonly dataInicio: string;
    readonly dataUltimaAtualizacao: string;
    readonly totalDias: number;
}
/**
 * Progresso detalhado do plano
 */
export interface ProgressoPlano {
    readonly totalDias: number;
    readonly diasLidos: number;
    readonly diasPulados: number;
    readonly diasBloqueados: number;
    readonly diasRestantes: number;
    readonly percentualConclusao: number;
    readonly percentualLidos: number;
    readonly ultimoDiaLido: number | null;
    readonly proximoDiaNaoLido: number | null;
    readonly diasConsecutivos: number;
    readonly mediaDiasPorSemana: number;
}
/**
 * Meta de progresso
 */
export interface MetaProgresso {
    readonly tipo: 'diario' | 'semanal' | 'mensal';
    readonly quantidade: number;
    readonly dataInicio: string;
    readonly dataFim?: string;
    readonly concluida: boolean;
    readonly progressoAtual: number;
}
/**
 * Dados para persistência do estado
 */
export interface DadosPersistencia {
    readonly estado: EstadoPlano;
    readonly progresso: ProgressoPlano;
    readonly metas: readonly MetaProgresso[];
    readonly dataSalvamento: string;
    readonly versaoFormato: string;
}
/**
 * Chave de armazenamento
 */
export type ChaveArmazenamento = 'estado-plano' | 'progresso-atual' | 'dias-bloqueados' | 'metas-progresso' | 'configuracoes-usuario';
/**
 * Operação de persistência
 */
export interface OperacaoPersistencia {
    readonly tipo: 'salvar' | 'carregar' | 'remover';
    readonly chave: ChaveArmazenamento;
    readonly dados?: unknown;
    readonly timestamp: string;
}
/**
 * Estado de sincronização
 */
export interface EstadoSincronizacao {
    readonly sincronizado: boolean;
    readonly dataUltimaSincronizacao?: string;
    readonly conflitos: readonly ConflitoSincronizacao[];
    readonly pendente: boolean;
}
/**
 * Conflito de sincronização
 */
export interface ConflitoSincronizacao {
    readonly campo: string;
    readonly valorLocal: unknown;
    readonly valorRemoto: unknown;
    readonly dataLocal: string;
    readonly dataRemota: string;
    readonly resolvido: boolean;
}
/**
 * Resultado da validação do estado
 */
export interface ResultadoValidacaoEstado {
    readonly valido: boolean;
    readonly erros: readonly string[];
    readonly avisos: readonly string[];
    readonly inconsistencias: readonly InconsistenciaEstado[];
}
/**
 * Inconsistência no estado
 */
export interface InconsistenciaEstado {
    readonly tipo: 'dia-inexistente' | 'progresso-invalido' | 'data-invalida' | 'estado-inconsistente';
    readonly descricao: string;
    readonly severidade: 'baixa' | 'media' | 'alta' | 'critica';
    readonly dados?: unknown;
}
/**
 * Transição de estado
 */
export interface TransicaoEstado {
    readonly de: EstadoPlano;
    readonly para: EstadoPlano;
    readonly acao: AcaoEstado;
    readonly timestamp: string;
    readonly justificativa?: string;
}
/**
 * Ação que causa transição
 */
export type AcaoEstado = 'marcar-como-lido' | 'desmarcar-como-lido' | 'pular-dia' | 'bloquear-dia' | 'desbloquear-dia' | 'resetar-progresso' | 'ajustar-data' | 'importar-estado';
/**
 * Estatísticas detalhadas do estado
 */
export interface EstatisticasEstado {
    readonly tempoTotalLeitura: number;
    readonly mediaTempoPorDia: number;
    readonly maiorSequenciaConsecutiva: number;
    readonly sequenciaAtual: number;
    readonly diasDesdeInicio: number;
    readonly ritmoMedio: number;
    readonly previsaoConclusao?: string;
}
//# sourceMappingURL=EstadoPlano.d.ts.map