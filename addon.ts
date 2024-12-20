import { defineAddon, Plugin, Property } from 'jsr:@lost-c3/lib@3.3.3';
import type { EditorInstance } from '@Editor/Instance.ts';
import type { EditorType } from '@Editor/Type.ts';
import config from './lost.config.ts';


export default defineAddon(
    new Plugin<EditorInstance, EditorType>(config)
        /** @Properties */
        .addProperty('model-id', 'Model Id', { type: Property.Text })       
)