# SIT737 - Practical Task 6.1P: Deploying a Microservice Using Docker and Kubernetes

## Task Overview
This task focuses on containerizing a Node.js-based calculator microservice using Docker and deploying it on a local Kubernetes cluster. The task includes creating a Docker image, setting up a Kubernetes deployment and service, and verifying the application’s availability and health.

## Tools Used
- **Git**
- **Visual Studio Code**
- **Node.js**
- **Docker**
- **Kubernetes**
- **Kubectl**
- **Docker CLI**

## Prerequisites & Setup
Before you begin, ensure that the following tools are installed and set up on your machine:

### 1. Clone the Repository
Clone the repository to your local machine:
```bash
git clone https://github.com/mustafaT96/sit737-2025-prac5p.git
```

### 2. Install Required Tools
Make sure the following tools are installed:
- **Node.js** (for running the calculator microservice)
- **Docker Desktop** (includes Kubernetes)
- **Kubectl CLI** (for interacting with the Kubernetes cluster)

### 3. Enable Kubernetes in Docker Desktop
Enable Kubernetes in Docker Desktop:
Go to Docker > Settings > Kubernetes > Enable Kubernetes.

## Step-by-Step Instructions
### 1. Create the Docker Image
To build the Docker image for the calculator microservice, navigate to the project directory and run the following command:
```bash
docker build -t calculator-microservice:latest .
```

### 2. Kubernetes Cluster Setup
Ensure the Kubernetes cluster is running:
```bash
kubectl cluster-info .
```
This command will confirm that your local Kubernetes cluster is up and running.

### 3. Create Kubernetes Deployment
A Kubernetes deployment manages the lifecycle of our pods (containers). The deployment manifest (deployment.yml) for the calculator microservice is as follows:
```bash
apiVersion: apps/v1
kind: Deployment
metadata:
  name: calculator-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: calculator
  template:
    metadata:
      labels:
        app: calculator
    spec:
      containers:
        - name: calculator
          image: calculator-microservice:latest
          imagePullPolicy: Never
          ports:
            - containerPort: 3000
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 15
            periodSeconds: 10
```
### Key Details in the Deployment:
- **apiVersion:** Specifies the use of the Kubernetes Deployment API.
- **replicas:** Specifies running one replica of the app.
- **imagePullPolicy:** Set to "Never" since the image is local.
- livenessProbe: Health check that pings the /health endpoint to ensure the app is running.

To apply the deployment configuration, run:
```bash
kubectl apply -f deployment.yml.
```

### 4. Create Kubernetes Service
The service manifest (service.yml) exposes the deployment through a NodePort. The service YAML is as follows:
```bash
apiVersion: v1
kind: Service
metadata:
  name: calculator-service
spec:
  type: NodePort
  selector:
    app: calculator
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
      nodePort: 30007
```
## Key Details in the Service:
- **apiVersion:** Specifies the use of the core Kubernetes API for services.
- **type:** Set to "NodePort" to expose the service on a static port.
- **nodePort:** Exposes the service externally via port 30007 (access it via http://localhost:30007).

To apply the service configuration, run:
```bash
kubectl apply -f service.yml
```

### 5. Verify Deployment
You can verify the status of your deployment by checking the pods and services.
- To check the status of the pods:
```bash
kubectl get pods
```

- To check the status of the service:
```bash
kubectl get services
```
Your service should be available at http://localhost:30007.

### Final Notes:
This setup ensures that your Node.js-based calculator microservice is successfully containerized, deployed on a local Kubernetes cluster, and accessible through a local port. The health of the service is monitored through a liveness probe, and the entire application is accessible via the exposed NodePort.
