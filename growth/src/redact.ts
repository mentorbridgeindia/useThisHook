const SECRET_PATTERNS: RegExp[] = [
  /Bearer\s+[A-Za-z0-9._\-/=+]+/gi,
  /("?(?:api[_-]?key|token|authorization|password|secret|private[_-]?key)"?\s*[:=]\s*")[^"]+(")/gi,
  /(-----BEGIN [A-Z ]+PRIVATE KEY-----)[\s\S]+?(-----END [A-Z ]+PRIVATE KEY-----)/g,
];

export function redactSecrets(input: string, extraSecrets: string[] = []): string {
  let output = input;
  for (const secret of extraSecrets) {
    if (!secret || secret.length < 8) continue;
    output = output.split(secret).join('[REDACTED]');
  }
  for (const pattern of SECRET_PATTERNS) {
    output = output.replace(pattern, (match, ...groups) => {
      if (groups.length >= 2 && typeof groups[0] === 'string' && typeof groups[1] === 'string')
        return `${groups[0]}[REDACTED]${groups[1]}`;
      if (match.startsWith('Bearer')) return 'Bearer [REDACTED]';
      if (match.includes('PRIVATE KEY')) return '[REDACTED_PRIVATE_KEY]';
      return '[REDACTED]';
    });
  }
  return output;
}

export function safeLog(message: string, extraSecrets: string[] = []): void {
  console.log(redactSecrets(message, extraSecrets));
}

export function safeWarn(message: string, extraSecrets: string[] = []): void {
  console.warn(redactSecrets(message, extraSecrets));
}
