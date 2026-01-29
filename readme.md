# 📖 Biblia Responsiva

**Versão atual:** 1.0.0 (foco em plano de leitura, notas e flexibilidade temporal)

---

## 1. Visão Geral: Um Ambiente de Leitura, Organização e Estudo Bíblico

O **Biblia Responsiva** é uma aplicação web **gratuita, open-source e sem fins lucrativos**, projetada como um ambiente completo para a **leitura, organização e estudo da Bíblia**. Seu desenvolvimento é guiado por princípios arquiteturais sólidos, visando clareza, extensibilidade e uma experiência de usuário focada na verdade temporal e na autonomia.

**Regra-Alma do Sistema:**

> "O tempo passa. O sistema reconhece. O usuário decide. O plano continua com verdade."

Essa máxima encapsula a filosofia central do projeto, garantindo que a interação com o plano de leitura seja sempre transparente, controlada e baseada em dados temporais fidedignos.

**Funcionalidades Principais:**

- **Planos de Leitura Adaptáveis**: Leitura guiada por planos (ex.: cronológico), com funcionalidade de **reajuste inteligente** para acomodar lacunas de leitura e um **reset configurável** (voltar ao início do plano ou ancorar no dia atual).
- **Controle de Progresso**: Acompanhamento detalhado do progresso de leitura, persistente localmente.
- **Bloco de Notas Flutuante e Persistente**: Um ambiente rico para anotações pessoais, com ferramentas de formatação (marca-texto, listas, negrito, itálico, etc.), associadas ao texto lido.
- **Busca Contextual**: Sistema de busca eficiente para localizar passagens no plano.
- **Geração Automática de Datas**: Integração com um sistema temporal soberano que assegura a precisão e a consistência das datas.
- **Suporte a Dark Mode**: Interface otimizada para diferentes preferências de visualização.

O projeto não hospeda textos bíblicos protegidos por copyright, respeitando integralmente as limitações jurídicas. A evolução futura prevê o uso de textos em domínio público, APIs licenciadas e materiais originais para estudo acadêmico.

---

## 2. Arquitetura e Princípios Fundamentais

A arquitetura do Biblia Responsiva é baseada em uma clara separação de camadas e na adesão a contratos bem definidos, conforme detalhado no `CONTRATO_DO_SISTEMA.MD`.

### 2.1 Estrutura de Camadas (4-Layer Architecture)

- **Nível Tempo (`js/core/models/parametroGerador.js`)**: A camada mais fundamental. `parametroGerador.js` é a **única fonte de verdade temporal** do sistema. Nenhum outro módulo pode criar, simular ou assumir datas/tempos. Todas as requisições temporais devem passar por ele.
- **Nível Domínio (`js/core/models/biblia.js`, `js/core/models/parametroDia.js`)**: Contém as entidades e regras de negócio essenciais. Por exemplo, `biblia.js` define a estrutura canônica da Bíblia (livros, capítulos, versículos) de forma independente de idioma ou versão, e `parametroDia.js` representa a entidade de um dia de leitura.
- **Nível Orquestração (`js/core/services/planos/PlanoManager.js`, `js/ui/orquestradores/MainOrquestrador.js`)**: Gerencia o fluxo da aplicação, o estado e as interações entre as camadas de domínio e UI. `MainOrquestrador` centraliza a coordenação geral, enquanto `PlanoManager` orquestra as operações específicas relacionadas ao plano de leitura. Esta camada é responsável por injetar dependências temporais e de domínio na UI.
- **Nível UI (`js/ui/components`, `js/ui/componentes`)**: Responsável pela renderização e interação com o usuário. A UI é um **reflexo** do estado e das regras de negócio, **nunca o motor** que as define. Componentes como `render_calendario.js`, `NotasOverlayUI.js` e `ResetModal.js` são exemplos desta camada.

### 2.2 Princípio do Cartucho: Modularidade de Planos

Um plano de leitura é tratado como um **"cartucho"**: uma unidade independente e intercambiável que se encaixa no sistema através de uma interface padronizada (`js/core/services/planos/contrato_plano.js`). Isso significa que novos planos (cronológico, canônico, temático, etc.) podem ser desenvolvidos e integrados sem a necessidade de modificar o núcleo do sistema, garantindo extensibilidade e testabilidade isolada.

### 2.3 Gestão de Decisões e Estados

O sistema detecta condições (atrasos, fim de ciclo) e apresenta opções, mas a **decisão final é sempre explícita e atribuída ao usuário**. Estados do plano (ATIVO, ATRASADO, AGUARDANDO_DECISAO, etc.) são gerenciados de forma controlada, com transições claras e rastreáveis.

