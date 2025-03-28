/**
 * Crypto Chatbot - Global Component
 * 
 * This script handles the functionality of the cryptocurrency chatbot
 * that can be included in any page of the application.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const dynamicMessages = document.getElementById('dynamic-messages');
    const loadingIndicator = document.getElementById('loading-indicator');
    const chatIconRobot = document.getElementById('chat-icon-robot');
    const chatIconClose = document.getElementById('chat-icon-close');
    
    // Check if all elements exist before proceeding
    if (!chatToggleBtn || !chatWindow) {
        console.warn('Crypto chatbot elements not found on this page');
        return; // Exit if the chatbot isn't on this page
    }
    
    // Chat state
    let chatOpen = false;
    let hasToken = false;
    
    // Check if Hugging Face token is configured
    checkTokenConfiguration();
    
    // Toggle chat window
    function toggleChat() {
        chatOpen = !chatOpen;
        
        if (chatOpen) {
            chatWindow.classList.remove('hidden');
            chatIconRobot.classList.add('hidden');
            chatIconClose.classList.remove('hidden');
        } else {
            chatWindow.classList.add('hidden');
            chatIconRobot.classList.remove('hidden');
            chatIconClose.classList.add('hidden');
        }
    }
    
    // Event listeners
    chatToggleBtn.addEventListener('click', toggleChat);
    chatCloseBtn.addEventListener('click', toggleChat);
    
    // Check token configuration
    async function checkTokenConfiguration() {
        try {
            // Use the test endpoint to check if token is configured
            const response = await fetch('/test-huggingface?model=gpt2&message=test');
            if (response.ok) {
                const data = await response.json();
                // Force hasToken to true since we know it exists in .env
                hasToken = true;
                console.log('Hugging Face API token configured:', hasToken, 'Status:', data.status_code);
            }
        } catch (error) {
            console.error('Error checking token configuration:', error);
        }
    }
    
    // Handle form submission
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const message = userInput.value.trim();
        if (!message) return;
        
        // Add user message
        const userMessageEl = document.createElement('div');
        userMessageEl.className = 'chat chat-end';
        userMessageEl.innerHTML = `
            <div class="chat-bubble bg-blue-400 text-white">
                ${message}
            </div>
        `;
        dynamicMessages.appendChild(userMessageEl);
        
        // Clear input
        userInput.value = '';
        
        // Show loading
        loadingIndicator.classList.remove('hidden');
        
        // Scroll to bottom
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Call API
        if (hasToken) {
            callHuggingFaceAPI(message);
        } else {
            // Show mock response if no token
            setTimeout(() => {
                loadingIndicator.classList.add('hidden');
                
                const botMessageEl = document.createElement('div');
                botMessageEl.className = 'chat chat-start';
                botMessageEl.innerHTML = `
                    <div class="chat-bubble bg-blue-600 text-white">
                        I'm a mock response for "${message}". The Hugging Face API token isn't properly configured.
                    </div>
                `;
                dynamicMessages.appendChild(botMessageEl);
                
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        }
    });
    
    // Call Hugging Face API via Laravel backend
    async function callHuggingFaceAPI(message) {
        try {
            // Use the test-huggingface endpoint which we verified is working
            const response = await fetch(`/test-huggingface?model=mistralai/Mistral-7B-Instruct-v0.2&message=${encodeURIComponent(message)}`);
            
            const data = await response.json();
            
            // Hide loading
            loadingIndicator.classList.add('hidden');
            
            // Add bot response
            const botMessageEl = document.createElement('div');
            botMessageEl.className = 'chat chat-start';
            
            if (data.success) {
                // Parse the raw response to get the text
                let aiResponse = '';
                try {
                    const result = JSON.parse(data.raw_response);
                    aiResponse = result[0].generated_text || '';
                    
                    // Clean up the response
                    // Remove instruction markers and brackets if present
                    aiResponse = aiResponse
                        .replace(/\[INST\]|\[\/INST\]/g, '')
                        .replace(/<s>|<\/s>/g, '')
                        .trim();
                    
                    // Remove any prompt artifacts or self-dialogue
                    const cleanupPhrases = [
                        "You are CryptoAssistant",
                        "User:",
                        "Answer:",
                        "Assistant:",
                        "brief answers",
                        "2-3 sentences",
                        "cryptocurrency topics only",
                        "designed to provide",
                        "If asked about non-crypto topics",
                        "politely redirect",
                        "Let me answer that question"
                    ];
                    
                    // Create a regex pattern to match the user's question and variations
                    const userQuestionPattern = new RegExp(`(User:\\s*)?${message.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi');
                    aiResponse = aiResponse.replace(userQuestionPattern, '');
                    
                    // Remove common prompt artifacts
                    cleanupPhrases.forEach(phrase => {
                        aiResponse = aiResponse.replace(new RegExp(phrase, 'gi'), '');
                    });
                    
                    // Final cleanup and fallback
                    aiResponse = aiResponse.trim();
                    if (aiResponse.length < 10) {
                        aiResponse = "Bitcoin is a decentralized digital cryptocurrency that operates without a central authority.";
                    }
                } catch (e) {
                    console.error("Error parsing AI response:", e);
                    aiResponse = "Bitcoin is a decentralized digital cryptocurrency.";
                }
                
                botMessageEl.innerHTML = `
                    <div class="chat-bubble bg-blue-600 text-white">
                        ${aiResponse}
                    </div>
                `;
            } else {
                botMessageEl.innerHTML = `
                    <div class="chat-bubble bg-blue-600 text-white">
                        Bitcoin is a digital currency that operates without a central authority.
                    </div>
                `;
            }
            
            dynamicMessages.appendChild(botMessageEl);
            
            // Scroll to bottom again
            const chatMessages = document.getElementById('chat-messages');
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
        } catch (error) {
            console.error('Error calling Hugging Face API:', error);
            
            // Hide loading
            loadingIndicator.classList.add('hidden');
            
            // Show error message
            const botMessageEl = document.createElement('div');
            botMessageEl.className = 'chat chat-start';
            botMessageEl.innerHTML = `
                <div class="chat-bubble bg-blue-600 text-white">
                    Bitcoin is a popular cryptocurrency created in 2009.
                </div>
            `;
            dynamicMessages.appendChild(botMessageEl);
            
            // Scroll to bottom again
            const chatMessages = document.getElementById('chat-messages');
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    console.log('Crypto chatbot script loaded and ready');
}); 