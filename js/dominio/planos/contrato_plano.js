/* ============================================================================
   contrato_plano.js — Contrato de Domínio para Planos de Leitura
   Versão: 0.6
   Aplicação: Bíblia Responsiva App

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------
   - Definir o contrato mínimo que todo plano de leitura deve cumprir
   - Validar planos em runtime
   - Proteger a aplicação contra planos inválidos ou incompletos

   ESTE MÓDULO:
   ----------------------------------------------------------------------------
   ✔ Não cria planos
   ✔ Não conhece UI
   ✔ Não conhece persistência
   ✔ Não conhece progresso
============================================================================ */

import { Dia } from "../dia.js";

/* ============================================================================
   CONTRATO DOCUMENTADO (REFERÊNCIA HUMANA)
============================================================================

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

  /* --------------------------------------------------------------------------
     CAMPOS OBRIGATÓRIOS
  -------------------------------------------------------------------------- */

  validarString(plano.id, "id");
  validarString(plano.nome, "nome");
  validarString(plano.descricao, "descricao");

  if (!Number.isInteger(plano.totalDias) || plano.totalDias <= 0) {
    throw new Error("Plano inválido: totalDias deve ser um número inteiro > 0.");
  }

  if (!Array.isArray(plano.dias)) {
    throw new Error("Plano inválido: dias deve ser um array.");
  }

  /* --------------------------------------------------------------------------
     VALIDAÇÃO DOS DIAS
  -------------------------------------------------------------------------- */

  if (plano.dias.length !== plano.totalDias) {
    throw new Error(
      `Plano inconsistente: totalDias (${plano.totalDias}) difere da quantidade real de dias (${plano.dias.length}).`
    );
  }

  plano.dias.forEach((dia, index) => {
    if (!(dia instanceof Dia)) {
      throw new Error(
        `Plano inválido: item em dias[${index}] não é uma instância de Dia.`
      );
    }

    if (dia.numero !== index + 1) {
      throw new Error(
        `Plano inválido: dia.numero (${dia.numero}) fora de sequência. Esperado ${index + 1}.`
      );
    }
  });

  /* --------------------------------------------------------------------------
     MÉTODOS DE ACESSO (CONTRATO FUNCIONAL)
  -------------------------------------------------------------------------- */

  if (typeof plano.getDia !== "function") {
    throw new Error("Plano inválido: método getDia(numero) é obrigatório.");
  }

  if (typeof plano.getDias !== "function") {
    throw new Error("Plano inválido: método getDias() é obrigatório.");
  }

  /* --------------------------------------------------------------------------
     VALIDAÇÃO DE COMPORTAMENTO
  -------------------------------------------------------------------------- */

  const testeDia = plano.getDia(1);
  if (testeDia && !(testeDia instanceof Dia)) {
    throw new Error(
      "Plano inválido: getDia(numero) deve retornar Dia ou undefined."
    );
  }

  const testeDias = plano.getDias();
  if (!Array.isArray(testeDias)) {
    throw new Error("Plano inválido: getDias() deve retornar um array.");
  }

  return true;
}

/* ============================================================================
   HELPERS
============================================================================ */

function validarString(valor, campo) {
  if (typeof valor !== "string" || !valor.trim()) {
    throw new Error(`Plano inválido: campo "${campo}" deve ser string não vazia.`);
  }
}
