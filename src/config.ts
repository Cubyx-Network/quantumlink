export type Config = {
  port: number;
  discord_token: string;
  admin_secret: string;
  minio: {
    endpoint: string;
    port: number;
    useSSL: boolean;
    auth: {
      accessKey: string;
      secretKey: string;
    };
    buckets: {
      files: string;
      website: string;
    };
  };
  discord: {
    upload_channel: string;
  };
};
