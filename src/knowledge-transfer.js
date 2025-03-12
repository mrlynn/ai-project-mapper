import fs from 'fs-extra';
import path from 'path';
import { markdownTable } from 'markdown-table';

// Templates for knowledge transfer documents
const TEMPLATES = {
  standard: generateStandardTemplate,
  minimal: generateMinimalTemplate,
  detailed: generateDetailedTemplate
};

const FILE_TYPE_EXTENSIONS = {
  'JavaScript': ['.js', '.jsx'],
  'TypeScript': ['.ts', '.tsx'],
  'HTML': ['.html', '.htm'],
  'CSS': ['.css'],
  'Markdown': ['.md'],
  'JSON': ['.json'],
  // Add more file types and extensions as needed
};

/**
 * Generate knowledge transfer document from project analysis
 */
export async function generateKnowledgeTransfer(analysis, options = {}) {
  try {
    const {
      projectName = 'Project',
      template = 'standard',
      format = 'markdown',
      includeGuide = false
    } = options;
    
    // Select the template function
    const templateFn = TEMPLATES[template] || TEMPLATES.standard;
    
    // Generate the document
    const document = templateFn(analysis, projectName);
    
    // Verify that document and document.content exist
    if (!document || typeof document !== 'object') {
      console.warn(`Template function returned invalid document: ${typeof document}`);
      const fallbackContent = `# ${projectName} Knowledge Transfer\n\nUnable to generate full template.`;
      
      // Return fallback based on format
      if (format === 'json') {
        return { content: fallbackContent, sections: ['Error'] };
      }
      return fallbackContent;
    }
    
    // Ensure document.content exists
    if (!document.content) {
      console.warn('Template function returned document without content');
      document.content = `# ${projectName} Knowledge Transfer\n\nTemplate generated without content.`;
    }
    
    // Add guide if requested
    if (includeGuide) {
      try {
        document.content += '\n\n' + await getLLMKnowledgeTransferGuide();
      } catch (error) {
        console.warn(`Error adding guide: ${error.message}`);
      }
    }
    
    // Return in the requested format
    if (format === 'json') {
      return document;
    }
    
    return document.content;
  } catch (error) {
    console.error(`Error in generateKnowledgeTransfer: ${error.message}`);
    
    // Return a fallback value based on format
    if (options.format === 'json') {
      return { 
        content: `# ${options.projectName || 'Project'} Knowledge Transfer\n\nError generating document: ${error.message}`,
        sections: ['Error'] 
      };
    }
    
    return `# ${options.projectName || 'Project'} Knowledge Transfer\n\nError generating document: ${error.message}`;
  }
}

function debugValue(value, label) {
  console.log(`DEBUG ${label}: ${typeof value}`);
  if (typeof value === 'object' && value !== null) {
    console.log(`  Keys: ${Object.keys(value).join(', ')}`);
    if (value.content) {
      console.log(`  content: ${typeof value.content}, length: ${value.content.length}`);
    }
  } else if (typeof value === 'string') {
    console.log(`  Length: ${value.length}`);
  } else {
    console.log(`  Value: ${value === null ? 'null' : value}`);
  }
}

/**
 * Generate standard knowledge transfer document
 */
