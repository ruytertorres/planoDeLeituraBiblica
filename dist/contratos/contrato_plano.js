"use strict";
/* ============================================================================
   contrato_plano.js — Contrato de Validação de Planos
   Versão: 1.0.0
   Aplicação: Leitura Controlada da Bíblia

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------
   - Validar estrutura de planos de leitura
   - Garantir conformidade com o contrato do sistema
   - Fornecer validações reutilizáveis
   - Servir como guardião do contrato de planos
============================================================================ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarPlano = validarPlano;
exports.planoEstaPronto = planoEstaPronto;
exports.getEstatisticasPlano = getEstatisticasPlano;
/* ============================================================================
   VALIDAÇÕES PRINCIPAIS
============================================================================ */
/**
 * Valida se um objeto é um plano válido
 * @param {Object} plano - Objeto do plano a validar
 * @returns {Object} Resultado da validação
 */
function validarPlano(plano) {
    const erros = [];
    const avisos = [];
    // Verificação básica
    if (!plano || typeof plano !== 'object') {
        erros.push("Plano deve ser um objeto válido");
        return { valido: false, erros, avisos };
    }
    // Verificar propriedades obrigatórias
    if (!plano.nome || typeof plano.nome !== 'string') {
        erros.push("Plano deve ter um nome (string)");
    }
    if (!Array.isArray(plano.dias)) {
        erros.push("Plano deve ter um array de dias");
    }
    else {
        // Validar dias
        if (plano.dias.length === 0) {
            avisos.push("Plano não tem dias definidos");
        }
        else {
            const validacaoDias = validarDias(plano.dias);
            erros.push(...validacaoDias.erros);
            avisos.push(...validacaoDias.avisos);
        }
    }
    // Verificar metadados
    if (plano.metadata) {
        const validacaoMetadata = validarMetadata(plano.metadata);
        erros.push(...validacaoMetadata.erros);
        avisos.push(...validacaoMetadata.avisos);
    }
    return {
        valido: erros.length === 0,
        erros,
        avisos
    };
}
/**
 * Valida array de dias
 * @param {Array} dias - Array de dias para validar
 * @returns {Object} Resultado da validação
 */
function validarDias(dias) {
    const erros = [];
    const avisos = [];
    const numerosVistos = new Set();
    dias.forEach((dia, index) => {
        const posicao = index + 1;
        // Verificar se é um objeto
        if (!dia || typeof dia !== 'object') {
            erros.push(`Dia ${posicao}: deve ser um objeto válido`);
            return;
        }
        // Verificar número
        if (!dia.numero || typeof dia.numero !== 'number' || dia.numero < 1) {
            erros.push(`Dia ${posicao}: número inválido (deve ser > 0)`);
        }
        else {
            // Verificar duplicidade
            if (numerosVistos.has(dia.numero)) {
                erros.push(`Dia ${posicao}: número ${dia.numero} duplicado`);
            }
            else {
                numerosVistos.add(dia.numero);
            }
        }
        // Verificar trechos
        if (!Array.isArray(dia.trechos)) {
            erros.push(`Dia ${posicao}: deve ter array de trechos`);
        }
        else if (dia.trechos.length === 0) {
            avisos.push(`Dia ${posicao}: não tem trechos de leitura`);
        }
        else {
            dia.trechos.forEach((trecho, trechoIndex) => {
                const validacaoTrecho = validarTrecho(trecho, posicao, trechoIndex + 1);
                erros.push(...validacaoTrecho.erros);
                avisos.push(...validacaoTrecho.avisos);
            });
        }
        // Verificar datas (opcional)
        if (dia.data && typeof dia.data !== 'string') {
            avisos.push(`Dia ${posicao}: data deve ser string se fornecida`);
        }
        if (dia.dataFormatada && typeof dia.dataFormatada !== 'string') {
            avisos.push(`Dia ${posicao}: dataFormatada deve ser string se fornecida`);
        }
    });
    // Verificar sequência
    const numerosOrdenados = Array.from(numerosVistos).sort((a, b) => a - b);
    for (let i = 1; i < numerosOrdenados.length; i++) {
        if (numerosOrdenados[i] !== numerosOrdenados[i - 1] + 1) {
            avisos.push("Dias não estão em sequência contínua");
            break;
        }
    }
    return { erros, avisos };
}
/**
 * Valida um trecho bíblico
 * @param {Object} trecho - Trecho para validar
 * @param {number} diaPosicao - Posição do dia
 * @param {number} trechoPosicao - Posição do trecho
 * @returns {Object} Resultado da validação
 */
