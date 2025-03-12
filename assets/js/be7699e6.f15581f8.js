"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[2140],{8373:e=>{e.exports=JSON.parse('{"archive":{"blogPosts":[{"id":"/2025/03/12/ai-assisted-development","metadata":{"permalink":"/ai-project-mapper/blog/2025/03/12/ai-assisted-development","editUrl":"https://github.com/mrlynn/ai-project-mapper/tree/main/blog/blog/2025-03-12-ai-assisted-development.md","source":"@site/blog/2025-03-12-ai-assisted-development.md","title":"AI-Driven Development","description":"As part of my job as a Developer Advocate at Mongodb, I\'m painfully aware of the challenges developers face today. With the volume and velocity, and complexity of projects, Large Language Models (LLMs) like ChatGPT, Claude, and GitHub Copilot have quickly become critical tools developers must depend on. I use these tools every day to assist with code writing, debugging, explaining complex systems, and even architecting solutions. However, if you\'ve tried using these tools for substantial work on an existing codebase, you\'ve likely faced a significant limitation: context.","date":"2025-03-12T00:00:00.000Z","tags":[{"inline":true,"label":"ai","permalink":"/ai-project-mapper/blog/tags/ai"},{"inline":true,"label":"llm","permalink":"/ai-project-mapper/blog/tags/llm"},{"inline":true,"label":"development","permalink":"/ai-project-mapper/blog/tags/development"},{"inline":true,"label":"blog","permalink":"/ai-project-mapper/blog/tags/blog"}],"readingTime":6.905,"hasTruncateMarker":false,"authors":[{"name":"Michael Lynn","title":"Developer Advocate @ MongoDB","url":"https://github.com/mrlynn","imageURL":"https://avatars.githubusercontent.com/u/192552?v=4","key":null,"page":null}],"frontMatter":{"title":"AI-Driven Development","author":"Michael Lynn","author_title":"Developer Advocate @ MongoDB","author_url":"https://github.com/mrlynn","author_image_url":"https://avatars.githubusercontent.com/u/192552?v=4","tags":["ai","llm","development","blog"]},"unlisted":false,"nextItem":{"title":"Getting Started with Project Mapper","permalink":"/ai-project-mapper/blog/2025/03/12/getting-started-with-project-mapper"}},"content":"As part of my job as a Developer Advocate at Mongodb, I\'m painfully aware of the challenges developers face today. With the volume and velocity, and complexity of projects, Large Language Models (LLMs) like ChatGPT, Claude, and GitHub Copilot have quickly become critical tools developers must depend on. I use these tools every day to assist with code writing, debugging, explaining complex systems, and even architecting solutions. However, if you\'ve tried using these tools for substantial work on an existing codebase, you\'ve likely faced a significant limitation: _context_.\\n\\n## The Context Problem\\n\\nThe tools I\'ve mentioned and the LLMs upon which they depend have limits when it comes to their context window... the amount of text they can see and understand at one time. Despite many of the recent improvements that have expanded context windows, they still can\'t ingest and fully understand entire large codebases, particularly for medium to large projects. When you attempt to work with an LLM on an existing project, you\'ll likely run into these challenges:\\n\\n1. **Token limitations**: Only a fraction of your codebase can be shared at once.\\n2. **Fragmented understanding**: Sharing individual files without context results in a disjointed understanding.\\n3. **Missing relationships**: Dependencies between components often get lost.\\n4. **Domain-specific terminology**: Repeated explanations are needed for project-specific jargon.\\n5. **Project architecture**: Conveying the big picture is difficult with just code snippets.\\n\\nSo what ends up happening...? More time is spent explaining your project to the AI than receiving meaningful help. Your interactions become inefficient and frustrating, as you repeatedly provide context that should be implicit.\\n\\n## Enter Project Mapper\\n\\nThis is precisely the problem I am trying to solve with [Project Mapper](https://github.com/mrlynn/ai-project-mapper). Project Mapper is a CLI and a set of plugins that help you generate comprehensive summaries of your codebase. It aims to address the issues mentioned above by providing a structured overview of your project. It does this by scanning your project\'s directory structure, identifying major components, inferring design patterns, recognizing terminology, and uncovering potential limitations. Project Mapper generates comprehensive, LLM-friendly summaries of your codebase. It then produces a \\"knowledge transfer document\\" that gives AI assistants a holistic view of your code. \\n\\n### How It Works\\n\\nProject Mapper works in one of several straightforward stages:\\n\\n1. **Analysis**: It scans your project\'s directory structure, languages, import/export relationships, functions, classes, entry points, and dependencies.\\n    \\n2. **Distillation**: The tool identifies major components, infers design patterns, recognizes terminology, and uncovers potential limitations.\\n    \\n3. **Generation**: Finally, it creates a structured knowledge transfer document optimized for LLM consumption.\\n\\nThe result is a fairly concise yet comprehensive summary that fits within the token limits while providing crucial context about your project.\\n\\n## Real-World Impact\\n\\nLet\'s see how Project Mapper improves your workflow when using popular AI tools:\\n\\n### Without Project Mapper\\n\\n**ChatGPT:**\\n\\n```\\nYou: I need to add a feature to my project that processes new transaction types. ChatGPT: I\'d be happy to help! Could you share details about your project and how transactions are currently processed? You: *pastes a file* This is our main transaction processor. ChatGPT: I see. What database are you using? How is validation handled? You: *pastes another file* Here\'s our validation logic. ChatGPT: And how does this integrate with the rest of your system? You: *sighs and pastes more code*\\n```\\n\\n**Cursor:**\\n\\n```\\nYou: Add support for cryptocurrency transactions. Cursor: I need to understand how transactions are structured in your project. Can you navigate to the relevant files? You: *navigates through multiple files manually*\\n```\\n\\nThis back-and-forth continues, until you\'ve consumed all of your time, and your available tokens...eating up your valuable time and the AI\'s context window with explanations rather than solutions.\\n\\n### With Project Mapper\\n\\n**Claude:**\\n\\n```\\nYou: *uploads project-knowledge-transfer.md* Based on this document, I need to add support for cryptocurrency transactions. Claude: Based on your project structure, I see that you have a TransactionService in `src/services/` handling transactions through the `processTransaction` method. Transactions are validated in the `Transaction` model with the `isValid()` method.  To add cryptocurrency support, you\'ll need to: \\n\\n1. Update the `Transaction` model to include crypto-specific fields. \\n2. Extend the `isValid()` validation logic. \\n3. Add a new fee calculation method for crypto in `calculateFee()`. \\n4. Update the `TransactionController` to handle the new transaction type.  Here\'s how you can implement each step...\\n```\\n\\nThe difference is night and day. With Project Mapper, the AI can immediately understand your project\'s structure, architecture, and patterns, providing contextual help without the endless back-and-forth.\\n\\n## Integration with Popular Developer Tools\\n\\nProject Mapper enhances your experience with a wide array of AI development tools:\\n\\n### Web-Based Assistants\\n\\n- **ChatGPT** and **Claude** now understand your entire project through a single knowledge transfer document, which fits comfortably within their context windows.\\n    \\n- **Perplexity** can provide more accurate answers based on a clearer understanding of your project\'s capabilities and limitations.\\n    \\n\\n### Developer-Focused Tools\\n\\n- **Cursor** can offer more accurate code completions and suggestions when it has a complete understanding of your project.\\n    \\n- **GitHub Copilot** benefits from improved context when you\'re working across multiple files or components.\\n    \\n- **Anthropic\'s Claude for VSCode** can reference your project structure when offering assistance.\\n    \\n## Beyond Efficiency: Opening New Possibilities\\n\\nThe benefits of Project Mapper go beyond just saving time:\\n\\n### Better Quality Assistance\\n\\nHaving a clear understanding of your project\'s architecture, design patterns, and terminology, LLMs are more likely to suggest code that aligns with your existing structure and conventions rather than offering generic solutions.\\n\\n### Knowledge Transfer for Human Teams\\n\\nThe same knowledge transfer documents that assist LLMs also provide an invaluable resource for new team members, helping them get up to speed quickly by offering a high-level project overview that is often missing from traditional documentation.\\n\\n### Architectural Insights\\n\\nHaving an external system analyze and summarize your project can reveal patterns or architectural decisions you hadn\'t fully articulated. Project Mapper offers a fresh perspective on your own project.\\n\\n## Practical Tips for AI-Driven Development\\n\\nFrom my experience developing and using Project Mapper, here are a few best practices for integrating AI tools into your development process:\\n\\n1. **Generate fresh summaries after significant changes** to keep the AI\'s understanding current.\\n2. **Use the detailed template for complex projects** with many components.\\n3. **Ask the AI to become an expert on your project** before diving into specific questions.\\n4. **Reference specific sections** from the knowledge transfer document in your questions.\\n5. **Combine Project Mapper with other context sources** like architecture diagrams or business requirements.\\n\\n## Getting Started with Project Mapper\\n\\nReady to give it a try? Installation is a breeze:\\n\\n### Install globally\\n\\n`npm install -g project-mapper  `\\n\\n### Or use it with npx without installing \\n\\nnpx project-mapper`\\n\\nThen, simply navigate to your project directory and run:\\n\\n`project-mapper`\\n\\nThe tool will analyze your project and generate a `project-knowledge-transfer.md` file that you can share with any LLM.\\n\\n## The Future of AI-Augmented Development\\n\\nTools like Project Mapper highlight the future of AI-powered development... where the line between human developers and AI assistants becomes increasingly seamless. Rather than replacing developers, AI tools are becoming powerful extensions of our abilities... making developers more productive and capable of tackling complex problems... provided they have the right context.\\n\\nAs context windows expand and embedding techniques evolve, we\'ll likely see even more advanced ways of providing LLMs with a comprehensive view of our projects. But one thing will remain clear: better context leads to better assistance.\\n\\n## Conclusion\\n\\nIf you\'re a developer using AI tools, improving the AI\'s understanding of your project is a game-changer. Project Mapper now provides another approach to solving the context problem, focusing on generating concise yet comprehensive knowledge transfer documents that make your codebase more accessible to LLMs.\\n\\nNext time you\'re stuck copy-pasting files into ChatGPT or repeatedly explaining your project structure to an AI assistant, remember: there\'s a better way. Using the right tools, AI can grasp your project as a cohesive whole rather than a series of disconnected fragments.\\n\\nWhat\'s been your experience with using AI tools for development? Have you found other effective ways to provide context to your AI assistants? I\'d love to hear your thoughts and experiences in the comments.\\n\\n---\\n\\n_Michael Lynn is a software developer and AI enthusiast focused on creating tools that improve developer workflows. You can find more of his work on [GitHub](https://github.com/mrlynn)._"},{"id":"/2025/03/12/getting-started-with-project-mapper","metadata":{"permalink":"/ai-project-mapper/blog/2025/03/12/getting-started-with-project-mapper","editUrl":"https://github.com/mrlynn/ai-project-mapper/tree/main/blog/blog/2025-03-12-getting-started-with-project-mapper.md","source":"@site/blog/2025-03-12-getting-started-with-project-mapper.md","title":"Getting Started with Project Mapper","description":"Here\'s the complete structure for the Docusaurus documentation site:","date":"2025-03-12T00:00:00.000Z","tags":[{"inline":true,"label":"ai","permalink":"/ai-project-mapper/blog/tags/ai"},{"inline":true,"label":"llm","permalink":"/ai-project-mapper/blog/tags/llm"},{"inline":true,"label":"development","permalink":"/ai-project-mapper/blog/tags/development"},{"inline":true,"label":"blog","permalink":"/ai-project-mapper/blog/tags/blog"}],"readingTime":2.035,"hasTruncateMarker":false,"authors":[{"name":"Michael Lynn","title":"Developer Advocate @ MongoDB","url":"https://github.com/mrlynn","imageURL":"https://avatars.githubusercontent.com/u/192552?v=4","key":null,"page":null}],"frontMatter":{"title":"Getting Started with Project Mapper","author":"Michael Lynn","author_title":"Developer Advocate @ MongoDB","author_url":"https://github.com/mrlynn","author_image_url":"https://avatars.githubusercontent.com/u/192552?v=4","tags":["ai","llm","development","blog"]},"unlisted":false,"prevItem":{"title":"AI-Driven Development","permalink":"/ai-project-mapper/blog/2025/03/12/ai-assisted-development"}},"content":"Here\'s the complete structure for the Docusaurus documentation site:\\n\\n```\\ndocs-website/\\n\u251c\u2500\u2500 blog/\\n\u2502   \u2514\u2500\u2500 2025-03-12-getting-started-with-project-mapper.md\\n\u251c\u2500\u2500 docs/\\n\u2502   \u251c\u2500\u2500 intro.md\\n\u2502   \u251c\u2500\u2500 getting-started.md\\n\u2502   \u251c\u2500\u2500 guides/\\n\u2502   \u2502   \u251c\u2500\u2500 basic-usage.md\\n\u2502   \u2502   \u251c\u2500\u2500 templates.md\\n\u2502   \u2502   \u251c\u2500\u2500 customization.md\\n\u2502   \u2502   \u2514\u2500\u2500 llm-workflow.md\\n\u2502   \u251c\u2500\u2500 api/\\n\u2502   \u2502   \u2514\u2500\u2500 api-reference.md\\n\u2502   \u251c\u2500\u2500 concepts/\\n\u2502   \u2502   \u251c\u2500\u2500 architecture.md\\n\u2502   \u2502   \u2514\u2500\u2500 terminology.md\\n\u2502   \u2514\u2500\u2500 examples/\\n\u2502       \u251c\u2500\u2500 cli-examples.md\\n\u2502       \u2514\u2500\u2500 api-examples.md\\n\u251c\u2500\u2500 src/\\n\u2502   \u251c\u2500\u2500 components/\\n\u2502   \u2502   \u2514\u2500\u2500 HomepageFeatures/\\n\u2502   \u2502       \u251c\u2500\u2500 index.js\\n\u2502   \u2502       \u2514\u2500\u2500 styles.module.css\\n\u2502   \u251c\u2500\u2500 css/\\n\u2502   \u2502   \u2514\u2500\u2500 custom.css\\n\u2502   \u2514\u2500\u2500 pages/\\n\u2502       \u251c\u2500\u2500 index.js\\n\u2502       \u2514\u2500\u2500 index.module.css\\n\u251c\u2500\u2500 static/\\n\u2502   \u2514\u2500\u2500 img/\\n\u2502       \u251c\u2500\u2500 logo.svg\\n\u2502       \u251c\u2500\u2500 feature-summary.svg\\n\u2502       \u251c\u2500\u2500 feature-semantic.svg\\n\u2502       \u251c\u2500\u2500 feature-llm.svg\\n\u2502       \u2514\u2500\u2500 project-mapper-social-card.jpg\\n\u251c\u2500\u2500 docusaurus.config.js\\n\u251c\u2500\u2500 package.json\\n\u2514\u2500\u2500 sidebars.js\\n```\\n\\n## Key Files and Their Purposes\\n\\n### Configuration Files\\n\\n- **docusaurus.config.js**: Main configuration for the Docusaurus site\\n- **sidebars.js**: Configures the documentation sidebar navigation\\n- **package.json**: Dependencies and scripts for the project\\n\\n### Documentation Content\\n\\n- **docs/intro.md**: Main landing page for the documentation\\n- **docs/getting-started.md**: Installation and quick start guide\\n- **docs/guides/**: Directory containing detailed guides\\n- **docs/api/**: Directory containing API documentation\\n- **docs/concepts/**: Directory containing conceptual explanations\\n- **docs/examples/**: Directory containing practical examples\\n\\n### React Components\\n\\n- **src/pages/index.js**: Homepage for the documentation site\\n- **src/components/HomepageFeatures/**: Component for the feature section on the homepage\\n\\n### Styling\\n\\n- **src/css/custom.css**: Global CSS customizations\\n- **src/pages/index.module.css**: CSS modules specific to the homepage\\n- **src/components/HomepageFeatures/styles.module.css**: CSS modules for the features component\\n\\n### Assets\\n\\n- **static/img/logo.svg**: Project logo\\n- **static/img/feature-*.svg**: SVG illustrations for features\\n- **static/img/project-mapper-social-card.jpg**: Social media preview image\\n\\n### Blog Posts\\n\\n- **blog/2025-03-12-getting-started-with-project-mapper.md**: Introduction blog post\\n\\n## Building and Deploying\\n\\nTo build the documentation site:\\n\\n```bash\\n# Navigate to the Docusaurus project\\ncd docs-website\\n\\n# Install dependencies\\nnpm install\\n\\n# Start the development server\\nnpm run start\\n\\n# Build for production\\nnpm run build\\n```\\n\\nThe built site will be in the `build` directory, ready to deploy to any static hosting service.\\n\\n## Next Steps\\n\\nAfter setting up the basic structure:\\n\\n1. Fill in any missing content in the documentation files\\n2. Customize the styling to match your brand\\n3. Add more blog posts as the project evolves\\n4. Set up a deployment pipeline to automatically publish updates\\n\\n## Additional Customization\\n\\n- Add search functionality using Algolia DocSearch\\n- Configure versioning when you release new versions\\n- Add internationalization for multi-language support\\n- Add more interactive components like code playgrounds"}]}}')}}]);