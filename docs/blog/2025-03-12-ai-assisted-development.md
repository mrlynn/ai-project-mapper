---
title: AI-Driven Development
author: Michael Lynn
author_title: Developer Advocate @ MongoDB
author_url: https://github.com/mrlynn
author_image_url: https://avatars.githubusercontent.com/u/192552?v=4
tags: [ai, llm, development, blog]
---

# How Project Mapper Bridges the Gap Between Your Code and LLMs

As part of my job as a Developer Advocate at Mongodb, I'm painfully aware of the challenges developers face today. With the volume and velocity, and complexity of projects, Large Language Models (LLMs) like ChatGPT, Claude, and GitHub Copilot have quickly become critical tools developers must depend on. I use these tools every day to assist with code writing, debugging, explaining complex systems, and even architecting solutions. However, if you've tried using these tools for substantial work on an existing codebase, you've likely faced a significant limitation: _context_.

## The Context Problem

The tools I've mentioned and the LLMs upon which they depend have limits when it comes to their context window... the amount of text they can see and understand at one time. Despite many of the recent improvements that have expanded context windows, they still can't ingest and fully understand entire large codebases, particularly for medium to large projects. When you attempt to work with an LLM on an existing project, you'll likely run into these challenges:
<!--truncate -->

1. **Token limitations**: Only a fraction of your codebase can be shared at once.
2. **Fragmented understanding**: Sharing individual files without context results in a disjointed understanding.
3. **Missing relationships**: Dependencies between components often get lost.
4. **Domain-specific terminology**: Repeated explanations are needed for project-specific jargon.
5. **Project architecture**: Conveying the big picture is difficult with just code snippets.

So what ends up happening...? More time is spent explaining your project to the AI than receiving meaningful help. Your interactions become inefficient and frustrating, as you repeatedly provide context that should be implicit.

## Enter Project Mapper

