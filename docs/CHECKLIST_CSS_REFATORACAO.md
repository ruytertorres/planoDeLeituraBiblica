# 🎨 Checklist de Refatoração CSS/Tailwind - OPÇÃO 1 (Conservadora)

> **Abordagem:** Migração gradual componente por componente  
> **Objetivo:** Manter 100% compatibilidade durante transição  
> **Data:** 2025-02-05  
> **Estratégia:** CSS legado funciona → migra componente → testa → remove antigo

---

## 📊 PROGRESSO GERAL

```
[████████░░░░░░░░░░] 20% - Fase 1 Completa

✅ Fase 1: Configuração (100%)
⬜ Fase 2: Dark Mode (0%)
⬜ Fase 3: Core Components (0%)
⬜ Fase 4: Calendário (0%)
⬜ Fase 5: Notas (0%)
⬜ Fase 6: Modais (0%)
⬜ Fase 7: Limpeza (0%)
⬜ Fase 8: Testes (0%)
```

---

## ✅ FASE 1: CONFIGURAÇÃO TAILWIND (COMPLETA ✅)

### 1.1 Reconfigurar `tailwind.config.js` ✅

- [x] Corrigir `content`: `["./index.html", "./src/**/*.{ts,js}"]`
- [x] Configurar `darkMode: 'class'`
- [x] Estender tema com cores (primary, bible)
- [x] Adicionar animações (fade-in, slide-up)

### 1.2 Criar `src/styles.css` ✅

- [x] `@tailwind base` + reset customizado
- [x] `@tailwind components` + componentes base
- [x] `@tailwind utilities` + utilitários
- [x] `@layer` estruturado (base, components, utilities)

### 1.3 Atualizar `index.html` ✅

- [x] Substituir `tailwind.css` por `styles.css`
- [x] Manter CSS legado temporariamente
- [x] Adicionar comentários de migração

**Status:** ✅ **COMPLETA** - Build testado e funcionando

---

## 🟡 FASE 2: DARK MODE (EM ANDAMENTO)

### 2.1 Análise do `darkmode.css` ✅ COMPLETA

- [x] Mapear todas as classes em `darkmode.css` (462 linhas analisadas)
- [x] Identificar regras únicas vs redundantes
- [x] Documentar cores específicas

**📊 Resultado da Análise:**
| Seção | Linhas | Classes | Prioridade |
|-------|--------|---------|------------|
| Variáveis CSS | 7-40 | 40 cores custom | Alta |
| Calendário | 48-265 | 25+ classes | Alta |
| Cards/Dia | 267-349 | 12 classes | Média |
| Navbar | 292-313 | 4 classes | Média |
| Botões | 351-387 | 6 classes | Média |

**🎨 Cores Únicas (Preservar):**

```
--dm-dia-lido: #d0681d (Laranja/Marrom)
--dm-bg-primary: #121212 (Fundo)
--dm-bg-card: #252525 (Cards)
--dm-accent: #4dabf7 (Azul destaque)
--dm-success: #51cf66 (Verde)
```

**⚠️ Problemas Encontrados:**

- 100+ uso de `!important` (remover gradualmente)
- Seletores `body.dark-mode .class` (simplificar)
- Overrides globais linhas 427-452 (refatorar)

### 2.2 Adicionar cores ao Tailwind ✅ COMPLETA

- [x] Criar paleta `dm:` no `tailwind.config.js`
- [x] Mapear todas as cores do `darkmode.css`
- [x] Preservar cor especial `--dm-dia-lido` → `bg-dm-dia-lido`
- [x] Cores disponíveis: `bg-dm-bg-primary`, `text-dm-text-primary`, `border-dm-border`, etc.

**🎨 Cores Tailwind Disponíveis:**

```
bg-dm-bg-primary     → #121212 (fundo escuro)
bg-dm-bg-card        → #252525 (cards)
bg-dm-bg-secondary   → #1e1e1e (secundário)
text-dm-text-primary → #e0e0e0 (texto principal)
border-dm-border     → #3a3a3a (bordas)
bg-dm-dia-lido       → #d0681d (laranja único!)
```

### 2.3 Atualizar HTML

- [ ] Remover `class="light-mode"` do `<html>`
- [ ] Adicionar script toggle com `localStorage`
- [ ] Verificar todas classes `dark:` existentes

### 2.4 Remover arquivo

- [ ] Deletar `css/darkmode.css`
- [ ] Atualizar `index.html` (remover link)
- [ ] Testar build

**Status:** ⬜ **PRÓXIMA FASE** - Prioridade alta

---

## ⬜ FASE 3: COMPONENTES CORE

### 3.1 Analisar `global.css`

- [ ] Reset básico (manter, já está no `styles.css`)
- [ ] Variáveis `:root` (migrar para `tailwind.config.js`)
- [ ] Classes `.btn` (migrar para `@layer components`)

### 3.2 Criar componentes base em `styles.css`

- [ ] `.btn-primary` / `.btn-secondary` / `.btn-danger`
- [ ] `.card` / `.card-hover`
- [ ] `.input` / `.badge-*`

### 3.3 Atualizar HTML gradualmente

- [ ] Substituir `class="btn"` por `class="btn-primary"`
- [ ] Cards: `class="card card-hover"`
- [ ] Inputs: `class="input"`

### 3.4 Reduzir `global.css`

- [ ] Manter apenas reset essencial
- [ ] Remover variáveis duplicadas
- [ ] Deletar se ficar vazio

**Status:** ⬜ **PENDENTE**

---

## ⬜ FASE 4: CALENDÁRIO

### 4.1 Analisar `calendar.css` (472 linhas)

- [ ] Mapear `.calendar-section`, `.calendar-wrapper`
- [ ] Identificar `.calendar-header`, `.calendar-title`
- [ ] Listar classes de dias (`.calendar-day-*`)

