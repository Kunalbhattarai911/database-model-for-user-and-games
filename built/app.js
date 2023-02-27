"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("./prisma"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/users", async (req, res) => {
    try {
        const { name, games } = req.body;
        const newUser = await prisma_1.default.user.create({
            data: {
                name,
                games: {
                    connectOrCreate: games.map((game) => ({
                        where: {
                            name: game,
                        },
                        create: {
                            name: game
                        }
                    }))
                }
            }
        });
        return res.json(newUser);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
});
app.get("/users", async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({
            include: {
                games: true,
            },
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});
app.put("/users/:id", async (req, res) => {
    try {
        const { name, games } = req.body;
        const { id } = req.params;
        const updatedUser = await prisma_1.default.user.update({
            where: {
                id,
            },
            data: {
                name,
                games: {
                    connectOrCreate: games.map((game) => ({
                        where: { name: game },
                        create: { name: game },
                    })),
                },
            },
        });
        res.json(updatedUser);
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});
app.delete("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await prisma_1.default.user.delete({
            where: {
                id,
            },
        });
        res.json(deletedUser);
    }
    catch (error) {
        res.status(500).json({
            message: "Something went wrong",
        });
    }
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`));
