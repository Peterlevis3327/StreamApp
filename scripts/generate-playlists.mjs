import {execSync} from 'node:child_process'
import {mkdirSync, readdirSync, readFileSync, statSync, writeFileSync} from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const repoRoot = path.resolve(__dirname, '../../..')
const streamsDir = path.join(repoRoot, 'streams')
const outputDir = path.resolve(__dirname, '../src/data/generated')

function getRecencyMap() {
  const recencyMap = new Map()

  try {
    const output = execSync('git log --format=%cI --name-only -- streams/*.m3u', {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    })

    let currentDate = null
    for (const line of output.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed) {
        continue
      }

      if (/^\d{4}-\d{2}-\d{2}T/.test(trimmed)) {
        currentDate = trimmed
        continue
      }

      if (trimmed.startsWith('streams/') && trimmed.endsWith('.m3u') && currentDate) {
        if (!recencyMap.has(trimmed)) {
          recencyMap.set(trimmed, currentDate)
        }
      }
    }
  } catch {
    // Fallback to filesystem mtime when git history is unavailable.
  }

  return recencyMap
}

function parseAttributes(line) {
  const attrs = {}
  const attrRegex = /([A-Za-z0-9_-]+)="([^"]*)"/g

  let match
  while ((match = attrRegex.exec(line)) !== null) {
    attrs[match[1]] = match[2]
  }

  return attrs
}

function sportTagsFor(name, groupTitle) {
  const haystack = `${name ?? ''} ${groupTitle ?? ''}`
  const tags = []

  const rules = [
    ['football', /\bfootball\b/i],
    ['soccer', /\bsoccer\b/i],
    ['tennis', /\btennis\b/i],
    ['premier_league', /\bpremier\s*league\b/i],
    ['uefa_champions_league', /\buefa\s*champions\s*league\b|\bucl\b/i],
    ['supersport', /\bsupersport\b/i],
    ['other_sport', /\bnba\b|\bnfl\b|\bcricket\b|\bgolf\b|\brugby\b|\bboxing\b|\bmma\b/i]
  ]

  for (const [tag, regex] of rules) {
    if (regex.test(haystack)) {
      tags.push(tag)
    }
  }

  return tags
}

function parsePlaylistFile(fileName, score) {
  const filePath = path.join(streamsDir, fileName)
  const content = readFileSync(filePath, 'utf8')
  const lines = content.split(/\r?\n/)

  const channels = []
  let pending = null

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim()
    if (!line) {
      continue
    }

    if (line.startsWith('#EXTINF:')) {
      const attrs = parseAttributes(line)
      const commaIndex = line.indexOf(',')
      const displayName = commaIndex >= 0 ? line.slice(commaIndex + 1).trim() : attrs['tvg-name'] || 'Unknown Channel'

      pending = {
        name: displayName,
        tvgId: attrs['tvg-id'] || undefined,
        tvgName: attrs['tvg-name'] || undefined,
        logo: attrs['tvg-logo'] || undefined,
        groupTitle: attrs['group-title'] || undefined
      }

      continue
    }

    if (line.startsWith('#')) {
      continue
    }

    if (!pending) {
      continue
    }

    const playlist = fileName
    const [country, provider] = fileName.replace('.m3u', '').split('_')
    const tags = sportTagsFor(pending.name, pending.groupTitle)
    const metadataSports = /\bsports?\b/i.test(pending.groupTitle ?? '')

    channels.push({
      id: `${playlist}:${pending.tvgId ?? pending.name}:${channels.length}`,
      name: pending.name,
      url: line,
      tvgId: pending.tvgId,
      tvgName: pending.tvgName,
      logo: pending.logo,
      groupTitle: pending.groupTitle,
      playlist,
      provider,
      country,
      isSports: metadataSports || tags.length > 0,
      sportsTags: tags,
      sourceRecencyScore: score
    })

    pending = null
  }

  return channels
}

function main() {
  mkdirSync(outputDir, {recursive: true})

  const playlistFiles = readdirSync(streamsDir)
    .filter(file => file.endsWith('.m3u'))
    .sort((a, b) => a.localeCompare(b))

  const recencyMap = getRecencyMap()
  const now = Date.now()

  const manifest = playlistFiles
    .map((file, index) => {
      const relative = `streams/${file}`
      const gitDate = recencyMap.get(relative)
      const updatedAt = gitDate || statSync(path.join(streamsDir, file)).mtime.toISOString()
      const score = Math.max(1, playlistFiles.length - index)

      return {file, updatedAt, score}
    })
    .sort((a, b) => {
      if (a.updatedAt !== b.updatedAt) {
        return a.updatedAt > b.updatedAt ? -1 : 1
      }

      return a.file.localeCompare(b.file)
    })
    .map((item, index, list) => ({
      ...item,
      score: list.length - index
    }))

  const scoreMap = new Map(manifest.map(item => [item.file, item.score]))

  const channels = manifest.flatMap(item => parsePlaylistFile(item.file, scoreMap.get(item.file) || 1))

  writeFileSync(path.join(outputDir, 'manifest.json'), JSON.stringify(manifest, null, 2))
  writeFileSync(path.join(outputDir, 'channels.json'), JSON.stringify(channels, null, 2))

  console.log(
    `Generated ${manifest.length} playlists and ${channels.length} channels in ${Date.now() - now}ms.`
  )
}

main()
