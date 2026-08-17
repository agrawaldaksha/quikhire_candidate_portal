// ============================================================
// Kairo adaptive screening engine.
//
// This is a deterministic stand-in for a live LLM: instead of a
// fixed question list, the NEXT question is *computed* from what
// the candidate has already told Kai. Options, phrasing, skill
// suggestions and the salary benchmark all adapt to prior answers,
// so the conversation feels generated rather than scripted.
// Swapping this for a real model later means replacing `nextStep`
// with an API call that returns the same shape.
// ============================================================

const FOCUS_BY_ROLE = {
  Engineering: ['Frontend', 'Backend', 'Full-stack', 'Mobile', 'ML / AI', 'DevOps / Platform', 'Security'],
  Product: ['0→1 / Early stage', 'Growth', 'Platform', 'B2B SaaS', 'Consumer', 'AI products'],
  Design: ['Product / UX', 'Design Systems', 'Brand / Visual', 'UX Research', 'Motion'],
  'Data / ML': ['Data Science', 'ML Engineering', 'Data Engineering', 'Analytics', 'Applied Research'],
  'Sales / GTM': ['Account Executive', 'SDR / BDR', 'Sales Engineering', 'Partnerships', 'Sales Leadership'],
  Marketing: ['Growth', 'Content', 'Product Marketing', 'Brand', 'Performance'],
  Operations: ['BizOps', 'RevOps', 'People / HR', 'Finance', 'Program Mgmt'],
  Other: ['Individual contributor', 'People management', 'Strategy', 'Generalist'],
}

const SKILLS_BY_FOCUS = {
  Frontend: ['React', 'TypeScript', 'Next.js', 'CSS / Design systems', 'Testing', 'Accessibility', 'Performance'],
  Backend: ['Go', 'Python', 'Node.js', 'Postgres', 'Distributed systems', 'APIs', 'Kafka'],
  'Full-stack': ['React', 'TypeScript', 'Node.js', 'Postgres', 'System design', 'CI/CD', 'AWS'],
  Mobile: ['Swift', 'Kotlin', 'React Native', 'Flutter', 'Mobile CI', 'Offline sync'],
  'ML / AI': ['PyTorch', 'LLMs', 'Evals', 'RAG', 'MLOps', 'Fine-tuning', 'Vector DBs'],
  'DevOps / Platform': ['Kubernetes', 'Terraform', 'AWS', 'Observability', 'CI/CD', 'Security'],
  Security: ['AppSec', 'Threat modeling', 'IAM', 'Cloud security', 'Pen testing'],
  '0→1 / Early stage': ['Discovery', 'Roadmapping', 'User research', 'MVP scoping', 'GTM', 'Analytics'],
  Growth: ['Experimentation', 'Funnels', 'Retention', 'SQL', 'A/B testing', 'Activation'],
  'B2B SaaS': ['Enterprise UX', 'Integrations', 'Onboarding', 'Analytics', 'Roadmapping'],
  'AI products': ['LLM UX', 'Evals', 'Prompt design', 'Data flywheels', 'Trust & safety'],
  'Product / UX': ['Figma', 'Prototyping', 'User research', 'Design systems', 'Interaction design', 'IA'],
  'Design Systems': ['Tokens', 'Component libraries', 'Figma', 'Documentation', 'Accessibility', 'Front-end handoff'],
  'Brand / Visual': ['Identity', 'Typography', 'Illustration', 'Motion', 'Art direction'],
  'UX Research': ['Interviews', 'Usability testing', 'Surveys', 'Synthesis', 'Research ops'],
  'Data Science': ['Python', 'SQL', 'Statistics', 'Experimentation', 'Visualization', 'ML'],
  'ML Engineering': ['PyTorch', 'MLOps', 'Feature stores', 'Serving', 'Evals', 'Python'],
  'Data Engineering': ['Spark', 'dbt', 'Airflow', 'SQL', 'Warehouses', 'Streaming'],
  Analytics: ['SQL', 'dbt', 'Dashboards', 'Experimentation', 'Storytelling'],
  'Account Executive': ['Discovery', 'Negotiation', 'Pipeline', 'Forecasting', 'Enterprise sales'],
  default: ['Communication', 'Stakeholder management', 'Analytics', 'Strategy', 'Execution', 'Leadership'],
}

const ROLE_SALARY_BASE = {
  Engineering: 150, Product: 145, Design: 120, 'Data / ML': 155,
  'Sales / GTM': 130, Marketing: 110, Operations: 115, Other: 115,
}
const EXP_MULT = { '0–2 years': 0.7, '3–5 years': 1.0, '6–9 years': 1.35, '10+ years': 1.7 }

const round5 = (n) => Math.round(n / 5) * 5

export function skillsFor(answers) {
  const list = SKILLS_BY_FOCUS[answers.focus] || SKILLS_BY_FOCUS.default
  return list.slice(0, 7)
}

export function benchmark(answers) {
  const base = ROLE_SALARY_BASE[answers.role] || 120
  const mult = EXP_MULT[answers.experience] || 1
  const lead = answers.seniority === 'Leadership' ? 1.15 : 1
  const p50 = round5(base * mult * lead)
  const target = round5(p50 * 1.17)
  const p90 = round5(p50 * 1.42)
  return { p50, target, p90 }
}

