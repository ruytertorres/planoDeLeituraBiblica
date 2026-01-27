/* ============================================================================
   ProgressoLeitura.js — Estado de Progresso de Leitura
   Versão: 0.8.0 — COM MÉTODO DE RESET COMPLETO
   Aplicação: Leitura Controlada da Bíblia

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------
   - Gerenciar quais dias foram lidos
   - Calcular progresso
   - Persistir estado (localStorage)
   - Fornecer método para reset completo
   - NÃO conter lógica de UI
   - NÃO depender de plano, datas ou renderização
============================================================================ */

export class ProgressoLeitura {
  constructor(chaveStorage = "progresso_leitura") {
    this.chaveStorage = chaveStorage;
    this.diasLidos = new Set();
    this.MIN_DIA = 1;
    this.MAX_DIA = 366; // Máximo de dias em um ano (bissexto)

    this._carregar();
  }

  /**
   * Valida se um número de dia está dentro do range permitido
   * @private
   * @param {number} numeroDia
   * @throws Se o dia está fora do range
   */
  _validarNumeroDia(numeroDia) {
    const n = Number(numeroDia);
    if (n < this.MIN_DIA || n > this.MAX_DIA) {
      throw new Error(
        `Dia inválido: ${n}. Deve estar entre ${this.MIN_DIA} e ${this.MAX_DIA}.`,
      );
    }
  }

  /* --------------------------------------------------------------------------
     MARCAÇÃO DE ESTADO (DOMÍNIO)
  -------------------------------------------------------------------------- */

  marcarComoLido(numeroDia) {
    this._validarNumeroDia(numeroDia);
    this.diasLidos.add(Number(numeroDia));
    this._salvar();
  }

  desmarcarComoLido(numeroDia) {
    this._validarNumeroDia(numeroDia);
    this.diasLidos.delete(Number(numeroDia));
    this._salvar();
  }

  alternar(numeroDia) {
    this.estaLido(numeroDia)
      ? this.desmarcarComoLido(numeroDia)
      : this.marcarComoLido(numeroDia);
  }

  /* --------------------------------------------------------------------------
     CONSULTAS DE ESTADO
  -------------------------------------------------------------------------- */

  estaLido(numeroDia) {
    this._validarNumeroDia(numeroDia);
    return this.diasLidos.has(Number(numeroDia));
  }

  getTotalLidos() {
    return this.diasLidos.size;
  }

  calcularPercentual(totalDias) {
    if (!totalDias || totalDias <= 0) return 0;
    return Math.round((this.getTotalLidos() / totalDias) * 100);
  }

  /* --------------------------------------------------------------------------
     RESET COMPLETO DO PROGRESSO
     Método público para resetar todos os dias lidos
  -------------------------------------------------------------------------- */

  resetarCompletamente() {
    // Criar backup dos dados atuais antes de resetar
    const backup = {
      diasLidos: [...this.diasLidos],
      total: this.diasLidos.size,
      timestamp: new Date().toISOString(),
    };

    // Salvar backup no localStorage (útil para recuperação)
    try {
      localStorage.setItem(
        `${this.chaveStorage}_backup`,
        JSON.stringify(backup),
      );
    } catch (error) {
      console.warn("Não foi possível criar backup:", error);
    }

    // Limpar conjunto de dias lidos
    this.diasLidos.clear();

    // Limpar storage principal
    this._salvar();

    // Limpar contador de backup
    localStorage.removeItem("backup_counter");

    return {
      diasResetados: backup.total,
      timestamp: new Date().toISOString(),
      backupDisponivel: true,
    };
  }

  /* --------------------------------------------------------------------------
     RESTAURAÇÃO DO BACKUP (OPCIONAL)
     Permite restaurar progresso em caso de erro
  -------------------------------------------------------------------------- */

  restaurarDoBackup() {
    try {
      const backupData = localStorage.getItem(`${this.chaveStorage}_backup`);
      if (!backupData) {
        console.warn("Nenhum backup encontrado para restaurar");
        return null;
      }

      const backup = JSON.parse(backupData);
      this.diasLidos = new Set(backup.diasLidos || []);
      this._salvar();

      return {
        sucesso: true,
        diasRestaurados: this.diasLidos.size,
        timestamp: backup.timestamp,
      };
    } catch (error) {
      console.error("Erro ao restaurar backup:", error);
      return null;
    }
  }

  /* --------------------------------------------------------------------------
     PERSISTÊNCIA (INFRA LOCAL)
  -------------------------------------------------------------------------- */

  _salvar() {
    try {
      localStorage.setItem(
        this.chaveStorage,
        JSON.stringify([...this.diasLidos]),
      );

      // Sistema de backup automático
      this._criarBackupAutomatico();
    } catch (error) {
      console.error("Erro ao salvar progresso:", error);
      throw new Error(
        "Não foi possível salvar o progresso. Verifique o armazenamento local.",
      );
    }
  }

  _carregar() {
    try {
      const dados = localStorage.getItem(this.chaveStorage);
      if (!dados) return;

      JSON.parse(dados).forEach((n) => this.diasLidos.add(Number(n)));
    } catch (error) {
      console.error(
        "Erro ao carregar progresso. Iniciando com conjunto vazio:",
        error,
      );
      this.diasLidos.clear();
    }
  }

  /* --------------------------------------------------------------------------
     SISTEMA DE BACKUP AUTOMÁTICO
     Cria backups periódicos para segurança
  -------------------------------------------------------------------------- */

  _criarBackupAutomatico() {
    try {
      // Contador para não criar backup toda hora
      const contadorStr = localStorage.getItem("backup_counter") || "0";
      let contador = parseInt(contadorStr);

      // Criar backup a cada 20 salvamentos ou se for o primeiro
      if (contador >= 20 || contador === 0) {
        const backup = {
          diasLidos: [...this.diasLidos],
          total: this.diasLidos.size,
          timestamp: new Date().toISOString(),
          versao: "1.0",
        };

        localStorage.setItem(
          `${this.chaveStorage}_auto_backup`,
          JSON.stringify(backup),
        );
        localStorage.setItem("backup_counter", "1");
      } else {
        localStorage.setItem("backup_counter", (contador + 1).toString());
      }
    } catch (error) {
      console.warn("Não foi possível criar backup automático:", error);
    }
  }

  /* --------------------------------------------------------------------------
     UTILITÁRIOS (MÉTODOS LEGACY - MANTIDOS PARA COMPATIBILIDADE)
  -------------------------------------------------------------------------- */

  resetar() {
    // Método legacy - mantido para compatibilidade
    this.diasLidos.clear();
    this._salvar();
    return this.diasLidos.size;
  }

  getDiasLidos() {
    return [...this.diasLidos].sort((a, b) => a - b);
  }
}
