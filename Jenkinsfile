pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds') // Jenkins credentials ID for Docker Hub
        EC2_HOST = '3.111.32.29'
    }

    stages {
        stage('Build & Push Frontend') {
            steps {
                dir('Our-Client-Side') {
                    script {
                        withEnv([
                            "DOCKER_USER=${DOCKERHUB_CREDENTIALS_USR}",
                            "DOCKER_PASS=${DOCKERHUB_CREDENTIALS_PSW}"
                        ]) {
                            sh '''
                                echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                                docker build -t $DOCKER_USER/frontend-app:jenkins .
                                docker push $DOCKER_USER/frontend-app:jenkins
                            '''
                        }
                    }
                }
            }
        }

        stage('Build & Push Backend') {
            steps {
                dir('Our-Server-Side') {
                    script {
                        withEnv([
                            "DOCKER_USER=${DOCKERHUB_CREDENTIALS_USR}",
                            "DOCKER_PASS=${DOCKERHUB_CREDENTIALS_PSW}"
                        ]) {
                            sh '''
                                echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                                docker build -t $DOCKER_USER/backend-app:jenkins .
                                docker push $DOCKER_USER/backend-app:jenkins
                            '''
                        }
                    }
                }
            }
        }

        stage('Deploy on EC2') {
            steps {
                script {
                    withCredentials([sshUserPrivateKey(credentialsId: 'ec2-key', keyFileVariable: 'EC2_KEY_FILE', usernameVariable: 'EC2_USER')]) {
                        sh """
                            ssh -o StrictHostKeyChecking=no -i \$EC2_KEY_FILE \$EC2_USER@${EC2_HOST} <<EOF
                            docker network create app-network || true
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
