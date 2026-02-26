pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        ECR_REPO = '017176210350.dkr.ecr.us-east-1.amazonaws.com/crud-app'
        CLUSTER_NAME = 'crud-cluster'
    }

    stages {

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t crud-app .'
            }
        }

        stage('Tag Image') {
            steps {
                sh 'docker tag crud-app:latest $ECR_REPO:latest'
            }
        }

        stage('Push to ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region $AWS_REGION | \
                docker login --username AWS --password-stdin $ECR_REPO
                docker push $ECR_REPO:latest
                '''
            }
        }

        stage('Deploy to EKS') {
            steps {
                sh '''
                aws eks update-kubeconfig --region $AWS_REGION --name $CLUSTER_NAME
                kubectl rollout restart deployment crud-app
                '''
            }
        }
    }
}
