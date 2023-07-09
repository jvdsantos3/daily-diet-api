import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({ name: z.string() })

    const { name } = createUserBodySchema.parse(request.body)

    const userId = randomUUID()

    reply.cookie('userId', userId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    })

    await knex('users').insert({
      id: userId,
      name,
    })

    return reply.status(201).send()
  })

  app.get('/summary', async (request) => {
    const { userId } = request.cookies

    const snacks = await knex('snacks')
      .where({
        user_id: userId,
      })
      .select()

    let bestSequelCount = 0
    const bestSequels: Array<number> = []

    snacks.forEach((snack, index) => {
      if (index === snacks.length - 1 && snack.on_the_diet === 1) {
        bestSequelCount++
        bestSequels.push(bestSequelCount)
      } else if (snack.on_the_diet === 1) {
        bestSequelCount++
      } else {
        bestSequels.push(bestSequelCount)
        bestSequelCount = 0
      }
    })

    const bestSequel = bestSequels.reduce(
      (acc, cur) => Math.max(acc, cur),
      -Infinity,
    )

    const summary = {
      total: snacks.length,
      onDiet: snacks.filter((snack) => snack.on_the_diet).length,
      offDiet: snacks.filter((snack) => !snack.on_the_diet).length,
      bestSequel,
    }

    return {
      summary,
    }
  })
}
