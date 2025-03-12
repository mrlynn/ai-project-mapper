#!/usr/bin/env node

import path from 'path';
import fs from 'fs-extra';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { program } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { analyzeProject } from './analyzer.js';
import { enhancedKnowledgeTransfer, generateContextQuestionnaire } from './knowledge-transfer-enhanced.js';
import { analyzeProjectSemantics } from './semantic-analyzer.js';

// Get the path to package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '..', 'package.json'), 'utf8')
);

// Configure the CLI
program
  .name('project-mapper')
  .description('Generate LLM-friendly project summaries with semantic analysis')
  .version(packageJson.version)
  .argument('[directory]', 'project directory to analyze', '.')
  .option('-o, --output <file>', 'output file path', 'project-knowledge-transfer.md')
  .option('-i, --ignore <patterns...>', 'additional glob patterns to ignore')
  .option('-d, --depth <level>', 'maximum directory depth to analyze', '10')
  .option('-f, --format <format>', 'output format (markdown, json)', 'markdown')
  .option('-t, --template <template>', 'knowledge transfer template to use', 'standard')
  .option('-v, --verbose', 'enable verbose output')
  .option('-s, --semantic', 'enable semantic analysis of code', true)
  .option('--skip-analysis', 'skip code analysis and use existing analysis file')
  .option('--analysis-file <file>', 'path to analysis file', 'project-analysis.json')
  .option('--include-guide', 'include LLM knowledge transfer guide')
  .option('--generate-questionnaire', 'generate a context questionnaire for the project')
  .option('--questionnaire-output <file>', 'output file for the questionnaire', 'project-context-questionnaire.md')
  .option('--include-context <file>', 'include context from a JSON file with developer responses')
  .option('--max-files <number>', 'maximum number of files to analyze semantically', '500')
  .option('--skip-semantics', 'skip semantic analysis to reduce memory usage')
  .option('--light-analysis', 'perform lighter analysis for very large projects')
  .option('--max-files <number>', 'maximum number of files to analyze semantically', '200');

program.parse(process.argv);

const options = program.opts();
const projectDir = path.resolve(program.args[0] || '.');

