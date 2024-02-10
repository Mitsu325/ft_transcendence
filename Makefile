GREEN	= \e[92m
RESET	= \e[0m

COMPOSE	= docker-compose.yml

all: build

build:
	@echo -e "$(GREEN)Building containers...$(RESET)"
	@docker-compose -f $(COMPOSE) up --build

build-detach:
	@echo -e "$(GREEN)Building conatiners detach...$(RESET)"
	@docker-compose -f $(COMPOSE) up --build -d

down:
	@echo -e "$(GREEN)Down containers...$(RESET)"
	@docker-compose -f $(COMPOSE) down

start:
	@echo "$(GREEN)** Start containers ** $(RESET)"
	@docker-compose --file=$(COMPOSE) start

stop:
	@echo "$(GREEN)** Stop containers ** $(RESET)"
	@docker-compose --file=$(COMPOSE) stop

list:
	@echo -e "$(GREEN)List containers...$(RESET)"
	@docker-compose -f $(COMPOSE) ps

front:
	@echo -e "$(GREEN)Start frontend...$(RESET)"
	@cd frontend && npm start

back:
	@echo -e "$(GREEN)Start backend...$(RESET)"
	@cd backend && npm run start:dev