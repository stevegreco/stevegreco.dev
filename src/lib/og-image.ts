import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import satori from 'satori'
import sharp from 'sharp'
import tokens from '@stevegreco/design-system/tokens'

const { color } = tokens.primitives

// Satori can't resolve CSS variables, so these mirror the dark-theme semantic
// tokens (background-default, background-raised, accent-default).
const background = color.blueSmoke['950']
const surface = color.blueSmoke['900']
const accent = color.robRoy['400']

const require = createRequire(import.meta.url)
let fontData: Promise<Buffer> | undefined

type SatoriNode = Parameters<typeof satori>[0]

// Satori takes React-element-shaped objects, so no JSX runtime is needed.
function h(
  type: string,
  style: Record<string, string | number>,
  ...children: Array<SatoriNode | string>
): SatoriNode {
  return {
    type,
    key: null,
    props: { style, children: children.length === 1 ? children[0] : children },
  } as SatoriNode
}

function loadFont() {
  fontData ??= readFile(
    require.resolve('@fontsource/jetbrains-mono/files/jetbrains-mono-latin-600-normal.woff'),
  )
  return fontData
}

export async function renderOGImage(title: string) {
  const svg = await satori(
    h(
      'div',
      {
        display: 'flex',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        letterSpacing: '-.02em',
        background,
      },
      h(
        'div',
        {
          position: 'absolute',
          left: 50,
          top: 42,
          fontSize: 20,
          color: accent,
        },
        'stevegreco.dev',
      ),
      h(
        'div',
        {
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          padding: '60px 20px',
          margin: '0 42px',
          fontSize: 32,
          maxWidth: 550,
          textAlign: 'center',
          backgroundColor: surface,
          color: accent,
          lineHeight: 1.4,
        },
        title,
      ),
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'JetBrains Mono',
          data: await loadFont(),
          weight: 600,
          style: 'normal',
        },
      ],
    },
  )

  return sharp(Buffer.from(svg)).png().toBuffer()
}
