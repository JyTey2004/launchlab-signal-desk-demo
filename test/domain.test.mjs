import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateBrief,validateRequest,restoreHistory} from '../src/domain.js';

test('invalid or underspecified requests do not generate reports',()=>{
  assert.match(validateRequest('product','Too short'),/60/);
  assert.match(validateRequest('unavailable','x'.repeat(100)),/available/);
  assert.match(validateRequest('dao','x'.repeat(3001)),/3,000/);
  assert.throws(()=>evaluateBrief('dao',''),/60/);
});
test('product report finds gaps and requests observable evidence',()=>{
  const report=evaluateBrief('product','A beautiful experience bringing the future to every screen, with revolutionary technology and a vibrant new aesthetic.');
  assert.equal(report.score,0);
  assert.equal(report.factors.filter(f=>!f.present).length,6);
  assert.ok(report.nextSteps.some(step=>step.includes('people')));
  assert.match(report.limitations,/does not verify/);
});
test('a complete product experiment reflects its actual brief',()=>{
  const brief='Creators struggle with manual event registration. Users create a demo pass. Invite 20 testers from a Telegram community and track completion plus opt-in feedback. No real funds.';
  const report=evaluateBrief('product',brief);
  assert.equal(report.score,100);
  assert.equal(report.brief,brief);
  assert.match(report.summary,/keywords do not establish readiness/);
});
test('DAO rubric distinguishes a budget from authorization and accountability',()=>{
  const report=evaluateBrief('dao','Our initiative will build a new community resource with a budget of 2000 USDC and launch it over four weeks.');
  assert.equal(report.factors.find(f=>f.key==='budget').present,true);
  assert.equal(report.factors.find(f=>f.key==='owner').present,false);
  assert.equal(report.factors.find(f=>f.key==='decision').present,false);
  assert.ok(report.nextSteps.some(s=>s.includes('approves')));
});
test('history rejects corrupt entries and does not restore arbitrary properties',()=>{
  const valid={id:'a',createdAt:'2026-10-01',service:'product',brief:'A sufficiently detailed description of a project for our initial review and first user test.',rating:99,secret:'never restore'};
  const restored=restoreHistory([null,{service:'unknown'},valid]);
  assert.equal(restored.length,1);
  assert.equal(restored[0].rating,null);
  assert.equal(restored[0].secret,undefined);
  assert.deepEqual(restoreHistory({}),[]);
});
