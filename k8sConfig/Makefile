# Makefile to setup kubernetes environment in Docker

#Step 1 - Install kind for testing kubernetes
install-kind:
	brew install kind

#Step 2 - Install kubectl for interacting with kubernetes
install-kubectl:
	brew install kubectl

# Step 3 - Create cluster
kind-cluster:
	kind create cluster --name k8s-morpheus --image kindest/node:v1.28.13 --config ./kind.yaml

# Step 4 - change control context to k8s-morpheus
change-cluster-context:
	kubectl cluster-info --context kind-k8s-morpheus

# Step 5 - Configure monitoring in kind-k8s-morpheus cluster
# Create the namespace and CRDs, and then wait for them to be available before creating the remaining resources
# Note that due to some CRD size we are using kubectl server-side apply feature which is generally available since kubernetes 1.22.
# If you are using previous kubernetes versions this feature may not be available and you would need to use kubectl create instead.
config-k8s-monitoring:
	kubectl apply --server-side -f manifests/setup
	kubectl wait \
		--for condition=Established \
		--all CustomResourceDefinition \
		--namespace=monitoring
	kubectl apply -f manifests/

# Step 6 - Use kubectl to wait until all pods are Running in monitoring namespace
get-monitoring-pods:
	kubectl -n monitoring get pods

port-forward-k8s-grafana:
	kubectl -n monitoring port-forward svc/grafana 45556:3000

kind-delete:
	kind delete cluster --name k8s-morpheus 

get-pods:
	kubectl -n monitoring get pods

get-all:
	kubectl -n monitoring get all
