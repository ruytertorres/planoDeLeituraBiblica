export type EstadoPlano = "ATIVO" | "ATRASADO" | "AGUARDANDO_DECISAO" | "FIM_DE_CICLO" | "CONCLUIDO" | "ENCERRADO";
export type DecisaoUsuario = "continuar_adaptando" | "reset_inteligente" | "reset_total" | "continuar_novo_ciclo" | "encerrar_plano" | "adiar_decisao";
export interface ProgressoLeitura {
    readonly diasLidos: number;
    readonly ultimoDiaLido: number | null;
    readonly dataUltimaLeitura: string | null;
    readonly historico: readonly DiaLido[];
}
export interface DiaLido {
    readonly numeroDia: number;
    readonly dataLeitura: string;
    readonly timestamp: string;
}
export interface TrechoBiblico {
    readonly livroId: string;
    readonly livroNome: string;
    readonly capituloInicio: number;
    readonly capituloFim?: number;
}
export interface DiaDoPlano {
    readonly numero: number;
    readonly ano: number;
    readonly data: string;
    readonly dataFormatada: string;
    readonly antigoTestamento: readonly TrechoBiblico[];
    readonly novoTestamento: readonly TrechoBiblico[];
    readonly livros: readonly string[];
    readonly capitulos: readonly number[];
    readonly versiculos: readonly string[];
    readonly observacoes: string;
}
export interface PlanoCartucho {
    readonly id: string;
    readonly nome: string;
    readonly descricao: string;
    readonly totalDias: number;
    readonly dias: readonly DiaDoPlano[];
    getDia(numero: number): DiaDoPlano | undefined;
    getDias(): DiaDoPlano[];
}
export interface ContextoTemporal {
    readonly ano: number;
    readonly diaDoAno: number;
    readonly totalDias: number;
}
export interface InfoCiclo {
    readonly ano: number;
    readonly totalDias: number;
    readonly eBissexto: boolean;
}
export interface GerenciadorPlano {
    readonly plano: PlanoCartucho;
    readonly indiceAtual: number;
    irParaDia(numero: number): DiaDoPlano | null;
    proximoDia(): DiaDoPlano | null;
    diaAnterior(): DiaDoPlano | null;
    temProximo(): boolean;
    temAnterior(): boolean;
    resetar(): DiaDoPlano | null;
    getDiaAtual(): DiaDoPlano | null;
    getTotalDias(): number;
    getIndiceAtual(): number;
}
export interface ResultadoValidacao {
    readonly valido: boolean;
    readonly erros: readonly string[];
}
export interface RegraAtraso {
    readonly diasTolerancia: number;
    estaAtrasado(diasPercorridos: number, diasLidos: number): boolean;
}
export type EventoSistema = {
    tipo: "ciclo_finalizado";
    dados: InfoCiclo;
} | {
    tipo: "atraso_detectado";
    dados: {
        diasAtraso: number;
    };
} | {
    tipo: "plano_concluido";
    dados: {
        plano: PlanoCartucho;
    };
} | {
    tipo: "decisao_necessaria";
    dados: {
        decisoesPossiveis: DecisaoUsuario[];
    };
} | {
    tipo: "lacuna_detectada";
    dados: {
        diaInicio: number;
        diaFim: number;
    };
};
export interface RepositorioPlano {
    salvar(plano: PlanoCartucho, progresso: ProgressoLeitura): Promise<void>;
    carregar(id: string): Promise<{
        plano: PlanoCartucho;
        progresso: ProgressoLeitura;
    } | null>;
    listar(): Promise<PlanoCartucho[]>;
}
export interface RepositorioNotas {
    salvar(diaNumero: number, notas: string): Promise<void>;
    carregar(diaNumero: number): Promise<string>;
    listarTodos(): Promise<{
        dia: number;
        notas: string;
    }[]>;
}
export interface RenderizadorDia {
    renderizar(dia: DiaDoPlano, progresso: ProgressoLeitura): HTMLElement;
    atualizarProgresso(progresso: ProgressoLeitura): void;
}
export interface GerenciadorUI {
    exibirDia(dia: DiaDoPlano): void;
    exibirMensagem(mensagem: string, tipo: "info" | "erro" | "aviso"): void;
    solicitarDecisao(decisoes: DecisaoUsuario[]): Promise<DecisaoUsuario>;
}
export type DiaDaSemana = "domingo" | "segunda" | "terca" | "quarta" | "quinta" | "sexta" | "sabado";
export type MesAno = "janeiro" | "fevereiro" | "marco" | "abril" | "maio" | "junho" | "julho" | "agosto" | "setembro" | "outubro" | "novembro" | "dezembro";
export interface OpcoesRenderizacao {
    readonly tema: "light" | "dark";
    readonly idioma: "pt-BR" | "en-US";
    readonly formatoData: "BR" | "ISO" | "US";
}
/**
 * Estes tipos formalizam os contratos conceituais definidos no CONTRATO_DO_SISTEMA.md.
 *
 * Regras soberanas:
 * 1. Nenhum tipo aqui contém lógica executável
 * 2. Nenhum tipo importa módulos do sistema
 * 3. Qualquer violação destes tipos em tempo de compilação indica
 *    violação contratual do sistema
 * 4. A presença de validação em runtime ainda é obrigatória
 *
 * TypeScript garante estrutura, não comportamento.
 * O contrato governa, não o compilador.
 */
//# sourceMappingURL=contratos.types.d.ts.map