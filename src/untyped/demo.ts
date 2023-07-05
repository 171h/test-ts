import fs from 'node:fs'
import { applyDefaults, generateMarkdown, generateTypes, resolveSchema } from 'untyped'

const defaultPlanet = {
  name: 'earth',
  specs: {
    gravity: {
      $resolve: val => Number.parseFloat(val),
      $default: '9.8',
    },
    moons: {
      $resolve: (val = ['moon']) => [].concat(val),
      $schema: {
        title: 'planet moons',
      },
    },
  },
}

const schema = await resolveSchema(defaultPlanet)
const types = generateTypes(schema)
const markdown = generateMarkdown(schema)

fs.writeFileSync('src/untyped/demo.schema.json', JSON.stringify(schema, null, 2))
fs.writeFileSync('src/untyped/demo.d.ts', types)
fs.writeFileSync('src/untyped/demo.md', markdown)
