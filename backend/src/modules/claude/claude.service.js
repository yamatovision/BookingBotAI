import '@anthropic-ai/sdk/shims/node';
import Anthropic from '@anthropic-ai/sdk';
import { settingsService } from '../settings/settings.service.js';

export class ClaudeService {
    constructor() {
        if (!process.env.CLAUDE_API_KEY) {
            throw new Error('CLAUDE_API_KEY is not set in environment variables');
        }
        
        this.client = new Anthropic({
            apiKey: process.env.CLAUDE_API_KEY
        });
    }

    async streamMessage(message, history = []) {
        try {
            const settings = await settingsService.getSettings();
            let formattedMessages = [];

            // 初回の場合、コンテキストを追加
            if (history.length === 0) {
                if (settings.referenceContent) {
                    formattedMessages.push({
                        role: "user",
                        content: [{ type: 'text', text: settings.referenceContent }]
                    });
                    formattedMessages.push({
                        role: "assistant",
                        content: [{ type: 'text', text: "理解しました。" }]
                    });
                }
                if (settings.lpContent) {
                    formattedMessages.push({
                        role: "user",
                        content: [{ type: 'text', text: settings.lpContent }]
                    });
                    formattedMessages.push({
                        role: "assistant",
                        content: [{ type: 'text', text: "承知しました。" }]
                    });
                }
            }

            // 会話履歴と現在のメッセージを追加
            formattedMessages = [
                ...formattedMessages,
                ...history.map(msg => ({
                    role: msg.type === 'user' ? 'user' : 'assistant',
                    content: [{ type: 'text', text: msg.content }]
                })),
                {
                    role: "user",
                    content: [{ type: 'text', text: message }]
                }
            ];

            const requestBody = {
                messages: formattedMessages,
                model: "claude-3-5-sonnet-20241022",
                max_tokens: 1024,
                system: settings.systemPrompt
            };

            console.log('\n=== Claude API Request ===');
            console.log('System Message:');
            console.log(settings.systemPrompt);
            console.log('\nConversation:');
            requestBody.messages.forEach((msg, index) => {
                console.log(`\n[${index + 1}] ${msg.role.toUpperCase()}:`);
                console.log(msg.content[0].text);
            });
            console.log('\nConfig:');
            console.log(`Model: ${requestBody.model}`);
            console.log(`Max Tokens: ${requestBody.max_tokens}`);
            console.log('========================\n');

            const stream = await this.client.messages.stream(requestBody);
            return stream;

        } catch (error) {
            console.error('\n=== Claude API Error ===');
            console.error(error);
            console.error('=======================\n');
            throw error;
        }
    }
}

export default new ClaudeService();