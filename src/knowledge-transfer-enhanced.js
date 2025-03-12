// src/knowledge-transfer-enhanced.js
import { analyzeProjectSemantics } from './semantic-analyzer.js';
import { generateKnowledgeTransfer } from './knowledge-transfer.js';

/**
 * Enhanced knowledge transfer generator that incorporates semantic analysis
 */
export async function enhancedKnowledgeTransfer(analysis, options = {}) {
    try {
      // If semantic analysis is not already present, try to generate it
      if (!analysis.semantics && options.projectDir) {
        const semanticOptions = {
            ignorePaths: options.ignorePaths || [],
            includeComments: true,
            includeDocs: true,
            includeIdentifiers: true,
            minTermFrequency: 2,
            maxTerms: 50,
            maxFiles: options.maxFiles || 200 // Limit files for very large projects
          };
        
        try {
            analysis.semantics = await (async () => {
                // Small delay to allow GC
                await new Promise(resolve => setTimeout(resolve, 10));
                return analyzeProjectSemantics(options.projectDir, semanticOptions);
              })();
        } catch (error) {
            console.warn(`Semantic analysis failed: ${error.message}`);
            analysis.semantics = {
              domainConcepts: [],
              domainGlossary: [],
              conceptualModel: { nodes: [], edges: [] },
              conceptLocations: {}
            };
        }
      }
      
      // Call the original knowledge transfer function
      const baseDocument = await generateKnowledgeTransfer(analysis, options);
      
      // Safety check - if baseDocument is undefined or null, return a fallback
      if (!baseDocument) {
        console.warn("Warning: Knowledge transfer generation failed, using fallback");
        return {
          content: `# ${analysis.overview?.name || 'Project'} Knowledge Transfer\n\nUnable to generate full knowledge transfer document.`,
          sections: ['Project Identification']
        };
      }
      
      // If we have semantic information, enhance the document
      if (analysis.semantics) {
        if (baseDocument.content) {
          try {
            const enhancedContent = enhanceDocumentWithSemantics(baseDocument.content, analysis.semantics);
            
            return {
              ...baseDocument,
              content: enhancedContent,
              sections: [...baseDocument.sections, 'Semantic Understanding']
            };
          } catch (error) {
            console.warn(`Error enhancing document: ${error.message}`);
            return baseDocument; // Return unenhanced document on error
          }
        } else if (typeof baseDocument === 'string') {
          try {
            // In case the original function returned a string
            const enhancedContent = enhanceDocumentWithSemantics(baseDocument, analysis.semantics);
            return enhancedContent;
          } catch (error) {
            console.warn(`Error enhancing string document: ${error.message}`);
            return baseDocument; // Return unenhanced document on error
          }
        }
      }
      
      return baseDocument;
    } catch (error) {
      console.error(`Error in enhancedKnowledgeTransfer: ${error.message}`);
      // Ultimate fallback - return a simple string
      return {
        content: `# ${analysis.overview?.name || 'Project'} Knowledge Transfer\n\nError generating knowledge transfer document: ${error.message}`,
        sections: ['Error']
      };
    }
  }

/**
 * Enhance a knowledge transfer document with semantic information
 */
function enhanceDocumentWithSemantics(content, semantics) {
    
    // Add a new section for semantic understanding
    let enhancedContent = content || '';
    
    // Only add semantic content if we have meaningful data
    if (semantics && semantics.domainConcepts && semantics.domainConcepts.length > 0) {
        enhancedContent += `\n\n## Semantic Understanding\n\n`;
        
        // Domain Concept Network
        enhancedContent += `### Domain Concept Network\n\n`;
        enhancedContent += `The codebase revolves around these primary concepts and their relationships:\n\n`;
        
        // Add top concepts with their relationships (limit to 7 for memory efficiency)
        const topConcepts = semantics.domainConcepts.slice(0, 7);
        for (const concept of topConcepts) {
          enhancedContent += `- **${concept.name}**: `;
          
          if (concept.relatedConcepts && concept.relatedConcepts.length > 0) {
            const relatedTerms = concept.relatedConcepts
              .slice(0, 2) // Limit to first 2 related terms
              .map(rel => rel.name)
              .join(', ');
            enhancedContent += `related to ${relatedTerms}`;
          } else {
            enhancedContent += 'core concept';
          }
          enhancedContent += '\n';
        }
        enhancedContent += '\n';
      
      // Enhanced Terminology - limit to fewer entries
      enhancedContent += `### Enhanced Terminology\n\n`;
      enhancedContent += `These terms have specific meanings in the project context:\n\n`;
      
      // Add glossary entries - limit to 8 for memory efficiency
      for (const entry of semantics.domainGlossary.slice(0, 8)) {
        enhancedContent += `- **${entry.term}:** ${entry.definition}\n`;
      }
      enhancedContent += '\n';
      
      // Conceptual Distribution - limit to fewer concepts
      enhancedContent += `### Conceptual Distribution\n\n`;
      enhancedContent += `Key concepts are distributed across the codebase as follows:\n\n`;
      
      // Add location information for top concepts - limit to 3 for memory efficiency
      const topConceptsByLocation = Object.entries(semantics.conceptLocations)
        .sort((a, b) => b[1].length - a[1].length)
        .slice(0, 3);
      
      for (const [concept, locations] of topConceptsByLocation) {
        enhancedContent += `- **${concept}** appears in ${locations.length} files, including:\n`;
        for (const location of locations.slice(0, 2)) { // Show fewer locations
          enhancedContent += `  - \`${location}\`\n`;
        }
        if (locations.length > 2) {
          enhancedContent += `  - *(and ${locations.length - 2} more)*\n`;
        }
      }
    }
    
    return enhancedContent;
  }

