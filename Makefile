# Make sure to update versions to whatever the latest is

EXTENSION_IMAGE?=docketeerxiv/morpheus

# ONLY CHANGE THIS VERSION TO YOUR GROUP
VERSION?=1.0.0

DEV_NAME=morpheus-dev
DOCKERFILEDIRECTORY=morpheus
BUILDER=buildx-multi-arch
VITE_DEV_PORT=4000

INFO_COLOR = \033[0;36m
NO_COLOR   = \033[m

# DELETE ALL DOCKETEER RELATED - Images, Volumes, Containers (should be removed from 'make browser-down')
# Start Sever WITHOUT CACHE!
morpheus-new:
	docker compose -f ${DOCKERFILEDIRECTORY}/docker-compose-morpheus.yaml up --build -d

# RECOMMENDED
morpheus-dev:
	docker compose -f ${DOCKERFILEDIRECTORY}/docker-compose-morpheus.yaml up -d

morpheus-down:
	docker compose -f ${DOCKERFILEDIRECTORY}/docker-compose-morpheus.yaml down -v

build-dev:
	docker build -t ${DEV_NAME} -f ${DOCKERFILEDIRECTORY}/dockerfile.dev .

# NOTE: This will delete EVERYTHING not just Docketeer related files!
pruneAll: 
	docker system prune --all --force --volumes
	
img_prune:
	docker image prune -af

clr_cache:
	docker buildx prune -f 

build-prod: ## Build service image to be deployed
	docker build --tag=$(EXTENSION_IMAGE):$(VERSION) -f ${DOCKERFILEDIRECTORY}/dockerfile.prod .

prepare-buildx: ## Create buildx builder for multi-arch build, if not exists
	docker buildx inspect $(BUILDER) || docker buildx create --name=$(BUILDER) --driver=docker-container --driver-opt=network=host

help: ## Show this help
	@echo Please specify a build target. The choices are:
	@grep -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "$(INFO_COLOR)%-30s$(NO_COLOR) %s\n", $$1, $$2}'

.PHONY: help