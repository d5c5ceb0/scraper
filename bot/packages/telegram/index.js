const TelegramBot = require('node-telegram-bot-api');
const request = require('./utils/request.js')

// Replace 'YOUR_BOT_TOKEN' with the token from BotFather
const token = process?.env?.TELEGRAM_BOT_TOKEN || '7926431835:AAEjbScqFyl9W6Qu907xOfoGkZ8EKFpvJgM'
const bot = new TelegramBot(token, { polling: true });

// Listen for any message
bot.on('message', async (msg) => {
    console.log('on message====', JSON.stringify(msg, null, 2))
    const chatId = msg.chat.id;
    const messageText = msg.text;
    const username = msg.from.username || 'Anonymous';
    const userId = msg.from.id;
    const messageType = msg.entities?.[0]?.type || 'text';
    try {
        if (messageType === 'bot_command') {
            const [command, ...args] = messageText.slice(1).split(' ');
            if (command === 'bind') {
                const bindId = args[0];
                console.log('bindId====', bindId)
                return
            }
        }

        request({
            url: '/api/add_message',
            data: {

                "group_id": chatId,
                "user_id": userId,
                "username": username,
                "message": messageText
            }
        })
    } catch (error) {
        console.error('request error====', error)
    }
});

// Error handling
bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});

console.log('Bot is running...');