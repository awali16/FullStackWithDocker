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
                    withCredentials([
                        sshUserPrivateKey(credentialsId: 'ec2-key', keyFileVariable: 'EC2_KEY_FILE', usernameVariable: 'EC2_USER'),
                        usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS'),
                        string(credentialsId: 'postgres-user-cred-id', variable: 'POSTGRES_USER'),
                        string(credentialsId: 'postgres-password-cred-id', variable: 'POSTGRES_PASSWORD'),
                        string(credentialsId: 'postgres-db-cred-id', variable: 'POSTGRES_DB'),
                    ]) {
                        sh '''  # Use single quotes here to prevent Groovy interpolation
                            ssh -o StrictHostKeyChecking=no -i $EC2_KEY_FILE $EC2_USER@''' + EC2_HOST + ''' <<'EOF'
                            set -e
                            export POSTGRES_USER="$POSTGRES_USER"
                            export POSTGRES_PASSWORD="$POSTGRES_PASSWORD"
                            export POSTGRES_DB="$POSTGRES_DB"
                            export DOCKER_USER="$DOCKER_USER"
                            export DOCKER_PASS="$DOCKER_PASS"

                            docker network inspect myapp-network >/dev/null 2>&1 || docker network create myapp-network

                            docker pull $DOCKER_USER/backend-app:jenkins
                            docker pull $DOCKER_USER/frontend-app:jenkins

                            docker rm -f frontend backend postgres || true

                            docker run -d \\
                                --name postgres \\
                                --network myapp-network \\
                                -e POSTGRES_USER="$POSTGRES_USER" \\
                                -e POSTGRES_PASSWORD="$POSTGRES_PASSWORD" \\
                                -e POSTGRES_DB="$POSTGRES_DB" \\
                                -v pgdata:/var/lib/postgresql/data \\
                                -p 5432:5432 \\
                                postgres:15

                            docker run -d \\
                                --name backend \\
                                --network myapp-network \\
                                -p 8080:8080 \\
                                -e PG_HOST=postgres \\
                                -e PG_PORT=5432 \\
                                -e PG_USER="$POSTGRES_USER" \\
                                -e PG_PASSWORD="$POSTGRES_PASSWORD" \\
                                -e PG_DATABASE="$POSTGRES_DB" \\
                                -e DATABASE_URL=postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@postgres:5432/$POSTGRES_DB?schema=public \\
                                $DOCKER_USER/backend-app:jenkins

                            docker run -d \\
                                --name frontend \\
                                --network myapp-network \\
                                -p 3000:80 \\
                                -e REACT_APP_SERVER_API_URL=http://backend:8080 \\
                                $DOCKER_USER/frontend-app:jenkins

EOF
                        '''
                    }
                }
            }
        }

    }
}