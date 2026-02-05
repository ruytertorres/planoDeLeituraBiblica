# Plano de Migração Definitiva para TypeScript

> **Versão:** 2.0.0  
> **Data:** 2025-02-03  
> **Objetivo:** Migração 100% TypeScript, zero duplicidades, código profissional  
> **Base:** CONTRATO_DO_SISTEMA.MD

---

## 1. VISÃO GERAL

### Estado Atual

- **32 arquivos TypeScript** em `src/` (código novo, não utilizado)
- **28 arquivos JavaScript** em `js/` (código legado, EM USO)
- Entry point: `js/main-hibrido.js` (gambiarra de compatibilidade)
- Sistema funciona 100% em JavaScript legado

### Estado Alvo

- **Apenas `src/`** - código TypeScript único
- **Zero arquivos em `js/`** - pasta eliminada
- Entry point: `src/main.ts` compilado
- Sistema 100% TypeScript, profissional, limpo

### Métricas de Sucesso

| Métrica            | Atual | Alvo |
| ------------------ | ----- | ---- |
| Arquivos de código | 60    | ~35  |
| Type Coverage      | 30%   | 100% |
| Duplicidade        | Alta  | Zero |
| Violções Contrato  | 2+    | 0    |

---

## 2. FASES DA MIGRAÇÃO

### FASE 1: Fundação Temporal (Dia 1)

**Objetivo:** Garantir conformidade com §3.1 e §3.2 do Contrato

#### 1.1 Verificar e Corrigir Violações de Tempo

```bash
# Buscar new Date() fora de geradorDatas.ts
grep -r "new Date()" src/ --include="*.ts" | grep -v geradorDatas.ts
```

**Arquivos para verificar:**

- [ ] `src/ui/components/Footer/FooterComponent.ts`
- [ ] `src/ui/components/Calendario/CalendarioViewModel.ts`
- [ ] Outros componentes UI

**Correção:** Usar funções de `geradorDatas.ts`:

```typescript
// ❌ Errado
new Date().toLocaleDateString("pt-BR");

// ✅ Correto
import { getDataAtualFormatada } from "../../../core/services/tempo/geradorDatas.js";
getDataAtualFormatada("pt-BR");
```

#### 1.2 Eliminar Arquivos JS Duplicados (Imediato)

Estes arquivos JS têm equivalentes TS funcionais:

| Arquivo JS                                | Arquivo TS                                 | Ação        |
| ----------------------------------------- | ------------------------------------------ | ----------- |
| `js/core/services/tempo/geradorDatas.js`  | `src/core/services/tempo/geradorDatas.ts`  | ❌ Eliminar |
| `js/core/services/planos/PlanoManager.js` | `src/core/services/planos/PlanoManager.ts` | ❌ Eliminar |
| `js/core/models/parametroDia.js`          | `src/core/models/Dia.ts`                   | ❌ Eliminar |

**Comandos:**

```bash
rm js/core/services/tempo/geradorDatas.js
rm js/core/services/planos/PlanoManager.js
rm js/core/models/parametroDia.js
```

#### 1.3 Limpar CSS Legado

| Arquivo              | Status         | Ação        |
| -------------------- | -------------- | ----------- |
| `css/cards.css`      | Tailwind cobre | ❌ Eliminar |
| `css/responsive.css` | Tailwind cobre | ❌ Eliminar |
| `css/footer.css`     | Tailwind cobre | ❌ Eliminar |

---

### FASE 2: Migração de Serviços Críticos (Dias 2-4)

**Objetivo:** Migrar serviços essenciais que só existem em JS

#### 2.1 BaseOrquestrador (Dia 2)

**Origem:** `js/ui/orquestradores/BaseOrquestrador.js`
**Destino:** `src/ui/orquestradores/BaseOrquestrador.ts`

**Passos:**

1. [ ] Criar `BaseOrquestrador.ts` com mesma interface
2. [ ] Adicionar tipagem forte para:
   - `listeners: Map<string, Array<{handler, controller, target}>>`
   - `state: Record<string, unknown>`
   - `plugins: Plugin[]`
3. [ ] Métodos a implementar:
   - `on(target, event, handler, options)`
   - `off(target, event?)`
   - `emit(eventName, detail)`
   - `destroy()`

**Template:**

```typescript
export abstract class BaseOrquestrador {
  protected readonly name: string;
  protected listeners = new Map<
    string,
    Array<{
      handler: EventListener;
      controller: AbortController;
      target: EventTarget;
    }>
  >();
  protected state: Record<string, unknown> = {};
  protected plugins: Plugin[] = [];

  constructor(name: string) {
    this.name = name;
  }

  abstract init(): Promise<void> | void;
  abstract destroy(): void;
}
```

#### 2.2 ProgressoLeitura (Dia 2-3)

