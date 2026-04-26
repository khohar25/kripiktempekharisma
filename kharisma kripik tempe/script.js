// ==========================================================================
// PENGATURAN UTAMA
// ==========================================================================
const waNumber = "6281234567890"; // Ganti dengan nomor WA UMKM
let dataKatalog = null; 

async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        dataKatalog = await response.json();
        renderKatalogEceran(dataKatalog.UkuranKemasan);
        renderKalkulatorDinamis(dataKatalog);
    } catch (error) {
        console.error('Gagal memuat data:', error);
    }
}

function renderKatalogEceran(dataKemasan) {
    const container = document.getElementById('pricing-container');
    if (!container) return;
    
    let htmlOutput = `
        <div class="bg-white rounded-3xl shadow-lg border border-amber-100 overflow-hidden max-w-3xl mx-auto">
            <div class="bg-amber-600 text-white text-center py-4">
                <h4 class="text-xl font-bold tracking-wide">Daftar Harga Satuan</h4>
            </div>
            <div class="p-6 md:p-8">
                <ul class="space-y-4">
    `;

    dataKemasan.forEach(item => {
        let infoPromo = item.weight === "30g" ? `<span class="block text-sm text-green-600 font-bold mt-1">🔥 Promo: Beli 3 Rp 5.000</span>` : `<span class="block text-xs text-blue-600 font-medium mt-1">✨ Bonus: Beli 50 Gratis 1</span>`;
        
        htmlOutput += `
            <li class="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div>
                    <span class="font-bold text-gray-800 text-xl block">${item.weight}</span>
                    ${infoPromo}
                </div>
                <div class="font-black text-amber-700 text-2xl">${item.formatted_price}</div>
            </li>
        `;
    });

    htmlOutput += `</ul></div></div>`;
    container.innerHTML = htmlOutput;
}

