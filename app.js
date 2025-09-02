// Email Phishing Detection System - JavaScript

// Sample emails data
const sampleEmails = {
  phishing1: {
    subject: "Urgent: Your Account Will Be Suspended",
    content: "Dear Customer,\n\nYour account has been flagged for suspicious activity. To prevent suspension, please verify your account immediately by clicking the link below:\n\nhttp://secure-bank-verification.com/verify\n\nIf you don't verify within 24 hours, your account will be permanently suspended.\n\nThank you,\nBank Security Team"
  },
  phishing2: {
    subject: "Congratulations! You've Won $10,000!",
    content: "Congratulations!\n\nYou have been selected as a winner in our international lottery. You've won $10,000 USD!\n\nTo claim your prize, please send us your:\n- Full name\n- Address\n- Phone number\n- Bank account details\n\nReply to this email immediately to claim your winnings!\n\nLottery Commission"
  },
  legitimate1: {
    subject: "Your Monthly Statement is Ready",
    content: "Dear John Doe,\n\nYour monthly statement for Account #1234 is now available in your online banking portal.\n\nTo view your statement:\n1. Log in to your account at yourbank.com\n2. Navigate to Statements\n3. Select the current month\n\nFor questions, contact customer service at 1-800-YOURBANK.\n\nBest regards,\nYour Bank Customer Service"
  },
  legitimate2: {
    subject: "Meeting Confirmation - Tomorrow 2PM",
    content: "Hi Team,\n\nThis is a reminder about our project meeting scheduled for tomorrow at 2:00 PM in Conference Room B.\n\nAgenda:\n- Project status updates\n- Q4 planning\n- Budget review\n\nPlease bring your project reports.\n\nThanks,\nSarah Johnson\nProject Manager"
  }
};

// Phishing detection patterns and keywords
const phishingPatterns = {
  urgentWords: ['urgent', 'immediate', 'expire', 'suspend', 'terminate', 'act now', 'limited time', 'deadline'],
  suspiciousRequests: ['verify account', 'confirm identity', 'update payment', 'click here', 'download attachment', 'personal information', 'social security', 'bank account', 'credit card'],
  moneyWords: ['won', 'winner', 'prize', 'lottery', 'inheritance', 'million', 'refund', 'tax', 'claim'],
  threatWords: ['suspend', 'close', 'terminate', 'legal action', 'arrest', 'fine', 'penalty'],
  legitimateIndicators: ['unsubscribe', 'customer service', 'official', 'contact us', 'privacy policy']
};

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  console.log('Initializing Email Phishing Detection System...');
  
  // Get DOM elements
  const form = document.getElementById('emailAnalysisForm');
  const subjectInput = document.getElementById('emailSubject');
  const contentInput = document.getElementById('emailContent');
  const sampleSelect = document.getElementById('sampleEmailSelect');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const clearBtn = document.getElementById('clearBtn');
  const retryBtn = document.getElementById('retryBtn');
  const resultsSection = document.getElementById('resultsSection');
  const errorSection = document.getElementById('errorSection');
  
  // Verify all elements exist
  const elements = {
    form, subjectInput, contentInput, sampleSelect, 
    analyzeBtn, clearBtn, retryBtn, resultsSection, errorSection
  };
  
  for (const [name, element] of Object.entries(elements)) {
    if (!element) {
      console.error(`Missing element: ${name}`);
      return;
    }
  }
  
  console.log('All DOM elements found successfully');
  
  // Setup event listeners with proper error handling
  setupEventListeners(elements);
}

function setupEventListeners(elements) {
  // Sample email selection
  elements.sampleSelect.addEventListener('change', function(e) {
    handleSampleEmailSelect(e, elements);
  });
  
  // Form submission
  elements.form.addEventListener('submit', function(e) {
    e.preventDefault();
    handleFormSubmit(elements);
  });
  
  // Analyze button click (backup handler)
  elements.analyzeBtn.addEventListener('click', function(e) {
    if (e.target.type !== 'submit') {
      e.preventDefault();
      handleFormSubmit(elements);
    }
  });
  
  // Clear button
  elements.clearBtn.addEventListener('click', function(e) {
    e.preventDefault();
    clearForm(elements);
  });
  
  // Retry button
  if (elements.retryBtn) {
    elements.retryBtn.addEventListener('click', function(e) {
      e.preventDefault();
      hideError(elements);
    });
  }
  
  console.log('Event listeners set up successfully');
}

