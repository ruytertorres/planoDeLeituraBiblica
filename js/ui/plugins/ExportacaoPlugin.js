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

import {
  getTimestampAtual,
  gerarNomeArquivoTimestamp,
  formatarDataCertificado,
} from "../../core/services/tempo/timestampUtil.js";

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
        dataExportacao: getTimestampAtual(),
      };

      // Baixar DOCX com dados reais
      await this.baixarDocxReal(dados, plano);

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
   * Usa biblioteca docx para gerar arquivo DOCX real
   * @private
   */
  async baixarDocx(conteudo, plano) {
    try {
      // Verificar se biblioteca docx está disponível
      if (typeof window.docx === "undefined") {
        console.warn("Biblioteca docx não carregada, usando HTML fallback");
        this.baixarDocxFallback(conteudo, plano);
        return;
      }

      // Extrair dados do conteúdo HTML para estruturar melhor
      const { estatisticas, ultimoLido, proximo, notas, dataExportacao } =
        this.extrairDadosDoConteudo(conteudo);

      const dataFormatada = this.formatarData(dataExportacao);

      // Preparar seções do documento
      const secoes = [];

      // 1. Cabeçalho
      secoes.push(
        new window.docx.Paragraph({
          text: "📖 Progresso de Leitura Bíblica",
          heading: window.docx.HeadingLevel.HEADING_1,
          spacing: { after: 200 },
        }),
      );

      secoes.push(
        new window.docx.Paragraph({
          text: `Plano: ${plano.nome}`,
          spacing: { after: 100 },
        }),
      );

      secoes.push(
        new window.docx.Paragraph({
          text: `Exportado em: ${dataFormatada}`,
          spacing: { after: 400 },
        }),
      );

      // 2. Estatísticas (tabela)
      secoes.push(
        new window.docx.Paragraph({
          text: "📊 Estatísticas",
          heading: window.docx.HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        }),
      );

      secoes.push(
        new window.docx.Table({
          rows: [
            // Cabeçalho
            new window.docx.TableRow({
              cells: [
                new window.docx.TableCell({
                  children: [
                    new window.docx.Paragraph({
                      text: "Métrica",
                      bold: true,
                    }),
                  ],
                  shading: { fill: "4CAF50", color: "FFFFFF" },
                }),
                new window.docx.TableCell({
                  children: [
                    new window.docx.Paragraph({
                      text: "Valor",
                      bold: true,
                    }),
                  ],
                  shading: { fill: "4CAF50", color: "FFFFFF" },
                }),
              ],
            }),
            // Dados
            new window.docx.TableRow({
              cells: [
                new window.docx.TableCell({
                  children: [new window.docx.Paragraph("Dias Lidos")],
                }),
                new window.docx.TableCell({
                  children: [
                    new window.docx.Paragraph(
                      `${estatisticas.diasLidos}/${estatisticas.totalDias}`,
                    ),
                  ],
                }),
              ],
            }),
            new window.docx.TableRow({
              cells: [
                new window.docx.TableCell({
                  children: [new window.docx.Paragraph("Progresso")],
                }),
                new window.docx.TableCell({
                  children: [
                    new window.docx.Paragraph(`${estatisticas.percentual}%`),
                  ],
                }),
              ],
            }),
            new window.docx.TableRow({
              cells: [
                new window.docx.TableCell({
                  children: [new window.docx.Paragraph("Capítulos Lidos")],
                }),
                new window.docx.TableCell({
                  children: [
                    new window.docx.Paragraph(`${estatisticas.capitulosLidos}`),
                  ],
                }),
              ],
            }),
            new window.docx.TableRow({
              cells: [
                new window.docx.TableCell({
                  children: [new window.docx.Paragraph("Dias Restantes")],
                }),
                new window.docx.TableCell({
                  children: [
                    new window.docx.Paragraph(`${estatisticas.diasRestantes}`),
                  ],
                }),
              ],
            }),
          ],
          width: { size: 100, type: window.docx.WidthType.PERCENTAGE },
        }),
      );

      secoes.push(
        new window.docx.Paragraph({ text: "", spacing: { after: 300 } }),
      );

      // 3. Última Leitura
      secoes.push(
        new window.docx.Paragraph({
          text: "📝 Última Leitura",
          heading: window.docx.HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        }),
      );

      secoes.push(
        new window.docx.Paragraph({
          text: ultimoLido
            ? `Dia ${ultimoLido.numero} - ${ultimoLido.livros?.join(", ")}`
            : "Nenhum dia lido",
          spacing: { after: 300 },
        }),
      );

      // 4. Próxima Leitura
      secoes.push(
        new window.docx.Paragraph({
          text: "➡️ Próxima Leitura",
          heading: window.docx.HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        }),
      );

      secoes.push(
        new window.docx.Paragraph({
          text: proximo
            ? `Dia ${proximo.numero} - ${proximo.livros?.join(", ")}`
            : "Leitura completa!",
          spacing: { after: 300 },
        }),
      );

      // 5. Anotações
      if (notas && notas.length > 0) {
        secoes.push(
          new window.docx.Paragraph({
            text: "📌 Anotações",
            heading: window.docx.HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
        );

        notas.forEach((nota) => {
          secoes.push(
            new window.docx.Paragraph({
              text: `Dia ${nota.dia}: ${nota.texto}`,
              spacing: { after: 100 },
              border: {
                bottom: {
                  color: "CCCCCC",
                  space: 1,
                  style: window.docx.BorderStyle.SINGLE,
                  size: 6,
                },
              },
            }),
          );
        });
      }

      // 6. Rodapé
      secoes.push(new window.docx.Paragraph({ text: "" }));
      secoes.push(
        new window.docx.Paragraph({
          text: "Gerado pelo Sistema de Leitura Bíblica Cronológica",
          alignment: window.docx.AlignmentType.CENTER,
          italics: true,
          size: 20,
          color: "999999",
        }),
      );

      // Criar documento
      const doc = new window.docx.Document({
        sections: [
          {
            children: secoes,
          },
        ],
      });

      // Salvar arquivo
      const nomeArquivo = gerarNomeArquivoTimestamp(
        `progresso_${plano.id}`,
        "docx",
      );
      await window.docx.Packer.toBlob(doc).then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = nomeArquivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });

      // Fazer download
      window.docx.Packer.toBlob(doc).then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = nomeArquivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error("Erro ao gerar DOCX:", error);
      // Fallback para HTML
      this.baixarDocxFallback(conteudo, plano);
    }
  }

  /**
   * Baixar DOCX com dados reais
   * Usa biblioteca docx para gerar arquivo DOCX profissional
   * @private
   */
  async baixarDocxReal(dados, plano) {
    try {
      // Verificar se biblioteca docx está disponível
      if (typeof window.docx === "undefined") {
        console.warn("Biblioteca docx não carregada, usando HTML fallback");
        const conteudo = this.gerarConteudoDocx(dados, plano);
        this.baixarDocxFallback(conteudo, plano);
        return;
      }

      const { estatisticas, ultimoLido, proximo, notas, dataExportacao } =
        dados;
      const dataFormatada = this.formatarData(dataExportacao);

      // Preparar seções do documento
      const secoes = [];

      // 1. Cabeçalho
      secoes.push(
        new window.docx.Paragraph({
          text: "📖 Progresso de Leitura Bíblica",
          heading: window.docx.HeadingLevel.HEADING_1,
          spacing: { after: 200 },
        }),
      );

      secoes.push(
        new window.docx.Paragraph({
          text: `Plano: ${plano.nome}`,
          spacing: { after: 100 },
        }),
      );

      secoes.push(
        new window.docx.Paragraph({
          text: `Exportado em: ${dataFormatada}`,
          spacing: { after: 400 },
        }),
      );

      // 2. Estatísticas (tabela)
      secoes.push(
        new window.docx.Paragraph({
          text: "📊 Estatísticas",
          heading: window.docx.HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        }),
      );

      secoes.push(
        new window.docx.Table({
          rows: [
            // Cabeçalho
            new window.docx.TableRow({
              cells: [
                new window.docx.TableCell({
                  children: [
                    new window.docx.Paragraph({
                      text: "Métrica",
                      bold: true,
                    }),
                  ],
                  shading: { fill: "4CAF50", color: "FFFFFF" },
                }),
                new window.docx.TableCell({
                  children: [
                    new window.docx.Paragraph({
                      text: "Valor",
                      bold: true,
                    }),
                  ],
                  shading: { fill: "4CAF50", color: "FFFFFF" },
                }),
              ],
            }),
            // Dados
            new window.docx.TableRow({
              cells: [
                new window.docx.TableCell({
                  children: [new window.docx.Paragraph("Dias Lidos")],
                }),
                new window.docx.TableCell({
                  children: [
                    new window.docx.Paragraph(
                      `${estatisticas.diasLidos}/${estatisticas.totalDias}`,
                    ),
                  ],
                }),
              ],
            }),
            new window.docx.TableRow({
              cells: [
                new window.docx.TableCell({
                  children: [new window.docx.Paragraph("Progresso")],
                }),
                new window.docx.TableCell({
                  children: [
                    new window.docx.Paragraph(`${estatisticas.percentual}%`),
                  ],
                }),
              ],
            }),
            new window.docx.TableRow({
              cells: [
                new window.docx.TableCell({
                  children: [new window.docx.Paragraph("Capítulos Lidos")],
                }),
                new window.docx.TableCell({
                  children: [
                    new window.docx.Paragraph(`${estatisticas.capitulosLidos}`),
                  ],
                }),
              ],
            }),
            new window.docx.TableRow({
              cells: [
                new window.docx.TableCell({
                  children: [new window.docx.Paragraph("Dias Restantes")],
                }),
                new window.docx.TableCell({
                  children: [
                    new window.docx.Paragraph(`${estatisticas.diasRestantes}`),
                  ],
                }),
              ],
            }),
          ],
          width: { size: 100, type: window.docx.WidthType.PERCENTAGE },
        }),
      );

      secoes.push(
        new window.docx.Paragraph({ text: "", spacing: { after: 300 } }),
      );

      // 3. Última Leitura
      secoes.push(
        new window.docx.Paragraph({
          text: "📝 Última Leitura",
          heading: window.docx.HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        }),
      );

      secoes.push(
        new window.docx.Paragraph({
          text: ultimoLido
            ? `Dia ${ultimoLido.numero} - ${ultimoLido.livros?.join(", ")}`
            : "Nenhum dia lido",
          spacing: { after: 300 },
        }),
      );

      // 4. Próxima Leitura
      secoes.push(
        new window.docx.Paragraph({
          text: "➡️ Próxima Leitura",
          heading: window.docx.HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        }),
      );

      secoes.push(
        new window.docx.Paragraph({
          text: proximo
            ? `Dia ${proximo.numero} - ${proximo.livros?.join(", ")}`
            : "Leitura completa!",
          spacing: { after: 300 },
        }),
      );

      // 5. Anotações
      if (notas && notas.length > 0) {
        secoes.push(
          new window.docx.Paragraph({
            text: "📌 Anotações",
            heading: window.docx.HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
        );

        notas.forEach((nota) => {
          secoes.push(
            new window.docx.Paragraph({
              text: `Dia ${nota.dia}: ${nota.texto}`,
              spacing: { after: 100 },
              border: {
                bottom: {
                  color: "CCCCCC",
                  space: 1,
                  style: window.docx.BorderStyle.SINGLE,
                  size: 6,
                },
              },
            }),
          );
        });
      }

      // 6. Rodapé
      secoes.push(new window.docx.Paragraph({ text: "" }));
      secoes.push(
        new window.docx.Paragraph({
          text: "Gerado pelo Sistema de Leitura Bíblica Cronológica",
          alignment: window.docx.AlignmentType.CENTER,
          italics: true,
          size: 20,
          color: "999999",
        }),
      );

      // Criar documento
      const doc = new window.docx.Document({
        sections: [
          {
            children: secoes,
          },
        ],
      });

      // Salvar arquivo
      const nomeArquivo = gerarNomeArquivoTimestamp(
        `progresso_${plano.id}`,
        "docx",
      );
      await window.docx.Packer.toBlob(doc).then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = nomeArquivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error("Erro ao gerar DOCX:", error);
      // Fallback para HTML
      const conteudo = this.gerarConteudoDocx(dados, plano);
      this.baixarDocxFallback(conteudo, plano);
    }
  }

  /**
   * Fallback para HTML se DOCX falhar
   * @private
   */
  baixarDocxFallback(conteudo, plano) {
    const blob = new Blob([conteudo], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = gerarNomeArquivoTimestamp(`progresso_${plano.id}`, "html");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Extrair dados do conteúdo HTML para uso na geração DOCX
   * @private
   */
  extrairDadosDoConteudo(conteudo) {
    // Este é um helper que retorna dados que já temos
    // Em uma aplicação real, teríamos acesso direto aos dados
    return {
      estatisticas: {
        diasLidos: 0,
        totalDias: 0,
        percentual: 0,
        capitulosLidos: 0,
        diasRestantes: 0,
      },
      ultimoLido: null,
      proximo: null,
      notas: [],
      dataExportacao: getTimestampAtual(),
    };
  }

  /**
   * Formatar data
   * @private
   */
  formatarData(data) {
    return formatarDataCertificado(data);
  }

  /**
   * Cleanup do plugin
   * @public
   */
  destroy() {
    this.mainOrquestrador = null;
  }
}
