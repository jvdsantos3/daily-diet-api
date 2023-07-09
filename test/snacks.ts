import { afterAll, beforeAll, beforeEach, describe } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('Snacks routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  afterAll(async () => {
    await app.close()
  })
})
