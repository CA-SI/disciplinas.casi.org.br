import type { Metadata, Viewport } from 'next'
import { Roboto } from 'next/font/google'
import { Cabecalho } from '@/components/cabecalho'
import { Rodape } from '@/components/rodape'
import { site } from '@/lib/site'
import './globals.css'

const roboto = Roboto({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.titulo, template: `%s · ${site.nome}` },
  description: site.descricao,
  applicationName: site.nome,
  openGraph: { type: 'website', locale: 'pt_BR', siteName: site.nome, url: '/' },
  icons: { icon: '/favicon.ico' },
}

export const viewport: Viewport = {
  themeColor: '#009cff',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={roboto.variable}>
      <body className="flex min-h-dvh flex-col">
        <Cabecalho />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <Rodape />
      </body>
    </html>
  )
}
