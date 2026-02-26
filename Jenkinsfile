pipeline {
    agent any

    stages {

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t crud-app .'
            }
        }

        stage('Remove Old Image') {
            steps {
                sh 'docker image prune -f'
            }
        }
    }
}
