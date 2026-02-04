/* ============================================================================
   SearchEngine.ts — Mecanismo de Busca Tipado do Plano de Leitura
   Versão: 2.0.0 (TypeScript)
   ============================================================================

   RESPONSABILIDADE:
   - Indexar o plano de leitura para buscas rápidas
   - Buscar por número do dia, capítulos, livros
   - Retornar resultados relevantes com metadata

   CONFORMIDADE COM CONTRATO_DO_SISTEMA.MD:
   - §4: Hierarquia de Autoridade (Domínio Auxiliar)
   - Nenhuma regra de domínio, apenas busca

   Camada: DOMÍNIO AUXILIAR
   ============================================================================ */

import type { DiaDoPlano, TrechoBiblico } from "../../types/contratos.types";

/* ============================================================================
   TIPOS E INTERFACES
   ============================================================================ */

/**
 * Resultado de uma busca
 */
export interface ResultadoBusca {
  type: "dia" | "capitulo" | "livro" | "cap_range";
  dia: number;
  title: string;
  subtitle: string;
  score: number;
  data?: DiaDoPlano;
}

/**
 * Estrutura do índice de busca
 */
interface IndiceBusca {
  porNumeroDia: Map<number, DiaDoPlano>;
  porLivro: Map<string, IndiceLivro[]>;
  porCapitulo: Map<string, IndiceCapitulo[]>;
  porTexto: IndiceTexto[];
}

/**
 * Entrada no índice por livro
 */
interface IndiceLivro {
  dia: number;
  capituloInicio: number;
  capituloFim: number;
  type: "livro";
}

/**
 * Entrada no índice por capítulo
 */
interface IndiceCapitulo {
  dia: number;
  capitulo: number;
  type: "capitulo";
}

/**
 * Entrada no índice de texto
 */
interface IndiceTexto {
  dia: number;
  texto: string;
  type: "dia" | "capitulo" | "cap_range";
}

/**
 * Plano com dias para indexação
 */
interface PlanoIndexavel {
  dias: DiaDoPlano[];
}

/* ============================================================================
   CLASSE SEARCH ENGINE
   ============================================================================ */

/**
 * Motor de busca para o plano de leitura bíblica.
 *
 * Indexa:
 * - Por número do dia
 * - Por nome do livro
 * - Por capítulo específico
 * - Por texto livre
 *
 * Suporta buscas como:
 * - "Dia 15" ou apenas "15"
 * - "Gênesis 1" ou "Mateus 5-7"
 * - "Salmos" (nome do livro)
 */
export class SearchEngine {
  /* --------------------------------------------------------------------------
     ATRIBUTOS PRIVADOS
     -------------------------------------------------------------------------- */

  private plano: PlanoIndexavel;
  private index: IndiceBusca;

  /* --------------------------------------------------------------------------
     CONSTRUTOR
     -------------------------------------------------------------------------- */

  /**
   * Cria motor de busca indexando o plano
   *
   * @param plano - Plano com array de dias
   * @throws Error se plano for inválido
   */
  constructor(plano: PlanoIndexavel) {
    if (!plano || !Array.isArray(plano.dias)) {
      throw new Error("Plano inválido fornecido ao SearchEngine");
    }

    this.plano = plano;
    this.index = this.criarIndice();
  }

  /* --------------------------------------------------------------------------
     CRIAÇÃO DO ÍNDICE
     -------------------------------------------------------------------------- */

  /**
   * Cria índice completo para busca rápida
   *
   * @returns Índice populado
   */
  private criarIndice(): IndiceBusca {
    const index: IndiceBusca = {
      porNumeroDia: new Map(),
      porLivro: new Map(),
      porCapitulo: new Map(),
      porTexto: [],
    };

    this.plano.dias.forEach((dia) => {
      const diaNumero = dia.numero;

      // 1. Indexar por número do dia
      index.porNumeroDia.set(diaNumero, dia);

      // 2. Indexar por texto livre
      index.porTexto.push({
        dia: diaNumero,
        texto: `Dia ${diaNumero}`,
        type: "dia",
      });

      // 3. Indexar Antigo Testamento
      if (dia.antigoTestamento?.length) {
        dia.antigoTestamento.forEach((leitura) => {
          this.indexarLeitura(index, leitura, diaNumero);
        });
      }

      // 4. Indexar Novo Testamento
      if (dia.novoTestamento?.length) {
        dia.novoTestamento.forEach((leitura) => {
          this.indexarLeitura(index, leitura, diaNumero);
        });
      }
    });

    return index;
  }

  /**
   * Indexa uma leitura específica no índice
   *
   * @param index - Índice a atualizar
   * @param leitura - Trecho bíblico a indexar
   * @param diaNumero - Número do dia
   */
  private indexarLeitura(
    index: IndiceBusca,
    leitura: TrechoBiblico,
    diaNumero: number,
  ): void {
    const livroNome = leitura.livroNome || leitura.livroId;
    const capituloInicio = leitura.capituloInicio;
    const capituloFim = leitura.capituloFim || capituloInicio;

    // Indexar por livro
    if (!index.porLivro.has(livroNome)) {
      index.porLivro.set(livroNome, []);
    }
    index.porLivro.get(livroNome)!.push({
      dia: diaNumero,
      capituloInicio,
      capituloFim,
      type: "livro",
    });

    // Indexar por capítulos específicos
    for (let capitulo = capituloInicio; capitulo <= capituloFim; capitulo++) {
      const chave = `${livroNome}:${capitulo}`;

      if (!index.porCapitulo.has(chave)) {
        index.porCapitulo.set(chave, []);
      }

      index.porCapitulo.get(chave)!.push({
        dia: diaNumero,
        capitulo,
        type: "capitulo",
      });

      // Adicionar ao índice de texto
      index.porTexto.push({
        dia: diaNumero,
        texto: `${livroNome} ${capitulo}`,
        type: "capitulo",
      });
    }

    // Adicionar referência completa ao texto
    if (capituloInicio === capituloFim) {
      index.porTexto.push({
        dia: diaNumero,
        texto: `${livroNome} ${capituloInicio}`,
        type: "capitulo",
      });
    } else {
      index.porTexto.push({
        dia: diaNumero,
        texto: `${livroNome} ${capituloInicio}-${capituloFim}`,
        type: "cap_range",
      });
    }
  }

