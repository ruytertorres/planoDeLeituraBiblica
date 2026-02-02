"use strict";
/* ============================================================================
   render_calendario.js — Renderização Burra de Calendário
   Versão: 7.0.0 - CONFORME AO CONTRATO
============================================================================ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderCalendario = renderCalendario;
function renderCalendario({ containerId, viewModel }) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn("Container não encontrado:", containerId);
        return null;
    }
    container.innerHTML = "";
    const wrapper = document.createElement("div");
    wrapper.className = "calendar-wrapper";
    // Renderizar apenas um mês (recalcular dinamicamente via gerarMesAtual)
    const mes = viewModel.gerarMesAtual();
    // Header com botões de navegação
    const header = document.createElement("div");
    header.className = "calendar-header";
    const btnAnterior = document.createElement("button");
    btnAnterior.type = "button";
    btnAnterior.className = "nav-mes-btn anterior";
    btnAnterior.textContent = "◀ anterior";
    btnAnterior.addEventListener("click", () => {
        viewModel.onMesPosterior();
        // Regenerar renderização (o mes será recalculado)
        renderCalendario({ containerId, viewModel });
    });
    const titulo = document.createElement("span");
    titulo.className = "calendar-title";
    titulo.textContent = `${mes.nome} ${mes.ano}`;
    const btnProximo = document.createElement("button");
    btnProximo.type = "button";
    btnProximo.className = "nav-mes-btn proximo";
    btnProximo.textContent = "posterior ▶";
    btnProximo.addEventListener("click", () => {
        viewModel.onProximoMes();
        // Regenerar renderização (o mes será recalculado)
        renderCalendario({ containerId, viewModel });
    });
    header.appendChild(btnAnterior);
    header.appendChild(titulo);
    header.appendChild(btnProximo);
    wrapper.appendChild(header);
    // Grid de dias
    const grid = document.createElement("div");
    grid.className = "calendario-grid";
    mes.dias.forEach((dia) => {
        const diaEl = document.createElement("button");
        diaEl.className = "calendario-dia";
        diaEl.type = "button";
        diaEl.textContent = dia.label;
        dia.classes.forEach((cls) => diaEl.classList.add(cls));
        if (!dia.clicavel) {
            diaEl.disabled = true;
        }
        if (dia.tooltip) {
            diaEl.title = dia.tooltip;
        }
        if (dia.numero !== null) {
            diaEl.dataset.diaNumero = dia.numero;
        }
        if (dia.dataISO) {
            diaEl.dataset.dataIso = dia.dataISO;
        }
        if (dia.clicavel && typeof viewModel.onSelecionarDia === "function") {
            diaEl.addEventListener("click", () => {
                viewModel.onSelecionarDia(dia.numero);
            });
        }
        else if (dia.numero && dia.classes?.includes("dia-bloqueado")) {
            // 🔒 Prevenir qualquer clique em dias bloqueados
            diaEl.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`🔒 Clique bloqueado no dia ${dia.numero} (pulado no reajuste)`);
            });
        }
        grid.appendChild(diaEl);
    });
    wrapper.appendChild(grid);
    container.appendChild(wrapper);
    // Retornar API simples para controle externo (highlightDay)
    return {
        highlightDay: (diaNumero) => {
            // 1. Remover destaque anterior
            document.querySelectorAll(".calendario-dia.ativo").forEach((el) => {
                el.classList.remove("ativo");
            });
            // 2. Adicionar novo destaque
            const diaEl = document.querySelector(`.calendario-dia[data-dia-numero="${diaNumero}"]`);
            if (diaEl) {
                diaEl.classList.add("ativo");
            }
        },
    };
}
