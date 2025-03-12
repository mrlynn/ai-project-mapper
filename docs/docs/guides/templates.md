---
sidebar_position: 2
---

# Templates Guide

Project Mapper includes different templates for generating knowledge transfer documents. Each template is designed for a specific use case and provides different levels of detail.

## Available Templates

Project Mapper offers three main templates:

1. **Standard** (default) - A comprehensive knowledge transfer document
2. **Minimal** - A brief summary for quick overviews
3. **Detailed** - An in-depth analysis with additional information

You can specify which template to use with the `-t` or `--template` option:

```bash
project-mapper -t minimal
```

## Standard Template

The standard template is the default and provides a comprehensive knowledge transfer document that includes:

- Project identification and purpose
- Architectural overview
- Core functionality
- Integration points
- Domain-specific knowledge
- Implementation insights

This template is well-balanced and suitable for most projects. It provides enough detail to understand the project architecture without overwhelming the reader with too much information.

Example sections in the standard template:

```markdown
# Project Knowledge Transfer

## Project Identification
...

## Architectural Overview
...

## Core Functionality
...

## Integration Points
...

## Domain-Specific Knowledge
...

## Implementation Insights
...
```

## Minimal Template

The minimal template provides a brief summary of the project, focusing on:

- Basic project overview
- Key components
- Main functionality
- Important files
- Core dependencies

This template is ideal for quick overviews or when you're mainly interested in high-level understanding. It's also useful for smaller projects where a full analysis might be excessive.

Example sections in the minimal template:

```markdown
# Project Summary

## Overview
...

## Key Components
...

## Main Functionality
...

## Important Files
...

## Key Dependencies
...
```

## Detailed Template

The detailed template provides an in-depth analysis that adds:

- File structure visualization
- Detailed analysis of key files
- Dependency relationship tables
- Code examples
- Additional visualizations
- More comprehensive domain terminology

This template is best for deep dives into project architecture and implementation details. It's particularly useful for complex projects or when onboarding new team members.

Example sections in the detailed template (includes all standard sections plus):

```markdown
# Project Knowledge Transfer

... (standard sections) ...

## File Structure
...

## Key Files Details
...

## Dependency Relationships
...

## Representative Code Examples
...
```

## Enhanced Templates with Semantic Analysis

When semantic analysis is enabled (the default), all templates are enhanced with additional sections:

- **Domain Concept Network** - Key concepts and their relationships
- **Enhanced Terminology** - Project-specific terms and their definitions
- **Conceptual Distribution** - How concepts are distributed across the codebase

These enhancements help LLMs better understand the project's specific domain language and conceptual model.

## Choosing the Right Template

- Use **standard** for most projects and general understanding
- Use **minimal** for quick overviews or smaller projects
- Use **detailed** for complex projects or deep dives

You can experiment with different templates to find the one that works best for your specific needs and project complexity.