#!/bin/bash
cd /home/kavia/workspace/code-generation/ai-verification-and-validation-automation-6276-6286/test_automation_ui
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

