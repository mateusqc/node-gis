build:
	make build-frontend build-backend

build-frontend:
	docker build -t swgis-fe -f ./frontend/Dockerfile ./frontend --build-arg API_URL="http://$(host)/swgis-api" --build-arg FE_PUBLIC_URL="http://$(host):8081"

build-backend:
	docker build -t swgis-be -f ./backend/Dockerfile ./backend --build-arg PATH="/swgis-api"