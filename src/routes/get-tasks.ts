import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { prisma } from '../lib/prisma';

export async function getTasks(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/tasks',
    {
      schema: {
        summary: 'Busca todas as tasks',
        tags: ['Tasks'],
        response: {
          200: z.object({
            tasks: z.array(
              z.object({
                id: z.string().uuid(),
                title: z.string(),
                content: z.string(),
                isFavorite: z.boolean(),
                color: z.string(),
                createdAt: z.date(),
              }),
            ),
          }),
        },
      },
    },
    async (_request, reply) => {
      const tasks = await prisma.task.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return reply.status(200).send({ tasks });
    },
  );
}
