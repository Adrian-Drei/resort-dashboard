import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return { error: "Invalid credentials" };

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return { error: "Invalid credentials" };

  // create JWT
  const token = jwt.sign(
    { id: admin.id, email: admin.email },
    process.env.JWT_SECRET || "supersecret",
    { expiresIn: "8h" }
  );

  return { token };
});
