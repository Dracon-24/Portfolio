import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import type {CodingStatsResponse} from '../../shared/coding-types';
import {fallbackProfiles} from '../../shared/coding-fallbacks';
import {codingConfig} from '../../shared/coding-config';
import {parseDashboard} from '../data/codingStatsView';
const initial:CodingStatsResponse={profiles:fallbackProfiles(),refreshIntervalSeconds:codingConfig.refreshSeconds,generatedAt:'',cacheAvailable:false};
const Context=createContext({data:initial,loading:true,error:false});
export function CodingStatsProvider({children}:{children:ReactNode}){
 const [state,setState]=useState({data:initial,loading:true,error:false});
 useEffect(()=>{const controller=new AbortController();let timer:ReturnType<typeof setTimeout>|undefined;let stopped=false;
 async function load(followup=false){try{const response=await fetch(import.meta.env.VITE_CODING_STATS_ENDPOINT || '/api/coding-stats',{signal:AbortSignal.any([controller.signal,AbortSignal.timeout(20000)]),headers:{Accept:'application/json'}});const parsed=parseDashboard(await response.json());if(stopped)return;if(!response.ok||!parsed.cacheAvailable){setState(previous=>({data:previous.data.profiles.some(p=>p.fetchedAt)?previous.data:parsed,loading:false,error:true}));return;}setState({data:parsed,loading:false,error:false});if(!followup&&parsed.profiles.some(p=>p.refreshing))timer=setTimeout(()=>void load(true),12000)}catch{if(!stopped)setState(previous=>({...previous,loading:false,error:true}))}}
 void load();return()=>{stopped=true;controller.abort();clearTimeout(timer)};
 },[]);
 return <Context.Provider value={state}>{children}</Context.Provider>;
}
export const useCodingStats=()=>useContext(Context);
