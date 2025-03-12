"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[491],{6664:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>o,contentTitle:()=>r,default:()=>p,frontMatter:()=>t,metadata:()=>s,toc:()=>c});const s=JSON.parse('{"id":"examples/cli-examples","title":"CLI Examples","description":"This page provides practical examples of using Project Mapper\'s command-line interface for different scenarios.","source":"@site/docs/examples/cli-examples.md","sourceDirName":"examples","slug":"/examples/cli-examples","permalink":"/docs/examples/cli-examples","draft":false,"unlisted":false,"editUrl":"https://github.com/mrlynn/ai-project-mapper/tree/main/docs/docs/examples/cli-examples.md","tags":[],"version":"current","sidebarPosition":1,"frontMatter":{"sidebar_position":1},"sidebar":"tutorialSidebar","previous":{"title":"Project Terminology","permalink":"/docs/concepts/terminology"},"next":{"title":"API Examples","permalink":"/docs/examples/api-examples"}}');var i=a(4848),l=a(8453);const t={sidebar_position:1},r="CLI Examples",o={},c=[{value:"Basic Examples",id:"basic-examples",level:2},{value:"Generate a Standard Knowledge Transfer Document",id:"generate-a-standard-knowledge-transfer-document",level:3},{value:"Analyze a Different Directory",id:"analyze-a-different-directory",level:3},{value:"Specify a Custom Output File",id:"specify-a-custom-output-file",level:3},{value:"Template Examples",id:"template-examples",level:2},{value:"Generate a Minimal Summary",id:"generate-a-minimal-summary",level:3},{value:"Generate a Detailed Analysis",id:"generate-a-detailed-analysis",level:3},{value:"Output in JSON Format",id:"output-in-json-format",level:3},{value:"Customizing Analysis",id:"customizing-analysis",level:2},{value:"Ignore Specific Directories",id:"ignore-specific-directories",level:3},{value:"Limit Analysis Depth",id:"limit-analysis-depth",level:3},{value:"Enable Verbose Output",id:"enable-verbose-output",level:3},{value:"Advanced Features",id:"advanced-features",level:2},{value:"Generate a Context Questionnaire",id:"generate-a-context-questionnaire",level:3},{value:"Include LLM Guide",id:"include-llm-guide",level:3},{value:"Skip Analysis and Use Existing File",id:"skip-analysis-and-use-existing-file",level:3},{value:"Specify a Custom Analysis File",id:"specify-a-custom-analysis-file",level:3},{value:"Combining Options",id:"combining-options",level:2},{value:"Complete Analysis with All Features",id:"complete-analysis-with-all-features",level:3},{value:"Quick Analysis for Large Projects",id:"quick-analysis-for-large-projects",level:3},{value:"Analysis for Documentation",id:"analysis-for-documentation",level:3},{value:"Working with Multiple Projects",id:"working-with-multiple-projects",level:2},{value:"Comparing Projects",id:"comparing-projects",level:3},{value:"Batch Processing",id:"batch-processing",level:3},{value:"CI/CD Integration",id:"cicd-integration",level:2},{value:"GitHub Actions Example",id:"github-actions-example",level:3},{value:"Troubleshooting Examples",id:"troubleshooting-examples",level:2},{value:"Handle Memory Issues with Large Projects",id:"handle-memory-issues-with-large-projects",level:3},{value:"Debug Analysis Issues",id:"debug-analysis-issues",level:3}];function d(e){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",...(0,l.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"cli-examples",children:"CLI Examples"})}),"\n",(0,i.jsx)(n.p,{children:"This page provides practical examples of using Project Mapper's command-line interface for different scenarios."}),"\n",(0,i.jsx)(n.h2,{id:"basic-examples",children:"Basic Examples"}),"\n",(0,i.jsx)(n.h3,{id:"generate-a-standard-knowledge-transfer-document",children:"Generate a Standard Knowledge Transfer Document"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# Navigate to your project directory\ncd your-project\n\n# Generate a standard knowledge transfer document\nproject-mapper\n"})}),"\n",(0,i.jsxs)(n.p,{children:["This will create a file named ",(0,i.jsx)(n.code,{children:"project-knowledge-transfer.md"})," in the current directory."]}),"\n",(0,i.jsx)(n.h3,{id:"analyze-a-different-directory",children:"Analyze a Different Directory"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# Analyze a project in a different location\nproject-mapper /path/to/your/project\n"})}),"\n",(0,i.jsx)(n.h3,{id:"specify-a-custom-output-file",children:"Specify a Custom Output File"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# Write the output to a custom file\nproject-mapper -o custom-summary.md\n"})}),"\n",(0,i.jsx)(n.h2,{id:"template-examples",children:"Template Examples"}),"\n",(0,i.jsx)(n.h3,{id:"generate-a-minimal-summary",children:"Generate a Minimal Summary"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# Create a brief overview using the minimal template\nproject-mapper -t minimal\n"})}),"\n",(0,i.jsx)(n.h3,{id:"generate-a-detailed-analysis",children:"Generate a Detailed Analysis"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# Create a comprehensive analysis using the detailed template\nproject-mapper -t detailed\n"})}),"\n",(0,i.jsx)(n.h3,{id:"output-in-json-format",children:"Output in JSON Format"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# Generate the analysis in JSON format instead of Markdown\nproject-mapper -f json -o project-analysis.json\n"})}),"\n",(0,i.jsx)(n.h2,{id:"customizing-analysis",children:"Customizing Analysis"}),"\n",(0,i.jsx)(n.h3,{id:"ignore-specific-directories",children:"Ignore Specific Directories"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# Exclude test files and the dist directory\nproject-mapper -i test/**,dist/**\n"})}),"\n",(0,i.jsx)(n.h3,{id:"limit-analysis-depth",children:"Limit Analysis Depth"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# Only analyze directories up to 3 levels deep\nproject-mapper -d 3\n"})}),"\n",(0,i.jsx)(n.h3,{id:"enable-verbose-output",children:"Enable Verbose Output"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# Show detailed information during analysis\nproject-mapper -v\n"})}),"\n",(0,i.jsx)(n.h2,{id:"advanced-features",children:"Advanced Features"}),"\n",(0,i.jsx)(n.h3,{id:"generate-a-context-questionnaire",children:"Generate a Context Questionnaire"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# Create a questionnaire to gather additional context\nproject-mapper --generate-questionnaire\n"})}),"\n",(0,i.jsx)(n.h3,{id:"include-llm-guide",children:"Include LLM Guide"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# Include guidance for LLMs in the output\nproject-mapper --include-guide\n"})}),"\n",(0,i.jsx)(n.h3,{id:"skip-analysis-and-use-existing-file",children:"Skip Analysis and Use Existing File"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# Use an existing analysis file instead of re-analyzing\nproject-mapper --skip-analysis\n"})}),"\n",(0,i.jsx)(n.h3,{id:"specify-a-custom-analysis-file",children:"Specify a Custom Analysis File"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# Use a specific analysis file as input\nproject-mapper --skip-analysis --analysis-file custom-analysis.json\n"})}),"\n",(0,i.jsx)(n.h2,{id:"combining-options",children:"Combining Options"}),"\n",(0,i.jsx)(n.h3,{id:"complete-analysis-with-all-features",children:"Complete Analysis with All Features"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# Generate a detailed report with all features enabled\nproject-mapper -t detailed --include-guide --generate-questionnaire -v\n"})}),"\n",(0,i.jsx)(n.h3,{id:"quick-analysis-for-large-projects",children:"Quick Analysis for Large Projects"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# Perform a quick analysis on a large project\nproject-mapper -t minimal -d 3 -i node_modules/**,dist/**,test/**\n"})}),"\n",(0,i.jsx)(n.h3,{id:"analysis-for-documentation",children:"Analysis for Documentation"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# Generate documentation-focused analysis\nproject-mapper -t detailed -o docs/project-structure.md --include-guide\n"})}),"\n",(0,i.jsx)(n.h2,{id:"working-with-multiple-projects",children:"Working with Multiple Projects"}),"\n",(0,i.jsx)(n.h3,{id:"comparing-projects",children:"Comparing Projects"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# Analyze multiple projects with different output files\nproject-mapper /path/to/project-a -o project-a-analysis.md\nproject-mapper /path/to/project-b -o project-b-analysis.md\n"})}),"\n",(0,i.jsx)(n.h3,{id:"batch-processing",children:"Batch Processing"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:'# Create a simple bash script to analyze multiple projects\n#!/bin/bash\nfor project in /path/to/projects/*; do\n  if [ -d "$project" ]; then\n    echo "Analyzing $project..."\n    project-mapper "$project" -o "$(basename "$project")-analysis.md"\n  fi\ndone\n'})}),"\n",(0,i.jsx)(n.h2,{id:"cicd-integration",children:"CI/CD Integration"}),"\n",(0,i.jsx)(n.h3,{id:"github-actions-example",children:"GitHub Actions Example"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"# .github/workflows/project-mapper.yml\nname: Generate Project Map\n\non:\n  push:\n    branches: [ main ]\n  workflow_dispatch:\n\njobs:\n  generate-map:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - name: Set up Node.js\n        uses: actions/setup-node@v3\n        with:\n          node-version: 16\n      - name: Install Project Mapper\n        run: npm install -g project-mapper\n      - name: Generate project map\n        run: project-mapper -o project-knowledge-transfer.md\n      - name: Upload artifact\n        uses: actions/upload-artifact@v3\n        with:\n          name: project-map\n          path: project-knowledge-transfer.md\n"})}),"\n",(0,i.jsx)(n.h2,{id:"troubleshooting-examples",children:"Troubleshooting Examples"}),"\n",(0,i.jsx)(n.h3,{id:"handle-memory-issues-with-large-projects",children:"Handle Memory Issues with Large Projects"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# Increase Node.js memory limit for large projects\nNODE_OPTIONS=--max-old-space-size=8192 project-mapper\n"})}),"\n",(0,i.jsx)(n.h3,{id:"debug-analysis-issues",children:"Debug Analysis Issues"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# Enable verbose output and save to a log file\nproject-mapper -v > analysis-log.txt 2>&1\n"})})]})}function p(e={}){const{wrapper:n}={...(0,l.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},8453:(e,n,a)=>{a.d(n,{R:()=>t,x:()=>r});var s=a(6540);const i={},l=s.createContext(i);function t(e){const n=s.useContext(l);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:t(e.components),s.createElement(l.Provider,{value:n},e.children)}}}]);