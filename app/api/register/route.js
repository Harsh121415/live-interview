import prisma from "@/lib/prisma";
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";
export const POST = async (req, res) => {
  const data = await req.json();

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(data?.password, salt);
    //console.log("hash: ", hash);

    const isExist = await prisma.company.findUnique({
      where: {
        email: data?.email,
      },
    });
    //console.log("isExist: ", isExist);
    if (isExist) {
      const token = jwt.sign(
        { email: isExist?.email, userId: isExist?.userId },
        process.env.NEXT_PUBLIC_JWT_SECRET,
        { expiresIn: "1d" }
      );
      return Response.json(
        {
          message: "Registration successfull",
          token: token,
          email: isExist?.email,

        },
        { status: 200 }
      );
    }
    const user = await prisma.company.create({
      data: {
        email: data?.email,
        password: hash,
      },
    });
    return Response.json(
      { message: "Registration successfull", data: user },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ message: error.message }, { status: 403 });
  }
};
