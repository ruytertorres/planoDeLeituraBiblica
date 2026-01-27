/* ============================================================================
   render_calendario.js — Calendário Corrigido Sem Espelhamento
   Versão: 6.0.0 - CORREÇÃO DEFINITIVA
============================================================================ */

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function renderCalendario({ containerId, dias, onSelecionarDia }) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn("Container não encontrado:", containerId);
    return null;
  }

  // Estado
  const anoAtual = new Date().getFullYear();
  let mesAtual = new Date().getMonth();
  const diaAtualSistema = new Date().getDate();

  // CORREÇÃO: Criar mapa bidirecional para acesso rápido
  const diasPorDataISO = new Map();
  const diasPorNumero = new Map();

  dias.forEach((dia) => {
    if (dia.dataISO) {
      diasPorDataISO.set(dia.dataISO, dia);
      if (dia.numero !== null && dia.numero !== undefined) {
        diasPorNumero.set(dia.numero, dia);
      }
    }
  });

  // --------------------------------------------------------------------------
  // RENDERIZAR MÊS - VERSÃO CORRIGIDA
  // --------------------------------------------------------------------------
  function renderizarMes(ano, mes) {
    container.innerHTML = "";

    // Criar wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "calendar-wrapper";

    // Header
    const header = document.createElement("div");
    header.className = "calendar-header";

    const btnAnterior = document.createElement("button");
    btnAnterior.className = "btn btn-tertiary calendar-nav-btn";
    btnAnterior.textContent = "◀ Mês anterior";
    btnAnterior.onclick = () => {
      mesAtual = mesAtual === 0 ? 11 : mesAtual - 1;
      renderizarMes(anoAtual, mesAtual);
    };

    const titulo = document.createElement("span");
    titulo.className = "calendar-title";
    titulo.textContent = `${MESES[mes]} ${ano}`;

    const btnProximo = document.createElement("button");
    btnProximo.className = "btn btn-tertiary calendar-nav-btn";
    btnProximo.textContent = "Mês seguinte ▶";
    btnProximo.onclick = () => {
      mesAtual = mesAtual === 11 ? 0 : mesAtual + 1;
      renderizarMes(anoAtual, mesAtual);
    };

    header.appendChild(btnAnterior);
    header.appendChild(titulo);
    header.appendChild(btnProximo);

    // Dias da semana
    const diasSemana = document.createElement("div");
    diasSemana.className = "calendar-weekdays";
    ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].forEach((dia) => {
      const div = document.createElement("div");
      div.className = "weekday";
      div.textContent = dia;
      diasSemana.appendChild(div);
    });

    // Grid de dias
    const grid = document.createElement("div");
    grid.className = "calendario-grid";

    // Primeiro dia do mês (0=Dom, 1=Seg, ...)
    const primeiroDia = new Date(ano, mes, 1).getDay();

    // Células vazias iniciais
    for (let i = 0; i < primeiroDia; i++) {
      const vazio = document.createElement("div");
      vazio.className = "calendario-dia-vazio";
      grid.appendChild(vazio);
    }

    // Dias do mês - CORREÇÃO CRÍTICA AQUI
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();

    for (let dia = 1; dia <= diasNoMes; dia++) {
      // Formatar data ISO corretamente
      const dataISO = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

      // Buscar dados do dia NO MAPA (não no array original)
      const infoDia = diasPorDataISO.get(dataISO);

      const diaEl = document.createElement("button");
      diaEl.className = "calendario-dia";
      diaEl.type = "button";
      diaEl.textContent = dia;

      if (infoDia && infoDia.numero !== null && infoDia.numero !== undefined) {
        // DIA COM PLANO
        diaEl.dataset.diaNumero = infoDia.numero;
        diaEl.dataset.dataIso = dataISO;

        // CORREÇÃO: Aplicar estados SOMENTE se for dia válido do plano
        if (infoDia.isLido && !infoDia.semPlano) {
          diaEl.classList.add("lido");
        }

        if (infoDia.isAtivo && !infoDia.semPlano) {
          diaEl.classList.add("ativo");
        }

        // CORREÇÃO: Hoje no plano - verificar consistência
        if (infoDia.isHoje && !infoDia.semPlano) {
          diaEl.classList.add("calendario-hoje-plano");
        }

        // Tooltip informativo
        diaEl.title = `Dia ${infoDia.numero} do plano\n${dataISO}\n${infoDia.isLido ? "✓ Lido" : "○ Não lido"}`;

        // AÇÃO DE CLIQUE - somente para dias com plano
        diaEl.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();

          if (typeof onSelecionarDia === "function") {
            onSelecionarDia(infoDia.numero);
          } else {
            console.error("Erro: onSelecionarDia não é uma função!");
          }
        });
      } else {
        // DIA SEM PLANO - COMPORTAMENTO DIFERENTE
        diaEl.classList.add("calendario-sem-plano");
        diaEl.disabled = true;
        diaEl.title = `${dataISO}\nSem leitura neste plano`;

        // Remover qualquer estado de plano que possa ter vindo por engano
        diaEl.classList.remove("lido", "ativo", "calendario-hoje-plano");
      }

      // CORREÇÃO: Hoje no sistema (calendário) - independente do plano
      const hoje = new Date();
      if (
        ano === hoje.getFullYear() &&
        mes === hoje.getMonth() &&
        dia === hoje.getDate()
      ) {
        diaEl.classList.add("hoje");
      }

      grid.appendChild(diaEl);
    }

    // Montar estrutura
    wrapper.appendChild(header);
    wrapper.appendChild(diasSemana);
    wrapper.appendChild(grid);
    container.appendChild(wrapper);
  }

  // --------------------------------------------------------------------------
  // INICIALIZAÇÃO CORRIGIDA
  // --------------------------------------------------------------------------
  try {
    // Determinar mês inicial baseado no dia ATIVO ou HOJE
    let mesInicial = mesAtual;

    // Procurar dia ativo (selecionado)
    const diaAtivo = Array.from(diasPorNumero.values()).find(
      (d) => d.isAtivo && !d.semPlano,
    );

    if (diaAtivo?.dataISO) {
      const dataParts = diaAtivo.dataISO.split("-");
      const anoDia = parseInt(dataParts[0]);
      const mesDia = parseInt(dataParts[1]) - 1;

      if (anoDia === anoAtual) {
        mesInicial = mesDia;
      }
    }

    // Renderizar com mês corrigido
    mesAtual = mesInicial;
    renderizarMes(anoAtual, mesAtual);

    // Retornar API simples para controle externo
    return {
      highlightDay: (diaNumero) => {
        // 1. Remover destaque anterior de TODOS os dias
        document.querySelectorAll(".calendario-dia.ativo").forEach((el) => {
          el.classList.remove("ativo");
        });

        // 2. Encontrar e destacar o novo dia
        const diaEl = document.querySelector(
          `.calendario-dia[data-dia-numero="${diaNumero}"]`,
        );

        if (diaEl) {
          diaEl.classList.add("ativo");
        } else {
          console.warn(`⚠️ Dia ${diaNumero} não encontrado no calendário`);
        }
      },

      // Método auxiliar para debug
      getEstado: () => ({
        mesAtual: MESES[mesAtual],
        anoAtual,
        totalDiasNoMapa: diasPorDataISO.size,
        totalDiasComPlano: Array.from(diasPorDataISO.values()).filter(
          (d) => d.numero !== null,
        ).length,
      }),
    };
  } catch (error) {
    console.error("❌ Erro crítico no calendário:", error);
    container.innerHTML = `
      <div class="calendar-error">
        <p>Erro no calendário: ${error.message}</p>
        <button onclick="location.reload()" class="btn">Recarregar</button>
      </div>
    `;
    return null;
  }
}
