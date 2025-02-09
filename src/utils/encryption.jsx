import CryptoJS from "crypto-js"

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY

export function encryptData(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString()
}

export function decryptData(encryptedData) {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY)
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}

