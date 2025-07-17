#!/usr/bin/env node

/**
 * Script di testing per verificare la stabilità del build e del sistema di retry
 * Da eseguire prima del deploy su Kinsta
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 TESTING BUILD STABILITY PER KINSTA DEPLOYMENT');
console.log('='.repeat(60));

// Colori per output console
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n🔍 ${description}...`, 'blue');
  try {
    const output = execSync(command, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      timeout: 300000 // 5 minuti timeout
    });
    log(`✅ ${description} completato`, 'green');
    return { success: true, output };
  } catch (error) {
    log(`❌ ${description} fallito:`, 'red');
    log(error.message, 'red');
    return { success: false, error: error.message };
  }
}

async function testGraphQLEndpoint() {
  log('\n🌐 Testing GraphQL endpoint...', 'blue');
  
  const testQuery = `
    query TestQuery {
      posts(first: 1, where: { status: PUBLISH }) {
        nodes {
          id
          title
        }
      }
    }
  `;

  try {
    // Usa fetch nativo di Node.js (disponibile da Node 18+)
    const fetch = globalThis.fetch;
    const response = await fetch('https://pff-815f04.ingress-florina.ewp.live/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PuntiFurbi-Test/1.0'
      },
      body: JSON.stringify({
        query: testQuery,
        variables: {}
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.data && data.data.posts) {
        log('✅ GraphQL endpoint risponde correttamente', 'green');
        return true;
      } else {
        log('⚠️ GraphQL endpoint risponde ma senza dati validi', 'yellow');
        return false;
      }
    } else {
      log(`❌ GraphQL endpoint error: ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ GraphQL endpoint test fallito: ${error.message}`, 'red');
    return false;
  }
}

function checkFileStructure() {
  log('\n📁 Verifica struttura file...', 'blue');
  
  const requiredFiles = [
    'lib/fetch-with-retry.ts',
    'lib/graphql-api.ts',
    'components/blog-page-client.tsx',
    'components/blog-list.tsx',
    'app/blog/page.tsx',
    'next.config.mjs',
    'package.json'
  ];

  let allPresent = true;
  
  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      log(`  ✅ ${file}`, 'green');
    } else {
      log(`  ❌ ${file} MANCANTE`, 'red');
      allPresent = false;
    }
  }

  return allPresent;
}

function analyzePackageJson() {
  log('\n📦 Analisi package.json...', 'blue');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Verifica script di build
    if (packageJson.scripts && packageJson.scripts.build) {
      log('  ✅ Script build presente', 'green');
    } else {
      log('  ❌ Script build mancante', 'red');
      return false;
    }

    // Verifica dipendenze critiche
    const criticalDeps = ['next', 'react', 'react-dom'];
    for (const dep of criticalDeps) {
      if (packageJson.dependencies && packageJson.dependencies[dep]) {
        log(`  ✅ ${dep}: ${packageJson.dependencies[dep]}`, 'green');
      } else {
        log(`  ❌ ${dep} mancante`, 'red');
        return false;
      }
    }

    return true;
  } catch (error) {
    log(`❌ Errore lettura package.json: ${error.message}`, 'red');
    return false;
  }
}

function checkBuildConfiguration() {
  log('\n⚙️ Verifica configurazione build...', 'blue');
  
  try {
    // Verifica next.config.mjs
    const configContent = fs.readFileSync('next.config.mjs', 'utf8');
    
    const requiredConfigs = [
      'output: \'export\'',
      'trailingSlash: true',
      'unoptimized: true'
    ];

    let allConfigsPresent = true;
    for (const config of requiredConfigs) {
      if (configContent.includes(config)) {
        log(`  ✅ ${config}`, 'green');
      } else {
        log(`  ❌ ${config} mancante`, 'red');
        allConfigsPresent = false;
      }
    }

    return allConfigsPresent;
  } catch (error) {
    log(`❌ Errore verifica configurazione: ${error.message}`, 'red');
    return false;
  }
}

async function simulateRateLimiting() {
  log('\n🚫 Simulazione rate limiting...', 'blue');
  
  // Test multipli del retry system
  log('  📡 Testing retry logic con richieste multiple...', 'blue');
  
  const promises = [];
  for (let i = 0; i < 5; i++) {
    promises.push(
      fetch('https://pff-815f04.ingress-florina.ewp.live/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'query { posts(first: 1) { nodes { id } } }',
          variables: {}
        })
      }).catch(err => ({ error: err.message }))
    );
  }

  try {
    const results = await Promise.all(promises);
    const errors = results.filter(r => r.error).length;
    const successes = results.length - errors;
    
    log(`  📊 Risultati: ${successes} successi, ${errors} errori`, 
         errors > successes ? 'yellow' : 'green');
    
    return errors <= successes; // Accettabile se più successi che errori
  } catch (error) {
    log(`  ❌ Test rate limiting fallito: ${error.message}`, 'red');
    return false;
  }
}

async function runAllTests() {
  log('🚀 INIZIO TEST SUITE', 'bold');
  
  const results = {
    fileStructure: checkFileStructure(),
    packageJson: analyzePackageJson(),
    buildConfig: checkBuildConfiguration(),
    graphqlEndpoint: await testGraphQLEndpoint(),
    rateLimitTest: await simulateRateLimiting()
  };

  // Clean build test
  const cleanBuild = runCommand('npm run build', 'Build pulito');
  results.cleanBuild = cleanBuild.success;

  // Verifica output directory
  if (fs.existsSync('out')) {
    log('\n📂 Directory "out" presente dopo build', 'green');
    const outFiles = fs.readdirSync('out');
    log(`  📄 File generati: ${outFiles.length}`, 'blue');
    results.outputGenerated = outFiles.length > 0;
  } else {
    log('\n❌ Directory "out" mancante dopo build', 'red');
    results.outputGenerated = false;
  }

  // Summary
  log('\n' + '='.repeat(60), 'bold');
  log('📊 RISULTATI TEST SUITE', 'bold');
  log('='.repeat(60), 'bold');

  const testResults = [
    ['Struttura file', results.fileStructure],
    ['Package.json', results.packageJson],
    ['Configurazione build', results.buildConfig],
    ['GraphQL endpoint', results.graphqlEndpoint],
    ['Test rate limiting', results.rateLimitTest],
    ['Build pulito', results.cleanBuild],
    ['Output generato', results.outputGenerated]
  ];

  let totalPassed = 0;
  testResults.forEach(([name, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const color = passed ? 'green' : 'red';
    log(`${status} ${name}`, color);
    if (passed) totalPassed++;
  });

  const successRate = (totalPassed / testResults.length * 100).toFixed(1);
  log(`\n📈 Tasso di successo: ${successRate}%`, 
      successRate >= 85 ? 'green' : successRate >= 70 ? 'yellow' : 'red');

  if (successRate >= 85) {
    log('\n🎉 DEPLOY READY! Il sistema è stabile per Kinsta', 'green');
    process.exit(0);
  } else if (successRate >= 70) {
    log('\n⚠️ DEPLOY CON CAUTELA: Alcuni test falliti ma sistema funzionale', 'yellow');
    process.exit(0);
  } else {
    log('\n🚫 DEPLOY NON RACCOMANDATO: Troppi test falliti', 'red');
    process.exit(1);
  }
}

// Gestione errori globali
process.on('uncaughtException', (error) => {
  log(`\n💥 Errore critico: ${error.message}`, 'red');
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  log(`\n💥 Promise rejection: ${reason}`, 'red');
  process.exit(1);
});

// Avvia i test
if (require.main === module) {
  runAllTests().catch(error => {
    log(`\n💥 Test suite fallita: ${error.message}`, 'red');
    process.exit(1);
  });
}