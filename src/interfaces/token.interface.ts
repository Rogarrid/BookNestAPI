export interface DecodedToken {
  sub: string;
  email: string;
}

export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}
