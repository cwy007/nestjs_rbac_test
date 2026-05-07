import { SetMetadata } from "@nestjs/common";

export const RequireLogin = () => SetMetadata('requireLogin', true);

export const RequirePermissions = (...permissions: string[]) => SetMetadata('permissions', permissions);