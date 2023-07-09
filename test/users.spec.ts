import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'
import { execSync } from 'node:child_process'

describe('Users routes', () => {
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

  it('should be able to create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Admin',
      })
      .expect(201)
  })

  it('should be able to get the summary', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Admin',
    })

    const cookies = createUserResponse.get('Set-Cookie')

    await request(app.server).post('/snacks').set('Cookie', cookies).send({
      name: 'Jantar',
      description: 'Descrição do jantar',
      dateAndHour: '2023-07-08T19:00:00Z',
      onTheDiet: true,
    })

    await request(app.server).post('/snacks').set('Cookie', cookies).send({
      name: 'Jantar',
      description: 'Descrição do jantar',
      dateAndHour: '2023-07-08T19:00:00Z',
      onTheDiet: false,
    })

    const summaryResponse = await request(app.server)
      .get('/users/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryResponse.body.summary).toEqual({
      total: 2,
      onDiet: 1,
      offDiet: 1,
      bestSequel: 1,
    })
  })
})
