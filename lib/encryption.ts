import crytpo from 'crypto'


const ALGORITHM = "aes-256-gcm"

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY

if(!ENCRYPTION_KEY){
    throw new Error("Encryption Key Is Not Defined")
}

const KEY = Buffer.from(
    ENCRYPTION_KEY,
    "hex"
)


async function encrypt(text :string) {
    const iv = crytpo.randomBytes(12)

    const cipher = crytpo.createCipheriv(
        ALGORITHM,
        KEY,
        iv
    )

    const encrypted = Buffer.concat([
        cipher.update(text, "utf-8"),
        cipher.final()
    ])

    const authTag = cipher.getAuthTag()

    return [
        iv.toString("hex"),
        encrypted.toString("hex"),
        authTag.toString("hex")
    ].join(":")
}

export {encrypt}