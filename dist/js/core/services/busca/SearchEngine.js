"use strict";
/* ============================================================================
   SearchEngine.js — Mecanismo de Busca do Plano de Leitura
   Versão: 1.0.0
   Aplicação: Leitura Bíblica Cronológica

   RESPONSABILIDADE:
   ----------------------------------------------------------------------------
   - Indexar o plano de leitura para buscas rápidas
   - Buscar por:
     1. Número do dia (ex: "Dia 15", "15")
     2. Capítulos (ex: "Gênesis 1", "Mateus 5-7")
     3. Livros (ex: "Salmos", "Apocalipse")
   - Retornar resultados relevantes com metadata
============================================================================ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchEngine = void 0;
class SearchEngine {
    constructor(plano) {
        if (!plano || !Array.isArray(plano.dias)) {
            throw new Error("Plano inválido fornecido ao SearchEngine");
        }
        this.plano = plano;
        this.index = this._criarIndice();
    }
    /* --------------------------------------------------------------------------
       CRIAÇÃO DO ÍNDICE PARA BUSCA RÁPIDA
    -------------------------------------------------------------------------- */
    _criarIndice() {
        const index = {
            porNumeroDia: new Map(), // Mapa dia número → objeto dia
            porLivro: new Map(), // Mapa nome livro → dias[]
            porCapitulo: new Map(), // Mapa "livro:capítulo" → dias[]
            porTexto: [] // Array para busca por texto livre
        };
        this.plano.dias.forEach(dia => {
            const diaNumero = dia.numero;
            // 1. Indexar por número do dia
            index.porNumeroDia.set(diaNumero, dia);
            // 2. Indexar por texto livre (para busca geral)
            index.porTexto.push({
                dia: diaNumero,
                texto: `Dia ${diaNumero} - ${dia.dataFormatada}`,
                type: 'dia'
            });
            // 3. Indexar leituras do Antigo Testamento
            if (dia.antigoTestamento && Array.isArray(dia.antigoTestamento)) {
                dia.antigoTestamento.forEach(leitura => {
                    this._indexarLeitura(index, leitura, diaNumero);
                });
            }
            // 4. Indexar leituras do Novo Testamento
            if (dia.novoTestamento && Array.isArray(dia.novoTestamento)) {
                dia.novoTestamento.forEach(leitura => {
                    this._indexarLeitura(index, leitura, diaNumero);
                });
            }
        });
        return index;
    }
    /* --------------------------------------------------------------------------
       INDEXAR UMA LEITURA ESPECÍFICA
    -------------------------------------------------------------------------- */
    _indexarLeitura(index, leitura, diaNumero) {
        const livroNome = leitura.livroNome || leitura.livroId;
        const capituloInicio = leitura.capituloInicio;
        const capituloFim = leitura.capituloFim || capituloInicio;
        // Indexar por livro
        if (!index.porLivro.has(livroNome)) {
            index.porLivro.set(livroNome, []);
        }
        index.porLivro.get(livroNome).push({
            dia: diaNumero,
            capituloInicio,
            capituloFim,
            type: 'livro'
        });
        // Indexar por capítulos específicos
        for (let capitulo = capituloInicio; capitulo <= capituloFim; capitulo++) {
            const chave = `${livroNome}:${capitulo}`;
            if (!index.porCapitulo.has(chave)) {
                index.porCapitulo.set(chave, []);
            }
            index.porCapitulo.get(chave).push({
                dia: diaNumero,
                capitulo,
                type: 'capitulo'
            });
            // Adicionar ao índice de texto para busca livre
            index.porTexto.push({
                dia: diaNumero,
                texto: `${livroNome} ${capitulo}`,
                type: 'capitulo'
            });
        }
        // Adicionar referência completa ao índice de texto
        if (capituloInicio === capituloFim) {
            index.porTexto.push({
                dia: diaNumero,
                texto: `${livroNome} ${capituloInicio}`,
                type: 'capitulo'
            });
        }
        else {
            index.porTexto.push({
                dia: diaNumero,
                texto: `${livroNome} ${capituloInicio}-${capituloFim}`,
                type: 'cap_range'
            });
        }
    }
    /* --------------------------------------------------------------------------
       BUSCAR POR TERMO
    -------------------------------------------------------------------------- */
    buscar(termo) {
        if (!termo || termo.trim() === '') {
            return [];
        }
        const termoLower = termo.toLowerCase().trim();
        const resultados = new Set();
        const matches = [];
        // 1. Buscar por número do dia (ex: "15", "dia 15")
        const numeroMatch = termoLower.match(/(?:dia\s*)?(\d+)/);
        if (numeroMatch) {
            const numeroDia = parseInt(numeroMatch[1]);
            const dia = this.index.porNumeroDia.get(numeroDia);
            if (dia) {
                matches.push({
                    type: 'dia',
                    dia: numeroDia,
                    title: `Dia ${numeroDia}`,
                    subtitle: dia.dataFormatada,
                    score: 100,
                    data: dia
                });
                resultados.add(numeroDia);
            }
        }
        // 2. Buscar por livro e capítulo (ex: "Gênesis 1", "Mateus 5-7")
        const livroCapituloMatch = termoLower.match(/([a-záéíóúãõâêîôûç\s]+)\s+(\d+)(?:\s*[-–]\s*(\d+))?/);
        if (livroCapituloMatch) {
            const [, livroNome, capInicioStr, capFimStr] = livroCapituloMatch;
            const livroNomeNormalizado = livroNome.trim();
            const capInicio = parseInt(capInicioStr);
            const capFim = capFimStr ? parseInt(capFimStr) : capInicio;
            // Buscar no índice por capítulos
            for (let capitulo = capInicio; capitulo <= capFim; capitulo++) {
                const chave = `${livroNomeNormalizado}:${capitulo}`;
                const diasComEsteCapitulo = this.index.porCapitulo.get(chave);
                if (diasComEsteCapitulo) {
                    diasComEsteCapitulo.forEach(item => {
                        if (!resultados.has(item.dia)) {
                            matches.push({
                                type: 'capitulo',
                                dia: item.dia,
                                title: `${livroNomeNormalizado} ${capitulo}`,
                                subtitle: `Dia ${item.dia}`,
                                score: 90,
                                data: this.index.porNumeroDia.get(item.dia)
                            });
                            resultados.add(item.dia);
                        }
                    });
                }
            }
        }
        // 3. Buscar apenas por nome do livro (ex: "Salmos", "Apocalipse")
        const livroMatch = termoLower.match(/^[a-záéíóúãõâêîôûç\s]+$/);
        if (livroMatch && !livroCapituloMatch) {
            const livroNome = termoLower.trim();
            const diasComEsteLivro = this.index.porLivro.get(livroNome);
            if (diasComEsteLivro) {
                diasComEsteLivro.forEach(item => {
                    if (!resultados.has(item.dia)) {
                        matches.push({
                            type: 'livro',
                            dia: item.dia,
                            title: livroNome,
                            subtitle: `Capítulos ${item.capituloInicio}-${item.capituloFim} - Dia ${item.dia}`,
                            score: 80,
                            data: this.index.porNumeroDia.get(item.dia)
                        });
                        resultados.add(item.dia);
                    }
                });
            }
        }
        // 4. Busca por texto livre (fallback)
        if (matches.length === 0) {
            this.index.porTexto.forEach(item => {
                if (item.texto.toLowerCase().includes(termoLower) && !resultados.has(item.dia)) {
                    matches.push({
                        type: item.type,
                        dia: item.dia,
                        title: item.texto,
                        subtitle: `Dia ${item.dia}`,
                        score: 70,
                        data: this.index.porNumeroDia.get(item.dia)
                    });
                    resultados.add(item.dia);
                }
            });
        }
        // Ordenar por score (relevância) e limitar resultados
        return matches
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
    }
    /* --------------------------------------------------------------------------
       ESTATÍSTICAS DO ÍNDICE (para debug)
    -------------------------------------------------------------------------- */
    getEstatisticas() {
        return {
            totalDias: this.index.porNumeroDia.size,
            livrosIndexados: this.index.porLivro.size,
            capitulosIndexados: this.index.porCapitulo.size,
            entradasTexto: this.index.porTexto.length
        };
    }
}
exports.SearchEngine = SearchEngine;
