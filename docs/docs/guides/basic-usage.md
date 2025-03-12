---
sidebar_position: 2
---

# Getting Started

This guide will help you install Project Mapper and generate your first knowledge transfer document.

## Installation

You have two options for using Project Mapper:

### Install Globally

Install Project Mapper globally to use it across all your projects:

```bash
npm install -g project-mapper
```

Once installed globally, you can run it using the `project-mapper` command.

### Use with npx (No Installation)

Alternatively, you can use Project Mapper without installation using `npx`:

```bash
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

## Basic Usage

### Analyze Current Directory

By default, Project Mapper analyzes the current directory:

```bash
project-mapper
```

### Analyze a Specific Directory

You can specify a different directory to analyze:

```bash
project-mapper /path/to/your/project
```

### Specify Output File

Change the output file name and location:

```bash
project-mapper -o custom-summary.md
```

## Next Steps

After generating your first knowledge transfer document, check out:

- [Basic Usage Guide](basic-usage) for more command line options
- [Templates Guide](templates) to learn about different template options
- [LLM Workflow Guide](llm-workflow) to see how to use Project Mapper with LLMs effectively