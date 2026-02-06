# 📁 Estrutura de Arquivos - Sistema Atual (TypeScript 100%)

## 🎯 **OBJETIVO**

Documentar a estrutura real do sistema após migração TypeScript 100% completa.

---

## 📂 **ESTRUTURA ATUAL DO SISTEMA**

### **🔧 Núcleo TypeScript (src/)**

```
src/
├── cartuchos/                    # 📦 Planos-Cartucho (DADOS PUROS)
│   └── plano_cronologico.ts     # 📋 Plano cronológico (sem lógica, sem imports)
├── compatibilidade/              # 🔄 Ponte de compatibilidade
│   └── ui-adapter.ts            # Adaptador de compatibilidade
├── core/                        # 💎 Núcleo do sistema
│   ├── models/                  # 🏗️ Entidades de domínio
│   │   └── Dia.ts              # 📅 Entidade Dia (tipada)
│   ├── services/                # ⚙️ Serviços de negócio
│   │   ├── tempo/               # 🕐 Autoridade temporal
│   │   │   └── geradorDatas.ts # ⏰ Gerador de datas (SOBERANO)
│   │   ├── planos/              # 📋 Serviços de planos
│   │   │   ├── PlanoManager.ts # 🎛️ Orquestrador de planos
│   │   │   ├── materializarPlanoCartucho.ts # 🔄 Materializa cartucho
│   │   │   ├── validadorPlano.ts # ✅ Validador de contratos
│   │   │   └── ValidadorPlanoTipado.ts # 🔍 Validação estrutural
│   │   ├── busca/               # 🔍 Busca textual
│   │   │   └── SearchEngine.ts  # 🔎 Motor de busca
│   │   └── notas/               # 📝 Sistema de notas
│   │       ├── NotasOverlayOrquestrador.ts # 🎭 Orquestrador de notas
│   │       ├── NotasHistoricoManager.ts   # 📚 Histórico de notas
│   │       ├── NotasLeituraManager.ts     # 📖 Gerente de notas
│   │       ├── NotasSelecaoManager.ts     # 🎯 Gerente de seleção
│   │       └── notas_toolbar.ts          # 🛠️ Barra de ferramentas
│   └── types/                   # 📝 Tipos formais
│       ├── PlanoCartucho.ts     # 📋 Contrato do plano
│       ├── DiaDoPlano.ts        # 📅 Contrato do dia
│       ├── EstadoPlano.ts       # 📊 Contrato do estado
│       ├── DecisoesUsuario.ts   # 🎯 Contratos de decisão
│       ├── contratos.types.ts   # 📜 Contratos conceituais
│       └── index.ts             # 🚪 Exportação centralizada
├── ui/                          # 🎨 Interface (TypeScript)
│   ├── components/              # 🧩 Componentes UI
│   │   ├── Busca/               # 🔍 Componentes de busca
│   │   ├── Calendario/          # 📅 Componentes de calendário
│   │   ├── DarkMode/            # 🌙 Componente de dark mode
│   │   ├── DiaCard/             # 📄 Card de dia tipado
│   │   └── Footer/              # 🦶 Componente de footer
│   ├── componentes/             # 🧩 Componentes legados (migração)
│   │   ├── modais/              # 🔄 Modais
│   │   │   ├── ReajusteModalUI.ts    # 🔄 Modal de reajuste
│   │   │   └── ResetModal.ts         # 🔄 Modal de reset
│   │   └── notas/               # 📝 Componentes de notas
│   │       ├── NotasEnterHandler.ts      # ⌨️ Handler de enter
│   │       ├── NotasEstruturadorUI.ts    # 🏗️ Estruturador
│   │       ├── NotasFormatadorUI.ts      # 🎨 Formatador
│   │       ├── NotasOverlayUI.ts         # 📋 UI de overlay
│   │       └── NotasToolbarUI.ts         # 🛠️ Toolbar
│   ├── orquestradores/          # 🎭 Orquestradores UI
│   │   ├── BaseOrquestrador.ts  # 🎯 Orquestrador base
│   │   ├── MainOrquestrador.ts  # 🎯 Orquestrador principal
│   │   └── UIManager.ts         # 🎛️ Gerenciador de UI
│   └── plugins/                 # 🔌 Plugins UI
│       ├── CertificadoPlugin.ts # 📜 Plugin de certificado
│       └── ExportacaoPlugin.ts  # 📤 Plugin de exportação
├── tailwind.css                 # 🎨 Tailwind CSS
├── index.ts                     # 🚪 Ponto de entrada TS
└── main.ts                      # 🎯 Inicialização do sistema
```

### **🗂️ Diretórios de Configuração e Build**

```
├── assets/                      # 🎨 Assets estáticos (favicon, imagens)
├── css/                         # 🎨 Estilos CSS
├── dist/                        # 📦 Build de produção (gerado pelo Vite)
├── docs/                        # 📚 Documentação
├── index.html                   # 🚪 Ponto de entrada HTML
├── package.json                 # 📦 Configuração npm
├── tsconfig.json                # ⚙️ Configuração TypeScript
├── vite.config.ts               # ⚙️ Configuração Vite
├── postcss.config.js            # ⚙️ Configuração PostCSS
├── tailwind.config.js           # ⚙️ Configuração Tailwind
└── .gitignore                   # 🚫 Arquivos ignorados pelo git
```

---

## 🗺️ **MAPEAMENTO FUNCIONAL**

| Funcionalidade | Arquivo Principal | Camada |
|----------------|-------------------|--------|
| **Geração de Datas** | `core/services/tempo/geradorDatas.ts` | Core |
| **Gerenciamento de Plano** | `core/services/planos/PlanoManager.ts` | Core |
| **Renderização de Dia** | `ui/components/DiaCard/DiaCard.ts` | UI |
| **Calendário** | `ui/components/Calendario/CalendarioComponent.ts` | UI |
| **Busca** | `core/services/busca/SearchEngine.ts` + `ui/components/Busca/` | Core + UI |
| **Notas** | `core/services/notas/*` + `ui/componentes/notas/*` | Core + UI |
| **Modais** | `ui/componentes/modais/*` | UI |
| **Dark Mode** | `ui/components/DarkMode/DarkModeManager.ts` | UI |
| **Orquestração Principal** | `ui/orquestradores/MainOrquestrador.ts` | UI |

---

## ✅ **STATUS DA MIGRAÇÃO**

- ✅ **100% TypeScript** - Zero arquivos JavaScript no código-fonte
- ✅ **Pasta `js/` eliminada** - Código legado removido
- ✅ **Entry point:** `src/main.ts` → `dist/main.js` (Vite)
- ✅ **Tipagem forte** - `strict: true` no tsconfig
- ✅ **Zero duplicidades** - Arquitetura limpa

---

## 📝 **NOTAS**

- Pasta `js/` foi **completamente eliminada** na Fase 7
- Build é gerado em `dist/` pelo Vite (não versionado)
- `dist-vite/` foi removido - não é mais necessário
- Toda a lógica está em `src/` com tipagem TypeScript
