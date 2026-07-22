# 100Daysポートフォリオジェネレーター

モノレポ内の`day001`〜`day100`を検出し、各プロジェクトのREADMEからタイトルと概要を読み取って、ポートフォリオ用READMEの目次とリンクを自動生成・更新するCLIです。

## 特徴

- `day001`形式のフォルダを自動検出
- 各`README.md`の見出しをプロジェクト名としてリンク化
- `<!-- PORTFOLIO:START -->`〜`<!-- PORTFOLIO:END -->`の範囲だけを安全に更新
- ルートREADMEがない場合は新規作成
- 外部ライブラリ不要（Python 3.10以上）

## 使い方

リポジトリルートで実行します。

```bash
python3 day001/generate_portfolio.py .
```

別のREADMEを更新する場合は、次のように指定します。

```bash
python3 day001/generate_portfolio.py . --readme /path/to/README.md
```

各DayのREADMEは、先頭にプロジェクト名を`# 見出し`で記述してください。見出し直後の最初の通常段落が概要として採用されます。

## 公開・デプロイ

CLIツールのため、現時点で公開・デプロイ先はありません。
