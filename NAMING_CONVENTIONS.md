# Taskit プロジェクト命名規則

本ドキュメントは `taskit` プロジェクトにおけるファイル、クラス、変数、関数、およびスタイルの命名規則を定義するものです。
TypeScript および Lit を用いた一般的な Web アプリケーション開発のベストプラクティスに基づき、既存のコードベースの傾向を踏まえて策定しています。

---

## 1. ファイルとディレクトリ

ファイルやディレクトリの名前は、その役割や内容が一目でわかるように命名します。

- **ディレクトリ名**: ケバブケース (`kebab-case`)
  - 例: `components`, `ti-checkboxes`, `models`, `service`, `assets`
- **Lit コンポーネントファイル**: ケバブケース (`kebab-case`)
  - コンポーネントのカスタムタグ名と一致させます。
  - 例: `ti-checkboxes.ts`, `ti-task-data.ts`, `taskit-app.ts`
- **モデル / インターフェース / サービスクラスファイル**: パスカルケース (`PascalCase`)
  - エクスポートする主要なクラス名やインターフェース名と一致させます。
  - 例: `Task.ts`, `Member.ts`, `TaskItDB.ts`
- **ユーティリティファイル**: キャメルケース (`camelCase`) または ケバブケース (`kebab-case`)
  - 例: `utils.ts`
- **スタイルシート**: ケバブケース (`kebab-case`)
  - 対応するコンポーネント名に `.lit.scss` を付与します。
  - 例: `ti-checkboxes.lit.scss`, `taskit-app.lit.scss`

## 2. クラス領域（Class & Component）

- **クラス名・コンポーネントクラス名**: パスカルケース (`PascalCase`)
  - 例: `TiCheckboxes`, `TiTaskData`, `TaskitApp`, `TaskItDB`
- **カスタムエレメントタグ名**: ケバブケース (`kebab-case`)
  - 必ずハイフンを含め、プロジェクト固有のプレフィックス（例: `ti-`）を使用します。
  - 例: `ti-checkboxes`, `ti-task-data`, `taskit-app`

## 3. 型定義（Types & Interfaces）

- **インターフェース名 (interface) / 型エイリアス (type)**: パスカルケース (`PascalCase`)
  - ※ `I` プレフィックス（例：`ITask`）は近年の TypeScript の標準的な慣習に則り使用しません。
  - 例: `Task`, `Member`, `CB`, `TaskStatusCode`

## 4. 変数とプロパティ（Variables & Properties）

- **一般的な変数・プロパティ**: キャメルケース (`camelCase`)
  - 例: `selectedTaskId`, `dueDate`, `updatedTask`
- **プライベート / プロテクテッド プロパティ**: アンダースコア `_` + キャメルケース (`_camelCase`)
  - クラス内部でのみ使用される状態（`@state`）や内部参照（`@query`）などに用います。
  - 例: `_updatedCheckboxes`, `_taskData`, `_titleInput`, `_isMemberEditMode`
- **真偽値 (Boolean) を表す変数**: `is`, `has`, `should`, `can` などをプレフィックスとして付与します。
  - 例: `isEditMode`, `isChecked`, `hasError`
- **定数 (Constants)**: アッパースネークケース (`UPPER_SNAKE_CASE`)
  - 不変の値として定義されるもの。
  - 例: `TASK_STATUS`, `INSERT_TEXT`

## 5. 関数とメソッド（Functions & Methods）

関数名は「動詞 + 名詞」の組み合わせを基本とし、どのような処理を行うかが明確になるようにします。

- **一般的な関数・パブリックメソッド**: キャメルケース (`camelCase`)
  - 例: `getEditorData()`, `addTask()`, `updateTask()`, `formatDate()`
- **プライベート / プロテクテッド メソッド**: アンダースコア `_` + キャメルケース (`_camelCase`)
  - 例: `_parseCheckboxes()`, `_updateTaskData()`
- **イベントハンドラ（コールバック関数）**: `_handle` または `handle` をプレフィックスとします。（対象となるイベントや要素を含めると分かりやすくなります）
  - 例: `_handleChangeTitle()`, `_handleKeyDown()`, `_handleClickEditMember()`

## 6. カスタムイベント名（Custom Events）

- **イベント名**: ケバブケース (`kebab-case`)
  - コンポーネント間でやり取りするカスタムイベントには、プロジェクト固有のプレフィックス（例: `ti-`）を付与し、どのようなアクションが発生したかを示します。
  - 例: `ti-change-checkboxes`, `ti-taskitem-click`, `ti-edit`

## 7. スタイルシート (SCSS / CSS)

CSS クラス名は、Web コンポーネントの構造と責務を明確にするため、**BEM (Block Element Modifier)** をベースにした命名規則を採用します。

### 7.1. クラス名の基本構成

原則として `Block__Element--Modifier` の形式で記述します。

- **Block (ブロック)**: コンポーネントのルート。カスタムエレメント名からプレフィックスを除いた名称を用います。
  - 例: `.checkboxes`, `.task-card`
- **Element (要素)**: ブロックを構成する子要素。アンダースコア 2つ `__` で繋ぎます。
  - 例: `.task-card__title`, `.task-card__button`
- **Modifier (修飾子)**: 状態やバリエーション（色、サイズ、活性状態など）。ハイフン 2つ `--` で繋ぎます。
  - 例: `.task-card__button--primary`, `.task-card--completed`

### 7.2. 状態を示すクラス (State)

TypeScript 側の `isEditMode` 等の論理変数と同期させる場合、`is-` プレフィックスを使用します。

- **接頭辞 `is-`**: 要素の現在の状態を示します。
  - 例: `.is-active`, `.is-hidden`, `.is-error`, `.is-loading`

### 7.3. SCSS 変数とミックスイン

グローバル、またはコンポーネント内で共有される SCSS 独自のエンティティは以下の通り命名します。

- **SCSS 変数**: ケバブケース (`kebab-case`)。プロジェクト共通変数には `ti-` を付与します。
  - 例: `$ti-color-primary`, `$ti-font-size-base`, `$ti-spacing-m`
- **ミックスイン (Mixin)**: ケバブケース (`kebab-case`)
  - 例: `@include ti-flex-center;`, `@include ti-mobile-border;`

### 7.4. 実装例 (ti-task-card.lit.scss)

```scss
:host {
  display: block; // コンポーネント自体のスタイル
}

.task-card {
  border: 1px solid $ti-color-border;

  &__title {
    font-weight: bold;
    &--large {
      font-size: 1.2rem;
    }
  }

  &__content {
    padding: $ti-spacing-m;
  }

  // 状態クラスのネスト
  &.is-completed {
    opacity: 0.6;
    text-decoration: line-through;
  }
}
```
