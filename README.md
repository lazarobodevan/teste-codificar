# Parlador Ideal

Este é o desenvolvimento do desafio fullstack para a empresa Codificar Sistemas Tecnológicos.
A descrição do produto encontra-se [aqui](https://docs.google.com/document/d/1hIvsRYuduMyvvGyBgyEyfcemGPlusZ1olOS3jRcIaJs/edit).

# Atenção
O backend está hospedado na plataforma [Render](https://render.com/), e o aplicativo já está buildado para se comunicar com este servidor. Para executar o aplicativo em dev, basta ter configurado o arquivo .env na raiz do projeto, conforme .env.example.



# Instruções

Instruções para reprodução do ambiente de desenvolvimento.

## Backend

Ao abrir a pasta backend, crie um arquivo .env na raiz do projeto e configure as variáveis de ambiente conforme .env.example.

`DATABASE_URL`

`JWT_PASS`

A primeira é destinada a conexão com o banco de dados, e a segunda é um hash qualquer para codificação e decodificação dos tokens jwt.


Feito isso, execute os seguintes comandos:

    docker-compose up

    npm install

    npx prisma generate

    npx prisma migrate deploy

Para executar em dev, execute:

    npm run dev

Para gerar um build, execute:

    npm run build

Para executar os testes automatizados, execute

    npm run test


### Documentação
A documentação da API foi realizada com Postman, e você encontra [aqui](https://documenter.getpostman.com/view/16703933/2sA3Bhea9z)

## Frontend
Ao abrir a pasta parlador-ideal, execute o comando 

    npm install

Em seguida, configure as variáveis de ambiente no arquivo .env, conforme o .env.example:
`DEV_API_BASE_URL`

`PRD_API_BASE_URL`

Para rodar o projeto é necessário ter instalado o aplicativo Expo para [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) e [iOS](https://apps.apple.com/br/app/expo-go/id982107779). Tendo instalado o aplicativo e logado, certifique-se de estar conectado na mesma rede que o backend. Feito isso, execute:


    npm run start

# Tecnologias utilizadas
- React Native (Expo)
- NodeJs
- ExpressJs
- Docker
- PostgreSQL
- Postman
- Jest
- Typescript

