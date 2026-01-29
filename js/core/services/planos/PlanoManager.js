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
    console.log(
      `🔍 irParaDia(${numero}) - indice encontrado=${indice}, total dias=${this.totalDias}`,
    );

    if (indice === -1) {
      console.warn(`❌ irParaDia(${numero}) - dia NÃO encontrado!`);
      return null;
    }

    console.log(
      `✅ irParaDia(${numero}) - dia encontrado, atualizando indiceAtual de ${this.indiceAtual} para ${indice}`,
    );
    this.indiceAtual = indice;
    const diaRetornado = this.getDiaAtual();
    console.log(`✅ irParaDia retornando dia:`, diaRetornado);
    return diaRetornado;
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

  resetarAPartirDoDia(numeroDia) {
    /**
     * Reseta o plano para começar a partir de um dia específico
     * Usado para reset customizado (opção 2 do modal)
     *
     * @param {number} numeroDia - Número do dia para começar (ex: 1)
     * @returns {object} { sucesso, dia, indice }
     *
     * @example
     * // Resetar para que dia 01 do plano = hoje
     * planoManager.resetarAPartirDoDia(1);
     * // { sucesso: true, dia: {...}, indice: 0 }
     */
    const indice = this.dias.findIndex((d) => d.numero === numeroDia);
    if (indice === -1) {
      return {
        sucesso: false,
        erro: `Dia ${numeroDia} não encontrado no plano`,
      };
    }

    this.indiceAtual = indice;
    return {
      sucesso: true,
      dia: this.getDiaAtual(),
      indice: this.indiceAtual,
      descricao: `Plano resetado para começar no dia ${numeroDia}`,
    };
  }
}
