import fs from 'fs-extra';
import path from 'path';
import natural from 'natural';
import { parse } from 'acorn';
import * as walk from 'acorn-walk';
import fastGlob from 'fast-glob';

const { WordTokenizer, PorterStemmer, TfIdf, NGrams } = natural;
const { glob } = fastGlob;

/**
 * SemanticCodeAnalyzer performs natural language processing on code to extract
 * domain concepts, terminology, and semantic relationships.
 */
export class SemanticCodeAnalyzer {
    constructor(options = {}) {
        this.options = {
            includeComments: true,
            includeDocs: true,
            includeIdentifiers: true,
            minTermFrequency: 2,
            maxTerms: 100,
            ...options
        };

        // Initialize NLP tools
        this.tokenizer = new WordTokenizer();
        this.tfidf = new TfIdf();

        // Store extracted terms and concepts
        this.domainConcepts = [];
        this.conceptRelationships = new Map();
        this.conceptFrequency = new Map();
        this.fileConceptMapping = new Map();
        this.glossary = new Map();
    }

    /**
     * Analyze a project directory to extract semantic information
     */
    async analyzeProject(projectDir, ignorePaths = []) {
        // Get all relevant files
        const files = await this.getProjectFiles(projectDir, ignorePaths);
        
        // Add a file size limit check
        if (this.options.maxFiles && files.length > this.options.maxFiles) {
          console.warn(`Limiting semantic analysis to ${this.options.maxFiles} files out of ${files.length}`);
          files.splice(this.options.maxFiles);
        }
        
        // Process files in batches
        await this.processBatchedFiles(files);
        
        // Generate domain concepts from processed text
        await this.extractDomainConcepts();
        
        // Detect relationships between concepts
        this.detectConceptRelationships();
        
        // Generate domain glossary
        this.generateDomainGlossary();
        
        return this.prepareResults();
      }

    /**
     * Get all relevant files in the project
     */
    async getProjectFiles(projectDir, ignorePaths) {
        const defaultIgnore = [
            '**/node_modules/**',
            '**/dist/**',
            '**/build/**',
            '**/.git/**',
            '**/*.min.js',
            '**/*.bundle.js'
        ];

        const patterns = [
            '**/*.js',
            '**/*.jsx',
            '**/*.ts',
            '**/*.tsx',
            '**/*.md',
            '**/*.txt',
            '**/package.json',
            '**/README*'
        ];

        const ignorePatterns = [...defaultIgnore, ...ignorePaths];

        return glob(patterns, {
            cwd: projectDir,
            absolute: true,
            ignore: ignorePatterns
        });
    }

