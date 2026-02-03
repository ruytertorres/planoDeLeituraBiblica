# 📋 Guia de Compilação Simplificado

## 🚀 **Compilação Rápida**

### **Passo 1: Instalar Dependências**
```bash
npm install
```

### **Passo 2: Compilar TypeScript**
```bash
npm run build
```

### **Passo 3: Iniciar Servidor**
```bash
npm run dev
```

## 📁 **Estrutura de Saída**

Após compilação, os arquivos ficam em:
- **`dist-vite/`** - Arquivos TypeScript compilados
- **`plano.html`** - Arquivo principal (abrir no navegador)

## 🌐 **Como Abrir**

### **Opção 1: Servidor Integrado**
```bash
npm run start
```
Abra `http://localhost:8000` no navegador

### **Opção 2: Servidor Simples**
```bash
npm run dev:legacy
```
Abra `http://localhost:8080` no navegador

### **Opção 3: Arquivo Direto**
1. Execute `npm run build`
2. Abra `plano.html` diretamente no navegador

## 🔧 **Problemas Comuns**

### **Erro: "tsc não encontrado"**
```bash
npm install -g typescript
```

### **Erro: "Módulo não encontrado"**
```bash
npm install
npm run build
```

### **Erro: "Servidor não inicia"**
```bash
# Use servidor alternativo
npm run dev:legacy
```

## ✅ **Verificação**

Se tudo funcionou, você verá:
- ✅ Build concluído sem erros
- ✅ Servidor iniciado
- ✅ Sistema funcionando no navegador

## 📞 **Suporte**

Se tiver problemas:
1. Verifique se Node.js está instalado
2. Execute `npm install` novamente
3. Tente `npm run dev:legacy`
