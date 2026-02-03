/* ============================================================================
   PlanoCartucho.ts — Contrato Formal do Plano de Leitura
   Versão: 1.0.0 (TypeScript)
   Aplicação: Bíblia Responsiva — Domínio de Planos

   RESPONSABILIDADE:
   - Definir contrato estrutural do plano de leitura
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
   TIPOS FUNDAMENTAIS DO PLANO
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
 * Dia de leitura completo
 */
export interface DiaDoPlano {
  readonly numero: number;
  readonly data: string; // ISO format
  readonly dataFormatada: string; // DD/MM/YYYY
  readonly antigoTestamento: readonly TrechoBiblico[];
  readonly novoTestamento: readonly TrechoBiblico[];
  readonly livros: readonly string[];
  readonly capitulos: readonly number[];
  readonly versiculos: readonly number[];
  readonly observacoes?: string;
}

/**
 * Metadados do plano
 */
export interface MetadadosPlano {
  readonly id: string;
  readonly nome: string;
  readonly descricao?: string;
  readonly autor?: string;
  readonly versao: string;
  readonly totalDias: number;
  readonly dataCriacao?: string;
  readonly dataUltimaModificacao?: string;
}

/**
 * Plano completo de leitura
 */
export interface PlanoCartucho {
  readonly metadados: MetadadosPlano;
  readonly dias: readonly DiaDoPlano[];
}

/* ============================================================================
   TIPOS DE VALIDAÇÃO
============================================================================ */

/**
 * Resultado da validação do plano
 */
export interface ResultadoValidacao {
  readonly valido: boolean;
  readonly erros: readonly string[];
  readonly avisos: readonly string[];
}

/**
 * Critérios de validação do plano
 */
export interface CriteriosValidacao {
  readonly verificarDiasConsecutivos: boolean;
  readonly verificarCapitulosValidos: boolean;
  readonly verificarLivrosValidos: boolean;
  readonly verificarDatasValidas: boolean;
}

/* ============================================================================
   TIPOS DE ESTADO E PROGRESSO
============================================================================ */

/**
 * Estado de leitura de um dia
 */
export interface EstadoLeituraDia {
  readonly numero: number;
  readonly lido: boolean;
  readonly dataLeitura?: string;
  readonly notas?: string;
}

/**
 * Progresso geral do plano
 */
export interface ProgressoPlano {
  readonly diasLidos: readonly number[];
  readonly ultimoDiaLido: number | null;
  readonly totalLidos: number;
  readonly percentualConclusao: number;
  readonly dataInicio?: string;
  readonly dataUltimaLeitura?: string;
}

/* ============================================================================
   TIPOS DE CONFIGURAÇÃO
============================================================================ */

/**
 * Configurações do plano
 */
export interface ConfiguracaoPlano {
  readonly permitirPularDias: boolean;
  readonly exigirLeituraConsecutiva: boolean;
  readonly mostrarProgresso: boolean;
  readonly permitirNotas: boolean;
}

/* ============================================================================
   TIPOS DE EXPORTAÇÃO/IMPORTAÇÃO
============================================================================ */

/**
 * Formato de exportação do plano
 */
export interface PlanoExportado {
  readonly plano: PlanoCartucho;
  readonly progresso: ProgressoPlano;
  readonly configuracoes: ConfiguracaoPlano;
  readonly dataExportacao: string;
  readonly versaoFormato: string;
}

/**
 * Dados necessários para importar plano
 */
export interface DadosImportacaoPlano {
  readonly arquivo: File | string;
  readonly substituirProgresso: boolean;
  readonly manterConfiguracoes: boolean;
}