### 4.2 Migrar para `@layer components`

- [ ] Criar `.calendar-container`
- [ ] Migrar grid de dias
- [ ] Preservar estados (lido, ativo, hover)

### 4.3 Atualizar `CalendarioComponent.ts`

- [ ] Verificar classes geradas dinamicamente
- [ ] Ajustar para novas classes Tailwind
- [ ] Testar renderização

### 4.4 Remover arquivo

- [ ] Deletar `css/calendar.css`
- [ ] Atualizar `index.html`

**Status:** ⬜ **PENDENTE**

---

## ⬜ FASE 5: SISTEMA DE NOTAS

### 5.1 Analisar `notas.css` (17KB!)

- [ ] Dividir em seções: toolbar, overlay, editor, histórico
- [ ] Mapear `.notas-overlay`, `.notas-toolbar`
- [ ] Identificar `.notas-editor`, `.notas-historico`

### 5.2 Migrar componente por componente

- [ ] Toolbar: `.notes-toolbar` em `@layer components`
- [ ] Overlay: `.notes-overlay` (já existe em `styles.css`)
- [ ] Editor: riqueza de texto (manter CSS específico se necessário)
- [ ] Histórico: lista de notas

### 5.3 Atualizar componentes TS

- [ ] `NotasOverlayUI.ts`
- [ ] `NotasToolbarUI.ts`
- [ ] Verificar geração dinâmica de HTML

### 5.4 Otimizar

- [ ] Reduzir `notas.css` ou eliminar
- [ ] Testar funcionalidade completa

**Status:** ⬜ **PENDENTE** - Maior arquivo, requer atenção

---

## ⬜ FASE 6: MODAIS

### 6.1 Consolidar modais

- [ ] Analisar `reajuste-modal.css`
- [ ] Analisar `reset-modal.css`
- [ ] Identificar padrões comuns

### 6.2 Criar componente modal unificado

- [ ] `.modal-overlay` (já existe)
- [ ] `.modal-content` (já existe)
- [ ] Variantes: `.modal-sm`, `.modal-lg`
- [ ] Estados: `.modal-danger`, `.modal-info`

### 6.3 Atualizar componentes

- [ ] `ReajusteModalUI.ts`
- [ ] `ResetModal.ts`

### 6.4 Remover arquivos

- [ ] Deletar `css/reajuste-modal.css`
- [ ] Deletar `css/components/reset-modal.css`

**Status:** ⬜ **PENDENTE**

---

## ⬜ FASE 7: LIMPEZA FINAL

### 7.1 Verificar CSS restantes

- [ ] `search_styles.css` - integrar ou eliminar
- [ ] `global.css` - reduzir ao mínimo

### 7.2 Atualizar `index.html`

- [ ] Manter apenas: `styles.css` + `global.css` (reduzido)
- [ ] Remover todos os outros links CSS

### 7.3 Verificar build

- [ ] `npm run build` sem warnings
- [ ] CSS gerado otimizado
- [ ] Tamanho reduzido

**Status:** ⬜ **PENDENTE**

---

## ⬜ FASE 8: TESTES FINAIS

### 8.1 Testes Visuais

- [ ] Abrir em mobile (320px)
- [ ] Abrir em tablet (768px)
- [ ] Abrir em desktop (1920px)
- [ ] Verificar todas as páginas/componentes

### 8.2 Testes Dark Mode

- [ ] Toggle funciona em todas as páginas
- [ ] Persiste após F5
- [ ] Sem "flash" de tema claro
- [ ] Cores consistentes

### 8.3 Testes Funcionais

- [ ] Calendário navega corretamente
- [ ] Notas abrem/salvam/fecham
- [ ] Modais aparecem centralizados
- [ ] Busca funciona
- [ ] Cards de dia renderizam

### 8.4 Performance

- [ ] Lighthouse CSS score > 90
- [ ] Bundle CSS < 50KB
- [ ] Sem duplicidades

**Status:** ⬜ **PENDENTE**

---

## 📊 MÉTRICAS DE SUCESSO

| Métrica            | Antes  | Alvo   | Status |
| ------------------ | ------ | ------ | ------ |
| Arquivos CSS       | 7      | 2      | ⬜     |
| Linhas CSS custom  | ~3.500 | ~300   | ⬜     |
| Bundle CSS         | Grande | < 50KB | ⬜     |
| Sistemas dark mode | 3      | 1      | ⬜     |
| Tempo build        | 2s     | < 3s   | ✅     |

---

## 🚨 REGRAS DA MIGRAÇÃO (OPÇÃO 1)

1. **Nunca quebrar** - sempre testar antes de remover
2. **Um componente por vez** - não misturar mudanças
3. **Commit por fase** - cada fase é um commit
4. **Manter legado** até novo estar 100% testado
5. **Documentar** classes migradas no código

---

## 📝 REGISTRO DE DECISÕES

| Data       | Decisão                | Motivo              |
| ---------- | ---------------------- | ------------------- |
| 2025-02-05 | Opção 1 (Conservadora) | Manter estabilidade |
|            | `darkMode: 'class'`    | Controle via JS     |
|            | Cores custom no config | Padronização        |

---

**Iniciado:** 2025-02-05  
**Status Atual:** 🟡 Fase 1 Completa, aguardando Fase 2  
**Próximo Passo:** Analisar `darkmode.css` para migração

---

## 🎯 CHECKLIST RÁPIDO - PRÓXIMA SESSÃO

Quando retornar, começar por:

- [ ] Abrir `css/darkmode.css`
- [ ] Contar quantas regras únicas existem
- [ ] Identificar cores que não existem no Tailwind
- [ ] Criar mapeamento: `.classe-antiga` → `dark:classe-nova`
