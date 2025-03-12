# Project Mapper

![Project Mapper Banner](https://img.shields.io/badge/Project%20Mapper-LLM--Friendly%20Code%20Analysis-blue)

Generate LLM-friendly project summaries to help AI assistants understand your codebase.

[![npm version](https://img.shields.io/badge/npm-v0.1.0-blue.svg)](https://www.npmjs.com/package/project-mapper)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![Documentation](https://img.shields.io/badge/docs-online-informational.svg)](https://mrlynn.github.io/ai-project-mapper)
[![Build Status](https://github.com/mrlynn/ai-project-mapper/actions/workflows/test.yml/badge.svg)](https://github.com/mrlynn/ai-project-mapper/actions/workflows/test.yml)
[![Coverage Status](https://img.shields.io/codecov/c/github/mrlynn/ai-project-mapper/main.svg)](https://codecov.io/gh/mrlynn/ai-project-mapper)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/mrlynn/ai-project-mapper/graphs/commit-activity)
[![Downloads](https://img.shields.io/npm/dm/project-mapper.svg)](https://www.npmjs.com/package/project-mapper)

## Overview

Project Mapper analyzes your codebase and creates a comprehensive knowledge transfer document optimized for Large Language Models (LLMs). This enables AI assistants to quickly understand your project's architecture, components, and patterns, providing more accurate and contextual assistance.

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
# 1. Navigate to your project directory
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

For complete documentation, visit our [official documentation site](https://mrlynn.github.io/ai-project-mapper).

## Working with LLMs

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

## API Reference

You can also use Project Mapper programmatically:

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
  
  console.log(`Project has ${rawAnalysis.overview.totalFiles} files`);
}

analyzeMyProject();
```

See the [API documentation](https://mrlynn.github.io/ai-project-mapper/docs/api/api-reference) for more details.

## Benefits

- **Better AI assistance**: Get more accurate suggestions and code completions
- **Faster onboarding**: Help team members understand your project structure
- **Documentation**: Use as a base for project documentation
- **Knowledge sharing**: Facilitate discussions about architecture and design
- **Time savings**: Spend less time explaining your codebase to LLMs

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

[Documentation](https://mrlynn.github.io/ai-project-mapper) | [Report issues](https://github.com/yourusername/project-mapper/issues) | [Request features](https://github.com/yourusername/project-mapper/issues/new?labels=enhancement)