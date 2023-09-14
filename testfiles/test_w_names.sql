--
-- File generated with SQLiteStudio v3.4.4 on �� ��� 29 15:13:13 2023
--
-- Text encoding used: System
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS names (name_id INTEGER UNIQUE, name_ TEXT PRIMARY KEY UNIQUE, is_test INTEGER DEFAULT (0));

CREATE TABLE IF NOT EXISTS courses_list (user_id INTEGER, name_id INTEGER, grade INTEGER);

INSERT INTO names(name_id, name_, is_test) VALUES (1, 'Предтренинговая работа. Моя Сила', 0);
INSERT INTO names(name_id, name_, is_test) VALUES (2, 'Посттренинговая работа. Моя Сила', 0);
INSERT INTO names(name_id, name_, is_test) VALUES (3, 'Я талантлив', 0);
INSERT INTO names(name_id, name_, is_test) VALUES (4, 'Цифровая трансформация: тренды и основные понятия', 0);
INSERT INTO names(name_id, name_, is_test) VALUES (5, 'Индустрия 4.0', 0);
INSERT INTO names(name_id, name_, is_test) VALUES (6, 'Виртуальная и дополненная реальность', 0);
INSERT INTO names(name_id, name_, is_test) VALUES (7, 'Анализ больших данных (Big Data)', 0);
INSERT INTO names(name_id, name_, is_test) VALUES (8, 'Интернет вещей', 0);
INSERT INTO names(name_id, name_, is_test) VALUES (9, 'Технология распределённых реестров и блокчейн', 0);
INSERT INTO names(name_id, name_, is_test) VALUES (10, 'SMART проект: сроки, стоимость, результат', 0);
INSERT INTO names(name_id, name_, is_test) VALUES (11, 'Успешные изменения', 0);
INSERT INTO names(name_id, name_, is_test) VALUES (12, 'Как управлять изменениями', 0);
INSERT INTO names(name_id, name_, is_test) VALUES (13, 'Модель ADKAR', 0);
INSERT INTO names(name_id, name_, is_test) VALUES (14, 'Предтренинговая работа. Сила команды', 0);
INSERT INTO names(name_id, name_, is_test) VALUES (15, 'Посттренинговая работа. Сила команды', 0);
INSERT INTO names(name_id, name_, is_test) VALUES (16, 'Клиентоцентричный Росатом', 0);
INSERT INTO names(name_id, name_, is_test) VALUES (17, 'Особенности управления инвестиционными проектами', 0);
INSERT INTO names(name_id, name_, is_test) VALUES (18, 'Лидер. Быть, а не казаться', 1);
INSERT INTO names(name_id, name_, is_test) VALUES (19, 'Сила Я', 1);
INSERT INTO names(name_id, name_, is_test) VALUES (20, 'Индустрия 4.0', 1);
INSERT INTO names(name_id, name_, is_test) VALUES (21, 'Проектное мышление', 1);
INSERT INTO names(name_id, name_, is_test) VALUES (22, 'Успешные изменения', 1);
INSERT INTO names(name_id, name_, is_test) VALUES (23, 'Ситуационное руководство', 1);
INSERT INTO names(name_id, name_, is_test) VALUES (24, 'Влияние без полномочий', 1);
INSERT INTO names(name_id, name_, is_test) VALUES (25, 'Клиентоцентричный Росатом ', 1);
INSERT INTO names(name_id, name_, is_test) VALUES (26, 'Особенности управления инвестиционными проектами', 1);

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
