# Make sure to update versions to whatever the latest is

IMAGE?=osp/morpheus

# ONLY CHANGE THIS VERSION TO YOUR GROUP
VERSION?=1.0.0

DEV_NAME=morpheus-dev
DOCKERFILEDIRECTORY=morpheus
BUILDER=buildx-multi-arch
VITE_DEV_PORT=4000

INFO_COLOR = \033[0;36m
NO_COLOR   = \033[m

morpheus-new:
	docker compose -f ${DOCKERFILEDIRECTORY}/docker-compose-morpheus.yaml up --build -d

morpheus-dev:
	docker compose -f ${DOCKERFILEDIRECTORY}/docker-compose-morpheus.yaml up -d

morpheus-down:
	docker compose -f ${DOCKERFILEDIRECTORY}/docker-compose-morpheus.yaml down -v

morpheus-rm:
	docker image remove -f morpheus-morpheus

build-dev:
	docker build -t ${DEV_NAME} -f ${DOCKERFILEDIRECTORY}/dockerfile.dev .

# NOTE: This will delete EVERYTHING
pruneAll: 
	docker system prune --all --force --volumes
	
image_prune:
	docker image prune -af

volume_prune:
	docker volume prune -af

build_prune:
	docker buildx prune -af 

build-prod:
	docker build --tag=$(IMAGE):$(VERSION) -f ${DOCKERFILEDIRECTORY}/dockerfile.prod .

prepare-buildx: ## Create buildx builder for multi-arch build, if not exists
	docker buildx inspect $(BUILDER) || docker buildx create --name=$(BUILDER) --driver=docker-container --driver-opt=network=host

help:
	@echo Please specify a build target. The choices are:
	@grep -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "$(INFO_COLOR)%-30s$(NO_COLOR) %s\n", $$1, $$2}'

.PHONY: help