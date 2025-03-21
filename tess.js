
async register(req = request, res = response) {
    const { name, email, password, role } = req.body;

    try {
        if (!email || !password || !name || !role) {
            return res.status(400).json({
                status: false,
                message: "Semua field harus diisi",
            });
        }

        const existingUser = await db.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                status: false,
                message: "Email sudah terdaftar",
            });
        }

        const hashedPassword = await passwordHash(password);

        const newUser = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role,
            }
        });

        return res.status(201).json({
            status: true,
            message: "Registrasi berhasil",
            newUser
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}
>>>>>>> master