This is precisely the problem I am trying to solve with [Project Mapper](https://github.com/mrlynn/ai-project-mapper). Project Mapper is a CLI and a set of plugins that help you generate comprehensive summaries of your codebase. It aims to address the issues mentioned above by providing a structured overview of your project. It does this by scanning your project's directory structure, identifying major components, inferring design patterns, recognizing terminology, and uncovering potential limitations. Project Mapper generates comprehensive, LLM-friendly summaries of your codebase. It then produces a "knowledge transfer document" that gives AI assistants a holistic view of your code. 

### How It Works

Project Mapper works in one of several straightforward stages:

1. **Analysis**: It scans your project's directory structure, languages, import/export relationships, functions, classes, entry points, and dependencies.
    
2. **Distillation**: The tool identifies major components, infers design patterns, recognizes terminology, and uncovers potential limitations.
    
3. **Generation**: Finally, it creates a structured knowledge transfer document optimized for LLM consumption.

The result is a fairly concise yet comprehensive summary that fits within the token limits while providing crucial context about your project.

## Real-World Impact

Let's see how Project Mapper improves your workflow when using popular AI tools:

### Without Project Mapper

**ChatGPT:**

```
You: I need to add a feature to my project that processes new transaction types. ChatGPT: I'd be happy to help! Could you share details about your project and how transactions are currently processed? You: *pastes a file* This is our main transaction processor. ChatGPT: I see. What database are you using? How is validation handled? You: *pastes another file* Here's our validation logic. ChatGPT: And how does this integrate with the rest of your system? You: *sighs and pastes more code*
```

**Cursor:**

```
You: Add support for cryptocurrency transactions. Cursor: I need to understand how transactions are structured in your project. Can you navigate to the relevant files? You: *navigates through multiple files manually*
```

This back-and-forth continues, until you've consumed all of your time, and your available tokens...eating up your valuable time and the AI's context window with explanations rather than solutions.

### With Project Mapper

**Claude:**

```
You: *uploads project-knowledge-transfer.md* Based on this document, I need to add support for cryptocurrency transactions. Claude: Based on your project structure, I see that you have a TransactionService in `src/services/` handling transactions through the `processTransaction` method. Transactions are validated in the `Transaction` model with the `isValid()` method.  To add cryptocurrency support, you'll need to: 

1. Update the `Transaction` model to include crypto-specific fields. 
2. Extend the `isValid()` validation logic. 
3. Add a new fee calculation method for crypto in `calculateFee()`. 
4. Update the `TransactionController` to handle the new transaction type.  Here's how you can implement each step...
```

The difference is night and day. With Project Mapper, the AI can immediately understand your project's structure, architecture, and patterns, providing contextual help without the endless back-and-forth.

## Integration with Popular Developer Tools

Project Mapper enhances your experience with a wide array of AI development tools:

### Web-Based Assistants

- **ChatGPT** and **Claude** now understand your entire project through a single knowledge transfer document, which fits comfortably within their context windows.
    
- **Perplexity** can provide more accurate answers based on a clearer understanding of your project's capabilities and limitations.
    

### Developer-Focused Tools

- **Cursor** can offer more accurate code completions and suggestions when it has a complete understanding of your project.
    
- **GitHub Copilot** benefits from improved context when you're working across multiple files or components.
    
- **Anthropic's Claude for VSCode** can reference your project structure when offering assistance.
    
## Beyond Efficiency: Opening New Possibilities

The benefits of Project Mapper go beyond just saving time:

### Better Quality Assistance

Having a clear understanding of your project's architecture, design patterns, and terminology, LLMs are more likely to suggest code that aligns with your existing structure and conventions rather than offering generic solutions.

### Knowledge Transfer for Human Teams

The same knowledge transfer documents that assist LLMs also provide an invaluable resource for new team members, helping them get up to speed quickly by offering a high-level project overview that is often missing from traditional documentation.

### Architectural Insights

Having an external system analyze and summarize your project can reveal patterns or architectural decisions you hadn't fully articulated. Project Mapper offers a fresh perspective on your own project.

## Practical Tips for AI-Driven Development

From my experience developing and using Project Mapper, here are a few best practices for integrating AI tools into your development process:

1. **Generate fresh summaries after significant changes** to keep the AI's understanding current.
2. **Use the detailed template for complex projects** with many components.
3. **Ask the AI to become an expert on your project** before diving into specific questions.
4. **Reference specific sections** from the knowledge transfer document in your questions.
5. **Combine Project Mapper with other context sources** like architecture diagrams or business requirements.

## Getting Started with Project Mapper

Ready to give it a try? Installation is a breeze:

### Install globally

`npm install -g project-mapper  `

### Or use it with npx without installing 

npx project-mapper`

Then, simply navigate to your project directory and run:

`project-mapper`

The tool will analyze your project and generate a `project-knowledge-transfer.md` file that you can share with any LLM.

## The Future of AI-Augmented Development

Tools like Project Mapper highlight the future of AI-powered development... where the line between human developers and AI assistants becomes increasingly seamless. Rather than replacing developers, AI tools are becoming powerful extensions of our abilities... making developers more productive and capable of tackling complex problems... provided they have the right context.

As context windows expand and embedding techniques evolve, we'll likely see even more advanced ways of providing LLMs with a comprehensive view of our projects. But one thing will remain clear: better context leads to better assistance.

## Conclusion

If you're a developer using AI tools, improving the AI's understanding of your project is a game-changer. Project Mapper now provides another approach to solving the context problem, focusing on generating concise yet comprehensive knowledge transfer documents that make your codebase more accessible to LLMs.

Next time you're stuck copy-pasting files into ChatGPT or repeatedly explaining your project structure to an AI assistant, remember: there's a better way. Using the right tools, AI can grasp your project as a cohesive whole rather than a series of disconnected fragments.

What's been your experience with using AI tools for development? Have you found other effective ways to provide context to your AI assistants? I'd love to hear your thoughts and experiences in the comments.

---

_Michael Lynn is a software developer and AI enthusiast focused on creating tools that improve developer workflows. You can find more of his work on [GitHub](https://github.com/mrlynn)._