function validarTrecho(trecho, diaPosicao, trechoPosicao) {
    const erros = [];
    const avisos = [];
    const localizacao = `Dia ${diaPosicao}, Trecho ${trechoPosicao}`;
    // Verificar livro
    if (!trecho.livro || typeof trecho.livro !== 'string') {
        erros.push(`${localizacao}: livro é obrigatório`);
    }
    // Verificar capítulo
    if (!trecho.capitulo || typeof trecho.capitulo !== 'number' || trecho.capitulo < 1) {
        erros.push(`${localizacao}: capítulo inválido (deve ser > 0)`);
    }
    // Verificar versículos
    if (!trecho.versiculoInicio || typeof trecho.versiculoInicio !== 'number' || trecho.versiculoInicio < 1) {
        erros.push(`${localizacao}: versículoInicial inválido (deve ser > 0)`);
    }
    if (trecho.versiculoFinal !== undefined) {
        if (typeof trecho.versiculoFinal !== 'number' || trecho.versiculoFinal < 1) {
            erros.push(`${localizacao}: versículoFinal inválido (deve ser > 0)`);
        }
        else if (trecho.versiculoFinal < trecho.versiculoInicio) {
            erros.push(`${localizacao}: versículoFinal deve ser >= versículoInicial`);
        }
    }
    // Verificar testamento (opcional)
    if (trecho.testamento && typeof trecho.testamento !== 'string') {
        avisos.push(`${localizacao}: testamento deve ser string se fornecido`);
    }
    return { erros, avisos };
}
/**
 * Valida metadados do plano
 * @param {Object} metadata - Metadados para validar
 * @returns {Object} Resultado da validação
 */
function validarMetadata(metadata) {
    const erros = [];
    const avisos = [];
    if (typeof metadata !== 'object') {
        erros.push("Metadata deve ser um objeto");
        return { erros, avisos };
    }
    // Verificar campos comuns
    if (metadata.ano && typeof metadata.ano !== 'number') {
        avisos.push("Metadata.ano deve ser number se fornecido");
    }
    if (metadata.descricao && typeof metadata.descricao !== 'string') {
        avisos.push("Metadata.descricao deve ser string se fornecida");
    }
    if (metadata.autor && typeof metadata.autor !== 'string') {
        avisos.push("Metadata.autor deve ser string se fornecido");
    }
    return { erros, avisos };
}
/* ============================================================================
   UTILITÁRIOS DE VALIDAÇÃO
============================================================================ */
/**
 * Verifica se um plano está pronto para uso
 * @param {Object} plano - Plano para verificar
 * @returns {boolean} True se está pronto
 */
function planoEstaPronto(plano) {
    const validacao = validarPlano(plano);
    return validacao.valido && validacao.avisos.length === 0;
}
/**
 * Retorna estatísticas do plano
 * @param {Object} plano - Plano para analisar
 * @returns {Object} Estatísticas
 */
function getEstatisticasPlano(plano) {
    if (!plano || !Array.isArray(plano.dias)) {
        return {
            totalDias: 0,
            totalTrechos: 0,
            livrosUnicos: 0,
            testamentos: []
        };
    }
    const totalDias = plano.dias.length;
    let totalTrechos = 0;
    const livrosUnicos = new Set();
    const testamentos = new Set();
    plano.dias.forEach(dia => {
        if (Array.isArray(dia.trechos)) {
            totalTrechos += dia.trechos.length;
            dia.trechos.forEach(trecho => {
                if (trecho.livro)
                    livrosUnicos.add(trecho.livro);
                if (trecho.testamento)
                    testamentos.add(trecho.testamento);
            });
        }
    });
    return {
        totalDias,
        totalTrechos,
        livrosUnicos: livrosUnicos.size,
        testamentos: Array.from(testamentos)
    };
}