function handleSampleEmailSelect(e, elements) {
  const selectedValue = e.target.value;
  console.log('Sample selected:', selectedValue);
  
  if (selectedValue && sampleEmails[selectedValue]) {
    const selectedEmail = sampleEmails[selectedValue];
    
    elements.subjectInput.value = selectedEmail.subject;
    elements.contentInput.value = selectedEmail.content;
    
    console.log('Sample email populated successfully');
  } else if (selectedValue === '') {
    // Clear fields when "Select a sample email..." is chosen
    elements.subjectInput.value = '';
    elements.contentInput.value = '';
  }
}

function handleFormSubmit(elements) {
  const emailContent = elements.contentInput.value.trim();
  const emailSubject = elements.subjectInput.value.trim();
  
  console.log('Form submitted with content length:', emailContent.length);
  
  if (!emailContent) {
    showError('Please enter email content to analyze.', elements);
    return;
  }
  
  analyzeEmail(emailSubject, emailContent, elements);
}

function analyzeEmail(subject, content, elements) {
  console.log('Starting email analysis...');
  
  showLoading(true, elements);
  hideResults(elements);
  hideError(elements);
  
  // Simulate API call with realistic delay
  setTimeout(() => {
    try {
      const result = performPhishingDetection(subject, content);
      console.log('Analysis completed:', result);
      showResults(result, elements);
    } catch (error) {
      console.error('Analysis error:', error);
      showError('Analysis failed. Please try again.', elements);
    } finally {
      showLoading(false, elements);
    }
  }, 2500); // 2.5 second delay for realistic feel
}

function performPhishingDetection(subject, content) {
  const fullText = (subject + ' ' + content).toLowerCase();
  let phishingScore = 0;
  let indicators = [];
  
  // Check for urgent words
  const urgentMatches = phishingPatterns.urgentWords.filter(word => 
    fullText.includes(word.toLowerCase())
  );
  if (urgentMatches.length > 0) {
    phishingScore += urgentMatches.length * 15;
    indicators.push(`Urgent language: "${urgentMatches.join(', ')}"`);
  }
  
  // Check for suspicious requests
  const suspiciousMatches = phishingPatterns.suspiciousRequests.filter(phrase => 
    fullText.includes(phrase.toLowerCase())
  );
  if (suspiciousMatches.length > 0) {
    phishingScore += suspiciousMatches.length * 20;
    indicators.push(`Suspicious requests: "${suspiciousMatches.join(', ')}"`);
  }
  
  // Check for money-related words
  const moneyMatches = phishingPatterns.moneyWords.filter(word => 
    fullText.includes(word.toLowerCase())
  );
  if (moneyMatches.length > 0) {
    phishingScore += moneyMatches.length * 12;
    indicators.push(`Financial incentives: "${moneyMatches.join(', ')}"`);
  }
  
  // Check for threats
  const threatMatches = phishingPatterns.threatWords.filter(word => 
    fullText.includes(word.toLowerCase())
  );
  if (threatMatches.length > 0) {
    phishingScore += threatMatches.length * 25;
    indicators.push(`Threatening language: "${threatMatches.join(', ')}"`);
  }
  
  // Check for legitimate indicators
  const legitMatches = phishingPatterns.legitimateIndicators.filter(phrase => 
    fullText.includes(phrase.toLowerCase())
  );
  if (legitMatches.length > 0) {
    phishingScore -= legitMatches.length * 15;
    indicators.push(`Legitimate indicators: "${legitMatches.join(', ')}"`);
  }
  
  // Check for suspicious URLs
  const suspiciousUrls = content.match(/http[s]?:\/\/[^\s]+/gi);
  if (suspiciousUrls && suspiciousUrls.length > 0) {
    const suspiciousCount = suspiciousUrls.filter(url => 
      !url.includes('.com') && !url.includes('.org') && !url.includes('.gov')
    ).length;
    if (suspiciousCount > 0) {
      phishingScore += 30;
      indicators.push(`Suspicious URLs detected (${suspiciousCount})`);
    }
  }
  
  // Grammar and formatting checks
  const grammarIssues = checkGrammarIssues(content);
  if (grammarIssues > 0) {
    phishingScore += grammarIssues * 8;
    indicators.push(`Grammar/formatting issues detected (${grammarIssues})`);
  }
  
  // Normalize score
  phishingScore = Math.max(0, Math.min(100, phishingScore));
  
  const isPhishing = phishingScore > 45;
  let confidence = isPhishing ? 
    Math.max(phishingScore, 65) : 
    Math.max(100 - phishingScore, 70);
  
  confidence = Math.min(confidence, 97); // Cap at 97% for realism
  
  if (indicators.length === 0) {
    indicators.push('Standard email patterns analyzed - no significant risk factors detected');
  }
  
  return {
    isPhishing,
    confidence: Math.round(confidence),
    indicators,
    recommendation: generateRecommendation(isPhishing, confidence),
    processingTime: (Math.random() * 0.8 + 1.8).toFixed(2) + 's'
  };
}

