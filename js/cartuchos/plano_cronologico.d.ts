/* ============================================================================
   plano_cronologico.d.ts — Declaração de Tipos para Plano
   Versão: 1.0.0
   Aplicação: Bíblia Responsiva — Domínio de Planos
============================================================================ */

export interface TrechoLeitura {
  livroId: string;
  livroNome: string;
  capituloInicio: number;
  capituloFim: number;
}

export interface DiaPlano {
  numero: number;
  ano: number;
  trechos: TrechoLeitura[];
  tipo?: string;
  livros: string[];
  capitulos: number[];
  versiculos: string[];
  observacoes: string;
  data: string;
  dataFormatada: string;
}

export interface PlanoCronologico {
  id: string;
  nome: string;
  descricao: string;
  totalDias: number;
  dias: DiaPlano[];
}

declare const planoCronologico: PlanoCronologico;
export default planoCronologico;
