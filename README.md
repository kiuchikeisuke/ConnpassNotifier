# ConnpassNotify
Gmailに来たConnpassからの通知をSlackに送るスクリプト

# 使い方
- GoogleDriveにGASのプロジェクトを作る
- main.gsの中身をコピペする
- webhookUrlにIncoming Webhookで発行したURLを指定する
- 任意のスプレッドシートを１つ作成し、spreadSheetIdとsheetNameをそれぞれ設定する
- GASのタイマー機能を設定して定期的にtimer()関数を走らせる
