# ai-project-mapper Project Knowledge Transfer

## Project Identification

**Name:** project-mapper

**Primary Purpose:** Generate LLM-friendly project summaries to help AI assistants understand your codebase

**Application Type:** Command-line interface (CLI) tool

**Problem It Solves:** Generate LLM-friendly project summaries to help AI assistants understand your codebase

## Architectural Overview

### Major Components

1. **Entry Point** - Main application entry point that initializes the system
   - Located in `src/index.js`
   - Responsibilities:
     - Initialize the application
     - Handle startup logic
     - Coordinate other components

2. **Docs Build Assets Js Module** - Handles docs/build/assets/js functionality
   - Located in `docs/build/assets/js`
   - Responsibilities:
     - Implement docs/build/assets/js features

3. **Src Module** - Handles src functionality
   - Located in `src`
   - Responsibilities:
     - Implement src features

4. **Docs .docusaurus Module** - Handles docs/.docusaurus functionality
   - Located in `docs/.docusaurus`
   - Responsibilities:
     - Implement docs/.docusaurus features

5. **Docs Module** - Handles docs functionality
   - Located in `docs`
   - Responsibilities:
     - Implement docs features

6. **Docs Node_modules Acorn-jsx Module** - Handles docs/node_modules/acorn-jsx functionality
   - Located in `docs/node_modules/acorn-jsx`
   - Responsibilities:
     - Implement docs/node_modules/acorn-jsx features

7. **Docs Node_modules Algoliasearch Module** - Handles docs/node_modules/algoliasearch functionality
   - Located in `docs/node_modules/algoliasearch`
   - Responsibilities:
     - Implement docs/node_modules/algoliasearch features

8. **Docs Node_modules Big.js Module** - Handles docs/node_modules/big.js functionality
   - Located in `docs/node_modules/big.js`
   - Responsibilities:
     - Implement docs/node_modules/big.js features

### Control Flow

1. User invokes the application with command-line arguments
2. System parses and validates arguments
3. Core functionality is executed based on the command
4. Results are displayed to the user in the terminal

### Key Design Patterns

- **ES Modules:** Uses ES module system for code organization and dependency management
- **Functional Approach:** Primarily uses functions and composition rather than classes
- **Factory Pattern:** Uses factory functions to create objects or components
- **Repository Pattern:** Abstracts data access logic through repositories
- **Service Pattern:** Encapsulates business logic in service modules

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

- **JavaScript**: 18325 files (33% of codebase)
- **TypeScript**: 4006 files (8% of codebase)
- **JSON**: 1815 files (7% of codebase)
- **Markdown**: 1747 files (4% of codebase)
- **TypeScript (React)**: 225 files (0% of codebase)
- **CSS**: 191 files (0% of codebase)
- **YAML**: 127 files (0% of codebase)
- **HTML**: 34 files (0% of codebase)
- **JavaScript (React)**: 8 files (0% of codebase)
- **XML**: 4 files (0% of codebase)
- **Shell**: 2 files (0% of codebase)
- **SCSS**: 1 files (0% of codebase)

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
- **Analyze:** A key concept in this project
- **Project:** A key concept in this project, related to project-summary
- **Infer:** A key concept in this project
- **Knowledge:** A key concept in this project, related to knowledge-transfer
- **Transfer:** A key concept in this project, related to knowledge-transfer
- **Questionnaire:** A key concept in this project
- **Documentation:** A key concept in this project
- **Network:** A key concept in this project
- **Format:** A key concept in this project
- **File:** A key concept in this project
- **Parse:** A key concept in this project
- **Code-analysis:** A key concept in this project
- **Extract:** A key concept in this project
- **From:** A key concept in this project
- **Semantics:** A key concept in this project
- **Visualization:** A key concept in this project

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

- **const**: related to analysis, project
- **analysis**: related to project, edge
- **project**: related to file, doc
- **file**: related to doc, project
- **content**: related to doc, ext
- **path**: related to dir, project
- **test**: related to analysis, project

### Enhanced Terminology

These terms have specific meanings in the project context:

- **const:** .bundle.js'
        ];

        const patterns = [
            '* (related to: analysis, project, file, files, dir)
- **analysis:** Get analysis results (related to: project, edge, file, document, knowledge)
- **project:** Clean up test project (related to: file, doc, ext, analysis, document)
- **file:** Important files (related to: doc, project, int, ext, pos)
- **content:** Check README content (related to: doc, ext, s s, project, file)
- **path:** Determine paths (related to: dir, project, file, name, n s)
- **test:** Check for testing (related to: analysis, project, document, edge, doc)
- **name:** Add class names (related to: project, dir, file, path, doc)

### Conceptual Distribution

Key concepts are distributed across the codebase as follows:

- **file** appears in 35 files, including:
  - `CHANGELOG.md`
  - `LICENSE.md`
  - *(and 33 more)*
- **project** appears in 33 files, including:
  - `CHANGELOG.md`
  - `README.md`
  - *(and 31 more)*
- **document** appears in 28 files, including:
  - `CHANGELOG.md`
  - `LICENSE.md`
  - *(and 26 more)*
