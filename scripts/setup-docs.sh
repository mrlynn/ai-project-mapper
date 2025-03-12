#!/bin/bash
# Set up Docusaurus for Project Mapper documentation

# Create docs directory if it doesn't exist
mkdir -p docs

# Initialize Docusaurus
npx create-docusaurus@latest docs classic --typescript

# Navigate to docs directory
cd docs

# Update package.json with required scripts
cat > package.json << EOF
{
  "name": "project-mapper-docs",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "docusaurus": "docusaurus",
    "start": "docusaurus start",
    "build": "docusaurus build",
    "swizzle": "docusaurus swizzle",
    "deploy": "docusaurus deploy",
    "clear": "docusaurus clear",
    "serve": "docusaurus serve",
    "write-translations": "docusaurus write-translations",
    "write-heading-ids": "docusaurus write-heading-ids"
  },
  "dependencies": {
    "@docusaurus/core": "^2.4.1",
    "@docusaurus/preset-classic": "^2.4.1",
    "@mdx-js/react": "^1.6.22",
    "clsx": "^1.2.1",
    "prism-react-renderer": "^1.3.5",
    "react": "^17.0.2",
    "react-dom": "^17.0.2"
  },
  "devDependencies": {
    "@docusaurus/module-type-aliases": "^2.4.1",
    "@tsconfig/docusaurus": "^1.0.7",
    "typescript": "^4.9.5"
  },
  "browserslist": {
    "production": [
      ">0.5%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "engines": {
    "node": ">=16.14"
  }
}
EOF

# Create initial documentation structure
mkdir -p docs/getting-started
mkdir -p docs/user-guide
mkdir -p docs/api-reference
mkdir -p docs/templates
mkdir -p docs/advanced-usage
mkdir -p docs/troubleshooting
mkdir -p docs/contributing

# Create category files for sidebar organization
echo '---
sidebar_position: 1
---

# Getting Started

Learn how to get started with Project Mapper in minutes.
' > docs/getting-started/_category_.json

echo '---
sidebar_position: 2
---

# User Guide

Learn how to use Project Mapper effectively.
' > docs/user-guide/_category_.json

echo '---
sidebar_position: 3
---

# API Reference

Explore the programmatic API of Project Mapper.
' > docs/api-reference/_category_.json

echo '---
sidebar_position: 4
---

# Templates

Understand the different templates available in Project Mapper.
' > docs/templates/_category_.json

echo '---
sidebar_position: 5
---

# Advanced Usage

Learn advanced techniques for using Project Mapper.
' > docs/advanced-usage/_category_.json

echo '---
sidebar_position: 6
---

# Troubleshooting

Common issues and their solutions.
' > docs/troubleshooting/_category_.json

echo '---
sidebar_position: 7
---

# Contributing

How to contribute to Project Mapper.
' > docs/contributing/_category_.json

echo "Docusaurus setup complete! Navigate to the docs directory and run 'npm start' to preview your documentation."