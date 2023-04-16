# NodeGIS

A Web GIS that uses technologies such as NodeJS, ReactJS, Leaflet, Docker, among others. Its main focus is on easy deployment and simplified development of GIS applications.

**The only prerequisite for using NodeGIS is to have Docker installed.**

# Running the Application

Shell scripts have been implemented to facilitate the use of the application. These scripts are in this repository, however, the individual commands for each action are also detailed below.

## Local Environment

To run the application in a local environment, simply execute the `run-application-local.sh` shell script as follows:

```bash
# Directly, it is necessary to give execution permission to the script
$ ./run-application-local.sh
```

```bash
# Or using bash
$ bash run-application-local.sh
```

The individual commands are also listed below:

```bash
$ docker run -d -p 15432:5432 --name nodegis-db mateusqc/nodegis-postgresql
```

```bash
$ docker run -d -p 8080:80 -e BASE_API_URL='http://localhost:8081' --name nodegis-fe mateusqc/nodegis-fe:latest
```

```bash
$ docker run -d -p 8081:8000 -e DB_IP_ADRESS=${LOCAL_MACHINE_IP} -e DB_PORT="15432" --name nodegis-be mateusqc/nodegis-be:latest
```

**NOTE: Replace `LOCAL_MACHINE_IP` with the IP of the machine on the local network.**

## Production Environment

To run the application in a production environment, simply execute the `run-application-prod.sh` shell script.

```bash
# Directly, it is necessary to give execution permission to the script
$ ./run-application-prod.sh.sh
```

```bash
# Or using bash
$ bash run-application-prod.sh
```

The individual commands are also listed below:

```bash
$ docker run -d -p 15432:5432 --name nodegis-db mateusqc/nodegis-postgresql
```

```bash
$ docker run -d -p 8080:80 -e BASE_API_URL="http://${LOCAL_MACHINE_IP}:8081" --name nodegis-fe mateusqc/nodegis-fe:latest
```

```bash
$ docker run -d -p 8081:8000 -e DB_IP_ADRESS=${LOCAL_MACHINE_IP} -e DB_PORT="15432" --name nodegis-be mateusqc/nodegis-be:latest
```

**NOTE: Replace `LOCAL_MACHINE_IP` with the public IP of the machine. In addition, the ports can be changed to suit the network being used. By default, the frontend will run on port 8080 and the backend on 8081.**

## Ambiente de Desenvolvimento

To run the application in a development environment, some dependencies are necessary:

- NodeJS
- Yarn (or npm)
- docker-compose

The development environment does not use Docker directly, only a database container configured with docker-compose. Therefore, simply run the command below in the repository root folder:

```bash
$ docker-compose up -d
```

Then, the following commands must be executed (for both frontend and backend):

```bash
# Installing dependencies
$ yarn

# Running the application in development mode
$ yarn dev
```
