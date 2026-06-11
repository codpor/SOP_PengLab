// PENTING: File PDF Sumber Anda
const url = 'Dokumen_SOP.pdf'; 

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;

const canvas = document.getElementById('pdf-render'),
      ctx = canvas.getContext('2d');

// Fungsi Render PDF
const renderPage = num => {
    pageIsRendering = true;
    pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx = { canvasContext: ctx, viewport: viewport };

        page.render(renderCtx).promise.then(() => {
            pageIsRendering = false;
            if (pageNumIsPending !== null) {
                renderPage(pageNumIsPending);
                pageNumIsPending = null;
            }
        });

        // Update indikator halaman di Desktop
        const pageNumEl = document.getElementById('page-num');
        if(pageNumEl) pageNumEl.textContent = num;

        // Update indikator halaman di Mobile
        const pageNumMobileEl = document.getElementById('page-num-mobile');
        if(pageNumMobileEl) pageNumMobileEl.textContent = num;
    });
};

const queueRenderPage = num => {
    if (pageIsRendering) {
        pageNumIsPending = num;
    } else {
        renderPage(num);
    }
};

// Ambil data halaman dari URL (hash)
const getPageFromHash = () => {
    const hash = window.location.hash;
    const match = hash.match(/page=(\d+)/);
    if (match) return parseInt(match[1], 10);
    return 1;
};

// Navigasi
const showPrevPage = () => {
    if (pageNum <= 1) return;
    window.location.hash = `page=${pageNum - 1}`; 
};

const showNextPage = () => {
    if (pageNum >= pdfDoc.numPages) return;
    window.location.hash = `page=${pageNum + 1}`; 
};

// Pemuatan Dokumen Pertama
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    
    // Update jumlah total halaman di Desktop
    const pageCountEl = document.getElementById('page-count');
    if(pageCountEl) pageCountEl.textContent = pdfDoc.numPages;

    // Update jumlah total halaman di Mobile
    const pageCountMobileEl = document.getElementById('page-count-mobile');
    if(pageCountMobileEl) pageCountMobileEl.textContent = pdfDoc.numPages;

    let targetPage = getPageFromHash();
    if (targetPage > pdfDoc.numPages) targetPage = pdfDoc.numPages;
    if (targetPage < 1) targetPage = 1;
    
    pageNum = targetPage;
    renderPage(pageNum);
}).catch(err => {
    console.error("Error memuat PDF:", err);
    alert("Gagal memuat PDF. Pastikan nama file sudah sesuai.");
});


// =============================================
//      EVENT LISTENERS (Desktop & Mobile)
// =============================================

// --- Tombol Desktop ---
const prevBtn = document.getElementById('prev-page');
if(prevBtn) prevBtn.addEventListener('click', showPrevPage);

const nextBtn = document.getElementById('next-page');
if(nextBtn) nextBtn.addEventListener('click', showNextPage);


// --- Tombol Mobile ---
const prevBtnMobile = document.getElementById('prev-page-mobile');
if(prevBtnMobile) prevBtnMobile.addEventListener('click', showPrevPage);

const nextBtnMobile = document.getElementById('next-page-mobile');
if(nextBtnMobile) nextBtnMobile.addEventListener('click', showNextPage);


// --- LOGIKA MENU PONSEL (Hamburger) ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileCloseBtn = document.getElementById('mobile-close-btn');
const mainSidebar = document.getElementById('main-sidebar');

if(mobileMenuBtn && mobileCloseBtn && mainSidebar) {
    // Buka Sidebar
    mobileMenuBtn.addEventListener('click', () => {
        mainSidebar.classList.add('open');
    });

    // Tutup Sidebar
    mobileCloseBtn.addEventListener('click', () => {
        mainSidebar.classList.remove('remove');
    });

    // Opsional: Tutup sidebar jika user klik di luar sidebar
    document.addEventListener('click', (event) => {
        const isClickInsideMenu = mobileMenuBtn.contains(event.target);
        const isClickInsideSidebar = mainSidebar.contains(event.target);

        if (!isClickInsideSidebar && !isClickInsideMenu && mainSidebar.classList.contains('open')) {
            mainSidebar.classList.remove('open');
        }
    });
}


// --- Tombol Keyboard ---
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        showPrevPage();
    } else if (event.key === 'ArrowRight') {
        showNextPage();
    }
});

// --- Hash URL ---
window.addEventListener('hashchange', () => {
    if (!pdfDoc) return; 
    
    let newPage = getPageFromHash();
    
    if (newPage > pdfDoc.numPages) newPage = pdfDoc.numPages;
    if (newPage < 1) newPage = 1;

    if (newPage !== pageNum) {
        pageNum = newPage;
        queueRenderPage(pageNum);
    }
});

// Penanganan Gambar Foto Profil Error (Placeholder)
const fotoProfil = document.getElementById('foto-profil');
if (fotoProfil) {
    fotoProfil.addEventListener('error', function() {
        // Ganti src ke placeholder atau bulatan kosong jika foto belum ada
        this.src = 'https://via.placeholder.com/100?text=AFM';
    });
}
