"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReorganizadorPlano = void 0;
class ReorganizadorPlano {
    detectarLacuna(ultimoDiaLido, diaHoje, totalDias) {
        if (ultimoDiaLido === null || ultimoDiaLido === 0) {
            return { temLacuna: false, motivo: "nenhum-dia-lido" };
        }
        if (ultimoDiaLido >= totalDias) {
            return { temLacuna: false, motivo: "plano-concluido" };
        }
        const diasAtraso = diaHoje - ultimoDiaLido - 1;
        if (diasAtraso <= 1) {
            return { temLacuna: false, motivo: "sem-atraso-significativo", diasAtraso };
        }
        return {
            temLacuna: true,
            ultimoDiaLido,
            diaHoje,
            diasAtraso,
            totalDias,
            proximoDia: ultimoDiaLido + 1,
            descricao: `Você está ${diasAtraso} dias atrás. Último dia lido: ${ultimoDiaLido}, hoje deveria ser: ${diaHoje}`
        };
    }
    calcularNovoIndice(ultimoDiaLido, diaAtualDoPlano) {
        const novoNumeroDia = ultimoDiaLido + 1;
        return {
            numeroDia: novoNumeroDia,
            descricao: `Próximo dia a ser lido: ${novoNumeroDia}`
        };
    }
    verificarUltrapassagemCiclo(novoNumeroDia, totalDias) {
        if (novoNumeroDia > totalDias) {
            return {
                ultrapassaCiclo: true,
                aviso: `Atenção: Você irá ultrapassar o ciclo anual do plano. O plano será reiniciado.`
            };
        }
        return { ultrapassaCiclo: false };
    }
}
exports.ReorganizadorPlano = ReorganizadorPlano;