**Origem:** `js/core/services/planos/ProgressoLeitura.js`
**Destino:** `src/core/services/planos/ProgressoLeitura.ts`

**Interface a implementar:**

```typescript
export interface ProgressoLeituraInterface {
  marcarLido(diaNumero: number): void;
  marcarNaoLido(diaNumero: number): void;
  estaLido(diaNumero: number): boolean;
  getTotalLidos(): number;
  getDataInicio(): string | null;
  reset(): void;
}
```

**Dependências:**

- LocalStorage para persistência
- Eventos para notificar UI

#### 2.3 NotasLeituraManager (Dia 3)

**Origem:** `js/core/services/notas/NotasLeituraManager.js`
**Destino:** `src/core/services/notas/NotasLeituraManager.ts`

**Funcionalidades:**

- CRUD de notas por dia
- Persistência local/indexedDB
- Exportação

#### 2.4 SearchEngine (Dia 4)

**Origem:** `js/core/services/busca/SearchEngine.js`
**Destino:** `src/core/services/busca/SearchEngine.ts`

**Funcionalidades:**

- Busca textual em referências bíblicas
- Busca em notas
- Fuzzy search

---

### FASE 3: Unificação MainOrquestrador (Dias 5-7)

**Objetivo:** Consolidar versão JS e TS em uma única implementação TypeScript

#### 3.1 Análise de Gap (Dia 5)

Comparar funcionalidades:

| Funcionalidade    | JS (848 linhas) | TS (278 linhas) | Status    |
| ----------------- | --------------- | --------------- | --------- |
| Inicialização     | ✅              | ✅              | OK        |
| Plugins           | ✅              | ✅              | OK        |
| Event delegation  | ✅              | ⚠️              | Verificar |
| Reset modal       | ✅              | ❌              | Migrar    |
| Reajuste de plano | ✅              | ❌              | Migrar    |
| Notas overlay     | ✅              | ❌              | Migrar    |
| Calendário API    | ✅              | ❌              | Migrar    |
| Busca UI          | ✅              | ❌              | Migrar    |

#### 3.2 Migrar Funcionalidades Faltantes (Dia 6)

Transferir do JS para TS:

**De `js/ui/orquestradores/MainOrquestrador.js`:**

- [ ] `initSubsystems()` - Inicializar subsistemas
- [ ] `setupEventDelegation()` - Event delegation estável
- [ ] `initPlugins()` - Sistema de plugins completo
- [ ] `renderInitial()` - Renderização inicial
- [ ] `destroy()` - Cleanup completo

**De `js/core/services/`:**

- [ ] Integração com `ResetProgressoOrquestrador`
- [ ] Integração com `ReorganizadorPlano`
- [ ] Integração com `NotasOverlayOrquestrador`

#### 3.3 Testar Unificado (Dia 7)

**Critérios:**

- [ ] Sistema inicializa sem erros
- [ ] Navegação entre dias funciona
- [ ] Marcar leitura funciona
- [ ] Notas funcionam
- [ ] Busca funciona
- [ ] Calendário funciona
- [ ] Reset funciona

---

### FASE 4: Migração de Plugins (Dia 8)

**Origens:**

- `js/ui/plugins/CertificadoPlugin.js`
- `js/ui/plugins/ExportacaoPlugin.js`

**Destinos:**

- `src/ui/plugins/CertificadoPlugin.ts`
- `src/ui/plugins/ExportacaoPlugin.ts`

**Interface Plugin:**

```typescript
export interface Plugin {
  readonly nome: string;
  readonly versao: string;
  init(mainOrquestrador: MainOrquestrador): void | Promise<void>;
  destroy(): void;
}
```

---

### FASE 5: Migração UI Components (Dias 9-11)

**Objetivo:** Migrar componentes de UI de JS para TS

#### 5.1 Componentes Notas (Dia 9)

**Origens:**

- `js/ui/componentes/notas/NotasOverlayUI.js`
- `js/ui/componentes/notas/NotasToolbarUI.js`
- `js/ui/componentes/notas/NotasEstruturadorUI.js`
- `js/ui/componentes/notas/NotasFormatadorUI.js`
- `js/ui/componentes/notas/NotasEnterHandler.js`

**Destinos:**

- `src/ui/components/Notas/NotasOverlayUI.ts`
- `src/ui/components/Notas/NotasToolbarUI.ts`
- `src/ui/components/Notas/NotasEstruturadorUI.ts`
- `src/ui/components/Notas/NotasFormatadorUI.ts`
- `src/ui/components/Notas/NotasEnterHandler.ts`

#### 5.2 Modais (Dia 10)

**Origens:**

- `js/ui/componentes/ResetModal.js`
- `js/ui/componentes/modais/ReajusteModalUI.js`

**Destinos:**

- `src/ui/components/Modais/ResetModal.ts`
- `src/ui/components/Modais/ReajusteModalUI.ts`

