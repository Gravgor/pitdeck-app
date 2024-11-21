import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string | null;
      name: string | null;
      image: string | null;
      coins: number;
      needUsernameSetup: boolean;
      lastLocation: {
        latitude: number;
        longitude: number;
      };
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string | null;
    name: string | null;
    picture: string | null;
    coins: number;
    lastLocation: {
      latitude: number;
      longitude: number;
    };
  }
} 