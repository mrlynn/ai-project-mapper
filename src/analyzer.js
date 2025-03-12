import fs from 'fs-extra';
import path from 'path';
import glob from 'fast-glob';
import { parse as parseJS } from 'acorn';
import { simple as walkAST } from 'acorn-walk';

// Constants
const DEFAULT_IGNORES = [
  'node_modules/**',
  '.git/**',
  'dist/**',
  'build/**',
  '.vscode/**',
  '.idea/**',
  'coverage/**',
  '**/test/**',
  '**/tests/**',
  '**/*.min.js',
  '**/*.min.css',
  '**/*.map',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml'
];

const FILE_TYPE_EXTENSIONS = {
  javascript: ['.js', '.jsx', '.mjs'],
  typescript: ['.ts', '.tsx'],
  html: ['.html', '.htm', '.xhtml'],
  css: ['.css', '.scss', '.sass', '.less'],
  json: ['.json'],
  markdown: ['.md', '.markdown'],
  python: ['.py'],
  ruby: ['.rb'],
  java: ['.java'],
  csharp: ['.cs'],
  php: ['.php'],
  golang: ['.go'],
  rust: ['.rs'],
  shell: ['.sh', '.bash'],
  yaml: ['.yml', '.yaml'],
  xml: ['.xml'],
  sql: ['.sql']
};

/**
 * Analyzes an entire project
 */
export async function analyzeProject(inputDir, options = {}) {
  const {
    ignorePatterns = [],
    maxDepth = 10,
    verbose = false
  } = options;
  
  // Combine ignore patterns
  const allIgnorePatterns = [...DEFAULT_IGNORES, ...ignorePatterns];
  
  try {
    // Find all files with depth limit
    const files = await glob(['**/*'], {
      cwd: inputDir,
      dot: true,
      onlyFiles: true,
      ignore: allIgnorePatterns,
      deep: maxDepth
    });
    
    if (verbose) {
      console.log(`Found ${files.length} files to analyze`);
    }
    
    // Group files by type
    const filesByType = {};
    for (const [type, extensions] of Object.entries(FILE_TYPE_EXTENSIONS)) {
      filesByType[type] = files.filter(file => 
        extensions.includes(path.extname(file).toLowerCase())
      );
    }
    
    // Group files by directory
    const filesByDir = {};
    for (const file of files) {
      const dir = path.dirname(file);
      if (!filesByDir[dir]) {
        filesByDir[dir] = [];
      }
      filesByDir[dir].push(file);
    }
    
    // Find package.json and parse it
    let packageInfo = {};
    const packageJsonPath = files.find(file => file === 'package.json');
    if (packageJsonPath) {
      try {
        const packageJsonContent = await fs.readFile(path.join(inputDir, packageJsonPath), 'utf-8');
        packageInfo = JSON.parse(packageJsonContent);
      } catch (error) {
        if (verbose) {
          console.error(`Error parsing package.json: ${error.message}`);
        }
      }
    }
    
    // Analyze JavaScript and TypeScript files in more detail
    const jsFiles = [...(filesByType.javascript || []), ...(filesByType.typescript || [])];
    
    // Limit number of files to analyze in detail to prevent performance issues
    const MAX_DETAILED_FILES = 100;
    const filesToAnalyze = jsFiles.slice(0, MAX_DETAILED_FILES);
    
    if (verbose && jsFiles.length > MAX_DETAILED_FILES) {
      console.log(`Limiting detailed analysis to ${MAX_DETAILED_FILES} out of ${jsFiles.length} JS/TS files`);
    }
    
    const analyzedFiles = [];
    for (const file of filesToAnalyze) {
      try {
        const fullPath = path.join(inputDir, file);
        const result = await analyzeJSFile(fullPath);
        result.relativePath = file;
        analyzedFiles.push(result);
      } catch (error) {
        if (verbose) {
          console.error(`Error analyzing ${file}: ${error.message}`);
        }
      }
    }
    
    // Find entry points
    const entryPoints = findEntryPoints(analyzedFiles, packageInfo);
    
    // Find dependencies between files
    const dependencyGraph = buildDependencyGraph(analyzedFiles, inputDir);
    
    // Identify important files
    const importantFiles = findImportantFiles(analyzedFiles, dependencyGraph, entryPoints);
    
    // Extract core concepts
    const coreConcepts = extractCoreConcepts(analyzedFiles, packageInfo);
    
    // Get file statistics
    const fileStats = await getFileStatistics(files, inputDir);
    
    // Find README or similar documentation
    const documentation = await findDocumentation(files, inputDir);
    
    return {
      overview: {
        name: packageInfo.name || path.basename(inputDir),
        description: packageInfo.description || '',
        version: packageInfo.version || '',
        totalFiles: files.length,
        totalDirectories: Object.keys(filesByDir).length,
        filesByType,
        mainDirectories: Object.keys(filesByDir)
          .filter(dir => filesByDir[dir].length >= 3)
          .map(dir => ({ path: dir, fileCount: filesByDir[dir].length }))
          .sort((a, b) => b.fileCount - a.fileCount)
          .slice(0, 10)
      },
      package: {
        dependencies: packageInfo.dependencies || {},
        devDependencies: packageInfo.devDependencies || {},
        scripts: packageInfo.scripts || {},
        main: packageInfo.main || '',
        bin: packageInfo.bin || {},
        type: packageInfo.type || ''
      },
      structure: {
        entryPoints,
        importantFiles: importantFiles.slice(0, 20),
        dependencyGraph: simplifyDependencyGraph(dependencyGraph)
      },
      concepts: coreConcepts,
      fileStats,
      documentation
    };
  } catch (error) {
    console.error(`Error analyzing project: ${error.message}`);
    throw error;
  }
}

