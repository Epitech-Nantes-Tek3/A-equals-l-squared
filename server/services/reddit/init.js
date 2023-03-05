'use strict'

const database = require('../../database_init')

/**
 * @brief Create the Reddit service in the database.
 */
const createRedditService = async () => {
  try {
    const Reddit = await database.prisma.Service.create({
      data: {
        name: 'Reddit',
        description: 'Forum service',
        primaryColor: '#FF4500',
        secondaryColor: '#FFFFFF',
        icon: './assets/icons/reddit.png',
        isEnable: true,
        Actions: {},
        Reactions: {
          create: [
            {
              name: 'subscribeToSubreddit',
              code: 'RDT-01',
              description: 'Subscribe to a subreddit',
              isEnable: true,
              Parameters: {
                create: [
                  {
                    name: 'subredditName',
                    description: 'Name of the subreddit',
                    isRequired: true
                  }
                ]
              }
            },
            {
              name: 'unsubscribeToSubreddit',
              code: 'RDT-02',
              description: 'Unsubscribe to a subreddit',
              isEnable: true,
              Parameters: {
                create: [
                  {
                    name: 'subredditName',
                    description: 'Name of the subreddit',
                    isRequired: true
                  }
                ]
              }
            },
            {
              name: 'redditSubscribeToNewSubreddit',
              code: 'RDT-03',
              description: 'Subscribe to a subreddit created recently',
              isEnable: true
            }
          ]
        }
      }
    })
    console.log('Reddit service created : ', Reddit)
  } catch (error) {
    console.log('Error while creating Reddit service : ', error)
  }
}

/**
 * Create the reddit service if it does not already exist.
 */
const generateRedditService = async database => {
  const redditService = await database.prisma.Service.findMany({
    where: { name: 'reddit' }
  })
  if (redditService.length === 0) {
    console.log('Creating reddit service...')
    return await createRedditService()
  } else {
    console.log('Reddit service already exist.')
    return redditService[0]
  }
}

module.exports = { generateRedditService }
