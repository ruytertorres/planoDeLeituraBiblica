# 📋 README - Compilação Simplificada

## 🚀 **Como Compilar e Executar**

### **🎯 Forma Mais Fácil (Recomendado)**

#### **Windows:**
```bash
# Execute o arquivo batch
compile.bat
```

#### **Linux/Mac:**
```bash
# Execute o script shell
./compile.sh
```

### **📋 Forma Manual**

#### **Passo 1: Instalar Dependências**
```bash
npm install
```

#### **Passo 2: Compilar TypeScript**
```bash
npm run build
```

#### **Passo 3: Iniciar Servidor**
```bash
npm run serve
```

### **🌐 Como Acessar**

Após compilação, acesse:
- **URL:** `http://localhost:8000`
- **Arquivo:** `plano.html` (abrir diretamente no navegador)

## 📦 **Scripts Disponíveis**

| Comando | Descrição |
|---------|-----------|
| `npm run build` | Compila TypeScript |
| `npm run serve` | Inicia servidor simples |
| `npm run start` | Compila + Inicia servidor |
| `npm run clean` | Limpa build anterior |
| `npm run rebuild` | Limpa + Compila |

## 🔧 **Requisitos**

- **Node.js** (versão 14 ou superior)
- **npm** (geralmente vem com Node.js)

## ✅ **Verificação**

Se tudo funcionou:
- ✅ Build concluído sem erros
- ✅ Servidor iniciado na porta 8000
- ✅ Sistema funcionando no navegador

## 🆘 **Suporte**

**Problemas Comuns:**
- **Node.js não encontrado:** Instale em https://nodejs.org
- **Erro de permissão:** Use `sudo npm install` (Linux/Mac)
- **Porta ocupada:** Altere para outra porta no script

**Arquivos de Ajuda:**
- `BUILD.md` - Guia detalhado
- `compile.bat` - Script Windows
- `compile.sh` - Script Linux/Mac