function generateStandardTemplate(analysis, projectName) {
  let content = `# ${projectName} Project Knowledge Transfer\n\n`;
  
  // Project Identification
  content += `## Project Identification\n\n`;
  content += `**Name:** ${analysis.overview.name || projectName}\n\n`;
  content += `**Primary Purpose:** ${analysis.overview.description || 'No description available'}\n\n`;
  content += `**Application Type:** ${getApplicationType(analysis)}\n\n`;
  content += `**Problem It Solves:** ${inferProblemSolved(analysis)}\n\n`;
  
  // Architectural Overview
  content += `## Architectural Overview\n\n`;
  
  // Major Components
  content += `### Major Components\n\n`;
  const components = identifyMajorComponents(analysis);
  components.forEach((component, index) => {
    content += `${index + 1}. **${component.name}** - ${component.description}\n`;
    if (component.location) {
      content += `   - Located in \`${component.location}\`\n`;
    }
    if (component.responsibilities && component.responsibilities.length > 0) {
      content += `   - Responsibilities:\n`;
      component.responsibilities.forEach(resp => {
        content += `     - ${resp}\n`;
      });
    }
    content += '\n';
  });
  
  // Control Flow
  content += `### Control Flow\n\n`;
  const flows = inferControlFlow(analysis);
  flows.forEach((flow, index) => {
    content += `${index + 1}. ${flow}\n`;
  });
  content += '\n';
  
  // Key Design Patterns
  content += `### Key Design Patterns\n\n`;
  const patterns = inferDesignPatterns(analysis);
  patterns.forEach(pattern => {
    content += `- **${pattern.name}:** ${pattern.description}\n`;
  });
  content += '\n';
  
  // Core Functionality
  content += `## Core Functionality\n\n`;
  
  // Primary Operations
  content += `### Primary Operations\n\n`;
  const operations = identifyPrimaryOperations(analysis);
  operations.forEach((op, index) => {
    content += `${index + 1}. **${op.name}**\n`;
    if (op.function) {
      content += `   - Function: \`${op.function}\`\n`;
    }
    content += `   - ${op.description}\n`;
    if (op.details && op.details.length > 0) {
      op.details.forEach(detail => {
        content += `   - ${detail}\n`;
      });
    }
    content += '\n';
  });
  
  // Language-Specific Handling
  if (analysis.fileStats && analysis.fileStats.languages) {
    content += `### Language-Specific Handling\n\n`;
    content += `The project includes code in the following languages:\n\n`;
    
    const languages = Object.entries(analysis.fileStats.languages)
      .sort((a, b) => b[1].files - a[1].files);
      
    languages.forEach(([lang, stats]) => {
      const percentage = Math.round((stats.size / analysis.fileStats.totalSize) * 100);
      content += `- **${lang}**: ${stats.files} files (${percentage}% of codebase)\n`;
    });
    content += '\n';
  }
  
  // Integration Points
  content += `## Integration Points\n\n`;
  
  // User Interface
  content += `### User Interface\n\n`;
  const ui = identifyUserInterface(analysis);
  ui.forEach((uiInterface, index) => {
    content += `${index + 1}. **${uiInterface.name}**\n`;
    if (uiInterface.format) {
      content += `   - Format: \`${uiInterface.format}\`\n`;
    }
    if (uiInterface.options && uiInterface.options.length > 0) {
      content += `   - Key options:\n`;
      uiInterface.options.forEach(option => {
        content += `     - \`${option.name}\`: ${option.description}\n`;
      });
    }
    content += '\n';
  });
  
  // External Dependencies
  if (analysis.package && (analysis.package.dependencies || analysis.package.devDependencies)) {
    content += `### External Dependencies\n\n`;
    
    if (analysis.package.dependencies && Object.keys(analysis.package.dependencies).length > 0) {
      content += `1. **Core Dependencies:**\n`;
      Object.entries(analysis.package.dependencies)
        .forEach(([name, version]) => {
          const description = getPackageDescription(name);
          content += `   - \`${name}\`: ${description}\n`;
        });
      content += '\n';
    }
    
    if (analysis.package.devDependencies && Object.keys(analysis.package.devDependencies).length > 0) {
      content += `2. **Development Dependencies:**\n`;
      Object.entries(analysis.package.devDependencies)
        .slice(0, 5) // Limit to top 5 dev dependencies
        .forEach(([name, version]) => {
          const description = getPackageDescription(name);
          content += `   - \`${name}\`: ${description}\n`;
        });
      content += '\n';
    }
  }
  
  // Domain-Specific Knowledge
  content += `## Domain-Specific Knowledge\n\n`;
  
  // Terminology
  content += `### Terminology\n\n`;
  const terms = extractTerminology(analysis);
  terms.forEach(term => {
    content += `- **${term.name}:** ${term.definition}\n`;
  });
  content += '\n';
  
  // Key Assumptions
  content += `### Key Assumptions\n\n`;
  const assumptions = inferAssumptions(analysis);
  assumptions.forEach((assumption, index) => {
    content += `${index + 1}. ${assumption}\n`;
  });
  content += '\n';
  
  // Current Limitations
  content += `### Current Limitations\n\n`;
  const limitations = inferLimitations(analysis);
  limitations.forEach((limitation, index) => {
    content += `${index + 1}. ${limitation}\n`;
  });
  content += '\n';
  
  // Implementation Insights
  content += `## Implementation Insights\n\n`;
  
  // Performance Considerations
  content += `### Performance Considerations\n\n`;
  const performance = inferPerformanceConsiderations(analysis);
  performance.forEach(item => {
    content += `- ${item}\n`;
  });
  content += '\n';
  
  // Future Improvement Areas
  content += `### Future Improvement Areas\n\n`;
  const improvements = suggestImprovements(analysis);
  improvements.forEach((improvement, index) => {
    content += `${index + 1}. **${improvement.name}:** ${improvement.description}\n`;
  });
  content += '\n';
  
  return {
    content,
    sections: [
      'Project Identification',
      'Architectural Overview',
      'Core Functionality',
      'Integration Points',
      'Domain-Specific Knowledge',
      'Implementation Insights'
    ]
  };
}

/**
 * Generate minimal knowledge transfer document
 */
function generateMinimalTemplate(analysis, projectName) {
  let content = `# ${projectName} Project Summary\n\n`;
  
  // Quick overview
  content += `## Overview\n\n`;
  content += `- **Name:** ${analysis.overview.name || projectName}\n`;
  content += `- **Description:** ${analysis.overview.description || 'No description available'}\n`;
  content += `- **Type:** ${getApplicationType(analysis)}\n`;
  content += `- **Size:** ${analysis.overview.totalFiles} files in ${analysis.overview.totalDirectories} directories\n\n`;
  
  // Key components
  content += `## Key Components\n\n`;
  const components = identifyMajorComponents(analysis);
  components.slice(0, 3).forEach((component, index) => {
    content += `${index + 1}. **${component.name}** - ${component.description}\n`;
  });
  content += '\n';
  
  // Main functionality
  content += `## Main Functionality\n\n`;
  const operations = identifyPrimaryOperations(analysis);
  operations.slice(0, 3).forEach((op, index) => {
    content += `${index + 1}. **${op.name}** - ${op.description}\n`;
  });
  content += '\n';
  
  // Important files
  content += `## Important Files\n\n`;
  if (analysis.structure && analysis.structure.importantFiles) {
    analysis.structure.importantFiles.slice(0, 5).forEach((file, index) => {
      content += `${index + 1}. \`${file.path}\` (importance score: ${Math.round(file.score)})\n`;
    });
  }
  content += '\n';
  
  // Dependencies
  if (analysis.package && analysis.package.dependencies) {
    content += `## Key Dependencies\n\n`;
    Object.keys(analysis.package.dependencies)
      .slice(0, 5)
      .forEach(dep => {
        content += `- ${dep}\n`;
      });
  }
  
  return {
    content,
    sections: [
      'Overview',
      'Key Components',
      'Main Functionality',
      'Important Files',
      'Key Dependencies'
    ]
  };
}

