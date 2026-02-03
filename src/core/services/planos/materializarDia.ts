/* ============================================================================
   materializarDia.ts — Materialização Individual de Dia
   Versão: 1.0.0
   ============================================================================

   RESPONSABILIDADE:
   - Transformar um DiaPlanoRaw (dado puro) em DiaDoPlano (com datas)
   - Injetar datas dinâmicas via geradorDatas.ts
   
   CONFORMIDADE COM CONTRATO_DO_SISTEMA.MD:
   - §3.1: Tempo é soberano
   - §3.2: Sem new Date() fora do gerador
   ============================================================================ */

import type { DiaDoPlano, TrechoBiblico } from "../../types/contratos.types";
import { gerarDataBR, gerarDataISO } from "../tempo/geradorDatas.js";

type DiaPlanoRaw = {
  numero: number;
  antigoTestamento: TrechoBiblico[];
  novoTestamento: TrechoBiblico[];
  livros: string[];
  capitulos: number[];
  versiculos: string[];
  observacoes: string;
};

/**
 * Materializa um único dia, injetando datas dinâmicas
 * @param diaRaw - Dia em formato puro (do cartucho)
 * @param ano - Ano atual (do geradorDatas)
 * @returns Dia materializado com datas
 */
export function materializarDia(diaRaw: DiaPlanoRaw, ano: number): DiaDoPlano {
  return {
    numero: diaRaw.numero,
    ano,
    data: gerarDataISO(diaRaw.numero, ano),
    dataFormatada: gerarDataBR(diaRaw.numero, ano),
    antigoTestamento: diaRaw.antigoTestamento,
    novoTestamento: diaRaw.novoTestamento,
    livros: diaRaw.livros,
    capitulos: diaRaw.capitulos,
    versiculos: diaRaw.versiculos,
    observacoes: diaRaw.observacoes,
  };
}
