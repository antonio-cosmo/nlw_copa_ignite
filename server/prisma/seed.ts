import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data:{
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            avatarUrl: 'https://github.com/antonio-cosmo.png',
        }
    })

    const pool = await prisma.pool.create({
        data:{
            title: 'Example Pool',
            code: 'BOL123',
            ownerId: user.id,
            participant:{
                create:{
                    userId: user.id
                }
            }
        }
    })

    const game1 = await prisma.game.create({
        data:{
            date:'2022-11-04T14:32:10.883Z',
            firstTeamCountryCode: 'DE',
            secondTeamCountryCode: 'BR'
        }
    })

    const game2 = await prisma.game.create({
        data:{
            date:'2022-11-06T14:32:10.883Z',
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'AR',

            guess:{
                create:{
                    firstTeamPoints: 3,
                    secondTeamPoints: 2,
                    participant:{
                        connect:{
                            userId_poolId:{
                                poolId: pool.id,
                                userId: user.id
                            }
                        }
                    }
                }
            }
        }
    })
}

main()