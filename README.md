# NodeGIS

Um SIG Web que utiliza tecnologias como NodeJS, ReactJS, Leaflet, Docker, dentre outros. O seu principal foco é o fácil deploy e o desenvolvimento simplificado de aplicações SIG.

**O único pré-requisito para a utilização do NodeGIS é possuir o Docker instalado.**

# Executando a Aplicação

Foram implementados scripts shell para facilitar a utilização da aplicação. Estes scritps estão neste repositório, entretanto também estão detalhados abaixo os comandos individuais para cada ação.

## Ambiente Local

Para subir a aplicação em ambiente local basta executar o script shell `run-application-local.sh` da seguinte forma:

```bash
# Diretamente, necessário dar permissão de execução ao script
$ ./run-application-local.sh

# Ou utilizando o bash
$ bash run-application-local.sh
```

Seguem abaixo também os comandos individualizados:

```bash
$ docker run -d -p 15432:5432 --name nodegis-db mateusqc/nodegis-postgresql

$ docker run -d -p 8080:80 -e BASE_API_URL='http://localhost:8081' --name nodegis-fe mateusqc/nodegis-fe:latest

$ docker run -d -p 8081:8000 -e DB_IP_ADRESS=${LOCAL_MACHINE_IP} -e DB_PORT="15432" --name nodegis-be mateusqc/nodegis-be:latest
```

**OBS: Substituir `LOCAL_MACHINE_IP` pelo IP da máquina na rede local.**

## Ambiente de Produção

Para subir a aplicação em ambiente de produção basta executar o script shell `run-application-prod.sh`. 

```bash
# Diretamente, necessário dar permissão de execução ao script
$ ./run-application-prod.sh.sh

# Ou utilizando o bash
$ bash run-application-prod.sh
```

Seguem abaixo também os comandos individualizados:

```bash
$ docker run -d -p 15432:5432 --name nodegis-db mateusqc/nodegis-postgresql

$ docker run -d -p 8080:80 -e BASE_API_URL="http://${LOCAL_MACHINE_IP}:8081" --name nodegis-fe mateusqc/nodegis-fe:latest

$ docker run -d -p 8081:8000 -e DB_IP_ADRESS=${LOCAL_MACHINE_IP} -e DB_PORT="15432" --name nodegis-be mateusqc/nodegis-be:latest 
```

**OBS: Substituir `LOCAL_MACHINE_IP` pelo IP público da máquina. Além disso, as portas podem ser alteradas de forma a se adequar à rede utilizada. Por padrão, o frontend irá rodar na porta 8080 e o backend na 8081.**


## Ambiente de Desenvolvimento

Para subir a aplicação em ambiente de desenvolvimento, algumas dependências são necessárias:
* NodeJS
* Yarn (ou npm)
* docker-compose

O ambiente de desenvolvimento não utiliza o Ddocker diretamente, apenas de um contêiner de banco de dados configurado com docker-compose. Com isso, basta executar o comando abaixo na pasta raiz do repositório:

```bash
$ docker-compose up -d
```

Em seguida, deve-se executar os seguintes comandos (tanto para o frontend quanto para o backend):

```bash
# Instalando dependências
$ yarn

# Subindo a aplicação em modo de desenvolvimento
$ yarn dev
```