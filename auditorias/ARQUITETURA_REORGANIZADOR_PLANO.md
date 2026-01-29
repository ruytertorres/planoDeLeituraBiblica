# ARQUITETURA DE SOLUÇÃO — REORGANIZADOR DE PLANO

Data: 27/01/2026
Status: EM DESIGN ARQUITETURAL
Prioridade: 1A (Bloqueador para outras features)

---

## 📐 VISÃO GERAL

O problema de **lacuna de atraso** requer:

1. **Detecção**: Quando surgem 3+ dias sem leitura
2. **Reajuste**: Mapeamento automático de dias para fechar lacuna
3. **Reset Dinâmico**: Opção de reset com data customizável
4. **Ultrapassagem de Ciclo**: Tratamento elegante quando plano ultrapassa 31/12

---

## 🏗️ ARQUITETURA PROPOSTA

### Nível 1: TEMPO (geradorDatas.js) ✅ Existente

```
Responsabilidade:
- Fornecer dia atual
- Fornecer ano atual
- Calcular dias totais do ano
- Identificar bissextos
```

**Não muda.** Mantém soberania temporal.

---

### Nível 2: DOMÍNIO — NOVO MÓDULO (ReorganizadorPlano.js)

**Localização proposta:**

```
js/core/services/planos/ReorganizadorPlano.js
```

**Responsabilidades:**

```javascript
export class ReorganizadorPlano {
  /**
   * Detecta lacuna entre dois índices de dia
   * @param {number} ultimoDiaLido (ex: 22)
   * @param {number} diaAtual (ex: 27)
   * @param {number} diasTotais (ex: 365)
   * @returns {object} { temLacuna, diasGapCount, percentualAtraso }
   */
  detectarLacuna(ultimoDiaLido, diaAtual, diasTotais) {
    const gap = diaAtual - ultimoDiaLido;
    return {
      temLacuna: gap >= 3,
      diasGapCount: gap,
      percentualAtraso: (gap / diasTotais) * 100,
    };
  }

  /**
   * Mapeia novo índice fechando lacuna
   * Se ultimoDiaLido = 22 e retomou em diaAtual = 27
   * Novo índice = 23 (próximo após parada)
   */
  calcularNovoIndice(ultimoDiaLido, diaAtual) {
    // Para de: dia 22
    // Retoma: dia 27 (diferença = 5 dias)
    // Novo índice: 23 (23 = 22 + 1)
    return ultimoDiaLido + 1;
  }

  /**
   * Detecta se reajuste vai ultrapassar 31/12
   * Retorna avisos ao usuário
   */
  verificarUltrapassagemCiclo(novoIndice, totalDias) {
    const diasRestantes = totalDias - novoIndice;
    return {
      ultrapassaCiclo: diasRestantes <= 0,
      diasRestantes: Math.max(0, diasRestantes),
      aviso: diasRestantes <= 0 ? "Plano ultrapassará o ciclo anual" : null,
    };
  }
}
```

**Características:**

- ✅ Sem dependência de UI
- ✅ Sem dependência de localStorage
- ✅ Pura lógica de domínio
- ✅ 100% testável
- ✅ Segue CONTRATO: "Sistema detecta"

---

### Nível 3: ORQUESTRAÇÃO — EXTENSÃO (MainOrquestrador)

**Extensão necessária em MainOrquestrador.js:**

```javascript
export class MainOrquestrador {
  constructor(/*...*/) {
    // ...existente...
    this.reorganizador = new ReorganizadorPlano();
  }

  /**
   * NOVO MÉTODO: Fluxo de detecção e reajuste
   * Chamado pelo sistema quando usuário retoma leitura
   */
  verificarAndDispararReajuste() {
    const ultimoDiaLido = this.progresso.getUltimoDiaLido();
    const diaAtualDoPlano = this.planoManager.getIndiceAtual();

    const lacuna = this.reorganizador.detectarLacuna(
      ultimoDiaLido,
      diaAtualDoPlano,
      this.planoManager.getTotalDias(),
    );

    if (lacuna.temLacuna) {
      // ✅ Sistema DETECTOU (conforme CONTRATO)
      this.emitirEvento("lacuna-detectada", lacuna);
      // UI vai oferecer opção ao usuário (usuário DECIDE)
      return lacuna;
    }
    return null;
  }

  /**
   * Aplica reajuste após usuário confirmar
   */
  aplicarReajuste() {
    const ultimoDiaLido = this.progresso.getUltimoDiaLido();
    const novoIndice = this.reorganizador.calcularNovoIndice(
      ultimoDiaLido,
      this.planoManager.getIndiceAtual(),
    );

    // Verificar ultrapassagem
    const ultrapassagem = this.reorganizador.verificarUltrapassagemCiclo(
      novoIndice,
      this.planoManager.getTotalDias(),
    );

    if (ultrapassagem.ultrapassaCiclo) {
      // 📢 Notificação ao usuário (não requer ação)
      this.emitirEvento("plano-ultrapassara-ciclo", ultrapassagem);
    }

    // Aplicar novo índice
    this.planoManager.irParaDia(novoIndice + 1); // +1 pois dias são numerados 1-365
    return { sucesso: true, novoIndice };
  }
}
```

