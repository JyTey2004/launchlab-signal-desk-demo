export function escapeHtml(value) { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
export function summarize(events) {
  const result = {}, sessions = {};
  for (const event of events) {
    if (!/^[a-z][a-z0-9_]{2,39}$/.test(event.name)) continue;
    result[event.name] ??= {occurrences:0,sessions:0}; sessions[event.name] ??= new Set();
    result[event.name].occurrences++; sessions[event.name].add(event.session);
    result[event.name].sessions = sessions[event.name].size;
  }
  return result;
}
export function downloadJson(value, filename) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function initValidation({project, goalEvent, labels = {}}) {
  const key = `launchlab-demo:${project}:v1`; const session = crypto.randomUUID();
  let consent=false, viewRecorded=false, usingHosted=false, events=[], feedback=[];
  try { const saved=JSON.parse(localStorage.getItem(key)); if(saved){events=Array.isArray(saved.events)?saved.events.slice(-400):[];feedback=Array.isArray(saved.feedback)?saved.feedback.slice(-50):[];} } catch { /* browser memory fallback */ }
  const root = document.getElementById('validation-root'); root.className='validation';
  root.innerHTML=`<details><summary>LaunchLab · Local observations & feedback</summary><div class="validation-content"><section><div class="notice">This rehearsal saves optional anonymous actions and feedback in this browser only. It does not establish customer traction. Hosted collection is added by LaunchLab at deployment.</div><p id="consent-label">Activity recording is off.</p><div class="consent-actions"><button class="button secondary" id="allow-activity">Allow local recording</button><button class="button ghost" id="decline-activity">Keep recording off</button></div><div class="events" id="local-events"></div><div class="actions"><button class="button secondary" id="export-observations">Download observations</button><button class="button ghost" id="clear-observations">Clear this browser’s observations</button></div><p class="status" role="status" id="observations-status"></p></section><section><h3>Help shape this experiment</h3><p>Feedback works with recording off. Please leave out personal information.</p><form class="feedback-form" id="local-feedback"><label>How easy was the task?<select name="rating"><option value="5">5 — Very easy</option><option value="4">4 — Easy</option><option value="3">3 — Okay</option><option value="2">2 — Difficult</option><option value="1">1 — Very difficult</option></select></label><label>Would you use this?<select name="intent"><option value="yes">Yes</option><option value="maybe">Maybe</option><option value="no">No</option></select></label><label>What worked, or what got in your way?<textarea name="comment" maxlength="600" minlength="5" required placeholder="What would you change?"></textarea></label><button class="button" type="submit">Save local feedback</button><p class="status" role="status" id="feedback-status"></p></form><p id="hosted-feedback" hidden>Shared feedback is collected by the LaunchLab widget on this hosted preview.</p></section></div></details>`;
  const get=id=>root.querySelector(`#${id}`);
  const save=()=>{try{localStorage.setItem(key,JSON.stringify({events,feedback}));return true;}catch{return false;}};
  const render=()=>{const totals=summarize(events);get('local-events').textContent=Object.entries(totals).map(([name,n])=>`${labels[name]||name}: ${n.occurrences} actions across ${n.sessions} local sessions`).join('\n')||'No recorded actions in this browser.';get('local-events').style.whiteSpace='pre-line';};
  const hostedReady=()=>Boolean(document.getElementById('__launchlab')?.shadowRoot?.querySelector('.launcher'));
  const syncHosted=()=>{const hosted=hostedReady();if(hosted===usingHosted)return;usingHosted=hosted;get('local-feedback').hidden=hosted;get('hosted-feedback').hidden=!hosted;get('allow-activity').hidden=hosted;get('decline-activity').hidden=hosted;consent=false;get('consent-label').textContent=hosted?'Shared activity recording is managed by the LaunchLab widget. Open Share feedback → Tracking preferences to review your consent.':'Local browser recording is off. Feedback still works.';};
  get('allow-activity').onclick=()=>{if(hostedReady()){syncHosted();return;}consent=true;get('consent-label').textContent='Local browser recording is on for this page session.';if(!viewRecorded){viewRecorded=true;track('page_view');}};
  get('decline-activity').onclick=()=>{if(hostedReady()){syncHosted();return;}consent=false;get('consent-label').textContent='Local browser recording is off. Feedback still works. Hosted recording has separate consent.';};
  get('export-observations').onclick=()=>downloadJson({project,mode:'local-rehearsal',goalEvent,exportedAt:new Date().toISOString(),counts:summarize(events),events,feedback},`${project}-local-observations.json`);
  get('clear-observations').onclick=()=>{events=[];feedback=[];save();render();get('observations-status').textContent='Local observations cleared. Product state is unchanged.';};
  get('local-feedback').onsubmit=e=>{e.preventDefault();const form=new FormData(e.currentTarget);const comment=String(form.get('comment')||'').trim();if(comment.length<5){get('feedback-status').textContent='Please add at least five characters of feedback.';return;}const response={session,rating:Number(form.get('rating')),intent:String(form.get('intent')),comment,at:new Date().toISOString()};const i=feedback.findIndex(v=>v.session===session);if(i<0)feedback.push(response);else feedback[i]=response;feedback=feedback.slice(-50);const stored=save();get('feedback-status').textContent=i<0?`Feedback saved ${stored?'in this browser':'for this page session'}.`:'Your existing feedback was updated; it was not counted twice.';};
  function track(name) {if(!/^[a-z][a-z0-9_]{2,39}$/.test(name))return;syncHosted();if(hostedReady()&&globalThis.LaunchLab?.state?.().configured)globalThis.LaunchLab.track?.(name);if(consent){events.push({name,session,at:new Date().toISOString()});events=events.slice(-400);save();render();}}
  document.addEventListener('click',e=>{const el=e.target.closest?.('[data-launchlab-event]');if(el&&consent){const name=el.dataset.launchlabEvent;if(/^[a-z][a-z0-9_]{2,39}$/.test(name)){events.push({name,session,at:new Date().toISOString()});events=events.slice(-400);save();render();}}});
  render();syncHosted();const observer=new MutationObserver(syncHosted);observer.observe(document.body,{childList:true,subtree:true});globalThis.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
  return {track};
}
