import {exclusiveItems} from './auction-config.mjs';
export const exclusiveById=Object.fromEntries(exclusiveItems.map(item=>[item.id,item]));
export const marketManualIds=['azure_sword_scripture','ssr_heavenfall','ssr_reversal','ssr_chronostasis'];
