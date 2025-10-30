# Pregled funkcionalnosti - Športni IS

## Implementirane uporabniške zgodbe

### ✅ US-01: Ustvarjanje uporabnikov (Administrator)
**Prioriteta:** Must Have

**Opis:** Administrator lahko ustvarja uporabnike (trenerje in igralce) v sistemu.

**Implementacija:**
- Stran: `/admin/users/new`
- API: `POST /api/admin/users`
- Polja: ime, e-pošta, geslo, vloga
- Vloge: admin, coach, player

**Postopek:**
1. Administrator se prijavi
2. Navigira na "Uporabniki"
3. Klikne "Dodaj uporabnika"
4. Izpolni obrazec (ime, email, geslo, vloga)
5. Shrani

---

### ✅ US-02: Prijava v sistem (Uporabnik)
**Prioriteta:** Must Have

**Opis:** Uporabnik se lahko prijavi v sistem z e-pošto in geslom.

**Implementacija:**
- Stran: `/auth/login`
- Uporablja Supabase Auth
- Po prijavi preusmeri glede na vlogo

**Postopek:**
1. Uporabnik obišče [http://localhost:3000](http://localhost:3000)
2. Klikne "Prijava"
3. Vnese e-pošto in geslo
4. Sistem ga preusmeri na primerno stran:
   - Admin → `/admin/users`
   - Trener → `/trainings/coach`
   - Igralec → `/trainings`

---

### ✅ US-03: Ustvarjanje treninga (Trener)
**Prioriteta:** Must Have

**Opis:** Trener lahko ustvari nov trening z datumom, uro, lokacijo in opisom.

**Implementacija:**
- Stran: `/trainings/coach/new`
- API: `POST /api/trainings`
- Polja: naslov, opis, lokacija, datum, čas

**Postopek:**
1. Trener se prijavi
2. Navigira na "Moji treningi"
3. Klikne "Nov trening"
4. Izpolni obrazec:
   - Naslov (obvezno)
   - Opis (opcijsko)
   - Lokacija (obvezno)
   - Datum (obvezno)
   - Čas (obvezno)
5. Shrani

---

### ✅ US-04: Urejanje in brisanje treninga (Trener)
**Prioriteta:** Must Have

**Opis:** Trener lahko uredi ali izbriše svoje treninge.

**Implementacija:**
- Urejanje:
  - Stran: `/trainings/coach/[id]/edit`
  - API: `PUT /api/trainings/[id]`
- Brisanje:
  - API: `DELETE /api/trainings/[id]`

**Postopek za urejanje:**
1. Trener gre na "Moji treningi"
2. Pri treningu klikne "Uredi"
3. Spremeni podatke
4. Shrani

**Postopek za brisanje:**
1. Trener gre na "Moji treningi"
2. Pri treningu klikne "Izbriši"
3. Potrdi brisanje
4. Trening je izbrisan

**Omejitve:**
- Trener lahko ureja/briše samo svoje treninge
- Brisanje treninga izbriše tudi vse prijave

---

### ✅ US-05: Pregled treningov (Igralec)
**Prioriteta:** Must Have

**Opis:** Igralec lahko vidi seznam prihodnjih treningov v obliki tabele ali kartice.

**Implementacija:**
- Stran: `/trainings`
- API: `GET /api/trainings?upcoming=true`
- Prikaz: Grid kartice s podrobnostmi

**Podatki na kartici:**
- Naslov treninga
- Ime trenerja
- Datum in čas
- Lokacija
- Opis
- Status prijave

**Filter:**
- Prikazani so samo prihodnji treningi (training_date >= danes)

---

### ✅ US-06: Prijava na trening (Igralec)
**Prioriteta:** Must Have

**Opis:** Igralec se lahko prijavi na trening s klikom na gumb "Prijavi se".

**Implementacija:**
- Gumb na kartici treninga
- API: `POST /api/trainings/[id]/registrations`
- Preprečuje dvojno prijavo

**Postopek:**
1. Igralec gre na "Treningi"
2. Najde želeni trening
3. Klikne "Prijavi se"
4. Sistem potrdi prijavo
5. Gumb se spremeni v "Odjavi se"

**Omejitve:**
- Uporabnik se lahko prijavi samo enkrat na isti trening
- Prijava na pretekle treninge ni mogoča

**Dodatno:**
- Igralec lahko vidi vse svoje prijave na `/trainings/my-registrations`
- Igralec se lahko odjavi s treninga

---

### ✅ US-07: Pregled prijavljenih igralcev (Trener)
**Prioriteta:** Must Have

**Opis:** Trener lahko vidi, kateri igralci so prijavljeni na njegov trening.

**Implementacija:**
- Stran: `/trainings/coach/[id]/registrations`
- API: `GET /api/trainings/[id]/registrations`
- Prikaz: Seznam igralcev z imenom in emailom

**Postopek:**
1. Trener gre na "Moji treningi"
2. Pri treningu klikne "Prijavljeni igralci"
3. Vidi seznam:
   - Ime in priimek igralca
   - Email
   - Datum prijave
   - Število prijavljenih

**Podatki:**
- Število prijavljenih igralcev
- Seznam s polnimi podatki
- Datum in čas prijave

---

## Dodatne funkcionalnosti

### Navigacija glede na vlogo

**Administrator vidi:**
- Treningi (vsi treningi)
- Uporabniki (upravljanje)
- Moji treningi (lahko tudi ustvarja treninge)

**Trener vidi:**
- Treningi (vsi treningi)
- Moji treningi (upravljanje lastnih)
- Moje prijave (prijave na treninge drugih)

**Igralec vidi:**
- Treningi (vsi prihodnji treningi)
- Moje prijave (pregled lastnih prijav)

### Dashboard

- Avtomatsko preusmerjanje glede na vlogo
- Admin → `/admin/users`
- Trener → `/trainings/coach`
- Igralec → `/trainings`

### Varnost

- Row Level Security (RLS) politike:
  - Vsi lahko berejo profile
  - Uporabniki lahko posodabljajo samo svoj profil
  - Vsi lahko berejo treninge
  - Samo trenerji/admini lahko ustvarjajo treninge
  - Trenerji lahko urejajo/brišejo samo svoje treninge
  - Igralci lahko ustvarjajo/brišejo svoje prijave

### UI/UX

- Responziven dizajn (mobilno, tablet, desktop)
- Svetla/temna tema
- Slovenske oznake in jezik
- Vizualne indikacije za pretekle treninge
- Potrditev pred brisanjem
- Uspešna obvestila po akcijah

## API Endpoints

### Uporabniki
- `GET /api/profile` - Pridobi profil trenutnega uporabnika
- `GET /api/admin/users` - Pridobi vse uporabnike (admin)
- `POST /api/admin/users` - Ustvari uporabnika (admin)
- `PUT /api/admin/users/[id]` - Posodobi uporabnika (admin)
- `DELETE /api/admin/users/[id]` - Izbriši uporabnika (admin)

### Treningi
- `GET /api/trainings` - Pridobi vse treninge
- `GET /api/trainings?upcoming=true` - Pridobi samo prihodnje treninge
- `POST /api/trainings` - Ustvari trening (coach/admin)
- `GET /api/trainings/[id]` - Pridobi trening
- `PUT /api/trainings/[id]` - Posodobi trening (lastnik)
- `DELETE /api/trainings/[id]` - Izbriši trening (lastnik)

### Prijave
- `GET /api/trainings/[id]/registrations` - Pridobi prijave za trening
- `POST /api/trainings/[id]/registrations` - Prijavi se na trening
- `DELETE /api/trainings/[id]/registrations` - Odjavi se s treninga

## Testni primeri

### Test 1: Admin ustvari uporabnika
1. Prijavi se kot admin
2. Klikni "Uporabniki" → "Dodaj uporabnika"
3. Vnesi:
   - Ime: "Janez Novak"
   - Email: "janez.novak@example.com"
   - Geslo: "TestPass123"
   - Vloga: "Trener"
4. Klikni "Ustvari uporabnika"
5. ✅ Uporabnik se prikaže na seznamu

### Test 2: Trener ustvari trening
1. Prijavi se kot trener
2. Klikni "Moji treningi" → "Nov trening"
3. Vnesi:
   - Naslov: "Nogometni trening"
   - Opis: "Taktični trening"
   - Lokacija: "Stadion Ljubljana"
   - Datum: Jutri
   - Čas: 18:00
4. Klikni "Ustvari trening"
5. ✅ Trening se prikaže na seznamu

### Test 3: Igralec se prijavi na trening
1. Prijavi se kot igralec
2. Klikni "Treningi"
3. Najdi trening
4. Klikni "Prijavi se"
5. ✅ Gumb se spremeni v "Odjavi se"
6. Pojdi na "Moje prijave"
7. ✅ Trening je prikazan

### Test 4: Trener vidi prijavljene igralce
1. Prijavi se kot trener
2. Klikni "Moji treningi"
3. Pri treningu klikni "Prijavljeni igralci"
4. ✅ Vidi seznam prijavljenih igralcev
5. ✅ Šteje se ujema s številom prijav

### Test 5: Trener uredi trening
1. Prijavi se kot trener
2. Klikni "Moji treningi"
3. Pri treningu klikni "Uredi"
4. Spremeni lokacijo
5. Klikni "Posodobi trening"
6. ✅ Spremembe so shranjene

### Test 6: Trener izbriše trening
1. Prijavi se kot trener
2. Klikni "Moji treningi"
3. Pri treningu klikni "Izbriši"
4. Potrdi brisanje
5. ✅ Trening je odstranjen iz seznama

## Znane omejitve (po zahtevi)

- **RBAC:** Osnovna avtorizacija brez kompleksnega RBAC sistema
- **Email obvestila:** Niso implementirana
- **Push obvestila:** Niso implementirana
- **Mobilna aplikacija:** Samo responsiven web
- **Koledarski pogled:** Samo seznam/grid
- **Statistika:** Osnovna evidenca brez podrobne statistike

## Naslednji koraki (prihodnje verzije)

1. **Should Have:**
   - Email obvestila ob ustvarjanju treninga
   - Pregled zgodovine treningov
   - Filtriranje treningov po datumu/lokaciji

2. **Could Have:**
   - Koledarski pogled treningov
   - Export podatkov (CSV, PDF)
   - Statistika prisotnosti
   - Komentarji na treninge
   - Prilaganje dokumentov (načrti treningov)

3. **Izboljšave:**
   - Testna pokritost (unit, integration testi)
   - Optimizacija podatkovnih klicev
   - Caching strategija
   - Napredna validacija
   - Audit trail (zgodovina sprememb)