  /* --------------------------------------------------------------------------
     BUSCA
     -------------------------------------------------------------------------- */

  /**
   * Busca no plano por termo
   *
   * @param termo - Termo de busca
   * @returns Array de resultados ordenados por relevância
   */
  buscar(termo: string): ResultadoBusca[] {
    if (!termo?.trim()) {
      return [];
    }

    const termoLower = termo.toLowerCase().trim();
    const resultados = new Set<number>();
    const matches: ResultadoBusca[] = [];

    // 1. Buscar por número do dia (ex: "15", "dia 15")
    const numeroMatch = termoLower.match(/(?:dia\s*)?(\d+)/);
    if (numeroMatch) {
      const numeroDia = parseInt(numeroMatch[1], 10);
      const dia = this.index.porNumeroDia.get(numeroDia);
      if (dia) {
        matches.push({
          type: "dia",
          dia: numeroDia,
          title: `Dia ${numeroDia}`,
          subtitle: `Dia ${numeroDia} do plano`,
          score: 100,
          data: dia,
        });
        resultados.add(numeroDia);
      }
    }

    // 2. Buscar por livro e capítulo (ex: "Gênesis 1", "Mateus 5-7")
    const livroCapituloMatch = termoLower.match(
      /([a-záéíóúãõâêîôûç\s]+)\s+(\d+)(?:\s*[-–]\s*(\d+))?/,
    );
    if (livroCapituloMatch) {
      const [, livroNome, capInicioStr, capFimStr] = livroCapituloMatch;
      const livroNomeNormalizado = livroNome.trim();
      const capInicio = parseInt(capInicioStr, 10);
      const capFim = capFimStr ? parseInt(capFimStr, 10) : capInicio;

      for (let capitulo = capInicio; capitulo <= capFim; capitulo++) {
        const chave = `${livroNomeNormalizado}:${capitulo}`;
        const diasComEsteCapitulo = this.index.porCapitulo.get(chave);

        if (diasComEsteCapitulo) {
          diasComEsteCapitulo.forEach((item) => {
            if (!resultados.has(item.dia)) {
              matches.push({
                type: "capitulo",
                dia: item.dia,
                title: `${livroNomeNormalizado} ${capitulo}`,
                subtitle: `Dia ${item.dia}`,
                score: 90,
                data: this.index.porNumeroDia.get(item.dia),
              });
              resultados.add(item.dia);
            }
          });
        }
      }
    }

    // 3. Buscar apenas por nome do livro
    const livroMatch = termoLower.match(/^[a-záéíóúãõâêîôûç\s]+$/);
    if (livroMatch && !livroCapituloMatch) {
      const livroNome = termoLower.trim();
      const diasComEsteLivro = this.index.porLivro.get(livroNome);

      if (diasComEsteLivro) {
        diasComEsteLivro.forEach((item) => {
          if (!resultados.has(item.dia)) {
            matches.push({
              type: "livro",
              dia: item.dia,
              title: livroNome,
              subtitle: `Capítulos ${item.capituloInicio}-${item.capituloFim} - Dia ${item.dia}`,
              score: 80,
              data: this.index.porNumeroDia.get(item.dia),
            });
            resultados.add(item.dia);
          }
        });
      }
    }

    // 4. Busca por texto livre (fallback)
    if (matches.length === 0) {
      this.index.porTexto.forEach((item) => {
        if (
          item.texto.toLowerCase().includes(termoLower) &&
          !resultados.has(item.dia)
        ) {
          matches.push({
            type: item.type,
            dia: item.dia,
            title: item.texto,
            subtitle: `Dia ${item.dia}`,
            score: 70,
            data: this.index.porNumeroDia.get(item.dia),
          });
          resultados.add(item.dia);
        }
      });
    }

    // Ordenar por score e limitar a 10 resultados
    return matches.sort((a, b) => b.score - a.score).slice(0, 10);
  }

  /* --------------------------------------------------------------------------
     ESTATÍSTICAS
     -------------------------------------------------------------------------- */

  /**
   * Retorna estatísticas do índice (para debug)
   *
   * @returns Estatísticas do índice
   */
  getEstatisticas(): {
    totalDias: number;
    livrosIndexados: number;
    capitulosIndexados: number;
    entradasTexto: number;
  } {
    return {
      totalDias: this.index.porNumeroDia.size,
      livrosIndexados: this.index.porLivro.size,
      capitulosIndexados: this.index.porCapitulo.size,
      entradasTexto: this.index.porTexto.length,
    };
  }

  /**
   * Recria o índice (útil se o plano mudar)
   */
  reindexar(): void {
    this.index = this.criarIndice();
  }
}

export default SearchEngine;
