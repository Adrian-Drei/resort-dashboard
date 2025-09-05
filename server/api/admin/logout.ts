export default defineEventHandler(async (event) => {
  deleteCookie(event, "admin_token");
  return { success: true };
});