async function main() {
  const spinner = ora('Analyzing project...').start();

  try {
    // Determine paths
    const outputPath = path.resolve(options.output);
    const analysisPath = path.resolve(options.analysisFile);

    // Handle analysis
    let analysis;

    if (options.skipAnalysis && await fs.pathExists(analysisPath)) {
      spinner.text = 'Loading existing analysis...';
      analysis = await fs.readJson(analysisPath);
      spinner.succeed('Loaded existing analysis');
    } else {
      spinner.text = 'Analyzing project structure...';

      // Configure analysis options
      const analysisOptions = {
        depth: parseInt(options.depth, 10),
        ignorePaths: options.ignore || [],
        verbose: options.verbose
      };

      // Run the analysis
      analysis = await analyzeProject(projectDir, analysisOptions);

      // Save the analysis
      await fs.writeJson(analysisPath, analysis, { spaces: 2 });
      spinner.succeed('Project analysis completed');
    }

    // Add semantic analysis if enabled
    if (options.semantic) {
      spinner.text = 'Running semantic analysis...';
      spinner.start();
    
      try {
        // Configure semantic options
        const semanticOptions = {
          ignorePaths: options.ignore || [],
          includeComments: true,
          includeDocs: true,
          includeIdentifiers: true,
          minTermFrequency: 2,
          maxTerms: 50,
          maxFiles: parseInt(options.maxFiles, 10) // Add max files option
        };
    
        analysis.semantics = await analyzeProjectSemantics(projectDir, semanticOptions);
        spinner.succeed('Semantic analysis completed');
      } catch (error) {
        spinner.warn(`Semantic analysis failed: ${error.message}. Continuing without semantic data.`);
        // Provide empty semantics object to prevent undefined errors
        analysis.semantics = {
          domainConcepts: [],
          domainGlossary: [],
          conceptualModel: { nodes: [], edges: [] },
          conceptLocations: {}
        };
      }
    }

    // Load developer context if provided
    if (options.includeContext) {
      spinner.text = 'Loading developer context...';
      try {
        const contextPath = path.resolve(options.includeContext);
        if (await fs.pathExists(contextPath)) {
          const context = await fs.readJson(contextPath);
          analysis.developerContext = context;
          spinner.succeed('Loaded developer context');
        } else {
          spinner.warn('Developer context file not found');
        }
      } catch (error) {
        spinner.warn(`Failed to load developer context: ${error.message}`);
      }
    }

    if (!options.skipSemantics) {
      spinner.text = 'Running semantic analysis...';
      spinner.start();
    
      try {
        // Configure semantic options with memory limits
        const semanticOptions = {
          ignorePaths: options.ignore || [],
          includeComments: true,
          includeDocs: true,
          includeIdentifiers: true,
          minTermFrequency: 2,
          maxTerms: 50,
          maxFiles: parseInt(options.maxFiles, 10)
        };
    
        analysis.semantics = await analyzeProjectSemantics(projectDir, semanticOptions);
        spinner.succeed('Semantic analysis completed');
      } catch (error) {
        spinner.warn(`Semantic analysis failed: ${error.message}. Continuing without semantic data.`);
      }
    } else {
      spinner.info('Semantic analysis skipped');
    }

    // Generate knowledge transfer document
    spinner.text = 'Generating knowledge transfer document...';
    spinner.start();

    const knowledgeTransferOptions = {
      projectName: path.basename(projectDir),
      template: options.template,
      format: options.format,
      includeGuide: options.includeGuide,
      projectDir: projectDir,
      ignorePaths: options.ignore || []
    };

    const knowledgeTransfer = await enhancedKnowledgeTransfer(analysis, knowledgeTransferOptions);

    // Write output based on format
    if (options.format === 'json') {
      // Ensure we have a valid object to write
      const validContent = knowledgeTransfer && typeof knowledgeTransfer === 'object' 
        ? knowledgeTransfer 
        : { content: String(knowledgeTransfer || ''), sections: [] };
        
      await fs.writeJson(outputPath, validContent, { spaces: 2 });
    } else {
      // Ensure we have a valid string to write
      const content = knowledgeTransfer && knowledgeTransfer.content
        ? knowledgeTransfer.content
        : String(knowledgeTransfer || '');
        
      await fs.writeFile(outputPath, content);
    }

    spinner.succeed(`Knowledge transfer document generated: ${chalk.green(outputPath)}`);

    // Generate questionnaire if requested
    if (options.generateQuestionnaire) {
      spinner.text = 'Generating context questionnaire...';
      spinner.start();

      try {
        // Generate questionnaire
        const questionnaire = generateContextQuestionnaire(analysis);
        const questionnairePath = path.resolve(options.questionnaireOutput);

        // Format as markdown (add debugging)
        console.log("Formatting questionnaire...");
        let questionnaireContent = `# ${questionnaire.title}\n\n`;
        questionnaireContent += `${questionnaire.description}\n\n`;

        for (const q of questionnaire.questions) {
          questionnaireContent += `## ${q.question}\n\n`;
          questionnaireContent += `*${q.context}*\n\n`;
          questionnaireContent += `Your answer: *(fill in here)*\n\n---\n\n`;
        }

        console.log(`Writing questionnaire to ${questionnairePath}`);
        console.log(`Content length: ${questionnaireContent.length} characters`);

        // Write to file with explicit encoding
        await fs.writeFile(questionnairePath, questionnaireContent, 'utf8');

        spinner.succeed(`Context questionnaire generated: ${chalk.green(questionnairePath)}`);
      } catch (error) {
        spinner.fail(`Error generating questionnaire: ${error.message}`);
        console.error(error);
      }
    }

  } catch (error) {
    spinner.fail(`Error: ${error.message}`);
    try {
      const fallbackContent = `# ${path.basename(projectDir)} Knowledge Transfer\n\nError generating full document. Project analysis completed, but document generation failed.\n\nError: ${error.message}`;
      await fs.writeFile(outputPath, fallbackContent);
      console.log(`Fallback document written to: ${outputPath}`);
    } catch (writeError) {
      console.error(`Could not write fallback document: ${writeError.message}`);
    }
    if (options.verbose) {
      console.error(error);
    }

    process.exit(1);
  }
}

main();