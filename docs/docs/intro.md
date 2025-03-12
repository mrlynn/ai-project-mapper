---
sidebar_position: 1
slug: /
---

# Project Mapper

![Project Mapper Banner](https://img.shields.io/badge/Project%20Mapper-LLM--Friendly%20Code%20Analysis-blue)

**Generate LLM-friendly project summaries to help AI assistants understand your codebase.**

[![npm version](https://img.shields.io/badge/npm-v0.1.0-blue.svg)](https://www.npmjs.com/package/project-mapper)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)

## Overview

Project Mapper analyzes your codebase and creates a comprehensive knowledge transfer document optimized for Large Language Models (LLMs). This enables AI assistants to quickly understand your project's architecture, components, and patterns, providing more accurate and contextual assistance.

### The Problem

When working with LLMs on code projects, you face these challenges:

1. **Token Limitations** - LLMs can only process a limited amount of text at once
2. **Context Fragmentation** - Sending individual files loses the overall project structure
3. **Missing Relationships** - Dependencies between components are hard to communicate
4. **Terminology Gaps** - Project-specific concepts need explanation

### The Solution

Project Mapper solves these problems by creating an intelligent summary focused on what matters most:

- **Project Overview** - Quickly identify the project's purpose and type
- **Architecture Insights** - Understand the major components and control flow
- **Core Functionality** - Learn about the primary operations and language-specific handling
- **Integration Points** - See how the project interfaces with users and external systems
- **Domain Knowledge** - Grasp project-specific terminology and assumptions

## Key Features

- **Multiple Templates**: Choose between Standard, Minimal, and Detailed summaries based on your needs
- **Semantic Analysis**: Extract domain concepts and their relationships to understand project-specific terminology
- **Visualizations**: Generate concept networks and relationship diagrams to better understand project structure
- **Flexible Output**: Get results in Markdown or JSON formats
- **Questionnaire Generation**: Create tailored questionnaires to gather additional context from developers
- **LLM Optimization**: Summaries are structured specifically for effective LLM consumption

## Who Should Use Project Mapper?

- **Developers** working with AI assistants on complex codebases
- **Technical writers** creating documentation for software projects
- **Software teams** onboarding new members to existing projects
- **Open source maintainers** helping contributors understand the project
- **Anyone** who wants to get AI assistance on their codebase

## Quick Example

Here's a quick example of how easy it is to use Project Mapper:

```bash
# Navigate to your project directory
cd your-project

# Run Project Mapper
npx project-mapper

# Share the generated document with your LLM
# The summary will be saved as project-knowledge-transfer.md
```

Then ask your LLM: "Based on this knowledge transfer document, please become an expert on my project."

Ready to get started? Check out our [Getting Started](getting-started) guide!