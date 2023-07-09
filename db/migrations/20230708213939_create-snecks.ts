import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('snacks', (table) => {
    table.uuid('id').primary()
    table.uuid('user_id').notNullable()
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.dateTime('date_and_hour').notNullable()
    table.boolean('on_the_diet').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('snacks')
}
