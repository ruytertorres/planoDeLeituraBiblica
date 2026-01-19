/* ============================================================================
   plano_cronologico.js — Entidade de Plano: Plano Cronológico de Leitura
   Versão: 0.7
   Aplicação: Bíblia Responsiva App

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------
   - Representar o plano cronológico diário de leitura bíblica
   - Expor estrutura estável conforme contrato de plano
   - NÃO conter lógica de UI
   - NÃO conter lógica de progresso
   - NÃO conter persistência
   - NÃO conter lógica de datas (usa gerador centralizado)
============================================================================ */

/* --------------------------------------------------------------------------
   IMPORTAÇÕES
-------------------------------------------------------------------------- */

import { Dia } from "../dia.js";
import { validarPlano } from "./contrato_plano.js";
import { gerarDataISO, gerarDataBR } from "./utils/geradorDatas.js";

/* --------------------------------------------------------------------------
   FUNÇÕES AUXILIARES USANDO GERADOR CENTRALIZADO
   --------------------------------------------------------------------------
   Estas funções usam o gerador centralizado em utils/geradorDatas.js
   Isso garante consistência em todos os planos e facilita manutenção
   IMPORTANTE: Usa ANO FIXO 2026 definido no geradorDatas.js
-------------------------------------------------------------------------- */

/**
 * Gera data automática usando gerador centralizado
 * @param {number} diaNumero - Número do dia no plano (1-317)
 * @returns {string} Data no formato YYYY-MM-DD
 */
function gerarDataAutomatica(diaNumero) {
  // Usa função centralizada - ano 2026 já é padrão em geradorDatas.js
  return gerarDataISO(diaNumero);
}

/**
 * Gera data formatada usando gerador centralizado
 * @param {number} diaNumero - Número do dia no plano (1-317)
 * @returns {string} Data no formato DD/MM/YYYY
 */
function gerarDataFormatada(diaNumero) {
  // Usa função centralizada - ano 2026 já é padrão em geradorDatas.js
  return gerarDataBR(diaNumero);
}

/* --------------------------------------------------------------------------
   DEFINIÇÃO DO PLANO (CONTRATO)
-------------------------------------------------------------------------- */

