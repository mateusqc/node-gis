# SimpleWebGIS

## Front-end

- React
- LeafletJS
  - React Leaflet
- AntDesign
- mobX
- Axios

## Back-end

- NodeJS
- Express
- Conectores de DB
  - PostgreSQL

## Subindo o Projeto

Os comandos abaixo devem ser rodados no back-end e no front-end:

```bash
yarn install

yarn dev
```

## Containers de Desenvolvimento

- PosgreSQL + PostGIS
- pgAdmin4

Para subir os containers de desenvolvimento, basta executar o seguinte comando:

```bash
docker-compose up -d
```

### PostgreSQL + PostGIS

- Host: localhost
- Port: 15432
- Database: postgres
- Username: postgres
- Password: postgres

### pgAdmin4

Link de acesso: http://localhost:16543

Dados de acesso:

- Usuário: user@user.com.br
- Senha: postgres

Conexão ao banco:

- Host: postgres-compose
- Port: 5432
- Maintenance database: postgres
- Username: postgres
- Password: postgres
