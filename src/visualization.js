// src/visualization.js
import fs from 'fs-extra';
import path from 'path';

/**
 * Generate a visual representation of the concept network
 * as an SVG diagram embedded in markdown
 */
export function generateConceptNetworkVisualization(semantics, options = {}) {
  const {
    width = 800,
    height = 600,
    maxNodes = 25,
    minNodeSize = 5,
    maxNodeSize = 25,
    colorPalette = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c']
  } = options;
  
  if (!semantics || !semantics.conceptualModel) {
    return '';
  }
  
  const { nodes, edges } = semantics.conceptualModel;
  
  // Limit to the top N nodes by weight
  const topNodes = [...nodes]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, maxNodes);
  
  const topNodeIds = new Set(topNodes.map(n => n.id));
  
  // Only include edges between top nodes
  const relevantEdges = edges.filter(edge => 
    topNodeIds.has(edge.source) && topNodeIds.has(edge.target)
  );
  
  // Simple force-directed layout simulation
  // In a real implementation, use a proper force-directed layout algorithm
  const nodePositions = calculateNodePositions(topNodes, relevantEdges, width, height);
  
  // Generate SVG
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n`;
  
  // Add a subtle grid background
  svg += `  <defs>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="white"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  
  <g id="edges">
`;
  
  // Draw edges
  for (const edge of relevantEdges) {
    const source = nodePositions[edge.source];
    const target = nodePositions[edge.target];
    
    if (source && target) {
      // Calculate edge weight for thickness
      const weight = Math.max(1, Math.min(5, edge.weight / 2));
      
      svg += `    <line x1="${source.x}" y1="${source.y}" x2="${target.x}" y2="${target.y}" 
        stroke="#999" stroke-width="${weight}" stroke-opacity="0.6" />
`;
    }
  }
  
  svg += `  </g>
  
  <g id="nodes">
`;
  
  // Draw nodes
  for (const node of topNodes) {
    const pos = nodePositions[node.id];
    if (!pos) continue;
    
    // Calculate node size based on weight
    const nodeWeight = node.weight;
    const maxWeight = Math.max(...topNodes.map(n => n.weight));
    const size = minNodeSize + (maxNodeSize - minNodeSize) * (nodeWeight / maxWeight);
    
    // Assign a color from the palette
    const colorIndex = topNodes.indexOf(node) % colorPalette.length;
    const color = colorPalette[colorIndex];
    
    svg += `    <circle cx="${pos.x}" cy="${pos.y}" r="${size}" fill="${color}" stroke="#fff" stroke-width="1.5">
      <title>${node.label} (weight: ${nodeWeight})</title>
    </circle>
    <text x="${pos.x}" y="${pos.y + size + 10}" text-anchor="middle" font-family="Arial" font-size="10" fill="#333">
      ${node.label}
    </text>
`;
  }
  
  svg += `  </g>
