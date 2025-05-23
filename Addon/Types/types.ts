/// <reference lib="dom" />

import { Model } from './Model';

import { Node, Animation, Scene, Document as gltfDocument } from '@gltf-transform/core';

import { mat4, vec3, vec4 } from 'gl-matrix';
import { MaterialSystem } from './MaterialSystem';

export const MAX_BONES = 64;

export interface IAnimationTarget {
    updateTransform(
        path: 'translation' | 'rotation' | 'scale',
        values: Float32Array
    ): void;
}

export type Nullable<T> = T | null;

export interface INodeHierarchy {
    getWorldMatrix(): Float32Array;
    getChildren(): Node[];
}

export interface ISkinDeformer {
    updateJointMatrices(worldMatrices: Map<number, Float32Array>): void;
}

// Core identification types
export interface ModelId {
    readonly id: string;
}

export interface InstanceId {
    readonly id: number;
    readonly modelId: string;
}

// Transform and animation
export interface Transform {
    position: Float32Array;
    rotation: Float32Array;
    scale: Float32Array;
}

export interface AnimationState {
    currentAnimation: string | null;
    playing: boolean;
    currentTime: number;
    speed: number;
    blendFactor?: number;
    loop: boolean;
    animationNodeTransforms: WeakMap<Node, NodeTransforms>;
    animationMatrices: WeakMap<Node, mat4>; // Node to animation matrix calculated by animation controller for this instance
    boneMatrices: WeakMap<Node, Float32Array>;
}

export interface NodeTransforms {
    rotation: vec4;
    translation: vec3;
    scale: vec3;
    weights?: Float32Array;
}

// Mesh and GPU resources
export interface MeshPrimitive {
    vao: WebGLVertexArrayObject;
    material: number;
    indexBuffer: WebGLBuffer;
    indexCount: number;
    indexType: number;
    vertexCount: number;
    hasSkin: boolean;
    attributes: {
        POSITION?: WebGLBuffer;
        NORMAL?: WebGLBuffer;
        TEXCOORD_0?: WebGLBuffer;
        JOINTS_0?: WebGLBuffer;
        WEIGHTS_0?: WebGLBuffer;
    };
}

export interface ModelMesh {
    primitives: MeshPrimitive[];
    name: string;
}

// Materials
export interface MaterialData {
    program: WebGLProgram;
    textures: Map<string, WebGLTexture>;
    uniforms?: Record<string, number | boolean | number[]>;
}

// Define a fixed mapping from sampler names to texture units
export const SAMPLER_TEXTURE_UNIT_MAP: Record<string, number> = {
    'u_BaseColorSampler': 0,
    'u_NormalSampler': 1,
    'u_MetallicRoughnessSampler': 2,
    'u_OcclusionSampler': 3,
    'u_EmissiveSampler': 4,
    // Add more samplers here as needed
};

// Animation

export type SkeletalTransformType = 'translation' | 'rotation' | 'scale';
export type InterpolationType = 'LINEAR' | 'STEP' | 'CUBICSPLINE';

// Instance data
export interface InstanceData {
    readonly instanceId: InstanceId;
    transform: Transform;
    animationState: AnimationState;
    worldMatrix: Float32Array;
    renderOptions: {
        useNormalMap?: boolean;
        lightPosition?: [number, number, number];
    };
}

// Main class interfaces
export interface IModelLoader {
    hasModel(modelId: ModelId): boolean;
    readDocument(url: string): Promise<boolean>;
    processModel(modelId: ModelId): Promise<boolean>;
    getModelData(modelId: string): ModelData | null;
    deleteModel(modelId: string): void;
    generateModelId(url: string): ModelId;
}

export interface IGPUResourceCache {
    cacheModelMode(): void;
    restoreModelMode(): void;
}

