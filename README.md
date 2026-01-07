# 5FSDT-IVTechChallenge

Código do quarto tech challenge do curso de pós-graduação em Fullstack Development da FIAP - turma de 2025.

## Como executar os containers Docker do projeto

Crie um arquivo chamado `.env` no mesmo diretório do arquivo `docker-compose.yaml` com o seguinte conteúdo:

    POSTGRES_USER=sb
    POSTGRES_PASSWORD=scholablog
    POSTGRES_DATABASE=schola_blog
    BACKEND_LOCAL_PORT=3000
    BACKEND_DOCKER_PORT=3000

Depois, execute os comandos:

    docker compose build
    docker compose up

## Como executar a aplicação mobile do projeto

Edite o arquivo `mobile_app/env.ts` e altere o valor da variável `SERVER_ADDRESS` para o endereço IP do computador que está executando o backend:

    export const SERVER_PROTOCOL = "http";
    export const SERVER_ADDRESS = "192.168.0.15"; //Exemplo
    export const SERVER_PORT = "3000";

Depois, abra um terminal para proceder com a execução da aplicação. Com o terminal aberto, a primeira coisa a se fazer é configurar o caminho do SDK do Android. Considerando o sistema operacional Linux com Bash como shell, o caminho do SDK do Android deve ser confgurado utilizando o comando *export*:

    export ANDROID_HOME=/home/user/Android/Sdk

Com o caminho do SDK do Android configurado, acesse o diretório mobile_app e digite os seguintes comandos:

    npm install
    npm run android

A aplicação será compilada e após isso, a instância do emulador Android será aberta e o projeto será executado com sucesso (considerando que já existe uma instância de emulador Android configurado).


### Contas padrão

#### Contas de professores

    Usuário: admin
    Senha: admin@123

    Usuário: teacher
    Senha: teacher@123

#### Conta de aluno

    Usuário: student
    Senha: student@123

## Arquitetura do Projeto

O documento de arquitetura foi entregue através da plataforma do aluno em um arquivo PDF.

## Manual do Projeto

O manual do projeto foi entregue através da plataforma do aluno em um arquivo PDF.