/**
 * Generate detailed knowledge transfer document
 */
function generateDetailedTemplate(analysis, projectName) {
  // Start with the standard template as a base
  const standard = generateStandardTemplate(analysis, projectName);
  let content = standard.content;
  
  // Add more detailed sections
  
  // File structure visualization
  content += `## File Structure\n\n`;
  content += `\`\`\`\n`;
  content += generateFileTree(analysis);
  content += `\`\`\`\n\n`;
  
  // Important files details
  content += `## Key Files Details\n\n`;
  if (analysis.structure && analysis.structure.importantFiles) {
    analysis.structure.importantFiles.slice(0, 10).forEach((file, index) => {
      content += `### ${file.path}\n\n`;
      
      // Find detailed analysis for this file
      const fileAnalysis = findFileAnalysis(analysis, file.path);
      
      if (fileAnalysis) {
        if (fileAnalysis.functions && fileAnalysis.functions.length > 0) {
          content += `**Functions:**\n\n`;
          fileAnalysis.functions.forEach(fn => {
            content += `- \`${fn.name}(${(fn.params || []).join(', ')})\`${fn.isAsync ? ' (async)' : ''}\n`;
          });
          content += '\n';
        }
        
        if (fileAnalysis.exports && fileAnalysis.exports.length > 0) {
          content += `**Exports:**\n\n`;
          fileAnalysis.exports.forEach(exp => {
            content += `- ${exp.type} export: \`${exp.name}\`\n`;
          });
          content += '\n';
        }
        
        if (fileAnalysis.imports && fileAnalysis.imports.length > 0) {
          content += `**Dependencies:**\n\n`;
          fileAnalysis.imports.forEach(imp => {
            content += `- Imports from \`${imp.source}\`\n`;
          });
          content += '\n';
        }
      } else {
        content += `*Detailed analysis not available*\n\n`;
      }
    });
  }
  
  // Dependency graph
  content += `## Dependency Relationships\n\n`;
  content += `### Key Module Dependencies\n\n`;
  content += generateDependencyTable(analysis);
  content += '\n';
  
  // Code examples
  content += `## Representative Code Examples\n\n`;
  const examples = extractCodeExamples(analysis);
  examples.forEach((example, index) => {
    content += `### Example ${index + 1}: ${example.name}\n\n`;
    content += `From \`${example.file}\`:\n\n`;
    content += `\`\`\`${example.language}\n`;
    content += example.code;
    content += `\n\`\`\`\n\n`;
    content += `${example.description}\n\n`;
  });
  
  return {
    content,
    sections: [
      ...standard.sections,
      'File Structure',
      'Key Files Details',
      'Dependency Relationships',
      'Representative Code Examples'
    ]
  };
}

/**
 * Helper Functions for Template Generation
 */

/**
 * Infer the application type from analysis
 */
function getApplicationType(analysis) {
  // Check package.json bin field for CLI
  if (analysis.package && analysis.package.bin) {
    return 'Command-line interface (CLI) tool';
  }
  
  // Check for web-related dependencies
  if (analysis.package && analysis.package.dependencies) {
    const deps = Object.keys(analysis.package.dependencies);
    
    if (deps.includes('express') || deps.includes('koa') || deps.includes('fastify')) {
      return 'Web server/API';
    }
    
    if (deps.includes('react') || deps.includes('vue') || deps.includes('angular')) {
      return 'Web application/frontend';
    }
    
    if (deps.includes('electron')) {
      return 'Desktop application';
    }
  }
  
  // Check for common entry file names
  if (analysis.structure && analysis.structure.entryPoints) {
    for (const entry of analysis.structure.entryPoints) {
      if (entry.path.includes('server.js') || entry.path.includes('app.js')) {
        return 'Server application';
      }
      if (entry.path.includes('cli.js')) {
        return 'Command-line tool';
      }
    }
  }
  
  // Default
  return 'Node.js module/library';
}

/**
 * Infer the problem the project solves
 */
function inferProblemSolved(analysis) {
  // Start with package.json description
  if (analysis.overview.description) {
    return analysis.overview.description;
  }
  
  // Check project concepts and keywords
  if (analysis.concepts && analysis.concepts.keywords) {
    const keywords = analysis.concepts.keywords.join(', ');
    return `Based on project keywords (${keywords}), this project appears to be related to these domains.`;
  }
  
  // Check README content
  if (analysis.documentation && analysis.documentation.length > 0) {
    const readme = analysis.documentation.find(doc => 
      doc.path.toLowerCase().includes('readme')
    );
    
    if (readme && readme.preview) {
      // Return first paragraph of README
      const firstPara = readme.preview.split('\n\n')[0];
      if (firstPara.length > 30) {
        return firstPara;
      }
    }
  }
  
  return 'This project\'s purpose is not explicitly stated, but based on its structure and code, it appears to be a JavaScript/Node.js application.';
}

/**
 * Identify major components in the project
 */
