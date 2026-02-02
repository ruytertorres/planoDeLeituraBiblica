/* ============================================================================
   global.d.ts — Declarações Globais para Módulos JavaScript
   Versão: 1.0.0
   Aplicação: Bíblia Responsiva — Domínio de Planos

   RESPONSABILIDADE:
   ----------------------------------------------------------------------------
   - Declarar tipos para módulos JavaScript usados pelo TypeScript
   - Permitir importação segura sem arquivos .d.ts específicos
   - Manter compatibilidade durante migração gradual
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
