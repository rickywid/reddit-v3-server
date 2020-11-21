// https://github.com/TypeStrong/ts-node#help-my-types-are-missing

declare namespace Express {
  export interface User {
    id: number,
    provider: string,
    oauth_id: string,
    display_name: string,
    email: string,
    picture: string
  }
}