# 📖 Biblia Responsiva

**Versão atual:** 0.9.x (pré‑login, foco em plano de leitura)

**Autor:** *a preencher*

**GitHub:** *a preencher*

**LinkedIn:** *a preencher*

**Email:** *a preencher*

---

## 1. Apresentação do sistema (estado atual)

O **Biblia Responsiva** é uma aplicação web **gratuita, open‑source e sem fins lucrativos**, concebida como um **ambiente de leitura, organização e estudo bíblico**.

No estado atual, o sistema está funcional e estável como **plataforma de planos de leitura bíblica**, oferecendo:

* Leitura guiada por planos (ex.: cronológico)
* Geração automática de datas
* Controle de progresso de leitura
* Sistema de busca contextual
* Bloco de notas flutuante persistente

Embora o plano de leitura seja hoje o fluxo dominante, a arquitetura já está preparada para evolução, com clara separação entre **domínio**, **infraestrutura**, **UI** e **estado do usuário**.

O projeto **não hospeda textos bíblicos protegidos por copyright** e respeita integralmente as limitações jurídicas. A evolução futura prevê uso de textos em domínio público, APIs licenciadas e materiais originais para estudo acadêmico.

---

## 2. Tecnologias empregadas

> **Nota de transparência sobre uso de IA**
>
> Este projeto faz uso consciente de **ferramentas de apoio baseadas em Inteligência Artificial** (como ChatGPT e DeepSeek) durante etapas de análise, organização conceitual, revisão técnica e documentação.
>
> As **decisões arquiteturais, conceituais e éticas são humanas**, deliberadas e supervisionadas. As IAs são utilizadas como **instrumentos auxiliares**, de forma semelhante a documentação técnica, revisores automatizados ou pares de brainstorming.
>
> O projeto assume explicitamente um **modelo moderno de desenvolvimento assistido por IA**, prezando por transparência, responsabilidade e rigor intelectual.

O projeto foi desenvolvido com foco em **simplicidade, controle total e longevidade**, evitando dependências pesadas.

### Front‑end

* HTML5
* CSS3 (com suporte a dark mode)
* JavaScript Vanilla (ES Modules)

### Arquitetura

* Separação clara de camadas:

  * **Domínio** (Bíblia, dia, planos)
  * **Infraestrutura** (progresso, reset, contratos)
  * **UI** (renderização e interação)
* Sem frameworks externos
* Totalmente executável em ambiente local

---

## 3. Fluxograma geral e estrutura de arquivos

### 3.1 Fluxo atual da aplicação

```
index.html
   ↓
Plano de Leitura (plano.html)
   ↓
Renderização dos dias
   ↓
Controle de progresso
   ↓
Busca
   ↓
Notas flutuantes
```

O sistema hoje assume implicitamente que o usuário está em **modo plano de leitura**.

---

### 3.2 Estrutura de diretórios

```
C:.
│   index.html              # Entrada atual do sistema
│   limparConsole.js        # Utilitário de desenvolvimento
│   readme.md               # Documentação do projeto
│   tarefas.txt             # Registro de tarefas e ideias
│
├───assets                  # Ícones e imagens
│
├───css                     # Estilos globais e modulares
│   │ darkmode.css          # Tema escuro
│   │ notas.css             # Estilo do bloco de notas
│   │ search_styles.css     # Estilo da busca
│   │ styles.css            # Estilos gerais
│
└───js
    │ main.js               # Bootstrap da aplicação
    │
    ├───dominio             # Núcleo conceitual do sistema
    │   │ biblia.js         # Estrutura canônica da Bíblia (mapa, não texto)
    │   │ dia.js            # Entidade Dia de Leitura
    │   │ geradorDatas.js   # Geração automática de datas
    │   │
    │   ├───busca
    │   │   SearchEngine.js # Motor de busca (voltado ao plano)
    │   │
    │   ├───notas
    │   │   NotasLeituraManager.js  # Gestão das notas
    │   │   notas_overlay.js        # UI flutuante
    │   │   notas_toolbar.js        # Barra de ferramentas
    │   │
    │   └───planos
    │       │ plano_cronologico.js  # Implementação de plano
    │       │
    │       └───config
    │           contrato_plano.js   # Contrato mínimo de planos
    │           PlanoManager.js     # Orquestração
    │           ProgressoLeitura.js # Controle de progresso
    │           ResetProgresso.js   # Reset do estado
    │
    └───ui
        │ darkmode.js        # Controle de tema
        │
        ├───busca
        │   search_input.html
        │   search_ui.js
        │
        ├───calendario
        │   render_calendario.js
        │
        └───planos
            render_dia_card.js
```

---

## 4. Outros detalhamentos conceituais

### 4.1 Notas como patrimônio intelectual

O bloco de notas:

* Não pertence à página
* Não pertence ao plano
* Não pertence à Bíblia

Ele pertence ao conceito de leitura:

