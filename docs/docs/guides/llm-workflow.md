---
sidebar_position: 4
---

# LLM Workflow Guide

This guide explains how to effectively use Project Mapper with Large Language Models (LLMs) to get the most out of your code-related conversations.

## The LLM Context Challenge

LLMs face several challenges when working with code:

1. **Limited Context Window** - LLMs can only see a limited amount of text at once
2. **No Project Structure Understanding** - Individual files don't provide the big picture
3. **Missing Domain Knowledge** - Project-specific terms aren't self-explanatory
4. **Incomplete Dependency Information** - Relationships between components are hard to infer

Project Mapper creates a comprehensive project summary that addresses these challenges.

## Basic LLM Workflow

Here's the basic workflow for using Project Mapper with an LLM:

```bash
# 1. Generate the knowledge transfer document
project-mapper

# 2. Upload the document to your LLM conversation

# 3. Ask the LLM to become an expert on your project:
# "Based on this knowledge transfer document, please become an expert on my project."

# 4. Start asking specific questions about your project
```

## Effective Questions to Ask

After sharing the knowledge transfer document, you can ask questions like:

- "What are the main components of this project?"
- "How does the command line interface work?"
- "What are the key design patterns used in this codebase?"
- "How does data flow through the system?"
- "What are the main operations supported by this project?"
- "Based on this project's structure, where would I add feature X?"
- "What are the primary domain concepts in this project?"
- "How does component A interact with component B?"
- "What external dependencies does this project rely on?"
- "What's the purpose and functionality of file X?"

## Enhanced Strategies

### Use the Questionnaire

Generate a context questionnaire to gather more information:

```bash
project-mapper --generate-questionnaire
```

1. Answer the questions in the questionnaire
2. Share both the knowledge transfer document AND your questionnaire answers with the LLM
3. This gives the LLM even more context about your project

### Include the LLM Guide

Add the LLM guide to provide instructions on how to use the document:

```bash
project-mapper --include-guide
```

This adds a section specifically designed to help the LLM understand how to use the knowledge transfer document effectively.

### Use Different Templates for Different Needs

- Use the **minimal** template for quick answers about high-level structure
- Use the **standard** template for most general development questions
- Use the **detailed** template when working on complex features or deep architectural changes

```bash
project-mapper -t detailed
```

### Reference Specific Sections

When asking questions, you can reference specific sections from the knowledge transfer document:

"Looking at the 'Core Functionality' section, can you explain how the file processing works?"

### Iterative Refinement

If the LLM doesn't fully understand some aspect of your project:

1. Ask clarifying questions about what's unclear
2. Generate a more detailed template or focus on a specific subsystem
3. Provide additional examples or context when needed

## Example Conversation

Here's an example of an effective conversation with an LLM using a Project Mapper document:

**You**: *[Upload project-knowledge-transfer.md]*

**You**: Based on this knowledge transfer document, please become an expert on my project.

**LLM**: I've reviewed the knowledge transfer document for Project Mapper. It appears to be a CLI tool designed to generate LLM-friendly summaries of code projects. The tool analyzes project structure, dependencies, and code to create comprehensive knowledge transfer documents. Let me know what specific aspects you'd like to understand better!

**You**: How would I add a new template to this project?

**LLM**: To add a new template to Project Mapper, you'll need to:

1. First, locate the `knowledge-transfer.js` file where templates are defined. Based on the knowledge transfer document, templates are defined in the `TEMPLATES` object.

2. Add your new template function to this object. You'll need to create a function similar to the existing ones (standard, minimal, detailed).

3. Implement your template function following the pattern of existing template functions. Your function should:
   - Accept analysis and projectName parameters
   - Generate appropriate content sections
   - Return an object with content and sections properties

4. Update the CLI options in `src/cli.js` to include your new template as an option.

5. Update documentation to inform users about the new template option.

Would you like me to help you implement a specific template or explain any part of this process in more detail?

## Best Practices

1. **Generate fresh summaries** when your project undergoes significant changes
2. **Be specific** in your questions about the project
3. **Iterate** on complex questions by breaking them down
4. **Combine** the knowledge transfer document with specific code snippets when needed
5. **Reference** the knowledge transfer document in your questions
6. **Consider** generating different templates for different aspects of your project