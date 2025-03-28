import './bootstrap';
import './crypto-chatbot';

// Set Hugging Face API token from Laravel environment variable
window.huggingFaceToken = document.querySelector('meta[name="huggingface-token"]')?.getAttribute('content') || '';