function identifyMajorComponents(analysis) {
  const components = [];
  
  // Check for common component directories
  if (analysis.overview.mainDirectories) {
    for (const dir of analysis.overview.mainDirectories) {
      // Skip root directory
      if (dir.path === '.') continue;
      
      // CLI component
      if (dir.path === 'cli' || dir.path === 'bin') {
        components.push({
          name: 'Command Line Interface',
          description: 'Handles user input and command execution',
          location: dir.path,
          responsibilities: ['Process command line arguments', 'Display output to users', 'Handle command execution']
        });
      }
      
      // Core/lib component
      else if (dir.path === 'lib' || dir.path === 'core' || dir.path === 'src') {
        components.push({
          name: 'Core Library',
          description: 'Contains the main functionality and business logic',
          location: dir.path,
          responsibilities: ['Implement core algorithms', 'Process data', 'Provide main API']
        });
      }
      
      // API/routes component
      else if (dir.path === 'api' || dir.path === 'routes') {
        components.push({
          name: 'API Layer',
          description: 'Handles external API requests and routing',
          location: dir.path,
          responsibilities: ['Define API endpoints', 'Process requests', 'Return responses']
        });
      }
      
      // Utils component
      else if (dir.path === 'utils' || dir.path === 'helpers') {
        components.push({
          name: 'Utilities',
          description: 'Provides helper functions and shared utilities',
          location: dir.path,
          responsibilities: ['Provide reusable functionality', 'Implement helper methods']
        });
      }
      
      // Models/data component
      else if (dir.path === 'models' || dir.path === 'data') {
        components.push({
          name: 'Data Models',
          description: 'Defines data structures and database schemas',
          location: dir.path,
          responsibilities: ['Define data structures', 'Handle data validation', 'Interact with databases']
        });
      }
      
      // UI/components component
      else if (dir.path === 'components' || dir.path === 'ui' || dir.path === 'views') {
        components.push({
          name: 'User Interface Components',
          description: 'Implements UI components and views',
          location: dir.path,
          responsibilities: ['Render user interface', 'Handle user interactions', 'Manage UI state']
        });
      }
    }
  }
  
  // Add generic components if we don't have enough specific ones
  if (components.length < 3) {
    // Look at entry points
    if (analysis.structure && analysis.structure.entryPoints && analysis.structure.entryPoints.length > 0) {
      const mainEntry = analysis.structure.entryPoints[0];
      components.push({
        name: 'Entry Point',
        description: 'Main application entry point that initializes the system',
        location: mainEntry.path,
        responsibilities: ['Initialize the application', 'Handle startup logic', 'Coordinate other components']
      });
    }
    
    // Look at key concepts
    if (analysis.concepts && analysis.concepts.modules && analysis.concepts.modules.length > 0) {
      for (const module of analysis.concepts.modules) {
        if (!components.some(c => c.location === module.name)) {
          components.push({
            name: `${formatModuleName(module.name)} Module`,
            description: `Handles ${module.name.toLowerCase()} functionality`,
            location: module.name,
            responsibilities: [`Implement ${module.name.toLowerCase()} features`]
          });
        }
      }
    }
  }
  
  // If we still don't have enough, add a generic component
  if (components.length === 0) {
    components.push({
      name: 'Core Implementation',
      description: 'Contains the main project functionality',
      responsibilities: ['Implement key features', 'Process data', 'Handle business logic']
    });
  }
  
  return components;
}

/**
 * Format a module name to be more readable
 */
