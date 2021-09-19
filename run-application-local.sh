docker run -d -p 15432:5432 --name nodegis-db mateusqc/nodegis-postgresql
db_ip=$(hostname -I | tr " " "\n" | head -n1)
docker run -d -p 8080:80 -e BASE_API_URL='http://localhost:8081' --name nodegis-fe nodegis-fe:latest
docker run -d -p 8081:8000 -e DB_IP_ADRESS=$db_ip --name nodegis-be nodegis-be:latest
echo "Access application running at: http://localhost:8080"