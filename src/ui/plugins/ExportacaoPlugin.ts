/* ============================================================================
   ExportacaoPlugin.ts — Plugin Tipado de Exportação de Progresso
   Versão: 2.0.0 (TypeScript)
   ============================================================================ */

import {
  getTimestampAtual,
  gerarNomeArquivoTimestamp,
  formatarDataCertificado,
} from "../../core/services/tempo/geradorDatas.js";
import type { MainOrquestrador } from "../orquestradores/MainOrquestrador.js";
import type {
  PlanoCartucho,
  DiaDoPlano,
} from "../../core/types/contratos.types";
import type { IProgressoLeitura } from "../../core/services/planos/ProgressoLeitura.js";

interface EstatisticasExportacao {
  diasLidos: number;
  totalDias: number;
  percentual: number;
  capitulosLidos: number;
  diasRestantes: number;
}

interface DadosExportacao {
  estatisticas: EstatisticasExportacao;
  ultimoLido: DiaDoPlano | null;
  proximo: DiaDoPlano | null;
  notas: unknown[];
  dataExportacao: string;
  [key: string]: unknown;
}

export class ExportacaoPlugin {
  readonly name = "ExportacaoPlugin";
  private mainOrquestrador: MainOrquestrador | null = null;

  async init(mainOrquestrador: MainOrquestrador): Promise<void> {
    this.mainOrquestrador = mainOrquestrador;
    const btnExportar = document.getElementById("btn-exportar-progresso");
    if (btnExportar) {
      mainOrquestrador.on(btnExportar, "click", () => this.exportarProgresso());
    }
  }

  private async exportarProgresso(): Promise<void> {
    if (!this.mainOrquestrador) return;
    try {
      const managers = this.mainOrquestrador.getManagers();
      const plano = managers.plano.getPlano();
      const progresso = managers.progresso;
      const notas = managers.notas;

      const dados: DadosExportacao = {
        estatisticas: this.calcularEstatisticas(progresso, plano),
        ultimoLido: this.getUltimoLido(progresso, plano),
        proximo: this.getProximoDia(progresso, plano),
        notas: (notas as any).getTodasAsNotas?.() || [],
        dataExportacao: getTimestampAtual(),
      };

      await this.baixarDocxReal(dados, plano);
      this.mainOrquestrador.emit("progresso-exportado", dados);
      alert("Progresso exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar progresso:", error);
      alert("Erro ao exportar progresso. Tente novamente.");
    }
  }

  private calcularEstatisticas(
    progresso: IProgressoLeitura,
    plano: PlanoCartucho,
  ): EstatisticasExportacao {
    const diasLidos = progresso.getTotalLidos();
    const totalDias = plano.dias.length;
    const percentual = Math.round((diasLidos / totalDias) * 100);
    const capitulosLidos = Math.floor(diasLidos * 1.5);
    return {
      diasLidos,
      totalDias,
      percentual,
      capitulosLidos,
      diasRestantes: totalDias - diasLidos,
    };
  }

  private getUltimoLido(
    progresso: IProgressoLeitura,
    plano: PlanoCartucho,
  ): DiaDoPlano | null {
    for (let i = plano.dias.length; i >= 1; i--) {
      if (progresso.estaLido(i)) {
        return plano.dias[i - 1];
      }
    }
    return null;
  }

  private getProximoDia(
    progresso: IProgressoLeitura,
    plano: PlanoCartucho,
  ): DiaDoPlano | null {
    for (let i = 1; i <= plano.dias.length; i++) {
      if (!progresso.estaLido(i)) {
        return plano.dias[i - 1];
      }
    }
    return null;
  }

