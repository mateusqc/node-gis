build:
	make build-frontend build-backend

build-frontend:
	docker build -t nodegis-fe -f ./frontend/Dockerfile ./frontend

build-backend:
	docker build -t nodegis-be -f ./backend/Dockerfile ./backend 

build-database:
	docker image build . -t nodegis-postgresql -f ./dockerfiles/Dockerfile-postgres

tag:
	make tag-frontend tag-backend

tag-frontend:
	docker tag nodegis-fe:latest mateusqc/nodegis-fe:latest

tag-backend:
	docker tag nodegis-be:latest mateusqc/nodegis-be:latest

push:
	make push-frontend push-backend
	
push-frontend:
	docker push mateusqc/nodegis-fe:latest

push-backend:
	docker push mateusqc/nodegis-be:latest