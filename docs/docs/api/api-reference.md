---
sidebar_position: 1
---

# API Reference

Project Mapper can be used programmatically in your Node.js applications. This reference covers the available functions and their parameters.

## Main Functions

### generateProjectMap(inputDir, options)

Analyzes a project directory and generates a knowledge transfer document.

**Parameters:**
- `inputDir` (string): Path to the project directory
- `options` (object): Configuration options
  - `template` (string): Template to use ('standard', 'minimal', 'detailed')
  - `format` (string): Output format ('markdown', 'json')
  - `includeGuide` (boolean): Whether to include the LLM guide
  - `ignore` (string[]): Glob patterns to ignore
  - `depth` (number): Maximum directory depth to analyze

**Returns:**
- `Promise<object>`: Object containing `analysis` and `knowledgeTransfer`

**Example:**
```javascript
import { generateProjectMap } from 'project-mapper';

async function analyzeMyProject() {
  const result = await generateProjectMap('./my-project', {
    template: 'detailed',
    includeGuide: true
  });
  
  console.log(result.knowledgeTransfer);
  
  // Access raw analysis data
  const rawAnalysis = result.analysis;
  
  // Do something with the data
  const componentCount = rawAnalysis.overview.totalFiles;
  console.log(`Project has ${componentCount} files`);
}

analyzeMyProject();
```

### analyzeProject(inputDir, options)

Analyzes a project directory without generating a knowledge transfer document.

**Parameters:**
- `inputDir` (string): Path to the project directory
- `options` (object): Configuration options
  - `ignorePaths` (string[]): Glob patterns to ignore
  - `maxDepth` (number): Maximum directory depth to analyze
  - `verbose` (boolean): Enable verbose output

**Returns:**
- `Promise<object>`: Detailed analysis of the project

**Example:**
```javascript
import { analyzeProject } from 'project-mapper';

async function getProjectAnalysis() {
  const analysis = await analyzeProject('./my-project', {
    ignorePaths: ['node_modules/**', 'dist/**'],
    maxDepth: 5
  });
  
  console.log(`Found ${analysis.overview.totalFiles} files`);
  console.log(`Found ${analysis.overview.totalDirectories} directories`);
  
  // Access important files
  for (const file of analysis.structure.importantFiles) {
    console.log(`Important file: ${file.path} (score: ${file.score})`);
  }
}
```

### generateKnowledgeTransfer(analysis, options)

Generates a knowledge transfer document from an existing analysis.

**Parameters:**
- `analysis` (object): Project analysis object
- `options` (object): Configuration options
  - `projectName` (string): Name to use for the project
  - `template` (string): Template to use ('standard', 'minimal', 'detailed')
  - `format` (string): Output format ('markdown', 'json')
  - `includeGuide` (boolean): Whether to include the LLM guide

**Returns:**
- `Promise<string|object>`: Knowledge transfer document in the specified format

**Example:**
```javascript
import { analyzeProject, generateKnowledgeTransfer } from 'project-mapper';

async function generateCustomDocument() {
  // First analyze the project
  const analysis = await analyzeProject('./my-project');
  
  // Then generate a knowledge transfer document
  const document = await generateKnowledgeTransfer(analysis, {
    projectName: 'My Amazing Project',
    template: 'minimal',
    format: 'markdown'
  });
  
  console.log(document);
}
```

### analyzeProjectSemantics(projectDir, options)

Performs semantic analysis on a project directory to extract domain concepts and terminology.

**Parameters:**
- `projectDir` (string): Path to the project directory
- `options` (object): Configuration options
  - `ignorePaths` (string[]): Glob patterns to ignore
  - `includeComments` (boolean): Include code comments in analysis
  - `includeDocs` (boolean): Include documentation files in analysis
  - `includeIdentifiers` (boolean): Include code identifiers in analysis
  - `minTermFrequency` (number): Minimum frequency for a term to be included
  - `maxTerms` (number): Maximum number of terms to include

**Returns:**
- `Promise<object>`: Semantic analysis results

