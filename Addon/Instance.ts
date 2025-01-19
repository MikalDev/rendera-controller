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
	private _modelLoaded = false
	public rotX = 0
	public rotY = 0
	public rotZ = 0
	public rotOrder = 'xyz'
	public scaleX = 1
	public scaleY = 1
	public scaleZ = 1
	constructor() {
		super();
		/** 
		 * Use auto-created declaration file for your plugin properties after build
		 * @type {PluginProperties}
		 */
		const properties = this._getInitProperties() as PluginProperties;
		this._modelId = properties[0]

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
		if (this._modelId !== '' && !this.isModelLoaded(this._modelId)) return;
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

	private isModelLoaded(modelId: string): boolean {
		if (this._modelLoaded) return true;
		if (modelId === '') return false;
		// @ts-ignore
		const rendera = globalThis.mikalRenderaEditor;
		if (!rendera) return false;
		if (!rendera.modelLoader.hasModel({id: modelId})) {
			if (!rendera.modelLoader.modelLoading({id: modelId})) {
				console.log('Loading model', modelId);
				rendera.modelLoader.loadModel(modelId, null);
			}
			return false;
		}
		this._modelLoaded = true;
		return true;
	}

	_onCreate() {
		
		// Initialize only rotation and scale properties
		this.rotX = Number(this._inst.GetPropertyValue('rotation-x')) || 0;
		this.rotY = Number(this._inst.GetPropertyValue('rotation-y')) || 0;
		this.rotZ = Number(this._inst.GetPropertyValue('rotation-z')) || 0;
		this.rotOrder = (this._inst.GetPropertyValue('rotation-order') as EulerOrder) || 'xyz';
		
		this.scaleX = Number(this._inst.GetPropertyValue('scale-x')) || 1;
		this.scaleY = Number(this._inst.GetPropertyValue('scale-y')) || 1;
		this.scaleZ = Number(this._inst.GetPropertyValue('scale-z')) || 1;

		console.log('[rendera-controller] onCreate model-id', this._inst.GetPropertyValue('model-id'));
		console.log('[rendera-controller] instance', this._inst);
		console.log('[rendera-controller] project', this._inst.GetProject());
		console.log('[rendera-controller] project.GetModel', this._inst.GetProject().GetProjectFileByName('bug.glb'));
	}

};

/** Important to save export type for Typescript compiler */
export type { RenderaControllerInstance as Instance };