import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
    const salt = 15;
    const hashPass = await bcrypt.hash(password, salt);
    return hashPass;
}

export async function comparePass(
    inputPassword: string,
    hashedPassword: string,
): Promise<boolean> {
    try {
        const pass = await bcrypt.compare(inputPassword, hashedPassword);
        return pass;
    } catch (error) {
        throw error;
    }
}
