pipeline {
    agent any

    stages {

        stage('Clone Repo') {
            steps {
                echo 'Repository cloned by Jenkins automatically'
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('server') {
                    sh 'docker build -t crud-backend .'
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('client') {
                    sh 'docker build -t crud-frontend .'
                }
            }
        }

        stage('Run Containers') {
            steps {
                sh '''
                docker rm -f backend || true
                docker rm -f frontend || true

                docker run -d --name backend -p 8080:8080 crud-backend
                docker run -d --name frontend -p 80:80 crud-frontend
                '''
            }
        }
    }
}
