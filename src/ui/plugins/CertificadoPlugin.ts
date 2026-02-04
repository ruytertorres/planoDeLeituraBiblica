/* ============================================================================
   CertificadoPlugin.ts — Plugin Tipado de Certificados de Conclusão
   Versão: 2.0.0 (TypeScript)
   ============================================================================

   Responsabilidade: Gerar e gerenciar certificados de conclusão
   
   Funcionalidades:
   - Validar 90 dias para gerar certificado
   - Gerar certificado ao completar leitura
   - Baixar certificado em formato PDF
   - Mostrar modal com certificado
   
   CONFORMIDADE COM CONTRATO_DO_SISTEMA.MD:
   - §4: Hierarquia de Autoridade (Plugin estende funcionalidade)
   - §10: UI é reflexo (emite eventos, não manipula estado)
   - §3.2: Usa geradorDatas.ts para timestamps (exceção controlada para UI)

   Camada: UI/PLUGIN
   ============================================================================ */

import {
  getTimestampAtual,
  formatarDataCertificado,
  calcularDiferencaDias,
} from "../../core/services/tempo/geradorDatas.js";
import type { MainOrquestrador } from "../orquestradores/MainOrquestrador.js";
import type { PlanoCartucho } from "../../core/types/contratos.types";
import type { IProgressoLeitura } from "../../core/services/planos/ProgressoLeitura.js";

/* ============================================================================
   TIPOS E INTERFACES
   ============================================================================ */

/**
 * Dados para geração do certificado
 */
interface DadosCertificado {
  usuario: string;
  plano: string;
  dataInicio: string;
  dataFim: string;
  percentual: number;
  [key: string]: unknown;
}

/**
 * Interface do plugin de certificado
 */
export interface ICertificadoPlugin {
  name: string;
  init(mainOrquestrador: MainOrquestrador): Promise<void>;
  destroy(): void;
}

/* ============================================================================
   CLASSE CERTIFICADO PLUGIN
   ============================================================================ */

/**
 * Plugin de Certificados de Conclusão.
 *
 * Responsável por:
 * - Validar elegibilidade (90 dias)
 * - Gerar dados do certificado
 * - Baixar certificado em PDF
 * - Emitir eventos
 */
export class CertificadoPlugin implements ICertificadoPlugin {
  /* --------------------------------------------------------------------------
     ATRIBUTOS PRIVADOS
     -------------------------------------------------------------------------- */

  readonly name = "CertificadoPlugin";
  private mainOrquestrador: MainOrquestrador | null = null;

  /* --------------------------------------------------------------------------
     INICIALIZAÇÃO
     -------------------------------------------------------------------------- */

  /**
   * Inicializar plugin
   *
   * @param mainOrquestrador - Referência ao orquestrador principal
   */
  async init(mainOrquestrador: MainOrquestrador): Promise<void> {
    this.mainOrquestrador = mainOrquestrador;

    // Buscar botão de gerar certificado
    const btnCertificado = document.getElementById("btn-gerar-certificado");
    if (btnCertificado) {
      mainOrquestrador.on(btnCertificado, "click", () =>
        this.abrirModalCertificado(),
      );
    }

    // Escutar quando leitura completa
    mainOrquestrador.listen("leitura-completa", (e) => {
      const customEvent = e as CustomEvent;
      this.mostrarCertificado(customEvent.detail);
    });

    console.log(`[${this.name}] Plugin inicializado`);
  }

  /* --------------------------------------------------------------------------
     MODAL E GERAÇÃO
     -------------------------------------------------------------------------- */

  /**
   * Abrir modal de certificado
   */
  private async abrirModalCertificado(): Promise<void> {
    if (!this.mainOrquestrador) return;

    const managers = this.mainOrquestrador.getManagers();
    const progresso = managers.progresso;
    const plano = managers.plano.getPlano();

    // Validação: 90 dias
    if (!this.podeGerar(progresso)) {
      const diasRestantes = this.calcularDiasRestantes(progresso);
      alert(
        `⏳ Faltam ${diasRestantes} dias para gerar o certificado.\n\n` +
          `O certificado só pode ser gerado 90 dias após o início da leitura para evitar fraudes.`,
      );
      return;
    }

    // Validação: leitura completa (100%)
    const percentual = this.calcularPercentual(progresso, plano);
    if (percentual < 100) {
      alert(
        `📖 Conclua a leitura para gerar certificado.\n\n` +
          `Progresso atual: ${percentual}%`,
      );
      return;
    }

    // Gerar e baixar
    await this.gerarCertificado();
  }

