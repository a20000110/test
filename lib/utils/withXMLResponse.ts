export function withXMLResponse(xmlString: string): Response {
  const headers = new Headers({ 'Content-Type': 'application/xml' });
  return new Response(xmlString, { headers });
}
