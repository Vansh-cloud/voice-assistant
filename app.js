const chatArea = document.getElementById('chatArea');
const userInput = document.getElementById('userInput');

// Commands mapping
const commands = {
    'youtube': { url: 'https://youtube.com', name: 'YouTube' },
    'google': { url: 'https://google.com', name: 'Google' },
    'gmail': { url: 'https://mail.google.com', name: 'Gmail' },
    'facebook': { url: 'https://facebook.com', name: 'Facebook' },
    'instagram': { url: 'https://instagram.com', name: 'Instagram' },
    'twitter': { url: 'https://twitter.com', name: 'Twitter' },
    'github': { url: 'https://github.com', name: 'GitHub' },
    'calculator': { url: 'calc://', name: 'Calculator' },
    'notepad': { url: 'notepad://', name: 'Notepad' },
    'wikipedia': { url: 'https://wikipedia.org', name: 'Wikipedia' },
    'stackoverflow': { url: 'https://stackoverflow.com', name: 'Stack Overflow' },
    'reddit': { url: 'https://reddit.com', name: 'Reddit' },
    'amazon': { url: 'https://amazon.com', name: 'Amazon' },
    'netflix': { url: 'https://netflix.com', name: 'Netflix' },
    'spotify': { url: 'https://spotify.com', name: 'Spotify' },
    'linkedin': { url: 'https://linkedin.com', name: 'LinkedIn' },
    'twitter': { url: 'https://twitter.com', name: 'Twitter' },
    'weather': { url: 'https://weather.com', name: 'Weather' },
    'news': { url: 'https://news.google.com', name: 'Google News' },
    'maps': { url: 'https://maps.google.com', name: 'Google Maps' },
    'calendar': { url: 'https://calendar.google.com', name: 'Google Calendar' },
    'drive': { url: 'https://drive.google.com', name: 'Google Drive' },
    'photos': { url: 'https://photos.google.com', name: 'Google Photos' },
    'translate': { url: 'https://translate.google.com', name: 'Google Translate' },
    'docs': { url: 'https://docs.google.com', name: 'Google Docs' },
    'chatgpt': { url: 'https://chat.openai.com', name: 'ChatGPT' },
    'bing': { url: 'https://bing.com', name: 'Bing' },
    'duckduckgo': { url: 'https://duckduckgo.com', name: 'DuckDuckGo' },
    'yahoo': { url: 'https://yahoo.com', name: 'Yahoo' },
};

function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    
    if (!isUser) {
        let fullMessage = message;
        let charIndex = 0;
        const typingEffect = setInterval(() => {
            if (charIndex < fullMessage.length) {
                messageDiv.textContent = fullMessage.substring(0, charIndex + 1);
                charIndex++;
            } else {
                clearInterval(typingEffect);
            }
            chatArea.scrollTop = chatArea.scrollHeight;
        }, 20); // Typing speed
    } else {
        messageDiv.textContent = message;
    }
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
}

async function processCommand(input) {
    const lowerInput = input.toLowerCase().trim();

    // New logic to handle video playback requests
    const videoMatch = lowerInput.match(/(play|watch|open|khol) (.+) (on|from) youtube/);
    if (videoMatch) {
        const videoTitle = videoMatch[2].trim();
        const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(videoTitle)}`;
        window.open(youtubeSearchUrl, '_blank');
        return `Searching for and opening **${videoTitle}** on YouTube.`;
    }

    // Existing "open" or "go to" commands
    const openMatch = lowerInput.match(/^(open|go to)\s(.+)/);
    if (openMatch) {
        const appName = openMatch[2].trim();
        const appData = commands[appName];
        if (appData) {
            window.open(appData.url, '_blank');
            return `Opening ${appData.name} for you!`;
        } else {
            return `Sorry, I don't have a command to open "${appName}".`;
        }
    }

    // Existing "search and go to" combined commands
    const searchAndGoToMatch = lowerInput.match(/search for (.+) and go to (.+)/);
    if (searchAndGoToMatch) {
        const query = searchAndGoToMatch[1].trim();
        const site = searchAndGoToMatch[2].trim();
        
        const siteData = commands[site];
        if (siteData) {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
            setTimeout(() => {
                window.open(siteData.url, '_blank');
            }, 1000); 
            return `Searching for **${query}** and opening **${siteData.name}** for you!`;
        } else {
            return `Sorry, I can't find the website **${site}**. Please try a different one.`;
        }
    }

    // Existing direct search commands
    const searchMatch = lowerInput.match(/"(search for|look up|find|what is|who is|where is|when is|how is|can you tell me|can you find|can you|${query})"\s(.+)/);
    if (searchMatch) {
        const query = searchMatch[2].trim();
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        return `I've performed a search for **${query}** on Google.`;
    }

    // Other commands (time, date, etc.)
    if (lowerInput.includes('time') || lowerInput.includes('what time')) {
        return `Current time: ${new Date().toLocaleTimeString()}`;
    }

    if (lowerInput.includes('date') || lowerInput.includes('today')) {
        return `Today's date: ${new Date().toLocaleDateString()}`;
    }

    // Default response for unhandled commands
    return "I can't help with that request yet. Try commands like 'open google', 'search for Galileo Galilei', or 'search for Galileo Galilei and go to Wikipedia'.";
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        
        setTimeout(async () => {
            const response = await processCommand(message);
            addMessage(response);
        }, 700);
        
        userInput.value = '';
    }
}

function startVoiceRecognition() {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.start();
        addMessage("Listening...", false);

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            sendMessage();
        };

        recognition.onerror = function(event) {
            addMessage("Sorry, I couldn't hear you clearly. Please try again.", false);
        };
    } else {
        addMessage("Voice recognition is not supported in your browser.", false);
    }
}

// Enter key support
userInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
