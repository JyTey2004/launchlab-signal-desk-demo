export const SERVICES = {
  product: { name: 'Product signal review', subtitle: 'Turn an idea into a testable experiment', criteria: [
    {key:'audience',label:'Specific audience',patterns:[/\b(founders?|builders?|developers?|designers?|creators?|students?|merchants?|teams?|customers?|users?|members?|freelancers?)\b/i],why:'Name the people who experience this problem, including how you can reach them.'},
    {key:'problem',label:'Concrete problem',patterns:[/\b(struggle|difficult|friction|problem|pain|waste|manual|slow|expensive|confus|abandon|cannot|can.t|hours?|minutes?)\b/i],why:'Describe one costly or frustrating task using an example from a potential user.'},
    {key:'action',label:'Core user action',patterns:[/\b(create|submit|upload|connect|buy|checkout|register|complete|book|request|review|download|sign\s?up)\b/i],why:'Choose one action a first-time visitor should complete.'},
    {key:'measurement',label:'Observable success',patterns:[/\b(\d+\s?%|conversion|completion|retention|metric|measure|track|feedback|interview|testers?|sessions?)\b/i],why:'Define a completion metric and ask users what stopped them.'},
    {key:'distribution',label:'First participants',patterns:[/\b(community|discord|telegram|event|newsletter|recruit|invite|cohort|participants?|pilot)\b/i],why:'List a realistic source of initial participants before the test goes live.'},
    {key:'boundary',label:'Clear test boundary',patterns:[/\b(consent|privacy|demo|simulat|prototype|read.only|no\s+real|no\s+funds|opt.in)\b/i],why:'State what is simulated, what data is collected and how users give consent.'}
  ]},
  dao: { name: 'DAO proposal review', subtitle: 'Find missing decisions before a community vote', criteria: [
    {key:'objective',label:'Defined outcome',patterns:[/\b(outcome|goal|objective|deliver|launch|build|improve|reduce|increase)\b/i],why:'Specify the outcome the community will be able to verify.'},
    {key:'budget',label:'Budget and funding',patterns:[/\b(\d+(?:\.\d+)?\s?(USDC|USDT|ETH|USD|tokens?)|budget|treasury)\b/i],why:'Include a budget, currency, funding source and spending cap.'},
    {key:'owner',label:'Accountable owner',patterns:[/\b(owner|responsible|lead|working\s+group|accountable|maintainer)\b/i],why:'Name the role responsible for execution and reporting.'},
    {key:'milestones',label:'Timeline and checkpoints',patterns:[/\b(week|month|days?|milestone|deadline|checkpoint|phase)\b/i],why:'Split delivery into dated milestones with review checkpoints.'},
    {key:'decision',label:'Decision process',patterns:[/\b(quorum|vote|voting|approval|multisig|governance|majority)\b/i],why:'Define who approves the proposal and how spending is authorized.'},
    {key:'evidence',label:'Evidence and stop rule',patterns:[/\b(metric|measure|feedback|report|evidence|cancel|stop|refund|success|failure)\b/i],why:'Define evidence to report and the conditions for pausing or ending the initiative.'}
  ]}
};

export function validateRequest(service, brief) {
  if (!Object.hasOwn(SERVICES, service)) return 'Choose an available review service.';
  if (typeof brief !== 'string' || brief.trim().length < 60) return 'Add at least 60 characters so the review has enough context.';
  if (brief.trim().length > 3000) return 'Keep your brief within 3,000 characters.';
  return null;
}

export function evaluateBrief(service, brief) {
  const error = validateRequest(service, brief);
  if(error) throw new Error(error);
  const input = brief.trim();
  const factors = SERVICES[service].criteria.map(criterion => ({ key:criterion.key, label:criterion.label, present:criterion.patterns.some(pattern=>pattern.test(input)), recommendation:criterion.why }));
  const present = factors.filter(f=>f.present).length;
  const missing = factors.filter(f=>!f.present);
  const score = Math.round(present / factors.length * 100);
  return { service, serviceName:SERVICES[service].name, brief:input, score, factors,
    summary: missing.length ? `${present} of ${factors.length} planning signals were found. Add the missing details before recruiting participants or requesting approval.` : 'All six planning signals were found. Confirm the specifics with real users or the community; keywords do not establish readiness.',
    nextSteps: missing.length ? missing.map(f=>f.recommendation).slice(0,3) : service==='product' ? ['Invite a small initial cohort to attempt the core task without help.','Record completions and blockers with consent.','Compare feedback against your original success criterion.'] : ['Confirm the budget and authorization process with the community.','Publish milestone evidence at each checkpoint.','Use the defined stop rule when the outcome or timeline changes.'],
    limitations:'A deterministic keyword rubric produced this report. It does not verify facts, security, demand, financial viability or governance compliance.'
  };
}

export function restoreHistory(value) {
  if(!Array.isArray(value)) return [];
  return value.filter(item=>item && typeof item.id==='string' && typeof item.createdAt==='string' && !validateRequest(item.service,item.brief)).slice(0,8).map(item=>({id:item.id,createdAt:item.createdAt,service:item.service,brief:item.brief.trim(),rating:[1,2,3,4,5].includes(item.rating)?item.rating:null}));
}
