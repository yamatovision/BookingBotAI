import claudeService from './claude.service.js';// claude.controller.js の修正
export const processMessage = async (req, res) => {
    try {
        const { message, history } = req.body;
        console.log('Controller received message:', message);
        
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*');
    
        console.log('Headers set, getting stream...');
        const stream = await claudeService.streamMessage(message, history);
        console.log('Stream received in controller');
    
        stream.on('text', (text) => {
            console.log('Sending chunk to client:', text);
            res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
        });
    
        stream.on('end', () => {
            console.log('Stream ended, closing response');
            res.end();
        });
    
        stream.on('error', (error) => {
            console.error('Stream error in controller:', error);
            res.write(`data: ${JSON.stringify({ error: 'Stream error occurred' })}\n\n`);
            res.end();
        });

        // エラーハンドリングを追加
        req.on('close', () => {
            console.log('Client closed connection');
        });
    
    } catch (error) {
        console.error('Error in processMessage controller:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};