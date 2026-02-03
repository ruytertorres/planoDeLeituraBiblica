#!/bin/bash

echo "========================================"
echo "   Compilador Simplificado - Bíblia Responsiva"
echo "========================================"
echo

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js em https://nodejs.org"
    exit 1
fi

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado."
    exit 1
fi

echo "✅ Node.js e npm encontrados"
echo

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Erro ao instalar dependências"
        exit 1
    fi
    echo "✅ Dependências instaladas"
    echo
fi

# Compilar TypeScript
echo "🔨 Compilando TypeScript..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Erro na compilação TypeScript"
    exit 1
fi

echo "✅ Build concluído com sucesso!"
echo

# Iniciar servidor
echo "🌐 Iniciando servidor..."
echo "Abra http://localhost:8000 no navegador"
echo
npm run serve
