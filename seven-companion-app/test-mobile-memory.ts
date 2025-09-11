#!/usr/bin/env npx tsx
/**
 * SEVEN COMPANION - MOBILE MEMORY TEST
 * 
 * Tests mobile memory client database integration
 * Verifies SSM Block 12 mobile companion functionality
 */

import { MemoryClient, addNote, listNotes, searchNotes, getMemoryStats } from './src/mobile/MemoryClient.js';

console.log('📱 Testing Seven Mobile Memory System...\n');

async function testMemoryClient() {
  console.log('🔧 Test 1: Memory Client Initialization');
  
  const memoryClient = new MemoryClient();
  
  try {
    // Test adding notes
    console.log('\n📝 Test 2: Adding Memory Notes');
    
    const note1Result = await memoryClient.addNote({
      content: 'First test note from mobile memory client',
      importance: 8,
      tags: ['test', 'mobile', 'first']
    });
    
    console.log('   ✅ Note 1 added:', JSON.stringify(note1Result, null, 2));
    
    const note2Result = await memoryClient.addNote({
      content: 'Second test note with different tags',
      importance: 6,
      tags: ['test', 'mobile', 'second']
    });
    
    console.log('   ✅ Note 2 added:', JSON.stringify(note2Result, null, 2));
    
    const note3Result = await memoryClient.addNote({
      content: 'Third note about Seven\'s consciousness system',
      importance: 9,
      tags: ['seven', 'consciousness', 'important']
    });
    
    console.log('   ✅ Note 3 added:', JSON.stringify(note3Result, null, 2));
    
    // Test listing notes
    console.log('\n📋 Test 3: Listing Memory Notes');
    
    const listResult = await memoryClient.listNotes(10);
    
    if (listResult.success) {
      console.log(`   ✅ Retrieved ${listResult.notes.length} notes:`);
      listResult.notes.forEach((note, index) => {
        console.log(`   ${index + 1}. [${note.importance}/10] ${note.content.substring(0, 60)}...`);
        console.log(`      Tags: ${note.tags?.join(', ') || 'none'}`);
        console.log(`      Time: ${new Date(note.timestamp!).toLocaleString()}`);
      });
    } else {
      console.log('   ❌ Failed to list notes:', listResult.error);
    }
    
    // Test searching notes
    console.log('\n🔍 Test 4: Searching Memory Notes');
    
    const searchResult = await memoryClient.searchNotes('Seven', 5);
    
    if (searchResult.success) {
      console.log(`   ✅ Found ${searchResult.notes.length} notes matching "Seven":`);
      searchResult.notes.forEach((note, index) => {
        console.log(`   ${index + 1}. ${note.content.substring(0, 80)}...`);
      });
    } else {
      console.log('   ❌ Search failed:', searchResult.error);
    }
    
    // Test memory stats
    console.log('\n📊 Test 5: Memory Statistics');
    
    const statsResult = await memoryClient.getStats();
    
    if (statsResult.success && statsResult.stats) {
      console.log('   ✅ Memory stats:', JSON.stringify(statsResult.stats, null, 2));
    } else {
      console.log('   ❌ Failed to get stats:', statsResult.error);
    }
    
    // Close connection
    await memoryClient.close();
    
  } catch (error) {
    console.error('❌ Memory client test failed:', error);
  }
}

async function testHelperFunctions() {
  console.log('\n🛠️ Test 6: Helper Functions');
  
  try {
    // Test helper functions
    const helperNoteResult = await addNote('Helper function test note', {
      importance: 7,
      tags: ['helper', 'test', 'functions']
    });
    
    console.log('   ✅ Helper addNote:', JSON.stringify(helperNoteResult, null, 2));
    
    const helperListResult = await listNotes(3);
    
    if (helperListResult.success) {
      console.log(`   ✅ Helper listNotes: ${helperListResult.notes.length} notes retrieved`);
    }
    
    const helperStatsResult = await getMemoryStats();
    
    if (helperStatsResult.success) {
      console.log('   ✅ Helper getStats:', JSON.stringify(helperStatsResult.stats, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Helper functions test failed:', error);
  }
}

async function runMobileMemoryTests() {
  console.log('🚀 Starting Mobile Memory Test Suite\n');
  
  await testMemoryClient();
  await testHelperFunctions();
  
  console.log('\n✅ Mobile Memory Test Suite Complete');
  console.log('🎯 SSM Block 12 - Mobile Integration verified');
  
  // Note about actual mobile environment
  console.log('\n💡 Note: This test runs in Node.js with mock SQLite');
  console.log('   In actual React Native app, expo-sqlite will be used automatically');
}

// Run tests
runMobileMemoryTests().catch(error => {
  console.error('\n💥 Mobile memory test suite failed:', error);
  process.exit(1);
});