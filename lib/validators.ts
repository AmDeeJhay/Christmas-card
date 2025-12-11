export function validateFileType(file: File) {
  const allowed = ['video/mp4', 'video/quicktime']
  return allowed.includes(file.type)
}
