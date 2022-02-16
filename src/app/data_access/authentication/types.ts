export interface JwtResultDto {
  username: string;
  jwt: string;
  refresh: string;
  expiresIn: number; // in milliseconds
}
