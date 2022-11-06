import Fastify from 'fastify'
import cors from '@fastify/cors'
import {PrismaClient} from '@prisma/client'
import { z } from 'zod'
import ShortUniqueId from 'short-unique-id'


const prismaClient = new PrismaClient({log: ['query']})
const fastify = Fastify({logger: true})
const bodyTitle = z.object({
    title: z.string()
})
async function bootstrap(){

    await fastify.register(cors, {origin: true})

    fastify.get('/pools/count', async(request, reply)=>{
        const count = await prismaClient.pool.count()
        return reply.status(200).send({count})
    })

    fastify.post('/pools', async(request, reply)=>{
        const {title} = bodyTitle.parse(request.body)
        const generateCode = new ShortUniqueId({length: 6})
        const code = String(generateCode()).toUpperCase()
        await prismaClient.pool.create({
            data:{
                title,
                code
            }
        })
        return reply.status(200).send({code})
    })

    fastify.get('/users/count',async (request, reply)=>{
        const count = await prismaClient.user.count()
        return reply.status(200).send({count})
    })

    fastify.get('/guesses/count', async(request, reply)=>{
        const count = await prismaClient.guess.count()
        return reply.status(200).send({count})
    })




    await fastify.listen({port: 5000, host: '0.0.0.0'})
}

bootstrap()
