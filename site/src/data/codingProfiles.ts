import {codingConfig} from '../../shared/coding-config';
import type {Platform} from '../../shared/coding-config';
export interface CodingProfile {name:string;slug:Platform;url:string;description?:string}
// Permanent card identities. Provider availability never controls card rendering.
export const codingProfiles:CodingProfile[]=codingConfig.profiles.map(p=>({name:p.name,slug:p.platform,url:p.profileUrl,...(p.platform==='codolio'?{description:'Explore my coding activity and progress across platforms.'}:{})}));
