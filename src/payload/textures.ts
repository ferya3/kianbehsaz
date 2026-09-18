import sharp from 'sharp'

/**
 * Procedural material textures.
 *
 * The cinematic art direction needs an image in every slot, and the site has
 * no photography yet. Rather than ship grey boxes (or fake stock photos), the
 * seed generates abstract material surfaces — fired clay, structural block, a
 * facade module grid, kiln heat — in the site's own palette.
 *
 * They are generated, never committed: `npm run seed` produces them, Payload
 * stores them like any upload, and replacing one with a real photograph later
 * is an ordinary media replace with no code change.
 *
 * What makes them read as material rather than as a gradient is per-unit
 * variation: every brick face, bay and blot gets its own jittered tone from a
 * seeded PRNG, so the surface is irregular the way a real one is.
 */

export type TextureKind =
  | 'kiln'
  | 'clay'
  | 'block'
  | 'refractory'
  | 'concrete'
  | 'facade'
  | 'tower'
  | 'lab'

/** Deterministic PRNG (mulberry32) — the same seed always renders the same surface. */
function prng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Rgb = [number, number, number]

function mix(a: Rgb, b: Rgb, t: number): Rgb {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ]
}

const css = ([r, g, b]: Rgb) => `rgb(${r},${g},${b})`

type Recipe = {
  /** Darkest and lightest tone of the material itself. */
  range: [Rgb, Rgb]
  /** Units laid across the surface: bricks, blocks, bays. */
  units?: { w: number; h: number; gap: number; offset: boolean; radius?: number }
  /** Soft blots that give an unstructured surface its depth. */
  mottle?: { count: number; size: number; opacity: number }
  /** Heat or daylight bloom: colour, x%, y%, radius%, opacity. */
  bloom?: { color: string; x: number; y: number; r: number; opacity: number }
  /** A few lit windows, for the night-tower frame. */
  lights?: { color: string; chance: number; opacity: number }
  /** Fine noise strength, 0–1. */
  grain: number
  /** Coarse noise strength, 0–1. */
  mottleNoise: number
  vignette: number
}

const RECIPES: Record<TextureKind, Recipe> = {
  // Furnace mouth: near-black body with heat rising through it.
  kiln: {
    range: [
      [12, 10, 10],
      [86, 42, 24],
    ],
    // A kiln is a brick-lined chamber, so the hero frame gets coursing too —
    // without it the image is only a warm blur once it fills the viewport.
    // It stays dark: this frame carries the headline, not the other way round.
    units: { w: 268, h: 112, gap: 11, offset: true, radius: 2 },
    bloom: { color: '#ff7433', x: 52, y: 100, r: 76, opacity: 0.8 },
    grain: 0.55,
    mottleNoise: 0.5,
    vignette: 0.86,
  },
  // Fired clay in running bond: the company's own product, macro.
  clay: {
    range: [
      [58, 26, 17],
      [150, 71, 42],
    ],
    units: { w: 232, h: 96, gap: 9, offset: true, radius: 2 },
    bloom: { color: '#ff9a5c', x: 66, y: 30, r: 62, opacity: 0.3 },
    grain: 0.6,
    mottleNoise: 0.5,
    vignette: 0.66,
  },
  // Structural block: cool, dense, square coursing.
  block: {
    range: [
      [20, 23, 26],
      [64, 71, 79],
    ],
    units: { w: 196, h: 196, gap: 11, offset: false, radius: 2 },
    grain: 0.45,
    mottleNoise: 0.45,
    vignette: 0.8,
  },
  // Refractory: dark body with heat trapped inside it.
  refractory: {
    range: [
      [14, 12, 11],
      [74, 44, 28],
    ],
    mottle: { count: 320, size: 120, opacity: 0.6 },
    bloom: { color: '#fb7d45', x: 36, y: 58, r: 48, opacity: 0.4 },
    grain: 0.7,
    mottleNoise: 0.55,
    vignette: 0.8,
  },
  // Poured concrete: the production-line surface, cool and quiet.
  concrete: {
    range: [
      [24, 28, 32],
      [86, 94, 103],
    ],
    units: { w: 1400, h: 104, gap: 5, offset: false, radius: 0 },
    mottle: { count: 260, size: 240, opacity: 0.45 },
    grain: 0.55,
    mottleNoise: 0.6,
    vignette: 0.74,
  },
  // A facade read as a grid of bays rather than as a building.
  facade: {
    range: [
      [16, 20, 24],
      [74, 84, 94],
    ],
    units: { w: 136, h: 78, gap: 7, offset: true, radius: 1 },
    bloom: { color: '#ee5a24', x: 86, y: 12, r: 46, opacity: 0.16 },
    grain: 0.35,
    mottleNoise: 0.3,
    vignette: 0.64,
  },
  // Tower at night: tall bays, a scattering of them lit.
  tower: {
    range: [
      [10, 13, 17],
      [46, 55, 66],
    ],
    units: { w: 74, h: 232, gap: 14, offset: false, radius: 1 },
    lights: { color: '#ffd2ab', chance: 0.3, opacity: 0.55 },
    grain: 0.3,
    mottleNoise: 0.3,
    vignette: 0.82,
  },
  // Laboratory: the one cool, clean surface in the set.
  lab: {
    range: [
      [18, 23, 29],
      [78, 93, 108],
    ],
    units: { w: 320, h: 320, gap: 4, offset: false, radius: 0 },
    mottle: { count: 140, size: 300, opacity: 0.3 },
    bloom: { color: '#cfe0ee', x: 28, y: 22, r: 54, opacity: 0.22 },
    grain: 0.3,
    mottleNoise: 0.35,
    vignette: 0.7,
  },
}

