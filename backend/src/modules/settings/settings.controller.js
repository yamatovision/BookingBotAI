import { settingsService } from './settings.service.js';  // 追加

export const settingsController = {
  async getSettings(req, res) {
    try {
      const settings = await settingsService.getSettings();
      res.json(settings);
    } catch (error) {
      console.error('Error in getSettings controller:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  },

  async updateSettings(req, res) {
    try {
      console.log('Received settings update:', req.body);
      const { 
        systemPrompt, 
        referenceContent, 
        lpContent,
        theme,
        displayMode
      } = req.body;

      const settings = await settingsService.updateSettings({
        systemPrompt,
        referenceContent,
        lpContent,
        theme,
        displayMode
      });

      res.json(settings);
    } catch (error) {
      console.error('Error in updateSettings controller:', error);
      res.status(500).json({
        error: 'Internal server error',
        details: error.message
      });
    }
  }
};