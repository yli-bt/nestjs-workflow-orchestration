export async function greet(name: string): Promise<string> {
    return `Hello, Larry and ${name}!`;
}

export async function greet_two(name: string): Promise<string> {
    return `Hello, Curly and ${name}!`;
}

export async function greet_three(name: string): Promise<string> {
    return `Hello, Moe and ${name}!`;
}