/**
 * Soft blots, rendered on their own so sharp can blur them.
 *
 * Unblurred they read as bokeh circles; blurred they become the uneven cloud
 * of tone that an unstructured surface (concrete, a kiln wall) actually has.
 */
function mottleLayer(kind: TextureKind, recipe: Recipe, w: number, h: number): string | null {
  if (!recipe.mottle) return null

  const rand = prng(kind.length * 104729 + kind.charCodeAt(1) * 31)
  const [dark, light] = recipe.range
  const blots: string[] = []

  for (let i = 0; i < recipe.mottle.count; i += 1) {
    const x = rand() * w
    const y = rand() * h
    const rx = recipe.mottle.size * (0.3 + rand() * 0.9)
    const ry = rx * (0.4 + rand() * 0.7)
    const tone = mix(dark, light, rand() ** 1.6)
    blots.push(
      `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${rx.toFixed(0)}" ry="${ry.toFixed(
        0,
      )}" fill="${css(tone)}" opacity="${(recipe.mottle.opacity * (0.25 + rand() * 0.75)).toFixed(
        3,
      )}"/>`,
    )
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${blots.join('')}</svg>`
}

/** The gradient, the laid units and the bloom — everything with a hard edge. */
function surfaceLayer(kind: TextureKind, recipe: Recipe, w: number, h: number): string {
  const rand = prng(kind.length * 7919 + kind.charCodeAt(0) * 131)
  const [dark, light] = recipe.range
  const parts: string[] = []

  // A directional light across the surface, so it has a side that faces the sun.
  parts.push(
    `<rect width="${w}" height="${h}" fill="url(#lightfall)"/>`,
  )

  if (recipe.units) {
    const { w: uw, h: uh, gap, offset, radius = 0 } = recipe.units
    const rows = Math.ceil(h / (uh + gap)) + 1
    const cols = Math.ceil(w / (uw + gap)) + 2

    for (let row = 0; row < rows; row += 1) {
      // Running bond: every other course steps half a unit sideways.
      const shift = offset && row % 2 === 1 ? -(uw + gap) / 2 : 0

      for (let col = -1; col < cols; col += 1) {
        const x = col * (uw + gap) + shift
        const y = row * (uh + gap)

        // Each face gets its own tone; a few are noticeably darker, the way a
        // kiln never fires a whole batch evenly.
        const roll = rand()
        const tone = mix(dark, light, roll ** 1.5 * 0.92 + 0.06)
        parts.push(
          `<rect x="${x.toFixed(0)}" y="${y}" width="${uw}" height="${uh}" rx="${radius}" fill="${css(
            tone,
          )}"/>`,
        )

        // A highlight along the top edge reads as a chamfer.
        parts.push(
          `<rect x="${x.toFixed(0)}" y="${y}" width="${uw}" height="2" fill="${css(
            mix(tone, light, 0.55),
          )}" opacity="0.5"/>`,
        )

        if (recipe.lights && rand() < recipe.lights.chance) {
          parts.push(
            `<rect x="${(x + uw * 0.18).toFixed(0)}" y="${(y + uh * 0.16).toFixed(0)}" width="${(
              uw * 0.64
            ).toFixed(0)}" height="${(uh * 0.44).toFixed(0)}" fill="${recipe.lights.color}" opacity="${(
              recipe.lights.opacity *
              (0.4 + rand() * 0.6)
            ).toFixed(3)}"/>`,
          )
        }
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="lightfall" x1="0%" y1="100%" x2="86%" y2="0%">
        <stop offset="0%" stop-color="${css(dark)}"/>
        <stop offset="100%" stop-color="${css(mix(dark, light, 0.55))}"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="${css(dark)}"/>
    ${parts.join('')}
  </svg>`
}

/**
 * Heat or daylight bloom, on its own layer.
 *
 * Composited last and with `screen`, so it lights the surface underneath
 * instead of painting over it — and so the blurred mottle cannot bury it.
 */
function bloomLayer(recipe: Recipe, w: number, h: number): string | null {
  if (!recipe.bloom) return null

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <radialGradient id="bloom" cx="${recipe.bloom.x}%" cy="${recipe.bloom.y}%" r="${recipe.bloom.r}%">
        <stop offset="0%" stop-color="${recipe.bloom.color}" stop-opacity="${recipe.bloom.opacity}"/>
        <stop offset="50%" stop-color="${recipe.bloom.color}" stop-opacity="${(
          recipe.bloom.opacity * 0.3
        ).toFixed(3)}"/>
        <stop offset="100%" stop-color="${recipe.bloom.color}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bloom)"/>
  </svg>`
}

