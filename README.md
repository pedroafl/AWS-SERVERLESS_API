# AWS-SERVERLESS_API
inicialização do projeto:
 - clonar repositório
 - instalar dependências do package.json (npm install na pasta do projeto)
 - configurar usuário aws para ter acesso aos recursos utilizados (Obs: o usuário deve ser criado no painel da aws com as devidas permissões)
    - comando de configuração do usuário: "sls config credentials -o --provider aws --key=CHAVEDEACESSOUSUARIO --secret chavesecretacriada.
 - comando para startar o serviço "npm start" (comando está configurado no script do arquivo package.json)
 - usar algum programa para rodar as api e seus retornos
     apis listadas no progeto:
       * createAccountInvoke: catalisa-teste-dev-createAccountInvoke
       * deleteAccountInvoke: catalisa-teste-dev-deleteAccountInvoke
       * findAccountInvoke: catalisa-teste-dev-findAccountInvoke
       * updateAccountInvoke: catalisa-teste-dev-updateAccountInvoke
     Ex: http://localhost:3002/2015-03-31/functions/catalisa-teste-dev-createAccountInvoke/invocations
