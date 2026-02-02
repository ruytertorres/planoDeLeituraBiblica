"use strict";
/* ============================================================================
   plano_cronologico.js — MODELO REFATORADO (GUIA CANÔNICO)
   Versão: 0.8.0
   Aplicação: Bíblia Responsiva App

   OBJETIVO DESTE ARQUIVO:
   ----------------------------------------------------------------------------
   - Servir como guia definitivo de como o plano cronológico deve ser escrito
   - Aplicar o novo prisma arquitetural baseado no relógio universal
   - Evitar duplicação de lógica de datas
   - Manter o plano como agregado de domínio puro

   PRINCÍPIOS APLICADOS:
   ----------------------------------------------------------------------------
   - Datas NÃO são calculadas aqui
   - Datas NÃO são formatadas aqui
   - O plano APENAS consome o geradorDatas.js
   - Cada Dia é criado de forma determinística e imutável
============================================================================ */
Object.defineProperty(exports, "__esModule", { value: true });
/* ---------------------------------------------------------------------------
   IMPORTAÇÕES
   ---------------------------------------------------------------------------
   - Dia: entidade de domínio pura
   - validarPlano: guardião do contrato do plano
   - gerarDataISO / gerarDataBR: relógio universal do sistema
--------------------------------------------------------------------------- */
const parametroDia_js_1 = require("../core/models/parametroDia.js");
const contrato_plano_js_1 = require("../../contratos/contrato_plano.js");
const parametroGerador_js_1 = require("../core/models/parametroGerador.js");
/* ---------------------------------------------------------------------------
   FACTORY LOCAL — CRIAÇÃO PADRONIZADA DE DIA
   ---------------------------------------------------------------------------
   RESPONSABILIDADE:
   - Centralizar a criação de objetos Dia
   - Garantir que TODA data venha do relógio universal
   - Evitar repetição de código ao longo dos 317 dias

   REGRA DE OURO:
   - Nenhum new Dia() deve existir fora desta função
--------------------------------------------------------------------------- */
/**
 * Cria um Dia de leitura de forma padronizada
 * @param {number} numero - Número do dia (1–317)
 * @param {Object} dados - Conteúdo do dia (leituras, observações, etc.)
 * @returns {Dia}
 */
