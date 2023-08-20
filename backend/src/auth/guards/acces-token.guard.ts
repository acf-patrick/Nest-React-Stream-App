import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class AccesTokenGuard extends AuthGuard('jwt') {}