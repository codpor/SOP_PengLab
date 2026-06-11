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

        document.getElementById('page-num').textContent = num;
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
    document.getElementById('page-count').textContent = pdfDoc.numPages;

    let targetPage = getPageFromHash();
    if (targetPage > pdfDoc.numPages) targetPage = pdfDoc.numPages;
    if (targetPage < 1) targetPage = 1;
    
    pageNum = targetPage;
    renderPage(pageNum);
}).catch(err => {
    console.error("Error memuat PDF:", err);
    alert("Gagal memuat PDF. Pastikan nama file sudah sesuai.");
});

// Event Listeners Klik Tombol
document.getElementById('prev-page').addEventListener('click', showPrevPage);
document.getElementById('next-page').addEventListener('click', showNextPage);

// Navigasi Tombol Keyboard (Panah Kiri & Kanan)
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        showPrevPage();
    } else if (event.key === 'ArrowRight') {
        showNextPage();
    }
});

// Event Listener Perubahan URL (Hash)
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

// Penanganan Gambar Logo Error (Jika logo belum diupload)
const logoKampus = document.getElementById('logo-kampus');
if (logoKampus) {
    logoKampus.addEventListener('error', function() {
        this.style.display = 'none'; // Sembunyikan jika gambar gagal dimuat
    });
}
