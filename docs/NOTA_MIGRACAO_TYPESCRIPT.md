# NOTA DE MIGRAÇÃO TYPESCRIPT

## 📋 CONTEXTO

Durante a remodulação para TypeScript (conforme `CONTRATO_DE_REMODULACAO_TS.MD`), 
o sistema opera com **dupla estrutura temporária**:

### Estrutura Híbrida Atual
```
Núcleo TypeScript (src/):
├── geradorDatas.ts          # Autoridade temporal tipada
├── Dia.ts                   # Entidade de domínio
├── PlanoManager.ts          # Orquestrador tipado
└── planoCronologico.ts      # Plano-cartucho validado

Interface JavaScript (js/):
├── main.js                  # Ponto de entrada ATIVO
├── ui/                      # Componentes de interface
└── core/                    # Versões legadas (em transição)
```

## 🔄 COMPATIBILIDADE DURANTE MIGRAÇÃO

### Autoridade Temporal
- **Preferencial**: `geradorDatas.ts` (TypeScript)
- **Legado**: `parametroGerador.js` (JavaScript)
- **Regra**: Ambos seguem o mesmo contrato, nenhum tempo fora deles

### Ponto de Entrada
- **Aplicação**: `plano.html` → `./js/main.js`
- **Build TypeScript**: `npm run build` (gera `dist/`)
- **Desenvolvimento**: `npm run dev` (servidor local)

## 📅 STATUS DA MIGRAÇÃO

### ✅ Concluído
- Núcleo do sistema tipado
- Contratos formais como tipos
- Plano-cartucho validado
- Build funcionando

### 🔄 Em Progresso
- Decisão sobre escopo de TypeScript na UI
- Integração entre núcleo TS e interface JS
- Testes de compatibilidade

### ⏭️ Próximos Passos
1. Definir escopo da FASE 4 (UI)
2. Criar pontes de compatibilidade
3. Migrar componentes críticos
4. Testes finais de integração

## 🎯 REGRAS DE MIGRAÇÃO

1. **Nenhuma violação contratual** - TypeScript reforça, não substitui
2. **Compatibilidade mantida** - UI JavaScript consome núcleo TypeScript
3. **Migração gradual** - Sem quebrar funcionalidade existente
4. **Contrato soberano** - `CONTRATO_DO_SISTEMA.MD` continua como fonte de verdade

---

**Data**: 01/02/2026  
**Status**: Migração ativa, núcleo estável  
**Próxima revisão**: Após decisão sobre escopo da UI
