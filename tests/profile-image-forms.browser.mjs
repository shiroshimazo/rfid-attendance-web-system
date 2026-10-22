import assert from "node:assert/strict"
import { createRequire } from "node:module"
import { createServer } from "node:http"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("../", import.meta.url))
const tools = createRequire(join(process.env.RFID_BROWSER_TOOLS ?? join(tmpdir(), "rfid-browser-tools"), "package.json"))
const { build } = tools("esbuild")
const { chromium } = tools("playwright")
const bundle = await build({
  stdin: { contents: `
    import React from 'react';
    import { createRoot } from 'react-dom/client';
    import { ProfileForm } from '@/app/(portal)/admin/settings/components/profile-form';
    import { StudentFormDialog } from '@/app/(portal)/admin/students/components/student-form-dialog';
    createRoot(document.getElementById('root')).render(location.pathname === '/student'
      ? <StudentFormDialog open onOpenChange={() => {}} programs={[]} groupings={[]} />
      : <ProfileForm profile={{ fullName: 'Admin', email: 'admin@example.com', phoneNumber: '', avatarUrl: 'https://example.com/old.png', currentPassword: '' }} pendingEmail={null} />);
  `, loader: "tsx", resolveDir: root },
  bundle: true, write: false, format: "iife", jsx: "automatic", logLevel: "silent",
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [{ name: "server-boundaries", setup(builder) {
    builder.onResolve({ filter: /features\/(profiles|students)\/actions$/ }, args => ({ path: args.path, namespace: "mock" }))
    builder.onResolve({ filter: /components\/ui\/goey-toaster$/ }, args => ({ path: args.path, namespace: "mock" }))
    builder.onLoad({ filter: /.*/, namespace: "mock" }, () => ({ contents: `
      export const updateAdminProfileAction = async values => { window.saved = values; return {ok:true,message:'Saved'}; };
      export const createStudentAction = updateAdminProfileAction;
      export const updateStudentAction = updateAdminProfileAction;
      export const gooeyToast = {success(){},error(){}};
    ` }))
  } }],
})
const server = createServer((req, res) => {
  if (req.url === '/app.js') { res.setHeader('Content-Type', 'application/javascript'); res.end(bundle.outputFiles[0].text) }
  else { res.setHeader('Content-Type', 'text/html'); res.end('<html><body><div id="root"></div><script src="/app.js"></script></body></html>') }
})
await new Promise(done => server.listen(0, '127.0.0.1', done))
let browser
try {
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  for (const form of ['admin', 'student']) {
    await page.goto(`http://127.0.0.1:${server.address().port}/${form}`)
    const input = page.locator('input[type=file]')
    await input.waitFor()
    assert.equal(await page.locator('input[type=url], input[inputmode=url]').count(), 0)
    const action = page.getByRole('button', { name: form === 'admin' ? 'Save changes' : 'Next', exact: true })
    let release
    const pending = new Promise(resolve => { release = resolve })
    await page.route('**/api/profile-image', async route => {
      await pending
      await route.fulfill({ json: { url: 'https://example.com/new.png' } })
    })
    await input.setInputFiles({ name: 'photo.png', mimeType: 'image/png', buffer: Buffer.from([137,80,78,71,13,10,26,10]) })
    await page.getByRole('status').waitFor()
    assert.equal(await action.isDisabled(), true)
    release()
    await page.getByRole('status').waitFor({ state: 'hidden' })
    await page.getByRole('button', { name: 'Remove', exact: true }).waitFor()
    if (form === 'admin') {
      await page.getByLabel('Current password', { exact: true }).fill('password123')
      await action.click()
      await page.waitForFunction(() => window.saved?.avatarUrl === 'https://example.com/new.png')
    }
    await input.setInputFiles({ name: 'bad.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg/>') })
    await page.getByRole('alert').waitFor()
    await page.getByRole('button', { name: 'Remove', exact: true }).focus()
    await page.getByRole('button', { name: 'Remove', exact: true }).press('Enter')
    await page.getByRole('button', { name: 'Remove', exact: true }).waitFor({ state: 'hidden' })
    assert.equal(await page.getByRole('button', { name: 'Remove', exact: true }).count(), 0)
    await page.unroute('**/api/profile-image')
  }
  assert.deepEqual(errors, [])
  console.log('PASS: admin/student file inputs, pending-upload guards, admin save, invalid files, and removal')
} finally {
  if (browser) await browser.close()
  await new Promise(done => server.close(done))
}
