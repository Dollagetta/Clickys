import { amazonConfig } from './config';

class AmazonClient {
  private accessToken: string | null = null;
  private expiresAt: number | null = null;

  private determineTokenEndpoint(): string {
    switch (amazonConfig.credentialVersion) {
      case '2.1': return 'https://creatorsapi.auth.us-east-1.amazoncognito.com/oauth2/token';
      case '2.2': return 'https://creatorsapi.auth.eu-south-2.amazoncognito.com/oauth2/token';
      case '2.3': return 'https://creatorsapi.auth.us-west-2.amazoncognito.com/oauth2/token';
      case '3.1': return 'https://api.amazon.com/auth/o2/token';
      case '3.2': return 'https://api.amazon.co.uk/auth/o2/token';
      case '3.3': return 'https://api.amazon.co.jp/auth/o2/token';
      default: return 'https://api.amazon.com/auth/o2/token';
    }
  }

  private isLwa(): boolean {
    const v = amazonConfig.credentialVersion.toLowerCase();
    return v.startsWith('3.') || v.startsWith('v3.');
  }

  async getToken(): Promise<string> {
    if (this.accessToken && this.expiresAt && Date.now() < this.expiresAt) {
      return this.accessToken;
    }
    return await this.refreshToken();
  }

  private async refreshToken(): Promise<string> {
    const endpoint = this.determineTokenEndpoint();
    const isLwa = this.isLwa();
    const scope = isLwa ? 'creatorsapi::default' : 'creatorsapi/default';

    let response;

    if (isLwa) {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: amazonConfig.credentialId,
          client_secret: amazonConfig.credentialSecret,
          scope,
        }),
      });
    } else {
      const params = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: amazonConfig.credentialId,
        client_secret: amazonConfig.credentialSecret,
        scope,
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      try {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
      } catch (e: any) {
        clearTimeout(timeoutId);
        throw new Error(`Amazon Token Fetch Error: ${e.message}`);
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Amazon Token Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    // Buffer of 30 seconds
    const expiresInMs = (data.expires_in - 30) * 1000;
    this.expiresAt = Date.now() + expiresInMs;
    return this.accessToken!;
  }

  async callApi(path: string, bodyObj: any) {
    const token = await this.getToken();
    const url = `${amazonConfig.basePath}${path}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json; charset=utf-8',
      'x-marketplace': amazonConfig.marketplace,
      'User-Agent': `creatorsapi-nodejs-sdk/1.2.0`,
    };

    if (amazonConfig.credentialVersion.startsWith('3.')) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      headers['Authorization'] = `Bearer ${token}, Version ${amazonConfig.credentialVersion}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(bodyObj),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Silently handle invalid or missing credentials in production
        return null;
      }
      const errorBody = await response.text();
      throw new Error(`Amazon API error (${response.status}): ${errorBody}`);
    }

    return await response.json();
  }
}

export const amazonClient = new AmazonClient();
