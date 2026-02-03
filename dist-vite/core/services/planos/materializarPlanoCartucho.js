import { gerarDataBR, gerarDataISO, getAnoAtual, } from "../tempo/geradorDatas.js";
export function materializarPlanoCartucho(planoRaw) {
    const ano = getAnoAtual();
    const dias = planoRaw.dias.map((d) => {
        return {
            numero: d.numero,
            ano,
            data: gerarDataISO(d.numero, ano),
            dataFormatada: gerarDataBR(d.numero, ano),
            antigoTestamento: d.antigoTestamento,
            novoTestamento: d.novoTestamento,
            livros: d.livros,
            capitulos: d.capitulos,
            versiculos: d.versiculos,
            observacoes: d.observacoes,
        };
    });
    const plano = {
        id: planoRaw.id,
        nome: planoRaw.nome,
        descricao: planoRaw.descricao,
        totalDias: planoRaw.totalDias,
        dias,
        getDia(numero) {
            return this.dias[numero - 1];
        },
        getDias() {
            return [...this.dias];
        },
    };
    return plano;
}
