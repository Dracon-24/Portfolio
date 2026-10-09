import test from 'node:test';
import assert from 'node:assert/strict';
import {refreshSnapshot} from '../server/pages-snapshot';
test('Pages refresh preserves successful data and timestamp when one provider fails',async()=>{
 const before=await refreshSnapshot(undefined,async()=>({problemsSolved:123}), '2026-10-09T00:00:00.000Z');
 const after=await refreshSnapshot(before,async config=>{if(config.platform==='leetcode')throw new Error('Rate limited');return {problemsSolved:124}},'2026-10-09T06:00:00.000Z');
 assert.equal(after.profiles[0].status,'stale');
 assert.equal(after.profiles[0].statistics.problemsSolved,123);
 assert.equal(after.profiles[0].fetchedAt,before.profiles[0].fetchedAt);
 assert.equal(after.profiles[1].statistics.problemsSolved,124);
 assert.equal(after.profiles[1].statistics.currentRating,undefined);
 assert.equal(after.profiles[3].status,'unavailable');
});
test('Pages cold failure labels owner supplied data as fallback',async()=>{
 const result=await refreshSnapshot(undefined,async()=>{throw new Error('Unavailable')});
 assert.equal(result.profiles[0].status,'fallback');
 assert.equal(result.profiles[0].fetchedAt,null);
});
