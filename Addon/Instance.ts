import type { IModel, Nullable } from './Types/types.ts'

class RenderaControllerInstance extends globalThis.ISDKWorldInstanceBase
{
	/** Use this for triggering plugin conditions */
	readonly Conditions = C3.Plugins[Lost.addonId].Cnds;
	private _modelId = ''
	private _renderaInstance: Nullable<IModel> = null;
	private _animationSpeed = 1
	private _animationBlendDuration = 0
	private _animationLoop = true
	private _animationName = ''
	private _playingAnimation = false
	constructor() {
		super();
		/** 
		 * Use auto-created declaration file for your plugin properties after build
		 * @type {PluginProperties}
		 */
		const properties = this._getInitProperties() as PluginProperties;
		console.log(properties);
		this._setTicking(true);
	}

	_draw(renderer: globalThis.IRenderer) {
		// @ts-ignore
		const rendera = globalThis.mikalRendera;
		// @ts-ignore
		if (rendera?.initialized)
		{
			// @ts-ignore
			rendera.draw(renderer);
			return;
		}
	}

	_tick() {
		const dt = this.runtime.dt
		const renderaInstance = this._renderaInstance;
		if (!renderaInstance) return
		// update model position
		const x = this.x
		const y = this.y
		const z = this.totalZElevation
		renderaInstance.setPosition(x,y,z)
		if (this._playingAnimation) {
			renderaInstance.updateAnimation(dt*this._animationSpeed)
		}
	}

	_release() {
		super._release();
	}

};

/** Important to save export type for Typescript compiler */
export type { RenderaControllerInstance as Instance };