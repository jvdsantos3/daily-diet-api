// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      created_at: string
    }
    snacks: {
      id: string
      user_id: string
      name: string
      description: string
      date_and_hour: string
      on_the_diet: number | boolean
      created_at: string
    }
  }
}
