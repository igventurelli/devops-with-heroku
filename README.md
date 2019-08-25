# GYPZ

[![Build Status](https://travis-ci.org/igventurelli/gypz.svg?branch=master)](https://travis-ci.org/igventurelli/gypz)

### Configuração do ambiente

Você precisará de um banco de dados Postgres para rodar a app.  
Para sua comidade, esse repo contém um simples `docker-compose.yml` que levantará um banco configurado para você :)

Se você manteve as configurações que estavam no `docker-compose.yml`, basta executar `docker-compose up -d postgres` e você está pronto para rodar a app.  
Agora, se você modificou as configurações originais, você deve então criar uma variável de ambiente chamada `DATABASE_URL`, onde o valor dessa variável deve ser a _string de conexão_ com o banco no formato `postgres://{usuario}:{senha}@{host}:{porta}/{banco}`. 

### Rodando a app

Agora, com o banco ok, você pode rodar a app com o comando `node .`.  
A cada execução a app configurará o banco (criar/modificar tabelas, sequences e etc) conforme necessário.
Para facilitar o consumo da API, você pode executar as requests pelo Postman através do botão abaixo.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/21d1d0cafb2b3934872f)

### DevOps

Esse projeto utiliza o [Travis CI](https://travis-ci.org/) como CI e o Heroku como ambiente de deployment.

O processo funciona da seguinte maneira:

#### Git

O git é trabalhado com o conceito de _feature branch_, onde se tem a `master` como único ramo principal e qualquer feature ou fix origina-se de e volta para a `master`.  
Dessa forma, a única branch "deployavel" para os ambientes de Staging e Production é a `master`.

#### CI

A integração contínua trabalha apenas como CI mesmo (sem CD), onde o deployment é feito pelo próprio PaaS (Heroku).  
O processo de build do CI é simples:

- Recebe a notifiação de modificação de qualquer branch
- Executa o processo descrito no arquivo `.travis.yml`, onde:
  - Temos dois estagios: _test_ e _deploy_:
    - **Test**:
      - Por padrão, a primeira execução do Travis é para rodar os testes unitários e de integração. No caso desse projeto, `npm test`.
      - Se o passo anterior funcionar, o Travis utilizirá o `docker-compose.yml` e o `Dockerfile` do projeto para executar testes integrados, utilizando o [Newman](https://support.getpostman.com/hc/en-us/articles/115003710329-What-is-Newman-)
      - Se os testes executados pelo Newman funcionarem, o estagio é finalizado e o próximo começa
    - **Deploy**:
      - Esse estágio, como o deploy é feito pelo Heroku, não precisaria existir, mas deixei no CI apenas como referência para o processo

### Heroku

No Heroku trabalhamos com duas funcionalidades maneiras que ele nos provê, as [Review Apps](https://devcenter.heroku.com/articles/github-integration-review-apps) e o [Heroku Pipelines](https://devcenter.heroku.com/articles/pipelines).

Com essas funcionalidades configuradas, as coisas funcionam da seguinte maneira:

- _Cenário para qualquer branch **exceto** a `master`_:
  - Após a finalização do desenvolvimento na branch, o desenvolvedor abre uma PR para enviar suas modificações para a `master`. No momento em que ele abre a PR, o Heroku levanta um ambiente identico ao de Staging (addons, env vars e etc) mas com o código dessa PR, para que seja possível a validação do desenvolvimento. Isso é o chamado _Review Apps_.
    - Normalmente, qualquer deploy seria feito se e somente se o CI não falhasse. No caso das _Review Apps_ não. Mesmo que o CI falhe o deploy é feito pois entende-se que por se tratar de uma PR ainda, podem haver testes quebrados ou algo pode não funcionar bem, mas isso não deve ser impeditivo para validação do desenvolvimento.
    - A partir do momento que a PR é _mergeada_ com a master, essa _Review App_ deixa de existir e o processo da `master` começa.

- _Cenário exclusivo para a `master`_:
  - Aqui sim, o CI precisa terminar com sucesso para então o Heroku fazer o deploy do código no ambiente de Staging.
  - Nesse fluxo, trabalhamos com _Entrega Contínua_ e não com _Deploy Contínuo_. Isso significa que é necessário que exista um ambiente de homologação (Staging) e alguém (humano) precisa de fato homologar a modificação para que aí sim, seja feito o transporte para a produção.
  - Após finalizadas as validações para homologação a pessoa que homologou precisa apenas clicar no botão _Promote to Production_ e pronto. O código é publicado em produção.
    - O transporte das modificações de Staging para Production é o chamado _Heroku Pipelines_.
    - Um ponto importante aqui é o fato de que, no momento que houve ou build em Staging, gerou-se um artefato de software. Esse artefato foi testado unitáriamente, foi testado a integração entre suas funcionalidades, foi testado integrado a sistemas externos e foi homologado. Não faria sentigo algum que houvesse um novo build para o ambiente produtivo e isso de fato não acontece. O transporte para produção não acarreta em outro build e isso faz o total sentigo. O artefato que você gera, é o artefato que você testa, é o artefato que você homologa e por fim, é o artefato que você entrega.

Para ficar um pouco mais clara a ideia de como funciona o Heroku, aqui tenmos um print do _Heroku Pipelines_ desse projeto:

![](https://gypz.s3-sa-east-1.amazonaws.com/img.png)

#### Monitoramento

Depois do deploy realizado em produção, precisamos saber da saúde da nossa app no ar, para isso utilizamos o [New Relic](https://newrelic.com/) para nos mostrar o status da nossa app em tempo real:

![](https://gypz.s3-sa-east-1.amazonaws.com/newrelic.png)