/**
 * Opaque grey noise at a given scale.
 *
 * Kept fully opaque and dialled in with `opacity` on the rect, because the
 * layer is blended with `screen`: on a surface this dark, `overlay` and
 * `soft-light` leave almost nothing behind, while `screen` lifts grain into
 * exactly the shadows where film grain lives.
 */
function noiseLayer(frequency: number, opacity: number, w: number, h: number, seed: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <filter id="n" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="${frequency}" numOctaves="4" seed="${seed}"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="discrete" tableValues="1"/>
      </feComponentTransfer>
    </filter>
    <rect width="${w}" height="${h}" filter="url(#n)" opacity="${opacity.toFixed(3)}"/>
  </svg>`
}

function vignetteLayer(strength: number, w: number, h: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <radialGradient id="v" cx="50%" cy="44%" r="78%">
        <stop offset="40%" stop-color="#ffffff" stop-opacity="1"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="${strength}"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#v)"/>
  </svg>`
}

/**
 * Render one texture to a WebP buffer.
 *
 * The layers are blended by sharp rather than by SVG `mix-blend-mode`, which
 * librsvg does not implement: coarse noise breaks up the shapes, fine noise
 * adds the film grain, and the vignette pulls the corners down.
 */
export async function renderTexture(
  kind: TextureKind,
  { width = 2200, height = 1375 }: { width?: number; height?: number } = {},
): Promise<Buffer> {
  const recipe = RECIPES[kind]

  const mottle = mottleLayer(kind, recipe, width, height)
  const blurred = mottle
    ? await sharp(Buffer.from(mottle)).blur(Math.max(2, recipe.mottle!.size / 7)).png().toBuffer()
    : null

  const bloom = bloomLayer(recipe, width, height)

  return sharp(Buffer.from(surfaceLayer(kind, recipe, width, height)))
    .composite([
      ...(blurred ? [{ input: blurred, blend: 'over' as const }] : []),
      ...(bloom ? [{ input: Buffer.from(bloom), blend: 'screen' as const }] : []),
      // Coarse: breaks the drawn shapes up so they stop looking drawn.
      {
        input: Buffer.from(noiseLayer(0.0045, recipe.mottleNoise * 0.16, width, height, 11)),
        blend: 'screen',
      },
      // Fine: the film grain itself.
      {
        input: Buffer.from(noiseLayer(0.55, recipe.grain * 0.13, width, height, 5)),
        blend: 'screen',
      },
      { input: Buffer.from(vignetteLayer(recipe.vignette, width, height)), blend: 'multiply' },
    ])
    .webp({ quality: 88 })
    .toBuffer()
}
