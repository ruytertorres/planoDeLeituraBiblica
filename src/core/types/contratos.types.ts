/* ============================================================================
   contratos.types.ts — Contratos Conceituais como Tipos TypeScript
   Versão: 1.0.0
   Aplicação: Bíblia Responsiva — Domínio de Planos, Tempo e Orquestração

   RESPONSABILIDADE:
   - Formalizar contratos conceituais do CONTRATO_DO_SISTEMA.md como tipos
   - Servir como fonte de verdade estrutural para TypeScript
   - NÃO executar lógica, NÃO importar módulos do sistema
   - NÃO possuir efeitos colaterais

   PRINCÍPIO:
   - Tipos descrevem contratos, impõem limites estruturais
   - Tipos NÃO substituem validações conceituais
   - TypeScript atua como mecanismo de garantia, nunca como motor decisório
============================================================================ */

/* ============================================================================
   CONTRATO DE ESTADO DO PLANO (Seção 7 do CONTRATO_DO_SISTEMA.md)
============================================================================ */

export type EstadoPlano =
  | "ATIVO"
  | "ATRASADO"
  | "AGUARDANDO_DECISAO"
  | "FIM_DE_CICLO"
  | "CONCLUIDO"
  | "ENCERRADO";

/* ============================================================================
   CONTRATO DE DECISÕES DO USUÁRIO (Seção 9 do CONTRATO_DO_SISTEMA.md)
============================================================================ */

export type DecisaoUsuario =
  | "continuar_adaptando"
  | "reset_inteligente"
  | "reset_total"
  | "continuar_novo_ciclo"
  | "encerrar_plano"
  | "adiar_decisao";

/* ============================================================================
   CONTRATO DE PROGRESSO DE LEITURA (Seção 13 do CONTRATO_DO_SISTEMA.md)
============================================================================ */

export interface ProgressoLeitura {
  readonly diasLidos: number;
  readonly ultimoDiaLido: number | null;
  readonly dataUltimaLeitura: string | null;
  readonly historico: readonly DiaLido[];
}

export interface DiaLido {
  readonly numeroDia: number;
  readonly dataLeitura: string; // ISO 8601
  readonly timestamp: string; // ISO 8601
}

/* ============================================================================
   CONTRATO DE ENTIDADES DE DOMÍNIO
============================================================================ */

export interface TrechoBiblico {
  readonly livroId: string;
  readonly livroNome: string;
  readonly capituloInicio: number;
  readonly capituloFim?: number;
}

export interface DiaDoPlano {
  readonly numero: number;
  readonly ano: number;
  readonly data: string; // YYYY-MM-DD
  readonly dataFormatada: string; // DD/MM/YYYY
  readonly antigoTestamento: readonly TrechoBiblico[];
  readonly novoTestamento: readonly TrechoBiblico[];
  readonly livros: readonly string[];
  readonly capitulos: readonly number[];
  readonly versiculos: readonly string[];
  readonly observacoes: string;
}

/* ============================================================================
   CONTRATO DE PLANO-CARTUCHO (Seção 6 do CONTRATO_DO_SISTEMA.md)
============================================================================ */

export interface PlanoCartucho {
  readonly id: string;
  readonly nome: string;
  readonly descricao: string;
  readonly totalDias: number;
  readonly dias: readonly DiaDoPlano[];

  // Contrato funcional obrigatório
  getDia(numero: number): DiaDoPlano | undefined;
  getDias(): DiaDoPlano[];
}

/* ============================================================================
   CONTRATO TEMPORAL (Seção 3 do CONTRATO_DO_SISTEMA.md)
============================================================================ */

export interface ContextoTemporal {
  readonly ano: number;
  readonly diaDoAno: number;
  readonly totalDias: number;
}

export interface InfoCiclo {
  readonly ano: number;
  readonly totalDias: number;
  readonly eBissexto: boolean;
}

/* ============================================================================
   CONTRATO DE ORQUESTRAÇÃO (Hierarquia Seção 4)
============================================================================ */

export interface GerenciadorPlano {
  readonly plano: PlanoCartucho;
  readonly indiceAtual: number;

