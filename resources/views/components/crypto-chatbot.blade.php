<!-- Crypto AI Chatbot Component -->
<div 
    x-data="cryptoChatbot()"
    x-init="initChatbot()"
    class="fixed bottom-6 right-6 z-50"
>
    <!-- Debug element -->
    <div x-text="'Alpine working: ' + (typeof Alpine !== 'undefined')" class="hidden"></div>
    
    <!-- Chat Button -->
    <button 
        @click="toggleChat" 
        class="btn btn-circle bg-blue-600 hover:bg-blue-700 text-white shadow-lg w-14 h-14 flex items-center justify-center"
        :class="{ 'rotate-45 transform transition-transform': chatOpen }"
    >
        <i class="fas fa-robot text-xl" x-show="!chatOpen"></i>
        <i class="fas fa-times text-xl" x-show="chatOpen"></i>
    </button>

    <!-- Chat Window -->
    <div 
        x-show="chatOpen" 
        x-transition:enter="transition ease-out duration-300"
        x-transition:enter-start="opacity-0 transform scale-90"
        x-transition:enter-end="opacity-100 transform scale-100"
        x-transition:leave="transition ease-in duration-200"
        x-transition:leave-start="opacity-100 transform scale-100"
        x-transition:leave-end="opacity-0 transform scale-90"
        class="absolute bottom-20 right-0 w-80 sm:w-96 bg-base-100 rounded-lg shadow-2xl border border-primary/20 overflow-hidden"
    >
        <!-- Chat Header -->
        <div class="bg-blue-600 text-white p-4 flex items-center justify-between">
            <div class="flex items-center">
                <i class="fas fa-robot mr-2"></i>
                <h3 class="font-bold">Crypto Assistant</h3>
            </div>
            <button @click="toggleChat" class="text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>

        <!-- Chat Messages -->
        <div class="p-4 h-80 overflow-y-auto flex flex-col space-y-4" id="chat-messages" x-ref="chatMessages">
            <!-- Welcome Message -->
            <div class="chat chat-start">
                <div class="chat-bubble bg-blue-600 text-white">
                    Hello! I'm your crypto assistant. Ask me anything about cryptocurrencies, trading, or blockchain technology.
                </div>
            </div>

            <!-- Dynamic Messages -->
            <template x-for="(message, index) in messages" :key="index">
                <div :class="`chat ${message.sender === 'user' ? 'chat-end' : 'chat-start'}`">
                    <div :class="`chat-bubble ${message.sender === 'user' ? 'bg-blue-400 text-white' : 'bg-blue-600 text-white'}`" x-text="message.text"></div>
                </div>
            </template>

            <!-- Loading Indicator -->
            <div class="chat chat-start" x-show="loading">
                <div class="chat-bubble bg-blue-600 text-white flex space-x-2">
                    <span class="loading loading-dots loading-sm"></span>
                </div>
            </div>
        </div>

        <!-- Chat Input -->
        <div class="p-4 border-t border-base-300 bg-base-200">
            <form @submit.prevent="sendMessage" class="flex items-center space-x-2">
                <input 
                    type="text" 
                    x-model="userInput" 
                    @keydown.enter="sendMessage"
                    placeholder="Ask about cryptocurrencies..." 
                    class="input input-bordered w-full"
                    :disabled="loading"
                >
                <button 
                    type="submit" 
                    class="btn bg-blue-600 hover:bg-blue-700 text-white btn-square"
                    :disabled="loading || !userInput.trim()"
                >
                    <i class="fas fa-paper-plane"></i>
                </button>
            </form>
        </div>
    </div>
</div> 