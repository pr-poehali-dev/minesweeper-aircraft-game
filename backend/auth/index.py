"""
Регистрация и вход игроков NEXUS.
Генерирует случайный логин и пароль при регистрации.
"""
import json
import os
import random
import string
import psycopg2

SCHEMA = "t_p76986867_minesweeper_aircraft"

ADJECTIVES = ["Дикий", "Быстрый", "Острый", "Тёмный", "Стальной", "Огненный", "Ледяной", "Золотой", "Скрытый", "Грозный"]
NOUNS = ["Тигр", "Ворон", "Волк", "Сокол", "Дракон", "Рысь", "Акула", "Ягуар", "Орёл", "Кобра"]

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def generate_login():
    adj = random.choice(ADJECTIVES)
    noun = random.choice(NOUNS)
    num = random.randint(10, 9999)
    return f"{adj}{noun}{num}"


def generate_password(length=8):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choices(chars, k=length))


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    action = body.get("action")

    conn = get_conn()
    cur = conn.cursor()

    try:
        if action == "register":
            login = generate_login()
            password = generate_password()
            display_name = login

            cur.execute(
                f"INSERT INTO {SCHEMA}.users (login, password, display_name) VALUES (%s, %s, %s) RETURNING id, balance",
                (login, password, display_name)
            )
            row = cur.fetchone()
            conn.commit()

            resp = {"ok": True, "login": login, "password": password, "id": row[0], "balance": row[1], "display_name": display_name}
            return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(resp, ensure_ascii=False)}

        elif action == "login":
            login = body.get("login", "").strip()
            password = body.get("password", "").strip()

            cur.execute(
                f"SELECT id, login, display_name, balance FROM {SCHEMA}.users WHERE login = %s AND password = %s",
                (login, password)
            )
            row = cur.fetchone()

            if not row:
                return {"statusCode": 401, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps({"ok": False, "error": "Неверный логин или пароль"}, ensure_ascii=False)}

            resp = {"ok": True, "id": row[0], "login": row[1], "display_name": row[2], "balance": row[3]}
            return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(resp, ensure_ascii=False)}

        else:
            return {"statusCode": 400, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps({"ok": False, "error": "Unknown action"}, ensure_ascii=False)}

    finally:
        cur.close()
        conn.close()