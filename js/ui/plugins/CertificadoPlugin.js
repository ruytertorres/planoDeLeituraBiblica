/* ============================================================================
   CertificadoPlugin.js — Plugin de Certificados de Conclusão
============================================================================
   Responsabilidade: Gerar e gerenciar certificados de conclusão
   
   Funcionalidades:
   - Validar 90 dias para gerar certificado
   - Gerar certificado ao completar leitura
   - Baixar certificado em formato PDF
   - Mostrar modal com certificado
   
   Camada: UI/PLUGIN
   Registrado em: MainOrquestrador
============================================================================ */

/**
 * Plugin de Certificados
 *
 * Responsável por:
 * - Validar elegibilidade (90 dias)
 * - Gerar dados do certificado
 * - Baixar certificado
 * - Emitir eventos
 */
export class CertificadoPlugin {
  constructor() {
    this.name = "CertificadoPlugin";
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

    // Buscar botão de gerar certificado
    const btnCertificado = document.getElementById("btn-gerar-certificado");
    if (btnCertificado) {
      mainOrquestrador.on(btnCertificado, "click", () =>
        this.abrirModalCertificado(),
      );
    }

    // Escutar quando leitura completa
    mainOrquestrador.listen("leitura-completa", (e) => {
      this.mostrarCertificado(e.detail);
    });

    console.log(`✅ ${this.name} inicializado`);
  }

  /**
   * Abrir modal de certificado
   * @private
   */
  async abrirModalCertificado() {
    const progresso = this.mainOrquestrador.state.managers.progresso;
    const plano = this.mainOrquestrador.state.managers.plano.getPlano();

    // Validação: 90 dias
    if (!this.podeGerar()) {
      const diasRestantes = this.calcularDiasRestantes();
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
   * @returns {boolean}
   * @private
   */
  podeGerar() {
    const progresso = this.mainOrquestrador.state.managers.progresso;
    const dataInicio = progresso.getDataInicio?.();

    if (!dataInicio) {
      // Se não houver data de início registrada, assumir que pode
      return true;
    }

    const agora = new Date();
    const diasDecorridos = Math.floor(
      (agora - dataInicio) / (1000 * 60 * 60 * 24),
    );

    return diasDecorridos >= 90;
  }

  /**
   * Calcular dias restantes para gerar certificado
   * @returns {number}
   * @private
   */
  calcularDiasRestantes() {
    const progresso = this.mainOrquestrador.state.managers.progresso;
    const dataInicio = progresso.getDataInicio?.();

    if (!dataInicio) return 0;

    const agora = new Date();
    const diasDecorridos = Math.floor(
      (agora - dataInicio) / (1000 * 60 * 60 * 24),
    );
    return Math.max(0, 90 - diasDecorridos);
  }

  /**
   * Calcular percentual de conclusão
   * @private
   */
  calcularPercentual(progresso, plano) {
    const lidos = progresso.getTotalLidos();
    const total = plano.dias.length;
    return Math.round((lidos / total) * 100);
  }

  /**
   * Gerar certificado
   * @private
   */
  async gerarCertificado() {
    try {
      const plano = this.mainOrquestrador.state.managers.plano.getPlano();
      const progresso = this.mainOrquestrador.state.managers.progresso;

      const dados = {
        usuario: "Leitor da Bíblia", // Será preenchido com dados de login
        plano: plano.nome,
        dataInicio: progresso.getDataInicio?.() || new Date(),
        dataFim: new Date(),
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
   * @private
   */
  criarHtmlCertificado(dados) {
    const dataInicioFormatada = this.formatarData(dados.dataInicio);
    const dataFimFormatada = this.formatarData(dados.dataFim);

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
   * @private
   */
  mostrarModalCertificado(htmlCertificado) {
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
   * (Requer biblioteca como html2pdf ou pdfkit)
   * @private
   */
  async baixarCertificadoPDF(htmlCertificado) {
    // TODO: Implementar com html2pdf ou similar
    alert(
      "📥 Recurso de download em desenvolvimento.\n\nCertificado pode ser impresso usando Ctrl+P",
    );
  }

  /**
   * Mostrar certificado automaticamente ao completar leitura
   * @private
   */
  mostrarCertificado(dados) {
    console.log("🎓 Leitura completa! Exibindo certificado...", dados);
    // Chamar gerarCertificado()
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
    return `${dia}/${mes}/${ano}`;
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