export interface IInstanceManager {
    setModelPosition(x: number, y: number, z: number, instance: Model): void;
    setModelRotation(quaternion: Float32Array, instance: Model): void;
    setModelScale(x: number, y: number, z: number, instance: Model): void;
    playModelAnimation(name: string, instance: Model, options?: AnimationOptions): void;
    stopModelAnimation(instance: Model): void;
    setModelNormalMapEnabled(enabled: boolean, instance: Model): void;
    updateModelAnimation(instance: Model, deltaTime: number): void;
    setModelBindPose(instance: Model): void;
}

export interface IModel {
    readonly instanceId: InstanceId;
    setPosition(x: number, y: number, z: number): void;
    setRotation(quaternion: Float32Array): void;
    setScale(x: number, y: number, z: number): void;
    playAnimation(name: string, options?: AnimationOptions): void;
    stopAnimation(): void;
    setNormalMapEnabled(enabled: boolean): void;
    setBindPose(): void;
    updateAnimation(deltaTime: number): void;
    stopAnimation(): void;
}

export enum TextureType {
    BaseColor,
    MetallicRoughness,
    Normal,
    Occlusion,
    Emissive
}

// Supporting interfaces
export interface ModelData {
    meshes: ModelMesh[];
    materials: MaterialData[];
    animations: Map<string, Animation>;
    jointData: JointData[];
    rootNode: Node;
    scene: Scene;
    renderableNodes: {
        node: Node;
        modelMesh: ModelMesh;
        useSkinning: boolean;
    }[];
    materialSystem: MaterialSystem;
}

export interface JointData {
    index: number;
    name: string;
    inverseBindMatrix: mat4;
    children: number[];
    node: Node;
}

export interface AnimationOptions {
    loop?: boolean;
    speed?: number;
    blendDuration?: number;
}

export type BufferUsage = WebGL2RenderingContext['STATIC_DRAW'] | WebGL2RenderingContext['DYNAMIC_DRAW'];

// GPU resource management
export interface IGPUResourceManager {
    createBuffer(data: BufferSource, usage: BufferUsage): WebGLBuffer;
    createTexture(image: ImageData | HTMLImageElement): WebGLTexture;
    deleteBuffer(buffer: WebGLBuffer): void;
    deleteTexture(texture: WebGLTexture): void;
    deleteVertexArray(vao: WebGLVertexArrayObject): void;
    createVertexArray(): WebGLVertexArrayObject;
    getShader(modelId: string): WebGLProgram | null;
    getDefaultShader(): WebGLProgram;
    createIndexBuffer(data: BufferSource, usage: BufferUsage): WebGLBuffer;
    setNormalMapEnabled(program: WebGLProgram, enabled: boolean): void;
    setLightPosition(program: WebGLProgram, lightPosition: [number, number, number]): void;
    updateLight(index: number, lightParams: Partial<Light>): void;
    setLightEnabled(index: number, enabled: boolean): void;
    setLightDirection(index: number, direction: [number, number, number]): void;
    setLightColor(index: number, color: [number, number, number]): void;
    setLightIntensity(index: number, intensity: number): void;
    setSpotLightParams(index: number, angle: number, penumbra: number): void;
    bindShaderAndMaterial(shader: WebGLProgram, materialIndex: number, modelData: ModelData): void;
    gpuResourceCache: IGPUResourceCache;
}

// Add this type definition
export type AttributeSemantic = 'POSITION' | 'NORMAL' | 'TEXCOORD_0' | 'JOINTS_0' | 'WEIGHTS_0';

// Add new light types
export interface LightBase {
    enabled: boolean;
    color: [number, number, number];
    intensity: number;
}

export interface PointLight extends LightBase {
    type: 'point';
    position: [number, number, number];
    attenuation: number;
}

export interface DirectionalLight extends LightBase {
    type: 'directional';
    direction: [number, number, number];
}

export interface SpotLight extends LightBase {
    type: 'spot';
    position: [number, number, number];
    direction: [number, number, number];
    spotAngle: number;
    spotPenumbra: number;
    attenuation: number;
}

export type Light = PointLight | DirectionalLight | SpotLight;

export interface AnimationTrack {
    jointIndex: number;
    times: Float32Array;
    values: Float32Array;
    interpolation: string;
    transformType: 'translation' | 'rotation' | 'scale';
}