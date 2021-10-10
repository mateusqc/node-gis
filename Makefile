build:
	make build-frontend build-backend

build-frontend:
	docker build -t nodegis-fe -f ./frontend/Dockerfile ./frontend

build-backend:
	docker build -t nodegis-be -f ./backend/Dockerfile ./backend 

build-database:
	docker image build . -t nodegis-postgresql -f ./dockerfiles/Dockerfile-postgres