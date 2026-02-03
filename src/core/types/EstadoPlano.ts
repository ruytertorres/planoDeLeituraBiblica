/* ============================================================================
   EstadoPlano.ts — Contrato Formal do Estado do Plano
   Versão: 1.0.0 (TypeScript)
   Aplicação: Bíblia Responsiva — Domínio de Estado

   RESPONSABILIDADE:
   - Definir contrato estrutural do estado do plano
   - Formalizar tipos para validação estática
   - NÃO executar lógica
   - NÃO importar módulos do sistema
   - NÃO possuir efeitos colaterais

   CONTRATO:
   - Arquivo de tipo NÃO executa lógica (Seção 2.2 CONTRATO_DE_REMODULACAO_TS.MD)
   - Tipos descrevem contratos, não contêm regras de negócio
   - Reflete fielmente CONTRATO_DO_SISTEMA.md
============================================================================ */

/* ============================================================================
   TIPOS FUNDAMENTAIS DE ESTADO
============================================================================ */

/**
 * Estado de leitura de um dia específico
 */
export interface EstadoLeituraDia {
  readonly numero: number;
  readonly lido: boolean;
  readonly dataLeitura?: string;
  readonly tempoLeitura?: number; // minutos
  readonly notas?: string;
  readonly avaliacao?: number; // 1-5 estrelas
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

/* ============================================================================
   TIPOS DE PROGRESSO
============================================================================ */

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

/* ============================================================================
   TIPOS DE PERSISTÊNCIA
============================================================================ */

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
export type ChaveArmazenamento = 
  | 'estado-plano'
  | 'progresso-atual'
  | 'dias-bloqueados'
  | 'metas-progresso'
  | 'configuracoes-usuario';

/**
 * Operação de persistência
 */
export interface OperacaoPersistencia {
  readonly tipo: 'salvar' | 'carregar' | 'remover';
  readonly chave: ChaveArmazenamento;
  readonly dados?: unknown;
  readonly timestamp: string;
}

/* ============================================================================
   TIPOS DE SINCRONIZAÇÃO
============================================================================ */

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

/* ============================================================================
   TIPOS DE VALIDAÇÃO
============================================================================ */

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

/* ============================================================================
   TIPOS DE TRANSIÇÃO
============================================================================ */

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
export type AcaoEstado = 
  | 'marcar-como-lido'
  | 'desmarcar-como-lido'
  | 'pular-dia'
  | 'bloquear-dia'
  | 'desbloquear-dia'
  | 'resetar-progresso'
  | 'ajustar-data'
  | 'importar-estado';

/* ============================================================================
   TIPOS DE ESTATÍSTICAS
============================================================================ */

/**
 * Estatísticas detalhadas do estado
 */
export interface EstatisticasEstado {
  readonly tempoTotalLeitura: number; // minutos
  readonly mediaTempoPorDia: number; // minutos
  readonly maiorSequenciaConsecutiva: number;
  readonly sequenciaAtual: number;
  readonly diasDesdeInicio: number;
  readonly ritmoMedio: number; // dias por semana
  readonly previsaoConclusao?: string;
}
