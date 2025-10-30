# Športni informacijski sistem

Spletni informacijski sistem za upravljanje športnih treningov, ki omogoča trenerjem in igralcem enostavno ustvarjanje treningov, prijavo na treninge, pregled urnikov in evidenco prisotnosti.

## Značilnosti

### Za administratorje
- ✅ Ustvarjanje in upravljanje uporabnikov (US-01)
- ✅ Dodeljevanje vlog (administrator, trener, igralec)
- ✅ Pregled vseh uporabnikov sistema

### Za trenerje
- ✅ Ustvarjanje novih treningov (US-03)
- ✅ Urejanje in brisanje lastnih treningov (US-04)
- ✅ Pregled prijavljenih igralcev na treninge (US-07)
- ✅ Upravljanje urnika treningov

### Za igralce
- ✅ Pregled vseh prihodnjih treningov (US-05)
- ✅ Prijava na treninge (US-06)
- ✅ Odjava s treningov
- ✅ Pregled lastnih prijav

### Splošno
- ✅ Prijava in avtentikacija uporabnikov (US-02)
- ✅ Responziven vmesnik
- ✅ Svetla/temna tema
- ✅ Slovenske oznake in jezik

## Tehnologije

- **Frontend:** Next.js 15, React 19, TypeScript
- **Backend:** Next.js API Routes, Supabase
- **Baza podatkov:** PostgreSQL (Supabase)
- **Avtentikacija:** Supabase Auth
- **Styling:** Tailwind CSS, Radix UI
- **Ikone:** Lucide React

## Struktura projekta

```
rirs/
├── app/                          # Next.js aplikacija
│   ├── (authenticated)/          # Avtenticirane strani
│   │   ├── admin/                # Admin funkcionalnosti
│   │   ├── dashboard/            # Dashboard (redirect na vlogo)
│   │   └── trainings/            # Treningi
│   ├── api/                      # API routes
│   │   ├── admin/                # Admin API
│   │   ├── profile/              # Profil API
│   │   └── trainings/            # Treningi API
│   ├── auth/                     # Avtentikacija
│   ├── components/               # React komponente
│   └── lib/                      # Utility funkcije
├── DATABASE_SCHEMA.md            # SQL shema za bazo
├── SETUP_INSTRUCTIONS.md         # Podrobna navodila
└── README.md                     # Ta dokument
```

## Hitri začetek

### 1. Klonirajte repozitorij

```bash
git clone [your-repo-url]
cd rirs/app
```

### 2. Namestite odvisnosti

```bash
npm install
```

### 3. Nastavite Supabase

1. Ustvarite račun na [supabase.com](https://supabase.com)
2. Ustvarite nov projekt
3. V SQL Editor izvedite ukaze iz `DATABASE_SCHEMA.md`
4. Kopirajte API ključe iz Settings > API

### 4. Nastavite okoljske spremenljivke

Kopirajte `.env.example` v `.env.local` in izpolnite vrednosti:

```bash
cp .env.example .env.local
```

Uredite `.env.local` in vnesite svoje Supabase ključe.

### 5. Zaženite razvojni strežnik

```bash
npm run dev
```

Odprite [http://localhost:3000](http://localhost:3000) v brskalniku.

### 6. Ustvarite prvega administratorja

Sledite navodilom v `SETUP_INSTRUCTIONS.md` za ustvarjanje prvega admin uporabnika.

## Podrobna navodila

Za popolna navodila za namestitev in konfiguracijo si oglejte [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md).

## Shema baze podatkov

Za podrobnosti o strukturi baze podatkov si oglejte [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md).

### Tabele

- **profiles** - Uporabniški profili in vloge
- **trainings** - Treningi (ustvarjeni s strani trenerjev)
- **training_registrations** - Prijave igralcev na treninge

## Uporabniške zgodbe (MoSCoW)

### Must Have ✅
- **US-01:** Administrator lahko ustvarja uporabnike
- **US-02:** Uporabniki se lahko prijavijo v sistem
- **US-03:** Trener lahko ustvari nov trening
- **US-04:** Trener lahko uredi ali izbriše trening
- **US-05:** Igralec lahko vidi seznam prihodnjih treningov
- **US-06:** Igralec se lahko prijavi na trening
- **US-07:** Trener lahko vidi prijavljene igralce

### Should Have
- Podpora za pretekle treninge
- Pregled zgodovine treningov
- Email obvestila

### Could Have
- Koledarski pogled
- Export podatkov
- Statistika prisotnosti
- Komentarji na treninge

### Won't Have (za to verzijo)
- RBAC (role-based access control) - uporablja se osnovna avtorizacija
- Mobilna aplikacija
- Push obvestila
- Video konference

## Varnost

- Row Level Security (RLS) politike na vseh tabelah
- Service role ključ uporabljen samo za admin operacije
- Avtentikacija obvezna za vse zaščitene strani
- Validacija vlog za vse operacije

## Produkcijska namestitev

### Vercel (priporočeno)

1. Povežite GitHub repozitorij z Vercel
2. Dodajte okoljske spremenljivke v Vercel dashboard
3. Deploy!

### Druga okolja

```bash
npm run build
npm start
```

## Licenca

MIT

## Avtorji

Gregorij Apasjan - Univerza v Ljubljani, 2025

