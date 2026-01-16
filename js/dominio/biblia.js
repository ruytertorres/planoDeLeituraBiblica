/* ============================================================================
   biblia.js — Catálogo Estrutural da Bíblia
   Versão: 0.3.0
   Aplicação: Leitura Controlada da Bíblia

   RESPONSABILIDADE ÚNICA:
   ----------------------------------------------------------------------------
   - Definir a estrutura oficial e imutável da Bíblia
   - Servir como fonte de verdade para livros, capítulos e versículos
   - Fornecer navegação estrutural (não planos)
============================================================================ */

/* ============================================================================
   ENUMERAÇÃO DE TESTAMENTOS
============================================================================ */

export const TESTAMENTOS = Object.freeze({
  ANTIGO: "Antigo Testamento",
  NOVO: "Novo Testamento",
});

/* ============================================================================
   CATÁLOGO BÍBLICO (66 LIVROS — VALIDADO)
============================================================================ */

export const BIBLIA = Object.freeze([
  // === ANTIGO TESTAMENTO (39) ===
  { id: "genesis", nome: "Gênesis", testamento: TESTAMENTOS.ANTIGO, capitulos: 50, versiculos: 1533, ordemCronologica: 1 },
  { id: "exodo", nome: "Êxodo", testamento: TESTAMENTOS.ANTIGO, capitulos: 40, versiculos: 1213, ordemCronologica: 2 },
  { id: "levitico", nome: "Levítico", testamento: TESTAMENTOS.ANTIGO, capitulos: 27, versiculos: 859, ordemCronologica: 3 },
  { id: "numeros", nome: "Números", testamento: TESTAMENTOS.ANTIGO, capitulos: 36, versiculos: 1288, ordemCronologica: 4 },
  { id: "deuteronomio", nome: "Deuteronômio", testamento: TESTAMENTOS.ANTIGO, capitulos: 34, versiculos: 959, ordemCronologica: 5 },

  { id: "josue", nome: "Josué", testamento: TESTAMENTOS.ANTIGO, capitulos: 24, versiculos: 658, ordemCronologica: 6 },
  { id: "juizes", nome: "Juízes", testamento: TESTAMENTOS.ANTIGO, capitulos: 21, versiculos: 618, ordemCronologica: 7 },
  { id: "rute", nome: "Rute", testamento: TESTAMENTOS.ANTIGO, capitulos: 4, versiculos: 85, ordemCronologica: 8 },

  { id: "1samuel", nome: "1 Samuel", testamento: TESTAMENTOS.ANTIGO, capitulos: 31, versiculos: 810, ordemCronologica: 9 },
  { id: "2samuel", nome: "2 Samuel", testamento: TESTAMENTOS.ANTIGO, capitulos: 24, versiculos: 695, ordemCronologica: 10 },
  { id: "1reis", nome: "1 Reis", testamento: TESTAMENTOS.ANTIGO, capitulos: 22, versiculos: 816, ordemCronologica: 11 },
  { id: "2reis", nome: "2 Reis", testamento: TESTAMENTOS.ANTIGO, capitulos: 25, versiculos: 719, ordemCronologica: 12 },

  { id: "1cronicas", nome: "1 Crônicas", testamento: TESTAMENTOS.ANTIGO, capitulos: 29, versiculos: 942, ordemCronologica: 13 },
  { id: "2cronicas", nome: "2 Crônicas", testamento: TESTAMENTOS.ANTIGO, capitulos: 36, versiculos: 822, ordemCronologica: 14 },
  { id: "esdras", nome: "Esdras", testamento: TESTAMENTOS.ANTIGO, capitulos: 10, versiculos: 280, ordemCronologica: 15 },
  { id: "neemias", nome: "Neemias", testamento: TESTAMENTOS.ANTIGO, capitulos: 13, versiculos: 406, ordemCronologica: 16 },
  { id: "ester", nome: "Ester", testamento: TESTAMENTOS.ANTIGO, capitulos: 10, versiculos: 167, ordemCronologica: 17 },

  { id: "jo", nome: "Jó", testamento: TESTAMENTOS.ANTIGO, capitulos: 42, versiculos: 1070, ordemCronologica: 18 },
  { id: "salmos", nome: "Salmos", testamento: TESTAMENTOS.ANTIGO, capitulos: 150, versiculos: 2461, ordemCronologica: 19 },
  { id: "proverbios", nome: "Provérbios", testamento: TESTAMENTOS.ANTIGO, capitulos: 31, versiculos: 915, ordemCronologica: 20 },
  { id: "eclesiastes", nome: "Eclesiastes", testamento: TESTAMENTOS.ANTIGO, capitulos: 12, versiculos: 222, ordemCronologica: 21 },
  { id: "cantares", nome: "Cantares", testamento: TESTAMENTOS.ANTIGO, capitulos: 8, versiculos: 117, ordemCronologica: 22 },

  { id: "isaias", nome: "Isaías", testamento: TESTAMENTOS.ANTIGO, capitulos: 66, versiculos: 1292, ordemCronologica: 23 },
  { id: "jeremias", nome: "Jeremias", testamento: TESTAMENTOS.ANTIGO, capitulos: 52, versiculos: 1364, ordemCronologica: 24 },
  { id: "lamentacoes", nome: "Lamentações", testamento: TESTAMENTOS.ANTIGO, capitulos: 5, versiculos: 154, ordemCronologica: 25 },
  { id: "ezequiel", nome: "Ezequiel", testamento: TESTAMENTOS.ANTIGO, capitulos: 48, versiculos: 1273, ordemCronologica: 26 },
  { id: "daniel", nome: "Daniel", testamento: TESTAMENTOS.ANTIGO, capitulos: 12, versiculos: 357, ordemCronologica: 27 },

  // === NOVO TESTAMENTO (27) ===
  { id: "mateus", nome: "Mateus", testamento: TESTAMENTOS.NOVO, capitulos: 28, versiculos: 1071, ordemCronologica: 28 },
  { id: "marcos", nome: "Marcos", testamento: TESTAMENTOS.NOVO, capitulos: 16, versiculos: 678, ordemCronologica: 29 },
  { id: "lucas", nome: "Lucas", testamento: TESTAMENTOS.NOVO, capitulos: 24, versiculos: 1151, ordemCronologica: 30 },
  { id: "joao", nome: "João", testamento: TESTAMENTOS.NOVO, capitulos: 21, versiculos: 879, ordemCronologica: 31 },
  { id: "atos", nome: "Atos dos Apóstolos", testamento: TESTAMENTOS.NOVO, capitulos: 28, versiculos: 1007, ordemCronologica: 32 },

  { id: "romanos", nome: "Romanos", testamento: TESTAMENTOS.NOVO, capitulos: 16, versiculos: 433, ordemCronologica: 33 },
  { id: "1corintios", nome: "1 Coríntios", testamento: TESTAMENTOS.NOVO, capitulos: 16, versiculos: 437, ordemCronologica: 34 },
  { id: "2corintios", nome: "2 Coríntios", testamento: TESTAMENTOS.NOVO, capitulos: 13, versiculos: 257, ordemCronologica: 35 },
  { id: "galatas", nome: "Gálatas", testamento: TESTAMENTOS.NOVO, capitulos: 6, versiculos: 149, ordemCronologica: 36 },
  { id: "efesios", nome: "Efésios", testamento: TESTAMENTOS.NOVO, capitulos: 6, versiculos: 155, ordemCronologica: 37 },
  { id: "filipenses", nome: "Filipenses", testamento: TESTAMENTOS.NOVO, capitulos: 4, versiculos: 104, ordemCronologica: 38 },
  { id: "colossenses", nome: "Colossenses", testamento: TESTAMENTOS.NOVO, capitulos: 4, versiculos: 95, ordemCronologica: 39 },
  { id: "1tessalonicenses", nome: "1 Tessalonicenses", testamento: TESTAMENTOS.NOVO, capitulos: 5, versiculos: 89, ordemCronologica: 40 },
  { id: "2tessalonicenses", nome: "2 Tessalonicenses", testamento: TESTAMENTOS.NOVO, capitulos: 3, versiculos: 47, ordemCronologica: 41 },
  { id: "1timoteo", nome: "1 Timóteo", testamento: TESTAMENTOS.NOVO, capitulos: 6, versiculos: 113, ordemCronologica: 42 },
  { id: "2timoteo", nome: "2 Timóteo", testamento: TESTAMENTOS.NOVO, capitulos: 4, versiculos: 83, ordemCronologica: 43 },
  { id: "tito", nome: "Tito", testamento: TESTAMENTOS.NOVO, capitulos: 3, versiculos: 46, ordemCronologica: 44 },
  { id: "filemom", nome: "Filemom", testamento: TESTAMENTOS.NOVO, capitulos: 1, versiculos: 25, ordemCronologica: 45 },
  { id: "hebreus", nome: "Hebreus", testamento: TESTAMENTOS.NOVO, capitulos: 13, versiculos: 303, ordemCronologica: 46 },
  { id: "tiago", nome: "Tiago", testamento: TESTAMENTOS.NOVO, capitulos: 5, versiculos: 108, ordemCronologica: 47 },
  { id: "1pedro", nome: "1 Pedro", testamento: TESTAMENTOS.NOVO, capitulos: 5, versiculos: 105, ordemCronologica: 48 },
  { id: "2pedro", nome: "2 Pedro", testamento: TESTAMENTOS.NOVO, capitulos: 3, versiculos: 61, ordemCronologica: 49 },
  { id: "1joao", nome: "1 João", testamento: TESTAMENTOS.NOVO, capitulos: 5, versiculos: 105, ordemCronologica: 50 },
  { id: "2joao", nome: "2 João", testamento: TESTAMENTOS.NOVO, capitulos: 1, versiculos: 13, ordemCronologica: 51 },
  { id: "3joao", nome: "3 João", testamento: TESTAMENTOS.NOVO, capitulos: 1, versiculos: 15, ordemCronologica: 52 },
  { id: "judas", nome: "Judas", testamento: TESTAMENTOS.NOVO, capitulos: 1, versiculos: 25, ordemCronologica: 53 },
  { id: "apocalipse", nome: "Apocalipse", testamento: TESTAMENTOS.NOVO, capitulos: 22, versiculos: 404, ordemCronologica: 54 },
]);

