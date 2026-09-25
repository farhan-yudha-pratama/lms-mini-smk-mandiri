-- Seeder for materialCategory, page, and pageSequence

-- Bersihkan data lama terlebih dahulu agar tidak terjadi duplicate key error
TRUNCATE TABLE "pageSequence", "page", "materialCategory" CASCADE;

-- ==========================================
-- Kategori: HTML Dasar
-- ==========================================
INSERT INTO "materialCategory" ("id", "name", "slug", "description", "orderIndex", "isActive", "createdAt", "updatedAt") 
VALUES ('0e96d32f-5044-4d76-8cb5-87aa06faaf9d', 'HTML Dasar', 'html', 'Materi pembelajaran HTML Dasar', 1, true, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('6cd77f4c-8c21-41fe-9680-6657f2cbee63', '0e96d32f-5044-4d76-8cb5-87aa06faaf9d', 'Pendahuluan HTML', 'pengenalan-html', 'Halaman materi Pendahuluan HTML', 1, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('c035a1a5-deed-403a-8870-6db4221b3d15', '6cd77f4c-8c21-41fe-9680-6657f2cbee63', NULL, 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('9f8ae06e-3837-4b7e-991c-69d502ce1ea2', '0e96d32f-5044-4d76-8cb5-87aa06faaf9d', 'Elemen & Tag', 'elemen-tag', 'Halaman materi Elemen & Tag', 2, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('11a3c7e1-df0f-47ef-a521-55c925d24471', '9f8ae06e-3837-4b7e-991c-69d502ce1ea2', '6cd77f4c-8c21-41fe-9680-6657f2cbee63', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('24d5caea-dac2-46cf-9687-fd9b5a5af24e', '0e96d32f-5044-4d76-8cb5-87aa06faaf9d', 'Heading & Paragraf', 'heading-paragraf', 'Halaman materi Heading & Paragraf', 3, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('3fa24bbf-02cf-4333-976a-16644c03d574', '24d5caea-dac2-46cf-9687-fd9b5a5af24e', '9f8ae06e-3837-4b7e-991c-69d502ce1ea2', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('8ea67c94-4711-4347-9159-dd59414a8a3b', '0e96d32f-5044-4d76-8cb5-87aa06faaf9d', 'Link & Gambar', 'link-gambar', 'Halaman materi Link & Gambar', 4, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('debbc1c0-092c-4200-ad39-29cdf4df3d7b', '8ea67c94-4711-4347-9159-dd59414a8a3b', '24d5caea-dac2-46cf-9687-fd9b5a5af24e', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('1fefe4c3-e10b-4be3-89e8-36a54f30ccb6', '0e96d32f-5044-4d76-8cb5-87aa06faaf9d', 'List & Tabel', 'list-tabel', 'Halaman materi List & Tabel', 5, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('a75bd25f-5cc7-4359-8e70-1be05911aa78', '1fefe4c3-e10b-4be3-89e8-36a54f30ccb6', '8ea67c94-4711-4347-9159-dd59414a8a3b', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('6d8e64a8-7653-4309-a567-a0d8ab8173ae', '0e96d32f-5044-4d76-8cb5-87aa06faaf9d', 'Form HTML', 'form', 'Halaman materi Form HTML', 6, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('90bac2e7-4467-4308-b3f5-9fee6160bff9', '6d8e64a8-7653-4309-a567-a0d8ab8173ae', '1fefe4c3-e10b-4be3-89e8-36a54f30ccb6', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('b176bd25-b321-49ef-bb7f-0a7836b7ce0e', '0e96d32f-5044-4d76-8cb5-87aa06faaf9d', 'Semantic HTML', 'semantic', 'Halaman materi Semantic HTML', 7, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('28e57088-d299-43b5-ae31-ba7680199c22', 'b176bd25-b321-49ef-bb7f-0a7836b7ce0e', '6d8e64a8-7653-4309-a567-a0d8ab8173ae', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('538841b8-1243-4107-8e7b-811ad73c2738', '0e96d32f-5044-4d76-8cb5-87aa06faaf9d', 'Multimedia & Embed', 'multimedia', 'Halaman materi Multimedia & Embed', 8, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('affad00e-2293-4b61-a671-1595fcdeda35', '538841b8-1243-4107-8e7b-811ad73c2738', 'b176bd25-b321-49ef-bb7f-0a7836b7ce0e', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('bae9ad59-9fad-40fd-9b11-2596ecda30b8', '0e96d32f-5044-4d76-8cb5-87aa06faaf9d', 'Meta, HEAD & SEO', 'meta-head-seo', 'Halaman materi Meta, HEAD & SEO', 9, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('84d6e4db-c479-4bab-bd1b-d80e74f64eb0', 'bae9ad59-9fad-40fd-9b11-2596ecda30b8', '538841b8-1243-4107-8e7b-811ad73c2738', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('85232561-9b8e-4c35-b102-c5c19e546845', '0e96d32f-5044-4d76-8cb5-87aa06faaf9d', 'Project 1: Portfolio HTML', 'project-1-html', 'Halaman materi Project 1: Portfolio HTML', 10, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('0fb83655-fedb-4628-bbec-daf76f0c35a9', '85232561-9b8e-4c35-b102-c5c19e546845', 'bae9ad59-9fad-40fd-9b11-2596ecda30b8', 70.0, NOW(), NOW());

-- ==========================================
-- Kategori: CSS Styling
-- ==========================================
INSERT INTO "materialCategory" ("id", "name", "slug", "description", "orderIndex", "isActive", "createdAt", "updatedAt") 
VALUES ('74c40bbd-9690-4ac3-91af-9473ba011963', 'CSS Styling', 'css', 'Materi pembelajaran CSS Styling', 2, true, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('4f53883a-4c1d-4748-9f9b-b4de7c7f9c5a', '74c40bbd-9690-4ac3-91af-9473ba011963', '1. Pengenalan CSS', 'pengenalan-css', 'Halaman materi 1. Pengenalan CSS', 1, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('6cde50d8-0517-4bdc-ba4d-000d9cf48cb1', '4f53883a-4c1d-4748-9f9b-b4de7c7f9c5a', NULL, 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('aa24d06f-cd0a-4d09-8da5-1bfc7fbd6ee2', '74c40bbd-9690-4ac3-91af-9473ba011963', '2. Cara Memanggil', 'pemanggilan-css', 'Halaman materi 2. Cara Memanggil', 2, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('bb568389-9316-4e87-a448-f7836068fa26', 'aa24d06f-cd0a-4d09-8da5-1bfc7fbd6ee2', '4f53883a-4c1d-4748-9f9b-b4de7c7f9c5a', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('75ea740c-1d33-4675-86ad-12e105c0ff14', '74c40bbd-9690-4ac3-91af-9473ba011963', '3. Sintaks & Selector', 'sintaks-selector', 'Halaman materi 3. Sintaks & Selector', 3, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('5fd99cc9-d3e0-495f-a027-c9292c20ddf8', '75ea740c-1d33-4675-86ad-12e105c0ff14', 'aa24d06f-cd0a-4d09-8da5-1bfc7fbd6ee2', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('efa89e2a-a12c-40c7-bb6a-6ee75ff7569a', '74c40bbd-9690-4ac3-91af-9473ba011963', '4. Hirarki (Specificity)', 'specificity-css', 'Halaman materi 4. Hirarki (Specificity)', 4, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('ebbdae72-6d58-4085-971c-7ccc8df2651f', 'efa89e2a-a12c-40c7-bb6a-6ee75ff7569a', '75ea740c-1d33-4675-86ad-12e105c0ff14', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('aef0361f-3f85-411b-9699-00143880d8e3', '74c40bbd-9690-4ac3-91af-9473ba011963', '5. Satuan Ukuran', 'satuan-ukuran', 'Halaman materi 5. Satuan Ukuran', 5, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('86b45e03-a7f5-4603-b934-8a8658cae1df', 'aef0361f-3f85-411b-9699-00143880d8e3', 'efa89e2a-a12c-40c7-bb6a-6ee75ff7569a', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('bd3ca753-bf53-407e-b97e-8e8be61a948d', '74c40bbd-9690-4ac3-91af-9473ba011963', '6. Tipografi & Font', 'tipografi', 'Halaman materi 6. Tipografi & Font', 6, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('68021e74-94ce-4a32-a009-60bb292fbd72', 'bd3ca753-bf53-407e-b97e-8e8be61a948d', 'aef0361f-3f85-411b-9699-00143880d8e3', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('a40ef758-b62c-4c91-9dd3-24101e158e9b', '74c40bbd-9690-4ac3-91af-9473ba011963', '7. Warna & Background', 'warna-background', 'Halaman materi 7. Warna & Background', 7, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('bc9ff514-8dd6-4e27-a188-21c31a673108', 'a40ef758-b62c-4c91-9dd3-24101e158e9b', 'bd3ca753-bf53-407e-b97e-8e8be61a948d', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('a3ed4b58-712b-4099-857a-0e1bcb42e83f', '74c40bbd-9690-4ac3-91af-9473ba011963', '8. Sifat Display', 'display-css', 'Halaman materi 8. Sifat Display', 8, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('8584baf9-dd55-4970-9294-b097a8e08abb', 'a3ed4b58-712b-4099-857a-0e1bcb42e83f', 'a40ef758-b62c-4c91-9dd3-24101e158e9b', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('edea2bd8-9da8-4602-95ab-5e5b9473f793', '74c40bbd-9690-4ac3-91af-9473ba011963', '9. Box Model', 'box-model', 'Halaman materi 9. Box Model', 9, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('a40aae3a-7cfd-4c3a-8971-ffe622f81179', 'edea2bd8-9da8-4602-95ab-5e5b9473f793', 'a3ed4b58-712b-4099-857a-0e1bcb42e83f', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('8994c7fe-cca2-4404-a6b3-1626955d6a39', '74c40bbd-9690-4ac3-91af-9473ba011963', '10. Flexbox Layout', 'flexbox', 'Halaman materi 10. Flexbox Layout', 10, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('6e4ae916-eb4e-48b8-9c2a-9c678e5577ca', '8994c7fe-cca2-4404-a6b3-1626955d6a39', 'edea2bd8-9da8-4602-95ab-5e5b9473f793', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('82c6ea64-f9ff-4789-abf6-d22a27ac21e4', '74c40bbd-9690-4ac3-91af-9473ba011963', '11. Grid Layout', 'css-grid', 'Halaman materi 11. Grid Layout', 11, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('7c962529-82b1-44f0-ac4d-f3168c8be391', '82c6ea64-f9ff-4789-abf6-d22a27ac21e4', '8994c7fe-cca2-4404-a6b3-1626955d6a39', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('79c66579-f4e5-4a23-a86f-545d2c4b79d2', '74c40bbd-9690-4ac3-91af-9473ba011963', '12. Posisi & Z-Index', 'koordinat-zindex', 'Halaman materi 12. Posisi & Z-Index', 12, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('12319c13-6fd4-4cb4-8759-a16e85e5d34f', '79c66579-f4e5-4a23-a86f-545d2c4b79d2', '82c6ea64-f9ff-4789-abf6-d22a27ac21e4', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('a7293419-fad2-4286-9f98-374b9b480595', '74c40bbd-9690-4ac3-91af-9473ba011963', '13. Pseudo-elements', 'pseudo-elements', 'Halaman materi 13. Pseudo-elements', 13, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('a551c394-5b19-4d61-8cf1-c606628645ba', 'a7293419-fad2-4286-9f98-374b9b480595', '79c66579-f4e5-4a23-a86f-545d2c4b79d2', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('55aa8034-02f9-4e24-a696-ca3f0746ac32', '74c40bbd-9690-4ac3-91af-9473ba011963', '14. Pseudo-classes', 'pseudo-classes', 'Halaman materi 14. Pseudo-classes', 14, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('8eaf13c1-e838-4688-a62a-7c80de5edca4', '55aa8034-02f9-4e24-a696-ca3f0746ac32', 'a7293419-fad2-4286-9f98-374b9b480595', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('e4138171-bd01-4f68-bc71-3e2de69ec30c', '74c40bbd-9690-4ac3-91af-9473ba011963', '15. Responsive Design', 'responsive-design', 'Halaman materi 15. Responsive Design', 15, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('d50e31e0-308c-4158-9536-66b43bafc8c0', 'e4138171-bd01-4f68-bc71-3e2de69ec30c', '55aa8034-02f9-4e24-a696-ca3f0746ac32', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('7a342fa1-bd43-4fca-bce2-958ca5895c0f', '74c40bbd-9690-4ac3-91af-9473ba011963', 'Project 2: Portfolio CSS', 'project-2-css', 'Halaman materi Project 2: Portfolio CSS', 16, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('2e83c4dd-5a7d-4f2f-8d35-adb591a2ba72', '7a342fa1-bd43-4fca-bce2-958ca5895c0f', 'e4138171-bd01-4f68-bc71-3e2de69ec30c', 70.0, NOW(), NOW());

-- ==========================================
-- Kategori: Bootstrap Framework
-- ==========================================
INSERT INTO "materialCategory" ("id", "name", "slug", "description", "orderIndex", "isActive", "createdAt", "updatedAt") 
VALUES ('4c4949a1-5d47-4d8e-8111-36b3028b6e11', 'Bootstrap Framework', 'bootstrap', 'Materi pembelajaran Bootstrap Framework', 3, true, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('e12ffffe-c1b6-47e2-abba-a4f469d40ed7', '4c4949a1-5d47-4d8e-8111-36b3028b6e11', '1. Pengenalan Bootstrap', 'pengenalan-bootstrap', 'Halaman materi 1. Pengenalan Bootstrap', 1, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('da9857b1-4450-4106-a16c-d029ff0f22d3', 'e12ffffe-c1b6-47e2-abba-a4f469d40ed7', NULL, 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('c2d1abad-190d-4f19-9771-b7c21ba9828b', '4c4949a1-5d47-4d8e-8111-36b3028b6e11', '2. Cara Pemasangan', 'pemasangan-bootstrap', 'Halaman materi 2. Cara Pemasangan', 2, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('3701a57b-674f-4864-9dea-e27df1e212c4', 'c2d1abad-190d-4f19-9771-b7c21ba9828b', 'e12ffffe-c1b6-47e2-abba-a4f469d40ed7', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('7416cf6d-7eff-4403-816d-3be9d5860422', '4c4949a1-5d47-4d8e-8111-36b3028b6e11', '3. Sistem Grid 12 Kolom', 'grid-bootstrap', 'Halaman materi 3. Sistem Grid 12 Kolom', 3, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('989a9290-e979-4724-a5d1-df181bbaa084', '7416cf6d-7eff-4403-816d-3be9d5860422', 'c2d1abad-190d-4f19-9771-b7c21ba9828b', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('59e63f88-f532-46b0-91f0-7322bddc488d', '4c4949a1-5d47-4d8e-8111-36b3028b6e11', '4. Komponen Siap Pakai', 'komponen-bootstrap', 'Halaman materi 4. Komponen Siap Pakai', 4, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('ae35dc7d-f501-4ed2-938b-615c2c153ffa', '59e63f88-f532-46b0-91f0-7322bddc488d', '7416cf6d-7eff-4403-816d-3be9d5860422', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('a123d045-5d94-4d7f-9562-762b7f4b9d48', '4c4949a1-5d47-4d8e-8111-36b3028b6e11', '5. Kelas Utilitas', 'utilitas-bootstrap', 'Halaman materi 5. Kelas Utilitas', 5, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('40f061a5-a93b-4712-abbb-09c7ec5f35f5', 'a123d045-5d94-4d7f-9562-762b7f4b9d48', '59e63f88-f532-46b0-91f0-7322bddc488d', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('221fdab1-6ed5-4e22-b8a6-dd466198bd25', '4c4949a1-5d47-4d8e-8111-36b3028b6e11', '6. Project: Buku Tamu', 'project-bootstrap', 'Halaman materi 6. Project: Buku Tamu', 6, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('5c9e3416-d9ef-4210-8212-8bd966d7cde3', '221fdab1-6ed5-4e22-b8a6-dd466198bd25', 'a123d045-5d94-4d7f-9562-762b7f4b9d48', 70.0, NOW(), NOW());

-- ==========================================
-- Kategori: JavaScript Dasar
-- ==========================================
INSERT INTO "materialCategory" ("id", "name", "slug", "description", "orderIndex", "isActive", "createdAt", "updatedAt") 
VALUES ('ee9deda5-c090-4ef8-b64d-71665750f8c5', 'JavaScript Dasar', 'js', 'Materi pembelajaran JavaScript Dasar', 4, true, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('92165a54-0c99-46d0-9fa9-18ea4c7ffc82', 'ee9deda5-c090-4ef8-b64d-71665750f8c5', '1. Pengantar & Interaksi', 'pengantar-js', 'Halaman materi 1. Pengantar & Interaksi', 1, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('069dade4-cfa7-4237-b704-3820ec6a62a6', '92165a54-0c99-46d0-9fa9-18ea4c7ffc82', NULL, 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('6cbfed26-1187-4d19-b02d-d96aa55be386', 'ee9deda5-c090-4ef8-b64d-71665750f8c5', '2. DOM & Function', 'dom-function', 'Halaman materi 2. DOM & Function', 2, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('ffa496d4-8912-4dfa-8612-0d1e8eaeefe0', '6cbfed26-1187-4d19-b02d-d96aa55be386', '92165a54-0c99-46d0-9fa9-18ea4c7ffc82', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('b11af6b3-54b3-47c3-abac-d27c120caf38', 'ee9deda5-c090-4ef8-b64d-71665750f8c5', '3. Logika (Conditionals)', 'logika-keputusan', 'Halaman materi 3. Logika (Conditionals)', 3, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('7d6cf42f-bcd4-450e-ac29-73a526f45c32', 'b11af6b3-54b3-47c3-abac-d27c120caf38', '6cbfed26-1187-4d19-b02d-d96aa55be386', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('dcb79c10-0582-47ef-a80f-29f2a4086c67', 'ee9deda5-c090-4ef8-b64d-71665750f8c5', '4. Array & Perulangan', 'array-perulangan', 'Halaman materi 4. Array & Perulangan', 4, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('4dda8e68-ad06-4306-bc5f-b3b036784a23', 'dcb79c10-0582-47ef-a80f-29f2a4086c67', 'b11af6b3-54b3-47c3-abac-d27c120caf38', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('2c0f1b0e-2b65-4949-a681-9cd533d43c10', 'ee9deda5-c090-4ef8-b64d-71665750f8c5', '5. CRUD & Local Storage', 'crud-localstorage', 'Halaman materi 5. CRUD & Local Storage', 5, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('d84b080a-a91e-4ce8-a319-3bc9e6568ef4', '2c0f1b0e-2b65-4949-a681-9cd533d43c10', 'dcb79c10-0582-47ef-a80f-29f2a4086c67', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('be37e1b7-62e3-4716-99c1-28d7cd7f3ed9', 'ee9deda5-c090-4ef8-b64d-71665750f8c5', 'Project 3: Aplikasi Laundry', 'project-3-js', 'Halaman materi Project 3: Aplikasi Laundry', 6, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('95cf2472-9e32-4d66-b7b1-b9624594fec7', 'be37e1b7-62e3-4716-99c1-28d7cd7f3ed9', '2c0f1b0e-2b65-4949-a681-9cd533d43c10', 70.0, NOW(), NOW());

-- ==========================================
-- Kategori: Arsitektur Web
-- ==========================================
INSERT INTO "materialCategory" ("id", "name", "slug", "description", "orderIndex", "isActive", "createdAt", "updatedAt") 
VALUES ('eeea0cce-77fe-4580-a6d7-5d4375b5d01e', 'Arsitektur Web', 'arsitektur-web', 'Materi pembelajaran Arsitektur Web', 5, true, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('72e15b5e-64ae-4e29-a270-c2dd63e5aa32', 'eeea0cce-77fe-4580-a6d7-5d4375b5d01e', '1. Frontend vs Backend', 'arsitektur-aplikasi-web-frontend-vs-backend', 'Halaman materi 1. Frontend vs Backend', 1, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('e648a940-f8ca-4085-803a-82aac9fd2a63', '72e15b5e-64ae-4e29-a270-c2dd63e5aa32', NULL, 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('b1d55438-91fe-47b6-8953-508fa3f20780', 'eeea0cce-77fe-4580-a6d7-5d4375b5d01e', '2. Request & Response', 'siklus-request-response', 'Halaman materi 2. Request & Response', 2, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('60f77065-56a1-48e3-9be5-f9322d7f0bec', 'b1d55438-91fe-47b6-8953-508fa3f20780', '72e15b5e-64ae-4e29-a270-c2dd63e5aa32', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('0026ae97-410e-4a99-bdf9-dc89d276d211', 'eeea0cce-77fe-4580-a6d7-5d4375b5d01e', '3. Web Statis vs Dinamis', 'web-statis-vs-web-dinamis', 'Halaman materi 3. Web Statis vs Dinamis', 3, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('5158cfe4-9641-4768-85e2-83abc18a4a83', '0026ae97-410e-4a99-bdf9-dc89d276d211', 'b1d55438-91fe-47b6-8953-508fa3f20780', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('29df8c95-c74d-42fb-85f7-9e2e739e7229', 'eeea0cce-77fe-4580-a6d7-5d4375b5d01e', '4. Anatomi URL', 'anatomi-url-alamat-web', 'Halaman materi 4. Anatomi URL', 4, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('7e23c8fa-549a-4b8f-8a56-e58eac020c20', '29df8c95-c74d-42fb-85f7-9e2e739e7229', '0026ae97-410e-4a99-bdf9-dc89d276d211', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('374a12a4-2766-46ba-8816-061ff53794e7', 'eeea0cce-77fe-4580-a6d7-5d4375b5d01e', '5. Web Server & Apache', 'mengenal-web-server-apache', 'Halaman materi 5. Web Server & Apache', 5, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('00ab116c-3f42-4741-bd2a-02bd76737f81', '374a12a4-2766-46ba-8816-061ff53794e7', '29df8c95-c74d-42fb-85f7-9e2e739e7229', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('1ab0f0fb-532d-407d-8f17-4a5295453b5f', 'eeea0cce-77fe-4580-a6d7-5d4375b5d01e', '6. Metode HTTP', 'metode-komunikasi-http-kata-kerja-web', 'Halaman materi 6. Metode HTTP', 6, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('886f92a0-b45c-4011-b219-45682143c7ff', '1ab0f0fb-532d-407d-8f17-4a5295453b5f', '374a12a4-2766-46ba-8816-061ff53794e7', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('8fb5a61b-aed8-4ca9-b1f4-5f14a844a164', 'eeea0cce-77fe-4580-a6d7-5d4375b5d01e', '7. Port & Status HTTP', 'konsep-port-kode-status-http', 'Halaman materi 7. Port & Status HTTP', 7, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('1a139e57-9d2c-4db7-9c87-08b81cbb751e', '8fb5a61b-aed8-4ca9-b1f4-5f14a844a164', '1ab0f0fb-532d-407d-8f17-4a5295453b5f', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('e65acc1f-609b-42e5-91e4-2f71f1892543', 'eeea0cce-77fe-4580-a6d7-5d4375b5d01e', '8. Localhost & XAMPP', 'localhost-pengenalan-xampp', 'Halaman materi 8. Localhost & XAMPP', 8, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('e7de3c2c-9f0c-447a-9fb9-f50905cfb769', 'e65acc1f-609b-42e5-91e4-2f71f1892543', '8fb5a61b-aed8-4ca9-b1f4-5f14a844a164', 70.0, NOW(), NOW());

-- ==========================================
-- Kategori: Database SQL
-- ==========================================
INSERT INTO "materialCategory" ("id", "name", "slug", "description", "orderIndex", "isActive", "createdAt", "updatedAt") 
VALUES ('ffdb883f-a0b6-44d0-9b47-d5192e11905c', 'Database SQL', 'database', 'Materi pembelajaran Database SQL', 6, true, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('1ee19c2e-80ea-4315-b699-4a65879fd390', 'ffdb883f-a0b6-44d0-9b47-d5192e11905c', '1. Konsep Dasar', 'konsep-database', 'Halaman materi 1. Konsep Dasar', 1, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('2afa5d29-a750-4b6a-a5e5-d26eca843ae9', '1ee19c2e-80ea-4315-b699-4a65879fd390', NULL, 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('655cc476-4ae0-4bf7-a3fe-4c7fad153205', 'ffdb883f-a0b6-44d0-9b47-d5192e11905c', '2. Database Modern', 'teknis-database-modern', 'Halaman materi 2. Database Modern', 2, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('7a73d346-3ca5-4219-9fa5-d5267ff33e20', '655cc476-4ae0-4bf7-a3fe-4c7fad153205', '1ee19c2e-80ea-4315-b699-4a65879fd390', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('ceab8323-526b-4507-8489-965a94d8b67b', 'ffdb883f-a0b6-44d0-9b47-d5192e11905c', '3. Merancang ERD', 'erd-database', 'Halaman materi 3. Merancang ERD', 3, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('b3c438ea-2fde-433a-9604-bcbad2055e5e', 'ceab8323-526b-4507-8489-965a94d8b67b', '655cc476-4ae0-4bf7-a3fe-4c7fad153205', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('56104d5b-a90e-4e25-9eea-b0e7339031de', 'ffdb883f-a0b6-44d0-9b47-d5192e11905c', '4. Relasi Antar Tabel', 'relasi-tabel', 'Halaman materi 4. Relasi Antar Tabel', 4, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('49b8921a-00da-454a-8b98-0a8dd7598f71', '56104d5b-a90e-4e25-9eea-b0e7339031de', 'ceab8323-526b-4507-8489-965a94d8b67b', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('0a8dc9a5-edfc-4d2b-9bd4-f247d56fa99e', 'ffdb883f-a0b6-44d0-9b47-d5192e11905c', '5. Anatomi & Tipe Data', 'anatomi-tipe-data-tabel', 'Halaman materi 5. Anatomi & Tipe Data', 5, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('d105bb3a-1570-4d6e-84ad-5a0657140f7a', '0a8dc9a5-edfc-4d2b-9bd4-f247d56fa99e', '56104d5b-a90e-4e25-9eea-b0e7339031de', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('0a803f74-35a5-45b2-8070-2512055da27d', 'ffdb883f-a0b6-44d0-9b47-d5192e11905c', '6. SQL Dasar', 'sql-dasar-ddl-dml', 'Halaman materi 6. SQL Dasar', 6, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('ce68095a-63b6-42a6-8ac1-40387f8b0826', '0a803f74-35a5-45b2-8070-2512055da27d', '0a8dc9a5-edfc-4d2b-9bd4-f247d56fa99e', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('ffd09cf4-22b5-4c78-a974-17f002516a27', 'ffdb883f-a0b6-44d0-9b47-d5192e11905c', '7. Advanced Query', 'advanced-query-sql', 'Halaman materi 7. Advanced Query', 7, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('c1b354d3-f154-4862-9fb5-20e8f7bcf698', 'ffd09cf4-22b5-4c78-a974-17f002516a27', '0a803f74-35a5-45b2-8070-2512055da27d', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('5eb6d068-f1fa-45ed-a45e-ace60180bbc5', 'ffdb883f-a0b6-44d0-9b47-d5192e11905c', '8. JOIN & Agregasi', 'join-matematika-bisnis', 'Halaman materi 8. JOIN & Agregasi', 8, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('dfa4b9ee-b870-4122-b10d-f591cb8b2f0a', '5eb6d068-f1fa-45ed-a45e-ace60180bbc5', 'ffd09cf4-22b5-4c78-a974-17f002516a27', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('349afec5-d722-478b-8f18-d243bd2e12b2', 'ffdb883f-a0b6-44d0-9b47-d5192e11905c', '9. Project: Laundry DB', 'project-laundry-db', 'Halaman materi 9. Project: Laundry DB', 9, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('a569139a-7d46-4323-a0e5-9bdd8c7f67a1', '349afec5-d722-478b-8f18-d243bd2e12b2', '5eb6d068-f1fa-45ed-a45e-ace60180bbc5', 70.0, NOW(), NOW());

-- ==========================================
-- Kategori: PHP Dinamis
-- ==========================================
INSERT INTO "materialCategory" ("id", "name", "slug", "description", "orderIndex", "isActive", "createdAt", "updatedAt") 
VALUES ('21445d1b-3b13-4770-a2f1-58f5934e2d7c', 'PHP Dinamis', 'php', 'Materi pembelajaran PHP Dinamis', 7, true, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('2e8a5b19-0cfe-4093-bfe5-3af150a9302a', '21445d1b-3b13-4770-a2f1-58f5934e2d7c', '1. Pengantar PHP', 'pengantar-php', 'Halaman materi 1. Pengantar PHP', 1, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('bd92b4bf-8c73-4826-93a1-80ee21b9f749', '2e8a5b19-0cfe-4093-bfe5-3af150a9302a', NULL, 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('625e8a4e-22c9-4aa2-8263-6e7ba60d43db', '21445d1b-3b13-4770-a2f1-58f5934e2d7c', '2. Aturan Penulisan', 'aturan-pulau-php', 'Halaman materi 2. Aturan Penulisan', 2, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('998b608a-9ebd-478f-84b4-497b2a23c1e4', '625e8a4e-22c9-4aa2-8263-6e7ba60d43db', '2e8a5b19-0cfe-4093-bfe5-3af150a9302a', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('414d9f72-9aff-4075-baef-300d1329d095', '21445d1b-3b13-4770-a2f1-58f5934e2d7c', '3. Sintaks Dasar', 'sintaks-dasar-php', 'Halaman materi 3. Sintaks Dasar', 3, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('d63aa05b-637e-4f7b-90ad-699d70f2c0f0', '414d9f72-9aff-4075-baef-300d1329d095', '625e8a4e-22c9-4aa2-8263-6e7ba60d43db', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('a6ee325f-bfb8-4a8d-8480-df563e864f67', '21445d1b-3b13-4770-a2f1-58f5934e2d7c', '4. Error Layar Putih', 'error-php-layar-putih', 'Halaman materi 4. Error Layar Putih', 4, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('b7863902-5712-4f56-acd0-956f967cf45b', 'a6ee325f-bfb8-4a8d-8480-df563e864f67', '414d9f72-9aff-4075-baef-300d1329d095', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('e44b032a-d1fb-49ef-b3f9-3813d37c7646', '21445d1b-3b13-4770-a2f1-58f5934e2d7c', '5. Teknik Debugging', 'debugging-php', 'Halaman materi 5. Teknik Debugging', 5, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('079d26a1-d67d-4418-adde-2a87eb1b6205', 'e44b032a-d1fb-49ef-b3f9-3813d37c7646', 'a6ee325f-bfb8-4a8d-8480-df563e864f67', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('4b10cb49-4cda-4fbf-8427-879f78967c04', '21445d1b-3b13-4770-a2f1-58f5934e2d7c', '6. Hard Refresh', 'hard-refresh-browser', 'Halaman materi 6. Hard Refresh', 6, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('a75ab092-d93d-4c2b-bce2-a958eb0cefd7', '4b10cb49-4cda-4fbf-8427-879f78967c04', 'e44b032a-d1fb-49ef-b3f9-3813d37c7646', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('2d305ef5-b5a9-4435-956e-76cb812d55d4', '21445d1b-3b13-4770-a2f1-58f5934e2d7c', '7. GET vs POST', 'get-vs-post-php', 'Halaman materi 7. GET vs POST', 7, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('35738c92-572e-4728-b15a-56318eea42be', '2d305ef5-b5a9-4435-956e-76cb812d55d4', '4b10cb49-4cda-4fbf-8427-879f78967c04', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('71000498-ceb2-4813-8e96-0c5c5beba4ff', '21445d1b-3b13-4770-a2f1-58f5934e2d7c', '8. Undefined Array Key', 'undefined-array-key', 'Halaman materi 8. Undefined Array Key', 8, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('4ed74822-0d56-4528-a6be-1026ce82fd4d', '71000498-ceb2-4813-8e96-0c5c5beba4ff', '2d305ef5-b5a9-4435-956e-76cb812d55d4', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('4c81869b-e196-4b5f-ab22-7856125a38b0', '21445d1b-3b13-4770-a2f1-58f5934e2d7c', '9. Koneksi MySQL', 'koneksi-mysql-php', 'Halaman materi 9. Koneksi MySQL', 9, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('e526a090-968c-4973-a404-3fe89104edc7', '4c81869b-e196-4b5f-ab22-7856125a38b0', '71000498-ceb2-4813-8e96-0c5c5beba4ff', 70.0, NOW(), NOW());

INSERT INTO "page" ("id", "categoryId", "title", "slug", "description", "orderIndex", "isPublished", "createdAt", "updatedAt") 
VALUES ('8ce7b097-9bce-4926-b255-40d601a36f8e', '21445d1b-3b13-4770-a2f1-58f5934e2d7c', '10. Project: Kasir Simple', 'project-crud-kasir', 'Halaman materi 10. Project: Kasir Simple', 10, true, NOW(), NOW());
INSERT INTO "pageSequence" ("id", "pageId", "prerequisitePageId", "minQuizScore", "createdAt", "updatedAt") 
VALUES ('c4908fe7-9028-4356-aed7-1338bc4878d4', '8ce7b097-9bce-4926-b255-40d601a36f8e', '4c81869b-e196-4b5f-ab22-7856125a38b0', 70.0, NOW(), NOW());

