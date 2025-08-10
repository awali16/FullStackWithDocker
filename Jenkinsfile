pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds') // Jenkins credentials ID for Docker Hub
        EC2_KEY = credentials('ec2-key') // Jenkins credentials ID for your EC2 SSH private key
        EC2_USER = 'ubuntu'
        EC2_HOST = '3.111.32.29'
        FRONTEND_IMAGE = '$DOCKERHUB_CREDENTIALS_USR/frontend-app:jenkins'
        BACKEND_IMAGE = '$DOCKERHUB_CREDENTIALS_USR/backend-app:jenkins'
    }

    stages {
        stage('Build & Push Frontend') {
            steps {
                dir('Our-Client-Side') {
                    script {
                        sh """
                        docker login -u $DOCKERHUB_CREDENTIALS_USR -p $DOCKERHUB_CREDENTIALS_PSW
                        docker build -t $FRONTEND_IMAGE .
                        docker push $FRONTEND_IMAGE
                        """
                    }
                }
            }
        }

        stage('Build & Push Backend') {
            steps {
                dir('Our-Server-Side') {
                    script {
                        sh """
                        sudo docker login -u $DOCKERHUB_CREDENTIALS_USR -p $DOCKERHUB_CREDENTIALS_PSW
                        sudo docker build -t $BACKEND_IMAGE .
                        sudo docker push $BACKEND_IMAGE
                        """
                    }
                }
            }
        }

        stage('Deploy on EC2') {
            steps {
                script {
                    sh """
                    ssh -o StrictHostKeyChecking=no -i $EC2_KEY $EC2_USER@$EC2_HOST << 'EOF'
                        sudo docker network create app-network || true
                        sudo docker pull $FRONTEND_IMAGE
                        sudo docker pull $BACKEND_IMAGE

                        sudo docker rm -f frontend || true
                        sudo docker rm -f backend || true

                        sudo docker run -d --name backend --network app-network -p 5000:5000 $BACKEND_IMAGE
                        sudo docker run -d --name frontend --network app-network -p 3000:80 $FRONTEND_IMAGE
                    EOF
                    """
                }
            }
        }
    }
}