export interface JwtResultDto {
  username: string;
  accessToken: string;
  role: string;
  refreshToken: string;
  expireIn: string; // in milliseconds
}
