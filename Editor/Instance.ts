const glMatrix = globalThis.mikalRenderaGlMatrix;
const quat = glMatrix.quat;

type EulerOrder = 'xyz' | 'xzy' | 'yxz' | 'yzx' | 'zxy' | 'zyx';

/**
 * Creates a quaternion from euler angles (in radians)
 * @param {number} x - Rotation around X axis in radians
 * @param {number} y - Rotation around Y axis in radians
 * @param {number} z - Rotation around Z axis in radians
 * @param {EulerOrder} [order='xyz'] - Order of rotations
 * @returns {quat} Result quaternion
 */
function eulerToQuaternion(x: number, y: number, z: number, order: EulerOrder = 'xyz'): typeof quat {
    const finalQuat = quat.create();
	// @ts-ignore
	quat.fromEuler(finalQuat, x, y, z, order);
    return finalQuat;
}

class RenderaControllerInstance extends SDK.IWorldInstanceBase {
	private modelId = ''
	private modelLoaded = false;
	private modelCreated = false;
	private model: unknown = null;
	
	// Remove posX/Y/Z and keep only rotation and scale
	private rotX = 0;
	private rotY = 0;
	private rotZ = 0;
	private rotOrder: EulerOrder = 'xyz';
	private scaleX = 1;
	private scaleY = 1;
	private scaleZ = 1;

	constructor(sdkType: SDK.ITypeBase, inst: SDK.IWorldInstance) {
		super(sdkType, inst);
		console.log('RenderaControllerInstance', sdkType, inst);
	}
	
	Release() {

	}

	private IsRenderaInitialized(iRenderer: SDK.Gfx.IWebGLRenderer): boolean {
		// @ts-ignore
		const rendera = globalThis.mikalRenderaEditor;
		if (!rendera) return false;
		if (!rendera.initialized) {
			if (!rendera.initializing) {
				rendera.initializing = true;
				rendera.initialize(iRenderer);
			}
			return false;
		}
		rendera.initializing = false;
		return true;
	}

	private GetEditorBlob(path: string): Blob | null {
		const project = this._inst.GetProject()
		const projectFile = project.GetProjectFileByName(path);
		if (!projectFile) {
			console.error('[rendera-controller] project file not found', path);
			return null;
		}
		console.log('[rendera-controller] projectFile', projectFile);
		const blob = projectFile.GetBlob();
		console.log('[rendera-controller] blob', blob);
		return blob;
	}

	private IsModelLoaded(modelId: string): boolean {
		if (this.modelLoaded) return true;
		if (modelId === '') return false;
		// @ts-ignore
		const rendera = globalThis.mikalRenderaEditor;
		if (!rendera) return false;
		if (!rendera.modelLoader.hasModel({id: modelId})) {
			if (!rendera.modelLoader.modelLoading({id: modelId})) {
				console.log('Loading model', modelId);
				const blob = this.GetEditorBlob(modelId);
				if (!blob) {
					console.error('[rendera-controller] model not found', modelId);
					return false;
				}
				rendera.modelLoader.loadModel(modelId, blob);
			}
			return false;
		}
		this.modelLoaded = true;
		return true;
	}

	OnCreate() {
		this.modelId = String(this._inst.GetPropertyValue('model-id'));
		
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
	
	OnPropertyChanged(id: string, value: EditorPropertyValueType) {
		switch(id) {
			case 'rotation-x': this.rotX = Number(value); break;
			case 'rotation-y': this.rotY = Number(value); break;
			case 'rotation-z': this.rotZ = Number(value); break;
			case 'rotation-order': this.rotOrder = value as EulerOrder; break;
			case 'scale-x': this.scaleX = Number(value); break;
			case 'scale-y': this.scaleY = Number(value); break;
			case 'scale-z': this.scaleZ = Number(value); break;
		}
	}
	
	LoadC2Property(name: string, valueString: string) {
		return false;		// not handled
	}

	Draw(iRenderer: SDK.Gfx.IWebGLRenderer, iDrawParams: SDK.Gfx.IDrawParams)
	{

    const layoutView = iDrawParams.GetLayoutView();
    // @ts-ignore
		const rendera = globalThis.mikalRenderaEditor;
		if (!this.IsRenderaInitialized(iRenderer)) return;
		if (!this.IsModelLoaded(this.modelId)) return;
		if (!this.modelCreated) {
			this.model = rendera.instanceManager.createModel(this.modelId,null)
			console.log('model created', this.model);
			this.modelCreated = true;
      layoutView.Refresh();
      console.log('this.model', this.model, this._inst, this._inst.GetProject(), this)
		}

		// Use instance position but custom rotation and scale
		this.model.setPosition(this._inst.GetX(), this._inst.GetY(), this._inst.GetTotalZElevation());
		this.model.setScale(this.scaleX, this.scaleY, this.scaleZ);
		
		// Convert euler angles to quaternion using our helper function
		const rotation = eulerToQuaternion(this.rotX, this.rotY, this.rotZ, this.rotOrder);
		this.model.setRotation(rotation);

		rendera.Draw()
		return;

		const texture = this.GetTexture();
		if (texture)
		{
			this._inst.ApplyBlendMode(iRenderer);
			iRenderer.SetTexture(texture);
			iRenderer.SetColor(this._inst.GetColor());
			iRenderer.Quad3(this._inst.GetQuad(), this.GetTexRect());
		}
		else
		{
			// render placeholder
			iRenderer.SetAlphaBlend();
			iRenderer.SetColorFillMode();
			
			if (this.HadTextureError())
				iRenderer.SetColorRgba(0.25, 0, 0, 0.25);
			else
				iRenderer.SetColorRgba(0, 0, 0.1, 0.1);
			
			iRenderer.Quad(this._inst.GetQuad());
		}
	}
	
	GetTexture()
	{
		const image = this.GetObjectType().GetImage();
		return super.GetTexture(image);
	}
	
	IsOriginalSizeKnown()
	{
		return true;
	}
	
	GetOriginalWidth()
	{
		return this.GetObjectType().GetImage().GetWidth();
	}
	
	GetOriginalHeight()
	{
		return this.GetObjectType().GetImage().GetHeight();
	}
	
	OnMakeOriginalSize()
	{
		const image = this.GetObjectType().GetImage();
		this._inst.SetSize(image.GetWidth(), image.GetHeight());
	}
	
	HasDoubleTapHandler()
	{
		return true;
	}
	
	OnDoubleTap()
	{
		this.GetObjectType().EditImage();
	}
}
/** Important to save export type for Typescript compiler */
export type { RenderaControllerInstance as EditorInstance };

