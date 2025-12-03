export abstract class HttpService {
  protected static baseURL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  private ignoreRefreshPaths = [
    '/auth/login',
    '/auth/register',
    '/auth/refresh',
  ];

  protected getBaseUrl() {
    return HttpService.baseURL + '/';
  }

  protected async raw(url: string, options: RequestInit = {}) {
    return fetch(this.getBaseUrl() + url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
      ...options,
    });
  }

  private async doRefresh(): Promise<boolean> {
    const res = await this.raw('/auth/refresh', { method: 'POST' });
    return res.status !== 401;
  }

  protected async request(
    url: string,
    options: RequestInit = {},
  ): Promise<Response | null> {
    const ignore = this.ignoreRefreshPaths.includes(url);

    let res = await this.raw(url, options);

    if (res.status === 401 && !ignore) {
      const refreshed = await this.doRefresh();

      if (!refreshed) {
        await this.raw('/auth/logout', { method: 'POST' });

        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return null;
      }

      res = await this.raw(url, options);
    }

    return res;
  }

  protected async json<T>(
    url: string,
    options: RequestInit = {},
  ): Promise<T | null> {
    const res = await this.request(url, options);
    if (!res) return null;
    return res.json() as Promise<T>;
  }

  protected async text(
    url: string,
    options: RequestInit = {},
  ): Promise<string | null> {
    const res = await this.request(url, options);
    if (!res) return null;
    return res.text();
  }

  protected async blob(
    url: string,
    options: RequestInit = {},
  ): Promise<Blob | null> {
    const res = await this.request(url, options);
    if (!res) return null;
    return res.blob();
  }
}
