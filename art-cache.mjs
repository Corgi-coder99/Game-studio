import {prepareGoldenArt} from './palette-renderer.mjs';
const sharedImages=new Map();
export function cachedImage(path){if(!sharedImages.has(path)){const image=new Image();image.decoding='async';image.src=path;sharedImages.set(path,image);prepareGoldenArt(path,image);}return sharedImages.get(path);}