  irParaDia(numero: number): DiaDoPlano | null;
  proximoDia(): DiaDoPlano | null;
  diaAnterior(): DiaDoPlano | null;
  temProximo(): boolean;
  temAnterior(): boolean;
  resetar(): DiaDoPlano | null;
  getDiaAtual(): DiaDoPlano | null;
  getTotalDias(): number;
  getIndiceAtual(): number;
}

/* ============================================================================
   CONTRATO DE VALIDAÇÃO E REGRAS
============================================================================ */

export interface ResultadoValidacao {
  readonly valido: boolean;
  readonly erros: readonly string[];
}

export interface RegraAtraso {
  readonly diasTolerancia: number;
  estaAtrasado(diasPercorridos: number, diasLidos: number): boolean;
}

/* ============================================================================
   CONTRATO DE EVENTOS DO SISTEMA
============================================================================ */

export type EventoSistema =
  | { tipo: "ciclo_finalizado"; dados: InfoCiclo }
  | { tipo: "atraso_detectado"; dados: { diasAtraso: number } }
  | { tipo: "plano_concluido"; dados: { plano: PlanoCartucho } }
  | {
      tipo: "decisao_necessaria";
      dados: { decisoesPossiveis: DecisaoUsuario[] };
    }
  | { tipo: "lacuna_detectada"; dados: { diaInicio: number; diaFim: number } };

/* ============================================================================
   CONTRATO DE PERSISTÊNCIA (Isolamento de Plataforma - Seção 14)
============================================================================ */

export interface RepositorioPlano {
  salvar(plano: PlanoCartucho, progresso: ProgressoLeitura): Promise<void>;
  carregar(
    id: string,
  ): Promise<{ plano: PlanoCartucho; progresso: ProgressoLeitura } | null>;
  listar(): Promise<PlanoCartucho[]>;
}

export interface RepositorioNotas {
  salvar(diaNumero: number, notas: string): Promise<void>;
  carregar(diaNumero: number): Promise<string>;
  listarTodos(): Promise<{ dia: number; notas: string }[]>;
}

/* ============================================================================
   CONTRATO DE UI (Seção 10 do CONTRATO_DO_SISTEMA.md)
============================================================================ */

export interface RenderizadorDia {
  renderizar(dia: DiaDoPlano, progresso: ProgressoLeitura): HTMLElement;
  atualizarProgresso(progresso: ProgressoLeitura): void;
}

export interface GerenciadorUI {
  exibirDia(dia: DiaDoPlano): void;
  exibirMensagem(mensagem: string, tipo: "info" | "erro" | "aviso"): void;
  solicitarDecisao(decisoes: DecisaoUsuario[]): Promise<DecisaoUsuario>;
}

/* ============================================================================
   TIPOS DE UTILIDADE (Helpers)
============================================================================ */

export type DiaDaSemana =
  | "domingo"
  | "segunda"
  | "terca"
  | "quarta"
  | "quinta"
  | "sexta"
  | "sabado";

export type MesAno =
  | "janeiro"
  | "fevereiro"
  | "marco"
  | "abril"
  | "maio"
  | "junho"
  | "julho"
  | "agosto"
  | "setembro"
  | "outubro"
  | "novembro"
  | "dezembro";

export interface OpcoesRenderizacao {
  readonly tema: "light" | "dark";
  readonly idioma: "pt-BR" | "en-US";
  readonly formatoData: "BR" | "ISO" | "US";
}

/* ============================================================================
   DECLARAÇÃO FINAL
============================================================================ */

/**
 * Estes tipos formalizam os contratos conceituais definidos no CONTRATO_DO_SISTEMA.md.
 *
 * Regras soberanas:
 * 1. Nenhum tipo aqui contém lógica executável
 * 2. Nenhum tipo importa módulos do sistema
 * 3. Qualquer violação destes tipos em tempo de compilação indica
 *    violação contratual do sistema
 * 4. A presença de validação em runtime ainda é obrigatória
 *
 * TypeScript garante estrutura, não comportamento.
 * O contrato governa, não o compilador.
 */
