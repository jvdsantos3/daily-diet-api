import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkUserIdExists } from '../middlewares/check-user-id-exists'

export async function snacksRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkUserIdExists],
    },
    async (request) => {
      const { userId } = request.cookies

      const snacks = await knex('snacks')
        .where({
          user_id: userId,
        })
        .select()

      return { snacks }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const { userId } = request.cookies

      const getSnackParamSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getSnackParamSchema.parse(request.params)

      const snack = await knex('snacks')
        .where({
          user_id: userId,
          id,
        })
        .first()

      if (!snack) {
        return reply.status(404).send()
      }

      return { snack }
    },
  )

  app.post(
    '/',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const { userId } = request.cookies

      const createSnackBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        dateAndHour: z.string().datetime(),
        onTheDiet: z.boolean(),
      })

      const { name, description, dateAndHour, onTheDiet } =
        createSnackBodySchema.parse(request.body)

      await knex('snacks').insert({
        id: randomUUID(),
        user_id: userId,
        name,
        description,
        date_and_hour: dateAndHour,
        on_the_diet: onTheDiet,
      })

      return reply.status(201).send()
    },
  )

  app.put(
    '/:id',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const { userId } = request.cookies

      const updateSnackParamSchema = z.object({
        id: z.string().uuid(),
      })

      const updateSnackBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        dateAndHour: z.string().datetime(),
        onTheDiet: z.boolean(),
      })

      const { id } = updateSnackParamSchema.parse(request.params)

      const { name, description, dateAndHour, onTheDiet } =
        updateSnackBodySchema.parse(request.body)

      await knex('snacks')
        .where({
          user_id: userId,
          id,
        })
        .update({
          name,
          description,
          date_and_hour: dateAndHour,
          on_the_diet: onTheDiet,
        })

      return reply.status(200).send()
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const { userId } = request.cookies

      const updateSnackParamSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = updateSnackParamSchema.parse(request.params)

      await knex('snacks')
        .where({
          user_id: userId,
          id,
        })
        .del()

      return reply.status(204).send()
    },
  )
}
