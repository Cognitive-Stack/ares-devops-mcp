# TypeScript Project Fixes Guide

This guide covers common issues and their fixes for TypeScript projects, particularly when publishing as NPM packages.

## 1. Strict Mode Issues

### Adding "use strict"
Add `"use strict";` after the shebang (if exists) in all TypeScript files:

```typescript
#!/usr/bin/env node  // only for entry files that need to be executable
"use strict";

import { ... } from "...";
```

Files that typically need this:
- src/index.ts
- src/services/*.ts
- src/tools/*.ts
- src/types/*.ts
- src/config/*.ts

## 2. ES Module/CommonJS Issues

### Package.json Updates
```json
{
  "name": "your-package",
  "version": "1.0.0",
  "type": "commonjs",        // Add this line
  "main": "dist/index.js",
  "bin": {
    "your-package": "./dist/index.js"  // Use relative path
  }
}
```

### Entry Point Setup
In your main entry file (e.g., src/index.ts):
```typescript
#!/usr/bin/env node   // Add this for executable packages
"use strict";

// Your imports and code
```

### TSConfig Updates
In tsconfig.json:
```json
{
  "compilerOptions": {
    "module": "CommonJS",
    "moduleResolution": "node",
    "target": "ES2020",
    "esModuleInterop": true,
    "isolatedModules": true,
    "noEmit": false,        // Add this
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

## 3. Build Process

### Clean Build
Before publishing, always do a clean build:
```bash
rm -rf dist/
npm run build
```

### Package.json Scripts
Ensure you have these scripts:
```json
{
  "scripts": {
    "build": "tsc",
    "prepare": "npm run build",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts"
  }
}
```

## 4. Common Issues and Solutions

### ES Module Warning
If you see: "Support for loading ES Module in require() is an experimental feature"
- Add `"type": "commonjs"` to package.json
- Ensure all imports use CommonJS syntax
- Use `.js` extensions in import paths after compilation

### Executable Script Issues
If you see: "use strict: not found" or "Syntax error: word unexpected"
- Add shebang line to entry file
- Ensure correct bin path in package.json
- Make sure the built file has execute permissions

### Module Resolution Issues
If TypeScript can't find modules:
- Add `"moduleResolution": "node"` to tsconfig.json
- Add `"esModuleInterop": true` to tsconfig.json
- Ensure all dependencies are listed in package.json

## 5. Testing the Package

### Local Testing
Before publishing:
```bash
npm pack
npm install -g .
your-package  # Test the command
```

### NPX Testing
After publishing:
```bash
npx -y your-package@version
```

If issues persist, try:
```bash
node --trace-warnings $(which your-package)
```

## 6. Publishing Checklist

1. Update version in package.json
2. Clean the dist directory
3. Run build
4. Test locally
5. Ensure all files are included in "files" field
6. Publish with `npm publish`

## 7. Best Practices

- Always use explicit types
- Avoid mixing ESM and CommonJS
- Keep dependencies up to date
- Test on different Node.js versions
- Use proper error handling
- Include proper TypeScript declarations 