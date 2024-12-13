import { defineConfig } from "./deps.ts";

export default defineConfig<'plugin'>({
    type: 'plugin',
    pluginType: 'world',
    // deprecated?: boolean;
    // minConstructVersion?: string;
    canBeBundled: false,
    objectName: 'RenderaController',
    addonId: 'renderaController',
    category: 'general',
    minConstructVersion: 'r416',
    addonName: 'Rendera controller for Construct 3',
    addonDescription: 'Rendera controller for Construct 3',
    version: '1.0.0',
    author: 'Mikal',
    docsUrl: 'https://kindeyegames.itch.io/rendera-controller',
    helpUrl: {
        EN: 'https://kindeyegames.itch.io/rendera-controller'
    },
    websiteUrl: 'https://kindeyegames.itch.io/rendera-controller'
})