  /**
   * Verificar se pode gerar certificado (90 dias)
   *
   * @param progresso - Gerenciador de progresso
   * @returns true se pode gerar
   */
  private podeGerar(progresso: IProgressoLeitura): boolean {
    const dataInicio = (progresso as any).getDataInicio?.();

    if (!dataInicio) {
      // Se não houver data de início registrada, assumir que pode
      return true;
    }

    const diasDecorridos = calcularDiferencaDias(
      dataInicio,
      getTimestampAtual(),
    );
    return diasDecorridos >= 90;
  }

  /**
   * Calcular dias restantes para gerar certificado
   *
   * @param progresso - Gerenciador de progresso
   * @returns Dias restantes
   */
  private calcularDiasRestantes(progresso: IProgressoLeitura): number {
    const dataInicio = (progresso as any).getDataInicio?.();

    if (!dataInicio) return 0;

    const diasDecorridos = calcularDiferencaDias(
      dataInicio,
      getTimestampAtual(),
    );
    return Math.max(0, 90 - diasDecorridos);
  }

  /**
   * Calcular percentual de conclusão
   *
   * @param progresso - Gerenciador de progresso
   * @param plano - Plano de leitura
   * @returns Percentual (0-100)
   */
  private calcularPercentual(
    progresso: IProgressoLeitura,
    plano: PlanoCartucho,
  ): number {
    const lidos = progresso.getTotalLidos();
    const total = plano.dias.length;
    return Math.round((lidos / total) * 100);
  }

  /**
   * Gerar certificado
   */
  private async gerarCertificado(): Promise<void> {
    if (!this.mainOrquestrador) return;

    try {
      const managers = this.mainOrquestrador.getManagers();
      const plano = managers.plano.getPlano();
      const progresso = managers.progresso;

      const dados: DadosCertificado = {
        usuario: "Leitor da Bíblia", // Será preenchido com dados de login
        plano: plano.nome,
        dataInicio: (progresso as any).getDataInicio?.() || getTimestampAtual(),
        dataFim: getTimestampAtual(),
        percentual: this.calcularPercentual(progresso, plano),
      };

      // Criar conteúdo HTML do certificado
      const htmlCertificado = this.criarHtmlCertificado(dados);

      // Mostrar modal
      this.mostrarModalCertificado(htmlCertificado);

      // Emitir evento
      this.mainOrquestrador.emit("certificado-gerado", dados);
    } catch (error) {
      console.error("Erro ao gerar certificado:", error);
      alert("Erro ao gerar certificado. Tente novamente.");
    }
  }

  /**
   * Criar HTML do certificado
   *
   * @param dados - Dados do certificado
   * @returns HTML formatado
   */
  private criarHtmlCertificado(dados: DadosCertificado): string {
    const dataInicioFormatada = formatarDataCertificado(dados.dataInicio);
    const dataFimFormatada = formatarDataCertificado(dados.dataFim);

    return `
      <div style="
        padding: 40px;
        text-align: center;
        border: 3px solid #8B7355;
        background: linear-gradient(135deg, #FFF8DC 0%, #FFFACD 100%);
        font-family: Georgia, serif;
        max-width: 800px;
        margin: 0 auto;
      ">
        <!-- Cabeçalho -->
        <div style="margin-bottom: 30px;">
          <div style="font-size: 48px; color: #8B4513; margin-bottom: 10px;">✝️</div>
          <h1 style="
            font-size: 36px;
            color: #8B4513;
            margin: 0;
            font-weight: normal;
            letter-spacing: 2px;
          ">CERTIFICADO DE CONCLUSÃO</h1>
        </div>

        <!-- Corpo -->
        <div style="margin: 40px 0; font-size: 18px; color: #333;">
          <p style="margin: 20px 0;">
            <strong>Certificamos que</strong>
          </p>

          <h2 style="
            font-size: 28px;
            color: #8B4513;
            margin: 20px 0;
            text-decoration: underline;
          ">${dados.usuario}</h2>

          <p style="margin: 20px 0;">
            <strong>completou com êxito a leitura da Bíblia Sagrada</strong>
          </p>

          <p style="margin: 20px 0;">
            Seguindo o plano <strong>${dados.plano}</strong>
          </p>

          <!-- Data -->
          <div style="
            margin: 30px 0;
            padding: 20px;
            background: rgba(139, 69, 19, 0.05);
            border-radius: 5px;
          ">
            <p style="margin: 10px 0;">
              <strong>Data de Início:</strong> ${dataInicioFormatada}
            </p>
            <p style="margin: 10px 0;">
              <strong>Data de Conclusão:</strong> ${dataFimFormatada}
            </p>
            <p style="margin: 10px 0;">
              <strong>Progresso:</strong> ${dados.percentual}%
            </p>
          </div>

          <!-- Mensagem inspiradora -->
          <p style="
            margin: 30px 0;
            font-size: 16px;
            font-style: italic;
            color: #8B4513;
          ">
            "Toda a Escritura é inspirada por Deus e útil para o ensino,<br>
            para a repreensão, para a correção e para a instrução na justiça."<br>
            <strong>2 Timóteo 3:16</strong>
          </p>
        </div>

        <!-- Rodapé -->
        <div style="
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #8B7355;
          color: #666;
          font-size: 12px;
        ">
          <p>Gerado em ${dataFimFormatada}</p>
          <p>Sistema de Leitura Bíblica Cronológica</p>
        </div>
      </div>
    `;
  }

