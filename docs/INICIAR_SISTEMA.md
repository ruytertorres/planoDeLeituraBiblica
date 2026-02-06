# 🚀 Como Iniciar o Sistema

> **Versão:** 3.0.0 (TypeScript 100%)
> **Requisitos:** Node.js 18+, npm 9+

---

## ⚡ **Forma Mais Rápida (Recomendado)**

```bash
npm install
npm run build
npm run preview
```

Acesse: `http://localhost:4173`

---

## 📋 **Passo a Passo Manual**

### 1️⃣ Instalar Dependências
```bash
npm install
```

### 2️⃣ Compilar TypeScript
```bash
npm run build
```

### 3️⃣ Iniciar Servidor de Preview
```bash
npm run preview
```

### 4️⃣ Acessar Sistema
Abra no navegador: `http://localhost:4173`

---

## 🌐 **Modo Desenvolvimento (com Hot Reload)**

Para desenvolvimento com atualização automática:

```bash
npm run dev
```

Acesse: `http://localhost:5173`

---

## ✅ **Verificação de Sucesso**

Se funcionou, você verá:
- ✅ Build concluído sem erros (dist/ criado)
- ✅ Servidor iniciado na porta 4173 (preview) ou 5173 (dev)
- ✅ Sistema funcionando no navegador

---

## 📁 **Arquivos Importantes**

- **`index.html`** - Página principal (entry point)
- **`src/main.ts`** - Código fonte TypeScript
- **`dist/main.js`** - Build gerado pelo Vite
- **`package.json`** - Scripts e dependências

---

## 🔧 **Scripts Disponíveis**

| Comando | Função |
|---------|--------|
| `npm run dev` | Modo desenvolvimento (hot reload) |
| `npm run build` | Compila para produção (dist/) |
| `npm run preview` | Preview do build de produção |
| `npm run clean` | Limpa build anterior |
| `npm run rebuild` | Limpa + Compila novamente |

---

## 🐛 **Problemas Comuns**

### Erro: "tsc não encontrado"
```bash
npm install
```

### Erro: "Porta 4173 em uso"
```bash
npm run dev  # Usa porta 5173
```

### Limpar e recomeçar
```bash
npm run rebuild
```

---

## 📝 **Notas**

- Sistema **100% TypeScript** - sem JavaScript legado
- Build otimizado pelo Vite (tree-shaking, code-splitting)
- `dist/` é gerado automaticamente - não versionar

---

**Pronto! Sistema rodando em 3 comandos!** 🎉
