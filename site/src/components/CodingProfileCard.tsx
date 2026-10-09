import {ArrowUpRight,Code2,ChefHat,BookOpen,Layers} from 'lucide-react';
import type {CodingProfile} from '../data/codingProfiles';
import type {PlatformStats} from '../../shared/coding-types';
import {cardView,statusLabel} from '../data/codingStatsView';
export function CodingProfileCard({data,statistics,loading=false,error=false}:{data:CodingProfile;statistics:PlatformStats;loading?:boolean;error?:boolean}){
 const Icon=data.slug==='leetcode'?Code2:data.slug==='codechef'?ChefHat:data.slug==='gfg'?BookOpen:Layers;
 const view=cardView(statistics);
 return <article className={`coding-card ${data.slug}`} aria-busy={loading}>
  <div className="coding-top"><div className="platform-icon"><Icon size={21}/></div><h3>{data.name}</h3><a href={data.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${data.name} profile`}><ArrowUpRight size={19}/></a></div>
  <div className="coding-label">{view.label}</div><div className={`coding-value${view.value==='Unavailable'?' unavailable-value':''}`}>{view.value}</div><div className="coding-title">{view.title||'\u00a0'}</div>
  {view.rows.length>0&&<div className="coding-stats">{view.rows.map(s=><div key={s.label}><span>{s.label}</span><strong>{s.value}</strong></div>)}</div>}
  {view.breakdown&&<div className="difficulty"><div className="difficulty-bar" role="img" aria-label={view.breakdown.map(b=>`${b.count} ${b.label.toLowerCase()}`).join(', ')+' problems solved'}>{view.breakdown.map(b=><span key={b.label} className={b.label.toLowerCase()} style={{flex:b.count}}/>)}</div><div className="difficulty-labels">{view.breakdown.map(b=><span key={b.label}><i className={b.label.toLowerCase()}/>{b.label} <strong>{b.count}</strong></span>)}</div></div>}
  {data.description&&<p className="coding-description">{data.description}</p>}
  <div className="coding-update" role="status"><span className={loading?'stats-checking':''}>{statusLabel(statistics,loading,error)}</span>{statistics.fetchedAt&&<time dateTime={statistics.fetchedAt} title={new Date(statistics.fetchedAt).toLocaleString()}>{statistics.status==='stale'?`Last fetched ${new Date(statistics.fetchedAt).toLocaleDateString()}`:null}</time>}</div>
  <a className="coding-profile-link" href={data.url} target="_blank" rel="noopener noreferrer">View profile <ArrowUpRight size={15}/></a>
 </article>;
}
