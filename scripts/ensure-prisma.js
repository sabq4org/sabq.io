#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Ensuring Prisma client generation...');

try {
  // Check if Prisma schema exists
  const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
  if (fs.existsSync(schemaPath)) {
    console.log('📋 Found Prisma schema, generating client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated successfully');
  } else {
    console.log('⚠️  No Prisma schema found, skipping generation');
  }
} catch (error) {
  console.error('❌ Error during Prisma generation:', error.message);
  // Don't fail the build if Prisma generation fails
  console.log('🔄 Continuing with build despite Prisma error...');
}
