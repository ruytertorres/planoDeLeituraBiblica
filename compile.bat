@echo off
echo ========================================
echo   Compilador Simplificado - Bíblia Responsiva
echo ========================================
echo.

:: Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado. Instale Node.js em https://nodejs.org
    pause
    exit /b 1
)

:: Verificar npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm não encontrado.
    pause
    exit /b 1
)

echo ✅ Node.js e npm encontrados
echo.

:: Instalar dependências se necessário
if not exist node_modules (
    echo 📦 Instalando dependências...
    npm install
    if errorlevel 1 (
        echo ❌ Erro ao instalar dependências
        pause
        exit /b 1
    )
    echo ✅ Dependências instaladas
    echo.
)

:: Compilar TypeScript
echo 🔨 Compilando TypeScript...
npm run build
if errorlevel 1 (
    echo ❌ Erro na compilação TypeScript
    pause
    exit /b 1
)

echo ✅ Build concluído com sucesso!
echo.

:: Iniciar servidor
echo 🌐 Iniciando servidor...
echo Abra http://localhost:8000 no navegador
echo.
npm run serve

pause