// Small helper so phrasing varies with the answer rather than being fixed.
const pick = (arr, seed) => arr[seed % arr.length]

// The core: given everything answered so far, return the next question — or null when done.
export function nextStep(answers, name = '') {
  const first = (name || '').split(' ')[0]

  if (answers.role === undefined) {
    return {
      key: 'role',
      type: 'chips',
      text: `${first ? `Great to meet you, ${first}. ` : ''}I’m Kai — think of me as your agent, working the search so you don’t have to. To start: which world are you looking to work in?`,
      options: Object.keys(FOCUS_BY_ROLE),
    }
  }

  if (answers.focus === undefined) {
    const opts = FOCUS_BY_ROLE[answers.role] || FOCUS_BY_ROLE.Other
    return {
      key: 'focus',
      type: 'chips',
      text: `${answers.role} — love it. Which flavour of ${answers.role.toLowerCase()} is closest to what you want to do next?`,
      options: opts,
    }
  }

  if (answers.experience === undefined) {
    return {
      key: 'experience',
      type: 'chips',
      text: `And roughly how much experience do you have in ${answers.focus}?`,
      options: ['0–2 years', '3–5 years', '6–9 years', '10+ years'],
    }
  }

  // Adaptive branch on seniority
  if (answers.seniority === undefined) {
    if (answers.experience === '0–2 years') {
      return {
        key: 'seniority',
        type: 'chips',
        text: `Early in the journey — exciting. Are you open to junior or apprentice roles to get into a great ${answers.focus} team?`,
        options: ['Yes, open to it', 'Only mid-level+', 'Depends on the team'],
      }
    }
    return {
      key: 'seniority',
      type: 'chips',
      text: `With ${answers.experience} in, what’s the next step you want — going deeper as an individual contributor, or moving into leadership?`,
      options: ['IC / deep craft', 'Leadership', 'Either — show me both'],
    }
  }

  if (answers.workMode === undefined) {
    return {
      key: 'workMode',
      type: 'chips',
      text: 'How do you want to work? I’ll only surface roles that fit.',
      options: ['Remote', 'Hybrid', 'On-site', 'Flexible / open'],
    }
  }

  if (answers.salaryTarget === undefined) {
    return {
      key: 'salaryTarget',
      type: 'text',
      text: `What are you targeting for total comp? A rough number is fine — I’ll benchmark it against real ${answers.role} offers for you.`,
      placeholder: 'e.g. $160k, or “not sure — tell me”',
      hint: 'You can say “not sure” and I’ll suggest a target.',
    }
  }

  if (answers.priorities === undefined) {
    const bench = benchmark(answers)
    return {
      key: 'priorities',
      type: 'multi',
      text: `Thanks. Here’s what the market looks like for you — now, what actually matters most in your next role? Pick your top few.`,
      options: ['Compensation', 'Scope & ownership', 'Growth & learning', 'Mission', 'Work–life balance', 'Team & culture', 'Stability'],
      insight: { kind: 'salary', ...bench },
    }
  }

  if (answers.skills === undefined) {
    return {
      key: 'skills',
      type: 'multi',
      text: `Almost there. Tap the skills you’d call your strongest — I’ll weight matches around them.`,
      options: skillsFor(answers),
    }
  }

  if (answers.availability === undefined) {
    return {
      key: 'availability',
      type: 'chips',
      text: pick(
        ['When could you start?', 'And timing — how soon are you looking to move?'],
        (answers.skills?.length || 0),
      ),
      options: ['Immediately', 'Within a month', '2–3 months', 'Just exploring'],
    }
  }

  if (answers.motivation === undefined) {
    return {
      key: 'motivation',
      type: 'text',
      text: `Last one, and it’s the one I care about most: in a sentence — what would make your next role feel like the right one?`,
      placeholder: 'Type whatever’s true for you…',
    }
  }

  return null // complete
}

// Kai's little acknowledgement after each answer — varies with content.
export function ack(key, value, answers) {
  switch (key) {
    case 'role': return `${value} it is.`
    case 'focus': return `Noted — ${value}. That narrows things down nicely.`
    case 'experience': return `${value} — got it.`
    case 'seniority':
      return value === 'Leadership' ? 'Leadership track — I’ll prioritise scope and team size.'
        : value.startsWith('IC') ? 'Deep-craft roles it is — I’ll skip the people-management noise.'
        : 'I’ll bring you both and you can tell me what feels right.'
    case 'workMode': return `${value} — locked in.`
    case 'salaryTarget': return 'Let me benchmark that for you…'
    case 'priorities': return `Good to know — I’ll rank matches around ${(Array.isArray(value) ? value.slice(0, 2).join(' and ') : value).toLowerCase()}.`
    case 'skills': return `Perfect. ${Array.isArray(value) ? value.length : 0} skills weighted in.`
    case 'availability':
      return value === 'Just exploring' ? 'No pressure — I’ll keep an eye out and ping you when something’s worth it.' : `${value} — I’ll move accordingly.`
    default: return 'Got it.'
  }
}
