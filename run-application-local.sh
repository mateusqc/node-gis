docker run -d -p 15432:5432 mateusqc/nodegis-postgresql &
docker run -d --network='host' -e BASE_API_URL='http://localhost:8000/nodegis-api' --name nodegis-fe nodegis-fe:latest &
docker run -d --network='host' -e API_PATH='/nodegis-api' --name nodegis-be nodegis-be:latest 