# program.md — rea loop (fork: getcakedieyoungx/rea, üst proje: morluto/rea)

Karpathy tarzı loop. Her tur tek görev alır; puanlayıcı dondurulmuş check'lerdir; puan
artmıyorsa ya da bir test kırılıyorsa **değişiklik geri alınır**. Auto loop yalnız
"Nasıl çalışılır" bölümünü yeniden yazabilir.

## Bir tur ne yapar

1. `tasks.md`'den **tek** görev alınır.
2. Yeni bir worker (temiz bağlam) yalnız `src/` içinde düzeltme yapar (`tests/evaluation/loop-locked/` hariç).
3. `checks.sh` puanı ölçer: kilitli check'ler (`tests/evaluation/loop-locked/*.test.ts`) + sabit regresyon alt kümesi.
4. Puan arttıysa ve hiçbir test kırılmadıysa commit; aksi halde `git checkout` ile geri alma.
5. Satır `results.tsv`'ye yazılır; öğrenmeler periyodik olarak GitHub'a (`hermes-loop` dalı) push edilir.

## KİLİTLİ — loop bunlara dokunamaz

- `tests/evaluation/loop-locked/` (kontrollerin kendisi). Kontrolü kolaylaştırmak yasak.
- `harness/checks.sh` (puanlayıcı) ve bu bölüm.
- Worker: yalnız `src/` altını düzenler; `git` komutu çalıştırmaz, commit atmaz, `package.json`
  ve bağımlılıklara dokunmaz, yeni dizin açmaz (hariç `src/` içinde gereken dosya).

Kurallar **git ile** uygulanır: tur bitiminde `git status --porcelain` ile `src/` dışına çıkılmadığı
doğrulanır; ihlal varsa tur `INVALID` yazılır ve her şey geri alınır.

## Puan

`checks.sh` tek satır basar: `PASSED=<n> FAILED=<n> SKIPPED=<n> ERRORS=<n>`

- **Puan = PASSED.**
- Tur **keep** edilir ⇔ `PASSED` arttı **ve** yeni kırılan test yok (FAILED adları kümesi büyümedi)
  **ve** `ERRORS` artmadı. Kuyruktaki başka bir görevin check'i kırmızı olabilir; engelleyen yenidir.
- Aynı puan → revert. Test düşüren "kazanç" → revert.

## Görev kaynağı

Görevler `tasks.md`'de, her biri **önce yazılmış ve kilitlenmiş** kırmızı bir check ile gelir
(`nexttask.sh` üretir, makine doğrular: check baseline'da kırmızı olmalı, yoksa görev atılır).
Ters sıra yasak: önce özellik yazıp sonra test yazmak, loop'a kendi kodunu yargılatmak demektir.

## Ortam gerçekleri (bunlar değişmediği sürece geçerli)

- Çalışma alanı **RAM diskte** (`/dev/shm/rea-loop`): bu VM'in ext4'ü senkron yazmada 774 kB/s,
  RAM disk 54 MB/s. Reboot'ta workspace silinir; `bootstrap.sh` yeniden kurar.
- Makine yüklü (xmrig + node'lar). Loop **yalnız load düşükken** ve `nice 19` ile koşar;
  test koşusu bu yüzden dakikalar sürebilir. Bu beklenen davranış, hata değil.
- `husky` pre-commit kancaları kapalıdır (`core.hooksPath=/dev/null`): lint-staged'in worker'ın
  dosyalarını commit anında kendiliğinden düzeltmesi ölçümü bozar.
- `third_party/` boş submodule dizinleri git durumundan hariç tutulur.

## Nasıl çalışılır (auto loop burayı günceller)

- Değişikliği en dar yere yap. Kilitli check'i yeşile getirmek için gereken en küçük davranış değişikliği.
- Kilitli check'leri okumak/çalıştırmak serbest; **değiştirmek yasak**.
- Bitirirken kendi check'ini ve regresyon alt kümesini çalıştır; yeni kırık test bırakma.
- Kodun üslubuna uy: TypeScript, mevcut isimlendirme, yeni bağımlılık yok.
- Yapamıyorsan "başaramadım" de; uydurma sonuç yazma.
