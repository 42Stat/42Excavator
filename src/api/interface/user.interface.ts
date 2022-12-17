export interface UserDto {
  id: number;
  email: string;
  login: string;
  kind: string;
  image: UserImageDto;
  correction_point: number;
  wallet: number;
  active: boolean;
}

export interface UserImageDto {
  link: string;
}

export interface CursusUserDto {
  grade: string;
  level: number;
  blackholed_at: string;
  begin_at: string;
  cursus_id: number;
  user: UserDto;
}
