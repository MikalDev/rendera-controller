class LostInstance extends globalThis.ISDKInstanceBase {

	/** Use this for triggering plugin conditions */
	readonly Conditions = C3.Plugins[Lost.addonId].Cnds;

	constructor() {
		super();
		/** 
		 * Use auto-created declaration file for your plugin properties after build
		 * @type {PluginProperties}
		 */
		const properties = this._getInitProperties() as PluginProperties;
	}

	_release() {
		super._release();
	}

};

/** Important to save export type for Typescript compiler */
export type { LostInstance as Instance };