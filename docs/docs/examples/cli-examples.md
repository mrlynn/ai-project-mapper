---
sidebar_position: 1
---

# CLI Examples

This page provides practical examples of using Project Mapper's command-line interface for different scenarios.

## Basic Examples

### Generate a Standard Knowledge Transfer Document

```bash
# Navigate to your project directory
cd your-project

# Generate a standard knowledge transfer document
project-mapper
```

This will create a file named `project-knowledge-transfer.md` in the current directory.

### Analyze a Different Directory

```bash
# Analyze a project in a different location
project-mapper /path/to/your/project
```

### Specify a Custom Output File

```bash
# Write the output to a custom file
project-mapper -o custom-summary.md
```

## Template Examples

### Generate a Minimal Summary

```bash
# Create a brief overview using the minimal template
project-mapper -t minimal
```

### Generate a Detailed Analysis

```bash
# Create a comprehensive analysis using the detailed template
project-mapper -t detailed
```

### Output in JSON Format

```bash
# Generate the analysis in JSON format instead of Markdown
project-mapper -f json -o project-analysis.json
```

## Customizing Analysis

### Ignore Specific Directories

```bash
# Exclude test files and the dist directory
project-mapper -i test/**,dist/**
```

### Limit Analysis Depth

```bash
# Only analyze directories up to 3 levels deep
project-mapper -d 3
```

### Enable Verbose Output

```bash
# Show detailed information during analysis
project-mapper -v
```

## Advanced Features

### Generate a Context Questionnaire

```bash
# Create a questionnaire to gather additional context
project-mapper --generate-questionnaire
```

### Include LLM Guide

```bash
# Include guidance for LLMs in the output
project-mapper --include-guide
```

### Skip Analysis and Use Existing File

```bash
# Use an existing analysis file instead of re-analyzing
project-mapper --skip-analysis
```

### Specify a Custom Analysis File

```bash
# Use a specific analysis file as input
project-mapper --skip-analysis --analysis-file custom-analysis.json
```

## Combining Options

### Complete Analysis with All Features

```bash
# Generate a detailed report with all features enabled
project-mapper -t detailed --include-guide --generate-questionnaire -v
```

### Quick Analysis for Large Projects

```bash
# Perform a quick analysis on a large project
project-mapper -t minimal -d 3 -i node_modules/**,dist/**,test/**
```

### Analysis for Documentation

```bash
# Generate documentation-focused analysis
project-mapper -t detailed -o docs/project-structure.md --include-guide
```

## Working with Multiple Projects

### Comparing Projects

```bash
# Analyze multiple projects with different output files
project-mapper /path/to/project-a -o project-a-analysis.md
project-mapper /path/to/project-b -o project-b-analysis.md
```

### Batch Processing

```bash
# Create a simple bash script to analyze multiple projects
#!/bin/bash
for project in /path/to/projects/*; do
  if [ -d "$project" ]; then
    echo "Analyzing $project..."
    project-mapper "$project" -o "$(basename "$project")-analysis.md"
  fi
done
```

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/project-mapper.yml
name: Generate Project Map

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  generate-map:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16
      - name: Install Project Mapper
        run: npm install -g project-mapper
      - name: Generate project map
        run: project-mapper -o project-knowledge-transfer.md
      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: project-map
          path: project-knowledge-transfer.md
```

## Troubleshooting Examples

### Handle Memory Issues with Large Projects

```bash
# Increase Node.js memory limit for large projects
NODE_OPTIONS=--max-old-space-size=8192 project-mapper
```

### Debug Analysis Issues

```bash
# Enable verbose output and save to a log file
project-mapper -v > analysis-log.txt 2>&1
```