function formatModuleName(name) {
  // Convert path segments to readable name
  return name
    .split('/')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * Infer the control flow of the application
 */
function inferControlFlow(analysis) {
  const flows = [];
  
  // CLI applications
  if (getApplicationType(analysis).includes('CLI')) {
    flows.push('User invokes the application with command-line arguments');
    flows.push('System parses and validates arguments');
    flows.push('Core functionality is executed based on the command');
    flows.push('Results are displayed to the user in the terminal');
  }
  // Web applications
  else if (getApplicationType(analysis).includes('Web')) {
    flows.push('Server receives HTTP requests from clients');
    flows.push('Request is routed to the appropriate handler');
    flows.push('Handler processes the request and interacts with core functionality');
    flows.push('Response is generated and sent back to the client');
  }
  // Generic application flow
  else {
    flows.push('Application is initialized with configuration settings');
    flows.push('Core functionality is executed based on inputs');
    flows.push('Results are processed and returned');
    flows.push('Error handling is applied throughout the process');
  }
  
  return flows;
}

/**
 * Infer design patterns used in the project
 */
function inferDesignPatterns(analysis) {
  const patterns = [];
  
  // Look for module pattern (commonjs or es modules)
  if (analysis.package && analysis.package.type === 'module') {
    patterns.push({
      name: 'ES Modules',
      description: 'Uses ES module system for code organization and dependency management'
    });
  } else {
    patterns.push({
      name: 'CommonJS Modules',
      description: 'Uses CommonJS module pattern for code organization and dependency management'
    });
  }
  
  // Look for class usage
  let hasClasses = false;
  if (analysis.analyzedFiles) {
    hasClasses = analysis.analyzedFiles.some(file => file.classes && file.classes.length > 0);
  }
  
  if (hasClasses) {
    patterns.push({
      name: 'Object-Oriented Design',
      description: 'Uses classes and inheritance for code organization'
    });
  } else {
    patterns.push({
      name: 'Functional Approach',
      description: 'Primarily uses functions and composition rather than classes'
    });
  }
  
  // Check for common patterns based on file naming conventions
  if (analysis.overview.filesByType && analysis.overview.filesByType.javascript) {
    const jsFiles = analysis.overview.filesByType.javascript;
    
    // Factory pattern
    if (jsFiles.some(file => file.includes('factory'))) {
      patterns.push({
        name: 'Factory Pattern',
        description: 'Uses factory functions to create objects or components'
      });
    }
    
    // Repository pattern
    if (jsFiles.some(file => file.includes('repository') || file.includes('repo'))) {
      patterns.push({
        name: 'Repository Pattern',
        description: 'Abstracts data access logic through repositories'
      });
    }
    
    // Service pattern
    if (jsFiles.some(file => file.includes('service'))) {
      patterns.push({
        name: 'Service Pattern',
        description: 'Encapsulates business logic in service modules'
      });
    }
  }
  
  // Add generic patterns if we don't have enough
  if (patterns.length < 3) {
    patterns.push({
      name: 'Modular Architecture',
      description: 'Organizes code into focused, single-purpose modules'
    });
    
    patterns.push({
      name: 'Pipeline Architecture',
      description: 'Processes data through sequential stages of transformation'
    });
  }
  
  return patterns;
}

/**
 * Identify primary operations in the project
 */
function identifyPrimaryOperations(analysis) {
  const operations = [];
  
  // If we have important files, look at their functions
  if (analysis.structure && analysis.structure.importantFiles) {
    for (const file of analysis.structure.importantFiles.slice(0, 5)) {
      const fileAnalysis = findFileAnalysis(analysis, file.path);
      
      if (fileAnalysis && fileAnalysis.functions) {
        // Find important functions (exported or large)
        for (const func of fileAnalysis.functions.slice(0, 3)) {
          const isExported = fileAnalysis.exports.some(exp => 
            exp.name === func.name && exp.type === 'function'
          );
          
          if (isExported || (func.loc && (func.loc.end - func.loc.start > 20))) {
            operations.push({
              name: formatFunctionName(func.name),
              function: func.name,
              description: inferFunctionPurpose(func.name, fileAnalysis.path),
              details: [`Found in ${path.basename(fileAnalysis.path)}`]
            });
          }
        }
      }
    }
  }
  
  // If we still need more operations
  if (operations.length < 3) {
    // Look at package.json scripts
    if (analysis.package && analysis.package.scripts) {
      for (const [name, script] of Object.entries(analysis.package.scripts).slice(0, 3)) {
        operations.push({
          name: `${name} Script`,
          function: script,
          description: inferScriptPurpose(name, script),
          details: ['Defined in package.json']
        });
      }
    }
    
    // Add generic operations if needed
    if (operations.length < 3) {
      // For CLI applications
      if (getApplicationType(analysis).includes('CLI')) {
        operations.push({
          name: 'Command Processing',
          description: 'Parses and validates user commands',
          details: ['Handles user input', 'Validates arguments']
        });
        
        operations.push({
          name: 'Core Execution',
          description: 'Executes the main functionality based on commands',
          details: ['Processes data', 'Performs primary operations']
        });
      }
      // For web applications
      else if (getApplicationType(analysis).includes('Web')) {
        operations.push({
          name: 'Request Handling',
          description: 'Processes incoming HTTP requests',
          details: ['Routes requests', 'Validates input']
        });
        
        operations.push({
          name: 'Response Generation',
          description: 'Creates and sends HTTP responses',
          details: ['Formats data', 'Handles errors']
        });
      }
    }
  }
  
  return operations;
}

/**
 * Format a function name to be more readable
 */
function formatFunctionName(name) {
  // Convert camelCase to title case with spaces
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

/**
 * Infer a function's purpose from its name
 */
function inferFunctionPurpose(name, filePath) {
  // Common prefixes and their meanings
  const prefixMeanings = {
    'get': 'Retrieves',
    'set': 'Sets or updates',
    'create': 'Creates',
    'update': 'Updates',
    'delete': 'Deletes',
    'remove': 'Removes',
    'find': 'Searches for',
    'process': 'Processes',
    'handle': 'Handles',
    'validate': 'Validates',
    'parse': 'Parses',
    'format': 'Formats',
    'transform': 'Transforms',
    'analyze': 'Analyzes',
    'generate': 'Generates',
    'build': 'Builds',
    'extract': 'Extracts',
    'load': 'Loads',
    'save': 'Saves',
    'convert': 'Converts',
    'calculate': 'Calculates',
    'compile': 'Compiles'
  };
  
  // Check if the function name starts with any of the known prefixes
  for (const [prefix, meaning] of Object.entries(prefixMeanings)) {
    if (name.toLowerCase().startsWith(prefix)) {
      const rest = name.substring(prefix.length);
      const readableRest = rest
        .replace(/([A-Z])/g, ' $1')
        .toLowerCase();
      
      return `${meaning}${readableRest}`;
    }
  }
  
  // Default description based on the file name
  const fileName = path.basename(filePath, path.extname(filePath));
  return `Performs operations related to ${fileName}`;
}

/**
 * Infer a script's purpose from its name and content
 */
function inferScriptPurpose(name, script) {
  // Common script names and purposes
  const scriptPurposes = {
    'start': 'Starts the application',
    'dev': 'Runs the application in development mode',
    'build': 'Builds the application for production',
    'test': 'Runs the test suite',
    'lint': 'Checks code quality and style',
    'format': 'Formats code according to style guidelines',
    'deploy': 'Deploys the application',
    'analyze': 'Analyzes the codebase or bundle',
    'clean': 'Cleans build artifacts',
    'docs': 'Generates documentation'
  };
  
  // Return known purpose or generate one from script content
  return scriptPurposes[name] || `Runs script: ${script}`;
}

/**
 * Find the analysis for a specific file
 */
function findFileAnalysis(analysis, filePath) {
  if (analysis.analyzedFiles) {
    return analysis.analyzedFiles.find(file => file.relativePath === filePath);
  }
  return null;
}

/**
 * Identify user interfaces in the project
 */
function identifyUserInterface(analysis) {
  const interfaces = [];
  
  // CLI interface
  if (getApplicationType(analysis).includes('CLI')) {
    const cliInterface = {
      name: 'Command Line Interface',
      format: analysis.package && analysis.package.bin ? 
        `npx ${analysis.overview.name || 'command'} [options]` : 
        'node index.js [options]',
      options: []
    };
    
    // Try to infer CLI options
    if (analysis.structure && analysis.structure.entryPoints) {
      for (const entry of analysis.structure.entryPoints) {
        if (entry.type === 'bin' || entry.path.includes('cli.js') || entry.path.includes('index.js')) {
          // We'd need to parse the actual file for commander/yargs options
          // For now, add some generic options
          cliInterface.options = [
            { name: '--help', description: 'Display help information' },
            { name: '--version', description: 'Display version information' },
            { name: '--verbose', description: 'Enable verbose output' }
          ];
        }
      }
    }
    
    interfaces.push(cliInterface);
  }
  
  // API interface
  if (getApplicationType(analysis).includes('Web') || getApplicationType(analysis).includes('API')) {
    interfaces.push({
      name: 'HTTP API',
      format: '/api/[endpoint]',
      options: [
        { name: 'GET /api/[resource]', description: 'Retrieve resources' },
        { name: 'POST /api/[resource]', description: 'Create new resources' },
        { name: 'PUT /api/[resource]/:id', description: 'Update existing resources' },
        { name: 'DELETE /api/[resource]/:id', description: 'Delete resources' }
      ]
    });
  }
  
  // Programmatic API
  interfaces.push({
    name: 'Programmatic API',
    format: `const result = require('${analysis.overview.name || 'module'}').functionName()`,
    options: []
  });
  
  return interfaces;
}

/**
 * Get a generic description for commonly used packages
 */
function getPackageDescription(packageName) {
  const commonPackages = {
    'express': 'Web server framework',
    'koa': 'Next-generation web framework',
    'fastify': 'Fast and low overhead web framework',
    'react': 'UI library for building interfaces',
    'vue': 'Progressive JavaScript framework',
    'angular': 'Platform for building web applications',
    'lodash': 'Utility library with helper functions',
    'commander': 'Command-line interface creator',
    'yargs': 'Command-line parser',
    'jest': 'JavaScript testing framework',
    'mocha': 'JavaScript test framework',
    'chai': 'Assertion library for testing',
    'eslint': 'Code quality checker',
    'prettier': 'Code formatter',
    'webpack': 'Module bundler',
    'babel': 'JavaScript compiler',
    'typescript': 'Typed JavaScript',
    'axios': 'HTTP client',
    'node-fetch': 'Fetch API for Node.js',
    'dotenv': 'Environment variable loader',
    'mongoose': 'MongoDB object modeling',
    'sequelize': 'ORM for SQL databases',
    'pg': 'PostgreSQL client',
    'mysql': 'MySQL client',
    'redis': 'Redis client',
    'fs-extra': 'Enhanced file system methods',
    'chalk': 'Terminal string styling',
    'inquirer': 'Interactive command line prompts',
    'ora': 'Elegant terminal spinners',
    'winston': 'Logging library',
    'morgan': 'HTTP request logger',
    'body-parser': 'HTTP request body parser',
    'cors': 'Cross-origin resource sharing',
    'helmet': 'Security middleware',
    'jsonwebtoken': 'JWT implementation',
    'passport': 'Authentication middleware',
    'socket.io': 'Real-time bidirectional event-based communication',
    'moment': 'Date manipulation library',
    'date-fns': 'Date utility library',
    'uuid': 'UUID generator',
    'nanoid': 'Tiny, secure ID generator',
    'crypto': 'Cryptographic functionality',
    'bcrypt': 'Password hashing function',
    'sharp': 'Image processing',
    'multer': 'File upload middleware',
    'nodemailer': 'Email sending',
    'puppeteer': 'Headless Chrome API',
    'cheerio': 'Server-side jQuery for HTML parsing',
    'marked': 'Markdown parser',
    'd3': 'Data visualization library',
    'chart.js': 'Simple charting library',
    'fast-glob': 'Fast file globbing library',
    'chokidar': 'File watcher',
    'acorn': 'JavaScript parser',
    'esprima': 'JavaScript parser',
    'semver': 'Semantic versioning',
    'joi': 'Schema validation',
    'ajv': 'JSON schema validator',
    'graphql': 'GraphQL implementation',
    'apollo-server': 'GraphQL server',
    'next': 'React framework with SSR'
  };
  
  return commonPackages[packageName] || 'External dependency';
}

/**
 * Extract terminology used in the project
 */
function extractTerminology(analysis) {
  const terms = [];
  
  // Infer terms from project keywords
  if (analysis.concepts && analysis.concepts.keywords) {
    // Group related keywords to form terms
    const processedKeywords = new Set();
    
    for (const keyword of analysis.concepts.keywords) {
      if (processedKeywords.has(keyword)) continue;
      
      processedKeywords.add(keyword);
      
      // Find related keywords
      const related = analysis.concepts.keywords.filter(k => 
        k !== keyword && 
        (k.includes(keyword) || keyword.includes(k))
      );
      
      related.forEach(r => processedKeywords.add(r));
      
      // Create a term
      terms.push({
        name: keyword.charAt(0).toUpperCase() + keyword.slice(1),
        definition: generateTermDefinition(keyword, related, analysis)
      });
    }
  }
  
  // Add generic terms if needed
  if (terms.length < 3) {
    // For CLI applications
    if (getApplicationType(analysis).includes('CLI')) {
      terms.push({
        name: 'Command',
        definition: 'An instruction provided by the user to perform a specific action'
      });
      
      terms.push({
        name: 'Option',
        definition: 'A configurable parameter that modifies how a command operates'
      });
    }
    // For web applications
    else if (getApplicationType(analysis).includes('Web')) {
      terms.push({
        name: 'Route',
        definition: 'A defined path that handles specific HTTP requests'
      });
      
      terms.push({
        name: 'Middleware',
        definition: 'Function that processes requests before they reach the route handler'
      });
    }
  }
  
  return terms;
}

/**
 * Generate a definition for a term
 */
function generateTermDefinition(term, relatedTerms, analysis) {
  // Check if it's a file type
  for (const [type, extensions] of Object.entries(FILE_TYPE_EXTENSIONS)) {
    for (const ext of extensions) {
      const extName = ext.replace('.', '');
      if (term.toLowerCase() === extName) {
        return `A ${type} file format used in this project`;
      }
    }
  }
  
  // Check if it's a dependency name
  if (analysis.package && analysis.package.dependencies && 
      Object.keys(analysis.package.dependencies).includes(term)) {
    return getPackageDescription(term);
  }
  
  // Generate a generic definition
  return `A key concept in this project${relatedTerms.length > 0 ? ', related to ' + relatedTerms.join(', ') : ''}`;
}

/**
 * Infer assumptions made by the project
 */
function inferAssumptions(analysis) {
  const assumptions = [];
  
  // Node.js environment
  assumptions.push('The code runs in a Node.js environment');
  
  // ES module vs CommonJS assumptions
  if (analysis.package && analysis.package.type === 'module') {
    assumptions.push('The project uses ES modules (import/export) syntax');
  } else {
    assumptions.push('The project uses CommonJS (require/module.exports) syntax');
  }
  
  // File system assumptions
  if (analysis.analyzedFiles) {
    const usesFS = analysis.analyzedFiles.some(file => 
      file.imports && file.imports.some(imp => 
        imp.source === 'fs' || imp.source === 'fs-extra'
      )
    );
    
    if (usesFS) {
      assumptions.push('The system has file system access permissions');
    }
  }
  
  // Add specific assumptions based on application type
  if (getApplicationType(analysis).includes('CLI')) {
    assumptions.push('Users interact via command-line interface');
    assumptions.push('Required command-line arguments will be provided correctly');
  } else if (getApplicationType(analysis).includes('Web')) {
    assumptions.push('The server has network access and can accept HTTP connections');
    assumptions.push('Required API request parameters will be present and validated');
  }
  
  return assumptions;
}

/**
 * Infer limitations of the project
 */
function inferLimitations(analysis) {
  const limitations = [];
  
  // Infer from application type
  if (getApplicationType(analysis).includes('CLI')) {
    limitations.push('No graphical user interface is provided');
  }
  
  // Node.js limitation
  limitations.push('Requires Node.js to be installed');
  
  // Infer from package.json engines if available
  if (analysis.package && analysis.package.engines && analysis.package.engines.node) {
    limitations.push(`Requires Node.js version ${analysis.package.engines.node}`);
  }
  
  // Infer from dependencies
  if (analysis.package && analysis.package.dependencies) {
    const deps = Object.keys(analysis.package.dependencies);
    
    if (deps.includes('typescript')) {
      limitations.push('Uses TypeScript which requires compilation before execution');
    }
    
    if (deps.some(dep => dep.includes('aws') || dep.includes('azure') || dep.includes('gcp'))) {
      limitations.push('Depends on specific cloud provider services');
    }
  }
  
  return limitations;
}

/**
 * Infer performance considerations
 */
function inferPerformanceConsiderations(analysis) {
  const considerations = [];
  
  // File system operations
  if (analysis.analyzedFiles) {
    const usesFS = analysis.analyzedFiles.some(file => 
      file.imports && file.imports.some(imp => 
        imp.source === 'fs' || imp.source === 'fs-extra'
      )
    );
    
    if (usesFS) {
      considerations.push('File system operations may impact performance with large files or directories');
    }
  }
  
  // Large files
  if (analysis.fileStats && analysis.fileStats.largestFiles && analysis.fileStats.largestFiles.length > 0) {
    if (analysis.fileStats.largestFiles[0].size > 100000) { // Larger than 100KB
      considerations.push('Contains large files that may affect load times or memory usage');
    }
  }
  
  // Add generic considerations
  considerations.push('Performance depends on the hardware and environment where the code runs');
  considerations.push('As with all Node.js applications, CPU-intensive operations should be handled carefully to avoid blocking the event loop');
  
  return considerations;
}

/**
 * Suggest improvements for the project
 */
function suggestImprovements(analysis) {
  const improvements = [];
  
  // Check for testing
  if (analysis.package && analysis.package.devDependencies) {
    const hasTestFramework = Object.keys(analysis.package.devDependencies).some(dep => 
      dep === 'jest' || dep === 'mocha' || dep === 'ava' || dep === 'tape'
    );
    
    if (!hasTestFramework) {
      improvements.push({
        name: 'Add Testing',
        description: 'Implement automated tests to improve code reliability and maintenance'
      });
    }
  } else {
    improvements.push({
      name: 'Add Testing',
      description: 'Implement automated tests to improve code reliability and maintenance'
    });
  }
  
  // Check for TypeScript
  if (analysis.overview.filesByType && !analysis.overview.filesByType.typescript) {
    improvements.push({
      name: 'Add Type Safety',
      description: 'Consider adding TypeScript for improved code quality and developer experience'
    });
  }
  
  // Documentation improvements
  if (!analysis.documentation || analysis.documentation.length === 0) {
    improvements.push({
      name: 'Improve Documentation',
      description: 'Add comprehensive README and API documentation'
    });
  }
  
  // Generic improvements
  improvements.push({
    name: 'Performance Optimization',
    description: 'Identify and optimize performance bottlenecks, especially in file processing operations'
  });
  
  improvements.push({
    name: 'User Experience Enhancement',
    description: 'Improve error handling and user feedback for a better experience'
  });
  
  return improvements;
}

/**
 * Generate a simple file tree visualization
 */
function generateFileTree(analysis) {
  if (!analysis.overview || !analysis.overview.mainDirectories) {
    return 'File tree information not available';
  }
  
  let tree = '';
  const mainDirs = [...analysis.overview.mainDirectories]
    .sort((a, b) => {
      // Root directory first
      if (a.path === '.') return -1;
      if (b.path === '.') return 1;
      return a.path.localeCompare(b.path);
    });
  
  for (const dir of mainDirs) {
    if (dir.path === '.') {
      // Root files
      tree += 'project-root/\n';
      // Add some important files in root
      if (analysis.structure && analysis.structure.importantFiles) {
        const rootFiles = analysis.structure.importantFiles
          .filter(file => path.dirname(file.path) === '.')
          .slice(0, 5);
          
        for (const file of rootFiles) {
          tree += `├── ${path.basename(file.path)}\n`;
        }
      }
      tree += '│\n';
    } else {
      // Non-root directories
      const depth = dir.path.split('/').length;
      const prefix = '│   '.repeat(depth - 1);
      tree += `${prefix}├── ${path.basename(dir.path)}/\n`;
      
      // Add some files in this directory if available
      if (analysis.structure && analysis.structure.importantFiles) {
        const dirFiles = analysis.structure.importantFiles
          .filter(file => path.dirname(file.path) === dir.path)
          .slice(0, 3);
          
        for (const file of dirFiles) {
          tree += `${prefix}│   ├── ${path.basename(file.path)}\n`;
        }
        
        if (dirFiles.length > 0) {
          tree += `${prefix}│   │\n`;
        }
      }
    }
  }
  
  return tree;
}

/**
 * Generate a dependency table for major modules
 */
function generateDependencyTable(analysis) {
  if (!analysis.concepts || !analysis.concepts.modules || !analysis.structure || !analysis.structure.dependencyGraph) {
    return 'Dependency information not available';
  }
  
  const modules = analysis.concepts.modules.slice(0, 5);
  const depGraph = analysis.structure.dependencyGraph;
  
  // Create table headers
  const headers = ['Module', 'Depends On', 'Used By'];
  const rows = [];
  
  for (const module of modules) {
    const modulePath = module.name;
    
    // Find files in this module
    const moduleFiles = Object.keys(depGraph).filter(file => 
      file.startsWith(modulePath + '/')
    );
    
    // Find dependencies
    const dependencies = new Set();
    const usedBy = new Set();
    
    for (const file of moduleFiles) {
      // Add dependencies
      if (depGraph[file] && depGraph[file].imports) {
        for (const dep of depGraph[file].imports) {
          const depModule = findModuleForFile(dep, modules);
          if (depModule && depModule !== modulePath) {
            dependencies.add(depModule);
          }
        }
      }
      
      // Add used by
      if (depGraph[file] && depGraph[file].importedBy) {
        for (const user of depGraph[file].importedBy) {
          const userModule = findModuleForFile(user, modules);
          if (userModule && userModule !== modulePath) {
            usedBy.add(userModule);
          }
        }
      }
    }
    
    rows.push([
      formatModuleName(modulePath),
      Array.from(dependencies).map(formatModuleName).join(', ') || 'None',
      Array.from(usedBy).map(formatModuleName).join(', ') || 'None'
    ]);
  }
  
  return markdownTable([headers, ...rows]);
}

/**
 * Find which module a file belongs to
 */
function findModuleForFile(filePath, modules) {
  for (const module of modules) {
    if (filePath.startsWith(module.name + '/')) {
      return module.name;
    }
  }
  return null;
}

/**
 * Extract representative code examples
 */
function extractCodeExamples(analysis) {
  const examples = [];
  
  // We need file content for this, which we don't have currently
  // This could be implemented by reading the actual files
  
  // For now, return placeholder examples
  examples.push({
    name: 'Main Entry Point',
    file: 'index.js',
    language: 'javascript',
    code: '// This is a placeholder for actual code\n// In a real implementation, this would contain actual code from the file',
    description: 'The main entry point for the application'
  });
  
  return examples;
}

/**
 * Get the LLM knowledge transfer guide
 */
async function getLLMKnowledgeTransferGuide() {
  // In a real implementation, this would read from a template file
  return `
# LLM Knowledge Transfer Guide

This knowledge transfer document is designed to help LLMs understand your project quickly and efficiently. Here's how to use it:

1. **Share with your LLM** - Provide this document to your AI assistant
2. **Establish expertise** - Ask the LLM to become an expert on your project based on this document
3. **Ask specific questions** - Query about architecture, functionality, or implementation details
4. **Request development help** - Get the LLM to generate compatible code or suggest improvements

The LLM can now provide more accurate and contextually appropriate help with your project, without needing to analyze the entire codebase.
`.trim();
}