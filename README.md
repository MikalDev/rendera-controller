# [Plugin] Addon bare-bones

There is a Lost bare-bones project for 'plugin' addon type.

<!-- ## Installation
Use `lost create --plugin` -->

## Development
- Use `deno task build` OR `lost build` to build addon.
- Use `deno task serve` OR `lost serve` to build AND start web development server for testing addon.

Properties:
- model-id: string - id of the model to load
- position: number[] - position of the model
- rotation: number[] - rotation of the model
- scale: number[] - scale of the model