  private async baixarDocxReal(
    dados: DadosExportacao,
    plano: PlanoCartucho,
  ): Promise<void> {
    try {
      const docx = (window as any).docx;
      if (typeof docx === "undefined") {
        console.warn("Biblioteca docx não carregada");
        this.baixarHtmlFallback(dados, plano);
        return;
      }

      const { estatisticas, ultimoLido, proximo, notas, dataExportacao } = dados;
      const dataFormatada = formatarDataCertificado(dataExportacao);
      const secoes: unknown[] = [];

      secoes.push(
        new docx.Paragraph({
          text: "Progresso de Leitura Bíblica",
          heading: docx.HeadingLevel.HEADING_1,
          spacing: { after: 200 },
        }),
        new docx.Paragraph({
          text: `Plano: ${plano.nome}`,
          spacing: { after: 100 },
        }),
        new docx.Paragraph({
          text: `Exportado em: ${dataFormatada}`,
          spacing: { after: 400 },
        }),
      );

      secoes.push(
        new docx.Paragraph({
          text: "Estatísticas",
          heading: docx.HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        }),
        this.criarTabelaEstatisticas(docx, estatisticas),
        new docx.Paragraph({ text: "", spacing: { after: 300 } }),
      );

      const ultimoTexto = ultimoLido
        ? `Dia ${ultimoLido.numero} - ${[...(ultimoLido.antigoTestamento || []), ...(ultimoLido.novoTestamento || [])].map((r) => r.livroNome).join(", ")}`
        : "Nenhum dia lido";
      secoes.push(
        new docx.Paragraph({
          text: "Última Leitura",
          heading: docx.HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        }),
        new docx.Paragraph({ text: ultimoTexto, spacing: { after: 300 } }),
      );

      const proximoTexto = proximo
        ? `Dia ${proximo.numero} - ${[...(proximo.antigoTestamento || []), ...(proximo.novoTestamento || [])].map((r) => r.livroNome).join(", ")}`
        : "Leitura completa!";
      secoes.push(
        new docx.Paragraph({
          text: "Próxima Leitura",
          heading: docx.HeadingLevel.HEADING_2,
          spacing: { after: 200 },
        }),
        new docx.Paragraph({ text: proximoTexto, spacing: { after: 300 } }),
      );

      if (notas && notas.length > 0) {
        secoes.push(
          new docx.Paragraph({
            text: "Anotações",
            heading: docx.HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
        );
        notas.forEach((nota: any) => {
          secoes.push(
            new docx.Paragraph({
              text: `Dia ${nota.dia}: ${nota.texto}`,
              spacing: { after: 100 },
            }),
          );
        });
      }

      secoes.push(
        new docx.Paragraph({ text: "" }),
        new docx.Paragraph({
          text: "Gerado pelo Sistema de Leitura Bíblica Cronológica",
          alignment: docx.AlignmentType.CENTER,
          italics: true,
          size: 20,
          color: "999999",
        }),
      );

      const documento = new docx.Document({
        sections: [{ children: secoes }],
      });

      const nomeArquivo = gerarNomeArquivoTimestamp(
        `progresso_${plano.id}`,
        "docx",
      );
      const blob = await docx.Packer.toBlob(documento);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = nomeArquivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao gerar DOCX:", error);
      this.baixarHtmlFallback(dados, plano);
    }
  }

  private criarTabelaEstatisticas(docx: any, estatisticas: EstatisticasExportacao): unknown {
    return new docx.Table({
      rows: [
        new docx.TableRow({
          cells: [
            new docx.TableCell({
              children: [new docx.Paragraph({ text: "Métrica", bold: true })],
              shading: { fill: "4CAF50", color: "FFFFFF" },
            }),
            new docx.TableCell({
              children: [new docx.Paragraph({ text: "Valor", bold: true })],
              shading: { fill: "4CAF50", color: "FFFFFF" },
            }),
          ],
        }),
        new docx.TableRow({
          cells: [
            new docx.TableCell({ children: [new docx.Paragraph("Dias Lidos")] }),
            new docx.TableCell({
              children: [new docx.Paragraph(`${estatisticas.diasLidos}/${estatisticas.totalDias}`)],
            }),
          ],
        }),
        new docx.TableRow({
          cells: [
            new docx.TableCell({ children: [new docx.Paragraph("Progresso")] }),
            new docx.TableCell({ children: [new docx.Paragraph(`${estatisticas.percentual}%`)] }),
          ],
        }),
        new docx.TableRow({
          cells: [
            new docx.TableCell({ children: [new docx.Paragraph("Capítulos Lidos")] }),
            new docx.TableCell({ children: [new docx.Paragraph(`${estatisticas.capitulosLidos}`)] }),
          ],
        }),
        new docx.TableRow({
          cells: [
            new docx.TableCell({ children: [new docx.Paragraph("Dias Restantes")] }),
            new docx.TableCell({ children: [new docx.Paragraph(`${estatisticas.diasRestantes}`)] }),
          ],
        }),
      ],
      width: { size: 100, type: docx.WidthType.PERCENTAGE },
    });
  }

  private baixarHtmlFallback(dados: DadosExportacao, plano: PlanoCartucho): void {
    const html = this.gerarHtmlExportacao(dados, plano);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = gerarNomeArquivoTimestamp(`progresso_${plano.id}`, "html");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private gerarHtmlExportacao(dados: DadosExportacao, plano: PlanoCartucho): string {
    const { estatisticas, ultimoLido, proximo, dataExportacao } = dados;
    const dataFormatada = formatarDataCertificado(dataExportacao);
    const ultimoTexto = ultimoLido
      ? `Dia ${ultimoLido.numero} - ${[...(ultimoLido.antigoTestamento || []), ...(ultimoLido.novoTestamento || [])].map((r) => r.livroNome).join(", ")}`
      : "Nenhum dia lido";
    const proximoTexto = proximo
      ? `Dia ${proximo.numero} - ${[...(proximo.antigoTestamento || []), ...(proximo.novoTestamento || [])].map((r) => r.livroNome).join(", ")}`
      : "Leitura completa!";

    return `<!DOCTYPE html>
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
  </style>
</head>
<body>
  <h1>Progresso de Leitura Bíblica</h1>
  <p>Plano: <strong>${plano.nome}</strong></p>
  <p>Exportado em: ${dataFormatada}</p>
  <h2>Estatísticas</h2>
  <div class="stats">
    <div class="stat-box"><div class="stat-label">Dias Lidos</div><div class="stat-value">${estatisticas.diasLidos}/${estatisticas.totalDias}</div></div>
    <div class="stat-box"><div class="stat-label">Progresso</div><div class="stat-value">${estatisticas.percentual}%</div></div>
    <div class="stat-box"><div class="stat-label">Capítulos Lidos</div><div class="stat-value">${estatisticas.capitulosLidos}</div></div>
    <div class="stat-box"><div class="stat-label">Dias Restantes</div><div class="stat-value">${estatisticas.diasRestantes}</div></div>
  </div>
  <h2>Última Leitura</h2>
  <div class="info"><strong>Dia:</strong> ${ultimoTexto}</div>
  <h2>Próxima Leitura</h2>
  <div class="info"><strong>Dia:</strong> ${proximoTexto}</div>
  <footer style="text-align: center; color: #999; font-size: 12px; margin-top: 40px;">
    <p>Gerado pelo Sistema de Leitura Bíblica</p>
  </footer>
</body>
</html>`;
  }

  destroy(): void {
    this.mainOrquestrador = null;
  }
}

export default ExportacaoPlugin;
