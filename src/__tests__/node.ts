import { setupServer } from "msw/node";
import { handlers } from "../__tests__/handlers";

export const server = setupServer(...handlers);
