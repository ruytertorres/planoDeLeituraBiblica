/* ============================================================================
   index.ts — Ponto de Entrada Unificado dos Tipos
   Versão: 1.0.0 (TypeScript)
   Aplicação: Bíblia Responsiva — Domínio de Tipos

   RESPONSABILIDADE:
   - Exportar todos os tipos contratuais do sistema
   - Servir como ponto central de importação de tipos
   - NÃO executar lógica
   - NÃO importar módulos do sistema
   - NÃO possuir efeitos colaterais

   CONTRATO:
   - Arquivo de tipo NÃO executa lógica (Seção 2.2 CONTRATO_DE_REMODULACAO_TS.MD)
   - Centralizar exportações para facilitar migração
   - Reflete fielmente CONTRATO_DO_SISTEMA.md
============================================================================ */

/* ============================================================================
   EXPORTAÇÃO PRINCIPAL DOS TIPOS
============================================================================ */

// Tipos fundamentais do plano
export type {
  PlanoCartucho,
  MetadadosPlano,
  TrechoBiblico,
  ResultadoValidacao,
  CriteriosValidacao,
  ConfiguracaoPlano,
  PlanoExportado,
  DadosImportacaoPlano,
} from "./PlanoCartucho";

// Tipos fundamentais do dia
export type {
  DiaDoPlano as DiaDoPlanoType,
  TipoLeitura,
  EstadoDia,
  PrioridadeDia,
  OpcoesRenderizacao,
  EventosDia,
  ResultadoValidacaoDia,
  CriteriosValidacaoDia,
  ComparadorDias,
  FiltroDias,
  EstatisticasDia,
  NotaDia,
  AnotacoesDia,
} from "./DiaDoPlano";

// Tipos de estado e progresso
export type {
  EstadoLeituraDia as EstadoLeituraDiaType,
  EstadoPlano as EstadoPlanoType,
  ProgressoPlano as ProgressoPlanoType,
  MetaProgresso,
  DadosPersistencia,
  ChaveArmazenamento,
  OperacaoPersistencia,
  EstadoSincronizacao,
  ConflitoSincronizacao,
  ResultadoValidacaoEstado,
  InconsistenciaEstado,
  TransicaoEstado,
  AcaoEstado,
  EstatisticasEstado,
} from "./EstadoPlano";

// Tipos de decisões do usuário
export type {
  CategoriaDecisao,
  PrioridadeDecisao,
  StatusDecisao,
  DecisaoMarcarLido,
  DecisaoDesmarcarLido,
  DecisaoPularDia,
  DecisaoNavegarDia,
  DecisaoProximoDia,
  DecisaoDiaAnterior,
  DecisaoResetProgresso,
  DecisaoReajustarDatas,
  DecisaoAlterarConfiguracao,
  DecisaoAlterarTema,
  DecisaoCriarNota,
  DecisaoEditarNota,
  DecisaoRemoverNota,
  DecisaoExportarDados,
  DecisaoImportarDados,
  DecisaoUsuario,
  MetadadosDecisao,
  DecisaoCompleta,
  ResultadoDecisao,
  OpcaoReset,
  TipoReajuste,
} from "./DecisoesUsuario";

/* ============================================================================
   TIPOS LEGADOS (Compatibilidade)
============================================================================ */

/**
 * Tipo legado para compatibilidade com código existente
 * @deprecated Usar PlanoCartucho em novo código
 */
export type PlanoCartuchoLegado = import("./PlanoCartucho").PlanoCartucho;

/**
 * Tipo legado para compatibilidade com código existente
 * @deprecated Usar DiaDoPlano em novo código
 */
export type DiaDoPlanoLegado = import("./DiaDoPlano").DiaDoPlano;

/* ============================================================================
   TIPOS DE COMPATIBILIDADE COM JAVASCRIPT
============================================================================ */

/**
 * Tipo para objetos genéricos do JavaScript
 */
export type ObjetoGenerico = Record<string, unknown>;

/**
 * Tipo para arrays genéricos do JavaScript
 */
export type ArrayGenerica<T = unknown> = readonly T[];

/**
 * Tipo para funções de callback
 */
export type Callback<T = void> = (data?: T) => void;

/**
 * Tipo para promessas genéricas
 */
export type PromessaGenerica<T = unknown> = Promise<T>;

/* ============================================================================
   TIPOS DE UTILIDADE
============================================================================ */

/**
 * Tipo que torna todas as propriedades opcionais
 */
export type Parcial<T> = {
  readonly [P in keyof T]?: T[P];
};

/**
 * Tipo que torna todas as propriedades obrigatórias
 */
export type Obrigatorio<T> = {
  readonly [P in keyof T]-?: T[P];
};

/**
 * Tipo que seleciona apenas certas propriedades
 */
export type Selecionar<T, K extends keyof T> = Pick<T, K>;

/**
 * Tipo que omite certas propriedades
 */
export type Omitir<T, K extends keyof T> = Omit<T, K>;

/* ============================================================================
   DECLARAÇÃO FINAL
============================================================================ */

/**
 * Este arquivo serve como ponto central para todos os tipos contratuais
 * do sistema, facilitando a migração gradual para TypeScript.
 *
 * Uso recomendado:
 *
 * ```typescript
 * import type { PlanoCartucho, DiaDoPlano, DecisaoUsuario } from './types';
 * ```
 */
