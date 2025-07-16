// GTM Debug Script - Punti Furbi
// Da eseguire nella console del browser per testare GTM

console.log('🔍 GTM Debug Script - Punti Furbi');

// Test 1: Verifica presenza GTM
if (typeof google_tag_manager !== 'undefined' && google_tag_manager["GTM-TRRBVKZR"]) {
  console.log('✅ GTM caricato correttamente');
  console.log('📊 Container ID:', 'GTM-TRRBVKZR');
  console.log('🏷️ Google Tag Manager Object:', google_tag_manager["GTM-TRRBVKZR"]);
} else {
  console.log('❌ GTM NON caricato - controllare implementazione');
}

// Test 2: Verifica dataLayer
if (typeof dataLayer !== 'undefined') {
  console.log('✅ DataLayer presente');
  console.log('📊 DataLayer contents:', dataLayer);
  
  // Mostra ultimi 5 eventi
  const lastEvents = dataLayer.slice(-5);
  console.log('📈 Ultimi 5 eventi nel dataLayer:', lastEvents);
} else {
  console.log('❌ DataLayer mancante');
}

// Test 3: Verifica caricamento script GTM
const gtmScript = document.querySelector('script[src*="googletagmanager.com/gtm.js"]');
if (gtmScript) {
  console.log('✅ Script GTM trovato nel DOM');
  console.log('📊 Script src:', gtmScript.src);
} else {
  console.log('❌ Script GTM non trovato nel DOM');
}

// Test 4: Verifica iframe noscript
const gtmIframe = document.querySelector('iframe[src*="googletagmanager.com/ns.html"]');
if (gtmIframe) {
  console.log('✅ GTM noscript iframe presente');
} else {
  console.log('❌ GTM noscript iframe mancante');
}

// Test 5: Funzione di test eventi
function testGTMEvent(eventName = 'test_event', parameters = {}) {
  if (typeof dataLayer !== 'undefined') {
    dataLayer.push({
      event: eventName,
      test_timestamp: new Date().toISOString(),
      ...parameters
    });
    console.log(`✅ Test evento '${eventName}' inviato`, parameters);
  } else {
    console.log('❌ Non è possibile testare l\'evento - dataLayer mancante');
  }
}

// Test 6: Verifica configurazione pagina
function checkPageTracking() {
  console.log('📊 Verifica tracking pagina corrente:');
  console.log('- URL:', window.location.href);
  console.log('- Title:', document.title);
  
  // Verifica se la pagina ha eventi specifici
  const pageEvents = dataLayer.filter(item => 
    item.event === 'page_view' || 
    item.event === 'gtm.js' ||
    item.event === 'begin_checkout'
  );
  
  console.log('📊 Eventi specifici della pagina:', pageEvents);
}

// Test 7: Monitoring GTM real-time
function monitorGTM() {
  if (typeof dataLayer !== 'undefined') {
    const originalPush = dataLayer.push;
    dataLayer.push = function(...args) {
      console.log('📡 Nuovo evento GTM:', args);
      return originalPush.apply(this, args);
    };
    console.log('✅ Monitoring GTM attivato - tutti i nuovi eventi saranno loggati');
  }
}

// Esegui tutti i test
console.log('\n🚀 Esecuzione test automatici...');
checkPageTracking();

// Fornisci funzioni di utilità
window.gtmDebug = {
  testEvent: testGTMEvent,
  monitor: monitorGTM,
  checkPage: checkPageTracking
};

console.log('\n🛠️  Funzioni di debug disponibili:');
console.log('- gtmDebug.testEvent("nome_evento", {parametri}) - Testa un evento custom');
console.log('- gtmDebug.monitor() - Monitora tutti gli eventi GTM in real-time');
console.log('- gtmDebug.checkPage() - Verifica tracking della pagina corrente');

// Test automatico conversioni (se siamo in pagina checkout)
if (window.location.pathname.includes('/checkout')) {
  console.log('🛒 Pagina checkout rilevata - test eventi conversione...');
  setTimeout(() => {
    testGTMEvent('test_conversion', {
      currency: 'EUR',
      value: 4.90,
      test_mode: true
    });
  }, 1000);
}

// Test automatico premium/elite (se siamo nelle pagine relative)
if (window.location.pathname.includes('/premium') || window.location.pathname.includes('/elite')) {
  console.log('👑 Pagina premium/elite rilevata - test eventi subscription...');
  setTimeout(() => {
    testGTMEvent('test_subscription', {
      subscription_plan: window.location.pathname.includes('/premium') ? 'premium' : 'elite',
      test_mode: true
    });
  }, 1000);
}

console.log('\n🎯 Test completati! Controlla i risultati sopra.');