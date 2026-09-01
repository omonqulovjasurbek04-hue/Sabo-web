# ☁️ SABO'ni Oracle Cloud Always Free'ga Qo'yish (1 yil emas — MUDDATSIZ bepul)

Bu variant frontend + backend + PostgreSQL + Redis'ni **bitta virtual serverda**, **hech qachon uxlamaydigan**, **muddatsiz bepul** tarzda ishlatadi. Render/Vercel variantidan farqi: bu yerda siz serverni o'zingiz boshqarasiz (Docker orqali), sleep/cold-start muammosi yo'q.

**Nega bu eng kuchli bepul variant:**
- Oracle "Always Free" resurslari trial emas — hisobingiz doim faol turguncha muddatsiz bepul qoladi.
- Ampere A1 (ARM) shaklida jami **4 OCPU + 24 GB RAM + 200 GB disk** bepul beriladi — bitta VM ichida frontend, backend, Postgres, Redis hammasi bemalol sig'adi.
- Server hech qachon uxlamaydi, 24/7 tayyor turadi.

**Halol ogohlantirishlar:**
- Ro'yxatdan o'tishda Oracle **kredit/debit karta so'raydi** (identifikatsiya uchun, pul yechilmaydi, lekin karta shart).
- Ba'zi hududlarda bepul Ampere VM yaratishda **"Out of host capacity"** xatosi chiqishi mumkin (Oracle serverlari band bo'lganda) — bu holatda boshqa "Availability Domain" yoki bir necha soatdan keyin qayta urinish kifoya qiladi, karta hech narsa uchun yozilmaydi.
- Bu yo'lda **siz serverni o'zingiz yangilab, xavfsizligini kuzatib turishingiz** kerak (mendan kod/config tomonini to'liq tayyorlab beraman, lekin server = sizning mas'uliyatingiz).

---

## 0-QADAM: Domen (bepul)

