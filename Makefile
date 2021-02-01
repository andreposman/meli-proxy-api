.PHONY: u

# start both api and db
u:
	docker-compose up 

.PHONY: d

# drops both api and db
d:
	docker-compose down

.PHONY: l

#logs
l:
	docker-compose logs -f

# rebuild and up
.PHONY: r

r:
	clear && docker-compose down && docker-compose up -d --build && docker-compose logs -f


.PHONY: db

#start only db 
db:
	docker-compose up -d db


.PHONY: test

#start db container and test locally 
test:
	docker-compose up -d db && yarn test


.PHONY: dev

#start db container and dev locally 
dev:
	docker-compose up -d db && yarn dev