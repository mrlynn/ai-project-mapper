#!/bin/bash
# Guide for publishing project-mapper to npm

# Set text colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Project Mapper Publication Guide ===${NC}\n"

echo -e "${YELLOW}Step 1: Ensure you're logged in to npm${NC}"
echo "Run: npm login"
echo -e "This will prompt for your npm username, password, and email\n"

echo -e "${YELLOW}Step 2: Verify package contents${NC}"
echo "Run: npm pack"
echo -e "This will create a tarball that you can inspect to verify the package contents\n"

echo -e "${YELLOW}Step 3: Test the package locally${NC}"
echo "Run: npm link"
echo -e "This will create a symlink to your package globally. Test it by running 'project-mapper' in a different project directory\n"

echo -e "${YELLOW}Step 4: Publish to npm${NC}"
echo "When you're ready to publish:"
echo "Run: npm publish"
echo -e "This will publish your package to the npm registry\n"

echo -e "${YELLOW}Step 5: Verify publication${NC}"
echo "After publishing, verify it's available:"
echo -e "Run: npm view project-mapper\n"

echo -e "${GREEN}Notes:${NC}"
echo "- Your initial publication will create the package on npm"
echo "- For subsequent updates, use 'npm version patch|minor|major' to update the version"
echo "  followed by 'npm publish'"
echo "- Remember to update the CHANGELOG.md for each new version"

echo -e "\n${BLUE}Happy publishing!${NC}"