function renderKalkulatorDinamis(data) {
    const container = document.getElementById('bundling-container');
    if (!container) return; 

    let optionsTujuan = data.TujuanPesanan.map(tujuan => `<option value="${tujuan}">${tujuan}</option>`).join('');
    let optionsKemasan = data.UkuranKemasan.map((kemasan, index) => `<option value="${index}">${kemasan.weight} - ${kemasan.formatted_price}</option>`).join('');
    let optionsRasa = data.VarianRasa.map(rasa => `<option value="${rasa}">${rasa}</option>`).join('');
    
    container.innerHTML = `
        <div class="bg-white p-6 md:p-8 rounded-3xl shadow-xl border-t-4 border-amber-500 max-w-3xl mx-auto mt-12">
            <h4 class="text-2xl font-bold text-amber-800 mb-6 text-center">📦 Kalkulator Pesanan Custom</h4>
            
            <div class="space-y-5">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div class="md:col-span-2">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Tujuan Pesanan</label>
                        <select id="calc-tujuan" class="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-amber-500 outline-none transition font-medium">${optionsTujuan}</select>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Ukuran Kemasan</label>
                        <select id="calc-kemasan" class="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-amber-500 outline-none transition font-medium bg-amber-50">${optionsKemasan}</select>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Varian Rasa</label>
                        <select id="calc-rasa" class="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-amber-500 outline-none transition font-medium">${optionsRasa}</select>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Jumlah Pesanan</label>
                        <input type="number" id="calc-qty" class="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-amber-500 outline-none transition font-bold" value="10" min="1">
                        <p id="info-bonus" class="text-xs text-blue-600 font-bold mt-2 hidden">🎁 Bonus: +1 bungkus (Gratis)</p>
                        <p id="info-promo" class="text-xs text-green-600 font-bold mt-2 hidden">🎉 Promo: Kelipatan 3 = Rp 5.000</p>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Jadwal Pengambilan / Ke Toko</label>
                        <input type="datetime-local" id="calc-jadwal" class="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-amber-500 outline-none transition text-sm">
                    </div>
                </div>
                
                <div class="bg-amber-50 rounded-2xl p-5 mt-8 border border-amber-200">
                    <div class="flex flex-col sm:flex-row justify-between items-center gap-6 mb-6">
                        <div class="text-center sm:text-left">
                            <p class="text-xs text-amber-700 font-bold uppercase mb-1">Total Harga</p>
                            <p id="calc-total-harga" class="text-4xl font-black text-amber-600 tracking-tight">Rp 0</p>
                        </div>
                        <button id="btn-pesan-paket" class="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg flex items-center justify-center gap-2">
                            <span>💬</span> Kirim Pesanan ke WA
                        </button>
                    </div>
                    <div id="alert-mitra" class="hidden bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                        <p class="text-sm text-red-700 font-medium"><span class="font-bold">INFO MITRA:</span> Transaksi pertama wajib dilakukan langsung di tempat produksi.</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    const elements = {
        tujuan: document.getElementById('calc-tujuan'),
        kemasan: document.getElementById('calc-kemasan'),
        rasa: document.getElementById('calc-rasa'),
        qty: document.getElementById('calc-qty'),
        jadwal: document.getElementById('calc-jadwal'),
        total: document.getElementById('calc-total-harga'),
        bonus: document.getElementById('info-bonus'),
        promo: document.getElementById('info-promo'),
        alert: document.getElementById('alert-mitra'),
        btn: document.getElementById('btn-pesan-paket')
    };

    const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

    function hitungTotal() {
        const item = data.UkuranKemasan[elements.kemasan.value];
        let qty = parseInt(elements.qty.value) || 0;
        let total = 0;
        let bonusQty = 0;

        // Logika 1: Promo 30g (3 for 5k)
        if (item.weight === "30g" && qty >= 3) {
            total = (Math.floor(qty / 3) * 5000) + ((qty % 3) * 2000);
            elements.promo.classList.remove('hidden');
            elements.bonus.classList.add('hidden');
        } 
        // Logika 2: Bonus 50 gratis 1 (Kecuali 30g)
        else {
            total = qty * item.price;
            elements.promo.classList.add('hidden');
            if (item.weight !== "30g" && qty >= 50) {
                bonusQty = Math.floor(qty / 50);
                elements.bonus.innerText = `🎁 Bonus: +${bonusQty} bungkus gratis!`;
                elements.bonus.classList.remove('hidden');
            } else {
                elements.bonus.classList.add('hidden');
            }
        }

        elements.total.innerText = formatRupiah(total);
        elements.alert.classList.toggle('hidden', !(elements.tujuan.value.includes("Mitra") || elements.tujuan.value.includes("Warung")));
    }

    [elements.tujuan, elements.kemasan, elements.qty].forEach(el => el.addEventListener('change', hitungTotal));
    elements.qty.addEventListener('input', hitungTotal);

    elements.btn.addEventListener('click', () => {
        if (!elements.jadwal.value) {
            alert("Harap pilih jadwal pengambilan terlebih dahulu!");
            return;
        }

        const item = data.UkuranKemasan[elements.kemasan.value];
        const qty = parseInt(elements.qty.value);
        const bonus = (item.weight !== "30g" && qty >= 50) ? Math.floor(qty / 50) : 0;
        const totalQty = bonus > 0 ? `${qty} + ${bonus} Bonus` : qty;
        
        // Format Waktu Indonesia
        const opsiWaktu = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const jadwalInput = new Date(elements.jadwal.value).toLocaleDateString('id-ID', opsiWaktu);

        const pesan = `Halo Admin Kripik Tempe Kharisma,\n` +
                      `Saya ingin memesan dengan detail berikut:\n\n` +
                      `💵 *Harga Satuan*: ${item.formatted_price}\n` +
                      `🌶️ *Varian Rasa*: ${elements.rasa.value}\n` +
                      `🔢 *Jumlah*: ${totalQty} bungkus\n` +
                      `📌 *Tujuan*: ${elements.tujuan.value}\n` +
                      `💰 *Total Harga*: ${elements.total.innerText}\n` +
                      `🕒 *Jadwal Pengambilan*: ${jadwalInput}\n\n` +
                      `Mohon dikonfirmasi pesanannya. Terima kasih.`;

        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(pesan)}`, '_blank');
    });

    hitungTotal();
}

document.addEventListener('DOMContentLoaded', loadData);