</svg>`;

  return svg;
}

/**
 * Calculate node positions using a simplified force-directed layout algorithm
 */
function calculateNodePositions(nodes, edges, width, height) {
  const positions = {};
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.4;
  
  // Initialize positions in a circle
  nodes.forEach((node, i) => {
    const angle = (i / nodes.length) * 2 * Math.PI;
    positions[node.id] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });
  
  // This is a very simplified layout - in a real implementation,
  // you would use a proper force-directed layout algorithm with
  // multiple iterations and physics simulation
  
  return positions;
}

/**
 * Export the concept network as a d3.js compatible HTML file
 */
export async function exportInteractiveConceptNetwork(semantics, outputPath) {
  if (!semantics || !semantics.conceptualModel) {
    return false;
  }
  
  const { nodes, edges } = semantics.conceptualModel;
  
  // Create a simplified JSON representation for D3
  const graphData = {
    nodes: nodes.map(node => ({
      id: node.id,
      label: node.label,
      weight: node.weight
    })),
    links: edges.map(edge => ({
      source: edge.source,
      target: edge.target,
      weight: edge.weight
    }))
  };
  
  // Create an HTML file with embedded D3.js visualization
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Project Concept Network</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background: #f8f9fa;
    }
    #visualization {
      width: 100vw;
      height: 100vh;
      background: white;
    }
    .node {
      stroke: #fff;
      stroke-width: 1.5px;
    }
    .link {
      stroke: #999;
      stroke-opacity: 0.6;
    }
    .node text {
      pointer-events: none;
      font-size: 10px;
    }
    .controls {
      position: absolute;
      top: 10px;
      left: 10px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 4px;
      padding: 10px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .controls h3 {
      margin-top: 0;
    }
  </style>
</head>
<body>
  <div id="visualization"></div>
  <div class="controls">
    <h3>Project Concept Network</h3>
    <div>
      <label for="nodeSize">Node Size:</label>
      <input id="nodeSize" type="range" min="1" max="10" value="5" />
    </div>
    <div>
      <label for="linkStrength">Link Strength:</label>
      <input id="linkStrength" type="range" min="1" max="10" value="5" />
    </div>
  </div>
  
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <script>
    // Graph data
    const graph = ${JSON.stringify(graphData, null, 2)};
    
    // D3 visualization code
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Create SVG
    const svg = d3.select('#visualization')
      .append('svg')
      .attr('width', width)
      .attr('height', height);
      
    // Create a background grid pattern
    const defs = svg.append('defs');
    const grid = defs.append('pattern')
      .attr('id', 'grid')
      .attr('width', 20)
      .attr('height', 20)
      .attr('patternUnits', 'userSpaceOnUse');
      
    grid.append('path')
      .attr('d', 'M 20 0 L 0 0 0 20')
      .attr('fill', 'none')
      .attr('stroke', '#f0f0f0')
      .attr('stroke-width', 1);
      
    svg.append('rect')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('fill', 'white');
      
    svg.append('rect')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('fill', 'url(#grid)');
    
    // Create force simulation
    const simulation = d3.forceSimulation(graph.nodes)
      .force('link', d3.forceLink(graph.links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));
    
    // Create links
    const link = svg.append('g')
      .selectAll('line')
      .data(graph.links)
      .enter().append('line')
      .attr('class', 'link')
      .attr('stroke-width', d => Math.sqrt(d.weight));
    
    // Color scale for nodes
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    
    // Create node groups
    const node = svg.append('g')
      .selectAll('.node')
      .data(graph.nodes)
      .enter().append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));
    
    // Add circles to nodes
    node.append('circle')
      .attr('r', d => 5 + d.weight / 2)
      .attr('fill', (d, i) => color(i % 10));
    
    // Add labels to nodes
    node.append('text')
      .attr('dx', 12)
      .attr('dy', '.35em')
      .text(d => d.label);
    
    // Add titles for tooltips
    node.append('title')
      .text(d => \`\${d.label} (weight: \${d.weight})\`);
    
    // Update positions on each tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      
      node.attr('transform', d => \`translate(\${d.x},\${d.y})\`);
    });
    
    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    // Controls
    document.getElementById('nodeSize').addEventListener('input', function() {
      const value = this.value;
      node.selectAll('circle')
        .attr('r', d => value * (1 + d.weight / 10));
    });
    
    document.getElementById('linkStrength').addEventListener('input', function() {
      const value = this.value / 10;
      simulation.force('link').strength(value);
      simulation.alpha(0.3).restart();
    });
  </script>
</body>
</html>`;

  // Write the HTML file
  await fs.writeFile(outputPath, html);
  return true;
}

/**
 * Convert the concept model to a Mermaid.js diagram format
 * that can be embedded in markdown
 */
