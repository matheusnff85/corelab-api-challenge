import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { prisma } from '../lib/prisma';

export async function createTask(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/task',
    {
      schema: {
        summary: 'Create an task',
        tags: ['tasks'],
        body: z.object({
          title: z.string().min(3),
          content: z.string().min(3),
          isFavorite: z.boolean(),
          color: z.string(),
        }),
        response: {
          201: z.object({
            taskId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { title, content, isFavorite, color } = request.body;

      const task = await prisma.task.create({
        data: {
          title,
          content,
          isFavorite,
          color,
        },
      });

      return reply.status(201).send({ taskId: task.id });
    },
  );
}
