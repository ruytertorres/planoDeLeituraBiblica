/* ============================================================================
   ValidadorPlanoTipado.ts — Validação Estrutural com TypeScript
   Versão: 1.0.0 (TypeScript)
   Aplicação: Bíblia Responsiva — Validação de Planos

   RESPONSABILIDADE:
   - Validar planos usando tipos TypeScript
   - Garantir conformidade estrutural
   - Fornecer feedback detalhado de validação
   - Respeitar contratos definidos

   CONTRATO:
   - Usa tipos da FASE 2 para validação estática
   - Implementa validação em tempo de execução
   - Reflete CONTRATO_DO_SISTEMA.md
============================================================================ */
/* ============================================================================
   VALIDADOR PRINCIPAL
============================================================================ */
/**
 * Validador estrutural de planos usando TypeScript
 */
export class ValidadorPlanoTipado {
    /**
     * Valida um plano completo contra o contrato
     */
    static validarPlano(plano) {
        const erros = [];
        const avisos = [];
        // Verificação básica de tipo
        if (!plano || typeof plano !== 'object') {
            return {
                valido: false,
                erros: ['Plano deve ser um objeto válido'],
                avisos: []
            };
        }
        const planoObj = plano;
        // Validar metadados
        const validacaoMetadados = this.validarMetadados(planoObj.metadados);
        erros.push(...validacaoMetadados.erros);
        avisos.push(...validacaoMetadados.avisos);
        // Validar dias
        if (!Array.isArray(planoObj.dias)) {
            erros.push('Dias deve ser um array');
        }
        else {
            planoObj.dias.forEach((dia, index) => {
                const validacaoDia = this.validarDia(dia, index + 1);
                erros.push(...validacaoDia.erros);
                avisos.push(...validacaoDia.avisos);
            });
        }
        return {
            valido: erros.length === 0,
            erros: erros,
            avisos: avisos
        };
    }
    /**
     * Valida metadados do plano
     */
    static validarMetadados(metadados) {
        const erros = [];
        const avisos = [];
        if (!metadados || typeof metadados !== 'object') {
            return {
                valido: false,
                erros: ['Metadados deve ser um objeto válido'],
                avisos: []
            };
        }
        const meta = metadados;
        // ID obrigatório
        if (!meta.id || typeof meta.id !== 'string') {
            erros.push('ID do plano é obrigatório e deve ser string');
        }
        // Nome obrigatório
        if (!meta.nome || typeof meta.nome !== 'string') {
            erros.push('Nome do plano é obrigatório e deve ser string');
        }
        // Versão obrigatória
        if (!meta.versao || typeof meta.versao !== 'string') {
            erros.push('Versão do plano é obrigatória e deve ser string');
        }
        // Total de dias obrigatório
        if (typeof meta.totalDias !== 'number' || meta.totalDias <= 0) {
            erros.push('Total de dias é obrigatório e deve ser número positivo');
        }
        return {
            valido: erros.length === 0,
            erros: erros,
            avisos: avisos
        };
    }
    /**
     * Valida um dia individual
     */
    static validarDia(dia, numeroEsperado) {
        const erros = [];
        const avisos = [];
        if (!dia || typeof dia !== 'object') {
            return {
                valido: false,
                erros: [`Dia ${numeroEsperado}: deve ser um objeto válido`],
                avisos: []
            };
        }
        const diaObj = dia;
        // Número do dia
        if (typeof diaObj.numero !== 'number' || diaObj.numero !== numeroEsperado) {
            erros.push(`Dia ${numeroEsperado}: número inválido (esperado: ${numeroEsperado})`);
        }
        // Data ISO
        if (!diaObj.data || typeof diaObj.data !== 'string') {
            erros.push(`Dia ${numeroEsperado}: data ISO é obrigatória`);
        }
        // Data formatada
        if (!diaObj.dataFormatada || typeof diaObj.dataFormatada !== 'string') {
            erros.push(`Dia ${numeroEsperado}: data formatada é obrigatória`);
        }
        return {
            valido: erros.length === 0,
            erros: erros,
            avisos: avisos
        };
    }
}