---

## 3. Tecnologias Empregadas

> **Nota de Transparência sobre Apoio de Inteligência Artificial**
>
> Este projeto foi desenvolvido com o auxílio de **ferramentas baseadas em Inteligência Artificial** em diversas etapas, como análise, organização conceitual, revisão técnica e documentação. As **decisões arquiteturais, conceituais e éticas são exclusivamente humanas**, com a IA atuando como um **instrumento auxiliar** para otimizar o processo de desenvolvimento e garantir rigor. Acreditamos em um modelo moderno de desenvolvimento assistido por IA, priorizando transparência, responsabilidade e qualidade intelectual.

O projeto foi desenvolvido com foco em **simplicidade, controle total e longevidade**, evitando dependências pesadas e frameworks externos sempre que possível.

### Front-end

- HTML5
- CSS3 (com suporte a dark mode e arquitetura modular)
- JavaScript Vanilla (ES Modules)

### Ferramentas e Bibliotecas

- **html2pdf.js**: Para funcionalidades futuras de exportação.
- **docx (npm)**: Para funcionalidades futuras de exportação para formato .docx.

---

## 4. Estrutura de Diretórios (Simplificada)

```
.
├── ARQUITETURA_SINCRONIZACAO.md
├── CONTRATO_DO_SISTEMA.MD      # Fonte de verdade conceitual
├── readme.md                   # Este documento
├── tarefas.txt                 # Registro de tarefas e ideias
│
├── assets                      # Ícones e imagens
│
├── css                         # Estilos globais e modulares
│   ├── componentes             # Estilos de componentes específicos (ex: modais)
│   └── (outros .css)           # Estilos globais, navbar, cards, calendar, etc.
│
├── js
│   ├── core                    # Núcleo conceitual e serviços
│   │   ├── models              # Entidades e modelos de domínio
│   │   │   ├── parametroBibliaPlano.js
│   │   │   ├── parametroDia.js
│   │   │   └── parametroGerador.js # Única fonte de tempo
│   │   │
│   │   └── services            # Lógica de negócio e serviços
│   │       ├── busca           # Motor de busca
│   │       ├── notas           # Gestão de notas
│   │       └── planos          # Lógica de planos (PlanoManager, ProgressoLeitura, ReorganizadorPlano, ResetProgresso)
│   │
│   ├── ui                      # Camada de Interface do Usuário
│   │   ├── componentes         # Componentes de UI reutilizáveis (modais, notas, etc.)
│   │   ├── components          # Outros componentes de UI (busca, calendário, planos)
│   │   ├── orquestradores      # Orquestradores de UI (MainOrquestrador, BaseOrquestrador)
│   │   └── plugins             # Plugins de funcionalidade (CertificadoPlugin, ExportacaoPlugin)
│   │
│   └── main.js                 # Bootstrap da aplicação
│
└── plano.html                  # Página principal do plano de leitura
```

---

## 5. Conceitos de Domínio Chave

### 5.1 O Bloco de Notas como Patrimônio Intelectual

O sistema de notas é projetado para ser **independente da página, do plano ou da versão bíblica**. Ele pertence ao conceito abstrato de "leitura", permitindo que as anotações sejam um patrimônio intelectual do usuário, dissociado de contextos específicos, funcionando tanto em leitura guiada quanto em leitura livre.

### 5.2 `biblia.js` como Estrutura Canônica Universal

O arquivo `biblia.js` atua como um **mapa estrutural da Bíblia**, definindo a ordem canônica dos livros, a quantidade de capítulos e versículos. Ele é independente de idioma, versão ou fonte de texto, servindo como uma referência estável para todas as funcionalidades que precisam navegar ou referenciar a estrutura bíblica. Ele **NÃO contém texto bíblico**.

### 5.3 `BibliaGateway`: Abstração de Fontes Bíblicas

O conceito de `BibliaGateway` é uma camada de abstração planejada para permitir que o sistema se conecte a **múltiplas fontes de texto bíblico** (APIs licenciadas, textos em domínio público, etc.) sem acoplar o domínio ou a UI a uma fonte específica. Isso garante flexibilidade e extensibilidade para futuras integrações.

---

## 6. Evolução Futura e Diretriz Final

O **Biblia Responsiva** é um projeto de longo prazo, com um roadmap que inclui autenticação de usuário, a introdução de múltiplos modos de leitura (guiada e livre), e a integração de diversas versões bíblicas.

O projeto é orientado por rigor conceitual, respeito jurídico, liberdade intelectual e serviço à comunidade. A arquitetura prioriza clareza, extensibilidade e responsabilidade ética, garantindo que o código mude, mas o contrato governe.
