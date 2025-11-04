// Chat functionality
import { API, endpoints } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    initChat();
});

function initChat() {
    const sendButton = document.getElementById('send-message');
    const userInput = document.getElementById('user-input');
    const messagesContainer = document.getElementById('chat-messages');

    if (sendButton && userInput) {
        sendButton.addEventListener('click', () => sendMessage(userInput.value));
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(userInput.value);
            }
        });
    }
}

async function sendMessage(message) {
    if (!message.trim()) return;

    const userInput = document.getElementById('user-input');
    const messagesContainer = document.getElementById('chat-messages');

    // Add user message to chat
    appendMessage('user', message);

    // Clear input
    userInput.value = '';

    try {
        const response = await API.post(endpoints.chat, { message });
        appendMessage('assistant', response.reply);
    } catch (error) {
        console.error('Failed to send message:', error);
        appendMessage('system', 'Failed to get response. Please try again.');
    }
}

function appendMessage(sender, content) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `
        <div class="message-content">
            ${content}
        </div>
        <div class="message-timestamp">
            ${new Date().toLocaleTimeString()}
        </div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}