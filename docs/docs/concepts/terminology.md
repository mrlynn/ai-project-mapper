---
sidebar_position: 2
---

# Project Terminology

This document explains the key terminology and concepts used in Project Mapper's codebase and documentation.

## Core Concepts

### Knowledge Transfer

In Project Mapper, "knowledge transfer" refers to the process of extracting and summarizing project knowledge in a format that's optimized for LLMs. The knowledge transfer document is the main output of the tool, designed to help AI assistants understand your codebase.

### Analysis

Analysis is the process of examining a project's structure, files, and code to extract meaningful information. Project Mapper performs several types of analysis:

- **Structure analysis**: Identifies files, directories, and their relationships
- **Code analysis**: Examines code to extract functions, classes, imports, and exports
- **Semantic analysis**: Extracts domain concepts and terminology
- **Dependency analysis**: Maps relationships between components

### Semantic Understanding

Semantic understanding refers to the ability to extract and understand domain-specific concepts and terminology from the codebase. This goes beyond simple code structure analysis to understand the meaning and relationships between concepts.

### Project Map

A project map is a comprehensive representation of a project's structure, components, and relationships. It includes both the raw analysis data and the formatted knowledge transfer document.

## Technical Terms

### Domain Concept

A domain concept is a term or idea that's central to understanding the project's domain. Project Mapper identifies domain concepts based on their frequency and distribution throughout the codebase.

### Concept Network

The concept network is a graph representation of domain concepts and their relationships. It helps visualize how different concepts in the project are connected.

### Template

Templates are predefined formats for generating knowledge transfer documents. Project Mapper includes:
- **Standard template**: A comprehensive knowledge transfer document
- **Minimal template**: A brief summary for quick overviews
- **Detailed template**: An in-depth analysis with additional information

### Component

In Project Mapper terminology, a component refers to a major part of the project's architecture. Components might be directories, modules, or logical groupings of functionality.

### Entry Point

An entry point is a file that serves as a main starting point for the application, such as `index.js` or a CLI file. Project Mapper identifies entry points to understand how the application is initialized.

### Dependency Graph

The dependency graph maps relationships between files in the project, showing which files import or depend on other files. This helps understand the project's structure and data flow.

## File-Related Terms

### Important Files

Important files are key files in the project identified based on various heuristics, such as:
- Being referenced by many other files
- Containing many exports
- Being entry points
- Having significant functionality

### File Type

Project Mapper categorizes files based on their extensions (e.g., JavaScript, Markdown, JSON) to understand the project's composition and apply appropriate analysis techniques.

## Code Analysis Terms

### AST (Abstract Syntax Tree)

An abstract syntax tree is a tree representation of the structure of source code. Project Mapper uses ASTs to analyze JavaScript/TypeScript code and extract information about functions, classes, imports, and exports.

### Export

Exports are functions, classes, or variables that a module makes available for other modules to use. Project Mapper tracks exports to understand what functionality each module provides.

### Import

Imports are references to functionality from other modules. Project Mapper tracks imports to understand dependencies between modules.

## Semantic Analysis Terms

### TF-IDF (Term Frequency-Inverse Document Frequency)

A numerical statistic used in natural language processing to identify important terms in documents. Project Mapper uses TF-IDF to identify domain concepts based on their frequency and uniqueness.

### N-gram

An n-gram is a contiguous sequence of n items from a given sample of text. Project Mapper uses n-grams (especially bigrams and trigrams) to identify multi-word concepts that appear frequently together.

### Domain Glossary

The domain glossary is a collection of domain-specific terms and their definitions, generated based on context from the codebase and documentation.

## CLI Terms

### Ignore Pattern

Glob patterns that specify which files or directories to exclude from analysis (e.g., `node_modules/**`).

### Depth

The maximum directory depth to traverse during analysis, used to limit the scope of analysis for large projects.

### Questionnaire

A set of questions generated based on project analysis to gather additional context about the project from developers.