const SDK = globalThis.SDK;

class RenderaControllerInstance extends SDK.IWorldInstanceBase {
	private modelId = ''
	private modelLoaded = false;
	private modelCreated = false;
	private model: unknown = null;
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
		console.log('[rendera-controller] onCreate model-id', this._inst.GetPropertyValue('model-id'));
		console.log('[rendera-controller] instance', this._inst);
		console.log('[rendera-controller] project', this._inst.GetProject());
		console.log('[rendera-controller] project.GetModel', this._inst.GetProject().GetProjectFileByName('bug.glb'));
	}
	
	OnPropertyChanged(id: string, value: EditorPropertyValueType) {

	}
	
	LoadC2Property(name: string, valueString: string) {
		return false;		// not handled
	}

	Draw(iRenderer: SDK.Gfx.IWebGLRenderer, iDrawParams: SDK.Gfx.IDrawParams)
	{
		debugger
		const rendera = globalThis.mikalRenderaEditor;
		if (!this.IsRenderaInitialized(iRenderer)) return;
		if (!this.IsModelLoaded(this.modelId)) return;
		if (!this.modelCreated) {
			this.model = rendera.instanceManager.createModel(this.modelId,null)
			console.log('model created', this.model);
			this.model.setScale(50,50,50);
			this.modelCreated = true;
		}

		this.model.setPosition(this._inst.GetX(), this._inst.GetY(), this._inst.GetTotalZElevation());
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

