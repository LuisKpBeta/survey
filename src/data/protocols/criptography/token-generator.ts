export interface TokenGenerator{
  generate (id: string): Promise<String>
}
