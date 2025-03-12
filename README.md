# AI Project Mapper

![Project Mapper Banner](https://img.shields.io/badge/Project%20Mapper-LLM--Friendly%20Code%20Analysis-blue)

Generate LLM-friendly project summaries to help AI assistants understand your codebase.

[![npm version](https://img.shields.io/badge/npm-v0.1.0-blue.svg)](https://www.npmjs.com/package/project-mapper)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)

## Overview

AI Project Mapper analyzes your codebase and creates a comprehensive knowledge transfer document optimized for Large Language Models (LLMs). This enables AI assistants to quickly understand your project's architecture, components, and patterns, providing more accurate and contextual assistance.

### Why Project Mapper?

When working with LLMs on code projects, you face these challenges:

1. **Token Limitations** - LLMs can only process a limited amount of text at once
2. **Context Fragmentation** - Sending individual files loses the overall project structure
3. **Missing Relationships** - Dependencies between components are hard to communicate
4. **Terminology Gaps** - Project-specific concepts need explanation

Project Mapper solves these problems by creating an intelligent summary focused on what matters most: architecture, relationships, and key components.

## Installation

```bash
# Install globally
npm install -g project-mapper

# Or use with npx without installing
npx project-mapper
```

## Quick Start

Generate a project summary in three simple steps:

```bash
# 1. Navigate to your project
cd your-project-directory

# 2. Generate a knowledge transfer document
project-mapper

# 3. Share the generated document with your LLM
# The summary will be saved as project-knowledge-transfer.md
```

## Usage Examples

### Basic Usage

```bash
# Analyze current directory
project-mapper

# Analyze specific directory
project-mapper /path/to/your/project

# Specify output file
project-mapper -o project-summary.md
```

### Advanced Options

```bash
# Use a minimal template for quicker overview
project-mapper -t minimal

# Generate a detailed analysis with code examples
project-mapper -t detailed

# Include the LLM knowledge transfer guide in the output
project-mapper --include-guide

# Skip specific directories or files
project-mapper -i node_modules,dist,*.test.js

# Limit directory traversal depth
project-mapper -d 3
```

### Workflow with LLMs

```bash
# 1. Generate the knowledge transfer document
project-mapper

# 2. Upload the document to your LLM conversation

# 3. Ask the LLM to become an expert on your project:
# "Based on this knowledge transfer document, please become an expert on my project."

# 4. Start asking specific questions about your project:
# "How does the command line interface work in this project?"
# "What are the main data flows?"
# "How would I add a new feature to handle XYZ?"
```

## Command Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `-o, --output <file>` | Output file path | `project-knowledge-transfer.md` |
| `-i, --ignore <patterns...>` | Additional glob patterns to ignore | |
| `-d, --depth <level>` | Maximum directory depth to analyze | `10` |
| `-f, --format <format>` | Output format (markdown, json) | `markdown` |
| `-t, --template <n>` | Knowledge transfer template to use | `standard` |
| `-v, --verbose` | Enable verbose output | |
| `--skip-analysis` | Skip code analysis and use existing analysis file | |
| `--analysis-file <file>` | Path to analysis file | `project-analysis.json` |
| `--include-guide` | Include LLM knowledge transfer guide | `false` |

## Knowledge Transfer Templates

Project Mapper includes different templates for different use cases:

### Standard Template (Default)

A comprehensive knowledge transfer document that includes:
- Project identification and purpose
- Architectural overview
- Core functionality
- Integration points
- Domain-specific knowledge
- Implementation insights

Perfect for getting detailed assistance with complex projects.

### Minimal Template

A brief summary including:
- Basic project overview
- Key components
- Main functionality
- Important files
- Core dependencies

Ideal for quick overview or when you're mainly interested in high-level understanding.

### Detailed Template

An in-depth analysis that adds:
- File structure visualization
- Detailed analysis of key files
- Dependency relationship tables
- Representative code examples

Best for deep dives into project architecture and implementation details.

## How It Works

Project Mapper operates in three stages:

### 1. Analysis

The analyzer examines your project's:
- Directory structure and file organization
- Programming languages and file types
- Import/export relationships
- Function and class definitions
- Entry points and core components
- External dependencies

### 2. Distillation

The knowledge distiller:
- Extracts the most important information
- Identifies major components and operations
- Infers design patterns and architecture
- Recognizes terminology and assumptions
- Discovers limitations and improvement areas

### 3. Generation

The document generator:
- Creates a structured knowledge transfer document
- Formats information hierarchically
- Optimizes content for LLM consumption
- Includes visual representations where appropriate
- Adds usage guidance for effective communication

## Programmatic Usage

You can also use Project Mapper as a library in your own Node.js projects:

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

## API Reference

### Main Functions

#### generateProjectMap(inputDir, options)

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
- Promise<object>: Object containing `analysis` and `knowledgeTransfer`

#### analyzeProject(inputDir, options)

Analyzes a project directory without generating a knowledge transfer document.

**Parameters:**
- `inputDir` (string): Path to the project directory
- `options` (object): Configuration options

**Returns:**
- Promise<object>: Detailed analysis of the project

#### generateKnowledgeTransfer(analysis, options)

Generates a knowledge transfer document from an existing analysis.

**Parameters:**
- `analysis` (object): Project analysis object
- `options` (object): Configuration options

**Returns:**
- Promise<string|object>: Knowledge transfer document in the specified format

## Benefits

- **Better AI assistance**: Get more accurate suggestions and code completions
- **Faster onboarding**: Help team members understand your project structure
- **Documentation**: Use as a base for project documentation
- **Knowledge sharing**: Facilitate discussions about architecture and design
- **Time savings**: Spend less time explaining your codebase to LLMs

## How Project Mapper Improves LLM Interactions

| Without Project Mapper | With Project Mapper |
|------------------------|---------------------|
| LLM has limited context about your project | LLM understands your project's architecture and patterns |
| You send individual files without context | You provide a comprehensive overview with relationships |
| LLM suggestions may conflict with project patterns | LLM suggestions align with your project's style and approach |
| You spend time explaining basic project structure | You can immediately focus on specific questions |
| LLM struggles with project-specific terminology | LLM understands your domain-specific concepts |

## Best Practices

1. **Generate a fresh summary** when your project undergoes significant changes
2. **Use the detailed template** for complex projects with many components
3. **Include the guide** when sharing with an LLM for the first time
4. **Ask the LLM** to become an expert on your project before diving into questions
5. **Reference specific sections** from the knowledge transfer document in your questions

## FAQ

### Q: How is this different from just sharing my code with an LLM?

A: Project Mapper creates a structured, high-level understanding of your entire codebase that fits within token limits. Instead of fragmented context from individual files, the LLM gets a comprehensive view of architecture, relationships, and patterns.

### Q: Does this work with any programming language?

A: Yes, while JavaScript/TypeScript files are analyzed in more detail, Project Mapper works with any programming language and provides valuable insights for any codebase.

### Q: How large a project can it analyze?

A: Project Mapper has been tested with projects containing thousands of files. For very large projects, you may want to focus on specific directories or increase Node.js memory limits.

### Q: Can I customize the templates?

A: Currently, you can choose between three built-in templates. Future versions will support custom templates.

### Q: Is my code safe? Does Project Mapper send my code anywhere?

A: Yes, your code is completely safe. Project Mapper runs entirely locally and doesn't send your code to any external servers.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Inspired by the challenges of working with large codebases in LLM contexts
- Built with [Acorn](https://github.com/acornjs/acorn) for JavaScript parsing
- Uses [fast-glob](https://github.com/mrmlnc/fast-glob) for efficient file discovery

---

⭐ If you find this tool helpful, please consider giving it a star on GitHub!

[Report issues](https://github.com/yourusername/project-mapper/issues) | [Request features](https://github.com/yourusername/project-mapper/issues/new?labels=enhancement)
