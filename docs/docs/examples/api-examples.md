---
sidebar_position: 2
---

# API Examples

This page provides examples of using Project Mapper's programmatic API in Node.js applications.

## Basic API Usage

### Generate a Complete Project Map

```javascript
import { generateProjectMap } from 'project-mapper';
import fs from 'fs';

async function analyzeProject() {
  try {
    // Generate a project map with default options
    const result = await generateProjectMap('./my-project');
    
    // The result contains both the raw analysis and the knowledge transfer document
    console.log(`Analysis complete. Found ${result.analysis.overview.totalFiles} files.`);
    
    // Save the knowledge transfer document to a file
    fs.writeFileSync('project-summary.md', result.knowledgeTransfer);
    
    console.log('Project summary saved to project-summary.md');
  } catch (error) {
    console.error('Error analyzing project:', error);
  }
}

analyzeProject();
```

### Analyze Multiple Projects

```javascript
import { generateProjectMap } from 'project-mapper';
import fs from 'fs';
import path from 'path';

async function compareProjects() {
  const projectDirs = ['./project-a', './project-b', './project-c'];
  const results = [];
  
  for (const dir of projectDirs) {
    try {
      console.log(`Analyzing ${dir}...`);
      const result = await generateProjectMap(dir, { template: 'minimal' });
      
      results.push({
        name: path.basename(dir),
        fileCount: result.analysis.overview.totalFiles,
        dirCount: result.analysis.overview.totalDirectories,
        summary: result.knowledgeTransfer
      });
      
      // Save individual summaries
      fs.writeFileSync(`${path.basename(dir)}-summary.md`, result.knowledgeTransfer);
    } catch (error) {
      console.error(`Error analyzing ${dir}:`, error);
    }
  }
  
  // Generate comparison report
  let comparison = '# Project Comparison\n\n';
  comparison += '| Project | Files | Directories |\n';
  comparison += '|---------|-------|-------------|\n';
  
  for (const result of results) {
    comparison += `| ${result.name} | ${result.fileCount} | ${result.dirCount} |\n`;
  }
  
  fs.writeFileSync('project-comparison.md', comparison);
  console.log('Comparison saved to project-comparison.md');
}

compareProjects();
```

## Customizing Analysis

### Use Different Templates

```javascript
import { generateProjectMap } from 'project-mapper';
import fs from 'fs';

async function generateMultipleTemplates() {
  const projectDir = './my-project';
  const templates = ['standard', 'minimal', 'detailed'];
  
  for (const template of templates) {
    console.log(`Generating ${template} template...`);
    
    const result = await generateProjectMap(projectDir, { template });
    
    fs.writeFileSync(`project-${template}.md`, result.knowledgeTransfer);
    console.log(`${template} template saved to project-${template}.md`);
  }
}

generateMultipleTemplates();
```

### Custom Analysis Configuration

```javascript
import { generateProjectMap } from 'project-mapper';
import fs from 'fs';

async function customAnalysis() {
  const result = await generateProjectMap('./my-project', {
    // Ignore specific patterns
    ignore: ['node_modules/**', 'dist/**', '**/*.test.js'],
    
    // Limit directory depth
    depth: 4,
    
    // Use detailed template
    template: 'detailed',
    
    // Include LLM guide
    includeGuide: true,
    
    // Output in JSON format
    format: 'json'
  });
  
  // Save the analysis and knowledge transfer as JSON
  fs.writeFileSync('project-analysis.json', JSON.stringify(result, null, 2));
  console.log('Custom analysis saved to project-analysis.json');
}

customAnalysis();
```

## Working with Individual API Functions

### Separate Analysis and Document Generation

```javascript
import { analyzeProject, generateKnowledgeTransfer } from 'project-mapper';
import fs from 'fs';

async function separateSteps() {
  // Step 1: Analyze the project
  console.log('Analyzing project...');
  const analysis = await analyzeProject('./my-project', {
    ignorePaths: ['node_modules/**', 'dist/**'],
    maxDepth: 5,
    verbose: true
  });
  
  // Save raw analysis
  fs.writeFileSync('raw-analysis.json', JSON.stringify(analysis, null, 2));
  console.log('Raw analysis saved to raw-analysis.json');
  
  // Step 2: Generate knowledge transfer document
  console.log('Generating knowledge transfer document...');
  const document = await generateKnowledgeTransfer(analysis, {
    projectName: 'My Custom Project Name',
    template: 'standard',
    includeGuide: true
  });
  
  // Save document
  fs.writeFileSync('knowledge-transfer.md', document);
  console.log('Knowledge transfer document saved to knowledge-transfer.md');
}

separateSteps();
```

### Adding Semantic Analysis

