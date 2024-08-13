import TTLCache from "@isaacs/ttlcache";

export class OAuthTTL<K> {
  ttl: TTLCache<K, boolean>;

  constructor(...options: ConstructorParameters<typeof TTLCache>) {
    this.ttl = new TTLCache<K, boolean>(...options);
  }

  add(key: K): void {
    this.ttl.set(key, true);
  }

  use(key: K): void {
    this.ttl.set(key, false);
  }

  valid(key: K): boolean {
    return this.ttl.get(key) ?? true;
  }

  exists(key: K): boolean {
    return this.ttl.has(key);
  }
}
