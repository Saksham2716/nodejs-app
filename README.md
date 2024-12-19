# Node.js App CI/CD Pipeline with Jenkins, Docker, and Kubernetes

This project demonstrates the Continuous Integration (CI) and Continuous Deployment (CD) pipeline for a Node.js application using Jenkins, Docker, and Kubernetes.

# Project Overview
This project implements a CI/CD pipeline for a simple Node.js application. The pipeline performs the following tasks:
Clones the repository from GitHub.
Installs dependencies and runs unit tests.
Builds a Docker image of the Node.js app and pushes it to Docker Hub.
Deploys the application to a Kubernetes cluster using kubectl.

# Technologies Used
Node.js: Backend JavaScript runtime for building the application.
Jenkins: Continuous integration tool used for automating the pipeline.
Docker: Containerization platform to build and deploy the application.
Kubernetes: Orchestrates Docker containers for deployment, scaling, and management.
Minikube: Local Kubernetes cluster for development.

# Prerequisites
Make sure you have the following installed on your machine:

Node.js (version 14 or later)
Docker
Jenkins (with Node.js and Docker plugins installed)
Minikube
kubectl

# Setup Instructions
Step 1: Clone the Repository
git clone https://github.com/Saksham2716/nodejs-app.git
cd nodejs-app

Step 2: Set Up Jenkins
Install Jenkins:
Follow the official Jenkins installation guide here.

Configure Jenkins Plugins:
Install the following plugins in Jenkins:
NodeJS Plugin
Docker Pipeline Plugin
Kubernetes CLI Plugin

Create Jenkins Pipeline:
Create a new Jenkins pipeline and add the Jenkinsfile from the repository.
Add necessary credentials for GitHub, Docker Hub, and Kubernetes within Jenkins.

Step 3: Docker Build and Push
The Docker image will be built during the Jenkins pipeline execution, but you can manually build and push it using the following commands:
docker build -t <your-dockerhub-username>/nodejs-app:latest .
docker push <your-dockerhub-username>/nodejs-app:latest

Step 4: Deploy to Kubernetes
You can deploy the Docker image to a Kubernetes cluster either from the Jenkins pipeline or manually using kubectl.

Manual deployment:
Ensure your kubectl is set up and points to your Kubernetes cluster:
kubectl config view

Deploy the Node.js application to Kubernetes:
kubectl apply -f k8s-deployment.yaml
kubectl apply -f k8s-service.yaml

# Jenkins Pipeline
Here’s the outline of the pipeline defined in the Jenkinsfile:
Checkout Code: Clones the code from the GitHub repository.
Install Dependencies: Installs the Node.js dependencies using npm.
Run Tests: Runs unit tests using jest.
Build Docker Image: Creates a Docker image of the Node.js application.
Push Docker Image: Pushes the built Docker image to Docker Hub.
Deploy to Kubernetes: Deploys the image to the Kubernetes cluster.

# Sample Jenkinsfile:

pipeline {
    agent any
    environment {
        DOCKER_IMAGE = 'your-dockerhub-username/nodejs-app'
    }
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/Saksham2716/nodejs-app.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                nodejs(nodeJSInstallationName: 'NodeJS 14') {
                    sh 'npm install'
                }
            }
        }
        stage('Run Tests') {
            steps {
                nodejs(nodeJSInstallationName: 'NodeJS 14') {
                    sh 'npm test'
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${DOCKER_IMAGE}:${env.BUILD_ID} .'
            }
        }
        stage('Push Docker Image') {
            steps {
                withCredentials([string(credentialsId: 'docker-hub-password', variable: 'DOCKER_PASSWORD')]) {
                    sh 'echo $DOCKER_PASSWORD | docker login -u your-dockerhub-username --password-stdin'
                    sh 'docker push ${DOCKER_IMAGE}:${env.BUILD_ID}'
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                withKubeConfig([credentialsId: 'kube-config', contextName: 'minikube']) {
                    sh 'kubectl apply -f k8s-deployment.yaml'
                    sh 'kubectl apply -f k8s-service.yaml'
                }
            }
        }
    }
    post {
        always {
            emailext subject: 'Jenkins Job Notification',
                      body: 'The Jenkins pipeline has completed.',
                      to: 'your-email@example.com'
        }
    }
}