  /**
   * Mostrar modal com certificado
   *
   * @param htmlCertificado - HTML do certificado
   */
  private mostrarModalCertificado(htmlCertificado: string): void {
    // Criar modal
    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;

    // Container do certificado
    const container = document.createElement("div");
    container.style.cssText = `
      background: white;
      border-radius: 10px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    `;

    // Conteúdo
    const conteudo = document.createElement("div");
    conteudo.innerHTML = htmlCertificado;

    // Botões
    const botoes = document.createElement("div");
    botoes.style.cssText = `
      padding: 20px;
      display: flex;
      gap: 10px;
      justify-content: center;
      background: #f5f5f5;
      border-top: 1px solid #ddd;
    `;

    // Botão baixar
    const btnBaixar = document.createElement("button");
    btnBaixar.textContent = "📥 Baixar Certificado";
    btnBaixar.style.cssText = `
      padding: 10px 20px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    `;
    btnBaixar.addEventListener("click", () =>
      this.baixarCertificadoPDF(conteudo.innerHTML),
    );

    // Botão fechar
    const btnFechar = document.createElement("button");
    btnFechar.textContent = "❌ Fechar";
    btnFechar.style.cssText = `
      padding: 10px 20px;
      background: #f44336;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    `;
    btnFechar.addEventListener("click", () => modal.remove());

    botoes.appendChild(btnBaixar);
    botoes.appendChild(btnFechar);

    container.appendChild(conteudo);
    container.appendChild(botoes);
    modal.appendChild(container);

    // Fechar ao clicar fora
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });

    document.body.appendChild(modal);
  }

  /**
   * Baixar certificado em PDF
   * Usa biblioteca html2pdf via CDN
   *
   * @param htmlCertificado - HTML do certificado
   */
  private async baixarCertificadoPDF(htmlCertificado: string): Promise<void> {
    if (!this.mainOrquestrador) return;

    try {
      // Verificar se html2pdf está disponível
      const html2pdf = (window as any).html2pdf;
      if (typeof html2pdf === "undefined") {
        console.error("html2pdf não carregado");
        alert("⚠️ Erro ao carregar biblioteca PDF. Tente novamente.");
        return;
      }

      // Criar elemento temporário com o certificado
      const elemento = document.createElement("div");
      elemento.innerHTML = htmlCertificado;
      elemento.style.padding = "20px";

      // Configurar opções do PDF
      const opcoes = {
        margin: 10,
        filename: `certificado-${getTimestampAtual()}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: {
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        },
      };

      // Gerar PDF
      console.log("📄 Gerando PDF do certificado...");
      html2pdf().set(opcoes).from(elemento).save();

      // Emitir evento
      this.mainOrquestrador.emit("certificado-baixado", {
        data: getTimestampAtual(),
        tipo: "pdf",
      });

      console.log("✅ PDF gerado com sucesso");
    } catch (error) {
      console.error("❌ Erro ao gerar PDF:", error);
      alert(
        "❌ Erro ao gerar PDF. Tente novamente ou use Ctrl+P para imprimir.",
      );
    }
  }

  /**
   * Mostrar certificado automaticamente ao completar leitura
   *
   * @param dados - Dados da conclusão
   */
  private mostrarCertificado(dados: unknown): void {
    console.log("🎓 Leitura completa! Exibindo certificado...", dados);
    // Chamar gerarCertificado() se atender critérios
  }

  /* --------------------------------------------------------------------------
     LIFECYCLE
     -------------------------------------------------------------------------- */

  /**
   * Cleanup do plugin
   */
  destroy(): void {
    this.mainOrquestrador = null;
    console.log(`🧹 ${this.name} destruído`);
  }
}

export default CertificadoPlugin;
