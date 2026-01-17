/* ============================================================================
   PlanoManager.js — Orquestrador de Plano Ativo
   Versão: 0.6
   Aplicação: Leitura Controlada da Bíblia

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------
   - Gerenciar o plano ativo
   - Navegar entre dias
   - Expor estado atual do plano
   - NÃO conter lógica de UI
   - NÃO conter persistência
============================================================================ */

export class PlanoManager {
  constructor(plano) {
    if (!plano || !Array.isArray(plano.dias)) {
      throw new Error("Plano inválido fornecido ao PlanoManager.");
    }

    this.plano = plano;
    this.dias = plano.dias;
    this.totalDias = this.dias.length;

    this.indiceAtual = 0; // base 0
  }

  /* ========================================================================
     ACESSO AO ESTADO
  ======================================================================== */

  getPlano() {
    return this.plano;
  }

  getDiaAtual() {
    return this.dias[this.indiceAtual] || null;
  }

  getIndiceAtual() {
    return this.indiceAtual;
  }

  getTotalDias() {
    return this.totalDias;
  }

  /* ========================================================================
     NAVEGAÇÃO
  ======================================================================== */

  irParaDia(numero) {
    const indice = this.dias.findIndex((d) => d.numero === numero);
    if (indice === -1) return null;

    this.indiceAtual = indice;
    return this.getDiaAtual();
  }

  proximoDia() {
    if (this.indiceAtual < this.totalDias - 1) {
      this.indiceAtual++;
    }
    return this.getDiaAtual();
  }

  diaAnterior() {
    if (this.indiceAtual > 0) {
      this.indiceAtual--;
    }
    return this.getDiaAtual();
  }

  /* ========================================================================
     CONSULTAS
  ======================================================================== */

  temProximo() {
    return this.indiceAtual < this.totalDias - 1;
  }

  temAnterior() {
    return this.indiceAtual > 0;
  }

  resetar() {
    this.indiceAtual = 0;
    return this.getDiaAtual();
  }
}