SSL sertifikat (https) uchun haqiqiy domen kerak. Bepul variant — [duckdns.org](https://www.duckdns.org):
1. GitHub akkountingiz bilan kiring.
2. O'zingizga subdomain tanlang, masalan `sabo` → natija: `sabo.duckdns.org`.
3. Hozircha "IP" maydonini bo'sh qoldiring — 2-qadomdan keyin VM'ning haqiqiy IP manzilini shu yerga kiritasiz.

---

## 1-QADAM: Oracle Cloud hisobi va VM yaratish

1. [oracle.com/cloud/free](https://www.oracle.com/cloud/free/) → **"Start for free"**. Ro'yxatdan o'ting (email, telefon, karta ma'lumotlari — tekshiruv uchun, pullik xizmatga o'tmaguningizcha hech narsa yechilmaydi).
2. Kirgandan so'ng, yuqori qidiruvdan **"Instances"** ni toping → **"Create Instance"**.
3. Sozlamalar:
   - **Name:** `sabo-server`
   - **Image:** Ubuntu → **24.04**
   - **Shape:** "Change shape" → **Ampere** → `VM.Standard.A1.Flex` tanlang → OCPU: **2-4**, Memory: **12-24 GB** (bepul limit ichida qoldiring: jami 4 OCPU / 24GB gacha)
   - **Add SSH keys:** "Generate a key pair for me" tanlang va **"Save private key"** tugmasini bosib, faylni kompyuteringizga saqlang (masalan `sabo-key.pem`) — bu SSH orqali serverga kirish uchun kerak.
4. **"Create"** ni bosing. VM 1-2 daqiqada tayyor bo'ladi. Tayyor bo'lgach, **"Public IP Address"** ni ko'rasiz — buni saqlab qo'ying.

### Portlarni ochish (Security List)
1. VM sahifasida **"Virtual cloud network"** havolasini bosing → **"Security Lists"** → default list'ni oching.
2. **"Add Ingress Rules"** — ikkita qoida qo'shing:
   - Source CIDR `0.0.0.0/0`, IP Protocol `TCP`, Destination Port `80`
   - Source CIDR `0.0.0.0/0`, IP Protocol `TCP`, Destination Port `443`
3. Saqlang.

### Domenni IP'ga bog'lash
DuckDNS sahifasiga qayting, `sabo` subdomain qatorida **IP** maydoniga VM'ning Public IP manzilini kiriting va **"update ip"** bosing.

---

## 2-QADAM: Serverga ulanish va avtomatik sozlash

Windows'da PowerShell yoki Git Bash orqali (`.pem` faylni saqlagan papkangizdan):

```bash
ssh -i sabo-key.pem ubuntu@<VM_PUBLIC_IP>
```

Ulangach, tayyorlab qo'yilgan skriptni ishga tushiring — bu Docker o'rnatadi, kodni yuklaydi va portlarni ochadi:

```bash
curl -fsSL https://raw.githubusercontent.com/omonqulovjasurbek04-hue/Sabo-web/main/oracle-bootstrap.sh | bash
```

Skript birinchi marta ishga tushganda `.env.production` faylini namuna asosida yaratadi va to'xtaydi — buni tahrirlashingiz kerak:

```bash
nano ~/Sabo-web/.env.production
```

Kamida shuni o'zgartiring:
- `DOMAIN=sabo.duckdns.org` → o'zingizning haqiqiy domeningizga
- Barcha parol/secret qatorlarni xohlasangiz o'zingiznikiga almashtiring (tayyor qiymatlar allaqachon xavfsiz generatsiya qilingan, ishlataversangiz ham bo'ladi)

Saqlang (`Ctrl+O`, `Enter`, `Ctrl+X`), so'ng qaytadan ishga tushiring:

```bash
cd ~/Sabo-web && bash oracle-bootstrap.sh
```

Bu safar Docker rasmlarni build qilib (birinchi marta 5-10 daqiqa cho'zilishi mumkin), backend, frontend, Postgres, Redis va Caddy (avtomatik SSL) konteynerlarini ishga tushiradi.

---

## 3-QADAM: Tekshirish

| Nima | Manzil |
|---|---|
| Sayt | `https://sabo.duckdns.org` |
| Admin panel | `https://sabo.duckdns.org/uz/admin` |
| Backend health | `https://sabo.duckdns.org/api/v1/health` |
| Swagger docs | `https://sabo.duckdns.org/docs` |

Holatni tekshirish:
```bash
sudo docker compose -f ~/Sabo-web/docker-compose.prod.yml ps
sudo docker compose -f ~/Sabo-web/docker-compose.prod.yml logs -f backend
```

---

## Yangilash (kod o'zgarganda)

```bash
cd ~/Sabo-web
git pull
sudo docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

---

## Muammolar

- **"Out of host capacity" VM yaratishda** → boshqa Availability Domain tanlang yoki bir necha soat/kundan keyin qayta urinib ko'ring; bu Oracle tomonidagi vaqtinchalik cheklov, hisobingizga aloqasi yo'q.
- **Sayt ochilmayapti, lekin konteynerlar ishlayapti** → Security List'da 80/443 ochilganini va DuckDNS IP to'g'ri yangilanganini tekshiring; VM ichida `sudo iptables -L -n` orqali portlar ACCEPT holatida ekanini tekshiring.
- **SSL sertifikat chiqmayapti** → Caddy avtomatik Let's Encrypt oladi, lekin domen VM IP'siga to'g'ri yo'naltirilgan bo'lishi shart; `sudo docker compose -f docker-compose.prod.yml logs caddy` orqali xatoni ko'ring.
- **`docker compose up` xato bersa** → xato matnini menga yuboring, birga tuzataman (bu konfiguratsiyalar Docker mavjud bo'lmagan muhitda tayyorlangani uchun jonli serverda birinchi marta ishga tushishda kichik tuzatish kerak bo'lishi mumkin).
