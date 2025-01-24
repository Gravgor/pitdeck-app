import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function disconnectAllUserCards() {
  try {
    // Prisma transaction, first we get users all cards
    const users = await prisma.user.findFirst({
      where: {
        id: 'cm5wtkbib00cd11uiioqq8saz'
      },
      include: {
        cards: true
      }
    })
    if (!users) {
      console.log('User not found')
      return
    }
    users.cards.forEach(async (card) => {
      await prisma.card.update({
        where: { id: card.id },
        data: { owners: { disconnect: { id: users.id } } }
      })
    })

    console.log('Disconnected all cards from users')
  } catch (error) {
    console.error('Error disconnecting cards:', error)
  } finally {
    await prisma.$disconnect()
  }
}

disconnectAllUserCards()