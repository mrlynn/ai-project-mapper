// src/index.js
import { analyzeProject } from './analyzer.js';
import { generateKnowledgeTransfer } from './knowledge-transfer.js';

/**
 * Generate a complete project map including analysis and knowledge transfer
 * @param {string} inputDir - Directory to analyze
 * @param {object} options - Configuration options
 * @returns {Promise<object>} Project map with analysis and knowledge transfer
 */
export async function generateProjectMap(inputDir, options = {}) {
  // Run analysis
  const analysis = await analyzeProject(inputDir, options);
  
  // Generate knowledge transfer
  const knowledgeTransfer = await generateKnowledgeTransfer(analysis, {
    projectName: options.projectName || analysis.overview.name,
    template: options.template || 'standard',
    format: options.format || 'markdown',
    includeGuide: options.includeGuide || false
  });
  
  return {
    analysis,
    knowledgeTransfer
  };
}

// Export existing functions
export { analyzeProject } from './analyzer.js';
export { generateKnowledgeTransfer } from './knowledge-transfer.js';

// Export new semantic analysis functions
export { analyzeProjectSemantics } from './semantic-analyzer.js';
export { 
  enhancedKnowledgeTransfer,
  generateContextQuestionnaire
} from './knowledge-transfer-enhanced.js';

// Export visualization functions
export { 
  generateConceptNetworkVisualization,
  exportInteractiveConceptNetwork,
  generateMermaidConceptDiagram,
  generateConceptDistributionHeatmap
} from './visualization.js';