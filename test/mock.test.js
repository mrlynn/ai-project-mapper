// test/mock.test.js
import { test } from 'node:test';
import assert from 'node:assert';

// Mock analyzer module
const mockAnalysis = {
  overview: {
    name: 'test-project',
    description: 'A test project',
    version: '1.0.0',
    totalFiles: 3,
    totalDirectories: 2,
    filesByType: {
      javascript: ['src/index.js', 'src/utils.js'],
      markdown: ['README.md']
    },
    mainDirectories: [
      {
        path: '.',
        fileCount: 2
      },
      {
        path: 'src',
        fileCount: 2
      }
    ]
  },
  package: {
    dependencies: {
      'express': '^4.18.2'
    },
    scripts: {
      'start': 'node src/index.js',
      'test': 'node --test'
    },
    type: 'module'
  },
  structure: {
    entryPoints: [
      {
        path: 'src/index.js',
        type: 'main'
      }
    ],
    importantFiles: [
      {
        path: 'src/index.js',
        score: 80
      },
      {
        path: 'src/utils.js',
        score: 60
      }
    ]
  },
  concepts: {
    modules: [
      {
        name: 'src',
        fileCount: 2,
        exports: 2,
        functions: 2
      }
    ],
    keywords: ['test', 'project', 'example']
  },
  fileStats: {
    totalSize: 5000,
    languages: {
      JavaScript: {
        files: 2,
        size: 4000
      },
      Markdown: {
        files: 1,
        size: 1000
      }
    }
  },
  // Add mock semantic analysis data
  semantics: {
    domainConcepts: [
      { 
        name: 'data', 
        frequency: 25, 
        relatedConcepts: [
          { name: 'process', strength: 5 },
          { name: 'test', strength: 3 }
        ]
      },
      { 
        name: 'test', 
        frequency: 20, 
        relatedConcepts: [
          { name: 'project', strength: 4 },
          { name: 'data', strength: 3 }
        ]
      },
      { 
        name: 'project', 
        frequency: 18, 
        relatedConcepts: [
          { name: 'test', strength: 4 },
          { name: 'mapper', strength: 3 }
        ]
      }
    ],
    domainGlossary: [
      {
        term: 'data',
        definition: 'Information processed by the application',
        relatedTerms: ['process', 'test']
      },
      {
        term: 'test',
        definition: 'A test project for project-mapper',
        relatedTerms: ['project', 'data']
      },
      {
        term: 'project',
        definition: 'A software development initiative',
        relatedTerms: ['test', 'mapper']
      }
    ],
    conceptualModel: {
      nodes: [
        { id: 'data', label: 'data', weight: 25 },
        { id: 'test', label: 'test', weight: 20 },
        { id: 'project', label: 'project', weight: 18 }
      ],
      edges: [
        { source: 'data', target: 'process', weight: 5 },
        { source: 'data', target: 'test', weight: 3 },
        { source: 'test', target: 'project', weight: 4 },
        { source: 'project', target: 'mapper', weight: 3 }
      ]
    },
    conceptLocations: {
      'data': ['src/index.js', 'src/utils.js'],
      'test': ['README.md', 'package.json'],
      'project': ['README.md', 'package.json']
    }
  }
};

// Mocked functions
function mockAnalyzeProject() {
  return Promise.resolve(mockAnalysis);
}

function mockAnalyzeProjectSemantics() {
  return Promise.resolve(mockAnalysis.semantics);
}

function mockGenerateKnowledgeTransfer(analysis, options = {}) {
  const { template = 'standard' } = options;
  
  if (template === 'minimal') {
    return Promise.resolve('# Test Project Summary\n\n## Overview\n\nA test project');
  }
  
  return Promise.resolve('# Test Project Knowledge Transfer\n\n## Project Identification\n\n**Name:** test-project');
}

function mockEnhancedKnowledgeTransfer(analysis, options = {}) {
  const { template = 'standard' } = options;
  
  // Start with basic knowledge transfer
  let content = mockGenerateKnowledgeTransfer(analysis, options);
  
  // Add semantic section if semantics data exists
  if (analysis.semantics) {
    content += '\n\n## Semantic Understanding\n\n';
    content += '### Domain Concept Network\n\n';
    content += 'The codebase revolves around these primary concepts and their relationships:\n\n';
    
    // Add top domain concepts
    for (const concept of analysis.semantics.domainConcepts.slice(0, 3)) {
      content += `- **${concept.name}**: `;
      if (concept.relatedConcepts && concept.relatedConcepts.length > 0) {
        const relatedTerms = concept.relatedConcepts
          .slice(0, 2)
          .map(rel => rel.name)
          .join(', ');
        content += `related to ${relatedTerms}`;
      } else {
        content += 'core concept';
      }
      content += '\n';
    }
  }
  
  return Promise.resolve(content);
}

