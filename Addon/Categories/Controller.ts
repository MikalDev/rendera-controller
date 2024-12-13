import { Category, Action, Condition, Expression, addParam, Param } from '../../deps.ts';
import type { IModel, Nullable } from '../Types/types.ts'
@Category('controller', 'Controller')
export default class {
    /** @Actions */
    @Action(
        `create`,
        `Create`,
        `Create {0}`,
        `Create a new model`,
        {params: [
            addParam('model-id', 'Model Id', { type: Param.String, initialValue: '' })
        ]}
    )
    create(modelId: string) {
        if (this._renderaInstance) {
            console.error('[rendera-controller] Model already created');
            return;
        }
        // @ts-ignore
        const rendera = globalThis.mikalRendera;
        if (!rendera) {
            console.error('[rendera-controller] Rendera is not initialized');
            return;
        }
        console.log('[rendera-controller] Creating model', modelId);
        // @ts-ignore
        this._renderaInstance = rendera.instanceManager.createModel(modelId);
    }

    @Action(
        `play-animation`,
        `Play Animation`,
        `Play Animation {0}`,
        `Play Animation`,
        {params: [
            addParam('animation-name', 'Animation name', { type: Param.String, initialValue: '' }),
            addParam('loop', "Loop", {type: Param.Boolean}),
            addParam('speed', "Speed", {type: Param.Number, initialValue: 1}),
            addParam('blend-duration', "Blend Duration", {type: Param.Number, initialValue: 0})
        ]}
    )
    playAnimation(animationName: string, loop: boolean, speed: number, blendDuration: number) {
        const instance = this._renderaInstance;
        if (!instance) return
        this._playingAnimation = true
        instance.playAnimation(animationName, {loop, speed, blendDuration})
    }

    @Action(
        `set-position`,
        `Set Position`,
        `Set position to ({0}, {1}, {2})`,
        `Set the model's position in 3D space`,
        {params: [
            addParam('x', 'X Position', { type: Param.Number, initialValue: 0 }),
            addParam('y', 'Y Position', { type: Param.Number, initialValue: 0 }),
            addParam('z', 'Z Position', { type: Param.Number, initialValue: 0 })
        ]}
    )
    setPosition(x: number, y: number, z: number) {
        const instance = this._renderaInstance;
        if (!instance) return
        instance.setPosition(x, y, z);
    }

    @Action(
        `set-rotation`,
        `Set Rotation`,
        `Set rotation quaternion to {0}`,
        `Set the model's rotation using a quaternion`,
        {params: [
            addParam('quaternion', 'Quaternion (x,y,z,w)', { type: Param.String, initialValue: '0,0,0,1' })
        ]}
    )
    setRotation(quaternionStr: string) {
        const instance = this._renderaInstance;
        if (!instance) return;
        const values = quaternionStr.split(',').map(v => parseFloat(v));
        const quaternion = new Float32Array(values);
        instance.setRotation(quaternion);
    }

    @Action(
        `set-scale`,
        `Set Scale`,
        `Set scale to ({0}, {1}, {2})`,
        `Set the model's scale in 3D space`,
        {params: [
            addParam('x', 'X Scale', { type: Param.Number, initialValue: 1 }),
            addParam('y', 'Y Scale', { type: Param.Number, initialValue: 1 }),
            addParam('z', 'Z Scale', { type: Param.Number, initialValue: 1 })
        ]}
    )
    setScale(x: number, y: number, z: number) {
        const instance = this._renderaInstance;
        if (!instance) return;
        instance.setScale(x, y, z);
    }

    @Action(
        `stop-animation`,
        `Stop Animation`,
        `Stop current animation`,
        `Stops the currently playing animation`,
        {params: []}
    )
    stopAnimation() {
        const instance = this._renderaInstance;
        if (!instance) return;
        instance.stopAnimation();
    }

    @Action(
        `set-normal-map`,
        `Set Normal Map`,
        `Set normal map {0}`,
        `Enable or disable normal mapping`,
        {params: [
            addParam('enabled', 'Enabled', { type: Param.Boolean, initialValue: true })
        ]}
    )
    setNormalMap(enabled: boolean) {
        const instance = this._renderaInstance;
        if (!instance) return;
        instance.setNormalMapEnabled(enabled);
    }

    @Action(
        `set-bind-pose`,
        `Set Bind Pose`,
        `Reset to bind pose`,
        `Reset the model to its initial bind pose`,
        {params: []}
    )
    setBindPose() {
        const instance = this._renderaInstance;
        if (!instance) return;
        instance.setBindPose();
    }

    /** @Conditions */

    /** @Expressions */
    
}