/**
 * Analyze JavaScript/TypeScript file using AST
 */
async function analyzeJSFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Initialize result object
    const result = {
      path: filePath,
      size: content.length,
      lines: content.split('\n').length,
      imports: [],
      exports: [],
      functions: [],
      classes: [],
      dependencies: []
    };
    
    try {
      // Parse the file with acorn
      const ast = parseJS(content, {
        ecmaVersion: 'latest',
        sourceType: 'module',
        locations: true
      });
      
      // Walk the AST to extract information
      walkAST(ast, {
        ImportDeclaration(node) {
          const importSource = node.source.value;
          result.imports.push({
            source: importSource,
            specifiers: node.specifiers.map(s => {
              if (s.type === 'ImportDefaultSpecifier') {
                return { type: 'default', name: s.local.name };
              } else if (s.type === 'ImportSpecifier') {
                return { type: 'named', name: s.local.name };
              }
              return { type: 'namespace', name: s.local.name };
            })
          });
          
          // Track dependency
          result.dependencies.push(importSource);
        },
        
        ExportNamedDeclaration(node) {
          if (node.declaration) {
            if (node.declaration.type === 'FunctionDeclaration') {
              result.exports.push({
                type: 'function',
                name: node.declaration.id.name
              });
            } else if (node.declaration.type === 'ClassDeclaration') {
              result.exports.push({
                type: 'class',
                name: node.declaration.id.name
              });
            } else if (node.declaration.type === 'VariableDeclaration') {
              node.declaration.declarations.forEach(d => {
                result.exports.push({
                  type: 'variable',
                  name: d.id.name
                });
              });
            }
          } else if (node.specifiers) {
            node.specifiers.forEach(s => {
              result.exports.push({
                type: 'named',
                name: s.exported.name
              });
            });
          }
        },
        
        ExportDefaultDeclaration(node) {
          let name = 'default';
          
          if (node.declaration.type === 'Identifier') {
            name = node.declaration.name;
          } else if (node.declaration.id) {
            name = node.declaration.id.name;
          }
          
          result.exports.push({
            type: 'default',
            name
          });
        },
        
        FunctionDeclaration(node) {
          result.functions.push({
            name: node.id?.name || 'anonymous',
            params: node.params.map(p => {
              if (p.type === 'Identifier') return p.name;
              return 'param';
            }),
            loc: {
              start: node.loc.start.line,
              end: node.loc.end.line
            },
            isAsync: node.async
          });
        },
        
        ClassDeclaration(node) {
          const methods = [];
          
          if (node.body && node.body.body) {
            for (const item of node.body.body) {
              if (item.type === 'MethodDefinition') {
                methods.push({
                  name: item.key.name || 'method',
                  kind: item.kind,
                  isStatic: item.static,
                  isAsync: item.value.async
                });
              }
            }
          }
          
          result.classes.push({
            name: node.id?.name || 'AnonymousClass',
            methods,
            loc: {
              start: node.loc.start.line,
              end: node.loc.end.line
            }
          });
        }
      });
    } catch (parseError) {
      // If parsing fails, use regex-based approach as fallback
      result.parseError = parseError.message;
      analyzeJSWithRegex(content, result);
    }
    
    return result;
  } catch (error) {
    console.error(`Error analyzing ${filePath}: ${error.message}`);
    return {
      path: filePath,
      error: error.message
    };
  }
}

