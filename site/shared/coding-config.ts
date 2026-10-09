export const platforms = ['leetcode', 'codechef', 'gfg', 'codolio'] as const;
export type Platform = typeof platforms[number];
// Public configuration only. Credentials, if ever needed, belong in Worker secrets.
export const codingConfig = {
  refreshSeconds: 6 * 60 * 60,
  timeoutMs: 8000,
  retrySeconds: 30 * 60,
  profiles: [
    {platform:'leetcode',name:'LeetCode',username:'Dracon24',profileUrl:'https://leetcode.com/u/Dracon24/',providerUrl:'https://leetcode-stats.tashif.codes',sourceName:'Tashif LeetCode Stats API'},
    {platform:'codechef',name:'CodeChef',username:'rishukm04',profileUrl:'https://www.codechef.com/users/rishukm04',providerUrl:'https://codechef-stats.tashif.codes',sourceName:'Tashif CodeChef Stats API'},
    {platform:'gfg',name:'GeeksforGeeks',username:'rishugjt0',profileUrl:'https://www.geeksforgeeks.org/profile/rishugjt0',providerUrl:'https://gfg-stats.tashif.codes',sourceName:'Tashif GFG Stats API'},
    {platform:'codolio',name:'Codolio',username:'dracon24',profileUrl:'https://codolio.com/profile/dracon24',providerUrl:null,sourceName:null},
  ] satisfies ProfileConfig[],
};
export interface ProfileConfig {platform:Platform;name:string;username:string;profileUrl:string;providerUrl:string|null;sourceName:string|null}
