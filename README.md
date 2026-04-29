# 社員カルテ？DB

## 概要
社員ごとに基本情報、Cytech進捗、面談履歴、問い合わせ・トラブル履歴、社内イベント参加履歴、プライベートイベントを管理する社内向けDBシステムです。

## 使用技術
- Java 17
- Spring Boot 3.3.5
- Thymeleaf
- Spring Data JPA
- MySQL / MariaDB
- XAMPP
- HTML / CSS

## 主な機能
- 社員一覧
- 社員登録
- 社員詳細
- 社員編集
- Cytech進捗管理
- 面談履歴管理
- 問い合わせ・トラブル履歴管理
- 社内イベント参加履歴管理
- プライベートイベント管理
- レスポンシブ対応

## 起動方法
1. XAMPPでMySQLを起動
2. phpMyAdminで employee_db を作成
3. Spring Bootを起動
4. http://localhost:8080/employees にアクセス
