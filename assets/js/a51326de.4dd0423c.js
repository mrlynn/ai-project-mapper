"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[840],{4144:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>i,default:()=>m,frontMatter:()=>r,metadata:()=>a,toc:()=>c});const a=JSON.parse('{"id":"examples/api-examples","title":"API Examples","description":"This page provides examples of using Project Mapper\'s programmatic API in Node.js applications.","source":"@site/docs/examples/api-examples.md","sourceDirName":"examples","slug":"/examples/api-examples","permalink":"/docs/examples/api-examples","draft":false,"unlisted":false,"editUrl":"https://github.com/mrlynn/ai-project-mapper/tree/main/docs/docs/examples/api-examples.md","tags":[],"version":"current","sidebarPosition":2,"frontMatter":{"sidebar_position":2},"sidebar":"tutorialSidebar","previous":{"title":"CLI Examples","permalink":"/docs/examples/cli-examples"}}');var s=t(4848),o=t(8453);const r={sidebar_position:2},i="API Examples",l={},c=[{value:"Basic API Usage",id:"basic-api-usage",level:2},{value:"Generate a Complete Project Map",id:"generate-a-complete-project-map",level:3},{value:"Analyze Multiple Projects",id:"analyze-multiple-projects",level:3},{value:"Customizing Analysis",id:"customizing-analysis",level:2},{value:"Use Different Templates",id:"use-different-templates",level:3},{value:"Custom Analysis Configuration",id:"custom-analysis-configuration",level:3},{value:"Working with Individual API Functions",id:"working-with-individual-api-functions",level:2},{value:"Separate Analysis and Document Generation",id:"separate-analysis-and-document-generation",level:3},{value:"Adding Semantic Analysis",id:"adding-semantic-analysis",level:3},{value:"Generating and Using Context Questionnaires",id:"generating-and-using-context-questionnaires",level:2},{value:"Integrating with Build Systems",id:"integrating-with-build-systems",level:2},{value:"Webpack Plugin Example",id:"webpack-plugin-example",level:3},{value:"Creating Custom Visualizations",id:"creating-custom-visualizations",level:2}];function p(e){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",...(0,o.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"api-examples",children:"API Examples"})}),"\n",(0,s.jsx)(n.p,{children:"This page provides examples of using Project Mapper's programmatic API in Node.js applications."}),"\n",(0,s.jsx)(n.h2,{id:"basic-api-usage",children:"Basic API Usage"}),"\n",(0,s.jsx)(n.h3,{id:"generate-a-complete-project-map",children:"Generate a Complete Project Map"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"import { generateProjectMap } from 'project-mapper';\nimport fs from 'fs';\n\nasync function analyzeProject() {\n  try {\n    // Generate a project map with default options\n    const result = await generateProjectMap('./my-project');\n    \n    // The result contains both the raw analysis and the knowledge transfer document\n    console.log(`Analysis complete. Found ${result.analysis.overview.totalFiles} files.`);\n    \n    // Save the knowledge transfer document to a file\n    fs.writeFileSync('project-summary.md', result.knowledgeTransfer);\n    \n    console.log('Project summary saved to project-summary.md');\n  } catch (error) {\n    console.error('Error analyzing project:', error);\n  }\n}\n\nanalyzeProject();\n"})}),"\n",(0,s.jsx)(n.h3,{id:"analyze-multiple-projects",children:"Analyze Multiple Projects"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"import { generateProjectMap } from 'project-mapper';\nimport fs from 'fs';\nimport path from 'path';\n\nasync function compareProjects() {\n  const projectDirs = ['./project-a', './project-b', './project-c'];\n  const results = [];\n  \n  for (const dir of projectDirs) {\n    try {\n      console.log(`Analyzing ${dir}...`);\n      const result = await generateProjectMap(dir, { template: 'minimal' });\n      \n      results.push({\n        name: path.basename(dir),\n        fileCount: result.analysis.overview.totalFiles,\n        dirCount: result.analysis.overview.totalDirectories,\n        summary: result.knowledgeTransfer\n      });\n      \n      // Save individual summaries\n      fs.writeFileSync(`${path.basename(dir)}-summary.md`, result.knowledgeTransfer);\n    } catch (error) {\n      console.error(`Error analyzing ${dir}:`, error);\n    }\n  }\n  \n  // Generate comparison report\n  let comparison = '# Project Comparison\\n\\n';\n  comparison += '| Project | Files | Directories |\\n';\n  comparison += '|---------|-------|-------------|\\n';\n  \n  for (const result of results) {\n    comparison += `| ${result.name} | ${result.fileCount} | ${result.dirCount} |\\n`;\n  }\n  \n  fs.writeFileSync('project-comparison.md', comparison);\n  console.log('Comparison saved to project-comparison.md');\n}\n\ncompareProjects();\n"})}),"\n",(0,s.jsx)(n.h2,{id:"customizing-analysis",children:"Customizing Analysis"}),"\n",(0,s.jsx)(n.h3,{id:"use-different-templates",children:"Use Different Templates"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"import { generateProjectMap } from 'project-mapper';\nimport fs from 'fs';\n\nasync function generateMultipleTemplates() {\n  const projectDir = './my-project';\n  const templates = ['standard', 'minimal', 'detailed'];\n  \n  for (const template of templates) {\n    console.log(`Generating ${template} template...`);\n    \n    const result = await generateProjectMap(projectDir, { template });\n    \n    fs.writeFileSync(`project-${template}.md`, result.knowledgeTransfer);\n    console.log(`${template} template saved to project-${template}.md`);\n  }\n}\n\ngenerateMultipleTemplates();\n"})}),"\n",(0,s.jsx)(n.h3,{id:"custom-analysis-configuration",children:"Custom Analysis Configuration"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"import { generateProjectMap } from 'project-mapper';\nimport fs from 'fs';\n\nasync function customAnalysis() {\n  const result = await generateProjectMap('./my-project', {\n    // Ignore specific patterns\n    ignore: ['node_modules/**', 'dist/**', '**/*.test.js'],\n    \n    // Limit directory depth\n    depth: 4,\n    \n    // Use detailed template\n    template: 'detailed',\n    \n    // Include LLM guide\n    includeGuide: true,\n    \n    // Output in JSON format\n    format: 'json'\n  });\n  \n  // Save the analysis and knowledge transfer as JSON\n  fs.writeFileSync('project-analysis.json', JSON.stringify(result, null, 2));\n  console.log('Custom analysis saved to project-analysis.json');\n}\n\ncustomAnalysis();\n"})}),"\n",(0,s.jsx)(n.h2,{id:"working-with-individual-api-functions",children:"Working with Individual API Functions"}),"\n",(0,s.jsx)(n.h3,{id:"separate-analysis-and-document-generation",children:"Separate Analysis and Document Generation"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"import { analyzeProject, generateKnowledgeTransfer } from 'project-mapper';\nimport fs from 'fs';\n\nasync function separateSteps() {\n  // Step 1: Analyze the project\n  console.log('Analyzing project...');\n  const analysis = await analyzeProject('./my-project', {\n    ignorePaths: ['node_modules/**', 'dist/**'],\n    maxDepth: 5,\n    verbose: true\n  });\n  \n  // Save raw analysis\n  fs.writeFileSync('raw-analysis.json', JSON.stringify(analysis, null, 2));\n  console.log('Raw analysis saved to raw-analysis.json');\n  \n  // Step 2: Generate knowledge transfer document\n  console.log('Generating knowledge transfer document...');\n  const document = await generateKnowledgeTransfer(analysis, {\n    projectName: 'My Custom Project Name',\n    template: 'standard',\n    includeGuide: true\n  });\n  \n  // Save document\n  fs.writeFileSync('knowledge-transfer.md', document);\n  console.log('Knowledge transfer document saved to knowledge-transfer.md');\n}\n\nseparateSteps();\n"})}),"\n",(0,s.jsx)(n.h3,{id:"adding-semantic-analysis",children:"Adding Semantic Analysis"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"import { analyzeProject, analyzeProjectSemantics, enhancedKnowledgeTransfer } from 'project-mapper';\nimport fs from 'fs';\n\nasync function withSemanticAnalysis() {\n  // Step 1: Analyze project structure\n  console.log('Analyzing project structure...');\n  const analysis = await analyzeProject('./my-project');\n  \n  // Step 2: Perform semantic analysis\n  console.log('Performing semantic analysis...');\n  const semantics = await analyzeProjectSemantics('./my-project', {\n    minTermFrequency: 2,\n    maxTerms: 50\n  });\n  \n  // Step 3: Combine analyses\n  analysis.semantics = semantics;\n  \n  // Step 4: Generate enhanced knowledge transfer\n  console.log('Generating enhanced knowledge transfer...');\n  const document = await enhancedKnowledgeTransfer(analysis, {\n    projectName: 'My Project',\n    template: 'detailed'\n  });\n  \n  // Save document\n  fs.writeFileSync('enhanced-knowledge-transfer.md', document);\n  console.log('Enhanced document saved to enhanced-knowledge-transfer.md');\n}\n\nwithSemanticAnalysis();\n"})}),"\n",(0,s.jsx)(n.h2,{id:"generating-and-using-context-questionnaires",children:"Generating and Using Context Questionnaires"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"import { analyzeProject, analyzeProjectSemantics, generateContextQuestionnaire } from 'project-mapper';\nimport fs from 'fs';\n\nasync function createQuestionnaire() {\n  // Step 1: Analyze the project\n  console.log('Analyzing project...');\n  const analysis = await analyzeProject('./my-project');\n  \n  // Step 2: Add semantic analysis\n  console.log('Performing semantic analysis...');\n  analysis.semantics = await analyzeProjectSemantics('./my-project');\n  \n  // Step 3: Generate questionnaire\n  console.log('Generating questionnaire...');\n  const questionnaire = generateContextQuestionnaire(analysis);\n  \n  // Format as markdown\n  let markdown = `# ${questionnaire.title}\\n\\n${questionnaire.description}\\n\\n`;\n  \n  for (const q of questionnaire.questions) {\n    markdown += `## ${q.question}\\n\\n*${q.context}*\\n\\n`;\n    markdown += `Your answer: *(fill in here)*\\n\\n---\\n\\n`;\n  }\n  \n  // Save to file\n  fs.writeFileSync('project-questionnaire.md', markdown);\n  console.log('Questionnaire saved to project-questionnaire.md');\n}\n\ncreateQuestionnaire();\n"})}),"\n",(0,s.jsx)(n.h2,{id:"integrating-with-build-systems",children:"Integrating with Build Systems"}),"\n",(0,s.jsx)(n.h3,{id:"webpack-plugin-example",children:"Webpack Plugin Example"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"import { generateProjectMap } from 'project-mapper';\nimport fs from 'fs';\nimport path from 'path';\n\nclass ProjectMapperPlugin {\n  constructor(options = {}) {\n    this.options = {\n      projectDir: process.cwd(),\n      outputFile: 'project-knowledge-transfer.md',\n      template: 'standard',\n      ...options\n    };\n  }\n  \n  apply(compiler) {\n    compiler.hooks.afterEmit.tapAsync(\n      'ProjectMapperPlugin',\n      async (compilation, callback) => {\n        try {\n          console.log('Generating project map...');\n          \n          const result = await generateProjectMap(this.options.projectDir, {\n            template: this.options.template\n          });\n          \n          const outputPath = path.join(\n            compilation.options.output.path,\n            this.options.outputFile\n          );\n          \n          fs.writeFileSync(outputPath, result.knowledgeTransfer);\n          \n          console.log(`Project map saved to ${outputPath}`);\n          callback();\n        } catch (error) {\n          console.error('Error generating project map:', error);\n          callback();\n        }\n      }\n    );\n  }\n}\n\n// Usage in webpack.config.js:\n// const { ProjectMapperPlugin } = require('./project-mapper-plugin');\n// module.exports = {\n//   plugins: [\n//     new ProjectMapperPlugin({\n//       outputFile: 'docs/project-map.md',\n//       template: 'detailed'\n//     })\n//   ]\n// };\n"})}),"\n",(0,s.jsx)(n.h2,{id:"creating-custom-visualizations",children:"Creating Custom Visualizations"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-javascript",children:"import { analyzeProject, analyzeProjectSemantics, generateConceptNetworkVisualization } from 'project-mapper';\nimport fs from 'fs';\n\nasync function createVisualization() {\n  // Step 1: Analyze the project\n  console.log('Analyzing project...');\n  const analysis = await analyzeProject('./my-project');\n  \n  // Step 2: Perform semantic analysis\n  console.log('Performing semantic analysis...');\n  const semantics = await analyzeProjectSemantics('./my-project');\n  \n  // Step 3: Generate visualization\n  console.log('Generating visualization...');\n  const svg = generateConceptNetworkVisualization(semantics, {\n    width: 800,\n    height: 600,\n    maxNodes: 20,\n    minNodeSize: 5,\n    maxNodeSize: 25\n  });\n  \n  // Step 4: Create HTML file with the visualization\n  const html = `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"utf-8\">\n  <title>Project Concept Network</title>\n  <style>\n    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }\n    h1 { text-align: center; }\n  </style>\n</head>\n<body>\n  <h1>Project Concept Network</h1>\n  ${svg}\n</body>\n</html>`;\n  \n  // Save to file\n  fs.writeFileSync('concept-network.html', html);\n  console.log('Visualization saved to concept-network.html');\n}\n\ncreateVisualization();\n"})})]})}function m(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(p,{...e})}):p(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>r,x:()=>i});var a=t(6540);const s={},o=a.createContext(s);function r(e){const n=a.useContext(o);return a.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:r(e.components),a.createElement(o.Provider,{value:n},e.children)}}}]);