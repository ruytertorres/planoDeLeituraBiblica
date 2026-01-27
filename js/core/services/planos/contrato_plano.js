/* ============================================================================
   contrato_plano.js — Contrato de Domínio para Planos de Leitura
   Versão: 0.7
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
============================================================================ */

import { Dia } from "../../models/parametroDia.js";

/* ============================================================================
   CONTRATO DOCUMENTADO (REFERÊNCIA HUMANA)

Todo plano DEVE expor:

{
  id: string,
  nome: string,
  descricao: string,
  totalDias: number,
  dias: Dia[],

  getDia(numero): Dia | undefined
  getDias(): Dia[]
}

============================================================================ */

/* ============================================================================
   FUNÇÃO PRINCIPAL DE VALIDAÇÃO
============================================================================ */

export function validarPlano(plano) {
  if (!plano || typeof plano !== "object") {
    throw new Error("Plano inválido: objeto esperado.");
  }

  /* ------------------------------------------------------------------------
     METADADOS OBRIGATÓRIOS
  ------------------------------------------------------------------------ */

  validarString(plano.id, "id");
  validarString(plano.nome, "nome");
  validarString(plano.descricao, "descricao");

  if (!Number.isInteger(plano.totalDias) || plano.totalDias <= 0) {
    throw new Error(
      "Plano inválido: totalDias deve ser um número inteiro maior que zero.",
    );
  }

  if (!Array.isArray(plano.dias)) {
    throw new Error("Plano inválido: dias deve ser um array.");
  }

  /* ------------------------------------------------------------------------
     CONSISTÊNCIA DO AGREGADO
  ------------------------------------------------------------------------ */

  if (plano.dias.length !== plano.totalDias) {
    throw new Error(
      `Plano inconsistente: totalDias (${plano.totalDias}) difere da quantidade real de dias (${plano.dias.length}).`,
    );
  }

  /* ------------------------------------------------------------------------
     VALIDAÇÃO DOS DIAS (ENTIDADES)
  ------------------------------------------------------------------------ */

  plano.dias.forEach((dia, index) => {
    if (!(dia instanceof Dia)) {
      throw new Error(`Plano inválido: dias[${index}] não é instância de Dia.`);
    }

    const numeroEsperado = index + 1;

    if (dia.numero !== numeroEsperado) {
      throw new Error(
        `Plano inválido: dia.numero (${dia.numero}) fora de sequência. Esperado ${numeroEsperado}.`,
      );
    }

    // Garantia mínima de integridade temporal (sem gerar nada)
    if (!dia.data || !dia.dataFormatada) {
      throw new Error(
        `Plano inválido: dia ${dia.numero} não possui data resolvida.`,
      );
    }
  });

  /* ------------------------------------------------------------------------
     CONTRATO FUNCIONAL
  ------------------------------------------------------------------------ */

  if (typeof plano.getDia !== "function") {
    throw new Error("Plano inválido: método getDia(numero) é obrigatório.");
  }

  if (typeof plano.getDias !== "function") {
    throw new Error("Plano inválido: método getDias() é obrigatório.");
  }

  /* ------------------------------------------------------------------------
     VALIDAÇÃO DE COMPORTAMENTO
  ------------------------------------------------------------------------ */

  const primeiroDia = plano.getDia(1);
  if (primeiroDia !== undefined && !(primeiroDia instanceof Dia)) {
    throw new Error(
      "Plano inválido: getDia(numero) deve retornar Dia ou undefined.",
    );
  }

  const todosDias = plano.getDias();
  if (!Array.isArray(todosDias)) {
    throw new Error("Plano inválido: getDias() deve retornar um array.");
  }

  return true;
}

/* ============================================================================
   HELPERS INTERNOS
============================================================================ */

function validarString(valor, campo) {
  if (typeof valor !== "string" || !valor.trim()) {
    throw new Error(
      `Plano inválido: campo "${campo}" deve ser uma string não vazia.`,
    );
  }
}
