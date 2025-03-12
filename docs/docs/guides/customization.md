---
sidebar_position: 3
---

# Customization Guide

This guide explains how to customize Project Mapper to better suit your specific needs.

## Configuration Options

Project Mapper provides several configuration options that can be used to customize its behavior.

### Command Line Options

All of these options can be set via the command line interface:

| Option | Description | Default |
|--------|-------------|---------|
| `-o, --output <file>` | Output file path | `project-knowledge-transfer.md` |
| `-i, --ignore <patterns...>` | Additional glob patterns to ignore | |
| `-d, --depth <level>` | Maximum directory depth to analyze | `10` |
| `-f, --format <format>` | Output format (markdown, json) | `markdown` |
| `-t, --template <n>` | Knowledge transfer template to use | `standard` |
| `-v, --verbose` | Enable verbose output | |
| `-s, --semantic` | Enable semantic analysis of code | `true` |
| `--skip-analysis` | Skip code analysis and use existing analysis file | |
| `--analysis-file <file>` | Path to analysis file | `project-analysis.json` |
| `--include-guide` | Include LLM knowledge transfer guide | `false` |
| `--generate-questionnaire` | Generate a context questionnaire for the project | |
| `--questionnaire-output <file>` | Output file for the questionnaire | `project-context-questionnaire.md` |

### Programmatic Options

When using the API, you can provide the same options as objects:

```javascript
const options = {
  template: 'detailed',
  format: 'markdown',
  includeGuide: true,
  ignore: ['node_modules/**', 'dist/**'],
  depth: 5,
  verbose: true
};

const result = await generateProjectMap('./my-project', options);
```

## Creating Custom Templates

One of the most powerful ways to customize Project Mapper is by creating your own templates for knowledge transfer documents.

### Understanding Template Structure

Templates are defined in `src/knowledge-transfer.js` as functions that generate content from analysis data. Here's the structure of a template function:

```javascript
function generateCustomTemplate(analysis, projectName) {
  let content = `# ${projectName} Custom Knowledge Transfer\n\n`;
  
  // Add sections based on analysis data
  content += `## Your Section Title\n\n`;
  content += `Your section content...\n\n`;
  
  // Return both the content and a list of sections
  return {
    content,
    sections: [
      'Your Section Title',
      // Other sections...
    ]
  };
}
```

### Adding Your Custom Template

To add your own template:

1. Fork the Project Mapper repository
2. Open `src/knowledge-transfer.js`
3. Add your template function
4. Register it in the `TEMPLATES` object:

```javascript
const TEMPLATES = {
  standard: generateStandardTemplate,
  minimal: generateMinimalTemplate,
  detailed: generateDetailedTemplate,
  custom: generateCustomTemplate  // Add your template here
};
```

5. Update the CLI options in `src/cli.js` to include your new template in the help text

### Example: Creating a Custom Template

Here's an example of a custom template focused on security aspects:

```javascript
function generateSecurityTemplate(analysis, projectName) {
  let content = `# ${projectName} Security Overview\n\n`;
  
  // Project Basics
  content += `## Project Identification\n\n`;
  content += `**Name:** ${analysis.overview.name || projectName}\n\n`;
  content += `**Description:** ${analysis.overview.description || 'No description available'}\n\n`;
  
  // Dependencies (focusing on security aspects)
  content += `## Dependencies\n\n`;
  if (analysis.package && analysis.package.dependencies) {
    content += `### Production Dependencies\n\n`;
    content += `| Dependency | Version | Security Notes |\n`;
    content += `|------------|---------|---------------|\n`;
    
    Object.entries(analysis.package.dependencies).forEach(([name, version]) => {
      content += `| ${name} | ${version} | Needs review |\n`;
    });
    content += '\n';
  }
  
  // Entry Points
  content += `## Entry Points\n\n`;
  content += `The following files serve as entry points and should be prioritized for security reviews:\n\n`;
  
  if (analysis.structure && analysis.structure.entryPoints) {
    analysis.structure.entryPoints.forEach(entry => {
      content += `- \`${entry.path}\` (${entry.type})\n`;
    });
  }
  content += '\n';
  
  // Data Processing
  content += `## Data Processing\n\n`;
  content += `Files that likely handle user input or data processing:\n\n`;
  
  if (analysis.structure && analysis.structure.importantFiles) {
    const dataFiles = analysis.structure.importantFiles
      .filter(file => file.path.includes('data') || 
                      file.path.includes('input') || 
                      file.path.includes('parse'))
      .slice(0, 10);
    
    dataFiles.forEach(file => {
      content += `- \`${file.path}\` (importance score: ${Math.round(file.score)})\n`;
    });
  }
  content += '\n';
  
  // Return the template result
  return {
    content,
    sections: [
      'Project Identification',
      'Dependencies',
      'Entry Points',
      'Data Processing'
    ]
  };
}

// Add to TEMPLATES object
const TEMPLATES = {
  // ... existing templates
  security: generateSecurityTemplate
};
```

## Customizing Ignore Patterns

You can customize which files and directories are ignored during analysis.

### Default Ignore Patterns

By default, Project Mapper ignores:

```javascript
const DEFAULT_IGNORES = [
  'node_modules/**',
  '.git/**',
  'dist/**',
  'build/**',
  '.vscode/**',
  '.idea/**',
  'coverage/**',
  '**/test/**',
  '**/tests/**',
  '**/*.min.js',
  '**/*.min.css',
  '**/*.map',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml'
];
```

### Adding Custom Ignore Patterns

You can add your own ignore patterns:

```bash
project-mapper -i "**/*.spec.js" "docs/**" "examples/**"
```

Or programmatically:

```javascript
const options = {
  ignore: ['**/*.spec.js', 'docs/**', 'examples/**']
};

const result = await generateProjectMap('./my-project', options);
```

## Customizing Semantic Analysis

You can customize how semantic analysis extracts domain concepts.

### Semantic Analysis Options

```javascript
const options = {
  // Project directory to analyze
  projectDir: './my-project',
  
  // Semantic analysis options
  semanticOptions: {
    // Paths to ignore
    ignorePaths: ['node_modules/**', 'dist/**'],
    
    // Include code comments in analysis
    includeComments: true,
    
    // Include documentation files in analysis
    includeDocs: true,
    
    // Include code identifiers in analysis
    includeIdentifiers: true,
    
    // Minimum frequency for a term to be included
    minTermFrequency: 2,
    
    // Maximum number of terms to include
    maxTerms: 50
  }
};

// Perform semantic analysis
const semantics = await analyzeProjectSemantics(options.projectDir, options.semanticOptions);
```

### Filtering Domain Concepts

You might want to filter domain concepts to focus on specific areas:

```javascript
// Get semantic analysis
const semantics = await analyzeProjectSemantics('./my-project');

// Filter concepts to those related to a specific domain
const filteredConcepts = semantics.domainConcepts.filter(concept => {
  // Only include concepts related to authentication/security
  return concept.name.includes('auth') || 
         concept.name.includes('secur') || 
         concept.name.includes('user') ||
         concept.name.includes('login');
});

// Replace the concepts in the semantics object
semantics.domainConcepts = filteredConcepts;

// Use the filtered semantics in knowledge transfer
analysis.semantics = semantics;
const document = await enhancedKnowledgeTransfer(analysis);
```

## Creating Custom Visualizations

Project Mapper includes several visualization functions