/* ============================================================================
   ÍNDICES DERIVADOS (API DE DOMÍNIO)
============================================================================ */

export const LIVROS_POR_ID = Object.freeze(
  Object.fromEntries(BIBLIA.map(l => [l.id, l]))
);

export const LIVROS_CRONOLOGICOS = Object.freeze(
  [...BIBLIA].sort((a, b) => a.ordemCronologica - b.ordemCronologica)
);

/* ============================================================================
   FUNÇÕES ESTRUTURAIS (NÃO É PLANO)
============================================================================ */

export function livroExiste(id) {
  return Boolean(LIVROS_POR_ID[id]);
}

export function capituloExiste(livroId, capitulo) {
  const livro = LIVROS_POR_ID[livroId];
  return livro ? capitulo >= 1 && capitulo <= livro.capitulos : false;
}

export function proximoCapitulo(livroId, capituloAtual) {
  const livro = LIVROS_POR_ID[livroId];
  if (!livro) return null;

  if (capituloAtual < livro.capitulos) {
    return { livroId, capitulo: capituloAtual + 1 };
  }

  const index = LIVROS_CRONOLOGICOS.findIndex(l => l.id === livroId);
  const proximoLivro = LIVROS_CRONOLOGICOS[index + 1];
  if (!proximoLivro) return null;

  return { livroId: proximoLivro.id, capitulo: 1 };
}

/* ============================================================================
   FUNÇÕES DE CONSULTA SIMPLES (COMPATIBILIDADE)
============================================================================ */

export function getLivrosPorTestamento(testamento) {
  return BIBLIA.filter(livro => livro.testamento === testamento);
}

export function getLivroPorId(id) {
  return LIVROS_POR_ID[id];
}
