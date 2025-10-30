# Navodila za namestitev - Športni informacijski sistem

Ta dokument opisuje postopek namestitve in zagona sistema za upravljanje športnih treningov.

## Predpogoji

- Node.js 18+ nameščen
- Supabase račun (brezplačno na [supabase.com](https://supabase.com))
- Git

## 1. Nastavitev baze podatkov

### Ustvarite nov Supabase projekt

1. Pojdite na [supabase.com](https://supabase.com) in se prijavite
2. Kliknite "New Project"
3. Izpolnite podatke projekta (ime, geslo baze podatkov, regija)
4. Počakajte, da se projekt ustvari (približno 2 minuti)

### Nastavite bazo podatkov

1. V Supabase Dashboard pojdite na "SQL Editor"
2. Kopirajte in izvedite SQL ukaze iz datoteke `DATABASE_SCHEMA.md`
3. Preverite, da so bile ustvarjene vse tabele:
   - `profiles`
   - `trainings`
   - `training_registrations`

### Omogočite admin API

1. V Supabase Dashboard pojdite na "Settings" > "API"
2. Kopirajte:
   - **Project URL** (začne se z https://...)
   - **anon/public key** (dolg niz znakov)
   - **service_role key** (skriven ključ - uporabite ga previdno!)

## 2. Nastavitev projekta

### Klonirajte repozitorij

```bash
cd /path/to/your/workspace
git clone [your-repo-url]
cd rirs/app
```

### Namestite odvisnosti

```bash
npm install
```

### Nastavite okoljske spremenljivke

Ustvarite datoteko `.env.local` v korenski mapi projekta (`app/` folder):

```bash
# URL vašega Supabase projekta
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Javni ključ (anon key)
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here

# Service role ključ (za admin operacije)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**OPOMBA:** Service role ključ omogoča polni dostop do vaše baze podatkov. NIKOLI ga ne objavljajte javno ali commitajte v Git!

### Posodobite Supabase client za admin operacije

Odprite datoteko `lib/supabase/server.ts` in dodajte funkcijo za admin operacije:

```typescript
export async function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
    },
  );
}
```

Nato posodobite API route za ustvarjanje uporabnikov (`app/api/admin/users/route.ts`), da uporablja `createAdminClient()` namesto `createClient()` za admin.createUser operacijo.

## 3. Zagon aplikacije

### Razvojni način

```bash
npm run dev
```

Aplikacija bo dostopna na [http://localhost:3000](http://localhost:3000)

### Produkcijski build

```bash
npm run build
npm start
```

## 4. Ustvarite prvega administratorja

Ko postavite sistem, morate ročno ustvariti prvega administratorja:

1. V Supabase Dashboard pojdite na "Authentication" > "Users"
2. Kliknite "Add user" > "Create new user"
3. Vnesite email in geslo
4. Po ustvarjanju uporabnika pojdite na "Table Editor" > "profiles"
5. Poiščite novega uporabnika (po ID-ju iz auth.users)
6. Dodajte nov vnos:
   - `id`: ID uporabnika iz auth.users
   - `email`: email uporabnika
   - `full_name`: polno ime
   - `role`: 'admin'

Alternativno lahko v "SQL Editor" izvedete:

```sql
-- Pridobite user ID iz auth.users tabele
SELECT id, email FROM auth.users;

-- Vstavite profil (zamenjajte USER_ID in EMAIL)
INSERT INTO profiles (id, email, full_name, role)
VALUES ('USER_ID', 'EMAIL', 'Admin User', 'admin');
```

## 5. Testiranje sistema

### Prijavite se kot administrator

1. Pojdite na [http://localhost:3000](http://localhost:3000)
2. Kliknite "Prijava"
3. Vnesite email in geslo administratorja
4. Preusmerjeni boste na "/admin/users"

### Ustvarite testne uporabnike

1. V admin vmesniku kliknite "Dodaj uporabnika"
2. Ustvarite:
   - Vsaj enega trenerja (role: 'coach')
   - Vsaj enega igralca (role: 'player')

### Testirajte funkcionalnosti

**Kot trener:**
1. Prijavite se z računom trenerja
2. Pojdite na "Moji treningi"
3. Ustvarite nov trening
4. Uredite trening
5. Preverite prijavljene igralce

**Kot igralec:**
1. Prijavite se z računom igralca
2. Pojdite na "Treningi"
3. Prijavite se na trening
4. Pojdite na "Moje prijave" in preverite svoje prijave

## 6. Navodila za uporabo

### Administrator
- **Uporabniki**: Upravljanje vseh uporabnikov sistema
  - Dodajanje novih uporabnikov (trenerji, igralci, admini)
  - Urejanje uporabniških podatkov
  - Brisanje uporabnikov

### Trener
- **Treningi**: Seznam vseh prihodnjih treningov
- **Moji treningi**: Upravljanje lastnih treningov
  - Ustvarjanje novega treninga
  - Urejanje treninga
  - Brisanje treninga
  - Pregled prijavljenih igralcev

### Igralec
- **Treningi**: Seznam vseh prihodnjih treningov
  - Prijava na trening
  - Odjava s treninga
- **Moje prijave**: Seznam treningov, na katere ste prijavljeni

## Struktura projekta

```
app/
├── (authenticated)/          # Strani z avtentikacijo
│   ├── admin/               # Admin strani
│   │   └── users/           # Upravljanje uporabnikov
│   ├── dashboard/           # Dashboard (redirect glede na vlogo)
│   └── trainings/           # Strani za treninge
│       ├── coach/           # Trenerjev vmesnik
│       └── my-registrations/ # Igralčeve prijave
├── api/                     # API routes
│   ├── admin/               # Admin API
│   ├── profile/             # Uporabniški profil
│   └── trainings/           # Treningi API
├── auth/                    # Avtentikacijske strani
├── components/              # React komponente
│   ├── admin/               # Admin komponente
│   ├── trainings/           # Training komponente
│   └── ui/                  # UI komponente
└── lib/                     # Utility funkcije
    ├── database.types.ts    # TypeScript tipi
    └── supabase/            # Supabase konfiguracija
```

## Pomoč in podpora

Če naletite na težave:

1. Preverite `.env.local` datoteko
2. Preverite Supabase console za napake v bazi podatkov
3. Preverite Row Level Security (RLS) politike
4. Preverite browser console za napake

## Varnost

- **NIKOLI** ne objavljajte `SUPABASE_SERVICE_ROLE_KEY` javno
- Poskrbite, da so RLS politike pravilno nastavljene
- Uporabite močna gesla za vse uporabnike
- Redno pregledujte uporabniške račune in aktivnosti

