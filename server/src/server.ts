import Fastify from 'fastify'
import cors from '@fastify/cors'
import {PrismaClient} from '@prisma/client'

const prismaClient = new PrismaClient({log: ['query']})

async function bootstrap(){
    const fastify = Fastify({logger: true})

    await fastify.register(cors, {origin: true})

    fastify.get('/pools/count', async(req, res)=>{
        const count = await prismaClient.pool.count()
        return res.status(200).send({count})
    })
    await fastify.listen({port: 5000, host: '0.0.0.0'})
}

bootstrap()