/* ============================================================================
   DecisoesUsuario.ts — Contrato Formal de Decisões do Usuário
   Versão: 1.0.0 (TypeScript)
   Aplicação: Bíblia Responsiva — Domínio de Decisões

   RESPONSABILIDADE:
   - Definir contrato estrutural das decisões do usuário
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
   TIPOS FUNDAMENTAIS DE DECISÃO
============================================================================ */

/**
 * Categoria da decisão do usuário
 */
export type CategoriaDecisao = 
  | 'leitura'
  | 'navegacao'
  | 'configuracao'
  | 'reset'
  | 'reajuste'
  | 'exportacao'
  | 'importacao'
  | 'anotacoes';

/**
 * Prioridade da decisão
 */
export type PrioridadeDecisao = 'baixa' | 'media' | 'alta' | 'critica';

/**
 * Status da decisão
 */
export type StatusDecisao = 'pendente' | 'executada' | 'cancelada' | 'falha';

/* ============================================================================
   DECISÕES DE LEITURA
============================================================================ */

/**
 * Decisão de marcar dia como lido
 */
export interface DecisaoMarcarLido {
  readonly tipo: 'marcar-como-lido';
  readonly categoria: 'leitura';
  readonly numeroDia: number;
  readonly dataLeitura?: string;
  readonly notas?: string;
  readonly avaliacao?: number; // 1-5 estrelas
}

/**
 * Decisão de desmarcar dia como lido
 */
export interface DecisaoDesmarcarLido {
  readonly tipo: 'desmarcar-como-lido';
  readonly categoria: 'leitura';
  readonly numeroDia: number;
  readonly motivo?: string;
}

/**
 * Decisão de pular dia
 */
export interface DecisaoPularDia {
  readonly tipo: 'pular-dia';
  readonly categoria: 'leitura';
  readonly numeroDia: number;
  readonly motivo?: string;
}

/* ============================================================================
   DECISÕES DE NAVEGAÇÃO
============================================================================ */

/**
 * Decisão de navegar para dia específico
 */
export interface DecisaoNavegarDia {
  readonly tipo: 'navegar-para-dia';
  readonly categoria: 'navegacao';
  readonly numeroDia: number;
  readonly origem: 'calendario' | 'navegacao' | 'busca' | 'direto';
}

/**
 * Decisão de ir para próximo dia
 */
export interface DecisaoProximoDia {
  readonly tipo: 'proximo-dia';
  readonly categoria: 'navegacao';
  readonly diaAtual: number;
}

/**
 * Decisão de ir para dia anterior
 */
export interface DecisaoDiaAnterior {
  readonly tipo: 'dia-anterior';
  readonly categoria: 'navegacao';
  readonly diaAtual: number;
}

/* ============================================================================
   DECISÕES DE RESET
============================================================================ */

/**
 * Opções de reset
 */
export type OpcaoReset = 'completo' | 'dia-01-hoje' | 'parcial';

/**
 * Decisão de resetar progresso
 */
export interface DecisaoResetProgresso {
  readonly tipo: 'resetar-progresso';
  readonly categoria: 'reset';
  readonly opcao: OpcaoReset;
  readonly motivo?: string;
  readonly confirmado: boolean;
  readonly dataReset: string;
}

/* ============================================================================
   DECISÕES DE REAJUSTE
============================================================================ */

/**
 * Tipo de reajuste
 */
export type TipoReajuste = 'lacuna' | 'atraso' | 'adiantamento' | 'manual';

/**
 * Decisão de reajustar datas
 */
export interface DecisaoReajustarDatas {
  readonly tipo: 'reajustar-datas';
  readonly categoria: 'reajuste';
  readonly tipoReajuste: TipoReajuste;
  readonly diaReferencia: number;
  readonly novaData: string;
  readonly justificativa?: string;
  readonly confirmado: boolean;
}

/* ============================================================================
   DECISÕES DE CONFIGURAÇÃO
============================================================================ */

/**
 * Decisão de alterar configuração
 */