---

### Nível 4: UI — MODAIS E BOTÕES

#### Modal 1: Reajuste de Plano (NOVO)

**Localização proposta:**

```
js/ui/componentes/modais/ReajusteModalUI.js
```

```javascript
export class ReajusteModalUI {
  constructor(orquestrador) {
    this.orq = orquestrador;
    this.modal = null;
  }

  criarModal(dadosLacuna) {
    const modalHTML = `
      <div id="reajuste-modal-overlay" class="modal-overlay">
        <div class="modal">
          <h3>⏸️ Você teve um atraso</h3>
          <p>${dadosLacuna.diasGapCount} dias sem leitura</p>
          <p>Deseja reajustar o plano para continuar de hoje?</p>
          
          <div class="modal-actions">
            <button id="reajuste-nao" class="btn-secondary">Não</button>
            <button id="reajuste-sim" class="btn-primary">Sim</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
    this.modal = document.getElementById("reajuste-modal-overlay");

    // Eventos
    document.getElementById("reajuste-sim").addEventListener("click", () => {
      this.orq.aplicarReajuste();
      this.fechar();
    });

    document.getElementById("reajuste-nao").addEventListener("click", () => {
      this.manterBotaoAtivo();
      this.fechar();
    });
  }

  manterBotaoAtivo() {
    // Botão fica esperando próxima ação do usuário
    console.log("⏳ Reajuste aguardando ação do usuário");
  }

  fechar() {
    this.modal?.remove();
  }
}
```

---

#### Modal 2: Reset Configurável (ATUALIZAÇÃO)

**Atualização em ResetProgresso.js:**

```javascript
criarModalDinamico() {
  // ... código existente ...

  // NOVA SEÇÃO: Opções de Reset
  modalOverlay.innerHTML = `
    <div class="reset-modal">
      <h3>⚠️ Resetar Progresso</h3>
      <p>Escolha como deseja resetar:</p>

      <div class="reset-options">
        <label class="reset-option">
          <input type="radio" name="reset-type" value="padrão" checked>
          <strong>Opção 1 (Padrão):</strong>
          Dia 01 do plano → 01/01
        </label>

        <label class="reset-option">
          <input type="radio" name="reset-type" value="custom">
          <strong>Opção 2 (Customizado):</strong>
          Dia 01 do plano → Hoje
          <span class="warning">⚠️ Plano pode ultrapassar 31/12</span>
        </label>
      </div>

      <div class="reset-modal-actions">
        <button id="reset-cancel-btn" class="reset-modal-btn cancel">
          Cancelar
        </button>
        <button id="reset-confirm-btn" class="reset-modal-btn confirm">
          Confirmar Reset
        </button>
      </div>
    </div>
  `;
}

aplicarReset() {
  const resetType = document.querySelector(
    'input[name="reset-type"]:checked'
  )?.value;

  if (resetType === "custom") {
    // Chama método novo do PlanoManager
    this.planoManager.resetarComDataCustomizada(dataHoje);
  } else {
    // Reset padrão (existente)
    this.progresso.resetarCompletamente();
    this.planoManager.resetar();
  }
}
```

---

## 📊 FLUXO DE DADOS

### Cenário 1: Detecção + Reajuste SIM

```
🕐 Retorna ao app após 3+ dias
    ↓
main.js detecta mudança de data
    ↓
MainOrquestrador.verificarAndDispararReajuste()
    ↓
ReorganizadorPlano.detectarLacuna()
    ↓
✅ temLacuna = true
    ↓
emit("lacuna-detectada", dados)
    ↓