function mockGenerateContextQuestionnaire(analysis) {
  return {
    title: 'Project Context Questionnaire',
    description: 'Your answers will help provide better context to LLMs working with your codebase',
    questions: [
      {
        id: 'projectPurpose',
        question: 'What is the main purpose or goal of this project?',
        context: 'This helps LLMs understand the high-level objective'
      },
      {
        id: 'targetAudience',
        question: 'Who is the intended user or audience for this project?',
        context: 'Understanding the target audience helps contextualize design decisions'
      },
      {
        id: 'concept_data',
        question: 'The term "data" appears frequently in your codebase. Could you explain what it means in your project\'s context?',
        context: 'Domain-specific terminology can have unique meanings in different projects'
      }
    ]
  };
}

// Run the tests
test('mock analyzeProject returns expected structure', async () => {
  const analysis = await mockAnalyzeProject();
  
  assert.ok(analysis, 'Analysis should be created');
  assert.ok(analysis.overview, 'Analysis should have overview');
  assert.strictEqual(analysis.overview.name, 'test-project', 'Project name should match');
  assert.strictEqual(analysis.overview.totalFiles, 3, 'File count should match');
  
  console.log('Mock analyzeProject test passed!');
});

test('mock generateKnowledgeTransfer creates document from analysis', async () => {
  const analysis = await mockAnalyzeProject();
  
  const standard = await mockGenerateKnowledgeTransfer(analysis);
  assert.ok(standard.includes('Test Project Knowledge Transfer'), 'Standard template should be used');
  
  const minimal = await mockGenerateKnowledgeTransfer(analysis, { template: 'minimal' });
  assert.ok(minimal.includes('Test Project Summary'), 'Minimal template should be used');
  
  console.log('Mock generateKnowledgeTransfer test passed!');
});

test('mock end-to-end flow works correctly', async () => {
  const analysis = await mockAnalyzeProject();
  const document = await mockGenerateKnowledgeTransfer(analysis);
  
  assert.ok(analysis, 'Analysis should be created');
  assert.ok(document, 'Document should be created');
  assert.ok(document.includes('test-project'), 'Document should include project name');
  
  console.log('Mock end-to-end flow test passed!');
});

// New tests for semantic analysis functionality
test('mock analyzeProjectSemantics returns expected structure', async () => {
  const semantics = await mockAnalyzeProjectSemantics();
  
  assert.ok(semantics, 'Semantics should be created');
  assert.ok(Array.isArray(semantics.domainConcepts), 'Semantics should have domain concepts array');
  assert.ok(Array.isArray(semantics.domainGlossary), 'Semantics should have domain glossary array');
  assert.ok(semantics.conceptualModel, 'Semantics should have conceptual model');
  assert.ok(semantics.conceptLocations, 'Semantics should have concept locations');
  
  console.log('Mock analyzeProjectSemantics test passed!');
});

test('mock enhancedKnowledgeTransfer includes semantic information', async () => {
  const analysis = await mockAnalyzeProject();
  
  const document = await mockEnhancedKnowledgeTransfer(analysis);
  
  assert.ok(document.includes('Semantic Understanding'), 'Document should include semantic section');
  assert.ok(document.includes('Domain Concept Network'), 'Document should include concept network section');
  assert.ok(document.includes('data'), 'Document should include top concept');
  
  console.log('Mock enhancedKnowledgeTransfer test passed!');
});

test('mock generateContextQuestionnaire creates expected questions', async () => {
  const analysis = await mockAnalyzeProject();
  
  const questionnaire = mockGenerateContextQuestionnaire(analysis);
  
  assert.ok(questionnaire, 'Questionnaire should be created');
  assert.strictEqual(questionnaire.title, 'Project Context Questionnaire', 'Questionnaire should have correct title');
  assert.ok(questionnaire.questions.length >= 3, 'Questionnaire should have at least 3 questions');
  assert.strictEqual(questionnaire.questions[0].id, 'projectPurpose', 'Questionnaire should have project purpose question');
  
  // Check for concept-specific question
  const conceptQuestion = questionnaire.questions.find(q => q.id === 'concept_data');
  assert.ok(conceptQuestion, 'Questionnaire should include question about "data" concept');
  assert.ok(conceptQuestion.question.includes('data'), 'Question should mention the concept');
  
  console.log('Mock generateContextQuestionnaire test passed!');
});