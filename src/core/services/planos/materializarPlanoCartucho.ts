import type {
  DiaDoPlano,
  PlanoCartucho,
  TrechoBiblico,
} from "../../types/contratos.types";
import {
  gerarDataBR,
  gerarDataISO,
  getAnoAtual,
} from "../tempo/geradorDatas.js";

type DiaPlanoRaw = {
  numero: number;
  antigoTestamento: TrechoBiblico[];
  novoTestamento: TrechoBiblico[];
  livros: string[];
  capitulos: number[];
  versiculos: string[];
  observacoes: string;
};

type PlanoCartuchoRaw = {
  id: string;
  nome: string;
  descricao: string;
  totalDias: number;
  dias: DiaPlanoRaw[];
};

export function materializarPlanoCartucho(planoRaw: PlanoCartuchoRaw): PlanoCartucho {
  const ano = getAnoAtual();

  const dias: DiaDoPlano[] = planoRaw.dias.map((d) => {
    return {
      numero: d.numero,
      ano,
      data: gerarDataISO(d.numero, ano),
      dataFormatada: gerarDataBR(d.numero, ano),
      antigoTestamento: d.antigoTestamento,
      novoTestamento: d.novoTestamento,
      livros: d.livros,
      capitulos: d.capitulos,
      versiculos: d.versiculos,
      observacoes: d.observacoes,
    };
  });

  const plano: PlanoCartucho = {
    id: planoRaw.id,
    nome: planoRaw.nome,
    descricao: planoRaw.descricao,
    totalDias: planoRaw.totalDias,
    dias,
    getDia(numero: number): DiaDoPlano | undefined {
      return this.dias[numero - 1];
    },
    getDias(): DiaDoPlano[] {
      return [...this.dias];
    },
  };

  return plano;
}
