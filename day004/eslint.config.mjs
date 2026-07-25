import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  {
    rules: {
      // 変換結果はブラウザ内で生成したBlob URLのため、next/imageによる最適化対象外。
      "@next/next/no-img-element": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "node_modules/**"]),
]);
