container_id=$(docker run -d -p 15432:5432 --name nodegis-db mateusqc/nodegis-postgresql)
db_ip=$(docker inspect $container_id | grep IPAddress | grep -E -o '(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)' | tail -n1)
machine_ip=$(hostname -I | tr " " "\n" | head -n1)
docker run -d -p 8080:80 -e BASE_API_URL="http://${machine_ip}:8081" --name nodegis-fe mateusqc/nodegis-fe:latest
docker run -d -p 8081:8000 -e DB_IP_ADRESS=$db_ip -e PROFILE="prod" --name nodegis-be mateusqc/nodegis-be:latest 
echo "Access application running at: http://${machine_ip}:8080"