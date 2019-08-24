# GYPZ

### Configuração do ambiente

Você precisará de um banco de dados Postgres para rodar a app.  
Para sua comidade, esse repo contém um simples `docker-compose.yml` que levantará um banco configurado para você :)

Se você está rodando local e manteve as configurações que estavam no `docker-compose.yml`, você está pronto para rodar a app.  
Agora, se você modificou as configurações originais, você deve então criar uma variável de ambiente chamada `DATABASE_URL`, onde o valor dessa variável deve ser a _string de conexão_ com o banco no formato `postgres://{usuario}:{senha}@{host}:{porta}/{banco}`. 

### Rodando a app

Agora, com o banco ok, você pode rodar a app com o comando `node .`.  
A cada execução a app configurará o banco (criar/modificar tabelas, sequences e etc) conforme for necessário.