function criarDia(numero, dados) {
    // Consulta soberana ao tempo real (CONTRATO §2.1)
    const ano = (0, parametroGerador_js_1.getAnoAtual)();
    // Combinar trechos do antigo e novo testamento com marcação
    const trechos = [
        ...(dados.antigoTestamento || []).map((trecho) => ({
            ...trecho,
            testamento: "antigoTestamento",
        })),
        ...(dados.novoTestamento || []).map((trecho) => ({
            ...trecho,
            testamento: "novoTestamento",
        })),
    ];
    // Metadados adicionais para o Dia
    const metadadosAdicionais = {
        livros: dados.livros || [],
        capitulos: dados.capitulos || [],
        versiculos: dados.versiculos || [],
        observacoes: dados.observacoes || "",
    };
    return new parametroDia_js_1.Dia(numero, ano, trechos, dados.tipo, metadadosAdicionais);
}
/* ---------------------------------------------------------------------------
   DEFINIÇÃO DO PLANO (AGREGADO DE DOMÍNIO)
--------------------------------------------------------------------------- */
const planoCronologico = {
    /* -------------------------------------------------------------------------
       METADADOS DO PLANO
    ------------------------------------------------------------------------- */
    id: "plano_cronologico",
    nome: "Plano Cronológico da Bíblia",
    descricao: "Leitura diária da Bíblia em ordem cronológica e temática",
    totalDias: 317,
    /* -------------------------------------------------------------------------
       DIAS DO PLANO
       -------------------------------------------------------------------------
       IMPORTANTE:
       - Nenhuma data aparece aqui
       - Cada dia declara SOMENTE seu conteúdo
       - A numeração é explícita para clareza histórica
    ------------------------------------------------------------------------- */
    dias: [
        /* ======================================================================
           DIA 1
        ====================================================================== */
        criarDia(1, {
            //apaga
            antigoTestamento: [
                {
                    livroId: "genesis",
                    livroNome: "Gênesis",
                    capituloInicio: 1,
                    capituloFim: 2,
                },
            ],
            novoTestamento: [],
            livros: ["Gênesis"],
            capitulos: [1, 2],
            versiculos: [],
            observacoes: "pentateuco, criação",
        }),
        criarDia(2, {
            antigoTestamento: [
                {
                    livroId: "genesis",
                    livroNome: "Gênesis",
                    capituloInicio: 3,
                    capituloFim: 5,
                },
            ],
            novoTestamento: [],
            livros: ["Gênesis"],
            capitulos: [3, 4, 5],
            versiculos: [],
            observacoes: "pentateuco, queda, genealogia",
        }),
        criarDia(3, {
            antigoTestamento: [
                {
                    livroId: "genesis",
                    livroNome: "Gênesis",
                    capituloInicio: 6,
                    capituloFim: 9,
                },
            ],
            novoTestamento: [],
            livros: ["Gênesis"],
            capitulos: [6, 7, 8, 9],
            versiculos: [],
            observacoes: "pentateuco, dilúvio, aliança",
        }),
        criarDia(4, {
            antigoTestamento: [
                {
                    livroId: "genesis",
                    livroNome: "Gênesis",
                    capituloInicio: 10,
                    capituloFim: 11,
                },
            ],
            novoTestamento: [],
            livros: ["Gênesis"],
            capitulos: [10, 11],
            versiculos: [],
            observacoes: "pentateuco, nações, torreDeBabel",
        }),
        criarDia(5, {
            antigoTestamento: [
                {
                    livroId: "genesis",
                    livroNome: "Gênesis",
                    capituloInicio: 12,
                    capituloFim: 15,
                },
            ],
            novoTestamento: [],
            livros: ["Gênesis"],
            capitulos: [12, 13, 14, 15],
            versiculos: [],
            observacoes: "pentateuco, Abraão, promessa",
        }),
        criarDia(6, {
            antigoTestamento: [
                {
                    livroId: "genesis",
                    livroNome: "Gênesis",
                    capituloInicio: 16,
                    capituloFim: 19,
                },
            ],
            novoTestamento: [],
            livros: ["Gênesis"],
            capitulos: [16, 17, 18, 19],
            versiculos: [],
            observacoes: "pentateuco, Hagar, Sodoma",
        }),
        criarDia(7, {
            antigoTestamento: [
                {
                    livroId: "genesis",
                    livroNome: "Gênesis",
                    capituloInicio: 20,
                    capituloFim: 22,
                },
            ],
            novoTestamento: [],
            livros: ["Gênesis"],
            capitulos: [20, 21, 22],
            versiculos: [],
            observacoes: "pentateuco, sacrifícioDeIsaque",
        }),
        criarDia(8, {
            antigoTestamento: [
                {
                    livroId: "genesis",
                    livroNome: "Gênesis",
                    capituloInicio: 23,
                    capituloFim: 26,
                },
            ],
            novoTestamento: [],
            livros: ["Gênesis"],
            capitulos: [23, 24, 25, 26],
            versiculos: [],
            observacoes: "pentateuco, Rebeca, Isaque",
        }),
        criarDia(9, {
            antigoTestamento: [
                {
                    livroId: "genesis",
                    livroNome: "Gênesis",
                    capituloInicio: 27,
                    capituloFim: 29,
                },
            ],
            novoTestamento: [],
            livros: ["Gênesis"],
            capitulos: [27, 28, 29],
            versiculos: [],
            observacoes: "pentateuco, Jacó, Esaú",
        }),
        criarDia(10, {
            antigoTestamento: [
                {
                    livroId: "genesis",
                    livroNome: "Gênesis",
                    capituloInicio: 30,
                    capituloFim: 32,
                },
            ],
            novoTestamento: [],
            livros: ["Gênesis"],
            capitulos: [30, 31, 32],
            versiculos: [],
            observacoes: "pentateuco, famíliaDeJacó, Peniel",
        }),
        criarDia(11, {
            antigoTestamento: [
                {
                    livroId: "genesis",
                    livroNome: "Gênesis",
                    capituloInicio: 33,
                    capituloFim: 36,
                },
            ],
            novoTestamento: [],
            livros: ["Gênesis"],
            capitulos: [33, 34, 35, 36],
            versiculos: [],
            observacoes: "pentateuco, Edom, reconciliação",
        }),
        criarDia(12, {
            antigoTestamento: [
                {
                    livroId: "genesis",
                    livroNome: "Gênesis",
                    capituloInicio: 37,
                    capituloFim: 39,
                },
            ],
            novoTestamento: [],
            livros: ["Gênesis"],
            capitulos: [37, 38, 39],
            versiculos: [],
            observacoes: "pentateuco, José, Egito",
        }),
        criarDia(13, {
            antigoTestamento: [
                {
                    livroId: "genesis",
                    livroNome: "Gênesis",
                    capituloInicio: 40,
                    capituloFim: 42,
                },
            ],
            novoTestamento: [],
            livros: ["Gênesis"],
            capitulos: [40, 41, 42],
            versiculos: [],
            observacoes: "pentateuco, sonhos, providência",
        }),
        criarDia(14, {
            antigoTestamento: [
                {
                    livroId: "genesis",
                    livroNome: "Gênesis",
                    capituloInicio: 43,
                    capituloFim: 46,
                },
            ],
            novoTestamento: [],
            livros: ["Gênesis"],
            capitulos: [43, 44, 45, 46],
            versiculos: [],
            observacoes: "pentateuco, reconciliação, migração",
        }),
        criarDia(15, {
            antigoTestamento: [
                {
                    livroId: "genesis",
                    livroNome: "Gênesis",
                    capituloInicio: 47,
                    capituloFim: 50,
                },
            ],
            novoTestamento: [],
            livros: ["Gênesis"],
            capitulos: [47, 48, 49, 50],
            versiculos: [],
            observacoes: "pentateuco, bênção, morteDeJacó",
        }),
        criarDia(16, {
            antigoTestamento: [
                { livroId: "jo", livroNome: "Jó", capituloInicio: 1, capituloFim: 4 },
            ],
            novoTestamento: [],
            livros: ["Jó"],
            capitulos: [1, 2, 3, 4],
            versiculos: [],
            observacoes: "poesia, sofrimento, provação",
        }),
        criarDia(17, {
            antigoTestamento: [
                { livroId: "jo", livroNome: "Jó", capituloInicio: 5, capituloFim: 7 },
            ],
            novoTestamento: [],
            livros: ["Jó"],
            capitulos: [5, 6, 7],
            versiculos: [],
            observacoes: "poesia, lamento, debate",
        }),
        criarDia(18, {
            antigoTestamento: [
                { livroId: "jo", livroNome: "Jó", capituloInicio: 8, capituloFim: 10 },
            ],
            novoTestamento: [],
            livros: ["Jó"],
            capitulos: [8, 9, 10],
            versiculos: [],
            observacoes: "poesia, justiçaDivina",
        }),
        criarDia(19, {
            antigoTestamento: [
                { livroId: "jo", livroNome: "Jó", capituloInicio: 11, capituloFim: 13 },
            ],
            novoTestamento: [],
            livros: ["Jó"],
            capitulos: [11, 12, 13],
            versiculos: [],
            observacoes: "poesia, defesaDeJó",
        }),
        criarDia(20, {
            antigoTestamento: [
                { livroId: "jo", livroNome: "Jó", capituloInicio: 14, capituloFim: 17 },
            ],
            novoTestamento: [],
            livros: ["Jó"],
            capitulos: [14, 15, 16, 17],
            versiculos: [],
            observacoes: "poesia, esperança",
        }),
        criarDia(21, {
            antigoTestamento: [
                { livroId: "jo", livroNome: "Jó", capituloInicio: 18, capituloFim: 20 },
            ],
            novoTestamento: [],
            livros: ["Jó"],
            capitulos: [18, 19, 20],
            versiculos: [],
            observacoes: "poesia, discurso",
        }),
        criarDia(22, {
            antigoTestamento: [
                { livroId: "jo", livroNome: "Jó", capituloInicio: 21, capituloFim: 24 },
            ],
            novoTestamento: [],
            livros: ["Jó"],
            capitulos: [21, 22, 23, 24],
            versiculos: [],
            observacoes: "poesia, impiedade",
        }),
        criarDia(23, {
            antigoTestamento: [
                { livroId: "jo", livroNome: "Jó", capituloInicio: 25, capituloFim: 27 },
            ],
            novoTestamento: [],
            livros: ["Jó"],
            capitulos: [25, 26, 27],
            versiculos: [],
            observacoes: "poesia, respostas",
        }),
        criarDia(24, {
            antigoTestamento: [
                { livroId: "jo", livroNome: "Jó", capituloInicio: 28, capituloFim: 31 },
            ],
            novoTestamento: [],
            livros: ["Jó"],
            capitulos: [28, 29, 30, 31],
            versiculos: [],
            observacoes: "poesia, sabedoria",
        }),
        criarDia(25, {
            antigoTestamento: [
                { livroId: "jo", livroNome: "Jó", capituloInicio: 32, capituloFim: 34 },
            ],
            novoTestamento: [],
            livros: ["Jó"],
            capitulos: [32, 33, 34],
            versiculos: [],
            observacoes: "poesia, Eliú",
        }),
        criarDia(26, {
            antigoTestamento: [
                { livroId: "jo", livroNome: "Jó", capituloInicio: 35, capituloFim: 38 },
            ],
            novoTestamento: [],
            livros: ["Jó"],
            capitulos: [35, 36, 37, 38],
            versiculos: [],
            observacoes: "poesia, justiça",
        }),
        criarDia(27, {
            antigoTestamento: [
                { livroId: "jo", livroNome: "Jó", capituloInicio: 39, capituloFim: 42 },
            ],
            novoTestamento: [],
            livros: ["Jó"],
            capitulos: [39, 40, 41, 42],
            versiculos: [],
            observacoes: "poesia, DeusFala, restauração",
        }),
        criarDia(28, {
            antigoTestamento: [
                {
                    livroId: "exodo",
                    livroNome: "Êxodo",
                    capituloInicio: 1,
                    capituloFim: 4,
                },
            ],
            novoTestamento: [],
            livros: ["Êxodo"],
            capitulos: [1, 2, 3, 4],
            versiculos: [],
            observacoes: "pentateuco, Moisés, chamado",
        }),
        criarDia(29, {
            antigoTestamento: [
                {
                    livroId: "exodo",
                    livroNome: "Êxodo",
                    capituloInicio: 5,
                    capituloFim: 7,
                },
            ],
            novoTestamento: [],
            livros: ["Êxodo"],
            capitulos: [5, 6, 7],
            versiculos: [],
            observacoes: "pentateuco, Faraó, pragas",
        }),
        criarDia(30, {
            antigoTestamento: [
                {
                    livroId: "exodo",
                    livroNome: "Êxodo",
                    capituloInicio: 8,
                    capituloFim: 10,
                },
            ],
            novoTestamento: [],
            livros: ["Êxodo"],
            capitulos: [8, 9, 10],
            versiculos: [],
            observacoes: "pentateuco, pragas",
        }),
        criarDia(31, {
            antigoTestamento: [
                {
                    livroId: "exodo",
                    livroNome: "Êxodo",
                    capituloInicio: 11,
                    capituloFim: 13,
                },
            ],
            novoTestamento: [],
            livros: ["Êxodo"],
            capitulos: [11, 12, 13],
            versiculos: [],
            observacoes: "pentateuco, Páscoa, Êxodo",
        }),
        criarDia(32, {
            antigoTestamento: [
                {
                    livroId: "exodo",
                    livroNome: "Êxodo",
                    capituloInicio: 14,
                    capituloFim: 17,
                },
            ],
            novoTestamento: [],
            livros: ["Êxodo"],
            capitulos: [14, 15, 16, 17],
            versiculos: [],
            observacoes: "pentateuco, MarVermelho, maná",
        }),
        criarDia(33, {
            antigoTestamento: [
                {
                    livroId: "exodo",
                    livroNome: "Êxodo",
                    capituloInicio: 18,
                    capituloFim: 20,
                },
            ],
            novoTestamento: [],
            livros: ["Êxodo"],
            capitulos: [18, 19, 20],
            versiculos: [],
            observacoes: "pentateuco, dezMandamentos",
        }),
        criarDia(34, {
            antigoTestamento: [
                {
                    livroId: "exodo",
                    livroNome: "Êxodo",
                    capituloInicio: 21,
                    capituloFim: 24,
                },
            ],
            novoTestamento: [],
            livros: ["Êxodo"],
            capitulos: [21, 22, 23, 24],
            versiculos: [],
            observacoes: "pentateuco, aliança",
        }),
        criarDia(35, {
            antigoTestamento: [
                {
                    livroId: "exodo",
                    livroNome: "Êxodo",
                    capituloInicio: 25,
                    capituloFim: 27,
                },
            ],
            novoTestamento: [],
            livros: ["Êxodo"],
            capitulos: [25, 26, 27],
            versiculos: [],
            observacoes: "pentateuco, tabernáculo",
        }),
        criarDia(36, {
            antigoTestamento: [
                {
                    livroId: "exodo",
                    livroNome: "Êxodo",
                    capituloInicio: 28,
                    capituloFim: 31,
                },
            ],
            novoTestamento: [],
            livros: ["Êxodo"],
            capitulos: [28, 29, 30, 31],
            versiculos: [],
            observacoes: "pentateuco, sacerdócio",
        }),
        criarDia(37, {
            antigoTestamento: [
                {
                    livroId: "exodo",
                    livroNome: "Êxodo",
                    capituloInicio: 32,
                    capituloFim: 34,
                },
            ],
            novoTestamento: [],
            livros: ["Êxodo"],
            capitulos: [32, 33, 34],
            versiculos: [],
            observacoes: "pentateuco, bezerroDeOuro",
        }),
        criarDia(38, {
            antigoTestamento: [
                {
                    livroId: "exodo",
                    livroNome: "Êxodo",
                    capituloInicio: 35,
                    capituloFim: 37,
                },
            ],
            novoTestamento: [],
            livros: ["Êxodo"],
            capitulos: [35, 36, 37],
            versiculos: [],
            observacoes: "pentateuco, construção",
        }),
        criarDia(39, {
            antigoTestamento: [
                {
                    livroId: "exodo",
                    livroNome: "Êxodo",
                    capituloInicio: 38,
                    capituloFim: 40,
                },
            ],
            novoTestamento: [],
            livros: ["Êxodo"],
            capitulos: [38, 39, 40],
            versiculos: [],
            observacoes: "pentateuco, glória",
        }),
        criarDia(40, {
            antigoTestamento: [
                {
                    livroId: "levitico",
                    livroNome: "Levítico",
                    capituloInicio: 1,
                    capituloFim: 4,
                },
            ],
            novoTestamento: [],
            livros: ["Levítico"],
            capitulos: [1, 2, 3, 4],
            versiculos: [],
            observacoes: "pentateuco, sacrifícios",
        }),
        criarDia(41, {
            antigoTestamento: [
                {
                    livroId: "levitico",
                    livroNome: "Levítico",
                    capituloInicio: 5,
                    capituloFim: 7,
                },
            ],
            novoTestamento: [],
            livros: ["Levítico"],
            capitulos: [5, 6, 7],
            versiculos: [],
            observacoes: "pentateuco, ofertas",
        }),
        criarDia(42, {
            antigoTestamento: [
                {
                    livroId: "levitico",
                    livroNome: "Levítico",
                    capituloInicio: 8,
                    capituloFim: 10,
                },
            ],
            novoTestamento: [],
            livros: ["Levítico"],
            capitulos: [8, 9, 10],
            versiculos: [],
            observacoes: "pentateuco, consagração",
        }),
        criarDia(43, {
            antigoTestamento: [
                {
                    livroId: "levitico",
                    livroNome: "Levítico",
                    capituloInicio: 11,
                    capituloFim: 13,
                },
            ],
            novoTestamento: [],
            livros: ["Levítico"],
            capitulos: [11, 12, 13],
            versiculos: [],
            observacoes: "pentateuco, pureza",
        }),
        criarDia(44, {
            antigoTestamento: [
                {
                    livroId: "levitico",
                    livroNome: "Levítico",
                    capituloInicio: 14,
                    capituloFim: 16,
                },
            ],
            novoTestamento: [],
            livros: ["Levítico"],
            capitulos: [14, 15, 16],
            versiculos: [],
            observacoes: "pentateuco, expiação",
        }),
        criarDia(45, {
            antigoTestamento: [
                {
                    livroId: "levitico",
                    livroNome: "Levítico",
                    capituloInicio: 17,
                    capituloFim: 20,
                },
            ],
            novoTestamento: [],
            livros: ["Levítico"],
            capitulos: [17, 18, 19, 20],
            versiculos: [],
            observacoes: "pentateuco, santidade",
        }),
        criarDia(46, {
            antigoTestamento: [
                {
                    livroId: "levitico",
                    livroNome: "Levítico",
                    capituloInicio: 21,
                    capituloFim: 23,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 95,
                    capituloFim: 95,
                },
            ],
            novoTestamento: [],
            livros: ["Levítico", "Salmos"],
            capitulos: [21, 22, 23, 95],
            versiculos: [],
            observacoes: "pentateuco, adoração",
        }),
        criarDia(47, {
            antigoTestamento: [
                {
                    livroId: "levitico",
                    livroNome: "Levítico",
                    capituloInicio: 24,
                    capituloFim: 27,
                },
            ],
            novoTestamento: [],
            livros: ["Levítico"],
            capitulos: [24, 25, 26, 27],
            versiculos: [],
            observacoes: "pentateuco, festas",
        }),
        criarDia(48, {
            antigoTestamento: [
                {
                    livroId: "numeros",
                    livroNome: "Números",
                    capituloInicio: 1,
                    capituloFim: 3,
                },
            ],
            novoTestamento: [],
            livros: ["Números"],
            capitulos: [1, 2, 3],
            versiculos: [],
            observacoes: "pentateuco, censo",
        }),
        criarDia(49, {
            antigoTestamento: [
                {
                    livroId: "numeros",
                    livroNome: "Números",
                    capituloInicio: 4,
                    capituloFim: 6,
                },
            ],
            novoTestamento: [],
            livros: ["Números"],
            capitulos: [4, 5, 6],
            versiculos: [],
            observacoes: "pentateuco, nazireu",
        }),
        /* ======================================================================
           DIA 50
        ====================================================================== */
        criarDia(50, {
            antigoTestamento: [
                {
                    livroId: "numeros",
                    livroNome: "Números",
                    capituloInicio: 7,
                    capituloFim: 10,
                },
            ],
            novoTestamento: [],
            livros: ["Números"],
            capitulos: [7, 8, 9, 10],
            versiculos: [],
            observacoes: "pentateuco, partida",
        }),
        criarDia(51, {
            antigoTestamento: [
                {
                    livroId: "numeros",
                    livroNome: "Números",
                    capituloInicio: 11,
                    capituloFim: 12,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 90,
                    capituloFim: 90,
                },
            ],
            novoTestamento: [],
            livros: ["Números", "Salmos"],
            capitulos: [11, 12, 90],
            versiculos: [],
            observacoes: "pentateuco, murmuração",
        }),
        criarDia(52, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 91,
                    capituloFim: 91,
                },
                {
                    livroId: "numeros",
                    livroNome: "Números",
                    capituloInicio: 13,
                    capituloFim: 14,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos", "Números"],
            capitulos: [91, 13, 14],
            versiculos: [],
            observacoes: "pentateuco, rebelião",
        }),
        criarDia(53, {
            antigoTestamento: [
                {
                    livroId: "numeros",
                    livroNome: "Números",
                    capituloInicio: 15,
                    capituloFim: 17,
                },
            ],
            novoTestamento: [],
            livros: ["Números"],
            capitulos: [15, 16, 17],
            versiculos: [],
            observacoes: "pentateuco, autoridade",
        }),
        criarDia(54, {
            antigoTestamento: [
                {
                    livroId: "numeros",
                    livroNome: "Números",
                    capituloInicio: 18,
                    capituloFim: 20,
                },
            ],
            novoTestamento: [],
            livros: ["Números"],
            capitulos: [18, 19, 20],
            versiculos: [],
            observacoes: "pentateuco, falhaDeMoisés",
        }),
        criarDia(55, {
            antigoTestamento: [
                {
                    livroId: "numeros",
                    livroNome: "Números",
                    capituloInicio: 21,
                    capituloFim: 24,
                },
            ],
            novoTestamento: [],
            livros: ["Números"],
            capitulos: [21, 22, 23, 24],
            versiculos: [],
            observacoes: "pentateuco, Balaão",
        }),
        criarDia(56, {
            antigoTestamento: [
                {
                    livroId: "numeros",
                    livroNome: "Números",
                    capituloInicio: 25,
                    capituloFim: 27,
                },
            ],
            novoTestamento: [],
            livros: ["Números"],
            capitulos: [25, 26, 27],
            versiculos: [],
            observacoes: "pentateuco, sucessão",
        }),
        criarDia(57, {
            antigoTestamento: [
                {
                    livroId: "numeros",
                    livroNome: "Números",
                    capituloInicio: 28,
                    capituloFim: 30,
                },
            ],
            novoTestamento: [],
            livros: ["Números"],
            capitulos: [28, 29, 30],
            versiculos: [],
            observacoes: "pentateuco, votos",
        }),
        criarDia(58, {
            antigoTestamento: [
                {
                    livroId: "numeros",
                    livroNome: "Números",
                    capituloInicio: 31,
                    capituloFim: 33,
                },
            ],
            novoTestamento: [],
            livros: ["Números"],
            capitulos: [31, 32, 33],
            versiculos: [],
            observacoes: "pentateuco, itinerário",
        }),
        criarDia(59, {
            antigoTestamento: [
                {
                    livroId: "numeros",
                    livroNome: "Números",
                    capituloInicio: 34,
                    capituloFim: 36,
                },
            ],
            novoTestamento: [],
            livros: ["Números"],
            capitulos: [34, 35, 36],
            versiculos: [],
            observacoes: "pentateuco, herança",
        }),
        criarDia(60, {
            antigoTestamento: [
                {
                    livroId: "deuteronomio",
                    livroNome: "Deuteronômio",
                    capituloInicio: 1,
                    capituloFim: 3,
                },
            ],
            novoTestamento: [],
            livros: ["Deuteronômio"],
            capitulos: [1, 2, 3],
            versiculos: [],
            observacoes: "pentateuco, recapitulação",
        }),
        criarDia(61, {
            antigoTestamento: [
                {
                    livroId: "deuteronomio",
                    livroNome: "Deuteronômio",
                    capituloInicio: 4,
                    capituloFim: 6,
                },
            ],
            novoTestamento: [],
            livros: ["Deuteronômio"],
            capitulos: [4, 5, 6],
            versiculos: [],
            observacoes: "pentateuco, aliança, Shema",
        }),
        criarDia(62, {
            antigoTestamento: [
                {
                    livroId: "deuteronomio",
                    livroNome: "Deuteronômio",
                    capituloInicio: 7,
                    capituloFim: 9,
                },
            ],
            novoTestamento: [],
            livros: ["Deuteronômio"],
            capitulos: [7, 8, 9],
            versiculos: [],
            observacoes: "pentateuco, eleição, memória",
        }),
        criarDia(63, {
            antigoTestamento: [
                {
                    livroId: "deuteronomio",
                    livroNome: "Deuteronômio",
                    capituloInicio: 10,
                    capituloFim: 12,
                },
            ],
            novoTestamento: [],
            livros: ["Deuteronômio"],
            capitulos: [10, 11, 12],
            versiculos: [],
            observacoes: "pentateuco, adoração",
        }),
        criarDia(64, {
            antigoTestamento: [
                {
                    livroId: "deuteronomio",
                    livroNome: "Deuteronômio",
                    capituloInicio: 13,
                    capituloFim: 15,
                },
            ],
            novoTestamento: [],
            livros: ["Deuteronômio"],
            capitulos: [13, 14, 15],
            versiculos: [],
            observacoes: "pentateuco, leisSociais",
        }),
        criarDia(65, {
            antigoTestamento: [
                {
                    livroId: "deuteronomio",
                    livroNome: "Deuteronômio",
                    capituloInicio: 16,
                    capituloFim: 18,
                },
            ],
            novoTestamento: [],
            livros: ["Deuteronômio"],
            capitulos: [16, 17, 18],
            versiculos: [],
            observacoes: "pentateuco, festas, profeta",
        }),
        criarDia(66, {
            antigoTestamento: [
                {
                    livroId: "deuteronomio",
                    livroNome: "Deuteronômio",
                    capituloInicio: 19,
                    capituloFim: 21,
                },
            ],
            novoTestamento: [],
            livros: ["Deuteronômio"],
            capitulos: [19, 20, 21],
            versiculos: [],
            observacoes: "pentateuco, justiça",
        }),
        criarDia(67, {
            antigoTestamento: [
                {
                    livroId: "deuteronomio",
                    livroNome: "Deuteronômio",
                    capituloInicio: 22,
                    capituloFim: 24,
                },
            ],
            novoTestamento: [],
            livros: ["Deuteronômio"],
            capitulos: [22, 23, 24],
            versiculos: [],
            observacoes: "pentateuco, vidaSocial",
        }),
        criarDia(68, {
            antigoTestamento: [
                {
                    livroId: "deuteronomio",
                    livroNome: "Deuteronômio",
                    capituloInicio: 25,
                    capituloFim: 27,
                },
            ],
            novoTestamento: [],
            livros: ["Deuteronômio"],
            capitulos: [25, 26, 27],
            versiculos: [],
            observacoes: "pentateuco, bênçãoEMaldição",
        }),
        criarDia(69, {
            antigoTestamento: [
                {
                    livroId: "deuteronomio",
                    livroNome: "Deuteronômio",
                    capituloInicio: 28,
                    capituloFim: 28,
                },
            ],
            novoTestamento: [],
            livros: ["Deuteronômio"],
            capitulos: [28],
            versiculos: [],
            observacoes: "pentateuco, bênçãosEMaldições",
        }),
        criarDia(70, {
            antigoTestamento: [
                {
                    livroId: "deuteronomio",
                    livroNome: "Deuteronômio",
                    capituloInicio: 29,
                    capituloFim: 31,
                },
            ],
            novoTestamento: [],
            livros: ["Deuteronômio"],
            capitulos: [29, 30, 31],
            versiculos: [],
            observacoes: "pentateuco, renovaçãoDaAliança",
        }),
        criarDia(71, {
            antigoTestamento: [
                {
                    livroId: "deuteronomio",
                    livroNome: "Deuteronômio",
                    capituloInicio: 32,
                    capituloFim: 34,
                },
            ],
            novoTestamento: [],
            livros: ["Deuteronômio"],
            capitulos: [32, 33, 34],
            versiculos: [],
            observacoes: "pentateuco, cânticoDeMoisés, morteDeMoisés",
        }),
        criarDia(72, {
            antigoTestamento: [
                {
                    livroId: "josue",
                    livroNome: "Josué",
                    capituloInicio: 1,
                    capituloFim: 4,
                },
            ],
            novoTestamento: [],
            livros: ["Josué"],
            capitulos: [1, 2, 3, 4],
            versiculos: [],
            observacoes: "historiaBiblica, entradaNaTerra",
        }),
        criarDia(73, {
            antigoTestamento: [
                {
                    livroId: "josue",
                    livroNome: "Josué",
                    capituloInicio: 5,
                    capituloFim: 8,
                },
            ],
            novoTestamento: [],
            livros: ["Josué"],
            capitulos: [5, 6, 7, 8],
            versiculos: [],
            observacoes: "historiaBiblica, conquista",
        }),
        criarDia(74, {
            antigoTestamento: [
                {
                    livroId: "josue",
                    livroNome: "Josué",
                    capituloInicio: 9,
                    capituloFim: 11,
                },
            ],
            novoTestamento: [],
            livros: ["Josué"],
            capitulos: [9, 10, 11],
            versiculos: [],
            observacoes: "historiaBiblica, aliançaComGibeão",
        }),
        criarDia(75, {
            antigoTestamento: [
                {
                    livroId: "josue",
                    livroNome: "Josué",
                    capituloInicio: 12,
                    capituloFim: 14,
                },
            ],
            novoTestamento: [],
            livros: ["Josué"],
            capitulos: [12, 13, 14],
            versiculos: [],
            observacoes: "historiaBiblica, herança",
        }),
        criarDia(76, {
            antigoTestamento: [
                {
                    livroId: "josue",
                    livroNome: "Josué",
                    capituloInicio: 15,
                    capituloFim: 17,
                },
            ],
            novoTestamento: [],
            livros: ["Josué"],
            capitulos: [15, 16, 17],
            versiculos: [],
            observacoes: "historiaBiblica, divisãoDaTerra",
        }),
        criarDia(77, {
            antigoTestamento: [
                {
                    livroId: "josue",
                    livroNome: "Josué",
                    capituloInicio: 18,
                    capituloFim: 21,
                },
            ],
            novoTestamento: [],
            livros: ["Josué"],
            capitulos: [18, 19, 20, 21],
            versiculos: [],
            observacoes: "historiaBiblica, refúgio, levitas",
        }),
        criarDia(78, {
            antigoTestamento: [
                {
                    livroId: "josue",
                    livroNome: "Josué",
                    capituloInicio: 22,
                    capituloFim: 24,
                },
            ],
            novoTestamento: [],
            livros: ["Josué"],
            capitulos: [22, 23, 24],
            versiculos: [],
            observacoes: "historiaBiblica, aliançaRenovada",
        }),
        criarDia(79, {
            antigoTestamento: [
                {
                    livroId: "juizes",
                    livroNome: "Juízes",
                    capituloInicio: 1,
                    capituloFim: 3,
                },
            ],
            novoTestamento: [],
            livros: ["Juízes"],
            capitulos: [1, 2, 3],
            versiculos: [],
            observacoes: "historiaBiblica, cicloDosJuízes",
        }),
        criarDia(80, {
            antigoTestamento: [
                {
                    livroId: "juizes",
                    livroNome: "Juízes",
                    capituloInicio: 4,
                    capituloFim: 6,
                },
            ],
            novoTestamento: [],
            livros: ["Juízes"],
            capitulos: [4, 5, 6],
            versiculos: [],
            observacoes: "historiaBiblica, Débora, Gideão",
        }),
        criarDia(81, {
            antigoTestamento: [
                {
                    livroId: "juizes",
                    livroNome: "Juízes",
                    capituloInicio: 7,
                    capituloFim: 9,
                },
            ],
            novoTestamento: [],
            livros: ["Juízes"],
            capitulos: [7, 8, 9],
            versiculos: [],
            observacoes: "historiaBiblica, Gideão",
        }),
        criarDia(82, {
            antigoTestamento: [
                {
                    livroId: "juizes",
                    livroNome: "Juízes",
                    capituloInicio: 10,
                    capituloFim: 12,
                },
            ],
            novoTestamento: [],
            livros: ["Juízes"],
            capitulos: [10, 11, 12],
            versiculos: [],
            observacoes: "historiaBiblica, Jephte",
        }),
        criarDia(83, {
            antigoTestamento: [
                {
                    livroId: "juizes",
                    livroNome: "Juízes",
                    capituloInicio: 13,
                    capituloFim: 16,
                },
            ],
            novoTestamento: [],
            livros: ["Juízes"],
            capitulos: [13, 14, 15, 16],
            versiculos: [],
            observacoes: "historiaBiblica, Sansão",
        }),
        criarDia(84, {
            antigoTestamento: [
                {
                    livroId: "juizes",
                    livroNome: "Juízes",
                    capituloInicio: 17,
                    capituloFim: 18,
                },
            ],
            novoTestamento: [],
            livros: ["Juízes"],
            capitulos: [17, 18],
            versiculos: [],
            observacoes: "historiaBiblica, idolatria",
        }),
        criarDia(85, {
            antigoTestamento: [
                {
                    livroId: "juizes",
                    livroNome: "Juízes",
                    capituloInicio: 19,
                    capituloFim: 21,
                },
            ],
            novoTestamento: [],
            livros: ["Juízes"],
            capitulos: [19, 20, 21],
            versiculos: [],
            observacoes: "historiaBiblica, decadência",
        }),
        criarDia(86, {
            antigoTestamento: [
                {
                    livroId: "rute",
                    livroNome: "Rute",
                    capituloInicio: 1,
                    capituloFim: 4,
                },
            ],
            novoTestamento: [],
            livros: ["Rute"],
            capitulos: [1, 2, 3, 4],
            versiculos: [],
            observacoes: "historiaBiblica, redenção",
        }),
        criarDia(87, {
            antigoTestamento: [
                {
                    livroId: "1samuel",
                    livroNome: "1 Samuel",
                    capituloInicio: 1,
                    capituloFim: 3,
                },
            ],
            novoTestamento: [],
            livros: ["1 Samuel"],
            capitulos: [1, 2, 3],
            versiculos: [],
            observacoes: "historiaBiblica, Samuel",
        }),
        criarDia(88, {
            antigoTestamento: [
                {
                    livroId: "1samuel",
                    livroNome: "1 Samuel",
                    capituloInicio: 4,
                    capituloFim: 7,
                },
            ],
            novoTestamento: [],
            livros: ["1 Samuel"],
            capitulos: [4, 5, 6, 7],
            versiculos: [],
            observacoes: "historiaBiblica, arcaDaAliança",
        }),
        criarDia(89, {
            antigoTestamento: [
                {
                    livroId: "1samuel",
                    livroNome: "1 Samuel",
                    capituloInicio: 8,
                    capituloFim: 10,
                },
            ],
            novoTestamento: [],
            livros: ["1 Samuel"],
            capitulos: [8, 9, 10],
            versiculos: [],
            observacoes: "historiaBiblica, monarquia",
        }),
        criarDia(90, {
            antigoTestamento: [
                {
                    livroId: "1samuel",
                    livroNome: "1 Samuel",
                    capituloInicio: 11,
                    capituloFim: 13,
                },
            ],
            novoTestamento: [],
            livros: ["1 Samuel"],
            capitulos: [11, 12, 13],
            versiculos: [],
            observacoes: "historiaBiblica, Saul",
        }),
        criarDia(91, {
            antigoTestamento: [
                {
                    livroId: "1samuel",
                    livroNome: "1 Samuel",
                    capituloInicio: 14,
                    capituloFim: 15,
                },
            ],
            novoTestamento: [],
            livros: ["1 Samuel"],
            capitulos: [14, 15],
            versiculos: [],
            observacoes: "historiaBiblica, desobediência",
        }),
        criarDia(92, {
            antigoTestamento: [
                {
                    livroId: "1samuel",
                    livroNome: "1 Samuel",
                    capituloInicio: 16,
                    capituloFim: 18,
                },
            ],
            novoTestamento: [],
            livros: ["1 Samuel"],
            capitulos: [16, 17, 18],
            versiculos: [],
            observacoes: "historiaBiblica, Davi",
        }),
        criarDia(93, {
            antigoTestamento: [
                {
                    livroId: "1samuel",
                    livroNome: "1 Samuel",
                    capituloInicio: 19,
                    capituloFim: 21,
                },
            ],
            novoTestamento: [],
            livros: ["1 Samuel"],
            capitulos: [19, 20, 21],
            versiculos: [],
            observacoes: "historiaBiblica, perseguição",
        }),
        criarDia(94, {
            antigoTestamento: [
                {
                    livroId: "1samuel",
                    livroNome: "1 Samuel",
                    capituloInicio: 22,
                    capituloFim: 24,
                },
            ],
            novoTestamento: [],
            livros: ["1 Samuel"],
            capitulos: [22, 23, 24],
            versiculos: [],
            observacoes: "historiaBiblica, fuga",
        }),
        criarDia(95, {
            antigoTestamento: [
                {
                    livroId: "1samuel",
                    livroNome: "1 Samuel",
                    capituloInicio: 25,
                    capituloFim: 27,
                },
            ],
            novoTestamento: [],
            livros: ["1 Samuel"],
            capitulos: [25, 26, 27],
            versiculos: [],
            observacoes: "historiaBiblica, provação",
        }),
        criarDia(96, {
            antigoTestamento: [
                {
                    livroId: "1samuel",
                    livroNome: "1 Samuel",
                    capituloInicio: 28,
                    capituloFim: 31,
                },
            ],
            novoTestamento: [],
            livros: ["1 Samuel"],
            capitulos: [28, 29, 30, 31],
            versiculos: [],
            observacoes: "historiaBiblica, quedaDeSaul",
        }),
        criarDia(97, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 18,
                    capituloFim: 18,
                },
                {
                    livroId: "2samuel",
                    livroNome: "2 Samuel",
                    capituloInicio: 1,
                    capituloFim: 1,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos", "2 Samuel"],
            capitulos: [18, 1],
            versiculos: [],
            observacoes: "salmos, lamento, Davi",
        }),
        criarDia(98, {
            antigoTestamento: [
                {
                    livroId: "2samuel",
                    livroNome: "2 Samuel",
                    capituloInicio: 2,
                    capituloFim: 5,
                },
            ],
            novoTestamento: [],
            livros: ["2 Samuel"],
            capitulos: [2, 3, 4, 5],
            versiculos: [],
            observacoes: "historiaBiblica, reinoUnificado",
        }),
        criarDia(99, {
            antigoTestamento: [
                {
                    livroId: "2samuel",
                    livroNome: "2 Samuel",
                    capituloInicio: 6,
                    capituloFim: 7,
                },
            ],
            novoTestamento: [],
            livros: ["2 Samuel"],
            capitulos: [6, 7],
            versiculos: [],
            observacoes: "historiaBiblica, aliançaDavídica",
        }),
        /* ======================================================================
           DIA 100
        ====================================================================== */
        criarDia(100, {
            antigoTestamento: [
                {
                    livroId: "2samuel",
                    livroNome: "2 Samuel",
                    capituloInicio: 8,
                    capituloFim: 10,
                },
            ],
            novoTestamento: [],
            livros: ["2 Samuel"],
            capitulos: [8, 9, 10],
            versiculos: [],
            observacoes: "historiaBiblica, expansão",
        }),
        criarDia(101, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 1,
                    capituloFim: 2,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 15,
                    capituloFim: 15,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 22,
                    capituloFim: 22,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos"],
            capitulos: [1, 2, 15, 22],
            versiculos: [],
            observacoes: "salmos, messianico",
        }),
        criarDia(102, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 3,
                    capituloFim: 4,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 12,
                    capituloFim: 13,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 28,
                    capituloFim: 28,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos"],
            capitulos: [3, 4, 12, 13, 28],
            versiculos: [],
            observacoes: "salmos, refúgio",
        }),
        criarDia(103, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 20,
                    capituloFim: 21,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 27,
                    capituloFim: 27,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos"],
            capitulos: [20, 21, 27],
            versiculos: [],
            observacoes: "salmos, confiança",
        }),
        criarDia(104, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 5,
                    capituloFim: 6,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 8,
                    capituloFim: 10,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos"],
            capitulos: [5, 6, 8, 9, 10],
            versiculos: [],
            observacoes: "salmos, adoração",
        }),
        criarDia(105, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 11,
                    capituloFim: 11,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 14,
                    capituloFim: 14,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 16,
                    capituloFim: 16,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos"],
            capitulos: [11, 14, 16],
            versiculos: [],
            observacoes: "salmos, justiça",
        }),
        criarDia(106, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 17,
                    capituloFim: 17,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 19,
                    capituloFim: 19,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 23,
                    capituloFim: 23,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos"],
            capitulos: [17, 19, 23],
            versiculos: [],
            observacoes: "salmos, pastor",
        }),
        criarDia(107, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 24,
                    capituloFim: 24,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 29,
                    capituloFim: 29,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 33,
                    capituloFim: 33,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos"],
            capitulos: [24, 29, 33],
            versiculos: [],
            observacoes: "salmos, reinadoDeDeus",
        }),
        criarDia(108, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 36,
                    capituloFim: 36,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 39,
                    capituloFim: 39,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 41,
                    capituloFim: 41,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos"],
            capitulos: [36, 39, 41],
            versiculos: [],
            observacoes: "salmos, dependência",
        }),
        criarDia(109, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 53,
                    capituloFim: 53,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 58,
                    capituloFim: 58,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 64,
                    capituloFim: 64,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos"],
            capitulos: [53, 58, 64],
            versiculos: [],
            observacoes: "salmos, justiçaDivina",
        }),
        criarDia(110, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 56,
                    capituloFim: 57,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 142,
                    capituloFim: 142,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos"],
            capitulos: [56, 57, 142],
            versiculos: [],
            observacoes: "salmos, refúgio",
        }),
        criarDia(111, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 52,
                    capituloFim: 52,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 54,
                    capituloFim: 54,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 60,
                    capituloFim: 60,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos"],
            capitulos: [52, 54, 60],
            versiculos: [],
            observacoes: "salmos, livramento",
        }),
        criarDia(112, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 63,
                    capituloFim: 63,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 65,
                    capituloFim: 66,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos"],
            capitulos: [63, 65, 66],
            versiculos: [],
            observacoes: "salmos, gratidão",
        }),
        criarDia(113, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 67,
                    capituloFim: 67,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 69,
                    capituloFim: 69,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos"],
            capitulos: [67, 69],
            versiculos: [],
            observacoes: "salmos, messianico",
        }),
        criarDia(114, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 70,
                    capituloFim: 71,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos"],
            capitulos: [70, 71],
            versiculos: [],
            observacoes: "salmos, oração",
        }),
        criarDia(115, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 86,
                    capituloFim: 86,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 101,
                    capituloFim: 101,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos"],
            capitulos: [86, 101],
            versiculos: [],
            observacoes: "salmos, governoJusto",
        }),
        criarDia(116, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 103,
                    capituloFim: 103,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 108,
                    capituloFim: 108,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos"],
            capitulos: [103, 108],
            versiculos: [],
            observacoes: "salmos, misericórdia",
        }),
        criarDia(117, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 110,
                    capituloFim: 110,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 122,
                    capituloFim: 122,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos"],
            capitulos: [110, 122],
            versiculos: [],
            observacoes: "salmos, messias, Jerusalém",
        }),
        criarDia(118, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 124,
                    capituloFim: 124,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 131,
                    capituloFim: 131,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 133,
                    capituloFim: 133,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos"],
            capitulos: [124, 131, 133],
            versiculos: [],
            observacoes: "salmos, comunhão",
        }),
        criarDia(119, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 138,
                    capituloFim: 139,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos"],
            capitulos: [138, 139],
            versiculos: [],
            observacoes: "salmos, onisciência",
        }),
        criarDia(120, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 141,
                    capituloFim: 141,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 143,
                    capituloFim: 144,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos"],
            capitulos: [141, 143, 144],
            versiculos: [],
            observacoes: "salmos, súplica",
        }),
        criarDia(121, {
            antigoTestamento: [
                {
                    livroId: "2samuel",
                    livroNome: "2 Samuel",
                    capituloInicio: 11,
                    capituloFim: 12,
                },
            ],
            novoTestamento: [],
            livros: ["2 Samuel"],
            capitulos: [11, 12],
            versiculos: [],
            observacoes: "historiaBiblica, pecadoEDisciplina",
        }),
        criarDia(122, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 51,
                    capituloFim: 51,
                },
                {
                    livroId: "2samuel",
                    livroNome: "2 Samuel",
                    capituloInicio: 13,
                    capituloFim: 13,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos", "2 Samuel"],
            capitulos: [51, 13],
            versiculos: [],
            observacoes: "salmos, arrependimento",
        }),
        criarDia(123, {
            antigoTestamento: [
                {
                    livroId: "2samuel",
                    livroNome: "2 Samuel",
                    capituloInicio: 14,
                    capituloFim: 15,
                },
            ],
            novoTestamento: [],
            livros: ["2 Samuel"],
            capitulos: [14, 15],
            versiculos: [],
            observacoes: "historiaBiblica, rebelião",
        }),
        criarDia(124, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 3,
                    capituloFim: 4,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 63,
                    capituloFim: 63,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos"],
            capitulos: [3, 4, 63],
            versiculos: [],
            observacoes: "salmos, fuga",
        }),
        criarDia(125, {
            antigoTestamento: [
                {
                    livroId: "2samuel",
                    livroNome: "2 Samuel",
                    capituloInicio: 16,
                    capituloFim: 18,
                },
            ],
            novoTestamento: [],
            livros: ["2 Samuel"],
            capitulos: [16, 17, 18],
            versiculos: [],
            observacoes: "historiaBiblica, Absalão",
        }),
        criarDia(126, {
            antigoTestamento: [
                {
                    livroId: "2samuel",
                    livroNome: "2 Samuel",
                    capituloInicio: 19,
                    capituloFim: 20,
                },
            ],
            novoTestamento: [],
            livros: ["2 Samuel"],
            capitulos: [19, 20],
            versiculos: [],
            observacoes: "historiaBiblica, restauração",
        }),
        criarDia(127, {
            antigoTestamento: [
                {
                    livroId: "2samuel",
                    livroNome: "2 Samuel",
                    capituloInicio: 21,
                    capituloFim: 23,
                },
            ],
            novoTestamento: [],
            livros: ["2 Samuel"],
            capitulos: [21, 22, 23],
            versiculos: [],
            observacoes: "historiaBiblica, últimasPalavras",
        }),
        criarDia(128, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 30,
                    capituloFim: 30,
                },
                {
                    livroId: "2samuel",
                    livroNome: "2 Samuel",
                    capituloInicio: 24,
                    capituloFim: 24,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos", "2 Samuel"],
            capitulos: [30, 24],
            versiculos: [],
            observacoes: "salmos, arrependimento",
        }),
        criarDia(129, {
            antigoTestamento: [
                {
                    livroId: "1reis",
                    livroNome: "1 Reis",
                    capituloInicio: 1,
                    capituloFim: 2,
                },
            ],
            novoTestamento: [],
            livros: ["1 Reis"],
            capitulos: [1, 2],
            versiculos: [],
            observacoes: "historiaBiblica, Salomão",
        }),
        criarDia(130, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 72,
                    capituloFim: 72,
                },
                {
                    livroId: "1reis",
                    livroNome: "1 Reis",
                    capituloInicio: 3,
                    capituloFim: 3,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos", "1 Reis"],
            capitulos: [72, 3],
            versiculos: [],
            observacoes: "salmos, sabedoria",
        }),
        criarDia(131, {
            antigoTestamento: [
                {
                    livroId: "1reis",
                    livroNome: "1 Reis",
                    capituloInicio: 4,
                    capituloFim: 6,
                },
            ],
            novoTestamento: [],
            livros: ["1 Reis"],
            capitulos: [4, 5, 6],
            versiculos: [],
            observacoes: "historiaBiblica, templo",
        }),
        criarDia(132, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 127,
                    capituloFim: 127,
                },
                {
                    livroId: "1reis",
                    livroNome: "1 Reis",
                    capituloInicio: 7,
                    capituloFim: 7,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos", "1 Reis"],
            capitulos: [127, 7],
            versiculos: [],
            observacoes: "salmos, prosperidade",
        }),
        criarDia(133, {
            antigoTestamento: [
                {
                    livroId: "1reis",
                    livroNome: "1 Reis",
                    capituloInicio: 8,
                    capituloFim: 8,
                },
            ],
            novoTestamento: [],
            livros: ["1 Reis"],
            capitulos: [8],
            versiculos: [],
            observacoes: "historiaBiblica, dedicaçãoDoTemplo",
        }),
        criarDia(134, {
            antigoTestamento: [
                {
                    livroId: "proverbios",
                    livroNome: "Provérbios",
                    capituloInicio: 1,
                    capituloFim: 3,
                },
            ],
            novoTestamento: [],
            livros: ["Provérbios"],
            capitulos: [1, 2, 3],
            versiculos: [],
            observacoes: "sabedoria, temorDoSenhor",
        }),
        criarDia(135, {
            antigoTestamento: [
                {
                    livroId: "proverbios",
                    livroNome: "Provérbios",
                    capituloInicio: 4,
                    capituloFim: 6,
                },
            ],
            novoTestamento: [],
            livros: ["Provérbios"],
            capitulos: [4, 5, 6],
            versiculos: [],
            observacoes: "sabedoria, disciplina",
        }),
        criarDia(136, {
            antigoTestamento: [
                {
                    livroId: "proverbios",
                    livroNome: "Provérbios",
                    capituloInicio: 7,
                    capituloFim: 9,
                },
            ],
            novoTestamento: [],
            livros: ["Provérbios"],
            capitulos: [7, 8, 9],
            versiculos: [],
            observacoes: "sabedoria, escolhas",
        }),
        criarDia(137, {
            antigoTestamento: [
                {
                    livroId: "proverbios",
                    livroNome: "Provérbios",
                    capituloInicio: 10,
                    capituloFim: 12,
                },
            ],
            novoTestamento: [],
            livros: ["Provérbios"],
            capitulos: [10, 11, 12],
            versiculos: [],
            observacoes: "sabedoria, vidaPrática",
        }),
        criarDia(138, {
            antigoTestamento: [
                {
                    livroId: "proverbios",
                    livroNome: "Provérbios",
                    capituloInicio: 13,
                    capituloFim: 15,
                },
            ],
            novoTestamento: [],
            livros: ["Provérbios"],
            capitulos: [13, 14, 15],
            versiculos: [],
            observacoes: "sabedoria, ética",
        }),
        criarDia(139, {
            antigoTestamento: [
                {
                    livroId: "proverbios",
                    livroNome: "Provérbios",
                    capituloInicio: 16,
                    capituloFim: 18,
                },
            ],
            novoTestamento: [],
            livros: ["Provérbios"],
            capitulos: [16, 17, 18],
            versiculos: [],
            observacoes: "sabedoria, governo",
        }),
        criarDia(140, {
            antigoTestamento: [
                {
                    livroId: "proverbios",
                    livroNome: "Provérbios",
                    capituloInicio: 19,
                    capituloFim: 21,
                },
            ],
            novoTestamento: [],
            livros: ["Provérbios"],
            capitulos: [19, 20, 21],
            versiculos: [],
            observacoes: "sabedoria, justiça",
        }),
        criarDia(141, {
            antigoTestamento: [
                {
                    livroId: "proverbios",
                    livroNome: "Provérbios",
                    capituloInicio: 22,
                    capituloFim: 24,
                },
            ],
            novoTestamento: [],
            livros: ["Provérbios"],
            capitulos: [22, 23, 24],
            versiculos: [],
            observacoes: "sabedoria, justiçaSocial",
        }),
        criarDia(142, {
            antigoTestamento: [
                {
                    livroId: "proverbios",
                    livroNome: "Provérbios",
                    capituloInicio: 25,
                    capituloFim: 27,
                },
            ],
            novoTestamento: [],
            livros: ["Provérbios"],
            capitulos: [25, 26, 27],
            versiculos: [],
            observacoes: "sabedoria, liderança",
        }),
        criarDia(143, {
            antigoTestamento: [
                {
                    livroId: "proverbios",
                    livroNome: "Provérbios",
                    capituloInicio: 28,
                    capituloFim: 29,
                },
            ],
            novoTestamento: [],
            livros: ["Provérbios"],
            capitulos: [28, 29],
            versiculos: [],
            observacoes: "sabedoria, governoJusto",
        }),
        criarDia(144, {
            antigoTestamento: [
                {
                    livroId: "proverbios",
                    livroNome: "Provérbios",
                    capituloInicio: 30,
                    capituloFim: 31,
                },
            ],
            novoTestamento: [],
            livros: ["Provérbios"],
            capitulos: [30, 31],
            versiculos: [],
            observacoes: "sabedoria, vidaVirtuosa",
        }),
        criarDia(145, {
            antigoTestamento: [
                {
                    livroId: "eclesiastes",
                    livroNome: "Eclesiastes",
                    capituloInicio: 1,
                    capituloFim: 4,
                },
            ],
            novoTestamento: [],
            livros: ["Eclesiastes"],
            capitulos: [1, 2, 3, 4],
            versiculos: [],
            observacoes: "sabedoria, vaidade",
        }),
        criarDia(146, {
            antigoTestamento: [
                {
                    livroId: "eclesiastes",
                    livroNome: "Eclesiastes",
                    capituloInicio: 5,
                    capituloFim: 8,
                },
            ],
            novoTestamento: [],
            livros: ["Eclesiastes"],
            capitulos: [5, 6, 7, 8],
            versiculos: [],
            observacoes: "sabedoria, tempo",
        }),
        criarDia(147, {
            antigoTestamento: [
                {
                    livroId: "eclesiastes",
                    livroNome: "Eclesiastes",
                    capituloInicio: 9,
                    capituloFim: 12,
                },
            ],
            novoTestamento: [],
            livros: ["Eclesiastes"],
            capitulos: [9, 10, 11, 12],
            versiculos: [],
            observacoes: "sabedoria, sentidoDaVida",
        }),
        criarDia(148, {
            antigoTestamento: [
                {
                    livroId: "cantares",
                    livroNome: "Cantares",
                    capituloInicio: 1,
                    capituloFim: 4,
                },
            ],
            novoTestamento: [],
            livros: ["Cantares"],
            capitulos: [1, 2, 3, 4],
            versiculos: [],
            observacoes: "poesia, amorAliança",
        }),
        criarDia(149, {
            antigoTestamento: [
                {
                    livroId: "cantares",
                    livroNome: "Cantares",
                    capituloInicio: 5,
                    capituloFim: 8,
                },
            ],
            novoTestamento: [],
            livros: ["Cantares"],
            capitulos: [5, 6, 7, 8],
            versiculos: [],
            observacoes: "poesia, amorFiel",
        }),
        /* ======================================================================
           DIA 150
        ====================================================================== */
        criarDia(150, {
            antigoTestamento: [
                {
                    livroId: "1reis",
                    livroNome: "1 Reis",
                    capituloInicio: 9,
                    capituloFim: 11,
                },
            ],
            novoTestamento: [],
            livros: ["1 Reis"],
            capitulos: [9, 10, 11],
            versiculos: [],
            observacoes: "historiaBiblica, quedaDeSalomão",
        }),
        criarDia(151, {
            antigoTestamento: [
                {
                    livroId: "proverbios",
                    livroNome: "Provérbios",
                    capituloInicio: 1,
                    capituloFim: 1,
                },
                {
                    livroId: "2cronicas",
                    livroNome: "2 Crônicas",
                    capituloInicio: 1,
                    capituloFim: 1,
                },
            ],
            novoTestamento: [],
            livros: ["Provérbios", "2 Crônicas"],
            capitulos: [1, 1],
            versiculos: [],
            observacoes: "sabedoria, oração",
        }),
        criarDia(152, {
            antigoTestamento: [
                {
                    livroId: "1reis",
                    livroNome: "1 Reis",
                    capituloInicio: 12,
                    capituloFim: 14,
                },
            ],
            novoTestamento: [],
            livros: ["1 Reis"],
            capitulos: [12, 13, 14],
            versiculos: [],
            observacoes: "historiaBiblica, reinoDividido",
        }),
        criarDia(153, {
            antigoTestamento: [
                {
                    livroId: "2cronicas",
                    livroNome: "2 Crônicas",
                    capituloInicio: 10,
                    capituloFim: 12,
                },
            ],
            novoTestamento: [],
            livros: ["2 Crônicas"],
            capitulos: [10, 11, 12],
            versiculos: [],
            observacoes: "historiaBiblica, Roboão",
        }),
        criarDia(154, {
            antigoTestamento: [
                {
                    livroId: "1reis",
                    livroNome: "1 Reis",
                    capituloInicio: 15,
                    capituloFim: 15,
                },
                {
                    livroId: "2cronicas",
                    livroNome: "2 Crônicas",
                    capituloInicio: 13,
                    capituloFim: 14,
                },
            ],
            novoTestamento: [],
            livros: ["1 Reis", "2 Crônicas"],
            capitulos: [15, 13, 14],
            versiculos: [],
            observacoes: "historiaBiblica, Asa",
        }),
        criarDia(155, {
            antigoTestamento: [
                {
                    livroId: "2cronicas",
                    livroNome: "2 Crônicas",
                    capituloInicio: 15,
                    capituloFim: 16,
                },
            ],
            novoTestamento: [],
            livros: ["2 Crônicas"],
            capitulos: [15, 16],
            versiculos: [],
            observacoes: "historiaBiblica, reforma",
        }),
        criarDia(156, {
            antigoTestamento: [
                {
                    livroId: "1reis",
                    livroNome: "1 Reis",
                    capituloInicio: 16,
                    capituloFim: 18,
                },
            ],
            novoTestamento: [],
            livros: ["1 Reis"],
            capitulos: [16, 17, 18],
            versiculos: [],
            observacoes: "profetas, Elias",
        }),
        criarDia(157, {
            antigoTestamento: [
                {
                    livroId: "1reis",
                    livroNome: "1 Reis",
                    capituloInicio: 19,
                    capituloFim: 22,
                },
            ],
            novoTestamento: [],
            livros: ["1 Reis"],
            capitulos: [19, 20, 21, 22],
            versiculos: [],
            observacoes: "profetas, Elias, quedaDeAcabe",
        }),
        criarDia(158, {
            antigoTestamento: [
                {
                    livroId: "2reis",
                    livroNome: "2 Reis",
                    capituloInicio: 1,
                    capituloFim: 3,
                },
            ],
            novoTestamento: [],
            livros: ["2 Reis"],
            capitulos: [1, 2, 3],
            versiculos: [],
            observacoes: "profetas, Eliseu",
        }),
        criarDia(159, {
            antigoTestamento: [
                {
                    livroId: "2reis",
                    livroNome: "2 Reis",
                    capituloInicio: 4,
                    capituloFim: 6,
                },
            ],
            novoTestamento: [],
            livros: ["2 Reis"],
            capitulos: [4, 5, 6],
            versiculos: [],
            observacoes: "profetas, milagres",
        }),
        criarDia(160, {
            antigoTestamento: [
                {
                    livroId: "2reis",
                    livroNome: "2 Reis",
                    capituloInicio: 7,
                    capituloFim: 9,
                },
            ],
            novoTestamento: [],
            livros: ["2 Reis"],
            capitulos: [7, 8, 9],
            versiculos: [],
            observacoes: "profetas, juízo",
        }),
        criarDia(161, {
            antigoTestamento: [
                {
                    livroId: "2reis",
                    livroNome: "2 Reis",
                    capituloInicio: 10,
                    capituloFim: 12,
                },
            ],
            novoTestamento: [],
            livros: ["2 Reis"],
            capitulos: [10, 11, 12],
            versiculos: [],
            observacoes: "historiaBiblica, Jeú",
        }),
        criarDia(162, {
            antigoTestamento: [
                {
                    livroId: "joel",
                    livroNome: "Joel",
                    capituloInicio: 1,
                    capituloFim: 3,
                },
            ],
            novoTestamento: [],
            livros: ["Joel"],
            capitulos: [1, 2, 3],
            versiculos: [],
            observacoes: "profetasMenores, diaDoSenhor",
        }),
        criarDia(163, {
            antigoTestamento: [
                {
                    livroId: "jonas",
                    livroNome: "Jonas",
                    capituloInicio: 1,
                    capituloFim: 4,
                },
            ],
            novoTestamento: [],
            livros: ["Jonas"],
            capitulos: [1, 2, 3, 4],
            versiculos: [],
            observacoes: "profetasMenores, misericórdia",
        }),
        criarDia(164, {
            antigoTestamento: [
                {
                    livroId: "amos",
                    livroNome: "Amós",
                    capituloInicio: 1,
                    capituloFim: 3,
                },
            ],
            novoTestamento: [],
            livros: ["Amós"],
            capitulos: [1, 2, 3],
            versiculos: [],
            observacoes: "profetasMenores, justiçaSocial",
        }),
        criarDia(165, {
            antigoTestamento: [
                {
                    livroId: "amos",
                    livroNome: "Amós",
                    capituloInicio: 4,
                    capituloFim: 6,
                },
            ],
            novoTestamento: [],
            livros: ["Amós"],
            capitulos: [4, 5, 6],
            versiculos: [],
            observacoes: "profetasMenores, juízo",
        }),
        criarDia(166, {
            antigoTestamento: [
                {
                    livroId: "amos",
                    livroNome: "Amós",
                    capituloInicio: 7,
                    capituloFim: 9,
                },
            ],
            novoTestamento: [],
            livros: ["Amós"],
            capitulos: [7, 8, 9],
            versiculos: [],
            observacoes: "profetasMenores, restauração",
        }),
        criarDia(167, {
            antigoTestamento: [
                {
                    livroId: "oseias",
                    livroNome: "Oséias",
                    capituloInicio: 1,
                    capituloFim: 3,
                },
            ],
            novoTestamento: [],
            livros: ["Oséias"],
            capitulos: [1, 2, 3],
            versiculos: [],
            observacoes: "profetasMenores, amorRedentor",
        }),
        criarDia(168, {
            antigoTestamento: [
                {
                    livroId: "oseias",
                    livroNome: "Oséias",
                    capituloInicio: 4,
                    capituloFim: 6,
                },
            ],
            novoTestamento: [],
            livros: ["Oséias"],
            capitulos: [4, 5, 6],
            versiculos: [],
            observacoes: "profetasMenores, infidelidade",
        }),
        criarDia(169, {
            antigoTestamento: [
                {
                    livroId: "oseias",
                    livroNome: "Oséias",
                    capituloInicio: 7,
                    capituloFim: 10,
                },
            ],
            novoTestamento: [],
            livros: ["Oséias"],
            capitulos: [7, 8, 9, 10],
            versiculos: [],
            observacoes: "profetasMenores, arrependimento",
        }),
        criarDia(170, {
            antigoTestamento: [
                {
                    livroId: "oseias",
                    livroNome: "Oséias",
                    capituloInicio: 11,
                    capituloFim: 14,
                },
            ],
            novoTestamento: [],
            livros: ["Oséias"],
            capitulos: [11, 12, 13, 14],
            versiculos: [],
            observacoes: "profetasMenores, restauração",
        }),
        criarDia(171, {
            antigoTestamento: [
                {
                    livroId: "isaias",
                    livroNome: "Isaías",
                    capituloInicio: 1,
                    capituloFim: 4,
                },
            ],
            novoTestamento: [],
            livros: ["Isaías"],
            capitulos: [1, 2, 3, 4],
            versiculos: [],
            observacoes: "profetasMaiores, santidade",
        }),
        criarDia(172, {
            antigoTestamento: [
                {
                    livroId: "isaias",
                    livroNome: "Isaías",
                    capituloInicio: 5,
                    capituloFim: 8,
                },
            ],
            novoTestamento: [],
            livros: ["Isaías"],
            capitulos: [5, 6, 7, 8],
            versiculos: [],
            observacoes: "profetasMaiores, chamado",
        }),
        criarDia(173, {
            antigoTestamento: [
                {
                    livroId: "isaias",
                    livroNome: "Isaías",
                    capituloInicio: 9,
                    capituloFim: 12,
                },
            ],
            novoTestamento: [],
            livros: ["Isaías"],
            capitulos: [9, 10, 11, 12],
            versiculos: [],
            observacoes: "profetasMaiores, messias",
        }),
        criarDia(174, {
            antigoTestamento: [
                {
                    livroId: "isaias",
                    livroNome: "Isaías",
                    capituloInicio: 13,
                    capituloFim: 17,
                },
            ],
            novoTestamento: [],
            livros: ["Isaías"],
            capitulos: [13, 14, 15, 16, 17],
            versiculos: [],
            observacoes: "profetasMaiores, juízoDasNações",
        }),
        criarDia(175, {
            antigoTestamento: [
                {
                    livroId: "isaias",
                    livroNome: "Isaías",
                    capituloInicio: 18,
                    capituloFim: 22,
                },
            ],
            novoTestamento: [],
            livros: ["Isaías"],
            capitulos: [18, 19, 20, 21, 22],
            versiculos: [],
            observacoes: "profetasMaiores, confiança",
        }),
        criarDia(176, {
            antigoTestamento: [
                {
                    livroId: "isaias",
                    livroNome: "Isaías",
                    capituloInicio: 23,
                    capituloFim: 27,
                },
            ],
            novoTestamento: [],
            livros: ["Isaías"],
            capitulos: [23, 24, 25, 26, 27],
            versiculos: [],
            observacoes: "profetasMaiores, redenção",
        }),
        criarDia(177, {
            antigoTestamento: [
                {
                    livroId: "isaias",
                    livroNome: "Isaías",
                    capituloInicio: 28,
                    capituloFim: 30,
                },
            ],
            novoTestamento: [],
            livros: ["Isaías"],
            capitulos: [28, 29, 30],
            versiculos: [],
            observacoes: "profetasMaiores, arrependimento",
        }),
        criarDia(178, {
            antigoTestamento: [
                {
                    livroId: "isaias",
                    livroNome: "Isaías",
                    capituloInicio: 31,
                    capituloFim: 33,
                },
            ],
            novoTestamento: [],
            livros: ["Isaías"],
            capitulos: [31, 32, 33],
            versiculos: [],
            observacoes: "profetasMaiores, salvação",
        }),
        criarDia(179, {
            antigoTestamento: [
                {
                    livroId: "isaias",
                    livroNome: "Isaías",
                    capituloInicio: 34,
                    capituloFim: 36,
                },
            ],
            novoTestamento: [],
            livros: ["Isaías"],
            capitulos: [34, 35, 36],
            versiculos: [],
            observacoes: "profetasMaiores, juízoESocorro",
        }),
        criarDia(180, {
            antigoTestamento: [
                {
                    livroId: "isaias",
                    livroNome: "Isaías",
                    capituloInicio: 37,
                    capituloFim: 39,
                },
            ],
            novoTestamento: [],
            livros: ["Isaías"],
            capitulos: [37, 38, 39],
            versiculos: [],
            observacoes: "profetasMaiores, Ezequias",
        }),
        criarDia(181, {
            antigoTestamento: [
                {
                    livroId: "isaias",
                    livroNome: "Isaías",
                    capituloInicio: 40,
                    capituloFim: 43,
                },
            ],
            novoTestamento: [],
            livros: ["Isaías"],
            capitulos: [40, 41, 42, 43],
            versiculos: [],
            observacoes: "profetasMaiores, consolo",
        }),
        criarDia(182, {
            antigoTestamento: [
                {
                    livroId: "isaias",
                    livroNome: "Isaías",
                    capituloInicio: 44,
                    capituloFim: 48,
                },
            ],
            novoTestamento: [],
            livros: ["Isaías"],
            capitulos: [44, 45, 46, 47, 48],
            versiculos: [],
            observacoes: "profetasMaiores, unicidadeDeDeus",
        }),
        criarDia(183, {
            antigoTestamento: [
                {
                    livroId: "isaias",
                    livroNome: "Isaías",
                    capituloInicio: 49,
                    capituloFim: 53,
                },
            ],
            novoTestamento: [],
            livros: ["Isaías"],
            capitulos: [49, 50, 51, 52, 53],
            versiculos: [],
            observacoes: "profetasMaiores, servoSofredor",
        }),
        criarDia(184, {
            antigoTestamento: [
                {
                    livroId: "isaias",
                    livroNome: "Isaías",
                    capituloInicio: 54,
                    capituloFim: 58,
                },
            ],
            novoTestamento: [],
            livros: ["Isaías"],
            capitulos: [54, 55, 56, 57, 58],
            versiculos: [],
            observacoes: "profetasMaiores, aliançaEterna",
        }),
        criarDia(185, {
            antigoTestamento: [
                {
                    livroId: "isaias",
                    livroNome: "Isaías",
                    capituloInicio: 59,
                    capituloFim: 63,
                },
            ],
            novoTestamento: [],
            livros: ["Isaías"],
            capitulos: [59, 60, 61, 62, 63],
            versiculos: [],
            observacoes: "profetasMaiores, redençãoFinal",
        }),
        criarDia(186, {
            antigoTestamento: [
                {
                    livroId: "isaias",
                    livroNome: "Isaías",
                    capituloInicio: 64,
                    capituloFim: 66,
                },
            ],
            novoTestamento: [],
            livros: ["Isaías"],
            capitulos: [64, 65, 66],
            versiculos: [],
            observacoes: "profetasMaiores, novoCéuETerra",
        }),
        criarDia(187, {
            antigoTestamento: [
                {
                    livroId: "miqueias",
                    livroNome: "Miqueias",
                    capituloInicio: 1,
                    capituloFim: 4,
                },
            ],
            novoTestamento: [],
            livros: ["Miqueias"],
            capitulos: [1, 2, 3, 4],
            versiculos: [],
            observacoes: "profetasMenores, justiçaEMessias",
        }),
        criarDia(188, {
            antigoTestamento: [
                {
                    livroId: "miqueias",
                    livroNome: "Miqueias",
                    capituloInicio: 5,
                    capituloFim: 7,
                },
            ],
            novoTestamento: [],
            livros: ["Miqueias"],
            capitulos: [5, 6, 7],
            versiculos: [],
            observacoes: "profetasMenores, esperança",
        }),
        criarDia(189, {
            antigoTestamento: [
                {
                    livroId: "2reis",
                    livroNome: "2 Reis",
                    capituloInicio: 13,
                    capituloFim: 15,
                },
            ],
            novoTestamento: [],
            livros: ["2 Reis"],
            capitulos: [13, 14, 15],
            versiculos: [],
            observacoes: "historiaBiblica, decadência",
        }),
        criarDia(190, {
            antigoTestamento: [
                {
                    livroId: "2cronicas",
                    livroNome: "2 Crônicas",
                    capituloInicio: 26,
                    capituloFim: 28,
                },
            ],
            novoTestamento: [],
            livros: ["2 Crônicas"],
            capitulos: [26, 27, 28],
            versiculos: [],
            observacoes: "historiaBiblica, UziasEAcás",
        }),
        criarDia(191, {
            antigoTestamento: [
                {
                    livroId: "isaias",
                    livroNome: "Isaías",
                    capituloInicio: 1,
                    capituloFim: 1,
                },
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 6,
                    capituloFim: 6,
                },
            ],
            novoTestamento: [],
            livros: ["Isaías", "Salmos"],
            capitulos: [1, 6],
            versiculos: [],
            observacoes: "profetasMaiores, visãoDoTrono",
        }),
        criarDia(192, {
            antigoTestamento: [
                {
                    livroId: "2cronicas",
                    livroNome: "2 Crônicas",
                    capituloInicio: 29,
                    capituloFim: 31,
                },
            ],
            novoTestamento: [],
            livros: ["2 Crônicas"],
            capitulos: [29, 30, 31],
            versiculos: [],
            observacoes: "historiaBiblica, reformaDeEzequias",
        }),
        criarDia(193, {
            antigoTestamento: [
                {
                    livroId: "proverbios",
                    livroNome: "Provérbios",
                    capituloInicio: 25,
                    capituloFim: 26,
                },
            ],
            novoTestamento: [],
            livros: ["Provérbios"],
            capitulos: [25, 26],
            versiculos: [],
            observacoes: "sabedoria, vidaPrática",
        }),
        criarDia(194, {
            antigoTestamento: [
                {
                    livroId: "2reis",
                    livroNome: "2 Reis",
                    capituloInicio: 16,
                    capituloFim: 17,
                },
            ],
            novoTestamento: [],
            livros: ["2 Reis"],
            capitulos: [16, 17],
            versiculos: [],
            observacoes: "historiaBiblica, quedaDeIsrael",
        }),
        criarDia(195, {
            antigoTestamento: [
                {
                    livroId: "naum",
                    livroNome: "Naum",
                    capituloInicio: 1,
                    capituloFim: 3,
                },
            ],
            novoTestamento: [],
            livros: ["Naum"],
            capitulos: [1, 2, 3],
            versiculos: [],
            observacoes: "profetasMenores, quedaDeNínive",
        }),
        criarDia(196, {
            antigoTestamento: [
                {
                    livroId: "sofonias",
                    livroNome: "Sofonias",
                    capituloInicio: 1,
                    capituloFim: 3,
                },
            ],
            novoTestamento: [],
            livros: ["Sofonias"],
            capitulos: [1, 2, 3],
            versiculos: [],
            observacoes: "profetasMenores, diaDoSenhor",
        }),
        criarDia(197, {
            antigoTestamento: [
                {
                    livroId: "habacuque",
                    livroNome: "Habacuque",
                    capituloInicio: 1,
                    capituloFim: 3,
                },
            ],
            novoTestamento: [],
            livros: ["Habacuque"],
            capitulos: [1, 2, 3],
            versiculos: [],
            observacoes: "profetasMenores, fé",
        }),
        criarDia(198, {
            antigoTestamento: [
                {
                    livroId: "jeremias",
                    livroNome: "Jeremias",
                    capituloInicio: 1,
                    capituloFim: 3,
                },
            ],
            novoTestamento: [],
            livros: ["Jeremias"],
            capitulos: [1, 2, 3],
            versiculos: [],
            observacoes: "profetasMaiores, chamado",
        }),
        criarDia(199, {
            antigoTestamento: [
                {
                    livroId: "jeremias",
                    livroNome: "Jeremias",
                    capituloInicio: 4,
                    capituloFim: 6,
                },
            ],
            novoTestamento: [],
            livros: ["Jeremias"],
            capitulos: [4, 5, 6],
            versiculos: [],
            observacoes: "profetasMaiores, arrependimento",
        }),
        /* ======================================================================
           DIA 200
        ====================================================================== */
        criarDia(200, {
            antigoTestamento: [
                {
                    livroId: "jeremias",
                    livroNome: "Jeremias",
                    capituloInicio: 7,
                    capituloFim: 9,
                },
            ],
            novoTestamento: [],
            livros: ["Jeremias"],
            capitulos: [7, 8, 9],
            versiculos: [],
            observacoes: "profetasMaiores, templo",
        }),
        criarDia(201, {
            antigoTestamento: [
                {
                    livroId: "jeremias",
                    livroNome: "Jeremias",
                    capituloInicio: 10,
                    capituloFim: 13,
                },
            ],
            novoTestamento: [],
            livros: ["Jeremias"],
            capitulos: [10, 11, 12, 13],
            versiculos: [],
            observacoes: "profetasMaiores, idolatria",
        }),
        criarDia(202, {
            antigoTestamento: [
                {
                    livroId: "jeremias",
                    livroNome: "Jeremias",
                    capituloInicio: 14,
                    capituloFim: 17,
                },
            ],
            novoTestamento: [],
            livros: ["Jeremias"],
            capitulos: [14, 15, 16, 17],
            versiculos: [],
            observacoes: "profetasMaiores, oração",
        }),
        criarDia(203, {
            antigoTestamento: [
                {
                    livroId: "jeremias",
                    livroNome: "Jeremias",
                    capituloInicio: 18,
                    capituloFim: 22,
                },
            ],
            novoTestamento: [],
            livros: ["Jeremias"],
            capitulos: [18, 19, 20, 21, 22],
            versiculos: [],
            observacoes: "profetasMaiores, vasoDoOleiro",
        }),
        criarDia(204, {
            antigoTestamento: [
                {
                    livroId: "jeremias",
                    livroNome: "Jeremias",
                    capituloInicio: 23,
                    capituloFim: 25,
                },
            ],
            novoTestamento: [],
            livros: ["Jeremias"],
            capitulos: [23, 24, 25],
            versiculos: [],
            observacoes: "profetasMaiores, falsosProfetas",
        }),
        criarDia(205, {
            antigoTestamento: [
                {
                    livroId: "jeremias",
                    livroNome: "Jeremias",
                    capituloInicio: 26,
                    capituloFim: 29,
                },
            ],
            novoTestamento: [],
            livros: ["Jeremias"],
            capitulos: [26, 27, 28, 29],
            versiculos: [],
            observacoes: "profetasMaiores, exílio",
        }),
        criarDia(206, {
            antigoTestamento: [
                {
                    livroId: "jeremias",
                    livroNome: "Jeremias",
                    capituloInicio: 30,
                    capituloFim: 33,
                },
            ],
            novoTestamento: [],
            livros: ["Jeremias"],
            capitulos: [30, 31, 32, 33],
            versiculos: [],
            observacoes: "profetasMaiores, novaAliança",
        }),
        criarDia(207, {
            antigoTestamento: [
                {
                    livroId: "jeremias",
                    livroNome: "Jeremias",
                    capituloInicio: 34,
                    capituloFim: 36,
                },
            ],
            novoTestamento: [],
            livros: ["Jeremias"],
            capitulos: [34, 35, 36],
            versiculos: [],
            observacoes: "profetasMaiores, perseguição",
        }),
        criarDia(208, {
            antigoTestamento: [
                {
                    livroId: "jeremias",
                    livroNome: "Jeremias",
                    capituloInicio: 37,
                    capituloFim: 39,
                },
            ],
            novoTestamento: [],
            livros: ["Jeremias"],
            capitulos: [37, 38, 39],
            versiculos: [],
            observacoes: "profetasMaiores, quedaDeJerusalém",
        }),
        criarDia(209, {
            antigoTestamento: [
                {
                    livroId: "jeremias",
                    livroNome: "Jeremias",
                    capituloInicio: 40,
                    capituloFim: 43,
                },
            ],
            novoTestamento: [],
            livros: ["Jeremias"],
            capitulos: [40, 41, 42, 43],
            versiculos: [],
            observacoes: "profetasMaiores, remanescente",
        }),
        criarDia(210, {
            antigoTestamento: [
                {
                    livroId: "jeremias",
                    livroNome: "Jeremias",
                    capituloInicio: 44,
                    capituloFim: 47,
                },
            ],
            novoTestamento: [],
            livros: ["Jeremias"],
            capitulos: [44, 45, 46, 47],
            versiculos: [],
            observacoes: "profetasMaiores, juízoDasNações",
        }),
        criarDia(211, {
            antigoTestamento: [
                {
                    livroId: "jeremias",
                    livroNome: "Jeremias",
                    capituloInicio: 48,
                    capituloFim: 50,
                },
            ],
            novoTestamento: [],
            livros: ["Jeremias"],
            capitulos: [48, 49, 50],
            versiculos: [],
            observacoes: "profetasMaiores, quedaDaBabilônia",
        }),
        criarDia(212, {
            antigoTestamento: [
                {
                    livroId: "jeremias",
                    livroNome: "Jeremias",
                    capituloInicio: 51,
                    capituloFim: 52,
                },
            ],
            novoTestamento: [],
            livros: ["Jeremias"],
            capitulos: [51, 52],
            versiculos: [],
            observacoes: "profetasMaiores, fimDeJerusalém",
        }),
        criarDia(213, {
            antigoTestamento: [
                {
                    livroId: "lamentacoes",
                    livroNome: "Lamentações",
                    capituloInicio: 1,
                    capituloFim: 2,
                },
            ],
            novoTestamento: [],
            livros: ["Lamentações"],
            capitulos: [1, 2],
            versiculos: [],
            observacoes: "poesia, lamento",
        }),
        criarDia(214, {
            antigoTestamento: [
                {
                    livroId: "lamentacoes",
                    livroNome: "Lamentações",
                    capituloInicio: 3,
                    capituloFim: 5,
                },
            ],
            novoTestamento: [],
            livros: ["Lamentações"],
            capitulos: [3, 4, 5],
            versiculos: [],
            observacoes: "poesia, esperança",
        }),
        criarDia(215, {
            antigoTestamento: [
                {
                    livroId: "obadias",
                    livroNome: "Obadias",
                    capituloInicio: 1,
                    capituloFim: 1,
                },
            ],
            novoTestamento: [],
            livros: ["Obadias"],
            capitulos: [1],
            versiculos: [],
            observacoes: "profetasMenores, juízo",
        }),
        criarDia(216, {
            antigoTestamento: [
                {
                    livroId: "ezequiel",
                    livroNome: "Ezequiel",
                    capituloInicio: 1,
                    capituloFim: 4,
                },
            ],
            novoTestamento: [],
            livros: ["Ezequiel"],
            capitulos: [1, 2, 3, 4],
            versiculos: [],
            observacoes: "profetasMaiores, glóriaDeDeus",
        }),
        criarDia(217, {
            antigoTestamento: [
                {
                    livroId: "ezequiel",
                    livroNome: "Ezequiel",
                    capituloInicio: 5,
                    capituloFim: 8,
                },
            ],
            novoTestamento: [],
            livros: ["Ezequiel"],
            capitulos: [5, 6, 7, 8],
            versiculos: [],
            observacoes: "profetasMaiores, idolatria",
        }),
        criarDia(218, {
            antigoTestamento: [
                {
                    livroId: "ezequiel",
                    livroNome: "Ezequiel",
                    capituloInicio: 9,
                    capituloFim: 12,
                },
            ],
            novoTestamento: [],
            livros: ["Ezequiel"],
            capitulos: [9, 10, 11, 12],
            versiculos: [],
            observacoes: "profetasMaiores, juízo",
        }),
        criarDia(219, {
            antigoTestamento: [
                {
                    livroId: "ezequiel",
                    livroNome: "Ezequiel",
                    capituloInicio: 13,
                    capituloFim: 15,
                },
            ],
            novoTestamento: [],
            livros: ["Ezequiel"],
            capitulos: [13, 14, 15],
            versiculos: [],
            observacoes: "profetasMaiores, falsosProfetas",
        }),
        criarDia(220, {
            antigoTestamento: [
                {
                    livroId: "ezequiel",
                    livroNome: "Ezequiel",
                    capituloInicio: 16,
                    capituloFim: 17,
                },
            ],
            novoTestamento: [],
            livros: ["Ezequiel"],
            capitulos: [16, 17],
            versiculos: [],
            observacoes: "profetasMaiores, aliança",
        }),
        criarDia(221, {
            antigoTestamento: [
                {
                    livroId: "ezequiel",
                    livroNome: "Ezequiel",
                    capituloInicio: 18,
                    capituloFim: 20,
                },
            ],
            novoTestamento: [],
            livros: ["Ezequiel"],
            capitulos: [18, 19, 20],
            versiculos: [],
            observacoes: "profetasMaiores, responsabilidade",
        }),
        criarDia(222, {
            antigoTestamento: [
                {
                    livroId: "ezequiel",
                    livroNome: "Ezequiel",
                    capituloInicio: 21,
                    capituloFim: 23,
                },
            ],
            novoTestamento: [],
            livros: ["Ezequiel"],
            capitulos: [21, 22, 23],
            versiculos: [],
            observacoes: "profetasMaiores, idolatria",
        }),
        criarDia(223, {
            antigoTestamento: [
                {
                    livroId: "ezequiel",
                    livroNome: "Ezequiel",
                    capituloInicio: 24,
                    capituloFim: 27,
                },
            ],
            novoTestamento: [],
            livros: ["Ezequiel"],
            capitulos: [24, 25, 26, 27],
            versiculos: [],
            observacoes: "profetasMaiores, juízo",
        }),
        criarDia(224, {
            antigoTestamento: [
                {
                    livroId: "ezequiel",
                    livroNome: "Ezequiel",
                    capituloInicio: 28,
                    capituloFim: 30,
                },
            ],
            novoTestamento: [],
            livros: ["Ezequiel"],
            capitulos: [28, 29, 30],
            versiculos: [],
            observacoes: "profetasMaiores, quedaDasNações",
        }),
        criarDia(225, {
            antigoTestamento: [
                {
                    livroId: "ezequiel",
                    livroNome: "Ezequiel",
                    capituloInicio: 31,
                    capituloFim: 33,
                },
            ],
            novoTestamento: [],
            livros: ["Ezequiel"],
            capitulos: [31, 32, 33],
            versiculos: [],
            observacoes: "profetasMaiores, atalaias",
        }),
        criarDia(226, {
            antigoTestamento: [
                {
                    livroId: "ezequiel",
                    livroNome: "Ezequiel",
                    capituloInicio: 34,
                    capituloFim: 36,
                },
            ],
            novoTestamento: [],
            livros: ["Ezequiel"],
            capitulos: [34, 35, 36],
            versiculos: [],
            observacoes: "profetasMaiores, pastorVerdadeiro",
        }),
        criarDia(227, {
            antigoTestamento: [
                {
                    livroId: "ezequiel",
                    livroNome: "Ezequiel",
                    capituloInicio: 37,
                    capituloFim: 39,
                },
            ],
            novoTestamento: [],
            livros: ["Ezequiel"],
            capitulos: [37, 38, 39],
            versiculos: [],
            observacoes: "profetasMaiores, restauração",
        }),
        criarDia(228, {
            antigoTestamento: [
                {
                    livroId: "ezequiel",
                    livroNome: "Ezequiel",
                    capituloInicio: 40,
                    capituloFim: 43,
                },
            ],
            novoTestamento: [],
            livros: ["Ezequiel"],
            capitulos: [40, 41, 42, 43],
            versiculos: [],
            observacoes: "profetasMaiores, novoTemplo",
        }),
        criarDia(229, {
            antigoTestamento: [
                {
                    livroId: "ezequiel",
                    livroNome: "Ezequiel",
                    capituloInicio: 44,
                    capituloFim: 48,
                },
            ],
            novoTestamento: [],
            livros: ["Ezequiel"],
            capitulos: [44, 45, 46, 47, 48],
            versiculos: [],
            observacoes: "profetasMaiores, novaTerra",
        }),
        criarDia(230, {
            antigoTestamento: [
                {
                    livroId: "daniel",
                    livroNome: "Daniel",
                    capituloInicio: 1,
                    capituloFim: 3,
                },
            ],
            novoTestamento: [],
            livros: ["Daniel"],
            capitulos: [1, 2, 3],
            versiculos: [],
            observacoes: "profetasMaiores, fidelidade",
        }),
        criarDia(231, {
            antigoTestamento: [
                {
                    livroId: "daniel",
                    livroNome: "Daniel",
                    capituloInicio: 4,
                    capituloFim: 6,
                },
            ],
            novoTestamento: [],
            livros: ["Daniel"],
            capitulos: [4, 5, 6],
            versiculos: [],
            observacoes: "profetasMaiores, reinos",
        }),
        criarDia(232, {
            antigoTestamento: [
                {
                    livroId: "daniel",
                    livroNome: "Daniel",
                    capituloInicio: 7,
                    capituloFim: 9,
                },
            ],
            novoTestamento: [],
            livros: ["Daniel"],
            capitulos: [7, 8, 9],
            versiculos: [],
            observacoes: "profetasMaiores, escatologia",
        }),
        criarDia(233, {
            antigoTestamento: [
                {
                    livroId: "daniel",
                    livroNome: "Daniel",
                    capituloInicio: 10,
                    capituloFim: 12,
                },
            ],
            novoTestamento: [],
            livros: ["Daniel"],
            capitulos: [10, 11, 12],
            versiculos: [],
            observacoes: "profetasMaiores, fimDosTempos",
        }),
        criarDia(234, {
            antigoTestamento: [
                {
                    livroId: "esdras",
                    livroNome: "Esdras",
                    capituloInicio: 1,
                    capituloFim: 3,
                },
            ],
            novoTestamento: [],
            livros: ["Esdras"],
            capitulos: [1, 2, 3],
            versiculos: [],
            observacoes: "posExilio, retorno",
        }),
        criarDia(235, {
            antigoTestamento: [
                {
                    livroId: "esdras",
                    livroNome: "Esdras",
                    capituloInicio: 4,
                    capituloFim: 6,
                },
            ],
            novoTestamento: [],
            livros: ["Esdras"],
            capitulos: [4, 5, 6],
            versiculos: [],
            observacoes: "posExilio, reconstrução",
        }),
        criarDia(236, {
            antigoTestamento: [
                {
                    livroId: "ageu",
                    livroNome: "Ageu",
                    capituloInicio: 1,
                    capituloFim: 2,
                },
                {
                    livroId: "zacarias",
                    livroNome: "Zacarias",
                    capituloInicio: 1,
                    capituloFim: 1,
                },
            ],
            novoTestamento: [],
            livros: ["Ageu", "Zacarias"],
            capitulos: [1, 2, 1],
            versiculos: [],
            observacoes: "profetasMenores, templo",
        }),
        criarDia(237, {
            antigoTestamento: [
                {
                    livroId: "zacarias",
                    livroNome: "Zacarias",
                    capituloInicio: 2,
                    capituloFim: 6,
                },
            ],
            novoTestamento: [],
            livros: ["Zacarias"],
            capitulos: [2, 3, 4, 5, 6],
            versiculos: [],
            observacoes: "profetasMenores, visões",
        }),
        criarDia(238, {
            antigoTestamento: [
                {
                    livroId: "zacarias",
                    livroNome: "Zacarias",
                    capituloInicio: 7,
                    capituloFim: 10,
                },
            ],
            novoTestamento: [],
            livros: ["Zacarias"],
            capitulos: [7, 8, 9, 10],
            versiculos: [],
            observacoes: "profetasMenores, messias",
        }),
        criarDia(239, {
            antigoTestamento: [
                {
                    livroId: "zacarias",
                    livroNome: "Zacarias",
                    capituloInicio: 11,
                    capituloFim: 14,
                },
            ],
            novoTestamento: [],
            livros: ["Zacarias"],
            capitulos: [11, 12, 13, 14],
            versiculos: [],
            observacoes: "profetasMenores, reinoFuturo",
        }),
        criarDia(240, {
            antigoTestamento: [
                {
                    livroId: "esdras",
                    livroNome: "Esdras",
                    capituloInicio: 7,
                    capituloFim: 10,
                },
            ],
            novoTestamento: [],
            livros: ["Esdras"],
            capitulos: [7, 8, 9, 10],
            versiculos: [],
            observacoes: "posExilio, reforma",
        }),
        criarDia(241, {
            antigoTestamento: [
                {
                    livroId: "ester",
                    livroNome: "Ester",
                    capituloInicio: 1,
                    capituloFim: 3,
                },
            ],
            novoTestamento: [],
            livros: ["Ester"],
            capitulos: [1, 2, 3],
            versiculos: [],
            observacoes: "posExilio, providência",
        }),
        criarDia(242, {
            antigoTestamento: [
                {
                    livroId: "ester",
                    livroNome: "Ester",
                    capituloInicio: 4,
                    capituloFim: 7,
                },
            ],
            novoTestamento: [],
            livros: ["Ester"],
            capitulos: [4, 5, 6, 7],
            versiculos: [],
            observacoes: "posExilio, livramento",
        }),
        criarDia(243, {
            antigoTestamento: [
                {
                    livroId: "ester",
                    livroNome: "Ester",
                    capituloInicio: 8,
                    capituloFim: 10,
                },
            ],
            novoTestamento: [],
            livros: ["Ester"],
            capitulos: [8, 9, 10],
            versiculos: [],
            observacoes: "posExilio, vitória",
        }),
        criarDia(244, {
            antigoTestamento: [
                {
                    livroId: "neemias",
                    livroNome: "Neemias",
                    capituloInicio: 1,
                    capituloFim: 3,
                },
            ],
            novoTestamento: [],
            livros: ["Neemias"],
            capitulos: [1, 2, 3],
            versiculos: [],
            observacoes: "posExilio, reconstrução",
        }),
        criarDia(245, {
            antigoTestamento: [
                {
                    livroId: "neemias",
                    livroNome: "Neemias",
                    capituloInicio: 4,
                    capituloFim: 6,
                },
            ],
            novoTestamento: [],
            livros: ["Neemias"],
            capitulos: [4, 5, 6],
            versiculos: [],
            observacoes: "posExilio, perseverança",
        }),
        criarDia(246, {
            antigoTestamento: [
                {
                    livroId: "neemias",
                    livroNome: "Neemias",
                    capituloInicio: 7,
                    capituloFim: 9,
                },
            ],
            novoTestamento: [],
            livros: ["Neemias"],
            capitulos: [7, 8, 9],
            versiculos: [],
            observacoes: "posExilio, arrependimento",
        }),
        criarDia(247, {
            antigoTestamento: [
                {
                    livroId: "neemias",
                    livroNome: "Neemias",
                    capituloInicio: 10,
                    capituloFim: 13,
                },
            ],
            novoTestamento: [],
            livros: ["Neemias"],
            capitulos: [10, 11, 12, 13],
            versiculos: [],
            observacoes: "posExilio, aliança",
        }),
        criarDia(248, {
            antigoTestamento: [
                {
                    livroId: "malaquias",
                    livroNome: "Malaquias",
                    capituloInicio: 1,
                    capituloFim: 4,
                },
            ],
            novoTestamento: [],
            livros: ["Malaquias"],
            capitulos: [1, 2, 3, 4],
            versiculos: [],
            observacoes: "profetasMenores, preparaçãoMessiânica",
        }),
        criarDia(249, {
            antigoTestamento: [
                {
                    livroId: "salmos",
                    livroNome: "Salmos",
                    capituloInicio: 119,
                    capituloFim: 119,
                },
            ],
            novoTestamento: [],
            livros: ["Salmos"],
            capitulos: [119],
            versiculos: [],
            observacoes: "salmos, lei, palavraDeDeus",
        }),
        /* ======================================================================
           DIA 250
        ====================================================================== */
        criarDia(250, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "lucas",
                    livroNome: "Lucas",
                    capituloInicio: 1,
                    capituloFim: 4,
                },
            ],
            livros: ["Lucas"],
            capitulos: [1, 2, 3, 4],
            versiculos: [],
            observacoes: "evangelhos, nascimento",
        }),
        criarDia(251, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "mateus",
                    livroNome: "Mateus",
                    capituloInicio: 1,
                    capituloFim: 4,
                },
            ],
            livros: ["Mateus"],
            capitulos: [1, 2, 3, 4],
            versiculos: [],
            observacoes: "evangelhos, encarnação",
        }),
        criarDia(252, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "joao",
                    livroNome: "João",
                    capituloInicio: 1,
                    capituloFim: 4,
                },
            ],
            livros: ["João"],
            capitulos: [1, 2, 3, 4],
            versiculos: [],
            observacoes: "evangelhos, verbo",
        }),
        criarDia(253, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "marcos",
                    livroNome: "Marcos",
                    capituloInicio: 1,
                    capituloFim: 4,
                },
            ],
            livros: ["Marcos"],
            capitulos: [1, 2, 3, 4],
            versiculos: [],
            observacoes: "evangelhoSinótico, autoridade",
        }),
        criarDia(254, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "mateus",
                    livroNome: "Mateus",
                    capituloInicio: 5,
                    capituloFim: 7,
                },
            ],
            livros: ["Mateus"],
            capitulos: [5, 6, 7],
            versiculos: [],
            observacoes: "evangelhos, sermãoDoMonte",
        }),
        criarDia(255, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "mateus",
                    livroNome: "Mateus",
                    capituloInicio: 8,
                    capituloFim: 10,
                },
            ],
            livros: ["Mateus"],
            capitulos: [8, 9, 10],
            versiculos: [],
            observacoes: "evangelhos, milagres",
        }),
        criarDia(256, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "marcos",
                    livroNome: "Marcos",
                    capituloInicio: 5,
                    capituloFim: 7,
                },
            ],
            livros: ["Marcos"],
            capitulos: [5, 6, 7],
            versiculos: [],
            observacoes: "evangelhoSinótico, milagres",
        }),
        criarDia(257, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "mateus",
                    livroNome: "Mateus",
                    capituloInicio: 11,
                    capituloFim: 13,
                },
            ],
            livros: ["Mateus"],
            capitulos: [11, 12, 13],
            versiculos: [],
            observacoes: "evangelhos, ensinamentos",
        }),
        criarDia(258, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "lucas",
                    livroNome: "Lucas",
                    capituloInicio: 5,
                    capituloFim: 7,
                },
            ],
            livros: ["Lucas"],
            capitulos: [5, 6, 7],
            versiculos: [],
            observacoes: "evangelhos, milagres",
        }),
        criarDia(259, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "marcos",
                    livroNome: "Marcos",
                    capituloInicio: 8,
                    capituloFim: 10,
                },
            ],
            livros: ["Marcos"],
            capitulos: [8, 9, 10],
            versiculos: [],
            observacoes: "evangelhoSinótico, transfiguração",
        }),
        criarDia(260, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "mateus",
                    livroNome: "Mateus",
                    capituloInicio: 14,
                    capituloFim: 16,
                },
            ],
            livros: ["Mateus"],
            capitulos: [14, 15, 16],
            versiculos: [],
            observacoes: "evangelhos, transfiguração",
        }),
        criarDia(261, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "lucas",
                    livroNome: "Lucas",
                    capituloInicio: 8,
                    capituloFim: 10,
                },
            ],
            livros: ["Lucas"],
            capitulos: [8, 9, 10],
            versiculos: [],
            observacoes: "evangelhos, parábolas",
        }),
        criarDia(262, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "mateus",
                    livroNome: "Mateus",
                    capituloInicio: 17,
                    capituloFim: 19,
                },
            ],
            livros: ["Mateus"],
            capitulos: [17, 18, 19],
            versiculos: [],
            observacoes: "evangelhos, discípulado",
        }),
        criarDia(263, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "lucas",
                    livroNome: "Lucas",
                    capituloInicio: 11,
                    capituloFim: 13,
                },
            ],
            livros: ["Lucas"],
            capitulos: [11, 12, 13],
            versiculos: [],
            observacoes: "evangelhos, reino",
        }),
        criarDia(264, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "marcos",
                    livroNome: "Marcos",
                    capituloInicio: 11,
                    capituloFim: 13,
                },
            ],
            livros: ["Marcos"],
            capitulos: [11, 12, 13],
            versiculos: [],
            observacoes: "evangelhoSinótico, ensinamentos",
        }),
        criarDia(265, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "mateus",
                    livroNome: "Mateus",
                    capituloInicio: 20,
                    capituloFim: 22,
                },
            ],
            livros: ["Mateus"],
            capitulos: [20, 21, 22],
            versiculos: [],
            observacoes: "evangelhos, Jerusalém",
        }),
        criarDia(266, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "lucas",
                    livroNome: "Lucas",
                    capituloInicio: 14,
                    capituloFim: 16,
                },
            ],
            livros: ["Lucas"],
            capitulos: [14, 15, 16],
            versiculos: [],
            observacoes: "evangelhos, ensinamentos",
        }),
        criarDia(267, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "mateus",
                    livroNome: "Mateus",
                    capituloInicio: 23,
                    capituloFim: 25,
                },
            ],
            livros: ["Mateus"],
            capitulos: [23, 24, 25],
            versiculos: [],
            observacoes: "evangelhos, escatologia",
        }),
        criarDia(268, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "marcos",
                    livroNome: "Marcos",
                    capituloInicio: 14,
                    capituloFim: 16,
                },
            ],
            livros: ["Marcos"],
            capitulos: [14, 15, 16],
            versiculos: [],
            observacoes: "evangelhoSinótico, paixãoERessurreição",
        }),
        criarDia(269, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "lucas",
                    livroNome: "Lucas",
                    capituloInicio: 17,
                    capituloFim: 19,
                },
            ],
            livros: ["Lucas"],
            capitulos: [17, 18, 19],
            versiculos: [],
            observacoes: "evangelhos, paixãoERessurreição",
        }),
        criarDia(270, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "mateus",
                    livroNome: "Mateus",
                    capituloInicio: 26,
                    capituloFim: 28,
                },
            ],
            livros: ["Mateus"],
            capitulos: [26, 27, 28],
            versiculos: [],
            observacoes: "evangelhos, paixãoERessurreição",
        }),
        criarDia(271, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "lucas",
                    livroNome: "Lucas",
                    capituloInicio: 20,
                    capituloFim: 21,
                },
            ],
            livros: ["Lucas"],
            capitulos: [20, 21],
            versiculos: [],
            observacoes: "evangelhos, paixãoERessurreição",
        }),
        criarDia(272, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "joao",
                    livroNome: "João",
                    capituloInicio: 5,
                    capituloFim: 7,
                },
            ],
            livros: ["João"],
            capitulos: [5, 6, 7],
            versiculos: [],
            observacoes: "evangelhos, sinaisEensinos",
        }),
        criarDia(273, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "joao",
                    livroNome: "João",
                    capituloInicio: 8,
                    capituloFim: 10,
                },
            ],
            livros: ["João"],
            capitulos: [8, 9, 10],
            versiculos: [],
            observacoes: "evangelhos, sinaisEensinos",
        }),
        criarDia(274, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "joao",
                    livroNome: "João",
                    capituloInicio: 11,
                    capituloFim: 13,
                },
            ],
            livros: ["João"],
            capitulos: [11, 12, 13],
            versiculos: [],
            observacoes: "evangelhos, amor",
        }),
        criarDia(275, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "joao",
                    livroNome: "João",
                    capituloInicio: 14,
                    capituloFim: 17,
                },
            ],
            livros: ["João"],
            capitulos: [14, 15, 16, 17],
            versiculos: [],
            observacoes: "evangelhos, espíritoSanto",
        }),
        criarDia(276, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "joao",
                    livroNome: "João",
                    capituloInicio: 18,
                    capituloFim: 21,
                },
            ],
            livros: ["João"],
            capitulos: [18, 19, 20, 21],
            versiculos: [],
            observacoes: "evangelhos, ressurreição",
        }),
        criarDia(277, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "atos",
                    livroNome: "Atos dos Apóstolos",
                    capituloInicio: 1,
                    capituloFim: 4,
                },
            ],
            livros: ["Atos dos Apóstolos"],
            capitulos: [1, 2, 3, 4],
            versiculos: [],
            observacoes: "igrejaPrimitiva, pentecostes",
        }),
        criarDia(278, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "atos",
                    livroNome: "Atos dos Apóstolos",
                    capituloInicio: 5,
                    capituloFim: 8,
                },
            ],
            livros: ["Atos dos Apóstolos"],
            capitulos: [5, 6, 7, 8],
            versiculos: [],
            observacoes: "igrejaPrimitiva, expansão",
        }),
        criarDia(279, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "galatas",
                    livroNome: "Gálatas",
                    capituloInicio: 1,
                    capituloFim: 2,
                },
            ],
            livros: ["Gálatas"],
            capitulos: [1, 2],
            versiculos: [],
            observacoes: "cartasPaulinas, graça",
        }),
        criarDia(280, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "atos",
                    livroNome: "Atos dos Apóstolos",
                    capituloInicio: 9,
                    capituloFim: 12,
                },
            ],
            livros: ["Atos dos Apóstolos"],
            capitulos: [9, 10, 11, 12],
            versiculos: [],
            observacoes: "igrejaPrimitiva, Paulo",
        }),
        criarDia(281, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "1tessalonicenses",
                    livroNome: "1 Tessalonicenses",
                    capituloInicio: 1,
                    capituloFim: 3,
                },
            ],
            livros: ["1 Tessalonicenses"],
            capitulos: [1, 2, 3],
            versiculos: [],
            observacoes: "cartasPaulinas, segundaVinda",
        }),
        criarDia(282, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "1tessalonicenses",
                    livroNome: "1 Tessalonicenses",
                    capituloInicio: 4,
                    capituloFim: 5,
                },
                {
                    livroId: "2tessalonicenses",
                    livroNome: "2 Tessalonicenses",
                    capituloInicio: 1,
                    capituloFim: 1,
                },
            ],
            livros: ["1 Tessalonicenses", "2 Tessalonicenses"],
            capitulos: [4, 5, 1],
            versiculos: [],
            observacoes: "cartasPaulinas, segundaVinda",
        }),
        criarDia(283, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "atos",
                    livroNome: "Atos dos Apóstolos",
                    capituloInicio: 13,
                    capituloFim: 16,
                },
            ],
            livros: ["Atos dos Apóstolos"],
            capitulos: [13, 14, 15, 16],
            versiculos: [],
            observacoes: "igrejaPrimitiva, missões",
        }),
        criarDia(284, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "galatas",
                    livroNome: "Gálatas",
                    capituloInicio: 3,
                    capituloFim: 6,
                },
            ],
            livros: ["Gálatas"],
            capitulos: [3, 4, 5, 6],
            versiculos: [],
            observacoes: "cartasPaulinas, graça",
        }),
        criarDia(285, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "1corintios",
                    livroNome: "1 Coríntios",
                    capituloInicio: 1,
                    capituloFim: 4,
                },
            ],
            livros: ["1 Coríntios"],
            capitulos: [1, 2, 3, 4],
            versiculos: [],
            observacoes: "cartasPaulinas, igreja",
        }),
        criarDia(286, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "1corintios",
                    livroNome: "1 Coríntios",
                    capituloInicio: 5,
                    capituloFim: 8,
                },
            ],
            livros: ["1 Coríntios"],
            capitulos: [5, 6, 7, 8],
            versiculos: [],
            observacoes: "cartasPaulinas, vidaCristã",
        }),
        criarDia(287, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "1corintios",
                    livroNome: "1 Coríntios",
                    capituloInicio: 9,
                    capituloFim: 11,
                },
                {
                    livroId: "2corintios",
                    livroNome: "2 Coríntios",
                    capituloInicio: 1,
                    capituloFim: 1,
                },
            ],
            livros: ["1 Coríntios", "2 Coríntios"],
            capitulos: [9, 10, 11, 1],
            versiculos: [],
            observacoes: "cartasPaulinas, vidaCristã",
        }),
        criarDia(288, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "2corintios",
                    livroNome: "2 Coríntios",
                    capituloInicio: 2,
                    capituloFim: 5,
                },
            ],
            livros: ["2 Coríntios"],
            capitulos: [2, 3, 4, 5],
            versiculos: [],
            observacoes: "cartasPaulinas, ministério",
        }),
        criarDia(289, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "2corintios",
                    livroNome: "2 Coríntios",
                    capituloInicio: 6,
                    capituloFim: 9,
                },
            ],
            livros: ["2 Coríntios"],
            capitulos: [6, 7, 8, 9],
            versiculos: [],
            observacoes: "cartasPaulinas, vidaCristã",
        }),
        criarDia(290, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "2corintios",
                    livroNome: "2 Coríntios",
                    capituloInicio: 10,
                    capituloFim: 13,
                },
                {
                    livroId: "romanos",
                    livroNome: "Romanos",
                    capituloInicio: 1,
                    capituloFim: 1,
                },
            ],
            livros: ["2 Coríntios", "Romanos"],
            capitulos: [10, 11, 12, 13, 1],
            versiculos: [],
            observacoes: "cartasPaulinas, justificação",
        }),
        criarDia(291, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "romanos",
                    livroNome: "Romanos",
                    capituloInicio: 2,
                    capituloFim: 4,
                },
            ],
            livros: ["Romanos"],
            capitulos: [2, 3, 4],
            versiculos: [],
            observacoes: "cartasPaulinas, justificação",
        }),
        criarDia(292, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "romanos",
                    livroNome: "Romanos",
                    capituloInicio: 5,
                    capituloFim: 8,
                },
            ],
            livros: ["Romanos"],
            capitulos: [5, 6, 7, 8],
            versiculos: [],
            observacoes: "cartasPaulinas, vidaNoEspírito",
        }),
        criarDia(293, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "romanos",
                    livroNome: "Romanos",
                    capituloInicio: 9,
                    capituloFim: 12,
                },
            ],
            livros: ["Romanos"],
            capitulos: [9, 10, 11, 12],
            versiculos: [],
            observacoes: "cartasPaulinas, soberania",
        }),
        criarDia(294, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "romanos",
                    livroNome: "Romanos",
                    capituloInicio: 13,
                    capituloFim: 16,
                },
            ],
            livros: ["Romanos"],
            capitulos: [13, 14, 15, 16],
            versiculos: [],
            observacoes: "cartasPaulinas, vidaCristã",
        }),
        criarDia(295, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "efesios",
                    livroNome: "Efésios",
                    capituloInicio: 1,
                    capituloFim: 3,
                },
            ],
            livros: ["Efésios"],
            capitulos: [1, 2, 3],
            versiculos: [],
            observacoes: "cartasPaulinas, igreja",
        }),
        criarDia(296, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "efesios",
                    livroNome: "Efésios",
                    capituloInicio: 4,
                    capituloFim: 6,
                },
            ],
            livros: ["Efésios"],
            capitulos: [4, 5, 6],
            versiculos: [],
            observacoes: "cartasPaulinas, vidaCristã",
        }),
        criarDia(297, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "filipenses",
                    livroNome: "Filipenses",
                    capituloInicio: 1,
                    capituloFim: 4,
                },
            ],
            livros: ["Filipenses"],
            capitulos: [1, 2, 3, 4],
            versiculos: [],
            observacoes: "cartasPaulinas, alegria",
        }),
        criarDia(298, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "colossenses",
                    livroNome: "Colossenses",
                    capituloInicio: 1,
                    capituloFim: 3,
                },
            ],
            livros: ["Colossenses"],
            capitulos: [1, 2, 3],
            versiculos: [],
            observacoes: "cartasPaulinas, perdão",
        }),
        criarDia(299, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "colossenses",
                    livroNome: "Colossenses",
                    capituloInicio: 4,
                    capituloFim: 4,
                },
                {
                    livroId: "filemom",
                    livroNome: "Filemom",
                    capituloInicio: 1,
                    capituloFim: 1,
                },
            ],
            livros: ["Colossenses", "Filemom"],
            capitulos: [4, 1],
            versiculos: [],
            observacoes: "cartasPaulinas, perdão",
        }),
        /* ======================================================================
           DIA 300
        ====================================================================== */
        criarDia(300, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "atos",
                    livroNome: "Atos dos Apóstolos",
                    capituloInicio: 17,
                    capituloFim: 20,
                },
            ],
            livros: ["Atos dos Apóstolos"],
            capitulos: [17, 18, 19, 20],
            versiculos: [],
            observacoes: "igrejaPrimitiva, evangelização",
        }),
        criarDia(301, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "atos",
                    livroNome: "Atos dos Apóstolos",
                    capituloInicio: 21,
                    capituloFim: 24,
                },
            ],
            livros: ["Atos dos Apóstolos"],
            capitulos: [21, 22, 23, 24],
            versiculos: [],
            observacoes: "igrejaPrimitiva, conflitos",
        }),
        criarDia(302, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "atos",
                    livroNome: "Atos dos Apóstolos",
                    capituloInicio: 25,
                    capituloFim: 28,
                },
            ],
            livros: ["Atos dos Apóstolos"],
            capitulos: [25, 26, 27, 28],
            versiculos: [],
            observacoes: "igrejaPrimitiva, Roma",
        }),
        criarDia(303, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "hebreus",
                    livroNome: "Hebreus",
                    capituloInicio: 1,
                    capituloFim: 4,
                },
            ],
            livros: ["Hebreus"],
            capitulos: [1, 2, 3, 4],
            versiculos: [],
            observacoes: "epístolaGeral, sacerdócio",
        }),
        criarDia(304, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "hebreus",
                    livroNome: "Hebreus",
                    capituloInicio: 5,
                    capituloFim: 8,
                },
            ],
            livros: ["Hebreus"],
            capitulos: [5, 6, 7, 8],
            versiculos: [],
            observacoes: "epístolaGeral, aliança",
        }),
        criarDia(305, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "hebreus",
                    livroNome: "Hebreus",
                    capituloInicio: 9,
                    capituloFim: 13,
                },
            ],
            livros: ["Hebreus"],
            capitulos: [9, 10, 11, 12, 13],
            versiculos: [],
            observacoes: "epístolaGeral, fé",
        }),
        criarDia(306, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "tiago",
                    livroNome: "Tiago",
                    capituloInicio: 1,
                    capituloFim: 5,
                },
            ],
            livros: ["Tiago"],
            capitulos: [1, 2, 3, 4, 5],
            versiculos: [],
            observacoes: "epístolaGeral, féEObras",
        }),
        criarDia(307, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "1pedro",
                    livroNome: "1 Pedro",
                    capituloInicio: 1,
                    capituloFim: 5,
                },
            ],
            livros: ["1 Pedro"],
            capitulos: [1, 2, 3, 4, 5],
            versiculos: [],
            observacoes: "epístolaGeral, sofrimento",
        }),
        criarDia(308, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "2pedro",
                    livroNome: "2 Pedro",
                    capituloInicio: 1,
                    capituloFim: 3,
                },
                {
                    livroId: "judas",
                    livroNome: "Judas",
                    capituloInicio: 1,
                    capituloFim: 1,
                },
            ],
            livros: ["2 Pedro", "Judas"],
            capitulos: [1, 2, 3, 1],
            versiculos: [],
            observacoes: "epístolaGeral, falsosMestres",
        }),
        criarDia(309, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "1joao",
                    livroNome: "1 João",
                    capituloInicio: 1,
                    capituloFim: 5,
                },
            ],
            livros: ["1 João"],
            capitulos: [1, 2, 3, 4, 5],
            versiculos: [],
            observacoes: "epístolaGeral, amor",
        }),
        criarDia(310, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "3joao",
                    livroNome: "3 João",
                    capituloInicio: 1,
                    capituloFim: 1,
                },
            ],
            livros: ["3 João"],
            capitulos: [1],
            versiculos: [],
            observacoes: "epístolaGeral, verdade",
        }),
        criarDia(311, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "apocalipse",
                    livroNome: "Apocalipse",
                    capituloInicio: 1,
                    capituloFim: 3,
                },
            ],
            livros: ["Apocalipse"],
            capitulos: [1, 2, 3],
            versiculos: [],
            observacoes: "escatologia, CristoGlorificado",
        }),
        criarDia(312, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "apocalipse",
                    livroNome: "Apocalipse",
                    capituloInicio: 4,
                    capituloFim: 6,
                },
            ],
            livros: ["Apocalipse"],
            capitulos: [4, 5, 6],
            versiculos: [],
            observacoes: "escatologia, trono",
        }),
        criarDia(313, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "apocalipse",
                    livroNome: "Apocalipse",
                    capituloInicio: 7,
                    capituloFim: 9,
                },
            ],
            livros: ["Apocalipse"],
            capitulos: [7, 8, 9],
            versiculos: [],
            observacoes: "escatologia, juízo",
        }),
        criarDia(314, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "apocalipse",
                    livroNome: "Apocalipse",
                    capituloInicio: 10,
                    capituloFim: 12,
                },
            ],
            livros: ["Apocalipse"],
            capitulos: [10, 11, 12],
            versiculos: [],
            observacoes: "escatologia, conflito",
        }),
        criarDia(315, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "apocalipse",
                    livroNome: "Apocalipse",
                    capituloInicio: 13,
                    capituloFim: 15,
                },
            ],
            livros: ["Apocalipse"],
            capitulos: [13, 14, 15],
            versiculos: [],
            observacoes: "escatologia, besta",
        }),
        criarDia(316, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "apocalipse",
                    livroNome: "Apocalipse",
                    capituloInicio: 16,
                    capituloFim: 18,
                },
            ],
            livros: ["Apocalipse"],
            capitulos: [16, 17, 18],
            versiculos: [],
            observacoes: "escatologia, quedaDaBabilônia",
        }),
        /* ======================================================================
           DIA 317
        ====================================================================== */
        criarDia(317, {
            antigoTestamento: [],
            novoTestamento: [
                {
                    livroId: "apocalipse",
                    livroNome: "Apocalipse",
                    capituloInicio: 19,
                    capituloFim: 22,
                },
            ],
            livros: ["Apocalipse"],
            capitulos: [19, 20, 21, 22],
            versiculos: [],
            observacoes: "escatologia, novaCriação",
        }),
    ],
    /* -------------------------------------------------------------------------
       MÉTODOS DE ACESSO (CONTRATO FUNCIONAL)
    ------------------------------------------------------------------------- */
    /**
     * Retorna um dia específico pelo número (O(1))
     * @param {number} numero
     * @returns {Dia | undefined}
     */
    getDia(numero) {
        return this.dias[numero - 1];
    },
    /**
     * Retorna todos os dias do plano
     * @returns {Dia[]}
     */
    getDias() {
        return this.dias;
    },
};
/* ---------------------------------------------------------------------------
   VALIDAÇÃO DO CONTRATO
   ---------------------------------------------------------------------------
   Garante em runtime que:
   - Todos os dias são instâncias válidas de Dia
   - A sequência está correta
   - O plano é estruturalmente íntegro
--------------------------------------------------------------------------- */
(0, contrato_plano_js_1.validarPlano)(planoCronologico);
/* ---------------------------------------------------------------------------
   EXPORTAÇÃO
--------------------------------------------------------------------------- */
exports.default = planoCronologico;
