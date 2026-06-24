declare module "@dataconnect/generated" {
  export function getAlumniByYear(input: { graduationYear: number }): Promise<unknown>;
  export function createUser(input: {
    email: string;
    name: string;
    graduationYear?: number | null;
    major?: string | null;
  }): Promise<unknown>;
  export function createPost(input: { content: string; authorId: string }): Promise<unknown>;
}