#### 5.3 Outros Componentes (Dia 11)

- [ ] `js/ui/componentes/notas/notas_toolbar.js` → Tailwind/CSS inline

---

### FASE 6: Transição Entry Point (Dia 12)

**Objetivo:** Mudar o ponto de entrada de JS para TS

#### 6.1 Atualizar index.html

**De:**

```html
<script type="module" src="js/main-hibrido.js"></script>
```

**Para:**

```html
<script type="module" src="dist/main.js"></script>
```

#### 6.2 Configurar Build

Verificar `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      input: {
        main: "./src/main.ts",
      },
    },
  },
});
```

#### 6.3 Testar Build

```bash
npm run build
npm run preview
```

---

### FASE 7: Limpeza Final (Dia 13)

#### 7.1 Eliminar Pasta js/

```bash
rm -rf js/
```

#### 7.2 Eliminar Arquivos de Teste

```bash
rm js/teste-lazy-loading.js
rm src/core/services/planos/testeLazyLoading.ts
```

#### 7.3 Eliminar CSS Obsoleto

```bash
rm css/cards.css
rm css/responsive.css
```

#### 7.4 Limpar dist-vite/

```bash
rm -rf dist-vite/
git rm -r --cached dist-vite/
```

---

### FASE 8: Validação Final (Dia 14)

#### 8.1 Verificar Conformidade com Contrato

| Seção | Verificação                    | Status |
| ----- | ------------------------------ | ------ |
| §3.1  | Tempo é soberano               | [ ]    |
| §3.2  | Sem new Date() fora do gerador | [ ]    |
| §4    | Hierarquia de autoridade       | [ ]    |
| §6    | Princípio do Cartucho          | [ ]    |
| §10   | UI é reflexo                   | [ ]    |

#### 8.2 Verificar Duplicidades

```bash
# Não deve haver arquivos .js em js/
find js -name "*.js" 2>/dev/null | wc -l  # Deve retornar 0

# Apenas src/ deve existir
ls -la src/ | grep -c ".ts$"  # Deve retornar ~35
```

#### 8.3 Testes Finais

- [ ] Build sem erros
- [ ] Runtime sem erros
- [ ] Todas funcionalidades operacionais
- [ ] Performance aceitável

---

## 3. ESTRUTURA FINAL ESPERADA

