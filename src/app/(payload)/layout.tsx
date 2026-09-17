/* Root layout for the Payload admin panel. Kept in its own route group so the
 * public site's layout, fonts and i18n providers never load inside the CMS. */
import type { ServerFunctionClient } from 'payload'
import type { ReactNode } from 'react'
import config from '@payload-config'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import '@payloadcms/next/css'
import { importMap } from './admin/importMap.js'

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

export default function PayloadLayout({ children }: { children: ReactNode }) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}
