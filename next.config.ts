import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // 既存の静的HTMLファイルとの共存のため出力先を src/app に限定
  // workspace root を明示して警告を抑制
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
