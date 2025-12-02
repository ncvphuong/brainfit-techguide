#!/bin/bash

# GitLab Push Script with Commit Message
# Usage: ./scripts/git_push.sh "Your commit message here"

# Check if commit message is provided
if [ -z "$1" ]; then
    echo "❌ Error: Commit message is required"
    echo "Usage: ./scripts/git_push.sh \"Your commit message\""
    exit 1
fi

COMMIT_MESSAGE="$1"
BRANCH="master"

echo "📊 Checking git status..."
git status

echo ""
echo "➕ Adding all changes..."
git add .

echo ""
echo "💾 Committing changes..."
git commit -m "$COMMIT_MESSAGE"

if [ $? -eq 0 ]; then
    echo ""
    echo "🚀 Pushing to GitLab (origin/$BRANCH)..."
    git push origin $BRANCH

    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Successfully pushed changes to GitLab!"
        echo "📝 Commit message: $COMMIT_MESSAGE"
        echo "🌿 Branch: $BRANCH"
    else
        echo ""
        echo "❌ Failed to push changes"
        exit 1
    fi
else
    echo ""
    echo "⚠️  No changes to commit or commit failed"
fi
