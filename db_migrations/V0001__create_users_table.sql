CREATE TABLE t_p76986867_minesweeper_aircraft.users (
  id SERIAL PRIMARY KEY,
  login VARCHAR(32) NOT NULL UNIQUE,
  password VARCHAR(32) NOT NULL,
  display_name VARCHAR(64) NOT NULL,
  balance INTEGER NOT NULL DEFAULT 500,
  created_at TIMESTAMP DEFAULT NOW()
);