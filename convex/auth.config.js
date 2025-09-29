export default {
  providers: [
    {
      // Use the Issuer URL from your Clerk "Convex" JWT template
      domain: process.env.CLERK_FRONTEND_API_URL,
      applicationID: "convex",
    },
  ],
};