const planoCronologico = {
  /* --------------------------------------------------------------------------
     METADADOS DO PLANO
  -------------------------------------------------------------------------- */

  id: "plano_cronologico",
  nome: "Plano Cronológico da Bíblia",
  descricao: "Leitura diária da Bíblia em ordem cronológica e temática",
  totalDias: 317,

  /* --------------------------------------------------------------------------
     DIAS DO PLANO (DOMÍNIO PURO)
  -------------------------------------------------------------------------- */
  dias: [
    new Dia({
      numero: 1,

      data: gerarDataAutomatica(1),
      dataFormatada: gerarDataFormatada(1), //apaga
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
    new Dia({
      numero: 2,

      data: gerarDataAutomatica(2),
      dataFormatada: gerarDataFormatada(2),
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
    new Dia({
      numero: 3,

      data: gerarDataAutomatica(3),
      dataFormatada: gerarDataFormatada(3),
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
    new Dia({
      numero: 4,

      data: gerarDataAutomatica(4),
      dataFormatada: gerarDataFormatada(4),
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
    new Dia({
      numero: 5,

      data: gerarDataAutomatica(5),
      dataFormatada: gerarDataFormatada(5),
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
    new Dia({
      numero: 6,

      data: gerarDataAutomatica(6),
      dataFormatada: gerarDataFormatada(6),
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
    new Dia({
      numero: 7,

      data: gerarDataAutomatica(7),
      dataFormatada: gerarDataFormatada(7),
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
    new Dia({
      numero: 8,

      data: gerarDataAutomatica(8),
      dataFormatada: gerarDataFormatada(8),
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
    new Dia({
      numero: 9,

      data: gerarDataAutomatica(9),
      dataFormatada: gerarDataFormatada(9),
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
    new Dia({
      numero: 10,

      data: gerarDataAutomatica(10),
      dataFormatada: gerarDataFormatada(10),
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
    new Dia({
      numero: 11,

      data: gerarDataAutomatica(11),
      dataFormatada: gerarDataFormatada(11),
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
    new Dia({
      numero: 12,

      data: gerarDataAutomatica(12),
      dataFormatada: gerarDataFormatada(12),
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
    new Dia({
      numero: 13,

      data: gerarDataAutomatica(13),
      dataFormatada: gerarDataFormatada(13),
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
    new Dia({
      numero: 14,

      data: gerarDataAutomatica(14),
      dataFormatada: gerarDataFormatada(14),
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
    new Dia({
      numero: 15,

      data: gerarDataAutomatica(15),
      dataFormatada: gerarDataFormatada(15),
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
    new Dia({
      numero: 16,

      data: gerarDataAutomatica(16),
      dataFormatada: gerarDataFormatada(16),
      antigoTestamento: [
        { livroId: "jo", livroNome: "Jó", capituloInicio: 1, capituloFim: 4 },
      ],
      novoTestamento: [],
      livros: ["Jó"],
      capitulos: [1, 2, 3, 4],
      versiculos: [],
      observacoes: "poesia, sofrimento, provação",
    }),
    new Dia({
      numero: 17,

      data: gerarDataAutomatica(17),
      dataFormatada: gerarDataFormatada(17),
      antigoTestamento: [
        { livroId: "jo", livroNome: "Jó", capituloInicio: 5, capituloFim: 7 },
      ],
      novoTestamento: [],
      livros: ["Jó"],
      capitulos: [5, 6, 7],
      versiculos: [],
      observacoes: "poesia, lamento, debate",
    }),
    new Dia({
      numero: 18,

      data: gerarDataAutomatica(18),
      dataFormatada: gerarDataFormatada(18),
      antigoTestamento: [
        { livroId: "jo", livroNome: "Jó", capituloInicio: 8, capituloFim: 10 },
      ],
      novoTestamento: [],
      livros: ["Jó"],
      capitulos: [8, 9, 10],
      versiculos: [],
      observacoes: "poesia, justiçaDivina",
    }),
    new Dia({
      numero: 19,

      data: gerarDataAutomatica(19),
      dataFormatada: gerarDataFormatada(19),
      antigoTestamento: [
        { livroId: "jo", livroNome: "Jó", capituloInicio: 11, capituloFim: 13 },
      ],
      novoTestamento: [],
      livros: ["Jó"],
      capitulos: [11, 12, 13],
      versiculos: [],
      observacoes: "poesia, defesaDeJó",
    }),
    new Dia({
      numero: 20,

      data: gerarDataAutomatica(20),
      dataFormatada: gerarDataFormatada(20),
      antigoTestamento: [
        { livroId: "jo", livroNome: "Jó", capituloInicio: 14, capituloFim: 17 },
      ],
      novoTestamento: [],
      livros: ["Jó"],
      capitulos: [14, 15, 16, 17],
      versiculos: [],
      observacoes: "poesia, esperança",
    }),
    new Dia({
      numero: 21,

      data: gerarDataAutomatica(21),
      dataFormatada: gerarDataFormatada(21),
      antigoTestamento: [
        { livroId: "jo", livroNome: "Jó", capituloInicio: 18, capituloFim: 20 },
      ],
      novoTestamento: [],
      livros: ["Jó"],
      capitulos: [18, 19, 20],
      versiculos: [],
      observacoes: "poesia, discurso",
    }),
    new Dia({
      numero: 22,

      data: gerarDataAutomatica(22),
      dataFormatada: gerarDataFormatada(22),
      antigoTestamento: [
        { livroId: "jo", livroNome: "Jó", capituloInicio: 21, capituloFim: 24 },
      ],
      novoTestamento: [],
      livros: ["Jó"],
      capitulos: [21, 22, 23, 24],
      versiculos: [],
      observacoes: "poesia, impiedade",
    }),
    new Dia({
      numero: 23,

      data: gerarDataAutomatica(23),
      dataFormatada: gerarDataFormatada(23),
      antigoTestamento: [
        { livroId: "jo", livroNome: "Jó", capituloInicio: 25, capituloFim: 27 },
      ],
      novoTestamento: [],
      livros: ["Jó"],
      capitulos: [25, 26, 27],
      versiculos: [],
      observacoes: "poesia, respostas",
    }),
    new Dia({
      numero: 24,

      data: gerarDataAutomatica(24),
      dataFormatada: gerarDataFormatada(24),
      antigoTestamento: [
        { livroId: "jo", livroNome: "Jó", capituloInicio: 28, capituloFim: 31 },
      ],
      novoTestamento: [],
      livros: ["Jó"],
      capitulos: [28, 29, 30, 31],
      versiculos: [],
      observacoes: "poesia, sabedoria",
    }),
    new Dia({
      numero: 25,

      data: gerarDataAutomatica(25),
      dataFormatada: gerarDataFormatada(25),
      antigoTestamento: [
        { livroId: "jo", livroNome: "Jó", capituloInicio: 32, capituloFim: 34 },
      ],
      novoTestamento: [],
      livros: ["Jó"],
      capitulos: [32, 33, 34],
      versiculos: [],
      observacoes: "poesia, Eliú",
    }),
    new Dia({
      numero: 26,

      data: gerarDataAutomatica(26),
      dataFormatada: gerarDataFormatada(26),
      antigoTestamento: [
        { livroId: "jo", livroNome: "Jó", capituloInicio: 35, capituloFim: 37 },
      ],
      novoTestamento: [],
      livros: ["Jó"],
      capitulos: [35, 36, 37],
      versiculos: [],
      observacoes: "poesia, justiça",
    }),
    new Dia({
      numero: 27,

      data: gerarDataAutomatica(27),
      dataFormatada: gerarDataFormatada(27),
      antigoTestamento: [
        { livroId: "jo", livroNome: "Jó", capituloInicio: 38, capituloFim: 42 },
      ],
      novoTestamento: [],
      livros: ["Jó"],
      capitulos: [38, 39, 40, 41, 42],
      versiculos: [],
      observacoes: "poesia, DeusFala, restauração",
    }),
    new Dia({
      numero: 28,

      data: gerarDataAutomatica(28),
      dataFormatada: gerarDataFormatada(28),
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
    new Dia({
      numero: 29,

      data: gerarDataAutomatica(29),
      dataFormatada: gerarDataFormatada(29),
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
    new Dia({
      numero: 30,

      data: gerarDataAutomatica(30),
      dataFormatada: gerarDataFormatada(30),
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
    new Dia({
      numero: 31,

      data: gerarDataAutomatica(31),
      dataFormatada: gerarDataFormatada(31),
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
    new Dia({
      numero: 32,

      data: gerarDataAutomatica(32),
      dataFormatada: gerarDataFormatada(32),
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
    new Dia({
      numero: 33,

      data: gerarDataAutomatica(33),
      dataFormatada: gerarDataFormatada(33),
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
    new Dia({
      numero: 34,

      data: gerarDataAutomatica(34),
      dataFormatada: gerarDataFormatada(34),
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
    new Dia({
      numero: 35,

      data: gerarDataAutomatica(35),
      dataFormatada: gerarDataFormatada(35),
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
    new Dia({
      numero: 36,

      data: gerarDataAutomatica(36),
      dataFormatada: gerarDataFormatada(36),
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
    new Dia({
      numero: 37,

      data: gerarDataAutomatica(37),
      dataFormatada: gerarDataFormatada(37),
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
    new Dia({
      numero: 38,

      data: gerarDataAutomatica(38),
      dataFormatada: gerarDataFormatada(38),
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
    new Dia({
      numero: 39,

      data: gerarDataAutomatica(39),
      dataFormatada: gerarDataFormatada(39),
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
    new Dia({
      numero: 40,

      data: gerarDataAutomatica(40),
      dataFormatada: gerarDataFormatada(40),
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
    new Dia({
      numero: 41,

      data: gerarDataAutomatica(41),
      dataFormatada: gerarDataFormatada(41),
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
    new Dia({
      numero: 42,

      data: gerarDataAutomatica(42),
      dataFormatada: gerarDataFormatada(42),
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
    new Dia({
      numero: 43,

      data: gerarDataAutomatica(43),
      dataFormatada: gerarDataFormatada(43),
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
    new Dia({
      numero: 44,

      data: gerarDataAutomatica(44),
      dataFormatada: gerarDataFormatada(44),
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
    new Dia({
      numero: 45,

      data: gerarDataAutomatica(45),
      dataFormatada: gerarDataFormatada(45),
      antigoTestamento: [
        {
          livroId: "levitico",
          livroNome: "Levítico",
          capituloInicio: 17,
          capituloFim: 19,
        },
      ],
      novoTestamento: [],
      livros: ["Levítico"],
      capitulos: [17, 18, 19],
      versiculos: [],
      observacoes: "pentateuco, santidade",
    }),
    new Dia({
      numero: 46,

      data: gerarDataAutomatica(46),
      dataFormatada: gerarDataFormatada(46),
      antigoTestamento: [
        {
          livroId: "levitico",
          livroNome: "Levítico",
          capituloInicio: 20,
          capituloFim: 22,
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
      capitulos: [20, 21, 22, 95],
      versiculos: [],
      observacoes: "pentateuco, adoração",
    }),
    new Dia({
      numero: 47,

      data: gerarDataAutomatica(47),
      dataFormatada: gerarDataFormatada(47),
      antigoTestamento: [
        {
          livroId: "levitico",
          livroNome: "Levítico",
          capituloInicio: 23,
          capituloFim: 27,
        },
      ],
      novoTestamento: [],
      livros: ["Levítico"],
      capitulos: [23, 24, 25, 26, 27],
      versiculos: [],
      observacoes: "pentateuco, festas",
    }),
    new Dia({
      numero: 48,

      data: gerarDataAutomatica(48),
      dataFormatada: gerarDataFormatada(48),
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
    new Dia({
      numero: 49,

      data: gerarDataAutomatica(49),
      dataFormatada: gerarDataFormatada(49),
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
    new Dia({
      numero: 50,

      data: gerarDataAutomatica(50),
      dataFormatada: gerarDataFormatada(50),
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
    new Dia({
      numero: 51,

      data: gerarDataAutomatica(51),
      dataFormatada: gerarDataFormatada(51),
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
    new Dia({
      numero: 52,

      data: gerarDataAutomatica(52),
      dataFormatada: gerarDataFormatada(52),
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
          capituloInicio: 12,
          capituloFim: 14,
        },
      ],
      novoTestamento: [],
      livros: ["Salmos", "Números"],
      capitulos: [91, 12, 13, 14],
      versiculos: [],
      observacoes: "pentateuco, rebelião",
    }),
    new Dia({
      numero: 53,

      data: gerarDataAutomatica(53),
      dataFormatada: gerarDataFormatada(53),
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
    new Dia({
      numero: 54,

      data: gerarDataAutomatica(54),
      dataFormatada: gerarDataFormatada(54),
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
    new Dia({
      numero: 55,

      data: gerarDataAutomatica(55),
      dataFormatada: gerarDataFormatada(55),
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
    new Dia({
      numero: 56,

      data: gerarDataAutomatica(56),
      dataFormatada: gerarDataFormatada(56),
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
    new Dia({
      numero: 57,

      data: gerarDataAutomatica(57),
      dataFormatada: gerarDataFormatada(57),
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
    new Dia({
      numero: 58,

      data: gerarDataAutomatica(58),
      dataFormatada: gerarDataFormatada(58),
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
    new Dia({
      numero: 59,

      data: gerarDataAutomatica(59),
      dataFormatada: gerarDataFormatada(59),
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
    new Dia({
      numero: 60,

      data: gerarDataAutomatica(60),
      dataFormatada: gerarDataFormatada(60),
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
    new Dia({
      numero: 61,

      data: gerarDataAutomatica(61),
      dataFormatada: gerarDataFormatada(61),
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
    new Dia({
      numero: 62,

      data: gerarDataAutomatica(62),
      dataFormatada: gerarDataFormatada(62),
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
    new Dia({
      numero: 63,

      data: gerarDataAutomatica(63),
      dataFormatada: gerarDataFormatada(63),
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
    new Dia({
      numero: 64,

      data: gerarDataAutomatica(64),
      dataFormatada: gerarDataFormatada(64),
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
    new Dia({
      numero: 65,

      data: gerarDataAutomatica(65),
      dataFormatada: gerarDataFormatada(65),
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
    new Dia({
      numero: 66,

      data: gerarDataAutomatica(66),
      dataFormatada: gerarDataFormatada(66),
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
    new Dia({
      numero: 67,

      data: gerarDataAutomatica(67),
      dataFormatada: gerarDataFormatada(67),
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
    new Dia({
      numero: 68,

      data: gerarDataAutomatica(68),
      dataFormatada: gerarDataFormatada(68),
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
    new Dia({
      numero: 69,

      data: gerarDataAutomatica(69),
      dataFormatada: gerarDataFormatada(69),
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
    new Dia({
      numero: 70,

      data: gerarDataAutomatica(70),
      dataFormatada: gerarDataFormatada(70),
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
    new Dia({
      numero: 71,

      data: gerarDataAutomatica(71),
      dataFormatada: gerarDataFormatada(71),
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
    new Dia({
      numero: 72,

      data: gerarDataAutomatica(72),
      dataFormatada: gerarDataFormatada(72),
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
    new Dia({
      numero: 73,

      data: gerarDataAutomatica(73),
      dataFormatada: gerarDataFormatada(73),
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
    new Dia({
      numero: 74,

      data: gerarDataAutomatica(74),
      dataFormatada: gerarDataFormatada(74),
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
    new Dia({
      numero: 75,

      data: gerarDataAutomatica(75),
      dataFormatada: gerarDataFormatada(75),
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
    new Dia({
      numero: 76,

      data: gerarDataAutomatica(76),
      dataFormatada: gerarDataFormatada(76),
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
    new Dia({
      numero: 77,

      data: gerarDataAutomatica(77),
      dataFormatada: gerarDataFormatada(77),
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
    new Dia({
      numero: 78,

      data: gerarDataAutomatica(78),
      dataFormatada: gerarDataFormatada(78),
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
    new Dia({
      numero: 79,

      data: gerarDataAutomatica(79),
      dataFormatada: gerarDataFormatada(79),
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
    new Dia({
      numero: 80,

      data: gerarDataAutomatica(80),
      dataFormatada: gerarDataFormatada(80),
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
    new Dia({
      numero: 81,

      data: gerarDataAutomatica(81),
      dataFormatada: gerarDataFormatada(81),
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
    new Dia({
      numero: 82,

      data: gerarDataAutomatica(82),
      dataFormatada: gerarDataFormatada(82),
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
    new Dia({
      numero: 83,

      data: gerarDataAutomatica(83),
      dataFormatada: gerarDataFormatada(83),
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
    new Dia({
      numero: 84,

      data: gerarDataAutomatica(84),
      dataFormatada: gerarDataFormatada(84),
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
    new Dia({
      numero: 85,

      data: gerarDataAutomatica(85),
      dataFormatada: gerarDataFormatada(85),
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
    new Dia({
      numero: 86,

      data: gerarDataAutomatica(86),
      dataFormatada: gerarDataFormatada(86),
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
    new Dia({
      numero: 87,

      data: gerarDataAutomatica(87),
      dataFormatada: gerarDataFormatada(87),
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
    new Dia({
      numero: 88,

      data: gerarDataAutomatica(88),
      dataFormatada: gerarDataFormatada(88),
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
    new Dia({
      numero: 89,

      data: gerarDataAutomatica(89),
      dataFormatada: gerarDataFormatada(89),
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
    new Dia({
      numero: 90,

      data: gerarDataAutomatica(90),
      dataFormatada: gerarDataFormatada(90),
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
    new Dia({
      numero: 91,

      data: gerarDataAutomatica(91),
      dataFormatada: gerarDataFormatada(91),
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
    new Dia({
      numero: 92,

      data: gerarDataAutomatica(92),
      dataFormatada: gerarDataFormatada(92),
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
    new Dia({
      numero: 93,

      data: gerarDataAutomatica(93),
      dataFormatada: gerarDataFormatada(93),
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
    new Dia({
      numero: 94,

      data: gerarDataAutomatica(94),
      dataFormatada: gerarDataFormatada(94),
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
    new Dia({
      numero: 95,

      data: gerarDataAutomatica(95),
      dataFormatada: gerarDataFormatada(95),
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
    new Dia({
      numero: 96,

      data: gerarDataAutomatica(96),
      dataFormatada: gerarDataFormatada(96),
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
    new Dia({
      numero: 97,

      data: gerarDataAutomatica(97),
      dataFormatada: gerarDataFormatada(97),
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
    new Dia({
      numero: 98,

      data: gerarDataAutomatica(98),
      dataFormatada: gerarDataFormatada(98),
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
    new Dia({
      numero: 99,

      data: gerarDataAutomatica(99),
      dataFormatada: gerarDataFormatada(99),
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
    new Dia({
      numero: 100,

      data: gerarDataAutomatica(100),
      dataFormatada: gerarDataFormatada(100),
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
    new Dia({
      numero: 101,

      data: gerarDataAutomatica(101),
      dataFormatada: gerarDataFormatada(101),
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
    new Dia({
      numero: 102,

      data: gerarDataAutomatica(102),
      dataFormatada: gerarDataFormatada(102),
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
    new Dia({
      numero: 103,

      data: gerarDataAutomatica(103),
      dataFormatada: gerarDataFormatada(103),
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
    new Dia({
      numero: 104,

      data: gerarDataAutomatica(104),
      dataFormatada: gerarDataFormatada(104),
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
    new Dia({
      numero: 105,

      data: gerarDataAutomatica(105),
      dataFormatada: gerarDataFormatada(105),
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
    new Dia({
      numero: 106,

      data: gerarDataAutomatica(106),
      dataFormatada: gerarDataFormatada(106),
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
    new Dia({
      numero: 107,

      data: gerarDataAutomatica(107),
      dataFormatada: gerarDataFormatada(107),
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
    new Dia({
      numero: 108,

      data: gerarDataAutomatica(108),
      dataFormatada: gerarDataFormatada(108),
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
    new Dia({
      numero: 109,

      data: gerarDataAutomatica(109),
      dataFormatada: gerarDataFormatada(109),
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
    new Dia({
      numero: 110,

      data: gerarDataAutomatica(110),
      dataFormatada: gerarDataFormatada(110),
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
    new Dia({
      numero: 111,

      data: gerarDataAutomatica(111),
      dataFormatada: gerarDataFormatada(111),
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
    new Dia({
      numero: 112,

      data: gerarDataAutomatica(112),
      dataFormatada: gerarDataFormatada(112),
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
    new Dia({
      numero: 113,

      data: gerarDataAutomatica(113),
      dataFormatada: gerarDataFormatada(113),
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
    new Dia({
      numero: 114,

      data: gerarDataAutomatica(114),
      dataFormatada: gerarDataFormatada(114),
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
    new Dia({
      numero: 115,

      data: gerarDataAutomatica(115),
      dataFormatada: gerarDataFormatada(115),
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
    new Dia({
      numero: 116,

      data: gerarDataAutomatica(116),
      dataFormatada: gerarDataFormatada(116),
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
    new Dia({
      numero: 117,

      data: gerarDataAutomatica(117),
      dataFormatada: gerarDataFormatada(117),
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
    new Dia({
      numero: 118,

      data: gerarDataAutomatica(118),
      dataFormatada: gerarDataFormatada(118),
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
    new Dia({
      numero: 119,

      data: gerarDataAutomatica(119),
      dataFormatada: gerarDataFormatada(119),
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
    new Dia({
      numero: 120,

      data: gerarDataAutomatica(120),
      dataFormatada: gerarDataFormatada(120),
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
    new Dia({
      numero: 121,

      data: gerarDataAutomatica(121),
      dataFormatada: gerarDataFormatada(121),
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
    new Dia({
      numero: 122,

      data: gerarDataAutomatica(122),
      dataFormatada: gerarDataFormatada(122),
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
    new Dia({
      numero: 123,

      data: gerarDataAutomatica(123),
      dataFormatada: gerarDataFormatada(123),
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
    new Dia({
      numero: 124,

      data: gerarDataAutomatica(124),
      dataFormatada: gerarDataFormatada(124),
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
    new Dia({
      numero: 125,

      data: gerarDataAutomatica(125),
      dataFormatada: gerarDataFormatada(125),
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
    new Dia({
      numero: 126,

      data: gerarDataAutomatica(126),
      dataFormatada: gerarDataFormatada(126),
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
    new Dia({
      numero: 127,

      data: gerarDataAutomatica(127),
      dataFormatada: gerarDataFormatada(127),
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
    new Dia({
      numero: 128,

      data: gerarDataAutomatica(128),
      dataFormatada: gerarDataFormatada(128),
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
    new Dia({
      numero: 129,

      data: gerarDataAutomatica(129),
      dataFormatada: gerarDataFormatada(129),
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
    new Dia({
      numero: 130,

      data: gerarDataAutomatica(130),
      dataFormatada: gerarDataFormatada(130),
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
    new Dia({
      numero: 131,

      data: gerarDataAutomatica(131),
      dataFormatada: gerarDataFormatada(131),
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
    new Dia({
      numero: 132,

      data: gerarDataAutomatica(132),
      dataFormatada: gerarDataFormatada(132),
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
    new Dia({
      numero: 133,

      data: gerarDataAutomatica(133),
      dataFormatada: gerarDataFormatada(133),
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
    new Dia({
      numero: 134,

      data: gerarDataAutomatica(134),
      dataFormatada: gerarDataFormatada(134),
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
    new Dia({
      numero: 135,

      data: gerarDataAutomatica(135),
      dataFormatada: gerarDataFormatada(135),
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
    new Dia({
      numero: 136,

      data: gerarDataAutomatica(136),
      dataFormatada: gerarDataFormatada(136),
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
    new Dia({
      numero: 137,

      data: gerarDataAutomatica(137),
      dataFormatada: gerarDataFormatada(137),
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
    new Dia({
      numero: 138,

      data: gerarDataAutomatica(138),
      dataFormatada: gerarDataFormatada(138),
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
    new Dia({
      numero: 139,

      data: gerarDataAutomatica(139),
      dataFormatada: gerarDataFormatada(139),
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
    new Dia({
      numero: 140,

      data: gerarDataAutomatica(140),
      dataFormatada: gerarDataFormatada(140),
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
    new Dia({
      numero: 141,

      data: gerarDataAutomatica(141),
      dataFormatada: gerarDataFormatada(141),
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
    new Dia({
      numero: 142,

      data: gerarDataAutomatica(142),
      dataFormatada: gerarDataFormatada(142),
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
    new Dia({
      numero: 143,

      data: gerarDataAutomatica(143),
      dataFormatada: gerarDataFormatada(143),
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
    new Dia({
      numero: 144,

      data: gerarDataAutomatica(144),
      dataFormatada: gerarDataFormatada(144),
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
    new Dia({
      numero: 145,

      data: gerarDataAutomatica(145),
      dataFormatada: gerarDataFormatada(145),
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
    new Dia({
      numero: 146,

      data: gerarDataAutomatica(146),
      dataFormatada: gerarDataFormatada(146),
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
    new Dia({
      numero: 147,

      data: gerarDataAutomatica(147),
      dataFormatada: gerarDataFormatada(147),
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
    new Dia({
      numero: 148,

      data: gerarDataAutomatica(148),
      dataFormatada: gerarDataFormatada(148),
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
    new Dia({
      numero: 149,

      data: gerarDataAutomatica(149),
      dataFormatada: gerarDataFormatada(149),
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
    new Dia({
      numero: 150,

      data: gerarDataAutomatica(150),
      dataFormatada: gerarDataFormatada(150),
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
    new Dia({
      numero: 151,

      data: gerarDataAutomatica(151),
      dataFormatada: gerarDataFormatada(151),
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
    new Dia({
      numero: 152,

      data: gerarDataAutomatica(152),
      dataFormatada: gerarDataFormatada(152),
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
    new Dia({
      numero: 153,

      data: gerarDataAutomatica(153),
      dataFormatada: gerarDataFormatada(153),
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
    new Dia({
      numero: 154,

      data: gerarDataAutomatica(154),
      dataFormatada: gerarDataFormatada(154),
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
    new Dia({
      numero: 155,

      data: gerarDataAutomatica(155),
      dataFormatada: gerarDataFormatada(155),
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
    new Dia({
      numero: 156,

      data: gerarDataAutomatica(156),
      dataFormatada: gerarDataFormatada(156),
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
    new Dia({
      numero: 157,

      data: gerarDataAutomatica(157),
      dataFormatada: gerarDataFormatada(157),
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
    new Dia({
      numero: 158,

      data: gerarDataAutomatica(158),
      dataFormatada: gerarDataFormatada(158),
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
    new Dia({
      numero: 159,

      data: gerarDataAutomatica(159),
      dataFormatada: gerarDataFormatada(159),
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
    new Dia({
      numero: 160,

      data: gerarDataAutomatica(160),
      dataFormatada: gerarDataFormatada(160),
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
    new Dia({
      numero: 161,

      data: gerarDataAutomatica(161),
      dataFormatada: gerarDataFormatada(161),
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
    new Dia({
      numero: 162,

      data: gerarDataAutomatica(162),
      dataFormatada: gerarDataFormatada(162),
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
    new Dia({
      numero: 163,

      data: gerarDataAutomatica(163),
      dataFormatada: gerarDataFormatada(163),
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
    new Dia({
      numero: 164,

      data: gerarDataAutomatica(164),
      dataFormatada: gerarDataFormatada(164),
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
    new Dia({
      numero: 165,

      data: gerarDataAutomatica(165),
      dataFormatada: gerarDataFormatada(165),
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
    new Dia({
      numero: 166,

      data: gerarDataAutomatica(166),
      dataFormatada: gerarDataFormatada(166),
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
    new Dia({
      numero: 167,

      data: gerarDataAutomatica(167),
      dataFormatada: gerarDataFormatada(167),
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
    new Dia({
      numero: 168,

      data: gerarDataAutomatica(168),
      dataFormatada: gerarDataFormatada(168),
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
    new Dia({
      numero: 169,

      data: gerarDataAutomatica(169),
      dataFormatada: gerarDataFormatada(169),
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
    new Dia({
      numero: 170,

      data: gerarDataAutomatica(170),
      dataFormatada: gerarDataFormatada(170),
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
    new Dia({
      numero: 171,

      data: gerarDataAutomatica(171),
      dataFormatada: gerarDataFormatada(171),
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
    new Dia({
      numero: 172,

      data: gerarDataAutomatica(172),
      dataFormatada: gerarDataFormatada(172),
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
    new Dia({
      numero: 173,

      data: gerarDataAutomatica(173),
      dataFormatada: gerarDataFormatada(173),
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
    new Dia({
      numero: 174,

      data: gerarDataAutomatica(174),
      dataFormatada: gerarDataFormatada(174),
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
    new Dia({
      numero: 175,

      data: gerarDataAutomatica(175),
      dataFormatada: gerarDataFormatada(175),
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
    new Dia({
      numero: 176,

      data: gerarDataAutomatica(176),
      dataFormatada: gerarDataFormatada(176),
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
    new Dia({
      numero: 177,

      data: gerarDataAutomatica(177),
      dataFormatada: gerarDataFormatada(177),
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
    new Dia({
      numero: 178,

      data: gerarDataAutomatica(178),
      dataFormatada: gerarDataFormatada(178),
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
    new Dia({
      numero: 179,

      data: gerarDataAutomatica(179),
      dataFormatada: gerarDataFormatada(179),
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
    new Dia({
      numero: 180,

      data: gerarDataAutomatica(180),
      dataFormatada: gerarDataFormatada(180),
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
    new Dia({
      numero: 181,

      data: gerarDataAutomatica(181),
      dataFormatada: gerarDataFormatada(181),
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
    new Dia({
      numero: 182,

      data: gerarDataAutomatica(182),
      dataFormatada: gerarDataFormatada(182),
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
    new Dia({
      numero: 183,

      data: gerarDataAutomatica(183),
      dataFormatada: gerarDataFormatada(183),
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
    new Dia({
      numero: 184,

      data: gerarDataAutomatica(184),
      dataFormatada: gerarDataFormatada(184),
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
    new Dia({
      numero: 185,

      data: gerarDataAutomatica(185),
      dataFormatada: gerarDataFormatada(185),
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
    new Dia({
      numero: 186,

      data: gerarDataAutomatica(186),
      dataFormatada: gerarDataFormatada(186),
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
    new Dia({
      numero: 187,

      data: gerarDataAutomatica(187),
      dataFormatada: gerarDataFormatada(187),
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
    new Dia({
      numero: 188,

      data: gerarDataAutomatica(188),
      dataFormatada: gerarDataFormatada(188),
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
    new Dia({
      numero: 189,

      data: gerarDataAutomatica(189),
      dataFormatada: gerarDataFormatada(189),
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
    new Dia({
      numero: 190,

      data: gerarDataAutomatica(190),
      dataFormatada: gerarDataFormatada(190),
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
    new Dia({
      numero: 191,

      data: gerarDataAutomatica(191),
      dataFormatada: gerarDataFormatada(191),
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
    new Dia({
      numero: 192,

      data: gerarDataAutomatica(192),
      dataFormatada: gerarDataFormatada(192),
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
    new Dia({
      numero: 193,

      data: gerarDataAutomatica(193),
      dataFormatada: gerarDataFormatada(193),
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
    new Dia({
      numero: 194,

      data: gerarDataAutomatica(194),
      dataFormatada: gerarDataFormatada(194),
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
    new Dia({
      numero: 195,

      data: gerarDataAutomatica(195),
      dataFormatada: gerarDataFormatada(195),
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
    new Dia({
      numero: 196,

      data: gerarDataAutomatica(196),
      dataFormatada: gerarDataFormatada(196),
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
    new Dia({
      numero: 197,

      data: gerarDataAutomatica(197),
      dataFormatada: gerarDataFormatada(197),
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
    new Dia({
      numero: 198,

      data: gerarDataAutomatica(198),
      dataFormatada: gerarDataFormatada(198),
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
    new Dia({
      numero: 199,

      data: gerarDataAutomatica(199),
      dataFormatada: gerarDataFormatada(199),
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
    new Dia({
      numero: 200,

      data: gerarDataAutomatica(200),
      dataFormatada: gerarDataFormatada(200),
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
    new Dia({
      numero: 201,

      data: gerarDataAutomatica(201),
      dataFormatada: gerarDataFormatada(201),
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
    new Dia({
      numero: 202,

      data: gerarDataAutomatica(202),
      dataFormatada: gerarDataFormatada(202),
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
    new Dia({
      numero: 203,

      data: gerarDataAutomatica(203),
      dataFormatada: gerarDataFormatada(203),
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
    new Dia({
      numero: 204,

      data: gerarDataAutomatica(204),
      dataFormatada: gerarDataFormatada(204),
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
    new Dia({
      numero: 205,

      data: gerarDataAutomatica(205),
      dataFormatada: gerarDataFormatada(205),
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
    new Dia({
      numero: 206,

      data: gerarDataAutomatica(206),
      dataFormatada: gerarDataFormatada(206),
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
    new Dia({
      numero: 207,

      data: gerarDataAutomatica(207),
      dataFormatada: gerarDataFormatada(207),
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
    new Dia({
      numero: 208,

      data: gerarDataAutomatica(208),
      dataFormatada: gerarDataFormatada(208),
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
    new Dia({
      numero: 209,

      data: gerarDataAutomatica(209),
      dataFormatada: gerarDataFormatada(209),
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
    new Dia({
      numero: 210,

      data: gerarDataAutomatica(210),
      dataFormatada: gerarDataFormatada(210),
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
    new Dia({
      numero: 211,

      data: gerarDataAutomatica(211),
      dataFormatada: gerarDataFormatada(211),
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
    new Dia({
      numero: 212,

      data: gerarDataAutomatica(212),
      dataFormatada: gerarDataFormatada(212),
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
    new Dia({
      numero: 213,

      data: gerarDataAutomatica(213),
      dataFormatada: gerarDataFormatada(213),
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
    new Dia({
      numero: 214,

      data: gerarDataAutomatica(214),
      dataFormatada: gerarDataFormatada(214),
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
    new Dia({
      numero: 215,

      data: gerarDataAutomatica(215),
      dataFormatada: gerarDataFormatada(215),
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
    new Dia({
      numero: 216,

      data: gerarDataAutomatica(216),
      dataFormatada: gerarDataFormatada(216),
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
    new Dia({
      numero: 217,

      data: gerarDataAutomatica(217),
      dataFormatada: gerarDataFormatada(217),
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
    new Dia({
      numero: 218,

      data: gerarDataAutomatica(218),
      dataFormatada: gerarDataFormatada(218),
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
    new Dia({
      numero: 219,

      data: gerarDataAutomatica(219),
      dataFormatada: gerarDataFormatada(219),
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
    new Dia({
      numero: 220,

      data: gerarDataAutomatica(220),
      dataFormatada: gerarDataFormatada(220),
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
    new Dia({
      numero: 221,

      data: gerarDataAutomatica(221),
      dataFormatada: gerarDataFormatada(221),
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
    new Dia({
      numero: 222,

      data: gerarDataAutomatica(222),
      dataFormatada: gerarDataFormatada(222),
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
    new Dia({
      numero: 223,

      data: gerarDataAutomatica(223),
      dataFormatada: gerarDataFormatada(223),
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
    new Dia({
      numero: 224,

      data: gerarDataAutomatica(224),
      dataFormatada: gerarDataFormatada(224),
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
    new Dia({
      numero: 225,

      data: gerarDataAutomatica(225),
      dataFormatada: gerarDataFormatada(225),
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
    new Dia({
      numero: 226,

      data: gerarDataAutomatica(226),
      dataFormatada: gerarDataFormatada(226),
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
    new Dia({
      numero: 227,

      data: gerarDataAutomatica(227),
      dataFormatada: gerarDataFormatada(227),
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
    new Dia({
      numero: 228,

      data: gerarDataAutomatica(228),
      dataFormatada: gerarDataFormatada(228),
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
    new Dia({
      numero: 229,

      data: gerarDataAutomatica(229),
      dataFormatada: gerarDataFormatada(229),
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
    new Dia({
      numero: 230,

      data: gerarDataAutomatica(230),
      dataFormatada: gerarDataFormatada(230),
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
    new Dia({
      numero: 231,

      data: gerarDataAutomatica(231),
      dataFormatada: gerarDataFormatada(231),
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
    new Dia({
      numero: 232,

      data: gerarDataAutomatica(232),
      dataFormatada: gerarDataFormatada(232),
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
    new Dia({
      numero: 233,

      data: gerarDataAutomatica(233),
      dataFormatada: gerarDataFormatada(233),
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
    new Dia({
      numero: 234,

      data: gerarDataAutomatica(234),
      dataFormatada: gerarDataFormatada(234),
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
    new Dia({
      numero: 235,

      data: gerarDataAutomatica(235),
      dataFormatada: gerarDataFormatada(235),
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
    new Dia({
      numero: 236,

      data: gerarDataAutomatica(236),
      dataFormatada: gerarDataFormatada(236),
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
    new Dia({
      numero: 237,

      data: gerarDataAutomatica(237),
      dataFormatada: gerarDataFormatada(237),
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
    new Dia({
      numero: 238,

      data: gerarDataAutomatica(238),
      dataFormatada: gerarDataFormatada(238),
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
    new Dia({
      numero: 239,

      data: gerarDataAutomatica(239),
      dataFormatada: gerarDataFormatada(239),
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
    new Dia({
      numero: 240,

      data: gerarDataAutomatica(240),
      dataFormatada: gerarDataFormatada(240),
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
    new Dia({
      numero: 241,

      data: gerarDataAutomatica(241),
      dataFormatada: gerarDataFormatada(241),
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
    new Dia({
      numero: 242,

      data: gerarDataAutomatica(242),
      dataFormatada: gerarDataFormatada(242),
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
    new Dia({
      numero: 243,

      data: gerarDataAutomatica(243),
      dataFormatada: gerarDataFormatada(243),
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
    new Dia({
      numero: 244,

      data: gerarDataAutomatica(244),
      dataFormatada: gerarDataFormatada(244),
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
    new Dia({
      numero: 245,

      data: gerarDataAutomatica(245),
      dataFormatada: gerarDataFormatada(245),
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
    new Dia({
      numero: 246,

      data: gerarDataAutomatica(246),
      dataFormatada: gerarDataFormatada(246),
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
    new Dia({
      numero: 247,

      data: gerarDataAutomatica(247),
      dataFormatada: gerarDataFormatada(247),
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
    new Dia({
      numero: 248,

      data: gerarDataAutomatica(248),
      dataFormatada: gerarDataFormatada(248),
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
    new Dia({
      numero: 249,

      data: gerarDataAutomatica(249),
      dataFormatada: gerarDataFormatada(249),
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
    new Dia({
      numero: 250,

      data: gerarDataAutomatica(250),
      dataFormatada: gerarDataFormatada(250),
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
    new Dia({
      numero: 251,

      data: gerarDataAutomatica(251),
      dataFormatada: gerarDataFormatada(251),
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
    new Dia({
      numero: 252,

      data: gerarDataAutomatica(252),
      dataFormatada: gerarDataFormatada(252),
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
    new Dia({
      numero: 253,

      data: gerarDataAutomatica(253),
      dataFormatada: gerarDataFormatada(253),
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
    new Dia({
      numero: 254,

      data: gerarDataAutomatica(254),
      dataFormatada: gerarDataFormatada(254),
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
    new Dia({
      numero: 255,

      data: gerarDataAutomatica(255),
      dataFormatada: gerarDataFormatada(255),
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
    new Dia({
      numero: 256,

      data: gerarDataAutomatica(256),
      dataFormatada: gerarDataFormatada(256),
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
    new Dia({
      numero: 257,

      data: gerarDataAutomatica(257),
      dataFormatada: gerarDataFormatada(257),
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
    new Dia({
      numero: 258,

      data: gerarDataAutomatica(258),
      dataFormatada: gerarDataFormatada(258),
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
    new Dia({
      numero: 259,

      data: gerarDataAutomatica(259),
      dataFormatada: gerarDataFormatada(259),
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
    new Dia({
      numero: 260,

      data: gerarDataAutomatica(260),
      dataFormatada: gerarDataFormatada(260),
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
    new Dia({
      numero: 261,

      data: gerarDataAutomatica(261),
      dataFormatada: gerarDataFormatada(261),
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
    new Dia({
      numero: 262,

      data: gerarDataAutomatica(262),
      dataFormatada: gerarDataFormatada(262),
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
    new Dia({
      numero: 263,

      data: gerarDataAutomatica(263),
      dataFormatada: gerarDataFormatada(263),
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
    new Dia({
      numero: 264,

      data: gerarDataAutomatica(264),
      dataFormatada: gerarDataFormatada(264),
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
    new Dia({
      numero: 265,

      data: gerarDataAutomatica(265),
      dataFormatada: gerarDataFormatada(265),
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
    new Dia({
      numero: 266,

      data: gerarDataAutomatica(266),
      dataFormatada: gerarDataFormatada(266),
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
    new Dia({
      numero: 267,

      data: gerarDataAutomatica(267),
      dataFormatada: gerarDataFormatada(267),
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
    new Dia({
      numero: 268,

      data: gerarDataAutomatica(268),
      dataFormatada: gerarDataFormatada(268),
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
    new Dia({
      numero: 269,

      data: gerarDataAutomatica(269),
      dataFormatada: gerarDataFormatada(269),
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
    new Dia({
      numero: 270,

      data: gerarDataAutomatica(270),
      dataFormatada: gerarDataFormatada(270),
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
    new Dia({
      numero: 271,

      data: gerarDataAutomatica(271),
      dataFormatada: gerarDataFormatada(271),
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
    new Dia({
      numero: 272,

      data: gerarDataAutomatica(272),
      dataFormatada: gerarDataFormatada(272),
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
    new Dia({
      numero: 273,

      data: gerarDataAutomatica(273),
      dataFormatada: gerarDataFormatada(273),
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
    new Dia({
      numero: 274,

      data: gerarDataAutomatica(274),
      dataFormatada: gerarDataFormatada(274),
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
    new Dia({
      numero: 275,

      data: gerarDataAutomatica(275),
      dataFormatada: gerarDataFormatada(275),
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
    new Dia({
      numero: 276,

      data: gerarDataAutomatica(276),
      dataFormatada: gerarDataFormatada(276),
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
    new Dia({
      numero: 277,

      data: gerarDataAutomatica(277),
      dataFormatada: gerarDataFormatada(277),
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
    new Dia({
      numero: 278,

      data: gerarDataAutomatica(278),
      dataFormatada: gerarDataFormatada(278),
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
    new Dia({
      numero: 279,

      data: gerarDataAutomatica(279),
      dataFormatada: gerarDataFormatada(279),
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
    new Dia({
      numero: 280,

      data: gerarDataAutomatica(280),
      dataFormatada: gerarDataFormatada(280),
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
    new Dia({
      numero: 281,

      data: gerarDataAutomatica(281),
      dataFormatada: gerarDataFormatada(281),
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
    new Dia({
      numero: 282,

      data: gerarDataAutomatica(282),
      dataFormatada: gerarDataFormatada(282),
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
    new Dia({
      numero: 283,

      data: gerarDataAutomatica(283),
      dataFormatada: gerarDataFormatada(283),
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
    new Dia({
      numero: 284,

      data: gerarDataAutomatica(284),
      dataFormatada: gerarDataFormatada(284),
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
    new Dia({
      numero: 285,

      data: gerarDataAutomatica(285),
      dataFormatada: gerarDataFormatada(285),
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
    new Dia({
      numero: 286,

      data: gerarDataAutomatica(286),
      dataFormatada: gerarDataFormatada(286),
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
    new Dia({
      numero: 287,

      data: gerarDataAutomatica(287),
      dataFormatada: gerarDataFormatada(287),
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
    new Dia({
      numero: 288,

      data: gerarDataAutomatica(288),
      dataFormatada: gerarDataFormatada(288),
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
    new Dia({
      numero: 289,

      data: gerarDataAutomatica(289),
      dataFormatada: gerarDataFormatada(289),
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
    new Dia({
      numero: 290,

      data: gerarDataAutomatica(290),
      dataFormatada: gerarDataFormatada(290),
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
    new Dia({
      numero: 291,

      data: gerarDataAutomatica(291),
      dataFormatada: gerarDataFormatada(291),
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
    new Dia({
      numero: 292,

      data: gerarDataAutomatica(292),
      dataFormatada: gerarDataFormatada(292),
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
    new Dia({
      numero: 293,

      data: gerarDataAutomatica(293),
      dataFormatada: gerarDataFormatada(293),
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
    new Dia({
      numero: 294,

      data: gerarDataAutomatica(294),
      dataFormatada: gerarDataFormatada(294),
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
    new Dia({
      numero: 295,

      data: gerarDataAutomatica(295),
      dataFormatada: gerarDataFormatada(295),
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
    new Dia({
      numero: 296,

      data: gerarDataAutomatica(296),
      dataFormatada: gerarDataFormatada(296),
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
    new Dia({
      numero: 297,

      data: gerarDataAutomatica(297),
      dataFormatada: gerarDataFormatada(297),
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
    new Dia({
      numero: 298,

      data: gerarDataAutomatica(298),
      dataFormatada: gerarDataFormatada(298),
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
    new Dia({
      numero: 299,

      data: gerarDataAutomatica(299),
      dataFormatada: gerarDataFormatada(299),
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
    new Dia({
      numero: 300,

      data: gerarDataAutomatica(300),
      dataFormatada: gerarDataFormatada(300),
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
    new Dia({
      numero: 301,

      data: gerarDataAutomatica(301),
      dataFormatada: gerarDataFormatada(301),
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
    new Dia({
      numero: 302,

      data: gerarDataAutomatica(302),
      dataFormatada: gerarDataFormatada(302),
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
    new Dia({
      numero: 303,

      data: gerarDataAutomatica(303),
      dataFormatada: gerarDataFormatada(303),
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
    new Dia({
      numero: 304,

      data: gerarDataAutomatica(304),
      dataFormatada: gerarDataFormatada(304),
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
    new Dia({
      numero: 305,

      data: gerarDataAutomatica(305),
      dataFormatada: gerarDataFormatada(305),
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
    new Dia({
      numero: 306,

      data: gerarDataAutomatica(306),
      dataFormatada: gerarDataFormatada(306),
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
    new Dia({
      numero: 307,

      data: gerarDataAutomatica(307),
      dataFormatada: gerarDataFormatada(307),
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
    new Dia({
      numero: 308,

      data: gerarDataAutomatica(308),
      dataFormatada: gerarDataFormatada(308),
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
    new Dia({
      numero: 309,

      data: gerarDataAutomatica(309),
      dataFormatada: gerarDataFormatada(309),
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
    new Dia({
      numero: 310,

      data: gerarDataAutomatica(310),
      dataFormatada: gerarDataFormatada(310),
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
    new Dia({
      numero: 311,

      data: gerarDataAutomatica(311),
      dataFormatada: gerarDataFormatada(311),
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
    new Dia({
      numero: 312,

      data: gerarDataAutomatica(312),
      dataFormatada: gerarDataFormatada(312),
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
    new Dia({
      numero: 313,

      data: gerarDataAutomatica(313),
      dataFormatada: gerarDataFormatada(313),
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
    new Dia({
      numero: 314,

      data: gerarDataAutomatica(314),
      dataFormatada: gerarDataFormatada(314),
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
    new Dia({
      numero: 315,

      data: gerarDataAutomatica(315),
      dataFormatada: gerarDataFormatada(315),
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
    new Dia({
      numero: 316,

      data: gerarDataAutomatica(316),
      dataFormatada: gerarDataFormatada(316),
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
    new Dia({
      numero: 317,

      data: gerarDataAutomatica(317),
      dataFormatada: gerarDataFormatada(317),
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

  /* --------------------------------------------------------------------------
     MÉTODOS DE ACESSO (CONTRATO FUNCIONAL)
  -------------------------------------------------------------------------- */

  getDia(numero) {
    return this.dias.find((dia) => dia.numero === numero);
  },

  getDias() {
    return this.dias;
  },
};

/* --------------------------------------------------------------------------
   VALIDAÇÃO DO CONTRATO
-------------------------------------------------------------------------- */

validarPlano(planoCronologico);

/* --------------------------------------------------------------------------
   EXPORTAÇÃO
   --------------------------------------------------------------------------
   Exporta apenas o plano principal
   As funções de data não são mais exportadas pois estão centralizadas
   em utils/geradorDatas.js
-------------------------------------------------------------------------- */

export default planoCronologico;