```
planoDeLeituraBiblica/
├── src/                          # Única fonte de verdade
│   ├── cartuchos/
│   │   └── plano_cronologico.ts
│   ├── compatibilidade/
│   │   └── ui-adapter.ts
│   ├── core/
│   │   ├── models/
│   │   │   └── Dia.ts
│   │   ├── services/
│   │   │   ├── busca/
│   │   │   │   └── SearchEngine.ts
│   │   │   ├── notas/
│   │   │   │   └── NotasLeituraManager.ts
│   │   │   ├── planos/
│   │   │   │   ├── PlanoManager.ts
│   │   │   │   ├── ProgressoLeitura.ts
│   │   │   │   ├── carregadorDias.ts
│   │   │   │   └── materializarDia.ts
│   │   │   └── tempo/
│   │   │       └── geradorDatas.ts
│   │   └── types/
│   │       └── contratos.types.ts
│   ├── ui/
│   │   ├── components/
│   │   │   ├── Busca/
│   │   │   ├── Calendario/
│   │   │   ├── DarkMode/
│   │   │   ├── DiaCard/
│   │   │   ├── Footer/
│   │   │   ├── Modais/
│   │   │   └── Notas/
│   │   ├── orquestradores/
│   │   │   ├── BaseOrquestrador.ts
│   │   │   └── MainOrquestrador.ts
│   │   └── plugins/
│   │       ├── CertificadoPlugin.ts
│   │       └── ExportacaoPlugin.ts
│   ├── main.ts
│   └── index.ts
├── css/                          # Apenas CSS necessário
│   ├── calendar.css              # Grid dinâmico
│   ├── darkmode.css              # Variáveis tema
│   ├── global.css                # Reset básico
│   ├── notas.css                 # Estilos notas
│   └── search_styles.css         # Resultados busca
├── dist/                         # Build output (gitignored)
├── docs/
│   └── CONTRATO_DO_SISTEMA.MD
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 4. CHECKLIST DE PROGRESSO

### FASE 1: Fundação Temporal

- [x] **1.1** Verificar violações de `new Date()`
- [x] **1.2** Corrigir `FooterComponent.ts`
- [x] **1.3** Corrigir `CalendarioViewModel.ts`
- [x] **1.4** Eliminar `js/core/services/tempo/geradorDatas.js`
- [x] **1.5** Eliminar `js/core/services/planos/PlanoManager.js`
- [x] **1.6** Eliminar `js/core/models/parametroDia.js`
- [x] **1.7** Eliminar `css/cards.css`
- [x] **1.8** Eliminar `css/responsive.css`

**Progresso Fase 1:** 8/8 ✅

### FASE 2: Serviços Críticos

- [x] **2.1** Criar `BaseOrquestrador.ts`
- [x] **2.2** Migrar `ProgressoLeitura.js` → TS
- [x] **2.3** Migrar `NotasLeituraManager.js` → TS
- [x] **2.4** Migrar `SearchEngine.js` → TS
- [x] **2.5** Testar serviços individualmente

**Progresso Fase 2:** 5/5 ✅

### FASE 3: MainOrquestrador Unificado

- [x] **3.1** Analisar gap funcionalidades JS vs TS
- [x] **3.2** Migrar `ResetProgressoOrquestrador`
- [x] **3.3** Migrar `ReorganizadorPlano`
- [x] **3.4** Migrar `NotasOverlayOrquestrador`
- [x] **3.5** Atualizar `MainOrquestrador.ts` com funcionalidades
- [ ] **3.6** Testar sistema unificado

**Progresso Fase 3:** 5/6

### FASE 4: Plugins

- [x] **4.1** Migrar `CertificadoPlugin.js` → TS
- [x] **4.2** Migrar `ExportacaoPlugin.js` → TS
- [x] **4.3** Testar plugins

**Progresso Fase 4:** 3/3

### FASE 5: UI Components

- [x] **5.1** Migrar componentes Notas (5 arquivos)
- [x] **5.2** Migrar Modais (2 arquivos)
- [x] **5.3** Limpar CSS componentes

**Progresso Fase 5:** 3/3

### FASE 6: Transição Entry Point

- [x] **6.1** Atualizar `index.html` para `dist/main.js`
- [x] **6.2** Configurar `vite.config.ts`
- [x] **6.3** Testar build de produção
- [x] **6.4** Testar preview

**Progresso Fase 6:** 4/4

### FASE 7: Limpeza Final

- [x] **7.1** Eliminar pasta `js/`
- [x] **7.2** Eliminar arquivos de teste
- [x] **7.3** Eliminar CSS obsoleto
- [x] **7.4** Limpar `dist-vite/`
- [x] **7.5** Commit final

**Progresso Fase 7:** 5/5

### FASE 8: Validação

- [x] **8.1** Verificar §3.1 (Tempo é soberano)
- [x] **8.2** Verificar §3.2 (Sem new Date fora do gerador)
- [x] **8.3** Verificar §4 (Hierarquia)
- [x] **8.4** Verificar §6 (Princípio do Cartucho)
- [x] **8.5** Verificar zero duplicidades
- [x] **8.6** Teste completo funcional
- [x] **8.7** Build de produção limpo

**Progresso Fase 8:** 7/7

---

## 5. PROGRESSO TOTAL

```
[░░░░░░░░░░░░░░░░░░] 0%

Fase 1: [░░░░░░░░] 0/8
Fase 2: [░░░░░░░░] 0/5
Fase 3: [░░░░░░░░] 0/6
Fase 4: [████████] 3/3
Fase 5: [░░░░░░░░] 0/3
Fase 6: [░░░░░░░░] 0/4
Fase 7: [░░░░░░░░] 0/5
Fase 8: [░░░░░░░░] 0/7
```

**Total:** \_\_\_/41 itens concluídos

---

## 6. NOTAS IMPORTANTES

### Sobre o Contrato

- Toda alteração deve respeitar `CONTRATO_DO_SISTEMA.MD`
- Seção §3.2 é **intransigente**: nenhum `new Date()` fora de `geradorDatas.ts`
- Seção §10: UI é reflexo, não contém regra de negócio

### Sobre Duplicidade

- **NUNCA** manter JS e TS da mesma funcionalidade
- Migrar completamente ou manter em JS (temporariamente)
- Não criar versões paralelas

### Sobre Commits

- Commit após cada fase concluída
- Mensagens descritivas: "fase X: descrição"
- Push frequente para backup

---

## 7. RECURSOS ÚTEIS

### Comandos Frequentes

```bash
# Build
npm run build

# Preview
npm run preview

# Dev
npm run dev

# Buscar duplicidades
grep -r "class.*Orquestrador" src/ js/

# Verificar new Date()
grep -r "new Date()" src/ --include="*.ts"
```

### Arquivos de Referência

- `CONTRATO_DO_SISTEMA.MD` - Regras do sistema
- `RELATORIO_VALIDACAO_FINAL.md` - Estado atual
- `AVALIACAO_CONTRATO_MIGRACAO_TS.md` - Análise detalhada

---

**Início:** **_/_**/**\_  
**Previsão Término:** \_**/**_/_** (14 dias)  
**Responsável:** **\*\*\*\***\_**\*\*\*\***