```javascript
import { analyzeProject, analyzeProjectSemantics, enhancedKnowledgeTransfer } from 'project-mapper';
import fs from 'fs';

async function withSemanticAnalysis() {
  // Step 1: Analyze project structure
  console.log('Analyzing project structure...');
  const analysis = await analyzeProject('./my-project');
  
  // Step 2: Perform semantic analysis
  console.log('Performing semantic analysis...');
  const semantics = await analyzeProjectSemantics('./my-project', {
    minTermFrequency: 2,
    maxTerms: 50
  });
  
  // Step 3: Combine analyses
  analysis.semantics = semantics;
  
  // Step 4: Generate enhanced knowledge transfer
  console.log('Generating enhanced knowledge transfer...');
  const document = await enhancedKnowledgeTransfer(analysis, {
    projectName: 'My Project',
    template: 'detailed'
  });
  
  // Save document
  fs.writeFileSync('enhanced-knowledge-transfer.md', document);
  console.log('Enhanced document saved to enhanced-knowledge-transfer.md');
}

withSemanticAnalysis();
```

## Generating and Using Context Questionnaires

```javascript
import { analyzeProject, analyzeProjectSemantics, generateContextQuestionnaire } from 'project-mapper';
import fs from 'fs';

async function createQuestionnaire() {
  // Step 1: Analyze the project
  console.log('Analyzing project...');
  const analysis = await analyzeProject('./my-project');
  
  // Step 2: Add semantic analysis
  console.log('Performing semantic analysis...');
  analysis.semantics = await analyzeProjectSemantics('./my-project');
  
  // Step 3: Generate questionnaire
  console.log('Generating questionnaire...');
  const questionnaire = generateContextQuestionnaire(analysis);
  
  // Format as markdown
  let markdown = `# ${questionnaire.title}\n\n${questionnaire.description}\n\n`;
  
  for (const q of questionnaire.questions) {
    markdown += `## ${q.question}\n\n*${q.context}*\n\n`;
    markdown += `Your answer: *(fill in here)*\n\n---\n\n`;
  }
  
  // Save to file
  fs.writeFileSync('project-questionnaire.md', markdown);
  console.log('Questionnaire saved to project-questionnaire.md');
}

createQuestionnaire();
```

## Integrating with Build Systems

### Webpack Plugin Example

```javascript
import { generateProjectMap } from 'project-mapper';
import fs from 'fs';
import path from 'path';

class ProjectMapperPlugin {
  constructor(options = {}) {
    this.options = {
      projectDir: process.cwd(),
      outputFile: 'project-knowledge-transfer.md',
      template: 'standard',
      ...options
    };
  }
  
  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync(
      'ProjectMapperPlugin',
      async (compilation, callback) => {
        try {
          console.log('Generating project map...');
          
          const result = await generateProjectMap(this.options.projectDir, {
            template: this.options.template
          });
          
          const outputPath = path.join(
            compilation.options.output.path,
            this.options.outputFile
          );
          
          fs.writeFileSync(outputPath, result.knowledgeTransfer);
          
          console.log(`Project map saved to ${outputPath}`);
          callback();
        } catch (error) {
          console.error('Error generating project map:', error);
          callback();
        }
      }
    );
  }
}

// Usage in webpack.config.js:
// const { ProjectMapperPlugin } = require('./project-mapper-plugin');
// module.exports = {
//   plugins: [
//     new ProjectMapperPlugin({
//       outputFile: 'docs/project-map.md',
//       template: 'detailed'
//     })
//   ]
// };
```

## Creating Custom Visualizations

```javascript
import { analyzeProject, analyzeProjectSemantics, generateConceptNetworkVisualization } from 'project-mapper';
import fs from 'fs';

async function createVisualization() {
  // Step 1: Analyze the project
  console.log('Analyzing project...');
  const analysis = await analyzeProject('./my-project');
  
  // Step 2: Perform semantic analysis
  console.log('Performing semantic analysis...');
  const semantics = await analyzeProjectSemantics('./my-project');
  
  // Step 3: Generate visualization
  console.log('Generating visualization...');
  const svg = generateConceptNetworkVisualization(semantics, {
    width: 800,
    height: 600,
    maxNodes: 20,
    minNodeSize: 5,
    maxNodeSize: 25
  });
  
  // Step 4: Create HTML file with the visualization
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Project Concept Network</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    h1 { text-align: center; }
  </style>
</head>
<body>
  <h1>Project Concept Network</h1>
  ${svg}
</body>
</html>`;
  
  // Save to file
  fs.writeFileSync('concept-network.html', html);
  console.log('Visualization saved to concept-network.html');
}

createVisualization();
```