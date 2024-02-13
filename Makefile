GREEN	= \e[92m
RESET	= \e[0m

COMPOSE	= docker-compose.yml

all: build

build:
	@echo "$(GREEN)** Building containers **$(RESET)"
	@docker-compose --file=$(COMPOSE) up --build

build-detach:
	@echo "$(GREEN)** Building containers detach **$(RESET)"
	@docker-compose --file=$(COMPOSE) up --build -d

down:
	@echo "$(GREEN)** Down containers **$(RESET)"
	@docker-compose --file=$(COMPOSE) down

start:
	@echo "$(GREEN)** Start containers ** $(RESET)"
	@docker-compose --file=$(COMPOSE) start

stop:
	@echo "$(GREEN)** Stop containers ** $(RESET)"
	@docker-compose --file=$(COMPOSE) stop

list:
	@echo "$(GREEN)** List containers **$(RESET)"
	@docker-compose -f $(COMPOSE) ps

front:
	@echo "$(GREEN)** Start frontend ** $(RESET)"
	@cd frontend && npm start

back:
	@echo "$(GREEN)** Start backend **$(RESET)"
	@cd backend && npm run start:dev