/* ============================================================================
   planoCronologico.d.ts — Declaração de Tipos para Plano JavaScript
   Versão: 1.0.0
   Aplicação: Bíblia Responsiva — Domínio de Planos

   RESPONSABILIDADE:
   ----------------------------------------------------------------------------
   - Declarar tipos para plano em JavaScript existente
   - Permitir importação segura em código TypeScript
   - Manter compatibilidade sem migração forçada
   - Respeitar FASE 2: Contratos como Tipos
============================================================================ */

declare module "../js/cartuchos/plano_cronologico.js" {
  interface TrechoLeitura {
    livroId: string;
    livroNome: string;
    capituloInicio: number;
    capituloFim: number;
  }

  interface DiaPlano {
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

  interface PlanoCronologico {
    id: string;
    nome: string;
    descricao: string;
    totalDias: number;
    dias: DiaPlano[];
  }

  const planoCronologico: PlanoCronologico;
  export default planoCronologico;
}

export {};
