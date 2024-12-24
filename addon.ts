import { defineAddon, Plugin, Property } from 'jsr:@lost-c3/lib@3.3.5';
import type { EditorInstance } from '@Editor/Instance.ts';
import type { EditorType } from '@Editor/Type.ts';
import config from './lost.config.ts';

export default defineAddon(
    new Plugin<EditorInstance, EditorType>(config)
        /** @Properties */
        .addProperty('model-id', 'Model Id', { type: Property.Text, initialValue: '' })
        .addProperty('rotation-x', 'Rotation X', { type: Property.Float, initialValue: 0 })
        .addProperty('rotation-y', 'Rotation Y', { type: Property.Float, initialValue: 0 })
        .addProperty('rotation-z', 'Rotation Z', { type: Property.Float, initialValue: 0 })
        .addProperty('rotation-order', 'Rotation Order', { 
            type: Property.Combo, 
            items: [
                ['xyz', 'xyz'],
                ['xzy', 'xzy'],
                ['yxz', 'yxz'],
                ['yzx', 'yzx'],
                ['zxy', 'zxy'],
                ['zyx', 'zyx']
            ],
        })
        .addProperty('scale-x', 'Scale X', { type: Property.Float, initialValue: 1 })
        .addProperty('scale-y', 'Scale Y', { type: Property.Float, initialValue: 1 })
        .addProperty('scale-z', 'Scale Z', { type: Property.Float, initialValue: 1 })
)