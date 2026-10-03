# Signal Desk · LaunchLab deployment demo

A small, standalone Vite frontend you can give to LaunchLab to test its **GitHub repository → framework inspection → approved tracking and feedback additions → deployment → shared results** journey.

Signal Desk itself is a fictional agent-service playground. Choose a product experiment or DAO proposal review, write a brief, generate a deterministic planning report, rate its usefulness and download it. It needs no API keys, backend, wallet or environment variables.

## Run and check the source

Use Node.js **22.12 or later** and npm.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run dev
```

Open `http://127.0.0.1:4413`. If this port is occupied by another copy, stop that server or use `npm run dev -- --port 4417`.

To serve the built app locally:

```sh
npm run preview
```

The deployment recipe is **Vite**, build command **`npm run build`**, output directory **`dist`**. `amplify.yml` supplies an equivalent npm-based static build. This repository does not create hosting resources when you run these commands.

## Give this repository to LaunchLab

Use **https://github.com/JyTey2004/launchlab-signal-desk-demo** in LaunchLab, or fork it and use your fork's HTTPS URL. Do not use the browser's local `127.0.0.1` address as the repository URL.

Use this experiment brief, changing the repository URL if you use a fork:

> Repository: https://github.com/JyTey2004/launchlab-signal-desk-demo
>
> Project: signal-desk-demo
>
> Question: Can a first-time builder generate a planning review and identify a useful next test without assistance?
>
> Audience: a small, founder-recruited group of early-stage builders.
>
> Framework expectation: Vite static frontend. Build with npm run build and publish dist.
>
> Goal: report_generated, the successful simulated-report outcome. report_requested measures button-click intent separately.
>
> Preserve the existing deterministic report, local history and optional local data controls. Add hosted LaunchLab consent-based activity collection and shared feedback in the approved build copy. Use the fixed events below and avoid duplicate tracking handlers. Ask users whether they identified a useful next test and what would make the review more useful. Treat our first rehearsal as internal testing, not customer traction. No real payments, wallet actions or live LLM calls are needed by the example app.

The expected founder journey is:

1. **Inspect:** submit the public GitHub URL. LaunchLab identifies a supported static Vite recipe and pins the source revision.
2. **Review:** inspect the proposed instrumentation, named events, feedback questions, build settings, changes and costs. `launchlab.experiment.json` is advisory metadata; it is **not imported automatically**.
3. **Approve:** approve the exact current plan before LaunchLab builds or hosts it. A changed plan or source needs new approval.
4. **Deploy:** LaunchLab adds approved collection to its build copy, builds and deploys through its supported pipeline. The current managed flow does not alter this GitHub repository.
5. **Rehearse:** open the returned preview with **`?test=1`** (or add `&test=1` to an existing query), choose consent, generate reports and submit feedback. The hosted tracker uses this parameter to label the controlled rehearsal as **Internal tests**. This plain local app does not interpret the parameter itself.
6. **Inspect results:** open the private founder report using the privately delivered report key. Choose **Internal tests**, compare action occurrences with completing sessions, and read actual feedback. Report keys must stay out of GitHub and public briefs.
7. **Invite participants:** share the approved preview with the intended audience, allowing each person to choose activity consent. Arrange recruitment yourself and keep any incentives or payout flow separately scoped. Internal rehearsals do not establish demand.

These steps describe the intended approved LaunchLab workflow. This repository alone is not evidence that a new remote deployment, paid task or complete unattended handoff succeeded. Hosting, model planning and marketplace charges are separate from this example's illustrated fee.

## Fixed events to configure in the approved plan

| Event | Meaning | Interpretation |
| --- | --- | --- |
| `report_requested` | Generate report button clicked, including invalid requests. | Intent only; not a successful report. |
| `report_generated` | A valid 60–3,000-character brief produced a simulated report. | Recommended experiment completion goal. |
| `helpfulness_rated` | A report usefulness rating button was selected. | An action count; the event does not include the numeric rating. |
| `review_revisited` | A saved review was reopened. | Revisit, not another generated report. |
| `report_exported` | JSON report download was requested. | Download intent, not proof the file was saved. |

The request button has a `data-launchlab-event="report_requested"` marker. Successful outcomes call the local adapter's `validation.track`. The adapter forwards explicit events to a configured mounted LaunchLab SDK when present; it does not install a collector itself. Hosted instrumentation should register the CTA marker once and preserve the explicit outcome calls, rather than adding a second tracking handler for the same action.

The named goal is an interaction outcome, not verified product validation. A keyword-rubric report must not be represented as real model advice or proven demand.

## Try the participant flow

1. Choose **Product signal review** and click **Use an example**.
2. Optionally expand **LaunchLab · Local observations & feedback** and allow local recording **before** repeating any measured actions.
3. Click **Generate report** and inspect the six planning factors. The example covers all six, yielding a completeness score of 100/100.
4. Rate the report's usefulness; this rates the output rather than the idea.
5. Download the report, reopen it from **Recent reviews**, and generate another valid report to compare repeated actions with session counts.
6. Leave specific feedback. Repeated local feedback submission in one page session updates the existing response.
7. Download local observations. This export remains browser-local and is distinct from a hosted founder report.

You can also choose **DAO proposal review** and load its separate example. The proposal text does not create governance actions or spend a treasury budget.

## What is real and what is simulated

- Report generation, brief validation, safe text rendering, local history, ratings and JSON exports work entirely in the browser.
- The report uses a transparent six-factor **deterministic keyword rubric**, not a live LLM. It does not verify facts, security, governance compliance, financial viability or customer demand.
- The displayed **0.01 USDT** fee is illustrative. This app has no checkout, wallet connection, payment, escrow, marketplace invocation or token reward.
- Up to eight reviews and their latest usefulness ratings are saved locally. History and optional observations/feedback are separate stores. Storage denial falls back to page memory.
- Optional local recording starts off after each page load. Consent is not retroactive. Repeated actions count occurrences; local session identifiers are not verified people or wallets.
- Local observations contain fixed event names, session IDs and timestamps, **not brief contents**. Review history and report exports contain the supplied brief. Keep secrets and personal information out of all inputs.
- The local feedback form works with recording off and stores one response per local page session. It yields to the real mounted LaunchLab widget when approved hosted instrumentation is added; a placeholder SDK object is insufficient.
- A hosted widget has its own consent and collector configuration. Its shared report remains separate from these browser-local stores. No hosted collector, endpoint or credential is preconfigured in this repository.
- **Clear history** removes local reviews and ratings. **Clear this browser's observations** removes the optional local event/feedback store. Neither action clears the other store.

## Repository contents and checks

This is an independently publishable frontend source repository. It excludes environment files, credentials, personal observations, dependency directories, generated build output and the main LaunchLab codebase. SVG/CSS artwork and styling are authored locally; no remote assets are required by the example.

```sh
npm test
npm run build
```

Domain tests cover invalid/short requests, planning gaps, six-factor scoring, separate DAO criteria and safe history restoration. Validation tests verify repeated action versus session counting and HTML escaping. Those checks verify the example code, not a live deployment or customer traction.
