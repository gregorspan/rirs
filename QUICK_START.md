# Hitra navodila za zagon

## 1. Predpogoji
```bash
# Preverite Node.js verzijo (potrebna 18+)
node --version

# Če še nimate Node.js, prenesite z nodejs.org
```

## 2. Supabase (5 minut)

### Ustvarite projekt
1. Pojdite na [supabase.com](https://supabase.com)
2. Sign up / Log in
3. "New Project"
4. Izberite ime in geslo

### Nastavite bazo
1. V projektu pojdite na "SQL Editor"
2. Odprite `DATABASE_SCHEMA.md` v repozitoriju
3. Kopirajte in zaženite vse SQL ukaze
4. Preverite, da so tabele ustvarjene (Table Editor)

### Kopirajte ključe
1. Settings → API
2. Kopirajte:
   - Project URL
   - anon/public key
   - service_role key (kliknite "Reveal")

## 3. Lokalna namestitev (2 minuti)

```bash
# Klonirajte in odprte projekt
cd /path/to/your/workspace
cd rirs/app

# Namestite pakete
npm install

# Ustvarite .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
EOF

# Uredite .env.local in vstavite svoje ključe
nano .env.local  # ali uporabite svoj editor

# Zaženite razvojni server
npm run dev
```

Odprite [http://localhost:3000](http://localhost:3000)

## 4. Prvi admin uporabnik (1 minuta)

### Opcija A: Preko Supabase UI
1. V Supabase: Authentication → Users → Add user
2. Email: `admin@example.com`, Password: `Admin123`
3. Table Editor → profiles → Insert row:
   - id: [user ID iz koraka 1]
   - email: `admin@example.com`
   - full_name: `Admin User`
   - role: `admin`

### Opcija B: Preko SQL
```sql
-- V Supabase SQL Editor
INSERT INTO auth.users (email, encrypted_password)
VALUES ('admin@example.com', crypt('Admin123', gen_salt('bf')));

INSERT INTO profiles (id, email, full_name, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@example.com'),
  'admin@example.com',
  'Admin User',
  'admin'
);
```

## 5. Testiranje (5 minut)

### Prijavite se kot admin
1. [http://localhost:3000](http://localhost:3000) → "Prijava"
2. Email: `admin@example.com`, Password: `Admin123`
3. ✅ Preusmerjeni ste na `/admin/users`

### Ustvarite trenerja
1. "Dodaj uporabnika"
2. Ime: `Janez Trener`, Email: `trener@example.com`, Geslo: `Trener123`, Vloga: `Trener`
3. "Ustvari uporabnika"

### Ustvarite igralca
1. "Dodaj uporabnika"
2. Ime: `Marko Igralec`, Email: `igralec@example.com`, Geslo: `Igralec123`, Vloga: `Igralec`
3. "Ustvari uporabnika"

### Odjavite se in prijavite kot trener
1. Kliknite na logout
2. Prijavite se z `trener@example.com` / `Trener123`
3. ✅ Vidite "Moji treningi"

### Ustvarite trening
1. "Nov trening"
2. Izpolnite obrazec:
   - Naslov: "Nogometni trening"
   - Lokacija: "Stadion"
   - Datum: Jutri
   - Čas: 18:00
3. "Ustvari trening"
4. ✅ Trening je ustvarjen

### Preizkusite kot igralec
1. Odjavite se
2. Prijavite se z `igralec@example.com` / `Igralec123`
3. "Treningi" → Vidite trening
4. Kliknite "Prijavi se"
5. ✅ Prijavljeni ste
6. "Moje prijave" → Vidite svoj trening

### Preverite prijave kot trener
1. Odjavite se
2. Prijavite se kot trener
3. "Moji treningi" → "Prijavljeni igralci"
4. ✅ Vidite igralca Marko

## Pogosta vprašanja

### Napaka pri prijavi
- Preverite `.env.local` datoteko
- Preverite ali je profil v tabeli `profiles`
- Preverite Supabase console za napake

### Ne morem ustvariti uporabnika (admin)
- Preverite `SUPABASE_SERVICE_ROLE_KEY` v `.env.local`
- Preverite da ste admin (role = 'admin')

### Ne vidim treningov
- Preverite da so RLS politike nastavljene
- Preverite da je trening v prihodnosti
- Preverite browser console za napake

### Nimam dostopa do strani
- Preverite svojo vlogo v tabeli `profiles`
- Preverite da ste prijavljeni
- Preverite RLS politike

## Hitri ukazi

```bash
# Zagon
npm run dev

# Build
npm run build

# Produkcija
npm start

# Linting
npm run lint

# Ponovni zagon baze (POZOR: izbriše vse podatke!)
# V Supabase SQL Editor
DROP TABLE IF EXISTS training_registrations;
DROP TABLE IF EXISTS trainings;
DROP TABLE IF EXISTS profiles;
# Nato ponovno zaženite SQL iz DATABASE_SCHEMA.md
```

## Naslednji koraki

✅ Sistem deluje!

Sedaj lahko:
1. Dodajte več uporabnikov
2. Ustvarite več treningov
3. Testirajte vse funkcionalnosti
4. Prilagodite dizajn (Tailwind CSS)
5. Dodajte nove funkcionalnosti

Za več informacij:
- [FEATURES.md](FEATURES.md) - Podroben opis funkcionalnosti
- [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) - Popolna navodila
- [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) - Struktura baze
- [README.md](README.md) - Splošen pregled

---

**Potrebujete pomoč?**
- Preverite Supabase logs (Settings → Logs)
- Preverite browser console (F12)
- Preverite terminal za napake

