pipeline {
    agent any

    environment {
        EC2_USER = 'ubuntu'
        EC2_HOST = "3.111.32.29"
    }

    stages {
        stage('Build & Push Frontend') {
            steps {
                dir('Our-Client-Side') {
                    script {
                        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKERHUB_CREDENTIALS_USR', passwordVariable: 'DOCKERHUB_CREDENTIALS_PSW')]) {
                            sh """
                            docker login -u $DOCKERHUB_CREDENTIALS_USR -p $DOCKERHUB_CREDENTIALS_PSW
                            docker build -t $DOCKERHUB_CREDENTIALS_USR/frontend-app:jenkins .
                            docker push $DOCKERHUB_CREDENTIALS_USR/frontend-app:jenkins
                            """
                        }
                    }
                }
            }
        }

        stage('Build & Push Backend') {
            steps {
                dir('Our-Server-Side') {
                    script {
                        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKERHUB_CREDENTIALS_USR', passwordVariable: 'DOCKERHUB_CREDENTIALS_PSW')]) {
                            sh """
                            docker login -u $DOCKERHUB_CREDENTIALS_USR -p $DOCKERHUB_CREDENTIALS_PSW
                            docker build -t $DOCKERHUB_CREDENTIALS_USR/backend-app:jenkins .
                            docker push $DOCKERHUB_CREDENTIALS_USR/backend-app:jenkins
                            """
                        }
                    }
                }
            }
        }

        stage('Deploy on EC2') {
            steps {
                sshagent(['ec2-key']) {
                    script {
                        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKERHUB_CREDENTIALS_USR', passwordVariable: 'DOCKERHUB_CREDENTIALS_PSW')]) {
                            sh """
                            ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST << EOF
                                docker network create app-network || true
                                docker login -u $DOCKERHUB_CREDENTIALS_USR -p $DOCKERHUB_CREDENTIALS_PSW
                                docker pull $DOCKERHUB_CREDENTIALS_USR/frontend-app:jenkins
                                docker pull $DOCKERHUB_CREDENTIALS_USR/backend-app:jenkins

                                docker rm -f frontend || true
                                docker rm -f backend || true

                                docker run -d --name backend --network app-network -p 5000:5000 $DOCKERHUB_CREDENTIALS_USR/backend-app:jenkins
                                docker run -d --name frontend --network app-network -p 3000:80 $DOCKERHUB_CREDENTIALS_USR/frontend-app:jenkins
                            EOF
                            """
                        }
                    }
                }
            }
        }
    }
}
