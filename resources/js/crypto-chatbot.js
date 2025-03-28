/**
 * Crypto Chatbot using Hugging Face AI
 * This script handles the chatbot interactions and API calls
 */

window.cryptoChatbot = function() {
    return {
        chatOpen: false,
        userInput: '',
        messages: [],
        loading: false,
        
        // Hugging Face API configuration
        huggingFaceModel: 'mistralai/Mistral-7B-Instruct-v0.2', // You can change to another model
        
        initChatbot() {
            // Initialize chatbot here if needed
            console.log("Chatbot initialized");
            this.scrollToBottom();
        },
        
        toggleChat() {
            this.chatOpen = !this.chatOpen;
            if (this.chatOpen) {
                this.$nextTick(() => {
                    this.scrollToBottom();
                });
            }
        },
        
        scrollToBottom() {
            if (this.$refs.chatMessages) {
                this.$nextTick(() => {
                    this.$refs.chatMessages.scrollTop = this.$refs.chatMessages.scrollHeight;
                });
            }
        },
        
        sendMessage() {
            if (!this.userInput.trim() || this.loading) return;
            
            // Add user message to chat
            const userMessage = this.userInput.trim();
            this.messages.push({
                sender: 'user',
                text: userMessage
            });
            
            // Clear input and show loading
            this.userInput = '';
            this.loading = true;
            this.scrollToBottom();
            
            // Call Hugging Face API
            this.getAIResponse(userMessage);
        },
        
        async getAIResponse(userMessage) {
            try {
                // Format the prompt for crypto-specific context
                const prompt = `<s>[INST] You are a helpful cryptocurrency assistant. 
                Provide accurate and informative responses about blockchain technology, 
                crypto trading, tokens, and market analysis. 
                
                User question: ${userMessage} [/INST]</s>`;
                
                // Make the API call to Hugging Face
                const response = await fetch('https://api-inference.huggingface.co/models/' + this.huggingFaceModel, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.getHuggingFaceToken() // Use your token from .env
                    },
                    body: JSON.stringify({
                        inputs: prompt,
                        parameters: {
                            max_new_tokens: 250,
                            temperature: 0.7,
                            top_p: 0.9,
                            do_sample: true
                        }
                    })
                });
                
                if (!response.ok) {
                    throw new Error('API request failed');
                }
                
                const result = await response.json();
                let aiResponse = '';
                
                // Handle the response format based on the model
                if (Array.isArray(result) && result[0]?.generated_text) {
                    // Extract just the assistant's response part
                    const fullText = result[0].generated_text;
                    // Extract the text after the prompt
                    aiResponse = fullText.split('[/INST]</s>')[1]?.trim() || fullText;
                } else if (typeof result === 'object' && result.generated_text) {
                    aiResponse = result.generated_text;
                } else {
                    aiResponse = "I'm having trouble connecting to my knowledge base. Please try again later.";
                }
                
                // Add AI response to messages
                this.messages.push({
                    sender: 'bot',
                    text: aiResponse
                });
                
                this.loading = false;
                this.scrollToBottom();
                
            } catch (error) {
                console.error('Error calling Hugging Face API:', error);
                
                // Show error message
                this.messages.push({
                    sender: 'bot',
                    text: "Sorry, I'm having trouble connecting to my knowledge base. Please try again later."
                });
                
                this.loading = false;
                this.scrollToBottom();
            }
        },
        
        getHuggingFaceToken() {
            // This would typically come from your .env via Laravel config
            // For now, we'll use a placeholder - you'll need to replace this with your actual token
            return window.huggingFaceToken || '';
        }
    };
} 