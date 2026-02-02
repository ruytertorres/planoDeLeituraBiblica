/* ============================================================================
   validadorPlano.ts — Guardião do Contrato de Planos de Leitura
   Versão: 1.0.0 (TypeScript)
   Aplicação: Bíblia Responsiva App

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------
   - Definir o contrato mínimo que todo plano de leitura deve cumprir
   - Validar planos em runtime
   - Garantir consistência estrutural e temporal
   - Proteger o sistema contra planos inválidos

   ESTE MÓDULO NÃO:
   ----------------------------------------------------------------------------
   ✖ Cria planos
   ✖ Gera datas
   ✖ Formata datas
   ✖ Conhece UI, progresso ou persistência

   CONTRATO:
   - Implementa validação descrita em contrato_plano.js
   - Usa tipos TypeScript para verificação estrutural
============================================================================ */

import type { PlanoCartucho, DiaDoPlano, ResultadoValidacao } from "../../types/contratos.types";

/* ============================================================================
   FUNÇÃO PRINCIPAL DE VALIDAÇÃO
============================================================================ */

/**
 * Valida se um plano de leitura cumpre todos os contratos exigidos.
 *
 * @param plano - Plano a ser validado
 * @returns Resultado da validação
 */
export function validarPlano(plano: unknown): ResultadoValidacao {
  const erros: string[] = [];

  /* ------------------------------------------------------------------------
     VALIDAÇÃO ESTRUTURAL BÁSICA
  ------------------------------------------------------------------------ */

  if (!plano || typeof plano !== "object") {
    erros.push("Plano inválido: objeto esperado.");
    return { valido: false, erros };
  }

  const planoObj = plano as Record<string, unknown>;

  /* ------------------------------------------------------------------------
     METADADOS OBRIGATÓRIOS
  ------------------------------------------------------------------------ */

  if (!validarString(planoObj.id, "id")) {
    erros.push("Campo 'id' deve ser uma string não vazia.");
  }

  if (!validarString(planoObj.nome, "nome")) {
    erros.push("Campo 'nome' deve ser uma string não vazia.");
  }

  if (!validarString(planoObj.descricao, "descricao")) {
    erros.push("Campo 'descricao' deve ser uma string não vazia.");
  }

  if (!Number.isInteger(planoObj.totalDias) || (planoObj.totalDias as number) <= 0) {
    erros.push("Campo 'totalDias' deve ser um número inteiro maior que zero.");
  }

  if (!Array.isArray(planoObj.dias)) {
    erros.push("Campo 'dias' deve ser um array.");
    return { valido: false, erros };
  }

  /* ------------------------------------------------------------------------
     CONSISTÊNCIA DO AGREGADO
  ------------------------------------------------------------------------ */

  const dias = planoObj.dias as unknown[];
  const totalDias = planoObj.totalDias as number;

  if (dias.length !== totalDias) {
    erros.push(
      `Plano inconsistente: totalDias (${totalDias}) difere da quantidade real de dias (${dias.length}).`
    );
  }

  /* ------------------------------------------------------------------------
     VALIDAÇÃO DOS DIAS (ENTIDADES)
  ------------------------------------------------------------------------ */

  dias.forEach((dia, index) => {
    const errosDia = validarDia(dia, index);
    erros.push(...errosDia);
  });

  /* ------------------------------------------------------------------------
     CONTRATO FUNCIONAL
  ------------------------------------------------------------------------ */

  if (typeof planoObj.getDia !== "function") {
    erros.push("Método getDia(numero) é obrigatório.");
  }

  if (typeof planoObj.getDias !== "function") {
    erros.push("Método getDias() é obrigatório.");
  }

  /* ------------------------------------------------------------------------
     VALIDAÇÃO DE COMPORTAMENTO (se métodos existirem)
  ------------------------------------------------------------------------ */

  if (typeof planoObj.getDia === "function") {
    try {
      const primeiroDia = planoObj.getDia(1);
      if (primeiroDia !== undefined && !validarEstruturaDia(primeiroDia)) {
        erros.push("Método getDia(numero) deve retornar DiaDoPlano ou undefined.");
      }
    } catch (error) {
      erros.push(`Erro ao executar getDia(1): ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (typeof planoObj.getDias === "function") {
    try {
      const todosDias = planoObj.getDias();
      if (!Array.isArray(todosDias)) {
        erros.push("Método getDias() deve retornar um array.");
      }
    } catch (error) {
      erros.push(`Erro ao executar getDias(): ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return {
    valido: erros.length === 0,
    erros,
  };
}

/* ============================================================================
   VALIDAÇÃO DE DIA INDIVIDUAL
============================================================================ */

/**
 * Valida uma estrutura de dia.
 *
 * @param dia - Dia a ser validado
 * @param index - Índice no array (para mensagens de erro)
 * @returns Lista de erros encontrados
 */
function validarDia(dia: unknown, index: number): string[] {
  const erros: string[] = [];

  if (!validarEstruturaDia(dia)) {
    erros.push(`dias[${index}] não segue a estrutura de DiaDoPlano.`);
    return erros;
  }

  const diaObj = dia as DiaDoPlano;

  // Verificar número sequencial
  const numeroEsperado = index + 1;
  if (diaObj.numero !== numeroEsperado) {
    erros.push(
      `dias[${index}]: número (${diaObj.numero}) fora de sequência. Esperado ${numeroEsperado}.`
    );
  }

  // Garantia mínima de integridade temporal (sem gerar nada)
  if (!diaObj.data || !diaObj.dataFormatada) {
    erros.push(`dias[${index}]: não possui data resolvida.`);
  }

  // Validação de formato de data
  if (diaObj.data && !/^\d{4}-\d{2}-\d{2}$/.test(diaObj.data)) {
    erros.push(`dias[${index}]: data inválida, formato esperado YYYY-MM-DD.`);
  }

  if (diaObj.dataFormatada && !/^\d{2}\/\d{2}\/\d{4}$/.test(diaObj.dataFormatada)) {
    erros.push(`dias[${index}]: dataFormatada inválida, formato esperado DD/MM/YYYY.`);
  }

  return erros;
}

/**
 * Verifica se um objeto tem a estrutura básica de DiaDoPlano.
 *
 * @param dia - Objeto a verificar
 * @returns True se tiver estrutura válida
 */
function validarEstruturaDia(dia: unknown): dia is DiaDoPlano {
  if (!dia || typeof dia !== "object") {
    return false;
  }

  const diaObj = dia as Record<string, unknown>;

  return (
    typeof diaObj.numero === "number" &&
    typeof diaObj.ano === "number" &&
    typeof diaObj.data === "string" &&
    typeof diaObj.dataFormatada === "string" &&
    Array.isArray(diaObj.antigoTestamento) &&
    Array.isArray(diaObj.novoTestamento) &&
    Array.isArray(diaObj.livros) &&
    Array.isArray(diaObj.capitulos) &&
    Array.isArray(diaObj.versiculos) &&
    typeof diaObj.observacoes === "string"
  );
}

/* ============================================================================
   HELPERS INTERNOS
============================================================================ */

/**
 * Valida se um valor é uma string não vazia.
 *
 * @param valor - Valor a validar
 * @param campo - Nome do campo (para mensagens de erro)
 * @returns True se válido
 */
function validarString(valor: unknown, campo: string): boolean {
  return typeof valor === "string" && valor.trim().length > 0;
}

/* ============================================================================
   FUNÇÕES DE CONVENIÊNCIA
============================================================================ */

/**
 * Valida e lança erro se inválido (compatibilidade com código legado).
 *
 * @param plano - Plano a ser validado
 * @throws Se o plano for inválido
 */
export function validarPlanoStrict(plano: unknown): asserts plano is PlanoCartucho {
  const resultado = validarPlano(plano);
  
  if (!resultado.valido) {
    throw new Error(
      `Plano inválido:\n${resultado.erros.map(erro => `  - ${erro}`).join("\n")}`
    );
  }
}

/**
 * Verifica se um plano é válido sem lançar erros.
 *
 * @param plano - Plano a ser verificado
 * @returns True se válido
 */
export function planoValido(plano: unknown): plano is PlanoCartucho {
  return validarPlano(plano).valido;
}
