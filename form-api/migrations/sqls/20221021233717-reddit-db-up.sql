/* Replace with your SQL commands */
CREATE TABLE users (id SERIAL PRIMARY KEY, username VARCHAR, email VARCHAR, password VARCHAR, karma INTEGER);
INSERT INTO users ("username", "email", "password") VALUES ('admin', 'admin@admin.com', '$2b$08$xXjMfpkirSBsLbTqW5thtOMDQzyJzb6XfSZ1fXa0X3mq1udIfQ83y');
CREATE TABLE forms (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, title VARCHAR, form VARCHAR, UNIQUE(title));
INSERT INTO forms ("user_id", "title","form") VALUES (1, 'rich', 
'[{"id":"71cd4a42-ff55-4733-a130-6b749ca9b858","question":"hmm","subElements":[{"id":0,"name":"chase the bag kid"},{"id":1,"name":"never chase the dame"},{"id":2,"name":"I was grinding"},{"id":3,"name":"you was dreaming"},{"id":4,"name":"I dont care to know your name"},{"id":5,"name":"you think youre a player"},{"id":6,"name":"i already own the game"},{"id":7,"name":"We are not the same"}],"type":"select"},{"id":"2a60c614-a93f-442d-a20f-953c24f030e4","question":"","subElements":[],"type":"text"},{"id":"66fad11c-6ca1-4b12-aed5-fe5c8b44db4d","question":"dfdddsasdsdwefdcvxzss","subElements":[],"type":"text"}]'
);
CREATE TABLE submissions (id SERIAL PRIMARY KEY, form_id INTEGER REFERENCES forms(id), submission VARCHAR, ip_address VARCHAR);
CREATE TABLE refreshtokens(id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id), token VARCHAR);