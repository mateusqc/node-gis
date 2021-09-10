# Endpoints Back end
 
## Camadas 
  - Endpoint: `/layer/:layer`
  - Natureza:  `GET`
  - Parâmetro dinâmico: `layer`
  - Função: Retorna as colunas (incluindo a coluna `geom`) de uma tabela com o nome do parâmetro dinâmico `layer`. 
  - Obs: O parâmetro `layer` deve fazer referência a uma tabela existente no banco de dados.

## Tabelas
  - Endpoint: `/tables`
  - Natureza: `GET`
  - Parâmetro dinâmico: Nenhum
  - Função: Retorna uma lista de objetos com os nomes das tabelas que possuem colunas `geom` e suas colunas

## Consultas
  # Estáticas
    - Endpoint: `/spatial_query`
    - Natureza: `POST`
    - Parâmetro:  Os parâmetros vão no body da requisição: `operation`, `objects`, `layer`, a priori `operation`  deve receber `union`ou `area`,
    objects recebe os `ids` da camada selecionada. Já `layer` recebe uma camada, que é o nome de uma tabela do banco de dados. Caso a operação seja
     `union` retorna uma geometria de área, caso seja `area` retorna um float
  # Dinâmicas
   - Endpoint: `/sql`
   - Natureza: `POST`
   - Parâmetro: Recebe no body da requisição uma string `sql` que é uma consulta espacial digitada pelo usuário. Retorna os resultados da consulta inserida
