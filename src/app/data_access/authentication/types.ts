export interface JwtResultDto {
  username: string;
  jwt: string;
  role: string;
  refresh: string;
  expiresIn: number; // in milliseconds
}
