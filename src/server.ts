import 'reflect-metadata'
import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server'
import {
  createParamDecorator,
  ParameterDecorator,
  CategoriesCrudResolver,
  ResolversEnhanceMap,
  ResolverActionsConfig,
  applyResolversEnhanceMap,
} from '../prisma/generated/type-graphql'
import { Authorized, Extensions, UseMiddleware } from 'type-graphql'
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  FieldResolver,
  Root,
  Int,
  InputType,
  Field,
  MiddlewareFn,
} from 'type-graphql'

import * as tq from 'type-graphql'
import * as TypeGraphQL from 'type-graphql'

const prisma = new PrismaClient()

const resolversEnhanceMap: ResolversEnhanceMap = {
  Categories: {
    _all: [
      UseMiddleware(({ info, context }, next) => {
        console.log(`Query "${info.fieldName}" accessed`)
        return next()
      }),
    ],
  },
}
applyResolversEnhanceMap(resolversEnhanceMap)

const app = async () => {
  const schema = await tq.buildSchema({
    resolvers: [CategoriesCrudResolver],
  })

  const context = ({ req }) => {
    return {
      prisma,
      req,
      res,
    }
  }

  new ApolloServer({
    schema,
    context,
  }).listen({ port: 4444 }, () =>
    console.log('🚀 Server ready at: http://localhost:4444'),
  )
}

app()