> “este texto, nesta versão, neste ponto”

Isso permite que o mesmo sistema de notas funcione tanto para **leitura guiada** quanto para **leitura livre**, sem acoplamento.

---

### 4.2 O app não é apenas um leitor

Implicitamente, o sistema já é:

* Leitor bíblico
* Organizador
* Ambiente de estudo
* Repositório de anotações pessoais

Esse entendimento impacta decisões futuras como login, backup, exportação e persistência.

---

## 5. Próximos passos (resumo)

* Introduzir autenticação (login.html)
* Transformar index.html em hub de decisão
* Separar claramente dois modos de uso:

  * Leitura guiada (plano.html)
  * Leitura livre (biblia.html)
* Reaproveitar notas flutuantes como satélite comum
* Preparar arquitetura para múltiplas fontes bíblicas

---

## 6. Detalhamento dos próximos passos

### 6.1 Novo fluxo de navegação

```
login.html
   ↓
index.html
   ↓
Escolha do modo
   ├── plano.html   # leitura guiada
   └── biblia.html  # leitura livre
```

### 6.2 biblia.html (novo modo)

* Leitura contínua
* Busca estrutural:

  * livros
  * capítulos
  * versículos
* Busca textual:

  * palavras
  * frases
  * ocorrências
* Comparação de versões (planejado)
* Uso de textos em domínio público e APIs

### 6.3 Textos originais

Os textos originais (hebraico e grego):

* São **material de consulta e pesquisa**
* Não fazem parte de planos de leitura
* Não incluem traduções internas
* Exigem maturidade acadêmica do leitor

---

## 7. Diretriz final

O **Biblia Responsiva** é um projeto de longo prazo, orientado por:

* Rigor conceitual
* Respeito jurídico
* Liberdade intelectual
* Serviço à comunidade

A arquitetura prioriza clareza, extensibilidade e responsabilidade ética.

---

## 8. Modos oficiais do sistema

O sistema passa a reconhecer explicitamente **MODOS DE LEITURA**, e não apenas páginas.

### 8.1 Modo: Leitura Guiada

* **Identificador conceitual:** `MODE_PLANO`
* **Interface principal:** plano.html
* **Quem define a referência:** o plano
* **Objetivo:** condução disciplinada da leitura
* **Estado relevante:**

  * dia atual
  * progresso
  * notas associadas ao texto

### 8.2 Modo: Leitura Livre

* **Identificador conceitual:** `MODE_BIBLIA`
* **Interface principal:** biblia.html
* **Quem define a referência:** o leitor
* **Objetivo:** leitura contínua e estudo
* **Estado relevante (temporário):**

  * livro
  * capítulo
  * versículo
  * versão selecionada

Notas flutuantes orbitam ambos os modos, sem acoplamento estrutural.

---

## 9. Contrato mínimo — LeituraBiblicaController

O **LeituraBiblicaController** é o orquestrador do modo leitura livre. Ele **não contém texto bíblico**, nem regras de plano.

### Responsabilidades mínimas

* Receber uma referência bíblica
* Solicitar o texto a uma fonte válida
* Normalizar o retorno
* Entregar o conteúdo para a UI

### Interface conceitual mínima

* setVersao(versaoId)
* setReferencia(livro, capitulo, versiculos?)
* getTexto()
* buscarEstrutural(query)
* buscarTextual(query)

Nenhuma persistência permanente é exigida nesta fase.

---

## 10. biblia.js como estrutura canônica

O arquivo `biblia.js` passa a ser definido explicitamente como:

> **Mapa estrutural da Bíblia, independente de idioma, versão ou fonte de texto**

### Responsabilidades

* Ordem canônica dos livros
* Quantidade de capítulos
* Quantidade de versículos
* Identificadores estáveis

### O que biblia.js NÃO faz

* Não contém texto bíblico
* Não conhece versões
* Não acessa APIs

Ele é utilizado igualmente por planos, leitura livre e mecanismos de busca.

---

## 11. BibliaGateway (conceito)

O **BibliaGateway** é a camada de abstração entre o sistema e as fontes bíblicas.

### Objetivo

Permitir que múltiplas fontes coexistam sem impacto no domínio ou na UI.

### Interface conceitual do gateway

* getTexto(referencia, versao)
* buscarEstrutural(query, versao)
* buscarTextual(query, versao)

### Providers planejados

* LocalPublicDomainProvider

  * ARC
  * KJV
  * Textos originais

* ApiBibleProvider

  * Versões modernas licenciadas

* BibleBrainProvider (futuro)

  * Texto + áudio

O sistema nunca acessa providers diretamente — apenas o gateway.

---

## 12. Encerramento conceitual

Com esses elementos, o projeto passa a ter:

* Modos explicitamente nomeados
* Contratos claros
* Domínio isolado
* Infraestrutura extensível

Sem perda do que já existe e sem riscos jurídicos.
