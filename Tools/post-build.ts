try {
    // Read the addon.json file
    const addonPath = 'Builds/Source/addon.json';
    const content = await Deno.readTextFile(addonPath);
    const addonData = JSON.parse(content);

    // Reorder the editor-scripts array
    addonData['editor-scripts'] = [
        "plugin.js",
        "type.js",
        "instance.js",
        "c3runtime/modules/gl-matrix.js"
    ];

    // Write the updated content back to the file
    await Deno.writeTextFile(addonPath, JSON.stringify(addonData, null, 2));
    console.log("✓ Successfully updated addon.json");
} catch (error) {
    console.error("Error processing file:", error);
}