ReajusteModalUI.criarModal(dados)
    ↓
Usuário clica SIM
    ↓
MainOrquestrador.aplicarReajuste()
    ↓
ReorganizadorPlano.calcularNovoIndice()
    ↓
PlanoManager.irParaDia(novoIndice)
    ↓
render_calendario atualiza
    ↓
✅ DONE
```

### Cenário 2: Detecção + Reajuste NÃO

```
🕐 Retorna ao app após 3+ dias
    ↓
[Modal surge]
    ↓
Usuário clica NÃO
    ↓
Modal fecha, botão fica ativo
    ↓
⏳ Aguardando próxima ação
```

### Cenário 3: Ultrapassagem de Ciclo

```
Reajuste aplicado (dia 340 + 50 dias restantes)
    ↓
ReorganizadorPlano.verificarUltrapassagemCiclo()
    ↓
✅ ultrapassaCiclo = true
    ↓
emit("plano-ultrapassara-ciclo", aviso)
    ↓
UI exibe notificação: "Plano continuará no próximo ciclo"
    ↓
PlanoManager continua normalmente
    ↓
Quando chegar em dia 365 → UI rota para próximo ciclo
    ↓
✅ DONE
```

---

## 🔧 ALTERAÇÕES EM ARQUIVOS EXISTENTES

### 1. **PlanoManager.js** (Pequenas extensões)

```javascript
// Novo método
resetarComDataCustomizada(dataCustomizada) {
  // Será usado pelo ResetProgresso
  // Mapeia data customizada para índice do plano
  // Ex: Se dataCustomizada = hoje, dia 01 = hoje
}
```

### 2. **ProgressoLeitura.js** (Uma linha)

```javascript
// Novo getter
getUltimoDiaLido() {
  // Retorna o número do maior dia na Set diasLidos
  return Math.max(...Array.from(this.diasLidos));
}
```

### 3. **MainOrquestrador.js** (Extensão)

```javascript
// Adicionar ReorganizadorPlano
// Adicionar métodos: verificarAndDispararReajuste(), aplicarReajuste()
// Adicionar eventos: "lacuna-detectada", "plano-ultrapassara-ciclo"
```

### 4. **ResetProgresso.js** (Atualização do modal)

```javascript
// Adicionar opção 2 ao modal
// Implementar resetarComDataCustomizada()
```

### 5. **main.js** (Orchestração principal)

```javascript
// Novo hook ao carregar app
if (mainOrquestrador) {
  mainOrquestrador.verificarAndDispararReajuste();
}
```

---

## 🧪 TESTES NECESSÁRIOS

**Unitários (ReorganizadorPlano.js):**

- ✅ detectarLacuna com 0-2 dias (false)
- ✅ detectarLacuna com 3+ dias (true)
- ✅ calcularNovoIndice(22, 27) = 23
- ✅ verificarUltrapassagemCiclo com dias restantes < 0
- ✅ verificarUltrapassagemCiclo com dias restantes > 0

**Integração:**

- ✅ Reajuste fecha lacuna corretamente
- ✅ Ultrapassagem dispara notificação
- ✅ Reset customizado mapeia data corretamente
- ✅ Calendário atualiza após reajuste

---

## 📝 CONFORMANCE COM CONTRATO

✅ **Tempo é soberano**

- geradorDatas.js usado para calcular dias
- Sem new Date() fora do gerador

✅ **Sistema detecta, usuário decide**

- ReorganizadorPlano detecta lacuna (sistema)
- Modal oferece opção (usuário decide)
- Reset customizado é escolha explícita

✅ **Decisões rastreáveis**

- Cada ação registra evento
- Modal documenta intenção do usuário

✅ **Ciclos finitos, planos contínuos**

- Plano não para em 31/12
- Continua no ciclo seguinte automaticamente

---

## 🚀 PRÓXIMAS ETAPAS

1. **Implementar ReorganizadorPlano.js** (novo módulo)
2. **Atualizar MainOrquestrador.js** (extensão)
3. **Criar ReajusteModalUI.js** (novo modal)
4. **Atualizar ResetProgresso.js** (modal reset opções)
5. **Atualizar ProgressoLeitura.js** (getter ultmoDiaLido)
6. **Atualizar PlanoManager.js** (reset customizado)
7. **Atualizar main.js** (hook de verificação)
8. **Testes completos** (unitários + integração)
