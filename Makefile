# start all
.PHONY: u
u:
	docker-compose up 

# down all
.PHONY: d
d:
	docker-compose down

#logs
.PHONY: l
l:
	docker-compose logs -f

# rebuild and up
.PHONY: r
r:
	clear && docker-compose down && docker-compose up -d --build && docker-compose logs -f


#start broker
.PHONY: mq
mq:
	docker-compose up broker

#start db
.PHONY: db
db:
	docker-compose up redis

#start containers and test
.PHONY: t
t:
	clear &&docker-compose up -d && npm test