import { pgEnum } from "drizzle-orm/pg-core";
import { USER_TYPE } from "src/core/users/types/user-type.enum";

export const userType = pgEnum('user_type', USER_TYPE)