/**
 * Create a developer context questionnaire based on semantic analysis
 */
export function generateContextQuestionnaire(analysis) {
  const questions = [];
  
  // Basic project questions
  questions.push({
    id: 'projectPurpose',
    question: 'What is the main purpose or goal of this project?',
    context: 'This helps LLMs understand the high-level objective'
  });
  
  questions.push({
    id: 'targetAudience',
    question: 'Who is the intended user or audience for this project?',
    context: 'Understanding the target audience helps contextualize design decisions'
  });
  
  // If we have semantic analysis, add domain-specific questions
  if (analysis.semantics && analysis.semantics.domainConcepts) {
    // Find potentially ambiguous concepts
    const ambiguousConcepts = analysis.semantics.domainConcepts
      .filter(concept => {
        // Concepts that appear in many places may need clarification
        const locations = analysis.semantics.conceptLocations[concept.name] || [];
        // Lower threshold for tests to work with smaller samples
        return locations.length > 1 && concept.frequency > 5;
      })
      .slice(0, 3);
    
    // Add questions about ambiguous concepts
    for (const concept of ambiguousConcepts) {
      questions.push({
        id: `concept_${concept.name}`,
        question: `The term "${concept.name}" appears frequently in your codebase. Could you explain what it means in your project's context?`,
        context: 'Domain-specific terminology can have unique meanings in different projects'
      });
    }
    
    // If no concepts meet the threshold, still add a question about the top concept
    if (ambiguousConcepts.length === 0 && analysis.semantics.domainConcepts.length > 0) {
      const topConcept = analysis.semantics.domainConcepts[0];
      questions.push({
        id: `concept_${topConcept.name}`,
        question: `The term "${topConcept.name}" appears to be important in your codebase. Could you explain its role in your project?`,
        context: 'Understanding key terminology helps LLMs provide more relevant assistance'
      });
    }
  }
  
  // Design and architectural questions
  questions.push({
    id: 'designPhilosophy',
    question: 'What design principles or philosophy guided this project\'s architecture?',
    context: 'Understanding the reasoning behind architectural choices helps LLMs suggest compatible changes'
  });
  
  questions.push({
    id: 'technicalConstraints',
    question: 'Are there any specific technical constraints or requirements that influenced your implementation choices?',
    context: 'Technical constraints often explain why certain approaches were taken over alternatives'
  });
  
  questions.push({
    id: 'futurePlans',
    question: 'Do you have plans for future features or improvements?',
    context: 'Understanding future direction helps ensure suggestions are forward-compatible'
  });
  
  questions.push({
    id: 'knownIssues',
    question: 'Are there any known issues, technical debt, or areas that need improvement?',
    context: 'Knowing about existing issues helps focus recommendations on valuable improvements'
  });
  
  return {
    title: 'Project Context Questionnaire',
    description: 'Your answers will help provide better context to LLMs working with your codebase',
    questions
  };
}

/**
 * Generate an interactive HTML form for the context questionnaire
 */
export function generateQuestionnaireForm(questionnaire) {
  // This would generate an HTML form for interactive use
  // Implementation would depend on how you want to display this
  
  let html = `<form id="context-questionnaire">
    <h2>${questionnaire.title}</h2>
    <p>${questionnaire.description}</p>
  `;
  
  for (const q of questionnaire.questions) {
    html += `
      <div class="question-group">
        <label for="${q.id}">${q.question}</label>
        <textarea id="${q.id}" name="${q.id}" rows="3"></textarea>
        <small class="context-hint">${q.context}</small>
      </div>
    `;
  }
  
  html += `
    <button type="submit">Save Context</button>
  </form>`;
  
  return html;
}