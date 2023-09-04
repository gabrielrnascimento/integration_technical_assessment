# Documentação da Aplicação

## Índice

1. [Instruções originais](#instruções)
2. [Descrição](#descrição)
3. [Requisitos Adicionais Implementados](#requisitos-adicionais-implementados)
4. [Arquitetura](#arquitetura)
5. [Fluxo de dados](#fluxo-de-dados)
6. [Como Executar a Aplicação](#como-executar-a-aplicação)
7. [Como Executar os Testes Unitários](#como-executar-os-testes-unitários)
8. [Como Visualizar os Logs](#como-visualizar-os-logs)
9. [Relatório de Execução](#relatório-de-execução)

## Instruções

[Instruções originais](docs/desafio.md)

## Descrição

Este projeto foi desenvolvido em Typescript, seguindo conceitos de Clean Architecture, Domain-Driven Design (DDD) e Test-Driven Development (TDD) para garantir a qualidade do código e Jest como framework de testes.

A aplicação utiliza a biblioteca [Winston](https://github.com/winstonjs/winston) para implementar um Logger, que registra as ações realizadas durante a execução e pode ser visualizado através de um endpoint no navegador. Além disso, a cada execução da aplicação, é gerado um relatório em formato Markdown que contém informações detalhadas sobre as ações realizadas, incluindo as que apresentarem erros.

Para garantir uma visão mais abrangente e eficiente do comportamento da aplicação e identificar problemas rapidamente, este projeto também faz uso das ferramentas [Loki](https://github.com/grafana/loki) (sistema de agregação de log) e [Grafana](https://github.com/grafana/grafana) (plataforma de análise e visualização de dados) para o monitoramento de logs.

## Requisitos Adicionais Implementados

- [x] Tempo de intervalo entre cada execução da aplicação definido por uma variável de ambiente.
- [x] Implementação de um logger para registrar as ações realizadas pela aplicação.
- [x] Criação de um endpoint para visualização dos logs da aplicação por meio do navegador.
- [x] A cada execução da aplicação, deverá ser exportado um relatório que será incrementado com informações sobre as ações realizadas, incluindo aquelas que apresentarem erro.
- [x] Elaboração de uma documentação para a aplicação.

## Arquitetura

A arquitetura do projeto segue os princípios de Clean Architecture, que divide a aplicação em camadas bem definidas, promovendo a separação de responsabilidades e facilitando a manutenção e evolução do código.
Abaixo, está um diagrama com a representação visual da arquitetura utilizada neste projeto:
![clean architecture](docs/images/clean-architecture.jpg)

## Fluxo de dados

Abaixo, está um diagrama representando o fluxo de dados da aplicação, de forma simplificada:
![fluxo da aplicação](docs/images/data-flow.jpg)

## Como Executar a Aplicação

1. Certifique-se de ter `Docker` e `docker compose` instalados em sua máquina (necessários para rodar Loki e Grafana).
2. Clone o repositório, navegue até a pasta do projeto e selecione a branch da solução:

    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd <NOME_DA_PASTA>
    git switch solution/gabrielrnascimento
    ```

3. Crie um arquivo `.env` na raiz do projeto e configure as variáveis de ambiente necessárias (utilize como exemplo o arquivo `.env.default`):

    | Variável                 | Descrição                                                                                                      |
    |-------------------------|----------------------------------------------------------------------------------------------------------------|
    | RANDOM_USER_API_URL     | URL da API [Random User](https://randomuser.me/) que fornece dados aleatórios de usuários.                                             |
    | API_KEY                 | Chave de autenticação das APIs da OZmap.               |
    | OZMAP_CLIENT_API_URL    | URL da API de [criação de cliente na OZmap](https://ozmap.stoplight.io/docs/ozmap/c8d5248358d40-cria-um-cliente). |
    | OZMAP_PROPERTY_API_URL  | URL da API de [criação de imóveis na OZmap](https://ozmap.stoplight.io/docs/ozmap/180b1534fb63f-cria-um-imovel#rota-utilizada-para-cria%C3%A7%C3%A3o-de-im%C3%B3veis-no-ozmap).                      |
    | LOGGER_URL              | URL do serviço de logger usado para enviar logs da aplicação.       |
    | LOGGER_JOB              | Identificador para os logs.                  |
    | MINUTES_TO_RERUN        | Tempo em minutos para agendar a execução periódica de aplicação.                 |

    ```bash
    RANDOM_USER_API_URL=https://randomuser.me/api

    API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2R1bGUiOiJhcGkiLCJ1c2VyIjoiNWQ5ZjNmYjgyMDAxNDEwMDA2NDdmNzY4IiwiY3JlYXRpb25EYXRlIjoiMjAyMy0wNy0xMFQxNTowMzoyOC4zOTBaIiwiaWF0IjoxNjg5MDAxNDA4fQ.rACa9_8wIp7FjbGHVEzvaQmtotsOvGnmQPf2Z1yMFw8

    OZMAP_CLIENT_API_URL=https://sandbox.ozmap.com.br:9994/api/v2/ftth-clients
    OZMAP_PROPERTY_API_URL=https://sandbox.ozmap.com.br:9994/api/v2/properties

    LOGGER_URL=http://localhost:3100
    LOGGER_JOB=challenge

    MINUTES_TO_RERUN=5
    ```

4. Execute a aplicação utilizando `docker compose` com o comando `npm run up`
    > Caso ocorra uma alteração no arquivo `.env`, pare a aplicação e utilize o comando `npm run build:docker` para realizar o build novamente e executar a aplicação com as novas variáveis de ambiente.
5. Utilize o comando `npm run down` para parar a aplicação.

## Como executar os Testes Unitários

1. Certifique-se de instalar as dependências do projecto utilizando `npm install`
2. Para rodar os testes execute o comando `npm test`
3. É possível conferir a cobertura completa através do comando `npm run test:coverage`
![test coverage](docs/images//test-coverage.png)  

## Como visualizar os Logs

Todas as configurações necessárias para o Logger são realizadas automaticamente através dos arquivos na pasta `loki/`.
Para visualizar os logs da aplicação e monitorar a execução em tempo real:

1. Acesse o Grafana através do seguinte endpoint em seu navegador [localhost:3000](http://localhost:3000/)
2. Na aba lateral esquerda, selecione **Explorar** (ícone de bússola)
3. O *datasource* **Loki** já estará selecionado
4. Selecione `Log browser` e selecione os filtros de log (`level: info` ou `job: challenge`, por exemplo)
5. Clique em `Show logs`

    ![grafana setup](docs//images/grafana-setup.png)
    ![grafana logs](docs//images/grafana-logs.png)

## Relatório de Execução

A cada execução da aplicação, um relatório em `Markdown` será gerado na pasta `reports/`. O relatório conterá informações detalhadas sobre as ações realizadas durante a execução, bem como eventuais erros encontrados.

**Segue abaixo um exemplo do relatório:**

### Execution Report - Date: 2023-07-27_16-21

1. Action: Creating new property for previous client
   - Status: pending

2. Action: Property was successfully created
   - Status: success
   - Data:

      ```json
      {
        "id": "64c2c3cc3f250c0014f71b07",
        "box": "64ac62633f250c0014f65dc2",
        "address": "Zahidno-Okruzhna 1979 69135 Lyubotin Volinska Ukraine",
        "client": "64c2c29c3f250c0014f71ae5"
      }
      ```

3. Action: Retrieving new user information
   - Status: pending

4. Action: User information was successfully retrieved
   - Status: success
   - Data:

      ```json
      {
        "address": "Brovej 9084 38259 Askeby Danmark Denmark",
        "name": "Filippa Jensen",
        "code": "filippa.jensen",
        "observation": "filippa.jensen@example.com"
      }
      ```

5. Action: Creating new client
   - Status: pending

6. Action: Client was successfully created
   - Status: success
   - Data:

      ```json
      {
        "id": "64c2c3cd3f250c0014f71b10"
      }
      ```

7. Action: Creating new property for new client
   - Status: pending

8. Action: Property was successfully created
   - Status: success
   - Data:

      ```json
      {
        "id": "64c2c3ce3f250c0014f71b16",
        "box": "64ac62633f250c0014f65dc2",
        "address": "Brovej 9084 38259 Askeby Danmark Denmark",
        "client": "64c2c3cd3f250c0014f71b10"
      }
      ```
