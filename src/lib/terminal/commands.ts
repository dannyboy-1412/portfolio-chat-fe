import {
  CONTACT_NAV_LINK,
  EXPERIENCES,
  getExperienceById,
  getExperienceSuggestions,
  PROFILE,
  SKILL_GROUPS,
} from '@/shared/profile'
import { getProjectBySlug, getProjectSuggestions, PROJECTS } from '@/shared/projects'
import { registerCommand } from './registry'
import type {
  CommandContext,
  CommandResult,
  TerminalAction,
  TerminalSegment,
  TerminalSegmentTone,
} from './types'

function line(text: string, tone?: TerminalSegmentTone): TerminalSegment {
  return { kind: 'line', text, tone }
}

function blank(): TerminalSegment {
  return { kind: 'blank' }
}

function link(label: string, action: TerminalAction): TerminalSegment {
  return { kind: 'link', label, action }
}

function output(segments: TerminalSegment[]): CommandResult {
  return { kind: 'output', segments }
}

function unknownCommandResult(command: string): CommandResult {
  return output([
    line(`Command not found: ${command}`, 'error'),
    line('Type `help` to see available commands.', 'muted'),
  ])
}

registerCommand({
  name: 'help',
  summary: 'Show available commands',
  handler: () => {
    const rows: [string, string][] = [
      ['about', 'Learn about Daniel'],
      ['projects', 'Explore projects'],
      ['experience', 'View professional experience'],
      ['skills', 'View technical skills'],
      ['start-chat', 'Start an AI conversation'],
      ['resume', 'View resume'],
      ['contact', 'Get in touch'],
      ['clear', 'Clear terminal'],
      ['whoami', 'About Daniel'],
      ['status', 'System status'],
    ]

    const segments: TerminalSegment[] = [line('Available commands:'), blank()]
    for (const [name, description] of rows) {
      segments.push(link(`${name.padEnd(12)} ${description}`, { type: 'run', command: name }))
    }
    segments.push(blank())
    segments.push(
      line('Tip: ask "<question>" and project <slug> also work.', 'muted')
    )
    return output(segments)
  },
})

registerCommand({
  name: 'whoami',
  summary: 'About Daniel',
  handler: () =>
    output([
      line(`${PROFILE.shortName} - ${PROFILE.role}`),
      line(PROFILE.tagline, 'accent'),
      line(PROFILE.location, 'muted'),
    ]),
})

registerCommand({
  name: 'status',
  summary: 'System status',
  handler: () =>
    output([
      line('SYSTEM STATUS', 'accent'),
      line(`availability: ${PROFILE.status}`),
      line(`location: ${PROFILE.location}`),
      line(`experience: ${PROFILE.yearsExperience}`),
      line('uptime: since 2021 · no major incidents', 'muted'),
    ]),
})

registerCommand({
  name: 'about',
  summary: 'Learn about Daniel',
  handler: () => ({
    kind: 'action',
    action: { type: 'scroll', targetId: 'about' },
    segments: [
      line(PROFILE.pitch),
      blank(),
      ...PROFILE.education.map((item) => line(item, 'muted')),
      blank(),
      link('View About section', { type: 'scroll', targetId: 'about' }),
    ],
  }),
})

registerCommand({
  name: 'projects',
  summary: 'Explore projects',
  handler: () => ({
    kind: 'action',
    action: { type: 'scroll', targetId: 'work' },
    segments: [
      line('Selected work:'),
      blank(),
      ...PROJECTS.flatMap((project) => [
        link(`~/projects/${project.slug}  - ${project.tagline}`, {
          type: 'navigate',
          href: `/projects/${project.slug}`,
        }),
      ]),
      blank(),
      line('Use `project <slug>` for details on one, e.g. `project mesha`.', 'muted'),
    ],
  }),
})

registerCommand({
  name: 'project',
  summary: 'View a specific project',
  handler: (ctx: CommandContext) => {
    const slug = ctx.args[0]?.toLowerCase()
    if (!slug) {
      return output([
        line('Usage: project <slug>', 'error'),
        line(`Available: ${PROJECTS.map((p) => p.slug).join(', ')}`, 'muted'),
      ])
    }

    const project = getProjectBySlug(slug)
    if (!project) {
      return output([
        line(`No project found for "${slug}".`, 'error'),
        line(`Available: ${PROJECTS.map((p) => p.slug).join(', ')}`, 'muted'),
      ])
    }

    return {
      kind: 'action',
      action: { type: 'navigate', href: `/projects/${project.slug}` },
      segments: [
        line(`${project.name} - ${project.tagline}`, 'accent'),
        line(project.description),
        blank(),
        line(`tech: ${project.technologies.join(', ')}`, 'muted'),
        ...project.impact.map((item) => line(`+ ${item}`, 'muted')),
        blank(),
        link('View full case study', { type: 'navigate', href: `/projects/${project.slug}` }),
        link('Ask Daniel about this', {
          type: 'open-chat',
          context: { type: 'project', id: project.slug },
        }),
      ],
    }
  },
})

