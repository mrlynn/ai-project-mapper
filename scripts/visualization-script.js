/* # First generate the project analysis
project-mapper --analysis-file project-analysis.json

# Then use the programmatic API to generate the visualization
# You can create a simple script like this:

*/
// visualization-script.js
import { analyzeProjectSemantics, exportInteractiveConceptNetwork } from 'project-mapper';
import fs from 'fs-extra';

async function generateVisualization() {
  // Load the analysis file
  const analysis = await fs.readJson('./project-analysis.json');
  
  // Generate or use existing semantic analysis
  if (!analysis.semantics) {
    analysis.semantics = await analyzeProjectSemantics('.');
  }
  
  // Export the interactive visualization
  await exportInteractiveConceptNetwork(analysis.semantics, 'concept-network.html');
  console.log('Interactive visualization generated: concept-network.html');
}

generateVisualization();