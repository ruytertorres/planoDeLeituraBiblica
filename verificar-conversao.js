// Script para verificar a conversão
const fs = require('fs');

const arquivoRefatorado = fs.readFileSync('plano_cronologico_refatorado.js', 'utf-8');
const linhas = arquivoRefatorado.split('\n');

console.log('🔍 VERIFICAÇÃO DA CONVERSÃO');
console.log('============================');

// Verifica dias 1, 2 e 317
console.log('\n📋 DIA 1:');
const dia1 = linhas.findIndex(l => l.includes('criarDia(1,'));
if (dia1 !== -1) {
    for (let i = dia1; i < Math.min(dia1 + 15, linhas.length); i++) {
        console.log(linhas[i]);
    }
}

console.log('\n📋 DIA 2:');
const dia2 = linhas.findIndex(l => l.includes('criarDia(2,'));
if (dia2 !== -1) {
    for (let i = dia2; i < Math.min(dia2 + 15, linhas.length); i++) {
        console.log(linhas[i]);
    }
}

console.log('\n📋 DIA 317:');
const dia317 = linhas.findIndex(l => l.includes('criarDia(317,'));
if (dia317 !== -1) {
    for (let i = dia317; i < Math.min(dia317 + 15, linhas.length); i++) {
        console.log(linhas[i]);
    }
}

// Verifica vírgulas
console.log('\n🔍 VERIFICAÇÃO DE VÍRGULAS:');
const problemas = [];
linhas.forEach((linha, index) => {
    const trim = linha.trim();
    if (trim.startsWith('livros:') || trim.startsWith('capitulos:') || trim.startsWith('observacoes:')) {
        if (!trim.endsWith(',') && !trim.includes('],') && !trim.includes('}')) {
            problemas.push(`Linha ${index + 1}: ${trim}`);
        }
    }
});

if (problemas.length === 0) {
    console.log('✅ Todas as vírgulas estão corretas!');
} else {
    console.log(`⚠️  ${problemas.length} linhas sem vírgula:`);
    problemas.forEach(p => console.log('   ' + p));
}

console.log('\n🎯 PRÓXIMOS PASSOS:');
console.log('1. Verifique se as vírgulas estão todas no lugar');
console.log('2. Teste no navegador (substitua temporariamente)');
console.log('3. Se tudo OK, faça backup e substitua o original');