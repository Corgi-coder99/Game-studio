const sharedImages=new Map();
export function cachedImage(path){if(!sharedImages.has(path)){const image=new Image();image.decoding='async';image.src=path;sharedImages.set(path,image);}return sharedImages.get(path);}
