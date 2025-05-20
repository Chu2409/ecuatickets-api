import { USER_STATUS } from "src/core/users/types/user-status.enum";
import { pgEnum } from "drizzle-orm/pg-core";

export const userStatus = pgEnum('user_status', USER_STATUS)
