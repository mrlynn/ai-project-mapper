# ai-project-mapper Project Knowledge Transfer

## Project Identification

**Name:** project-mapper

**Primary Purpose:** Generate LLM-friendly project summaries to help AI assistants understand your codebase

**Application Type:** Command-line interface (CLI) tool

**Problem It Solves:** Generate LLM-friendly project summaries to help AI assistants understand your codebase

## Architectural Overview

### Major Components

1. **Core Library** - Contains the main functionality and business logic
   - Located in `src`
   - Responsibilities:
     - Implement core algorithms
     - Process data
     - Provide main API

2. **Entry Point** - Main application entry point that initializes the system
   - Located in `src/index.js`
   - Responsibilities:
     - Initialize the application
     - Handle startup logic
     - Coordinate other components

### Control Flow

1. User invokes the application with command-line arguments
2. System parses and validates arguments
3. Core functionality is executed based on the command
4. Results are displayed to the user in the terminal

### Key Design Patterns

- **ES Modules:** Uses ES module system for code organization and dependency management
- **Functional Approach:** Primarily uses functions and composition rather than classes
- **Modular Architecture:** Organizes code into focused, single-purpose modules
- **Pipeline Architecture:** Processes data through sequential stages of transformation

## Core Functionality

### Primary Operations

1. **start Script**
   - Function: `node --max-old-space-size=8192 src/cli.js`
   - Starts the application
   - Defined in package.json

2. **test Script**
   - Function: `node --test`
   - Runs the test suite
   - Defined in package.json

3. **prepare Script**
   - Function: `mkdir -p bin && chmod +x src/cli.js bin/project-mapper.js`
   - Runs script: mkdir -p bin && chmod +x src/cli.js bin/project-mapper.js
   - Defined in package.json

### Language-Specific Handling

The project includes code in the following languages:

- **JavaScript**: 11 files (34% of codebase)
- **Markdown**: 6 files (53% of codebase)
- **JSON**: 2 files (3% of codebase)
- **Shell**: 1 files (0% of codebase)
- **YAML**: 1 files (0% of codebase)

## Integration Points

### User Interface

1. **Command Line Interface**
   - Format: `npx project-mapper [options]`
   - Key options:
     - `--help`: Display help information
     - `--version`: Display version information
     - `--verbose`: Enable verbose output

2. **Programmatic API**
   - Format: `const result = require('project-mapper').functionName()`

### External Dependencies

1. **Core Dependencies:**
   - `acorn`: JavaScript parser
   - `acorn-walk`: External dependency
   - `chalk`: Terminal string styling
   - `commander`: Command-line interface creator
   - `fast-glob`: Fast file globbing library
   - `markdown-table`: External dependency
   - `natural`: External dependency
   - `ora`: Elegant terminal spinners
   - `prettier`: Code formatter
   - `d3`: Data visualization library
   - `inquirer`: Interactive command line prompts

2. **Development Dependencies:**
   - `express`: Web server framework
   - `fs-extra`: Enhanced file system methods

## Domain-Specific Knowledge

### Terminology

- **Generate:** A key concept in this project
- **Concept:** A key concept in this project
- **Analyze:** A key concept in this project, related to analyzer
- **Project:** A key concept in this project, related to project-summary
- **Infer:** A key concept in this project
- **Knowledge:** A key concept in this project, related to knowledge-transfer
- **Transfer:** A key concept in this project, related to knowledge-transfer
- **Questionnaire:** A key concept in this project
- **Documentation:** A key concept in this project
- **Network:** A key concept in this project
- **File:** A key concept in this project
- **Code-analysis:** A key concept in this project
- **Extract:** A key concept in this project
- **Semantics:** A key concept in this project, related to semantic
- **Visualization:** A key concept in this project
- **Mermaid:** A key concept in this project

### Key Assumptions

1. The code runs in a Node.js environment
2. The project uses ES modules (import/export) syntax
3. Users interact via command-line interface
4. Required command-line arguments will be provided correctly

### Current Limitations

1. No graphical user interface is provided
2. Requires Node.js to be installed

## Implementation Insights

### Performance Considerations

- Contains large files that may affect load times or memory usage
- Performance depends on the hardware and environment where the code runs
- As with all Node.js applications, CPU-intensive operations should be handled carefully to avoid blocking the event loop

### Future Improvement Areas

1. **Add Testing:** Implement automated tests to improve code reliability and maintenance
2. **Performance Optimization:** Identify and optimize performance bottlenecks, especially in file processing operations
3. **User Experience Enhancement:** Improve error handling and user feedback for a better experience



## Semantic Understanding

### Domain Concept Network

The codebase revolves around these primary concepts and their relationships:

- **const**: related to analysis, file
- **analysis**: related to project, edge
- **file**: related to project, int
- **content**: related to analysis, project
- **project**: related to analysis, file
- **name**: related to project, path
- **path**: related to dir, s w

### Enhanced Terminology

These terms have specific meanings in the project context:

- **const:** .bundle.js'
        ];

        const patterns = [
            '* (related to: analysis, file, project, files, dir)
- **analysis:** Get analysis results (related to: project, edge, ext, file, document)
- **file:** Important files (related to: project, int, s s, analysis, base)
- **content:** Check README content (related to: analysis, project, ext, document, edge)
- **project:** Clean up test project (related to: analysis, file, edge, ext, base)
- **name:** Add class names (related to: project, path, dir, s w, e e)
- **path:** Determine paths (related to: dir, s w, e e, file, project)
- **test:** Check for testing (related to: analysis, project, document, edge, doc)

### Conceptual Distribution

Key concepts are distributed across the codebase as follows:

- **project** appears in 19 files, including:
  - `CHANGELOG.md`
  - `README.md`
  - *(and 17 more)*
- **analysis** appears in 17 files, including:
  - `CHANGELOG.md`
  - `README.md`
  - *(and 15 more)*
- **file** appears in 16 files, including:
  - `CHANGELOG.md`
  - `LICENSE.md`
  - *(and 14 more)*
