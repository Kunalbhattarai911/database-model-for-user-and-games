import  express from "express";
import prisma from "./prisma";

const app = express();
app.use(express.json())

app.post("/users", async(req,res) => {
    try {
        const { name, games } = req.body;

        
        const newUser = await prisma.user.create({
            data: {
              name, // name is provided by the request body
              games: {
                connectOrCreate: games.map((game: string) => ({
                  where: {
                    name: game,
                  },
                  create: {
                    name: game,
                  },
                })),
              },
            },
          })

        return res.json (newUser)
    } catch (error: any) {
            console.log(error.message)
            return res.status(500) .json({
                message: "Internal Server Error"
            })
    }
})


app.get("/users", async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        include: {
          games: true,
        },
      })
  
      res.json(users)
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong",
      })
    }
  })

  app.put("/users/:id", async (req, res) => {
    try {
      const { name, games } = req.body
      const { id } = req.params
  
      const updatedUser = await prisma.user.update({
        where: {
          id,
        },
        data: {
          name,
          games: {
            connectOrCreate: games.map((game: string) => ({
              where: { name: game },
              create: { name: game },
            })),
          },
        },
      })
  
      res.json(updatedUser)
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong",
      })
    }
  })

  app.delete("/users/:id", async (req, res) => {
    try {
      const { id } = req.params
  
      const deletedUser = await prisma.user.delete({
        where: {
          id,
        },
      })
  
      res.json(deletedUser)
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong",
      })
    }
  })


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => 
console.log(`server is running on PORT ${PORT}`)
)