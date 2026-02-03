# 🚀 Como Iniciar o Sistema

## ⚡ **Forma Mais Rápida (Recomendado)**

```bash
npm run start
```

## 📋 **Passo a Passo Manual**

### 1️⃣ Instalar Dependências
```bash
npm install
```

### 2️⃣ Compilar TypeScript
```bash
npm run build
```

### 3️⃣ Iniciar Servidor Local
```bash
npm run serve
```

### 4️⃣ Acessar Sistema
Abra no navegador: `http://localhost:8000`

---

## 🌐 **Como Iniciar Localhost**

### **Comando Principal:**
```bash
npm run serve
```

### **URLs de Acesso:**
- **Principal:** `http://localhost:8000`
- **Alternativa:** `http://localhost:8080`

### **Outras Opções:**
```bash
# Com build automático
npm run start

# Servidor manual
npx http-server . -p 8000 -o

# Outra porta
npx http-server . -p 8080 -o
```

---

## ✅ **Verificação de Sucesso**

Se funcionou, você verá:
- ✅ "Build concluído sem erros"
- ✅ "Servidor iniciado na porta 8000"
- ✅ Sistema funcionando no navegador

---

## 🎯 **Resumo Completo**

**Para iniciar do zero:**
```bash
npm install
npm run start
```

**Para iniciar rapidamente:**
```bash
npm run serve
```

**Acesso:** `http://localhost:8000`

---

## 📁 **Arquivos Importantes**

- **`plano.html`** - Página principal
- **`js/main-hibrido.js`** - Ponto de entrada
- **`dist-vite/`** - Arquivos compilados

---

## 🔧 **Scripts Disponíveis**

| Comando | Função |
|---------|--------|
| `npm run start` | Compila + Inicia servidor |
| `npm run serve` | Inicia servidor apenas |
| `npm run build` | Compila TypeScript apenas |
| `npm run clean` | Limpa build anterior |

---

**Pronto! Sistema rodando em 2 comandos!** 🎉