/**
 * Fallback function to analyze JS file with regex
 */
function analyzeJSWithRegex(content, result) {
  const lines = content.split('\n');
  
  // Simple pattern matching
  const importRegex = /^import\s+(?:{[^}]*}|[\w\s*]+)\s+from\s+['"]([^'"]+)['"]/;
  const exportRegex = /^export\s+(default\s+)?(?:function|class|const|let|var)?\s*(\w+)/;
  const functionRegex = /^(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(/;
  const classRegex = /^(?:export\s+)?class\s+(\w+)(?:\s+extends\s+\w+)?\s*{/;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Find imports
    const importMatch = line.match(importRegex);
    if (importMatch) {
      const source = importMatch[1];
      result.dependencies.push(source);
      result.imports.push({
        source,
        specifiers: [{ type: 'unknown', name: 'unknown' }]
      });
    }
    
    // Find exports
    const exportMatch = line.match(exportRegex);
    if (exportMatch) {
      result.exports.push({
        type: exportMatch[1] ? 'default' : 'named',
        name: exportMatch[2] || 'unknown'
      });
    }
    
    // Find functions
    const functionMatch = line.match(functionRegex);
    if (functionMatch) {
      result.functions.push({
        name: functionMatch[1],
        params: [],
        loc: {
          start: i + 1,
          end: i + 1
        },
        isAsync: line.startsWith('async')
      });
    }
    
    // Find classes
    const classMatch = line.match(classRegex);
    if (classMatch) {
      result.classes.push({
        name: classMatch[1],
        methods: [],
        loc: {
          start: i + 1,
          end: i + 1
        }
      });
    }
  }
}

/**
 * Find entry points based on package.json and file analysis
 */
function findEntryPoints(analyzedFiles, packageInfo) {
  const entryPoints = [];
  
  // Check package.json main field
  if (packageInfo.main) {
    entryPoints.push({
      path: packageInfo.main,
      type: 'main',
      description: 'Main entry point from package.json'
    });
  }
  
  // Check package.json bin field
  if (packageInfo.bin) {
    if (typeof packageInfo.bin === 'string') {
      entryPoints.push({
        path: packageInfo.bin,
        type: 'bin',
        description: 'Binary entry point from package.json'
      });
    } else {
      for (const [name, path] of Object.entries(packageInfo.bin)) {
        entryPoints.push({
          path,
          type: 'bin',
          description: `Binary entry point '${name}' from package.json`
        });
      }
    }
  }
  
  // Common entry file names
  const commonEntryFiles = [
    'index.js', 'index.ts', 
    'main.js', 'main.ts', 
    'app.js', 'app.ts', 
    'server.js', 'server.ts',
    'cli.js', 'cli.ts'
  ];
  
  // Check for common entry files in root and src directories
  for (const file of analyzedFiles) {
    const basename = path.basename(file.relativePath);
    const dirname = path.dirname(file.relativePath);
    
    if ((dirname === '.' || dirname === 'src') && commonEntryFiles.includes(basename)) {
      // Check if already found via package.json
      if (!entryPoints.some(entry => entry.path === file.relativePath)) {
        entryPoints.push({
          path: file.relativePath,
          type: 'convention',
          description: `Conventional entry point file`
        });
      }
    }
  }
  
  return entryPoints;
}

/**
 * Build dependency graph between files
 */
function buildDependencyGraph(analyzedFiles, basePath) {
  const graph = {};
  
  // Initialize graph with all files
  for (const file of analyzedFiles) {
    const relativePath = file.relativePath;
    graph[relativePath] = {
      imports: [],
      importedBy: []
    };
  }
  
  // Build connections
  for (const file of analyzedFiles) {
    const sourceFile = file.relativePath;
    const sourceDir = path.dirname(sourceFile);
    
    for (const dependencyPath of file.dependencies) {
      // Skip external dependencies (node_modules)
      if (!dependencyPath.startsWith('.') && !dependencyPath.startsWith('/')) {
        continue;
      }
      
      // Try to resolve the file path
      let resolvedPath;
      try {
        // Simple path resolution for project files
        if (dependencyPath.startsWith('.')) {
          resolvedPath = path.normalize(path.join(sourceDir, dependencyPath));
        } else if (dependencyPath.startsWith('/')) {
          resolvedPath = dependencyPath.substring(1); // Remove leading slash
        }
        
        // Try to match with extensions if none provided
        if (resolvedPath && !path.extname(resolvedPath)) {
          const extensions = ['.js', '.jsx', '.ts', '.tsx'];
          for (const ext of extensions) {
            const pathWithExt = resolvedPath + ext;
            if (graph[pathWithExt]) {
              resolvedPath = pathWithExt;
              break;
            }
            
            // Try with /index
            const indexPath = path.join(resolvedPath, `index${ext}`);
            if (graph[indexPath]) {
              resolvedPath = indexPath;
              break;
            }
          }
        }
        
        // Add to graph if resolved dependency exists
        if (resolvedPath && graph[resolvedPath]) {
          graph[sourceFile].imports.push(resolvedPath);
          graph[resolvedPath].importedBy.push(sourceFile);
        }
      } catch (error) {
        // Skip dependencies that can't be resolved
      }
    }
  }
  
  return graph;
}

/**
 * Simplify dependency graph for output
 */
function simplifyDependencyGraph(graph) {
  // Create a simpler version with just the connections
  const simplified = {};
  
  for (const [file, connections] of Object.entries(graph)) {
    simplified[file] = {
      imports: connections.imports,
      importedBy: connections.importedBy
    };
  }
  
  return simplified;
}

/**
 * Find important files based on various heuristics
 */
function findImportantFiles(analyzedFiles, dependencyGraph, entryPoints) {
  const scoreMap = {};
  
  // Initialize scores
  for (const file of analyzedFiles) {
    scoreMap[file.relativePath] = 0;
  }
  
  // Entry points get a high base score
  for (const entry of entryPoints) {
    if (scoreMap[entry.path] !== undefined) {
      scoreMap[entry.path] += 50;
    }
  }
  
  // Files imported by many others are important
  for (const [file, connections] of Object.entries(dependencyGraph)) {
    if (scoreMap[file] !== undefined) {
      scoreMap[file] += connections.importedBy.length * 5;
    }
  }
  
  // Files with many exports are important
  for (const file of analyzedFiles) {
    scoreMap[file.relativePath] += file.exports.length * 3;
  }
  
  // Files with classes are important
  for (const file of analyzedFiles) {
    scoreMap[file.relativePath] += file.classes.length * 4;
  }
  
  // Files with many functions are important
  for (const file of analyzedFiles) {
    scoreMap[file.relativePath] += file.functions.length * 2;
  }
  
  // Longer files might be more important
  for (const file of analyzedFiles) {
    scoreMap[file.relativePath] += Math.min(file.lines / 50, 10); // Max 10 points for size
  }
  
  // Convert to array and sort by score
  const sortedFiles = Object.entries(scoreMap)
    .map(([path, score]) => ({ path, score }))
    .sort((a, b) => b.score - a.score);
    
  return sortedFiles;
}

/**
 * Extract core concepts from the project
 */
function extractCoreConcepts(analyzedFiles, packageInfo) {
  // Group files by directories to identify modules
  const dirGroups = {};
  for (const file of analyzedFiles) {
    const dir = path.dirname(file.relativePath);
    if (!dirGroups[dir]) {
      dirGroups[dir] = [];
    }
    dirGroups[dir].push(file);
  }
  
  // Find major modules (directories with multiple files)
  const modules = Object.entries(dirGroups)
    .filter(([dir, files]) => files.length >= 2 && dir !== '.')
    .map(([dir, files]) => {
      // Extract main exports from all files in the directory
      const exports = files.flatMap(file => file.exports);
      const functions = files.flatMap(file => file.functions);
      const classes = files.flatMap(file => file.classes);
      
      return {
        name: dir,
        fileCount: files.length,
        exports: exports.length,
        functions: functions.length,
        classes: classes.length,
        mainExports: exports.slice(0, 5).map(e => e.name)
      };
    })
    .sort((a, b) => b.fileCount - a.fileCount);
  
  // Identify common utilities
  const utilities = analyzedFiles
    .filter(file => {
      const basename = path.basename(file.relativePath, path.extname(file.relativePath));
      const dirname = path.dirname(file.relativePath);
      
      return basename.includes('util') || 
             basename.includes('helper') || 
             dirname.includes('util') ||
             dirname.includes('helper') ||
             file.functions.length > 3 && file.exports.length > 0;
    })
    .map(file => ({
      path: file.relativePath,
      exports: file.exports.map(e => e.name)
    }));
  
  // Identify key data structures
  const dataStructures = analyzedFiles
    .filter(file => file.classes.length > 0)
    .map(file => ({
      path: file.relativePath,
      classes: file.classes.map(c => c.name)
    }));
  
  return {
    modules: modules.slice(0, 10),
    utilities: utilities.slice(0, 10),
    dataStructures: dataStructures.slice(0, 10),
    keywords: extractKeywords(analyzedFiles, packageInfo)
  };
}

/**
 * Extract keywords from project files
 */
function extractKeywords(analyzedFiles, packageInfo) {
  const wordCounts = {};
  
  // Count identifiers
  for (const file of analyzedFiles) {
    // Add function names
    for (const func of file.functions) {
      countWords(wordCounts, func.name);
    }
    
    // Add class names
    for (const cls of file.classes) {
      countWords(wordCounts, cls.name);
    }
    
    // Add export names
    for (const exp of file.exports) {
      countWords(wordCounts, exp.name);
    }
  }
  
  // Add package.json keywords
  if (packageInfo.keywords && Array.isArray(packageInfo.keywords)) {
    for (const keyword of packageInfo.keywords) {
      wordCounts[keyword] = (wordCounts[keyword] || 0) + 5; // Give higher weight
    }
  }
  
  // Filter out common programming terms and short words
  const commonWords = new Set([
    'get', 'set', 'add', 'new', 'create', 'update', 'delete', 'remove',
    'find', 'search', 'load', 'save', 'read', 'write', 'open', 'close',
    'start', 'stop', 'init', 'handle', 'process', 'validate', 'check',
    'data', 'config', 'util', 'utils', 'helper', 'helpers', 'service',
    'component', 'controller', 'model', 'view', 'test', 'index', 'app',
    'main', 'default', 'function', 'class', 'interface', 'type', 'const',
    'var', 'let', 'async', 'await', 'export', 'import'
  ]);
  
  // Filter and sort keywords
  const filtered = Object.entries(wordCounts)
    .filter(([word, count]) => {
      return word.length > 3 && !commonWords.has(word.toLowerCase()) && count > 1;
    })
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);
    
  return filtered;
}

