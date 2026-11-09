import {visualTheme} from './visual-theme.mjs';
export function styleAnimationFrame(action,ageMs){const durations=visualTheme.animationMs[action]||visualTheme.animationMs.idle,total=durations.reduce((a,b)=>a+b,0);let age=((ageMs%total)+total)%total;for(let i=0;i<durations.length;i++){if(age<durations[i])return i;age-=durations[i];}return 0;}
