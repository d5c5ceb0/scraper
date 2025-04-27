const TelegramBot = require('node-telegram-bot-api');
const { request, request2 } = require('./utils/request.js')

// Replace 'YOUR_BOT_TOKEN' with the token from BotFather
const token = process?.env?.TELEGRAM_BOT_TOKEN || '8106423724:AAFbrDup4l5t8ZoTlV2wxn-bvM7wC5FeN2E'
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
        //if (messageType === 'bot_command') {
        //    const [command, ...args] = messageText.slice(1).split(' ');
        //    if (command === 'bind') {
        //        const token = args[0];
        //        console.log('bindId====', token)
        //        request2({
        //            url: '/api/v1/user/binding/telegram',
        //            data: {
        //                token,
        //                user_id: `${userId}`,
        //            }
        //        }).then(res => {
        //            console.log('res====', res)
        //        }).catch(err => {
        //            console.error('request error====', err)
        //        })
        //        return
        //    }
        //}

        request({
            url: '/api/add_message',
            data: {

                "group_id": chatId,
                "user_id": userId,
                "username": username,
                "message": messageText
            }
        }).catch(err => {
            console.error('request error====', err)
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
