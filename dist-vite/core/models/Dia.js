/* ============================================================================
   Dia.ts — Entidade de Domínio: Dia de Leitura
   Versão: 1.0.0 (TypeScript)
   Aplicação: Leitura Bíblica Cronológica

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------

   - Representar UM dia de leitura bíblica
   - Ser uma entidade de domínio pura e determinística
   - Expor intenção por meio de métodos públicos
   - NÃO conter lógica de UI
   - NÃO conter lógica de persistência
   - NÃO conter lógica de datas
   - NÃO formatar datas
   - NÃO inferir valores ausentes

   PRINCÍPIO ARQUITETURAL:
   ----------------------------------------------------------------------------

   - TODA manipulação de datas pertence exclusivamente ao geradorDatas
   - Dia é criado SEMPRE via Dia.criar() (factory de domínio)
   - Constructor é usado apenas para testes ou reconstituição

   CONTRATO COM GERADORATAS:
   - Dia não gera tempo, mas conhece seu contexto (numero + ano)
   - Se precisar recalcular datas, usa geradorDatas
============================================================================ */
import { gerarDataISO, gerarDataBR, } from "../services/tempo/geradorDatas";
/* ============================================================================
   TIPOS SUPORTADOS
============================================================================ */
export const TIPOS_LEITURA = Object.freeze({
    ANTIGO_TESTAMENTO: "antigoTestamento",
    NOVO_TESTAMENTO: "novoTestamento",
});
/* ============================================================================
   CLASSE DIA
============================================================================ */
/**
 * Factory estático: cria um Dia de forma pura e garantidamente correto.
 * Responsável por orquestrar a consulta a geradorDatas.
 *
 * @param numero - Número do dia (1-366)
 * @param ano - Ano civil real
 * @param antigoTestamento - Trechos do Antigo Testamento
 * @param novoTestamento - Trechos do Novo Testamento
 * @param livros - Lista de livros
 * @param capitulos - Lista de capítulos
 * @param versiculos - Lista de versículos
 * @param observacoes - Observações opcionais
 * @returns Nova instância de Dia
 * @throws Se os parâmetros forem inválidos
 */
export function criarDia(numero, ano, antigoTestamento = [], novoTestamento = [], livros = [], capitulos = [], versiculos = [], observacoes = "") {
    // Geração de datas delegada a geradorDatas (NÍVEL 2)
    const data = gerarDataISO(numero, ano);
    const dataFormatada = gerarDataBR(numero, ano);
    return new Dia({
        numero,
        ano,
        data,
        dataFormatada,
        antigoTestamento,
        novoTestamento,
        livros,
        capitulos,
        versiculos,
        observacoes,
    });
}
export class Dia {
    /* --------------------------------------------------------------------------
       ATRIBUTOS IMUTÁVEIS (readonly)
       -------------------------------------------------------------------------- */
    numero;
    ano;
    data;
    dataFormatada;
    antigoTestamento;
    novoTestamento;
    livros;
    capitulos;
    versiculos;
    observacoes;
    /**
     * Constructor para uso interno e testes.
     * Preferencialmente use criarDia() para criar instâncias normalmente.
     *
     * @param params - Parâmetros de criação do Dia
     */
    constructor(params) {
        /* ----------------------------------------------------------------------
           VALIDAÇÕES ESTRUTURAIS
        ---------------------------------------------------------------------- */
        if (!Number.isInteger(params.numero) ||
            params.numero < 1 ||
            params.numero > 366) {
            throw new Error("Dia inválido: número deve estar entre 1 e 366.");
        }
        if (!Number.isInteger(params.ano) ||
            params.ano < 1900 ||
            params.ano > 2100) {
            throw new Error("Ano inválido: deve ser um inteiro entre 1900 e 2100.");
        }
        if (typeof params.data !== "string" ||
            !/^\d{4}-\d{2}-\d{2}$/.test(params.data)) {
            throw new Error("Data inválida: formato esperado YYYY-MM-DD.");
        }
        if (typeof params.dataFormatada !== "string" ||
            !/^\d{2}\/\d{2}\/\d{4}$/.test(params.dataFormatada)) {
            throw new Error("dataFormatada inválida: formato esperado DD/MM/YYYY. " +
                "A data deve ser fornecida pelo geradorDatas.");
        }
        this.#validarTrechos(params.antigoTestamento, TIPOS_LEITURA.ANTIGO_TESTAMENTO);
        this.#validarTrechos(params.novoTestamento, TIPOS_LEITURA.NOVO_TESTAMENTO);
        /* ----------------------------------------------------------------------
           ATRIBUIÇÃO IMUTÁVEL
        ---------------------------------------------------------------------- */
        this.numero = params.numero;
        this.ano = params.ano;
        this.data = params.data;
        this.dataFormatada = params.dataFormatada;
        this.antigoTestamento = Object.freeze([...params.antigoTestamento]);
        this.novoTestamento = Object.freeze([...params.novoTestamento]);
        this.livros = Object.freeze([...params.livros]);
        this.capitulos = Object.freeze([...params.capitulos]);
        this.versiculos = Object.freeze([...params.versiculos]);
        this.observacoes = params.observacoes;
        // Congela a instância para garantir imutabilidade
        Object.freeze(this);
    }
    /* --------------------------------------------------------------------------
       MÉTODOS PRIVADOS
       -------------------------------------------------------------------------- */
    #validarTrechos(trechos, tipo) {
        if (!Array.isArray(trechos)) {
            throw new Error(`Trechos de ${tipo} devem ser um array.`);
        }
        trechos.forEach((t, i) => {
            if (typeof t.livroId !== "string") {
                throw new Error(`[${tipo}] Trecho ${i}: livroId obrigatório.`);
            }
            if (!Number.isInteger(t.capituloInicio)) {
                throw new Error(`[${tipo}] Trecho ${i}: capituloInicio obrigatório.`);
            }
            if (t.capituloFim !== undefined && t.capituloFim < t.capituloInicio) {
                throw new Error(`[${tipo}] Trecho ${i}: capituloFim menor que início.`);
            }
        });
    }
    /* --------------------------------------------------------------------------
       API PÚBLICA DO DOMÍNIO
       -------------------------------------------------------------------------- */
    getAntigoTestamento() {
        return this.antigoTestamento;
    }
    getNovoTestamento() {
        return this.novoTestamento;
    }
    temAntigoTestamento() {
        return this.antigoTestamento.length > 0;
    }
    temNovoTestamento() {
        return this.novoTestamento.length > 0;
    }
    temLeitura() {
        return this.temAntigoTestamento() || this.temNovoTestamento();
    }
    totalCapitulos() {
        return this.capitulos.length;
    }
    getObservacoes() {
        return this.observacoes || null;
    }
    getResumo() {
        return {
            numero: this.numero,
            ano: this.ano,
            data: this.data,
            dataFormatada: this.dataFormatada,
            totalCapitulos: this.totalCapitulos(),
            temAT: this.temAntigoTestamento(),
            temNT: this.temNovoTestamento(),
        };
    }
    toJSON() {
        return {
            numero: this.numero,
            ano: this.ano,
            data: this.data,
            dataFormatada: this.dataFormatada,
            antigoTestamento: this.antigoTestamento,
            novoTestamento: this.novoTestamento,
            livros: this.livros,
            capitulos: this.capitulos,
            versiculos: this.versiculos,
            observacoes: this.observacoes,
        };
    }
}
