// convex/auth.config.js
import { convexAuth } from "convex-helpers/server/auth";
import { clerk } from "convex-helpers/server/clerk";

export default convexAuth({
  providers: [clerk()],
});
