import prisma from "@/lib/prisma";
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
export const POST = async (req, res) => {
  const data = await req.json();
  if (!data?.password)
    return Response.json({ message: "Email required" }, { status: 403 });
  if (!data?.email)
    return Response.json({ message: "Password required" }, { status: 403 });

  try {
    const isExist = await prisma.company.findUnique({
      where: {
        email: data?.email,
      },
    });

    if (isExist) {
      const isPasswordMatch = await bcrypt.compare(
        data?.password,
        isExist?.password
      );
      //console.log("isPasswordMatch: ", isPasswordMatch);

      if (!isPasswordMatch)
        return Response.json(
          { message: "unauthorised access" },
          { status: 401 }
        );
      //console.log("isExist: ", isExist);
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
    } else {
      return Response.json({ message: "unauthorised access" }, { status: 401 });
    }
  } catch (error) {
    return Response.json({ message: error.message }, { status: 403 });
  }
};
