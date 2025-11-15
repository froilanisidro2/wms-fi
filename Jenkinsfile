pipeline {
    agent any
    options {
        ansiColor('xterm')
    }
    stages {
        stage('Initialize') {
            steps {
                echo "Initialize ${env.GIT_BRANCH} branch"

                script {
                    def props = readYaml file: "${env.GIT_BRANCH}.yml"
                    env.DEPLOY_HOSTNAME = props.deploy_hostname
                    env.DEPLOY_USERNAME = props.deploy_username
                    env.DEPLOY_WORKSPACE = props.deploy_workspace
                }

                echo "Deploying ${env.DEPLOY_USERNAME}@${env.DEPLOY_HOSTNAME}:/home/${env.DEPLOY_USERNAME}${env.DEPLOY_WORKSPACE}"

                script {
                    // Determine ancestor commit. This is used for two things:
                    // 1) Determine a list of commits for a build result message.
                    // 2) Check if we committed an empty branch, so we can skip the build.
                    //
                    // Note, epic is added for demonstrative purposes: epic branches are temporary develop branches,
                    // this can be any prefix you use for branches that can spawn feature branches.
                    parentBranches = '$(git branch -a --list origin/master origin/deploy/*)'
                    ancestorCommit = sh(
                        script: "git merge-base HEAD ${parentBranches}",
                        returnStdout: true).trim()
                    lastCommit = sh(script: 'git log -1 --pretty=%H', returnStdout: true).trim()
                    echo "==> Common ancestor is ${ancestorCommit}, last commit is ${lastCommit}."

                    // Check if the branch is empty, or in other words, has no new commits.
                    // If so, fail the build to skip it.
                    if (lastCommit.equals(ancestorCommit)) {
                        // Only skip the build when we are not an ancestor branch,
                        // because we always want to run those.
                        if (!(env.BRANCH_NAME.split('/')[0] in ['deploy'])) {
                            env.SKIP_BUILD = 'yes'
                            error('Skipping build, branch contains no new commits.')
                        }
                    }
                }
            }
        }
        stage('Prepare') {
            steps {
                echo "Preparing... ${env.GIT_BRANCH}"

                // Delete build folder to prepare 
                sh """#!/bin/bash
                        ssh -o StrictHostKeyChecking=no ${env.DEPLOY_USERNAME}@${env.DEPLOY_HOSTNAME} "
                            rm -rf /home/${env.DEPLOY_USERNAME}${env.DEPLOY_WORKSPACE}/build > /dev/null
                            mkdir -p /home/${env.DEPLOY_USERNAME}${env.DEPLOY_WORKSPACE}/build > /dev/null
                        "
                    """

                sh "rsync -av -e 'ssh -o StrictHostKeyChecking=no' ./ ${env.DEPLOY_USERNAME}@${env.DEPLOY_HOSTNAME}:/home/${env.DEPLOY_USERNAME}${env.DEPLOY_WORKSPACE}/build/ "

                sh """#!/bin/bash
                        ssh -o StrictHostKeyChecking=no ${env.DEPLOY_USERNAME}@${env.DEPLOY_HOSTNAME} "
                            rm -rf /home/${env.DEPLOY_USERNAME}${env.DEPLOY_WORKSPACE}/build/data > /dev/null
                            ln -s /home/${env.DEPLOY_USERNAME}${env.DEPLOY_WORKSPACE}/common/.env /home/${env.DEPLOY_USERNAME}${env.DEPLOY_WORKSPACE}/build/ > /dev/null
                            ln -s /home/${env.DEPLOY_USERNAME}${env.DEPLOY_WORKSPACE}/common/data /home/${env.DEPLOY_USERNAME}${env.DEPLOY_WORKSPACE}/build/data > /dev/null
                        "
                    """

            }
        }
        stage('Build') {
            steps {
                echo "Building... ${env.GIT_BRANCH}"

                sh """#!/bin/bash
                        ssh -o StrictHostKeyChecking=no ${env.DEPLOY_USERNAME}@${env.DEPLOY_HOSTNAME} "
                            cd /home/${env.DEPLOY_USERNAME}${env.DEPLOY_WORKSPACE}/build/
                            pwd
                            ls -lh
                            docker-compose build
                        "
                    """
            }
        }
        stage('Deploy') {
            steps {
                echo "Deploying... ${env.GIT_BRANCH}"

                sh """#!/bin/bash
                        ssh -o StrictHostKeyChecking=no ${env.DEPLOY_USERNAME}@${env.DEPLOY_HOSTNAME} "
                            cd /home/${env.DEPLOY_USERNAME}${env.DEPLOY_WORKSPACE}/current/ > /dev/null
                            docker-compose down > /dev/null
                            rm -rf /home/${env.DEPLOY_USERNAME}${env.DEPLOY_WORKSPACE}/current/ > /dev/null
                            mv /home/${env.DEPLOY_USERNAME}${env.DEPLOY_WORKSPACE}/build /home/${env.DEPLOY_USERNAME}${env.DEPLOY_WORKSPACE}/current > /dev/null
                        "
                    """
            }
        }
        stage('Run') {
            steps {
                echo "Running... ${env.GIT_BRANCH}"

                sh """#!/bin/bash
                        ssh -o StrictHostKeyChecking=no ${env.DEPLOY_USERNAME}@${env.DEPLOY_HOSTNAME} "
                            cd /home/${env.DEPLOY_USERNAME}${env.DEPLOY_WORKSPACE}/current/
                            docker-compose up -d
                        "
                    """
            }
        }
    }
    post {
      always {
        echo "..."
      }
      success {
        echo 'SUCCESS'
        pushTelegram('SUCCESS')
        
      }
      failure {
        echo 'FAILED'
        pushTelegram('FAILED')
      }
      cleanup{
          echo "clean up routine..."
          deleteDir()
      }
    }
}



def pushTelegram(String status) {


    message = ""
    if (lastCommit.equals(ancestorCommit)) {
        // Get last commit if we do not have a distinct ancestor.
        commitHashes = [sh(script: "git log -1 --pretty=%H", returnStdout: true).trim()]
    } else {
        // Get max 5 commits since ancestor.
        commitHashes = sh(script: "git rev-list -5 ${ancestorCommit}..", returnStdout: true).trim().tokenize('\n')
    }
    for (commit in commitHashes) {
        author = sh(script: "git log -1 --pretty=%an ${commit}", returnStdout: true).trim()
        commitMsg = sh(script: "git log -1 --pretty=%B ${commit}", returnStdout: true).trim()
        message += "${author} : ${commitMsg}  "
    }
    echo "Message ${message}"

    message_encoded = java.net.URLEncoder.encode(message, "UTF-8")

  script{
    withCredentials([string(credentialsId: 'telegram_expedise_bot_token', variable: 'TOKEN'), string(credentialsId: 'telegram_gc_tech_chat_id', variable: 'CHAT_ID')]) {
        sh """
        curl -s -X POST https://api.telegram.org/$TOKEN/sendMessage -d chat_id=$CHAT_ID -d parse_mode="HTML" -d text="<b> $env.JOB_NAME </b>\
        #:<b>$env.BUILD_NUMBER $status </b>  
        <pre>$message_encoded</pre> "
        """
    }
  }

}