registerCommand({
  name: 'experience',
  summary: 'View professional experience',
  handler: () => ({
    kind: 'action',
    action: { type: 'scroll', targetId: 'experience' },
    segments: [
      line('Professional experience:'),
      blank(),
      ...EXPERIENCES.flatMap((job, index) => [
        line(
          `${String(index + 1).padStart(2, '0')} ${job.company} - ${job.role} (${job.period})`,
          'accent'
        ),
        line(`   ${job.keyMetric}`, 'muted'),
      ]),
      blank(),
      link('View Experience section', { type: 'scroll', targetId: 'experience' }),
    ],
  }),
})

registerCommand({
  name: 'skills',
  summary: 'View technical skills',
  handler: () => ({
    kind: 'action',
    action: { type: 'scroll', targetId: 'skills' },
    segments: [
      line('Technical profile:'),
      blank(),
      ...SKILL_GROUPS.flatMap((group) => [
        line(`${group.title}:`, 'accent'),
        line(`  ${group.skills.join(', ')}`, 'muted'),
      ]),
    ],
  }),
})

registerCommand({
  name: 'contact',
  summary: 'Get in touch',
  handler: () => ({
    kind: 'action',
    action: { type: 'scroll', targetId: CONTACT_NAV_LINK.id },
    segments: [
      line('Contact:'),
      line(PROFILE.socials.email, 'accent'),
      link('GitHub', { type: 'navigate', href: PROFILE.socials.github }),
      link('LinkedIn', { type: 'navigate', href: PROFILE.socials.linkedin }),
    ],
  }),
})

registerCommand({
  name: 'resume',
  summary: 'View resume',
  handler: () => ({
    kind: 'action',
    action: { type: 'navigate', href: PROFILE.socials.resume },
    segments: [line('Opening resume…', 'muted')],
  }),
})

registerCommand({
  name: 'clear',
  summary: 'Clear terminal',
  handler: () => ({ kind: 'clear' }),
})

function startChat(ctx: CommandContext): CommandResult {
  const contextArg = ctx.args.find((arg) => arg.startsWith('--context='))
  const contextSlug = contextArg?.split('=')[1]?.toLowerCase()

  const segments: TerminalSegment[] = [
    line('Initializing connection to DANIEL.AI…', 'muted'),
    line('Loading portfolio context…', 'muted'),
  ]

  if (!contextSlug) {
    segments.push(line('Connected.', 'accent'))
    return { kind: 'action', action: { type: 'open-chat', context: null }, segments }
  }

  const project = getProjectBySlug(contextSlug)
  if (project) {
    segments.push(line(`Context: project/${project.slug}`, 'accent'))
    return {
      kind: 'action',
      action: { type: 'open-chat', context: { type: 'project', id: project.slug } },
      segments,
    }
  }

  const experience = getExperienceById(contextSlug)
  if (experience) {
    segments.push(line(`Context: experience/${experience.id}`, 'accent'))
    return {
      kind: 'action',
      action: { type: 'open-chat', context: { type: 'experience', id: experience.id } },
      segments,
    }
  }

  segments.push(line(`Unknown context "${contextSlug}", starting general chat.`, 'error'))
  return { kind: 'action', action: { type: 'open-chat', context: null }, segments }
}

registerCommand({
  name: 'start-chat',
  summary: 'Start an AI conversation',
  handler: startChat,
})

registerCommand({
  name: 'chat',
  summary: 'Start an AI conversation',
  handler: startChat,
  hidden: true,
})

registerCommand({
  name: 'ask',
  summary: 'Ask Daniel AI a question',
  handler: (ctx: CommandContext) => {
    const question = ctx.args.join(' ').trim()
    if (!question) {
      return output([line('Usage: ask "<question>"', 'error')])
    }
    return {
      kind: 'action',
      action: { type: 'open-chat', prompt: question },
      segments: [line(`Asking Daniel AI: "${question}"`, 'muted')],
    }
  },
})

export { unknownCommandResult }

/** Re-exported for tests / UI to build contextual suggestions after `project`/`experience` output. */
export { getProjectSuggestions, getExperienceSuggestions }