export interface DecisaoAlterarConfiguracao {
  readonly tipo: 'alterar-configuracao';
  readonly categoria: 'configuracao';
  readonly chave: string;
  readonly valorAnterior: unknown;
  readonly valorNovo: unknown;
  readonly aplicacao: 'imediata' | 'proximo-reinicio';
}

/**
 * Decisão de alterar tema
 */
export interface DecisaoAlterarTema {
  readonly tipo: 'alterar-tema';
  readonly categoria: 'configuracao';
  readonly tema: 'light' | 'dark' | 'auto';
  readonly temaAnterior: 'light' | 'dark' | 'auto';
}

/* ============================================================================
   DECISÕES DE ANOTAÇÕES
============================================================================ */

/**
 * Decisão de criar nota
 */
export interface DecisaoCriarNota {
  readonly tipo: 'criar-nota';
  readonly categoria: 'anotacoes';
  readonly numeroDia: number;
  readonly conteudo: string;
  readonly tags?: readonly string[];
}

/**
 * Decisão de editar nota
 */
export interface DecisaoEditarNota {
  readonly tipo: 'editar-nota';
  readonly categoria: 'anotacoes';
  readonly idNota: string;
  readonly conteudoAnterior: string;
  readonly conteudoNovo: string;
  readonly tagsAntigas?: readonly string[];
  readonly tagsNovas?: readonly string[];
}

/**
 * Decisão de remover nota
 */
export interface DecisaoRemoverNota {
  readonly tipo: 'remover-nota';
  readonly categoria: 'anotacoes';
  readonly idNota: string;
  readonly motivo?: string;
}

/* ============================================================================
   DECISÕES DE EXPORTAÇÃO/IMPORTAÇÃO
============================================================================ */

/**
 * Decisão de exportar dados
 */
export interface DecisaoExportarDados {
  readonly tipo: 'exportar-dados';
  readonly categoria: 'exportacao';
  readonly formato: 'json' | 'docx' | 'pdf';
  readonly incluirProgresso: boolean;
  readonly incluirAnotacoes: boolean;
  readonly destino: 'download' | 'email' | 'arquivo';
}

/**
 * Decisão de importar dados
 */
export interface DecisaoImportarDados {
  readonly tipo: 'importar-dados';
  readonly categoria: 'importacao';
  readonly formato: 'json' | 'docx';
  readonly substituirProgresso: boolean;
  readonly substituirAnotacoes: boolean;
  readonly arquivo: File;
}

/* ============================================================================
   TIPO UNIFICADO DE DECISÃO
============================================================================ */

/**
 * Tipo unificado de todas as decisões do usuário
 */
export type DecisaoUsuario = 
  | DecisaoMarcarLido
  | DecisaoDesmarcarLido
  | DecisaoPularDia
  | DecisaoNavegarDia
  | DecisaoProximoDia
  | DecisaoDiaAnterior
  | DecisaoResetProgresso
  | DecisaoReajustarDatas
  | DecisaoAlterarConfiguracao
  | DecisaoAlterarTema
  | DecisaoCriarNota
  | DecisaoEditarNota
  | DecisaoRemoverNota
  | DecisaoExportarDados
  | DecisaoImportarDados;

/* ============================================================================
   METADADOS DA DECISÃO
============================================================================ */

/**
 * Metadados de uma decisão
 */
export interface MetadadosDecisao {
  readonly id: string;
  readonly timestamp: string;
  readonly usuario?: string;
  readonly sessao?: string;
  readonly prioridade: PrioridadeDecisao;
  readonly status: StatusDecisao;
  readonly origem: 'ui' | 'api' | 'importacao' | 'sistema';
}

/**
 * Decisão completa com metadados
 */
export interface DecisaoCompleta {
  readonly decisao: DecisaoUsuario;
  readonly metadados: MetadadosDecisao;
  readonly resultado?: ResultadoDecisao;
}

/* ============================================================================
   RESULTADO DA DECISÃO
============================================================================ */

/**
 * Resultado de uma decisão executada
 */
export interface ResultadoDecisao {
  readonly sucesso: boolean;
  readonly mensagem?: string;
  readonly dados?: unknown;
  readonly erros?: readonly string[];
  readonly avisos?: readonly string[];
  readonly duracaoExecucao?: number; // milissegundos
}
