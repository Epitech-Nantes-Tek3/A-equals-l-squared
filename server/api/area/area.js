'use strict'

const app = require('../../server_app')
const database = require('../../database_init')

app.get('/api/area', async (req, res) => {
  try {
    const areas = await database.prisma.AREA.findMany({
      select: {
        id: true,
        name: true,
        isEnable: true,
        Action: {
          select: {
            name: true,
            isEnable: true
          }
        },
        ActionParameters: {
          select: {
            Parameter: {
              select: {
                name: true
              }
            },
            value: true
          }
        },
        Reactions: {
          select: {
            Reaction: {
              select: {
                name: true,
                isEnable: true
              }
            },
            ReactionParameters: {
              select: {
                Parameter: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    })
    res.status(200).json(areas)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/area/:id', async (req, res) => {
  try {
    const area = await database.prisma.AREA.findUnique({
      where: {
        id: Number(req.params.id)
      },
      select: {
        id: true,
        name: true,
        isEnable: true,
        Action: {
          select: {
            name: true,
            isEnable: true
          }
        },
        ActionParameters: {
          select: {
            Parameter: {
              select: {
                name: true
              }
            },
            value: true
          }
        },
        Reactions: {
          select: {
            Reaction: {
              select: {
                name: true,
                isEnable: true
              }
            },
            ReactionParameters: {
              select: {
                Parameter: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    })
    res.status(200).json(area)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/area/create', async (req, res) => {
    try {
        const newArea = await database.prisma.AREA.create({
            data: {
                name: req.body.name,
                description: "description" in req.body ? req.body.description : "",
                isEnable: req.body.isEnable
            }
        })
        res.status(200).json(newArea)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.post('/api/area/:id/delete', async (req, res) => {
    try {
        const deletedArea = await database.prisma.AREA.delete({
            where: {
                id: Number(req.params.id)
            }
        })
        res.status(200).json(deletedArea)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.post('/api/area/:id/update', async (req, res) => {
    try {
        const updatedArea = await database.prisma.AREA.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                name: req.body.name,
                description: "description" in req.body ? req.body.description : "",
                isEnable: req.body.isEnable
            }
        })
        res.status(200).json(updatedArea)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})
