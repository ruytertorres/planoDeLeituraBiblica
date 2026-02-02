import type { DiaDoPlano, ProgressoLeitura } from "../../core/types/contratos.types";
import { UIAdapter } from "../../compatibilidade/ui-adapter";
interface OpcoesRenderizacao {
    readonly mostrarProgresso?: boolean;
    readonly tema?: "light" | "dark";
    readonly compacto?: boolean;
}
interface EventosDiaCard {
    onDiaChange?: (dia: DiaDoPlano) => void;
    onProgressoUpdate?: (progresso: number) => void;
}
export declare class DiaCard {
    private elemento;
    private adapter;
    private opcoes;
    private eventos;
    /**
     * Cria um novo componente DiaCard.
     *
     * @param adapter - Adaptador UI com acesso ao plano
     * @param opcoes - Opções de renderização
     * @param eventos - Callbacks de eventos
     */
    constructor(adapter: UIAdapter, opcoes?: OpcoesRenderizacao, eventos?: EventosDiaCard);
    /**
     * Renderiza o card do dia atual.
     *
     * @param container - Elemento onde o card será renderizado
     * @param progresso - Progresso de leitura (opcional)
     */
    renderizar(container: HTMLElement, progresso?: ProgressoLeitura): void;
    /**
     * Atualiza o card com novo progresso.
     *
     * @param progresso - Novo progresso de leitura
     */
    atualizarProgresso(progresso: ProgressoLeitura): void;
    private criarElementoDia;
    private criarHeader;
    private criarConteudoBiblico;
    private criarSecaoLeitura;
    private criarProgresso;
    private criarObservacoes;
    private renderizarVazio;
    private formatarLeitura;
    private calcularProgressoPercentual;
    private getClasseCard;
    private getClasseProgresso;
    /**
     * Destrói o componente e limpa referências.
     */
    destroy(): void;
    /**
     * Retorna o elemento renderizado.
     */
    getElemento(): HTMLElement | null;
}
/**
 * Cria um DiaCard com configurações padrão.
 *
 * @param adapter - Adaptador UI
 * @param container - Elemento container (opcional)
 * @returns Instância do DiaCard
 */
export declare function criarDiaCard(adapter: UIAdapter, container?: HTMLElement): DiaCard;
export {};
//# sourceMappingURL=DiaCard.d.ts.map