<!-- Simple Crypto AI Chatbot Component -->
<div class="fixed bottom-6 right-6 z-50" id="crypto-chatbot">
    <!-- Chat Button -->
    <button 
        id="chat-toggle-btn"
        class="btn btn-circle bg-blue-600 hover:bg-blue-700 text-white shadow-lg w-14 h-14 flex items-center justify-center"
    >
        <i class="fas fa-coins text-xl" id="chat-icon-robot"></i>
        <i class="fas fa-times text-xl hidden" id="chat-icon-close"></i>
    </button>

    <!-- Chat Window -->
    <div 
        id="chat-window"
        class="absolute bottom-20 right-0 w-80 sm:w-96 bg-base-100 rounded-lg shadow-2xl border border-primary/20 overflow-hidden hidden"
    >
        <!-- Chat Header -->
        <div class="bg-blue-600 text-white p-4 flex items-center justify-between">
            <div class="flex items-center">
                <i class="fas fa-coins mr-2"></i>
                <h3 class="font-bold">Crypto Assistant</h3>
            </div>
            <button id="chat-close-btn" class="text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>

        <!-- Chat Messages -->
        <div class="p-4 h-80 overflow-y-auto flex flex-col space-y-4" id="chat-messages">
            <!-- Welcome Message -->
            <div class="chat chat-start">
                <div class="chat-bubble bg-blue-600 text-white">
                    Hello! I'm your specialized crypto assistant. Ask me anything about Bitcoin, Ethereum, blockchain technology, crypto trading, DeFi, or market analysis.
                </div>
            </div>

            <!-- Messages will be added here dynamically -->
            <div id="dynamic-messages"></div>

            <!-- Loading Indicator -->
            <div class="chat chat-start hidden" id="loading-indicator">
                <div class="chat-bubble bg-blue-600 text-white flex space-x-2">
                    <span class="loading loading-dots loading-sm"></span>
                </div>
            </div>
        </div>

        <!-- Chat Input -->
        <div class="p-4 border-t border-base-300 bg-base-200">
            <form id="chat-form" class="flex items-center space-x-2">
                <input 
                    type="text" 
                    id="user-input"
                    placeholder="Ask about crypto..." 
                    class="input input-bordered w-full"
                >
                <button 
                    type="submit" 
                    class="btn bg-blue-600 hover:bg-blue-700 text-white btn-square"
                    id="send-btn"
                >
                    <i class="fas fa-paper-plane"></i>
                </button>
            </form>
        </div>
    </div>
</div>

<!-- Include the external crypto chatbot script -->
<script src="{{ asset('js/crypto-chatbot.js') }}"></script> 