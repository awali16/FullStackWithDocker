pipeline {
    agent any

    environment {
        POSTGRES_USER = credentials('postgres-user-cred-id')
        POSTGRES_PASSWORD = credentials('postgres-password-cred-id')
        POSTGRES_DB = credentials('postgres-db-cred-id')
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
                        # Create Docker network if not exists
                        docker network inspect myapp-network >/dev/null 2>&1 || docker network create myapp-network

                        # Pull latest images
                        docker pull ${DOCKERHUB_CREDENTIALS_USR}/backend-app:jenkins
                        docker pull ${DOCKERHUB_CREDENTIALS_USR}/frontend-app:jenkins

                        # Stop and remove old containers if any
                        docker stop frontend || true && docker rm frontend || true
                        docker stop backend || true && docker rm backend || true
                        docker stop postgres || true && docker rm postgres || true

                        # Run PostgreSQL container
                        docker run -d \
                            --name postgres \
                            --network myapp-network \
                            -e POSTGRES_USER=${POSTGRES_USER} \
                            -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
                            -e POSTGRES_DB=${POSTGRES_DB} \
                            -v pgdata:/var/lib/postgresql/data \
                            -p 5432:5432 \
                            postgres:15

                        # Run backend container with DB env vars
                        docker run -d \
                            --name backend \
                            --network myapp-network \
                            -p 8080:8080 \
                            -e PG_HOST=postgres \
                            -e PG_PORT=5432 \
                            -e PG_USER=${POSTGRES_USER} \
                            -e PG_PASSWORD=${POSTGRES_PASSWORD} \
                            -e PG_DATABASE=${POSTGRES_DB} \
                            -e DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}?schema=public \
                            ${DOCKERHUB_CREDENTIALS_USR}/backend-app:jenkins

                        # Run frontend container with backend API URL env var
                        docker run -d \
                            --name frontend \
                            --network myapp-network \
                            -p 3000:80 \
                            -e REACT_APP_SERVER_API_URL=http://backend:8080 \
                            ${DOCKERHUB_CREDENTIALS_USR}/frontend-app:jenkins
                        EOF
                        }
                        """
                    }
                }
            }
        }
    }
}
