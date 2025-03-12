// Save this as debug-cli.js
import { analyzeProject } from './src/analyzer.js';
import { generateKnowledgeTransfer } from './src/knowledge-transfer.js';
import { analyzeProjectSemantics } from './src/semantic-analyzer.js';
import { enhancedKnowledgeTransfer, generateContextQuestionnaire } from './src/knowledge-transfer-enhanced.js';
import path from 'path';
import fs from 'fs-extra';

async function debugOperation() {
  try {
    console.log("Step 1: Analyzing project...");
    const analysis = await analyzeProject('.');
    console.log("Project analysis completed successfully");
    
    console.log("\nStep 2: Running semantic analysis...");
    const semantics = await analyzeProjectSemantics('.');
    console.log("Semantic analysis completed successfully");
    
    console.log("\nStep 3: Generating regular knowledge transfer...");
    const basicTransfer = await generateKnowledgeTransfer(analysis);
    console.log("Basic knowledge transfer completed successfully");
    
    console.log("\nStep 4: Generating enhanced knowledge transfer...");
    const analysisWithSemantics = { ...analysis, semantics };
    const enhancedTransfer = await enhancedKnowledgeTransfer(analysisWithSemantics);
    console.log("Enhanced knowledge transfer completed successfully");
    
    console.log("\nStep 5: Generating questionnaire...");
    const questionnaire = generateContextQuestionnaire(analysisWithSemantics);
    console.log("Questionnaire generated successfully");
    
    console.log("\nStep 6: Writing questionnaire to file...");
    const questionnaireContent = formatQuestionnaire(questionnaire);
    await fs.writeFile('debug-questionnaire.md', questionnaireContent, 'utf8');
    console.log("Questionnaire file written successfully");
    
    console.log("\nAll steps completed without errors!");
  } catch (error) {
    console.error(`\nERROR: ${error.message}`);
    console.error(error.stack);
  }
}

function formatQuestionnaire(questionnaire) {
  let content = `# ${questionnaire.title || 'Project Context Questionnaire'}\n\n`;
  content += `${questionnaire.description || 'No description provided.'}\n\n`;
  
  if (questionnaire.questions && Array.isArray(questionnaire.questions)) {
    for (const q of questionnaire.questions) {
      content += `## ${q.question || 'Question'}\n\n`;
      content += `*${q.context || 'No context provided.'}*\n\n`;
      content += `Your answer: *(fill in here)*\n\n---\n\n`;
    }
  } else {
    content += "No questions available.";
  }
  
  return content;
}

debugOperation();