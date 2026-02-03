/* ============================================================================
   DiaDoPlano.ts — Contrato Formal do Dia de Leitura
   Versão: 1.0.0 (TypeScript)
   Aplicação: Bíblia Responsiva — Domínio de Dias

   RESPONSABILIDADE:
   - Definir contrato estrutural do dia de leitura
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
   TIPOS FUNDAMENTAIS DO DIA
============================================================================ */

/**
 * Trecho bíblico individual
 */
export interface TrechoBiblico {
  readonly livro: string;
  readonly capitulo: number;
  readonly versiculo: number;
  readonly versiculoFinal?: number;
}

/**
 * Tipo de leitura do dia
 */
export type TipoLeitura = 'antigoTestamento' | 'novoTestamento' | 'ambos';

/**
 * Estado do dia
 */
export type EstadoDia = 'pendente' | 'lido' | 'bloqueado' | 'pulado';

/**
 * Prioridade do dia
 */
export type PrioridadeDia = 'normal' | 'importante' | 'urgente';

/* ============================================================================
   CONTRATO PRINCIPAL DO DIA
============================================================================ */

/**
 * Dia de leitura completo
 */
export interface DiaDoPlano {
  readonly numero: number;
  readonly data: string; // ISO format YYYY-MM-DD
  readonly dataFormatada: string; // DD/MM/YYYY
  readonly antigoTestamento: readonly TrechoBiblico[];
  readonly novoTestamento: readonly TrechoBiblico[];
  readonly livros: readonly string[];
  readonly capitulos: readonly number[];
  readonly versiculos: readonly number[];
  readonly observacoes?: string;
  readonly tipo: TipoLeitura;
  readonly estado: EstadoDia;
  readonly prioridade: PrioridadeDia;
}

/* ============================================================================
   TIPOS DE RENDERIZAÇÃO
============================================================================ */

/**
 * Opções de renderização do dia
 */
export interface OpcoesRenderizacao {
  readonly mostrarProgresso?: boolean;
  readonly tema?: 'light' | 'dark';
  readonly compacto?: boolean;
  readonly mostrarData?: boolean;
  readonly mostrarObservacoes?: boolean;
}

/**
 * Eventos do dia
 */
export interface EventosDia {
  onDiaChange?: (dia: DiaDoPlano) => void;
  onProgressoUpdate?: (progresso: number) => void;
  onEstadoChange?: (estado: EstadoDia) => void;
}

/* ============================================================================
   TIPOS DE VALIDAÇÃO
============================================================================ */

/**
 * Resultado da validação do dia
 */
export interface ResultadoValidacaoDia {
  readonly valido: boolean;
  readonly erros: readonly string[];
  readonly avisos: readonly string[];
}

/**
 * Critérios de validação do dia
 */
export interface CriteriosValidacaoDia {
  readonly verificarDataValida: boolean;
  readonly verificarTrechosValidos: boolean;
  readonly verificarLivrosValidos: boolean;
  readonly verificarCapitulosValidos: boolean;
}

/* ============================================================================
   TIPOS DE COMPARAÇÃO
============================================================================ */

/**
 * Comparador de dias
 */
export type ComparadorDias = (a: DiaDoPlano, b: DiaDoPlano) => number;

/**
 * Filtros de dias
 */
export interface FiltroDias {
  readonly estado?: EstadoDia;
  readonly tipo?: TipoLeitura;
  readonly prioridade?: PrioridadeDia;
  readonly livros?: readonly string[];
  readonly dataInicio?: string;
  readonly dataFim?: string;
}

/* ============================================================================
   TIPOS DE ESTATÍSTICAS
============================================================================ */

/**
 * Estatísticas do dia
 */
export interface EstatisticasDia {
  readonly totalVersiculos: number;
  readonly totalCapitulos: number;
  readonly totalLivros: number;
  readonly percentualAntigoTestamento: number;
  readonly percentualNovoTestamento: number;
}

/* ============================================================================
   TIPOS DE NOTAS
============================================================================ */

/**
 * Nota do dia
 */
export interface NotaDia {
  readonly numero: number;
  readonly conteudo: string;
  readonly dataCriacao: string;
  readonly dataUltimaModificacao?: string;
  readonly tags?: readonly string[];
}

/**
 * Anotações do dia
 */
export interface AnotacoesDia {
  readonly numero: number;
  readonly notas: readonly NotaDia[];
  readonly totalNotas: number;
}
