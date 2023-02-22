class DocumentNotFoundError extends Error {
  constructor(request: string) {
    super(`Document not found for: ${request}`);
  }
}

export { DocumentNotFoundError };
