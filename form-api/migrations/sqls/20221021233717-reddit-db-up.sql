/* Replace with your SQL commands */
CREATE TABLE users (id SERIAL PRIMARY KEY, username VARCHAR, email VARCHAR, password VARCHAR, verified BOOLEAN);
INSERT INTO users ("username", "email", "password", "verified") VALUES ('admin', 'admin@admin.com', '$2b$08$xXjMfpkirSBsLbTqW5thtOMDQzyJzb6XfSZ1fXa0X3mq1udIfQ83y', true);
CREATE TABLE forms (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, title VARCHAR, form VARCHAR, live BOOLEAN,UNIQUE(title, user_id));
INSERT INTO forms ("user_id", "title","form") VALUES (1, 'Course Application Form', 

'[{"id":"66fad11c-6ca1-4b12-aed5-fe5c1b44db4d","question":"Email","subElements":[],"type":"text"},
{"id":"66fad11c-6ca1-4b12-aed5-fe5c8b44db4d","question":"Full Name","subElements":[],"type":"text"},
{"id":"71cd4a42-ff55-4733-a130-6b749ca9b858","question":"Chosen Track","subElements":[{"id":0,"name":"Web Development"},{"id":1,"name":"Mobile App Development"},{"id":2,"name":"Embedded Systems"},{"id":3,"name":"DevOps Engineering"},{"id":4,"name":"Networking Fundamentals"}],"type":"select"},
{"id":"2a60c614-a93f-442d-a20f-953c24f030e4","question":"How have you learned of our Course Program?","subElements":[{"id":0, "name":"Facebook"},{"id":1, "name":"Youtube"},{"id":2, "name":"Reddit"},{"id":3, "name":"Recommended by a Friend"}],"type":"checkbox"}]'
);
CREATE TABLE submissions (id SERIAL PRIMARY KEY, form_id INTEGER REFERENCES forms(id), submission VARCHAR, ip_address VARCHAR);
CREATE TABLE refreshtokens(id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), token VARCHAR);
CREATE TABLE mail_codes(id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), code INTEGER, UNIQUE(user_id, code))