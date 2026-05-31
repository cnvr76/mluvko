--
-- PostgreSQL database dump
--

\restrict gJTkOpMbfnbZ63ly6aSh8TxDgRwebV54bshkm8uwaf7tb5yROgcIvBVxZCFNPm4

-- Dumped from database version 18.3 (Homebrew)
-- Dumped by pg_dump version 18.3 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: role_request_statuses; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.role_request_statuses AS ENUM (
    'pending',
    'approved',
    'rejected'
);


--
-- Name: roles; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.roles AS ENUM (
    'parent',
    'therapist',
    'admin'
);


--
-- Name: version_statuses; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.version_statuses AS ENUM (
    'draft',
    'pending',
    'published',
    'rejected',
    'archived'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activities (
    user_id uuid NOT NULL,
    game_id uuid NOT NULL,
    last_score real,
    best_score real,
    last_played timestamp with time zone DEFAULT now()
);


--
-- Name: favorites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favorites (
    user_id uuid NOT NULL,
    game_id uuid NOT NULL
);


--
-- Name: games; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.games (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    author_id uuid,
    published_version_id uuid,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: role_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    requested_role public.roles NOT NULL,
    status public.role_request_statuses DEFAULT 'pending'::public.role_request_statuses NOT NULL,
    admin_feedback text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    resolved_at timestamp with time zone
);


--
-- Name: snapshots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.snapshots (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    game_id uuid NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    name text NOT NULL,
    game_type text NOT NULL,
    description text,
    preview_image_url text,
    age_group text NOT NULL,
    config_data jsonb NOT NULL,
    status public.version_statuses DEFAULT 'draft'::public.version_statuses NOT NULL,
    admin_feedback text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    role public.roles DEFAULT 'parent'::public.roles,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.activities (user_id, game_id, last_score, best_score, last_played) FROM stdin;
cd97cd5f-f8a8-4bbc-a041-ca5ce531e937	8edfdd24-f093-4740-b043-c4248b7a9ea4	0	0	2026-04-15 00:18:21.530555+02
cd97cd5f-f8a8-4bbc-a041-ca5ce531e937	cec15a50-910c-4dbd-a1e2-719ebe46112c	60	95	2026-04-14 23:34:00.014375+02
cd97cd5f-f8a8-4bbc-a041-ca5ce531e937	9bae3aaf-bfe5-42b6-8069-21315a08cd25	13	13	2026-05-21 10:14:33.198791+02
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.favorites (user_id, game_id) FROM stdin;
cd97cd5f-f8a8-4bbc-a041-ca5ce531e937	8edfdd24-f093-4740-b043-c4248b7a9ea4
cd97cd5f-f8a8-4bbc-a041-ca5ce531e937	cec15a50-910c-4dbd-a1e2-719ebe46112c
cd97cd5f-f8a8-4bbc-a041-ca5ce531e937	9bae3aaf-bfe5-42b6-8069-21315a08cd25
43e8f1d7-aeb0-4d5f-8927-c586ab1810a1	8edfdd24-f093-4740-b043-c4248b7a9ea4
43e8f1d7-aeb0-4d5f-8927-c586ab1810a1	9bae3aaf-bfe5-42b6-8069-21315a08cd25
\.


--
-- Data for Name: games; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.games (id, author_id, published_version_id, created_at) FROM stdin;
28a3067d-55d4-494e-b5db-6361b87c07c4	\N	\N	2026-03-29 17:37:44.504459+02
76ccf013-5276-4651-8976-61a0367e75a2	\N	\N	2026-03-29 17:37:44.504459+02
cec15a50-910c-4dbd-a1e2-719ebe46112c	cd97cd5f-f8a8-4bbc-a041-ca5ce531e937	4ccb8937-69d2-4d87-b3fe-5cedce83ed6b	2026-03-29 17:37:44.504459+02
8edfdd24-f093-4740-b043-c4248b7a9ea4	cd97cd5f-f8a8-4bbc-a041-ca5ce531e937	44444444-4444-4444-4444-444444444444	2026-03-29 17:37:44.504459+02
9bae3aaf-bfe5-42b6-8069-21315a08cd25	cd97cd5f-f8a8-4bbc-a041-ca5ce531e937	3a3e840a-8d21-4661-bca0-2a242de9d00e	2026-05-20 23:52:05.916542+02
\.


--
-- Data for Name: role_requests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.role_requests (id, user_id, requested_role, status, admin_feedback, created_at, resolved_at) FROM stdin;
a516bc5c-f1a7-4566-8a14-e64dbe47d744	32f29988-6409-4990-b2e7-f6c6fbcd90de	therapist	approved	\N	2026-05-20 23:27:35.266933+02	2026-05-20 23:28:02.572953+02
cf840614-4e36-4662-8dbe-c809d6e64274	32f29988-6409-4990-b2e7-f6c6fbcd90de	therapist	approved	\N	2026-05-21 10:09:38.584368+02	2026-05-21 10:09:51.240029+02
d7eff125-376c-464d-99d4-c722d9c69ce2	43e8f1d7-aeb0-4d5f-8927-c586ab1810a1	therapist	approved	\N	2026-05-21 10:17:35.809072+02	2026-05-21 10:21:52.728412+02
\.


--
-- Data for Name: snapshots; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.snapshots (id, game_id, version, name, game_type, description, preview_image_url, age_group, config_data, status, admin_feedback, created_at) FROM stdin;
44444444-4444-4444-4444-444444444444	8edfdd24-f093-4740-b043-c4248b7a9ea4	1	Povedz ako zvieratko	repeat_after	string	/images/games_page/2-4/card_povedz_ako_zvieratko.png	2-4 roky	{"cards": [{"card_id": 1, "animal_name": "krava", "display_text": "MÚ-MÚ", "reference_text": "mo mo", "reference_audio": "static/audio/c0259dffc0e5ff02f4def5088d2fcc0a.mp3", "animal_image_url": "/images/repeat_after/cow_RepeatAfter.png"}, {"card_id": 2, "animal_name": "žabka", "display_text": "KVÁ-KVÁ", "reference_text": "kvaa kvaa", "reference_audio": "static/audio/82730614870139dcdb9f48cba5bb4a1b.mp3", "animal_image_url": "/images/repeat_after/frog_RepeatAfter.png"}, {"card_id": 6, "animal_name": "vrana", "display_text": "KRÁ-KRÁ", "reference_text": "kraa kraa", "reference_audio": "static/audio/17a6ae0cf0da5322195bbb1f6b11f3ed.mp3", "animal_image_url": "/images/repeat_after/crow_RepeatAfter.png"}, {"card_id": 3, "animal_name": "mačička", "display_text": "MŇAU-MŇAU", "reference_text": "mňau mňau", "reference_audio": "static/audio/83baffa0774ac58ea45f14a03db82c0a.mp3", "animal_image_url": "/images/repeat_after/cat_RepeatAfter.png"}, {"card_id": 4, "animal_name": "psík", "display_text": "HAF-HAF", "reference_text": "haf haf", "reference_audio": "static/audio/40fff907277c10213a4ce97fa57e4fdc.mp3", "animal_image_url": "/images/repeat_after/dog_RepeatAfter.png"}, {"card_id": 5, "animal_name": "capko", "display_text": "MÉ-MÉ", "reference_text": "mee mee", "reference_audio": "static/audio/ca83588fa01d7cd9e11053e525a81c92.mp3", "animal_image_url": "/images/repeat_after/goat_RepeatAfter.png"}], "score_threshold": 70}	published	\N	2026-03-29 17:37:44.504459+02
22222222-2222-2222-2222-222222222222	28a3067d-55d4-494e-b5db-6361b87c07c4	1	Hra3	string	string	\N	2-4 roky	{"additionalProp1": {}}	rejected	go away	2026-03-29 17:37:44.504459+02
11111111-1111-1111-1111-111111111111	76ccf013-5276-4651-8976-61a0367e75a2	1	Hra2	string	string	\N	2-4 roky	{"additionalProp1": {}}	rejected	sybau	2026-03-29 17:37:44.504459+02
33333333-3333-3333-3333-333333333333	cec15a50-910c-4dbd-a1e2-719ebe46112c	1	Pexeso so zvieratkami	pexeso	string	/images/games_page/5-6/card_pexeso_so_zvieratkami.png	5-6 rokov	{"cards": [{"id": 1, "animal_name": "krava", "animal_audio": "static/audio/c0259dffc0e5ff02f4def5088d2fcc0a.mp3", "animal_image_url": "/images/pexeso/cow_Pexeso.png"}, {"id": 2, "animal_name": "žabka", "animal_audio": "static/audio/82730614870139dcdb9f48cba5bb4a1b.mp3", "animal_image_url": "/images/pexeso/frog_Pexeso.png"}, {"id": 3, "animal_name": "vrana", "animal_audio": "static/audio/17a6ae0cf0da5322195bbb1f6b11f3ed.mp3", "animal_image_url": "/images/pexeso/crow_Pexeso.png"}, {"id": 4, "animal_name": "mačička", "animal_audio": "static/audio/83baffa0774ac58ea45f14a03db82c0a.mp3", "animal_image_url": "/images/pexeso/cat_Pexeso.png"}, {"id": 5, "animal_name": "psík", "animal_audio": "static/audio/40fff907277c10213a4ce97fa57e4fdc.mp3", "animal_image_url": "/images/pexeso/dog_Pexeso.png"}, {"id": 6, "animal_name": "capko", "animal_audio": "static/audio/ca83588fa01d7cd9e11053e525a81c92.mp3", "animal_image_url": "/images/pexeso/goat_Pexeso.png"}]}	archived	\N	2026-03-29 17:37:44.504459+02
9c7a35f8-9874-4a9c-8d7d-d2a04f85c025	cec15a50-910c-4dbd-a1e2-719ebe46112c	3	Pexeso so zvieratkami	pexeso	string	/images/games_page/5-6/card_pexeso_so_zvieratkami.png	5-6 rokov	{"cards": [{"id": 1, "animal_name": "krava", "animal_audio": "static/audio/c0259dffc0e5ff02f4def5088d2fcc0a.mp3", "animal_image_url": "/images/pexeso/cow_Pexeso.png"}, {"id": 2, "animal_name": "žabka", "animal_audio": "static/audio/82730614870139dcdb9f48cba5bb4a1b.mp3", "animal_image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWVTObodKusQhNuQrT4ieHcG1XAHbuMGRUag&s"}, {"id": 3, "animal_name": "vrana", "animal_audio": "static/audio/17a6ae0cf0da5322195bbb1f6b11f3ed.mp3", "animal_image_url": "/images/pexeso/crow_Pexeso.png"}, {"id": 4, "animal_name": "mačička", "animal_audio": "static/audio/83baffa0774ac58ea45f14a03db82c0a.mp3", "animal_image_url": "/images/pexeso/cat_Pexeso.png"}, {"id": 5, "animal_name": "psík", "animal_audio": "static/audio/40fff907277c10213a4ce97fa57e4fdc.mp3", "animal_image_url": "/images/pexeso/dog_Pexeso.png"}, {"id": 6, "animal_name": "capko", "animal_audio": "static/audio/ca83588fa01d7cd9e11053e525a81c92.mp3", "animal_image_url": "/images/pexeso/goat_Pexeso.png"}]}	rejected	Bad frog image	2026-05-16 13:49:32.55293+02
4ccb8937-69d2-4d87-b3fe-5cedce83ed6b	cec15a50-910c-4dbd-a1e2-719ebe46112c	2	Pexeso so zvieratkami	pexeso	string	/images/games_page/5-6/card_pexeso_so_zvieratkami.png	5-6 rokov	{"cards": [{"id": 1, "animal_name": "krava", "animal_audio": "static/audio/c0259dffc0e5ff02f4def5088d2fcc0a.mp3", "animal_image_url": "/images/pexeso/cow_Pexeso.png"}, {"id": 2, "animal_name": "žabka", "animal_audio": "static/audio/82730614870139dcdb9f48cba5bb4a1b.mp3", "animal_image_url": "/images/pexeso/frog_Pexeso.png"}, {"id": 3, "animal_name": "vrana", "animal_audio": "static/audio/17a6ae0cf0da5322195bbb1f6b11f3ed.mp3", "animal_image_url": "/images/pexeso/crow_Pexeso.png"}, {"id": 4, "animal_name": "mačička", "animal_audio": "static/audio/83baffa0774ac58ea45f14a03db82c0a.mp3", "animal_image_url": "/images/pexeso/cat_Pexeso.png"}, {"id": 5, "animal_name": "psík", "animal_audio": "static/audio/40fff907277c10213a4ce97fa57e4fdc.mp3", "animal_image_url": "/images/pexeso/dog_Pexeso.png"}, {"id": 6, "animal_name": "capko", "animal_audio": "static/audio/ca83588fa01d7cd9e11053e525a81c92.mp3", "animal_image_url": "/images/pexeso/goat_Pexeso.png"}]}	published	Bad frog image	2026-04-28 20:44:58.917085+02
91b4ca48-ae80-4b21-9c89-c712d4e96428	9bae3aaf-bfe5-42b6-8069-21315a08cd25	2	Nájdi a zopakuj slovo	find_and_repeat	\N	/images/find_and_repeat/static/ruka.png	2-4 roky	{"levels": [{"cards": [{"name": "Ryba", "card_id": 1, "image_url": "/images/find_and_repeat/static/ryba.png", "reference_audio": "static/audio/8b1f526083f73fb00aea6e321759f4f6.mp3"}, {"name": "Rak", "card_id": 2, "image_url": "/images/find_and_repeat/static/rak.png", "reference_audio": "static/audio/16adc20fb13e129c3f72ec94f070e20b.mp3"}, {"name": "Syr", "card_id": 3, "image_url": "/images/find_and_repeat/static/syr.png", "reference_audio": "static/audio/e62f71203b738e53fbb6e2154df24419.mp3"}, {"name": "Ruka", "card_id": 4, "image_url": "/images/find_and_repeat/static/ruka.png", "reference_audio": "static/audio/49346464f6b959c7d17f72c290e345da.mp3"}, {"name": "Robot", "card_id": 5, "image_url": "/images/find_and_repeat/static/robot.png", "reference_audio": "static/audio/5d1eca158c00250d9c4c32d947b7c433.mp3"}, {"name": "Strom", "card_id": 6, "image_url": "/images/find_and_repeat/static/strom.png", "reference_audio": "static/audio/b0507823d1aacac9b17f2ca58f37e1fb.mp3"}, {"name": "Ruža", "card_id": 7, "image_url": "/images/find_and_repeat/static/ruza.png", "reference_audio": "static/audio/52ea4d0492ac1d0a4d360252acc608f0.mp3"}], "level_id": 1, "stages_count": 4}, {"cards": [{"name": "Ruža rastie v záhrade", "card_id": 1, "image_url": "/images/find_and_repeat/gifs/ruza.gif", "reference_audio": "static/audio/bd42feadd76023998b129155fd33d0e4.mp3"}, {"name": "Robot robí prácu", "card_id": 2, "image_url": "/images/find_and_repeat/gifs/robot.gif", "reference_audio": "static/audio/21a12ef42f5ca8f495ba08318c4d75e9.mp3"}, {"name": "Ruka drží pero", "card_id": 3, "image_url": "/images/find_and_repeat/gifs/ruka.gif", "reference_audio": "static/audio/aeb4f4d4766f713d7872ebe8f0b9297a.mp3"}, {"name": "Rak lezie po kameni", "card_id": 4, "image_url": "/images/find_and_repeat/gifs/rak.gif", "reference_audio": "static/audio/274abbca79bb95a421f1dbadb88a7aaf.mp3"}, {"name": "Ryba pláva v rieke", "card_id": 5, "image_url": "/images/find_and_repeat/gifs/ryba.gif", "reference_audio": "static/audio/7aa89eda1eb4f4a98c0cff2830b365a0.mp3"}, {"name": "Syr sa krája", "card_id": 6, "image_url": "/images/find_and_repeat/gifs/syr.gif", "reference_audio": "static/audio/268284dd666846cc0e5f82f552a385ef.mp3"}], "level_id": 2, "stages_count": 4}], "find_prompt_audio": "static/audio/315e25b01ae33eb2375107ee1e9a0467.mp3", "confirm_prompt_audio": "static/audio/1d1d0e0b3fab400b57073c3000f33726.mp3"}	archived	\N	2026-05-21 00:46:34.101941+02
e08b5211-97e7-45b4-a862-c7f3c90d3f3a	9bae3aaf-bfe5-42b6-8069-21315a08cd25	1	Nazov hry	find_and_repeat	\N	\N	2-4 roky	{"levels": [{"cards": [{"name": "Ryba", "card_id": 1, "image_url": "/images/find_and_repeat/static/ryba.png", "reference_audio": "static/audio/8b1f526083f73fb00aea6e321759f4f6.mp3"}, {"name": "Rak", "card_id": 2, "image_url": "/images/find_and_repeat/static/rak.png", "reference_audio": "static/audio/16adc20fb13e129c3f72ec94f070e20b.mp3"}, {"name": "Syr", "card_id": 3, "image_url": "/images/find_and_repeat/static/syr.png", "reference_audio": "static/audio/e62f71203b738e53fbb6e2154df24419.mp3"}, {"name": "Ruka", "card_id": 4, "image_url": "/images/find_and_repeat/static/ruka.png", "reference_audio": "static/audio/49346464f6b959c7d17f72c290e345da.mp3"}, {"name": "Robot", "card_id": 5, "image_url": "/images/find_and_repeat/static/robot.png", "reference_audio": "static/audio/5d1eca158c00250d9c4c32d947b7c433.mp3"}, {"name": "Strom", "card_id": 6, "image_url": "/images/find_and_repeat/static/strom.png", "reference_audio": "static/audio/b0507823d1aacac9b17f2ca58f37e1fb.mp3"}, {"name": "Ruža", "card_id": 7, "image_url": "/images/find_and_repeat/static/ruza.png", "reference_audio": "static/audio/52ea4d0492ac1d0a4d360252acc608f0.mp3"}], "level_id": 1, "stages_count": 4}, {"cards": [{"name": "Ruža rastie v záhrade", "card_id": 1, "image_url": "/images/find_and_repeat/gifs/ruza.gif", "reference_audio": "static/audio/bd42feadd76023998b129155fd33d0e4.mp3"}, {"name": "Robot robí prácu", "card_id": 2, "image_url": "/images/find_and_repeat/gifs/robot.gif", "reference_audio": "static/audio/21a12ef42f5ca8f495ba08318c4d75e9.mp3"}, {"name": "Ruka drží pero", "card_id": 3, "image_url": "/images/find_and_repeat/gifs/ruka.gif", "reference_audio": "static/audio/aeb4f4d4766f713d7872ebe8f0b9297a.mp3"}, {"name": "Rak lezie po kameni", "card_id": 4, "image_url": "/images/find_and_repeat/gifs/rak.gif", "reference_audio": "static/audio/274abbca79bb95a421f1dbadb88a7aaf.mp3"}, {"name": "Ryba pláva v rieke", "card_id": 5, "image_url": "/images/find_and_repeat/gifs/ryba.gif", "reference_audio": "static/audio/7aa89eda1eb4f4a98c0cff2830b365a0.mp3"}, {"name": "Syr sa krája", "card_id": 6, "image_url": "/images/find_and_repeat/gifs/syr.gif", "reference_audio": "static/audio/268284dd666846cc0e5f82f552a385ef.mp3"}], "level_id": 2, "stages_count": 4}], "find_prompt_audio": "static/audio/315e25b01ae33eb2375107ee1e9a0467.mp3", "confirm_prompt_audio": "static/audio/1d1d0e0b3fab400b57073c3000f33726.mp3"}	rejected	nie	2026-05-20 23:52:05.916542+02
1ce042d7-0e0f-4f37-b6b7-780ee35c355d	cec15a50-910c-4dbd-a1e2-719ebe46112c	4	Pexeso so zvieratkami	pexeso	string	/images/games_page/5-6/card_pexeso_so_zvieratkami.png	5-6 rokov	{"cards": [{"id": 1, "animal_name": "krava", "animal_audio": "static/audio/c0259dffc0e5ff02f4def5088d2fcc0a.mp3", "animal_image_url": "/images/pexeso/cow_Pexeso.png"}, {"id": 2, "animal_name": "žabka", "animal_audio": "static/audio/82730614870139dcdb9f48cba5bb4a1b.mp3", "animal_image_url": "/images/pexeso/frog_Pexeso.png"}, {"id": 3, "animal_name": "vrana", "animal_audio": "static/audio/17a6ae0cf0da5322195bbb1f6b11f3ed.mp3", "animal_image_url": "/images/pexeso/crow_Pexeso.png"}, {"id": 4, "animal_name": "mačička", "animal_audio": "static/audio/83baffa0774ac58ea45f14a03db82c0a.mp3", "animal_image_url": "/images/pexeso/cat_Pexeso.png"}, {"id": 5, "animal_name": "psík", "animal_audio": "static/audio/40fff907277c10213a4ce97fa57e4fdc.mp3", "animal_image_url": "/images/pexeso/dog_Pexeso.png"}, {"id": 6, "animal_name": "capko", "animal_audio": "static/audio/552e6a97297c53e592208cf97fbb3b60.mp3", "animal_image_url": "/images/pexeso/goat_Pexeso.png"}]}	archived	\N	2026-05-21 10:29:02.374916+02
3e01060d-c537-438d-b67c-431f61ce5cef	cec15a50-910c-4dbd-a1e2-719ebe46112c	5	Pexeso so zvieratkami	pexeso	string	/images/games_page/5-6/card_pexeso_so_zvieratkami.png	2-4 roky	{"cards": [{"id": 1, "animal_name": "krava", "animal_audio": "static/audio/c0259dffc0e5ff02f4def5088d2fcc0a.mp3", "animal_image_url": "/images/pexeso/cow_Pexeso.png"}, {"id": 2, "animal_name": "žabka", "animal_audio": "static/audio/82730614870139dcdb9f48cba5bb4a1b.mp3", "animal_image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWVTObodKusQhNuQrT4ieHcG1XAHbuMGRUag&s"}, {"id": 3, "animal_name": "vrana", "animal_audio": "static/audio/17a6ae0cf0da5322195bbb1f6b11f3ed.mp3", "animal_image_url": "/images/pexeso/crow_Pexeso.png"}, {"id": 4, "animal_name": "mačička", "animal_audio": "static/audio/83baffa0774ac58ea45f14a03db82c0a.mp3", "animal_image_url": "/images/pexeso/cat_Pexeso.png"}, {"id": 5, "animal_name": "psík", "animal_audio": "static/audio/40fff907277c10213a4ce97fa57e4fdc.mp3", "animal_image_url": "/images/pexeso/dog_Pexeso.png"}, {"id": 6, "animal_name": "capko", "animal_audio": "static/audio/ca83588fa01d7cd9e11053e525a81c92.mp3", "animal_image_url": "/images/pexeso/goat_Pexeso.png"}]}	draft	\N	2026-05-25 22:20:00.45016+02
3a3e840a-8d21-4661-bca0-2a242de9d00e	9bae3aaf-bfe5-42b6-8069-21315a08cd25	3	Nájdi a zopakuj slovo	find_and_repeat	\N	/images/find_and_repeat/static/ruka.png	2-4 roky	{"levels": [{"cards": [{"name": "Ryba", "card_id": 1, "image_url": "/images/find_and_repeat/static/ryba.png", "reference_audio": "static/audio/1f7d0e164de15ed471a89bf651a3524f.mp3"}, {"name": "Rak", "card_id": 2, "image_url": "/images/find_and_repeat/static/rak.png", "reference_audio": "static/audio/0644af005772702febde1ed67b2cc532.mp3"}, {"name": "Syr", "card_id": 3, "image_url": "/images/find_and_repeat/static/syr.png", "reference_audio": "static/audio/f23c619d2aacf30ea82d20fc883cc8d4.mp3"}, {"name": "Ruka", "card_id": 4, "image_url": "/images/find_and_repeat/static/ruka.png", "reference_audio": "static/audio/49346464f6b959c7d17f72c290e345da.mp3"}, {"name": "Robot", "card_id": 5, "image_url": "/images/find_and_repeat/static/robot.png", "reference_audio": "static/audio/5d1eca158c00250d9c4c32d947b7c433.mp3"}, {"name": "Strom", "card_id": 6, "image_url": "/images/find_and_repeat/static/strom.png", "reference_audio": "static/audio/b0507823d1aacac9b17f2ca58f37e1fb.mp3"}, {"name": "Ruža", "card_id": 7, "image_url": "/images/find_and_repeat/static/ruza.png", "reference_audio": "static/audio/c6f178767a819fb149c125f4a21958f9.mp3"}], "level_id": 1, "stages_count": 4}, {"cards": [{"name": "Ruža rastie v záhrade", "card_id": 1, "image_url": "/images/find_and_repeat/gifs/ruza.gif", "reference_audio": "static/audio/7885223427b880bf2fbc96d5a69836b1.mp3"}, {"name": "Robot robí prácu", "card_id": 2, "image_url": "/images/find_and_repeat/gifs/robot.gif", "reference_audio": "static/audio/12b50977fca79a595765bd04ab1a47a1.mp3"}, {"name": "Ruka drží pero", "card_id": 3, "image_url": "/images/find_and_repeat/gifs/ruka.gif", "reference_audio": "static/audio/4a7a9d4c1c77e6009e76eefd33c54ade.mp3"}, {"name": "Rak lezie po kameni", "card_id": 4, "image_url": "/images/find_and_repeat/gifs/rak.gif", "reference_audio": "static/audio/d071471fcb2aff4be387b583b550b221.mp3"}, {"name": "Ryba pláva v rieke", "card_id": 5, "image_url": "/images/find_and_repeat/gifs/ryba.gif", "reference_audio": "static/audio/790cf65719b0173538fe39ddfdd7e405.mp3"}, {"name": "Syr sa krája", "card_id": 6, "image_url": "/images/find_and_repeat/gifs/syr.gif", "reference_audio": "static/audio/52a7b5652c1c829f690f5acdf02809e8.mp3"}], "level_id": 2, "stages_count": 4}], "find_prompt_audio": "static/audio/315e25b01ae33eb2375107ee1e9a0467.mp3", "confirm_prompt_audio": "static/audio/1d1d0e0b3fab400b57073c3000f33726.mp3"}	published	\N	2026-05-25 22:18:56.099392+02
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, email, password_hash, role, created_at) FROM stdin;
cd97cd5f-f8a8-4bbc-a041-ca5ce531e937	Admin	admin@mluvko.com	scrypt:32768:8:1$g17nfxPGLWyFdDYI$8196fccecede506875148af66bead7228aa766a7c3e4607e7ff4764026d16b579f4e121c3fda5d9f602236fa0093143c3b62b80b9eb231269b7e94ca5dbe6547	admin	2026-03-31 01:09:19.968493+02
32f29988-6409-4990-b2e7-f6c6fbcd90de	Logoped	rodic@example.com	scrypt:32768:8:1$dZ4stygBbTts35eg$8d97a9a9f3c93c76c9dba757618138c69d62dfbbe572e41345b1150a855692ac3f1c52373730997d32962022a72395439dfbc9147a6ff09b10c732334a15ab68	therapist	2026-05-20 23:27:07.548022+02
43e8f1d7-aeb0-4d5f-8927-c586ab1810a1	Roman	roman.jarina@gmail.com	scrypt:32768:8:1$PGHn6gJMNgwqfcK4$a289952c868ff0dc11918b11f0ed8ab3a643263dff1e10ead3efcc6de5abe4f4211b90f37a07506bf35b126a6fa01b25463070639bf2ab87152a207e996d22d8	parent	2026-05-21 10:17:13.719599+02
\.


--
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (user_id, game_id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (user_id, game_id);


--
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (id);


--
-- Name: role_requests role_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_requests
    ADD CONSTRAINT role_requests_pkey PRIMARY KEY (id);


--
-- Name: snapshots snapshots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.snapshots
    ADD CONSTRAINT snapshots_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: activities activities_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id) ON DELETE CASCADE;


--
-- Name: activities activities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: favorites favorites_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id) ON DELETE CASCADE;


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: games fk_published_snapshot; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT fk_published_snapshot FOREIGN KEY (published_version_id) REFERENCES public.snapshots(id) ON DELETE SET NULL;


--
-- Name: games games_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: role_requests role_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_requests
    ADD CONSTRAINT role_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: snapshots snapshots_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.snapshots
    ADD CONSTRAINT snapshots_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict gJTkOpMbfnbZ63ly6aSh8TxDgRwebV54bshkm8uwaf7tb5yROgcIvBVxZCFNPm4

