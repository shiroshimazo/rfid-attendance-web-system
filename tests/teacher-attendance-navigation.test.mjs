import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createSourceLoader } from './helpers/load-typescript.mjs'

test('legacy attendance links retain query parameters when opening daily panel', async () => {
  let destination
  const load=createSourceLoader({'next/navigation':{redirect:url=>{destination=url}}})
  const Page=load('src/app/(portal)/teacher/attendance/page.tsx').default
  await Page({searchParams:Promise.resolve({date:'2026-09-08',search:'Ana & Ben'})})
  const url=new URL(destination,'https://example.test')
  assert.equal(url.pathname,'/teacher/attendance/daily')
  assert.equal(url.searchParams.get('date'),'2026-09-08')
  assert.equal(url.searchParams.get('search'),'Ana & Ben')
})

test('teacher attendance navigation exposes three distinct panels', () => {
  const {navigationByRole}=createSourceLoader({'@hugeicons/core-free-icons':{},'@hugeicons/react':{}})('src/config/navigation.ts')
  const attendance=navigationByRole.teacher.flatMap(group=>group.items).find(item=>item.url==='/teacher/attendance')
  assert.deepEqual(attendance.items.map(item=>item.url),[
    '/teacher/attendance/daily','/teacher/attendance/subjects','/teacher/attendance/confirm',
  ])
})
