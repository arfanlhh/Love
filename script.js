/* SCRIPT.JS
   Logika utama untuk website "Open When..."
   Author: [Nama Kamu]
*/

// ======================================================
// 1. CONFIGURATION (Atur di sini)
// ======================================================

// Password (format string biar 0 di depan tidak hilang)
const PASS_CODE = "231223"; // Ganti dengan tanggal jadian (DDMMYY)

// Kecepatan mengetik (dalam milidetik)
const TYPE_SPEED = 40; 

// Database Pesan
// Tips: Gunakan \n untuk enter/baris baru
const messages = {
    miss: {
        title: "I Miss You Too ❤️",
        text: "Hai sayang...\nKalau kamu buka ini, berarti rasa kangen itu lagi dateng ya?\n\nJujur, aku juga kangen banget sama kamu. Rasanya pengen langsung teleport ke sana.\n\nInget ya, jarak ini cuma sementara. Hati kita tetep deket kok. Peluk jauh! 🤗",
        image: "assets/foto-kangen.JPG" // Pastikan file ada di folder
    },
    sleep: {
        title: "Can't Sleep? 🌙",
        text: "Sstt... Tarik napas panjang...\nHembuskan pelan-pelan.\n\nMungkin hari ini berat, atau pikiran kamu lagi berisik. Itu wajar kok.\n\nSekarang waktunya istirahat. Dunia bisa nunggu sampai besok. Good night, sleep tight. Mimpiin aku ya.",
        image: "assets/ga-tidur.jpg" // Kosongkan jika tidak mau pakai foto
    },
    insecure: {
        title: "Hey, Look at Me",
        text: "Jangan dengerin pikiran kamu sendiri kalau lagi bilang kamu kurang. Kadang pikiran suka bohong, apalagi pas kamu lagi capek..\n\nCoba kamu liat foto kamu itu cantik bangetttt, aku lihat kamu sebagai orang yang luar biasa. Kamu cantik banget sayang, kamu pinter, dan kamu punya cara sendiri buat bikin aku nyaman. Jujur aja, aku ngerasa beruntung banget bisa punya kamu. Jadi jangan terlalu nyakitin diri kamu sendiri dengan pikiran-pikiran itu ya.",
        image: "assets/ins.jpeg"
    },
    sad: {
        title: "It's Okay Not To Be Okay",
        text: "Nangis aja sayang kalo mau nangis. Nggak perlu ditahan.\n\nAku di sini buat dengerin keluh kesah kamu. Kamu nggak sendirian ngejalanin ini semua.\n\nHabis hujan pasti ada pelangi. Habis sedih, senyum kamu pasti balik lagi. Aku sayang kamu.",
        image: "assets/sedih.jpg"
    },
    
};

// ======================================================
// 2. DOM ELEMENTS
// ======================================================
const menuPage = document.getElementById('menu-page');
const messagePage = document.getElementById('message-page');
const msgTitle = document.getElementById('msg-title');
const msgText = document.getElementById('msg-text');
const msgImage = document.getElementById('msg-image');
const audio = document.getElementById('bg-music');
const backBtn = document.querySelector('.btn-back');

// Variabel untuk menyimpan timeout mengetik (biar bisa di-stop kalau di-back)
let typingTimeout; 

// ======================================================
// 3. LOGIN SYSTEM (UPDATED)
// ======================================================
const loginPage = document.getElementById('login-page');
const loginBtn = document.getElementById('btn-login');
const passInput = document.getElementById('pass-input');
const errorMsg = document.getElementById('error-msg');

// Fungsi Cek Password
function checkPassword() {
    const userPass = passInput.value;

    if (userPass === PASS_CODE) {
        // Jika Benar:
        
        // 1. Play Music (Langsung nyala karena ada interaksi klik)
        playMusic();
        
        // 2. Animasi transisi
        loginPage.style.opacity = 0;
        
        setTimeout(() => {
            loginPage.classList.add('hidden');
            menuPage.classList.remove('hidden');
            // Sedikit animasi fade in untuk menu
            menuPage.style.opacity = 0;
            setTimeout(() => {
                 menuPage.style.opacity = 1;
            }, 50);
        }, 500); // Tunggu 0.5 detik biar smooth

    } else {
        // Jika Salah:
        
        // 1. Munculkan pesan error
        errorMsg.classList.remove('hidden');
        
        // 2. Tambahkan animasi getar (shake)
        loginPage.classList.add('shake');
        
        // 3. Hapus class shake setelah animasi selesai biar bisa gerak lagi kalau salah lagi
        setTimeout(() => {
            loginPage.classList.remove('shake');
        }, 500);
        
        // 4. Kosongkan input
        passInput.value = "";
        passInput.focus();
    }
}

// Event Listener Tombol Login
loginBtn.addEventListener('click', checkPassword);

// Event Listener tombol Enter (biar gak perlu klik tombol)
passInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

// ======================================================
// 4. CORE FUNCTIONS
// ======================================================

// Fungsi Efek Mengetik (Typewriter)
function typeWriter(text, element) {
    element.innerHTML = ""; // Reset teks
    let i = 0;

    function type() {
        if (i < text.length) {
            // Cek jika karakter adalah \n (baris baru)
            if (text.charAt(i) === "\n") {
                element.innerHTML += "<br>";
            } else {
                element.innerHTML += text.charAt(i);
            }
            i++;
            // Simpan timeout ID biar bisa dicancel
            typingTimeout = setTimeout(type, TYPE_SPEED);
        }
    }
    
    // Mulai mengetik
    type();
}

// Fungsi Play Music (Safe Mode)
function playMusic() {
    if (audio.paused) {

        if(audio.currentTime < 1){
            audio.currentTime = 36;
        }

        audio.volume = 0.3; // Volume 30% biar gak kaget
        audio.play().catch(error => {
            console.log("Autoplay dicegah browser, menunggu interaksi user.");
        });
    }
}

// ======================================================
// 5. EVENT LISTENERS
// ======================================================

// Logic Tombol Pesan
document.querySelectorAll('.btn-open').forEach(button => {
    button.addEventListener('click', () => {
        const key = button.getAttribute('data-id');
        const data = messages[key];

        // 1. Play Music (jika belum nyala)
        playMusic();

        // 2. Set Judul
        msgTitle.innerText = data.title;

        // 3. Set Gambar (Cek ada atau tidak)
        if (data.image) {
            msgImage.src = data.image;
            msgImage.classList.remove('hidden');
        } else {
            msgImage.classList.add('hidden');
        }

        // 4. Reset & Jalankan Typewriter
        clearTimeout(typingTimeout); // Hentikan ketikan sebelumnya jika ada
        typeWriter(data.text, msgText);

        // 5. Transisi Halaman
        menuPage.classList.add('hidden');
        messagePage.classList.remove('hidden');
    });
});

// Logic Tombol Kembali
backBtn.addEventListener('click', () => {
    // Stop efek mengetik jika user buru-buru kembali
    clearTimeout(typingTimeout);
    
    // Ganti Halaman
    messagePage.classList.add('hidden');
    menuPage.classList.remove('hidden');
});