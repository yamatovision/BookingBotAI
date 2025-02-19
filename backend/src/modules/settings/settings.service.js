import { Settings } from './settings.model.js';

class SettingsService {
  async getSettings() {
    try {
      const settings = await Settings.find();
      
      // 既存の設定データを取得
      const systemPromptDoc = settings.find(s => s.type === 'system_prompt');
      const referenceContentDoc = settings.find(s => s.type === 'reference_content');
      const lpContentDoc = settings.find(s => s.type === 'lp_content');
      const displaySettingsDoc = settings.find(s => s.type === 'display_settings');

      // デフォルトの表示設定
      const defaultDisplayConfig = {
        theme: {
          primary: '#FF6B2B'
        },
        displayMode: 'fixed'
      };

      // レスポンスデータの構築
      return {
        systemPrompt: systemPromptDoc?.content || '',
        referenceContent: referenceContentDoc?.content || '',
        lpContent: lpContentDoc?.content || '',
        theme: displaySettingsDoc?.displayConfig?.theme || defaultDisplayConfig.theme,
        displayMode: displaySettingsDoc?.displayConfig?.displayMode || defaultDisplayConfig.displayMode
      };
    } catch (error) {
      console.error('Error in getSettings:', error);
      throw new Error('Failed to get settings');
    }
  }

  async updateSettings({ 
    systemPrompt, 
    referenceContent, 
    lpContent,
    theme,
    displayMode
  }) {
    try {
      // 各設定の更新を並行で実行
      await Promise.all([
        this.updateSettingsByType('system_prompt', systemPrompt),
        this.updateSettingsByType('reference_content', referenceContent),
        this.updateSettingsByType('lp_content', lpContent),
        this.updateSettingsByType('display_settings', null, { theme, displayMode })
      ]);

      return await this.getSettings();
    } catch (error) {
      console.error('Error in updateSettings:', error);
      throw error;
    }
  }

  async updateSettingsByType(type, content, displayConfig = null) {
    const updateData = {
      updatedAt: new Date()
    };

    if (type === 'display_settings') {
      updateData.displayConfig = displayConfig;
    } else {
      updateData.content = content;
    }

    return Settings.findOneAndUpdate(
      { type },
      updateData,
      { upsert: true, new: true }
    );
  }

  async validateSettings(settings) {
    const errors = [];

    if (settings.systemPrompt && settings.systemPrompt.length > 2000) {
      errors.push('System prompt is too long (max 2000 characters)');
    }

    if (settings.referenceContent && settings.referenceContent.length > 5000) {
      errors.push('Reference content is too long (max 5000 characters)');
    }

    if (settings.lpContent && settings.lpContent.length > 10000) {
      errors.push('LP content is too long (max 10000 characters)');
    }

    return errors;
  }
}

export const settingsService = new SettingsService();