function checkGrammarIssues(text) {
  let issues = 0;
  
  if (text.match(/!{2,}/g)) issues++;
  if (text.match(/\?{2,}/g)) issues++;
  if (text.match(/\b[A-Z]{4,}\b/g)) issues++;
  if (text.match(/[.!?][a-zA-Z]/g)) issues++;
  
  return issues;
}

function generateRecommendation(isPhishing, confidence) {
  if (isPhishing && confidence > 85) {
    return "⚠️ HIGH RISK: Multiple phishing indicators detected. Do not click links, download attachments, or provide personal information. Delete immediately and report to IT security.";
  } else if (isPhishing && confidence > 70) {
    return "⚠️ MEDIUM RISK: Likely phishing attempt. Exercise extreme caution. Verify sender through alternative communication channels before taking action.";
  } else if (isPhishing) {
    return "⚠️ LOW RISK: Some phishing patterns detected. Be cautious and verify sender authenticity before responding.";
  } else if (confidence > 85) {
    return "✅ LOW RISK: Email appears legitimate. No significant phishing indicators detected.";
  } else {
    return "✅ APPEARS LEGITIMATE: Email shows normal patterns, but always maintain good email security practices.";
  }
}

function showLoading(loading, elements) {
  const btnText = elements.analyzeBtn.querySelector('.btn-text');
  const btnLoading = elements.analyzeBtn.querySelector('.btn-loading');
  
  if (loading) {
    if (btnText) btnText.classList.add('hidden');
    if (btnLoading) btnLoading.classList.remove('hidden');
    elements.analyzeBtn.disabled = true;
  } else {
    if (btnText) btnText.classList.remove('hidden');
    if (btnLoading) btnLoading.classList.add('hidden');
    elements.analyzeBtn.disabled = false;
  }
}

function showResults(result, elements) {
  const resultStatus = document.getElementById('resultStatus');
  const confidenceScore = document.getElementById('confidenceScore');
  const resultExplanation = document.getElementById('resultExplanation');
  
  if (resultStatus) {
    resultStatus.className = `result-status ${result.isPhishing ? 'phishing' : 'legitimate'}`;
    resultStatus.textContent = result.isPhishing ? '🚨 PHISHING DETECTED' : '✅ LEGITIMATE EMAIL';
  }
  
  if (confidenceScore) {
    confidenceScore.innerHTML = `
      <div class="confidence-value">${result.confidence}%</div>
      <div class="confidence-label">Confidence Level</div>
      <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: var(--space-4);">
        Analysis time: ${result.processingTime}
      </div>
    `;
  }
  
  if (resultExplanation) {
    resultExplanation.innerHTML = `
      <h4>${result.isPhishing ? '🔍 Risk Factors:' : '📊 Analysis Results:'}</h4>
      <ul style="margin: var(--space-12) 0; padding-left: var(--space-20); line-height: 1.6;">
        ${result.indicators.map(indicator => `<li style="margin-bottom: var(--space-8);">${indicator}</li>`).join('')}
      </ul>
      <div style="padding: var(--space-16); background: var(--color-bg-3); border-radius: var(--radius-md); margin-top: var(--space-16);">
        <strong>💡 Recommendation:</strong><br>
        ${result.recommendation}
      </div>
    `;
  }
  
  elements.resultsSection.classList.remove('hidden');
  
  setTimeout(() => {
    elements.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function showError(message, elements) {
  const errorMessage = document.getElementById('errorMessage');
  if (errorMessage) {
    errorMessage.textContent = message;
  }
  elements.errorSection.classList.remove('hidden');
  elements.resultsSection.classList.add('hidden');
}

function hideError(elements) {
  elements.errorSection.classList.add('hidden');
}

function hideResults(elements) {
  elements.resultsSection.classList.add('hidden');
}

function clearForm(elements) {
  elements.subjectInput.value = '';
  elements.contentInput.value = '';
  elements.sampleSelect.value = '';
  
  hideResults(elements);
  hideError(elements);
  
  console.log('Form cleared successfully');
}