export function generateMermaidConceptDiagram(semantics, options = {}) {
  const { maxNodes = 15, maxEdgesPerNode = 3 } = options;
  
  if (!semantics || !semantics.conceptualModel) {
    return '';
  }
  
  const { nodes, edges } = semantics.conceptualModel;
  
  // Limit to top nodes by weight
  const topNodes = [...nodes]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, maxNodes);
    
  const topNodeIds = new Set(topNodes.map(n => n.id));
  
  // Filter edges - only keep the strongest connections for each node
  const nodeEdges = new Map();
  
  for (const node of topNodes) {
    const nodeId = node.id;
    const relevantEdges = edges
      .filter(edge => 
        (edge.source === nodeId && topNodeIds.has(edge.target)) ||
        (edge.target === nodeId && topNodeIds.has(edge.source))
      )
      .sort((a, b) => b.weight - a.weight)
      .slice(0, maxEdgesPerNode);
      
    nodeEdges.set(nodeId, relevantEdges);
  }
  
  // Create Mermaid diagram
  let mermaid = 'graph TD\n';
  
  // Add nodes
  for (const node of topNodes) {
    // Sanitize node id for Mermaid
    const nodeId = sanitizeMermaidId(node.id);
    mermaid += `  ${nodeId}["${node.label}"]\n`;
  }
  
  // Add edges - deduplicating as we go
  const processedEdges = new Set();
  
  for (const [nodeId, edges] of nodeEdges.entries()) {
    for (const edge of edges) {
      const source = edge.source;
      const target = edge.target;
      
      // Create a unique edge identifier
      const edgeId = source < target ? 
        `${source}--${target}` : 
        `${target}--${source}`;
        
      // Skip if we've already processed this edge
      if (processedEdges.has(edgeId)) continue;
      processedEdges.add(edgeId);
      
      // Sanitize ids
      const sourceId = sanitizeMermaidId(source);
      const targetId = sanitizeMermaidId(target);
      
      // Add the edge
      mermaid += `  ${sourceId} --- ${targetId}\n`;
    }
  }
  
  return mermaid;
}

/**
 * Sanitize a string to be used as a Mermaid.js node id
 */
function sanitizeMermaidId(id) {
  // Replace spaces and special characters
  return `node_${id.replace(/[^a-zA-Z0-9]/g, '_')}`;
}

/**
 * Generate a heatmap visualization of concept distribution across files
 */
export function generateConceptDistributionHeatmap(semantics, options = {}) {
  const { maxConcepts = 10, maxFiles = 15 } = options;
  
  if (!semantics || !semantics.conceptLocations) {
    return '';
  }
  
  // Get top concepts by frequency
  const concepts = Object.keys(semantics.conceptLocations)
    .map(concept => ({
      name: concept,
      files: semantics.conceptLocations[concept] || [],
      count: semantics.conceptLocations[concept]?.length || 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, maxConcepts);
  
  // Find most relevant files (those that contain multiple concepts)
  const fileCounts = new Map();
  
  for (const concept of concepts) {
    for (const file of concept.files) {
      fileCounts.set(file, (fileCounts.get(file) || 0) + 1);
    }
  }
  
  const topFiles = Array.from(fileCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxFiles)
    .map(([file]) => file);
  
  // Generate the heatmap as an HTML table
  let html = `<table class="concept-heatmap">
  <thead>
    <tr>
      <th>File / Concept</th>
`;
  
  // Add concept headers
  for (const concept of concepts) {
    html += `      <th>${concept.name}</th>\n`;
  }
  
  html += `    </tr>
  </thead>
  <tbody>
`;
  
  // Add rows for each file
  for (const file of topFiles) {
    html += `    <tr>
      <td>${file}</td>
`;
    
    // Check which concepts are present in this file
    for (const concept of concepts) {
      const present = concept.files.includes(file);
      
      if (present) {
        html += `      <td class="present">✓</td>\n`;
      } else {
        html += `      <td class="absent"></td>\n`;
      }
    }
    
    html += `    </tr>\n`;
  }
  
  html += `  </tbody>
</table>

<style>
.concept-heatmap {
  border-collapse: collapse;
  width: 100%;
  font-family: Arial, sans-serif;
  font-size: 14px;
}
.concept-heatmap th, .concept-heatmap td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
.concept-heatmap th {
  background-color: #f2f2f2;
  font-weight: bold;
}
.concept-heatmap tr:nth-child(even) {
  background-color: #f9f9f9;
}
.concept-heatmap td.present {
  background-color: #c8e6c9;
  color: #2e7d32;
}
.concept-heatmap td:first-child {
  text-align: left;
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>`;
  
  return html;
}