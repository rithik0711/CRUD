pipeline {
    agent any

    stages {

        stage('Clone Repo') {
            steps {
                echo 'Repository cloned by Jenkins automatically'
            }
        }

        stage('Build Fullstack Docker Image') {
            steps {
                sh 'docker build -t crud-app .'
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                docker rm -f crud-container || true
                docker run -d --name crud-container -p 8080:8080 crud-app
                '''
            }
        }
    }
}