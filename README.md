# Serverless - AWS Node.js Typescript
Projeto de integração de api utilizando serverless AWS com typescript
- Inicialização do projeto.
- Instalar dependencias que estão no arquivo package.json "npm install"
  
- Instrução de configuração de usuário para acessar os recursos da AWS:
       Rodar o comando "sls config credentials -o --provider aws --key=CHAVEDEACESSO" --secret CHAVEDEACESSOSECRETA
  
- Para inicializar o serverless, existe um script dentro do package.json "npm start" e para modificações "serverless deploy --stage dev"
- O projeto é baseado no conceito de clean architecture, utilizando a separação entre aplicação, domínio e infraestrutura.
- Quando o serverless rodar, ele mostrará as apis que estão expostas para funcionamento.
      ex: Function names exposed for local invocation by aws-sdk:
           * createAccountInvoke: catalisa-teste-dev-createAccountInvoke
           * deleteAccountInvoke: catalisa-teste-dev-deleteAccountInvoke
           * findAccountInvoke: catalisa-teste-dev-findAccountInvoke
           * updateAccountInvoke: catalisa-teste-dev-updateAccountInvoke
- Para executar, utilize algum programa para fazer chamadas de endpoit (postman, insôminia).
      ex. de rota a ser chamada: http://localhost:3002/2015-03-31/functions/catalisa-teste-dev-createAccountInvoke/invocations (contexto de lambda invocation)