**Example:**
```javascript
import { analyzeProjectSemantics } from 'project-mapper';

async function getSemanticAnalysis() {
  const semantics = await analyzeProjectSemantics('./my-project', {
    minTermFrequency: 2,
    maxTerms: 50
  });
  
  console.log('Domain concepts:');
  for (const concept of semantics.domainConcepts) {
    console.log(`- ${concept.name} (frequency: ${concept.frequency})`);
  }
  
  console.log('Domain glossary:');
  for (const entry of semantics.domainGlossary) {
    console.log(`- ${entry.term}: ${entry.definition}`);
  }
}
```

### enhancedKnowledgeTransfer(analysis, options)

Generates an enhanced knowledge transfer document that includes semantic information.

**Parameters:**
- `analysis` (object): Project analysis object, optionally including semantics data
- `options` (object): Configuration options (same as generateKnowledgeTransfer)
  - `projectDir` (string): Path to project directory (needed if semantics not included)

**Returns:**
- `Promise<string|object>`: Enhanced knowledge transfer document

**Example:**
```javascript
import { analyzeProject, analyzeProjectSemantics, enhancedKnowledgeTransfer } from 'project-mapper';

async function generateEnhancedDocument() {
  // Analyze the project
  const analysis = await analyzeProject('./my-project');
  
  // Add semantic analysis
  analysis.semantics = await analyzeProjectSemantics('./my-project');
  
  // Generate enhanced document
  const document = await enhancedKnowledgeTransfer(analysis, {
    projectName: 'My Project',
    template: 'standard'
  });
  
  console.log(document);
}
```

### generateContextQuestionnaire(analysis)

Generates a context questionnaire based on project analysis to gather additional information.

**Parameters:**
- `analysis` (object): Project analysis object with semantics data

**Returns:**
- object: Questionnaire object with title, description, and questions

**Example:**
```javascript
import { analyzeProject, analyzeProjectSemantics, generateContextQuestionnaire } from 'project-mapper';
import fs from 'fs';

async function createQuestionnaire() {
  // Analyze the project
  const analysis = await analyzeProject('./my-project');
  
  // Add semantic analysis
  analysis.semantics = await analyzeProjectSemantics('./my-project');
  
  // Generate questionnaire
  const questionnaire = generateContextQuestionnaire(analysis);
  
  // Format as markdown
  let markdown = `# ${questionnaire.title}\n\n${questionnaire.description}\n\n`;
  
  for (const q of questionnaire.questions) {
    markdown += `## ${q.question}\n\n*${q.context}*\n\n`;
    markdown += `Your answer: *(fill in here)*\n\n---\n\n`;
  }
  
  // Save to file
  fs.writeFileSync('questionnaire.md', markdown);
  console.log('Questionnaire created: questionnaire.md');
}
```

## Visualization Functions

Project Mapper also includes functions for visualizing project concepts and relationships:

### generateConceptNetworkVisualization(semantics, options)

Generates an SVG visualization of the concept network.

### generateMermaidConceptDiagram(semantics, options)

Generates a Mermaid.js diagram of the concept network.

### exportInteractiveConceptNetwork(semantics, outputPath)

Creates an interactive HTML visualization of the concept network using D3.js.

### generateConceptDistributionHeatmap(semantics, options)

Generates an HTML table visualization showing concept distribution across files.

## Type Definitions

For TypeScript users, here are the main types used in the API:

```typescript
interface AnalysisOptions {
  ignorePaths?: string[];
  maxDepth?: number;
  verbose?: boolean;
}

interface KnowledgeTransferOptions {
  projectName?: string;
  template?: 'standard' | 'minimal' | 'detailed';
  format?: 'markdown' | 'json';
  includeGuide?: boolean;
}

interface ProjectMapOptions extends AnalysisOptions, KnowledgeTransferOptions {
  ignore?: string[];
  depth?: number;
}

interface SemanticAnalysisOptions {
  ignorePaths?: string[];
  includeComments?: boolean;
  includeDocs?: boolean;
  includeIdentifiers?: boolean;
  minTermFrequency?: number;
  maxTerms?: number;
}

interface EnhancedKnowledgeTransferOptions extends KnowledgeTransferOptions {
  projectDir?: string;
}
```