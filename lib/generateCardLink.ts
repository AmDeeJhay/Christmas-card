export function generateCardLink(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let id = ''
  const values = crypto.getRandomValues(new Uint32Array(length))
  for (let i = 0; i < length; i++) id += chars[values[i] % chars.length]
  return id
}
