/* ============================================================================
   ExportacaoPlugin.js — Plugin de Exportação de Progresso
============================================================================
   Responsabilidade: Exportar progresso e notas para DOCX
   
   Funcionalidades:
   - Calcular estatísticas
   - Gerar DOCX com progresso
   - Incluir notas do usuário
   - Baixar arquivo
   
   Camada: UI/PLUGIN
   Registrado em: MainOrquestrador
   
   TODO: Integrar com biblioteca docx ou docxtemplater
============================================================================ */

/**
 * Plugin de Exportação
 *
 * Responsável por:
 * - Coletar dados de progresso
 * - Formatar para DOCX
 * - Baixar arquivo
 * - Emitir eventos
 */
export class ExportacaoPlugin {
  constructor() {
    this.name = "ExportacaoPlugin";
    this.mainOrquestrador = null;
  }

  /**
   * Inicializar plugin
   *
   * @param {MainOrquestrador} mainOrquestrador - Referência ao orquestrador
   * @public
   */
  async init(mainOrquestrador) {
    this.mainOrquestrador = mainOrquestrador;

    // Buscar botão de exportar
    const btnExportar = document.getElementById("btn-exportar-progresso");
    if (btnExportar) {
      mainOrquestrador.on(btnExportar, "click", () => this.exportarProgresso());
    }

    console.log(`✅ ${this.name} inicializado`);
  }

  /**
   * Exportar progresso
   * @private
   */
  async exportarProgresso() {
    try {
      const plano = this.mainOrquestrador.state.managers.plano.getPlano();
      const progresso = this.mainOrquestrador.state.managers.progresso;
      const notas = this.mainOrquestrador.state.managers.notas;

      // Coletar dados
      const dados = {
        estatisticas: this.calcularEstatisticas(progresso, plano),
        ultimoLido: this.getUltimoLido(progresso, plano),
        proximo: this.getProximoDia(progresso, plano),
        notas: notas.getTodasAsNotas?.() || [],
        dataExportacao: new Date(),
      };

      // Gerar conteúdo
      const conteudo = this.gerarConteudoDocx(dados, plano);

      // Baixar
      await this.baixarDocx(conteudo, plano);

      // Emitir evento
      this.mainOrquestrador.emit("progresso-exportado", dados);

      alert("✅ Progresso exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar progresso:", error);
      alert("❌ Erro ao exportar progresso. Tente novamente.");
    }
  }

  /**
   * Calcular estatísticas
   * @private
   */
  calcularEstatisticas(progresso, plano) {
    const diasLidos = progresso.getTotalLidos();
    const totalDias = plano.dias.length;
    const percentual = Math.round((diasLidos / totalDias) * 100);

    // Calcular capítulos lidos (aproximado: média de 1.5 cap/dia)
    const capitulosLidos = Math.floor(diasLidos * 1.5);

    return {
      diasLidos,
      totalDias,
      percentual,
      capitulosLidos,
      diasRestantes: totalDias - diasLidos,
    };
  }

  /**
   * Obter último dia lido
   * @private
   */
  getUltimoLido(progresso, plano) {
    let ultimoDia = null;

    // Procurar do final para o começo
    for (let i = plano.dias.length; i >= 1; i--) {
      if (progresso.estaLido(i)) {
        ultimoDia = plano.getDia(i);
        break;
      }
    }

    return ultimoDia;
  }

  /**
   * Obter próximo dia a ler
   * @private
   */
  getProximoDia(progresso, plano) {
    // Procurar do começo para encontrar primeiro não lido
    for (let i = 1; i <= plano.dias.length; i++) {
      if (!progresso.estaLido(i)) {
        return plano.getDia(i);
      }
    }

    // Se todos lidos, retornar null
    return null;
  }