    /**
   * Process files in smaller batches to prevent memory issues
   * @param {string[]} files - Array of file paths to analyze
   * @param {number} chunkSize - Number of files to process at once
   * @returns {Promise<void>}
   */
    async processBatchedFiles(files, chunkSize = 20) {
        // Process files in chunks
        for (let i = 0; i < files.length; i += chunkSize) {
            const chunk = files.slice(i, i + chunkSize);

            // Process each file in the chunk
            for (const file of chunk) {
                await this.analyzeFile(file);
            }

            // Give the event loop a break between chunks to help with GC
            if (i + chunkSize < files.length) {
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        }
    }

    /**
     * Analyze a single file
     */
    async analyzeFile(filePath) {
        const content = await fs.readFile(filePath, 'utf-8');
        const extension = path.extname(filePath);
        const fileName = path.basename(filePath);
        const relPath = path.relative(process.cwd(), filePath);
        const stats = await fs.stat(filePath);
        const MAX_FILE_SIZE = 1024 * 1024; // 1MB

        if (stats.size > MAX_FILE_SIZE) {
            console.warn(`Skipping large file (${(stats.size / 1024 / 1024).toFixed(2)}MB): ${path.basename(filePath)}`);
            return;
          }
        // Create a document container for this file
        const fileDocument = {
            path: relPath,
            identifiers: [],
            comments: [],
            documentation: '',
            text: ''
        };

        // Process based on file type
        if (extension === '.js' || extension === '.jsx' || extension === '.ts' || extension === '.tsx') {
            this.processCodeFile(content, fileDocument);
        } else if (extension === '.md' || fileName.toLowerCase().includes('readme')) {
            this.processDocumentationFile(content, fileDocument);
        } else if (extension === '.json') {
            this.processJsonFile(content, fileDocument);
        }

        // Add the file document to the term frequency analysis
        if (fileDocument.text.trim()) {
            this.tfidf.addDocument(fileDocument.text);
            this.fileConceptMapping.set(relPath, fileDocument);
        }
    }

    /**
     * Process a code file (JS/TS)
     */
    processCodeFile(content, fileDocument) {
        try {
            // Extract comments (simplified approach - a more robust solution would use a comment parser)
            const commentRegex = /\/\/(.+?)$|\/\*\*?([\s\S]*?)\*\//gm;
            let match;
            while ((match = commentRegex.exec(content)) !== null) {
                const comment = (match[1] || match[2]).trim();
                if (comment) {
                    fileDocument.comments.push(comment);
                }
            }

            // Parse AST to extract identifiers
            try {
                const ast = parse(content, {
                    ecmaVersion: 'latest',
                    sourceType: 'module',
                    locations: true
                });

                // Walk the AST to extract identifiers
                walk.full(ast, node => {
                    if (node.type === 'Identifier') {
                        fileDocument.identifiers.push(node.name);
                    } else if (node.type === 'FunctionDeclaration' && node.id) {
                        fileDocument.identifiers.push(node.id.name);
                    } else if (node.type === 'ClassDeclaration' && node.id) {
                        fileDocument.identifiers.push(node.id.name);
                    } else if (node.type === 'MethodDefinition' && node.key) {
                        fileDocument.identifiers.push(node.key.name);
                    } else if (node.type === 'PropertyDefinition' && node.key) {
                        if (node.key.name || node.key.value) {
                            fileDocument.identifiers.push(node.key.name || node.key.value);
                        }
                    }
                });
            } catch (e) {
                // If parsing fails, try a regex-based approach as fallback
                this.extractIdentifiersWithRegex(content, fileDocument);
            }

            // Combine all text for NLP processing
            if (this.options.includeComments) {
                fileDocument.text += fileDocument.comments.join(' ');
            }

            if (this.options.includeIdentifiers) {
                // Convert camelCase and snake_case to separate words
                const processedIdentifiers = fileDocument.identifiers.map(id =>
                    this.splitIdentifierIntoWords(id)
                ).join(' ');
                fileDocument.text += ' ' + processedIdentifiers;
            }
        } catch (error) {
            console.error(`Error processing file ${fileDocument.path}: ${error.message}`);
        }
    }

    /**
     * Extract identifiers using regex as a fallback when AST parsing fails
     */
    extractIdentifiersWithRegex(content, fileDocument) {
        // Match variable declarations
        const varRegex = /(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
        let match;
        while ((match = varRegex.exec(content)) !== null) {
            fileDocument.identifiers.push(match[1]);
        }

        // Match function declarations
        const funcRegex = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
        while ((match = funcRegex.exec(content)) !== null) {
            fileDocument.identifiers.push(match[1]);
        }

        // Match class declarations
        const classRegex = /class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
        while ((match = classRegex.exec(content)) !== null) {
            fileDocument.identifiers.push(match[1]);
        }
    }

    /**
     * Process a documentation file (MD)
     */
    processDocumentationFile(content, fileDocument) {
        // For markdown, we just use the raw content
        fileDocument.documentation = content;
        fileDocument.text = content;
    }

    /**
     * Process a JSON file (package.json, config files)
     */
    processJsonFile(content, fileDocument) {
        try {
            const json = JSON.parse(content);

            // Extract relevant fields like name, description, keywords
            if (json.name) fileDocument.text += json.name + ' ';
            if (json.description) fileDocument.text += json.description + ' ';
            if (json.keywords && Array.isArray(json.keywords)) {
                fileDocument.text += json.keywords.join(' ') + ' ';
            }

            // Add script names as identifiers
            if (json.scripts && typeof json.scripts === 'object') {
                Object.keys(json.scripts).forEach(scriptName => {
                    fileDocument.identifiers.push(scriptName);
                    fileDocument.text += scriptName + ' ';
                });
            }

            // Add dependency names as identifiers
            for (const depType of ['dependencies', 'devDependencies', 'peerDependencies']) {
                if (json[depType] && typeof json[depType] === 'object') {
                    Object.keys(json[depType]).forEach(depName => {
                        fileDocument.identifiers.push(depName);
                    });
                }
            }
        } catch (error) {
            console.error(`Error parsing JSON file ${fileDocument.path}: ${error.message}`);
        }
    }

    /**
     * Extract domain concepts from all processed text
     */
    async extractDomainConcepts() {
        // Get top terms using TF-IDF
        const uniqueTerms = new Set();

        for (let i = 0; i < this.tfidf.documents.length; i++) {
            const terms = this.tfidf.listTerms(i).slice(0, this.options.maxTerms);

            for (const term of terms) {
                // Skip very short terms
                if (term.term.length < 3) continue;

                // Skip numeric terms
                if (/^\d+$/.test(term.term)) continue;

                // Skip common programming terms unless they appear to be important
                if (this.isCommonProgrammingTerm(term.term) && term.tfidf < 7) continue;

                uniqueTerms.add(term.term);

                // Update frequency map
                this.conceptFrequency.set(
                    term.term,
                    (this.conceptFrequency.get(term.term) || 0) + Math.round(term.tfidf * 10)
                );
            }
        }

        // Create n-grams to find multi-word concepts
        const allText = Array.from(this.fileConceptMapping.values())
            .map(doc => doc.text)
            .join(' ');

        // Generate bigrams and trigrams
        const bigrams = NGrams.bigrams(allText);
        const trigrams = NGrams.trigrams(allText);

        // Extract meaningful bigrams and trigrams
        for (const ngram of [...bigrams, ...trigrams]) {
            const ngramStr = ngram.join(' ');
            if (this.isSignificantNgram(ngramStr)) {
                uniqueTerms.add(ngramStr);

                // Calculate a heuristic score for n-grams
                this.conceptFrequency.set(
                    ngramStr,
                    Math.round((this.conceptFrequency.get(ngramStr) || 0) + 5)
                );
            }
        }

        // Filter to important terms only
        this.domainConcepts = Array.from(uniqueTerms)
            .filter(term => (this.conceptFrequency.get(term) || 0) >= this.options.minTermFrequency);

        // Sort by frequency
        this.domainConcepts.sort((a, b) =>
            (this.conceptFrequency.get(b) || 0) - (this.conceptFrequency.get(a) || 0)
        );
    }

    /**
     * Detect relationships between concepts
     */
    detectConceptRelationships() {
        const conceptPairs = [];

        // For each file, create pairs of concepts that appear together
        for (const fileDoc of this.fileConceptMapping.values()) {
            const conceptsInFile = this.domainConcepts.filter(concept =>
                fileDoc.text.includes(concept)
            );

            // Create pairs of concepts
            for (let i = 0; i < conceptsInFile.length; i++) {
                for (let j = i + 1; j < conceptsInFile.length; j++) {
                    conceptPairs.push([conceptsInFile[i], conceptsInFile[j]]);
                }
            }
        }

        // Count occurrences of each pair
        const pairCounts = new Map();
        for (const [a, b] of conceptPairs) {
            const key = `${a}|${b}`;
            pairCounts.set(key, (pairCounts.get(key) || 0) + 1);
        }

        // Create relationships for pairs that occur often enough
        for (const [key, count] of pairCounts.entries()) {
            if (count >= 2) {
                const [a, b] = key.split('|');

                // Add to relationships map in both directions
                if (!this.conceptRelationships.has(a)) {
                    this.conceptRelationships.set(a, []);
                }
                if (!this.conceptRelationships.has(b)) {
                    this.conceptRelationships.set(b, []);
                }

                this.conceptRelationships.get(a).push({ concept: b, strength: count });
                this.conceptRelationships.get(b).push({ concept: a, strength: count });
            }
        }

        // Sort relationships by strength
        for (const [concept, relations] of this.conceptRelationships.entries()) {
            this.conceptRelationships.set(
                concept,
                relations.sort((a, b) => b.strength - a.strength).slice(0, 5)
            );
        }
    }

    /**
     * Generate a domain glossary with descriptions for key concepts
     */
    generateDomainGlossary() {
        for (const concept of this.domainConcepts.slice(0, this.options.maxTerms)) {
            // Find contexts where this concept appears
            const contexts = [];

            for (const fileDoc of this.fileConceptMapping.values()) {
                // Look for the concept in comments, which may provide definitional context
                for (const comment of fileDoc.comments) {
                    if (comment.includes(concept)) {
                        contexts.push(comment);
                    }
                }

                // Look in documentation as well
                if (fileDoc.documentation && fileDoc.documentation.includes(concept)) {
                    // Get the paragraph containing the concept
                    const paragraphs = fileDoc.documentation.split(/\n\s*\n/);
                    for (const para of paragraphs) {
                        if (para.includes(concept)) {
                            contexts.push(para);
                            break; // Just use the first paragraph for brevity
                        }
                    }
                }
            }

            // Generate a description based on contexts
            let description = "A key concept in this project";

            if (contexts.length > 0) {
                // Use the shortest context that's still substantial
                const substantialContexts = contexts.filter(ctx => ctx.length > concept.length + 10);
                if (substantialContexts.length > 0) {
                    description = substantialContexts.sort((a, b) => a.length - b.length)[0];
                }
            }

            // Add related concepts if available
            const related = this.conceptRelationships.get(concept);
            if (related && related.length > 0) {
                const relatedTerms = related.map(r => r.concept).join(', ');
                description += ` (related to: ${relatedTerms})`;
            }

            this.glossary.set(concept, {
                term: concept,
                description,
                frequency: this.conceptFrequency.get(concept) || 0,
                relatedTerms: (this.conceptRelationships.get(concept) || [])
                    .map(r => r.concept)
            });
        }
    }

    async getProjectFiles(projectDir, ignorePaths) {
        const defaultIgnore = [
          '**/node_modules/**',
          '**/dist/**',
          '**/build/**',
          '**/.git/**',
          '**/*.min.js',
          '**/*.bundle.js'
        ];
        
        const patterns = [
          '**/*.js',
          '**/*.jsx',
          '**/*.ts',
          '**/*.tsx',
          '**/*.md',
          '**/*.txt',
          '**/package.json',
          '**/README*'
        ];
        
        const ignorePatterns = [...defaultIgnore, ...ignorePaths];
        
        let files = await glob(patterns, {
          cwd: projectDir,
          absolute: true,
          ignore: ignorePatterns
        });
        
        // Limit files if needed
        if (this.options.maxFiles && files.length > this.options.maxFiles) {
          console.warn(`Limiting semantic analysis to ${this.options.maxFiles} files out of ${files.length}`);
          files = files.slice(0, this.options.maxFiles);
        }
        
        return files;
      }

    /**
     * Prepare the final analysis results
     */
    prepareResults() {
        return {
            domainConcepts: this.domainConcepts.slice(0, this.options.maxTerms).map(concept => ({
                name: concept,
                frequency: this.conceptFrequency.get(concept) || 0,
                relatedConcepts: (this.conceptRelationships.get(concept) || [])
                    .map(r => ({ name: r.concept, strength: r.strength }))
            })),

            domainGlossary: Array.from(this.glossary.values())
                .sort((a, b) => b.frequency - a.frequency)
                .map(entry => ({
                    term: entry.term,
                    definition: entry.description,
                    relatedTerms: entry.relatedTerms
                })),

            // Add a conceptual model derived from relationships
            conceptualModel: this.generateConceptualModel(),

            // Add file-concept mapping for understanding where concepts are used
            conceptLocations: this.generateConceptLocations()
        };
    }

    /**
     * Generate a conceptual model of the project
     */
    generateConceptualModel() {
        const topConcepts = this.domainConcepts.slice(0, 20);
        const nodes = topConcepts.map(concept => ({
            id: concept,
            label: concept,
            weight: this.conceptFrequency.get(concept) || 1
        }));

        const edges = [];
        for (const concept of topConcepts) {
            const relations = this.conceptRelationships.get(concept) || [];
            for (const relation of relations) {
                if (topConcepts.includes(relation.concept)) {
                    edges.push({
                        source: concept,
                        target: relation.concept,
                        weight: relation.strength
                    });
                }
            }
        }

        return { nodes, edges };
    }

    /**
     * Generate mapping of concepts to file locations
     */
    generateConceptLocations() {
        const result = {};

        for (const concept of this.domainConcepts.slice(0, this.options.maxTerms)) {
            result[concept] = [];

            for (const [filePath, fileDoc] of this.fileConceptMapping.entries()) {
                if (fileDoc.text.includes(concept)) {
                    result[concept].push(filePath);
                }
            }
        }

        return result;
    }

    /**
     * Helper method to split camelCase and snake_case identifiers into words
     */
    splitIdentifierIntoWords(identifier) {
        // First replace snake_case
        const withoutSnake = identifier.replace(/_/g, ' ');

        // Then handle camelCase
        return withoutSnake
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
            .toLowerCase();
    }

    /**
     * Check if a term is a common programming term
     */
    isCommonProgrammingTerm(term) {
        const commonTerms = new Set([
            'function', 'method', 'class', 'object', 'array', 'string', 'number',
            'boolean', 'null', 'undefined', 'async', 'await', 'promise', 'const',
            'let', 'var', 'import', 'export', 'default', 'return', 'true', 'false',
            'require', 'module', 'console', 'log', 'error', 'debug', 'info', 'warn',
            'prototype', 'constructor', 'callback', 'parameter', 'argument', 'property',
            'component', 'props', 'state', 'render', 'handler', 'event'
        ]);

        return commonTerms.has(term.toLowerCase());
    }

    /**
     * Check if an n-gram is significant enough to be a multi-word concept
     */
    isSignificantNgram(ngram) {
        // Skip ngrams with stopwords or common programming terms
        const tokens = ngram.split(' ');
        const stopWords = new Set([
            'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with',
            'by', 'of', 'from', 'as', 'if', 'is', 'are', 'am', 'was', 'were', 'be', 'been'
        ]);

        if (tokens.some(token => stopWords.has(token.toLowerCase()))) {
            return false;
        }

        // If all words are part of our domain concepts, it might be significant
        const allWordsAreConcepts = tokens.every(token =>
            this.conceptFrequency.has(token) && this.conceptFrequency.get(token) > 1
        );

        if (allWordsAreConcepts) {
            return true;
        }

        // Check if it appears multiple times
        let count = 0;
        for (const fileDoc of this.fileConceptMapping.values()) {
            if (fileDoc.text.includes(ngram)) {
                count++;
            }

            if (count >= 2) {
                return true;
            }
        }

        return false;
    }
}

/**
 * Create and configure a semantic analyzer
 */
export async function createSemanticAnalyzer(options = {}) {
    return new SemanticCodeAnalyzer(options);
}

/**
 * Run semantic analysis on a project directory
 */
export async function analyzeProjectSemantics(projectDir, options = {}) {
    const {
      ignorePaths = [],
      includeComments = true,
      includeDocs = true,
      includeIdentifiers = true,
      minTermFrequency = 2,
      maxTerms = 100,
      maxFiles = 1000 // Add this option
    } = options;
    
    const analyzer = await createSemanticAnalyzer({
      includeComments,
      includeDocs,
      includeIdentifiers,
      minTermFrequency,
      maxTerms,
      maxFiles // Pass it to the analyzer
    });
    
    return analyzer.analyzeProject(projectDir, ignorePaths || []);
  }

