// Chat State
let chatState = {
    conversationId: null,
    contractId: null,
    messages: [],
    isTyping: false
};

// Initialize Chat
document.addEventListener('DOMContentLoaded', () => {
    initializeChat();
});

function initializeChat() {
    // Load contract context
    const contractId = localStorage.getItem('current_contract_id');
    const chatContext = localStorage.getItem('chat_context');
    
    if (!contractId) {
        alert('No contract found. Please upload a contract first.');
        window.location.href = '../index.html';
        return;
    }
    
    chatState.contractId = contractId;
    
    // If there's a specific clause context, add a welcome message about it
    if (chatContext) {
        const context = JSON.parse(chatContext);
        addAIMessage(`I see you'd like to discuss the ${context.clause_type} clause. What would you like to know about it?`);
        localStorage.removeItem('chat_context'); // Clear after use
    }
    
    // Load chat history if exists
    loadChatHistory();
    
    // Focus input
    document.getElementById('chatInput').focus();
}

async function loadChatHistory() {
    const conversationId = localStorage.getItem(`chat_conv_${chatState.contractId}`);
    
    if (conversationId) {
        try {
            const history = await LegalLensAPI.getChatHistory(conversationId);
            chatState.conversationId = conversationId;
            
            // Render previous messages
            history.messages.forEach(msg => {
                if (msg.role === 'user') {
                    addUserMessage(msg.content, false);
                } else {
                    addAIMessage(msg.content, msg.sources, false);
                }
            });
            
            scrollToBottom();
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    }
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message || chatState.isTyping) return;
    
    // Clear input
    input.value = '';
    input.style.height = 'auto';
    
    // Add user message
    addUserMessage(message);
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Send to API
        const response = await LegalLensAPI.sendChatMessage(
            chatState.contractId,
            message,
            chatState.conversationId
        );
        
        // Update conversation ID
        if (response.conversation_id) {
            chatState.conversationId = response.conversation_id;
            localStorage.setItem(`chat_conv_${chatState.contractId}`, response.conversation_id);
        }
        
        // Hide typing indicator
        hideTypingIndicator();
        
        // Add AI response
        addAIMessage(response.response, response.sources);
        
        // Track analytics
        LegalLensAPI.trackEvent('chat_message_sent', {
            contract_id: chatState.contractId,
            message_length: message.length
        });
        
    } catch (error) {
        hideTypingIndicator();
        addAIMessage('I apologize, but I encountered an error. Please try again.', null, true);
        console.error('Chat error:', error);
    }
}

function addUserMessage(text, scroll = true) {
    const messagesContainer = document.getElementById('chatMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';
    messageDiv.innerHTML = `
        <div class="message-avatar">👤</div>
        <div class="message-content">
            <p>${escapeHTML(text)}</p>
            <div class="message-time">${getCurrentTime()}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    
    // Store in state
    chatState.messages.push({
        role: 'user',
        content: text,
        timestamp: new Date().toISOString()
    });
    
    if (scroll) scrollToBottom();
}

function addAIMessage(text, sources = null, isError = false) {
    const messagesContainer = document.getElementById('chatMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai';
    
    // Convert markdown to HTML if marked.js is available
    let htmlContent = text;
    if (typeof marked !== 'undefined') {
        htmlContent = marked.parse(text);
    } else {
        htmlContent = text.replace(/\n/g, '<br>');
    }
    
    let sourcesHTML = '';
    if (sources && sources.length > 0) {
        sourcesHTML = `
            <div class="message-sources">
                <strong>📚 Sources:</strong>
                ${sources.map(source => `
                    <div class="source-item">
                        <span>📄</span>
                        <div>
                            <strong>${source.title}</strong>
                            <p>${source.excerpt}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    messageDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content ${isError ? 'error' : ''}">
            <div>${htmlContent}</div>
            ${sourcesHTML}
            <div class="message-time">${getCurrentTime()}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    
    // Store in state
    if (!isError) {
        chatState.messages.push({
            role: 'assistant',
            content: text,
            sources: sources,
            timestamp: new Date().toISOString()
        });
    }
    
    scrollToBottom();
}

function showTypingIndicator() {
    chatState.isTyping = true;
    
    const messagesContainer = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    scrollToBottom();
    
    // Disable send button
    document.getElementById('sendButton').disabled = true;
}

function hideTypingIndicator() {
    chatState.isTyping = false;
    
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    
    // Enable send button
    document.getElementById('sendButton').disabled = false;
}

function askQuestion(question) {
    const input = document.getElementById('chatInput');
    input.value = question;
    input.focus();
    sendMessage();
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function clearChat() {
    if (confirm('Are you sure you want to clear this chat? This cannot be undone.')) {
        // Clear UI
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.innerHTML = `
            <div class="message ai">
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <p>Chat cleared. How can I help you today?</p>
                    <div class="message-time">${getCurrentTime()}</div>
                </div>
            </div>
        `;
        
        // Clear state
        chatState.messages = [];
        chatState.conversationId = null;
        
        // Clear localStorage
        if (chatState.contractId) {
            localStorage.removeItem(`chat_conv_${chatState.contractId}`);
        }
    }
}

function getCurrentTime() {
    return new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Auto-resize textarea
document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('chatInput');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 150) + 'px';
        });
    }
});

// Export for testing
window.ChatFunctions = {
    sendMessage,
    askQuestion,
    clearChat,
    addUserMessage,
    addAIMessage
};