/**
 * Count words in identifiers by splitting camelCase and PascalCase
 */
function countWords(wordCounts, identifier) {
  if (!identifier || typeof identifier !== 'string' || identifier === 'anonymous' || identifier === 'unknown') {
    return;
  }
  
  // Count the full identifier
  wordCounts[identifier] = (wordCounts[identifier] || 0) + 1;
  
  // Split camelCase and PascalCase into words
  const words = identifier.split(/(?=[A-Z])/).map(w => w.toLowerCase());
  
  for (const word of words) {
    if (word.length > 3) { // Only count meaningful words
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  }
}

/**
 * Get file statistics
 */
async function getFileStatistics(files, inputDir) {
  const stats = {
    totalSize: 0,
    largestFiles: [],
    extensionCounts: {},
    languages: {}
  };
  
  // Process all files
  for (const file of files) {
    try {
      const fullPath = path.join(inputDir, file);
      const fileStat = await fs.stat(fullPath);
      const ext = path.extname(file).toLowerCase() || 'no-extension';
      
      // Update total size
      stats.totalSize += fileStat.size;
      
      // Update extension counts
      stats.extensionCounts[ext] = (stats.extensionCounts[ext] || 0) + 1;
      
      // Update language stats based on extension
      const language = getLanguageFromExtension(ext);
      if (language) {
        if (!stats.languages[language]) {
          stats.languages[language] = {
            files: 0,
            size: 0
          };
        }
        
        stats.languages[language].files++;
        stats.languages[language].size += fileStat.size;
      }
      
      // Track largest files
      stats.largestFiles.push({
        path: file,
        size: fileStat.size
      });
    } catch (error) {
      // Skip files with errors
    }
  }
  
  // Sort and limit largest files
  stats.largestFiles.sort((a, b) => b.size - a.size);
  stats.largestFiles = stats.largestFiles.slice(0, 10);
  
  return stats;
}

/**
 * Map file extension to language
 */
function getLanguageFromExtension(ext) {
  const map = {
    '.js': 'JavaScript',
    '.jsx': 'JavaScript (React)',
    '.ts': 'TypeScript',
    '.tsx': 'TypeScript (React)',
    '.py': 'Python',
    '.rb': 'Ruby',
    '.java': 'Java',
    '.go': 'Go',
    '.rs': 'Rust',
    '.php': 'PHP',
    '.cs': 'C#',
    '.cpp': 'C++',
    '.c': 'C',
    '.swift': 'Swift',
    '.kt': 'Kotlin',
    '.html': 'HTML',
    '.css': 'CSS',
    '.scss': 'SCSS',
    '.sass': 'Sass',
    '.less': 'Less',
    '.md': 'Markdown',
    '.json': 'JSON',
    '.yml': 'YAML',
    '.yaml': 'YAML',
    '.xml': 'XML',
    '.sh': 'Shell',
    '.bash': 'Bash',
    '.sql': 'SQL'
  };
  
  return map[ext] || null;
}

/**
 * Find and analyze documentation files
 */
async function findDocumentation(files, inputDir) {
  const docs = [];
  
  // Common documentation files
  const docFiles = files.filter(file => {
    const basename = path.basename(file).toLowerCase();
    return basename === 'readme.md' ||
           basename === 'readme' ||
           basename === 'contributing.md' ||
           basename === 'docs.md' ||
           basename === 'documentation.md' ||
           basename === 'guide.md' ||
           basename === 'api.md' ||
           basename.includes('readme');
  });
  
  // Analyze documentation files
  for (const file of docFiles) {
    try {
      const content = await fs.readFile(path.join(inputDir, file), 'utf-8');
      
      // Extract headings for table of contents
      const headings = [];
      const headingRegex = /^(#+)\s+(.+)$/gm;
      let match;
      
      while ((match = headingRegex.exec(content)) !== null) {
        headings.push({
          level: match[1].length,
          text: match[2].trim()
        });
      }
      
      docs.push({
        path: file,
        size: content.length,
        headings: headings.slice(0, 10), // Only include first 10 headings
        preview: content.slice(0, 500) // First 500 chars as preview
      });
    } catch (error) {
      // Skip files with errors
    }
  }
  
  return docs;
}