  /**
   * Gerar conteúdo do DOCX (HTML temporário)
   *
   * TODO: Converter para formato DOCX real usando biblioteca
   * @private
   */
  gerarConteudoDocx(dados, plano) {
    const { estatisticas, ultimoLido, proximo, notas, dataExportacao } = dados;

    const dataFormatada = this.formatarData(dataExportacao);
    const ultimoDiaTexto = ultimoLido
      ? `${ultimoLido.numero} - ${ultimoLido.livros?.join(", ")}`
      : "Nenhum dia lido";
    const proximoTexto = proximo
      ? `${proximo.numero} - ${proximo.livros?.join(", ")}`
      : "Leitura completa!";

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Progresso de Leitura Bíblica</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
    h1 { color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; }
    h2 { color: #555; margin-top: 20px; }
    .info { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0; }
    .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .stat-box { background: #e8f5e9; padding: 15px; border-radius: 5px; border-left: 4px solid #4CAF50; }
    .stat-value { font-size: 24px; font-weight: bold; color: #4CAF50; }
    .stat-label { font-size: 12px; color: #666; text-transform: uppercase; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th { background: #4CAF50; color: white; padding: 10px; text-align: left; }
    td { padding: 10px; border-bottom: 1px solid #ddd; }
    tr:nth-child(even) { background: #f9f9f9; }
    .notas { margin-top: 30px; }
    .nota { background: #fff3e0; padding: 10px; margin: 10px 0; border-radius: 3px; }
  </style>
</head>
<body>
  <h1>📖 Progresso de Leitura Bíblica</h1>
  <p>Plano: <strong>${plano.nome}</strong></p>
  <p>Exportado em: ${dataFormatada}</p>

  <h2>📊 Estatísticas</h2>
  <div class="stats">
    <div class="stat-box">
      <div class="stat-label">Dias Lidos</div>
      <div class="stat-value">${estatisticas.diasLidos}/${estatisticas.totalDias}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Progresso</div>
      <div class="stat-value">${estatisticas.percentual}%</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Capítulos Lidos</div>
      <div class="stat-value">${estatisticas.capitulosLidos}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Dias Restantes</div>
      <div class="stat-value">${estatisticas.diasRestantes}</div>
    </div>
  </div>

  <h2>📝 Última Leitura</h2>
  <div class="info">
    <strong>Dia:</strong> ${ultimoDiaTexto}
  </div>

  <h2>➡️ Próxima Leitura</h2>
  <div class="info">
    <strong>Dia:</strong> ${proximoTexto}
  </div>

  ${
    notas && notas.length > 0
      ? `
  <h2>📌 Anotações</h2>
  <div class="notas">
    ${notas.map((nota) => `<div class="nota"><strong>Dia ${nota.dia}:</strong> ${nota.texto}</div>`).join("")}
  </div>
  `
      : ""
  }

  <hr style="margin-top: 40px; border: none; border-top: 1px solid #ddd;">
  <footer style="text-align: center; color: #999; font-size: 12px;">
    <p>Gerado pelo Sistema de Leitura Bíblica</p>
  </footer>
</body>
</html>
    `;
  }

  /**
   * Baixar DOCX
   *
   * TODO: Integrar com biblioteca docx para gerar arquivo real
   * Por enquanto, baixa como HTML
   *
   * @private
   */
  async baixarDocx(conteudo, plano) {
    // Criar blob HTML
    const blob = new Blob([conteudo], { type: "text/html" });

    // Criar link de download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `progresso_${plano.id}_${new Date().toISOString().split("T")[0]}.html`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  /**
   * Formatar data
   * @private
   */
  formatarData(data) {
    const d = new Date(data);
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const ano = d.getFullYear();
    const hora = String(d.getHours()).padStart(2, "0");
    const minuto = String(d.getMinutes()).padStart(2, "0");

    return `${dia}/${mes}/${ano} às ${hora}:${minuto}`;
  }

  /**
   * Cleanup do plugin
   * @public
   */
  destroy() {
    this.mainOrquestrador = null;
    console.log(`🧹 ${this.name} destruído`);
  }
}
